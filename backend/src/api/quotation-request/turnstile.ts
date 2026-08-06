import { randomUUID } from 'node:crypto';

const SITEVERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const MAX_TOKEN_LENGTH = 2048;

type TurnstileConfig = {
  enabled: boolean;
  secretKey?: string;
  expectedHostname?: string;
  expectedAction?: string;
  timeoutMs: number;
};

type TurnstileResponse = {
  success?: boolean;
  hostname?: string;
  action?: string;
  'error-codes'?: string[];
};

export type TurnstileVerification =
  | { ok: true }
  | { ok: false; unavailable: boolean; errorCodes: string[] };

export async function verifyTurnstileToken(
  token: unknown,
  remoteIp: string | undefined,
  config: TurnstileConfig,
): Promise<TurnstileVerification> {
  if (!config.enabled) {
    return { ok: true };
  }

  if (
    typeof token !== 'string' ||
    token.length === 0 ||
    token.length > MAX_TOKEN_LENGTH
  ) {
    return {
      ok: false,
      unavailable: false,
      errorCodes: ['invalid-token-format'],
    };
  }

  if (!config.secretKey) {
    return {
      ok: false,
      unavailable: true,
      errorCodes: ['missing-secret-key'],
    };
  }

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), config.timeoutMs);

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: config.secretKey,
        response: token,
        remoteip: remoteIp,
        idempotency_key: randomUUID(),
      }),
      signal: abortController.signal,
    });

    if (!response.ok) {
      return {
        ok: false,
        unavailable: true,
        errorCodes: [`siteverify-http-${response.status}`],
      };
    }

    const result = (await response.json()) as TurnstileResponse;
    const errorCodes = Array.isArray(result['error-codes'])
      ? result['error-codes']
      : [];

    if (!result.success) {
      return { ok: false, unavailable: false, errorCodes };
    }

    if (
      config.expectedHostname &&
      result.hostname !== config.expectedHostname
    ) {
      return {
        ok: false,
        unavailable: false,
        errorCodes: ['hostname-mismatch'],
      };
    }

    if (config.expectedAction && result.action !== config.expectedAction) {
      return {
        ok: false,
        unavailable: false,
        errorCodes: ['action-mismatch'],
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      unavailable: true,
      errorCodes: ['siteverify-unavailable'],
    };
  } finally {
    clearTimeout(timeout);
  }
}
