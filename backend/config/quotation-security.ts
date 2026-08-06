import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams) => ({
  rateLimit: {
    max: env.int('QUOTATION_RATE_LIMIT_MAX', 5),
    windowMs: env.int('QUOTATION_RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
  },
  maxBodyBytes: env.int('QUOTATION_MAX_BODY_BYTES', 100 * 1024),
  honeypotField: env('QUOTATION_HONEYPOT_FIELD', 'website'),
  turnstile: {
    enabled: env.bool('TURNSTILE_ENABLED', false),
    secretKey: env('TURNSTILE_SECRET_KEY'),
    expectedHostname: env('TURNSTILE_EXPECTED_HOSTNAME'),
    expectedAction: env('TURNSTILE_EXPECTED_ACTION', 'quotation_submit'),
    timeoutMs: env.int('TURNSTILE_VERIFY_TIMEOUT_MS', 5000),
  },
});

export default config;
