import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

import { verifyTurnstileToken } from '../api/quotation-request/turnstile';

const MAX_RATE_LIMIT_BUCKETS = 10_000;

const { PayloadTooLargeError, RateLimitError, ValidationError } = errors;

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type QuotationSecurityConfig = {
  rateLimit: {
    max: number;
    windowMs: number;
  };
  maxBodyBytes: number;
  honeypotField: string;
  turnstile: {
    enabled: boolean;
    secretKey?: string;
    expectedHostname?: string;
    expectedAction?: string;
    timeoutMs: number;
  };
};

type UnknownRecord = Record<string, unknown>;

const rateLimitBuckets = new Map<string, RateLimitBucket>();
let requestsSincePrune = 0;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function pruneExpiredBuckets(now: number): void {
  for (const [key, bucket] of rateLimitBuckets) {
    if (bucket.resetAt <= now) {
      rateLimitBuckets.delete(key);
    }
  }
}

function removeOldestBucket(): void {
  const oldestKey = rateLimitBuckets.keys().next().value;

  if (typeof oldestKey === 'string') {
    rateLimitBuckets.delete(oldestKey);
  }
}

function applyRateLimit(
  ctx: Parameters<Core.MiddlewareHandler>[0],
  config: QuotationSecurityConfig['rateLimit'],
): void {
  const now = Date.now();
  const clientIp = ctx.ip || ctx.request.ip || 'unknown-client';
  const key = `quotation:${clientIp}`;

  requestsSincePrune += 1;

  if (requestsSincePrune >= 100 || rateLimitBuckets.size >= MAX_RATE_LIMIT_BUCKETS) {
    pruneExpiredBuckets(now);
    requestsSincePrune = 0;
  }

  if (rateLimitBuckets.size >= MAX_RATE_LIMIT_BUCKETS && !rateLimitBuckets.has(key)) {
    removeOldestBucket();
  }

  const existing = rateLimitBuckets.get(key);
  const bucket =
    !existing || existing.resetAt <= now
      ? { count: 0, resetAt: now + config.windowMs }
      : existing;

  bucket.count += 1;
  rateLimitBuckets.set(key, bucket);

  const remaining = Math.max(config.max - bucket.count, 0);
  const resetSeconds = Math.max(Math.ceil((bucket.resetAt - now) / 1000), 1);

  ctx.set('RateLimit-Limit', String(config.max));
  ctx.set('RateLimit-Remaining', String(remaining));
  ctx.set('RateLimit-Reset', String(resetSeconds));

  if (bucket.count > config.max) {
    ctx.set('Retry-After', String(resetSeconds));
    throw new RateLimitError();
  }
}

function enforceBodySize(
  body: unknown,
  contentLength: string,
  maxBodyBytes: number,
): void {
  const declaredLength = Number(contentLength);

  if (Number.isFinite(declaredLength) && declaredLength > maxBodyBytes) {
    throw new PayloadTooLargeError('Quotation request body is too large.');
  }

  const serializedBody = body === undefined ? '' : JSON.stringify(body);

  if (Buffer.byteLength(serializedBody, 'utf8') > maxBodyBytes) {
    throw new PayloadTooLargeError('Quotation request body is too large.');
  }
}

function respondWithHttpError(
  ctx: Parameters<Core.MiddlewareHandler>[0],
  status: number,
  name: string,
  message: string,
): void {
  ctx.status = status;
  ctx.body = {
    data: null,
    error: {
      status,
      name,
      message,
      details: {},
    },
  };
}

const quotationSecurity: Core.MiddlewareFactory = (_middlewareConfig, { strapi }) => {
  return async (ctx, next) => {
    const config = strapi.config.get(
      'quotation-security',
    ) as QuotationSecurityConfig;

    applyRateLimit(ctx, config.rateLimit);

    if (!ctx.is('application/json')) {
      respondWithHttpError(
        ctx,
        415,
        'UnsupportedMediaTypeError',
        'Quotation requests require application/json.',
      );
      return;
    }

    const body = ctx.request.body;
    enforceBodySize(body, ctx.get('content-length'), config.maxBodyBytes);

    const data = isRecord(body) && isRecord(body.data) ? body.data : undefined;
    const honeypotValue = data?.[config.honeypotField];

    if (
      honeypotValue !== undefined &&
      honeypotValue !== null &&
      honeypotValue !== ''
    ) {
      throw new ValidationError('Invalid quotation request.');
    }

    const verification = await verifyTurnstileToken(
      data?.captchaToken,
      ctx.ip || ctx.request.ip,
      config.turnstile,
    );

    if (!verification.ok) {
      strapi.log.warn(
        `Quotation security verification failed: ${verification.errorCodes.join(',') || 'unknown'}`,
      );

      if (verification.unavailable) {
        respondWithHttpError(
          ctx,
          503,
          'ServiceUnavailableError',
          'Security verification is temporarily unavailable. Please try again.',
        );
        return;
      }

      throw new ValidationError(
        'Security verification failed. Please refresh and try again.',
      );
    }

    await next();
  };
};

export default quotationSecurity;
