import type { Core } from '@strapi/strapi';

const PUBLIC_PERMISSION_ALLOWLIST = new Set([
  'api::application.application.find',
  'api::application.application.findOne',
  'api::blog-author.blog-author.find',
  'api::blog-author.blog-author.findOne',
  'api::blog-category.blog-category.find',
  'api::blog-category.blog-category.findOne',
  'api::blog-post.blog-post.find',
  'api::blog-post.blog-post.findOne',
  'api::blog-tag.blog-tag.find',
  'api::blog-tag.blog-tag.findOne',
  'api::certification.certification.find',
  'api::certification.certification.findOne',
  'api::home-page.home-page.find',
  'api::product-category.product-category.find',
  'api::product-category.product-category.findOne',
  'api::product.product.find',
  'api::product.product.findOne',
  'api::quotation-request.quotation-request.create',
  'api::seo-landing-page.seo-landing-page.find',
  'api::seo-landing-page.seo-landing-page.findOne',
  'api::site-setting.site-setting.find',
  'api::testimonial.testimonial.find',
]);

const TEST_TURNSTILE_SECRETS = new Set([
  '1x0000000000000000000000000000000AA',
  '2x0000000000000000000000000000000AA',
  '3x0000000000000000000000000000000AA',
]);

type Permission = {
  id: number;
  action: string;
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
    timeoutMs: number;
  };
};

export function validateQuotationSecurityConfig(strapi: Core.Strapi): void {
  const config = strapi.config.get(
    'quotation-security',
  ) as QuotationSecurityConfig;

  if (!Number.isInteger(config.rateLimit.max) || config.rateLimit.max < 1) {
    throw new Error('QUOTATION_RATE_LIMIT_MAX must be a positive integer.');
  }

  if (
    !Number.isInteger(config.rateLimit.windowMs) ||
    config.rateLimit.windowMs < 1000
  ) {
    throw new Error(
      'QUOTATION_RATE_LIMIT_WINDOW_MS must be an integer of at least 1000.',
    );
  }

  if (!Number.isInteger(config.maxBodyBytes) || config.maxBodyBytes < 1024) {
    throw new Error(
      'QUOTATION_MAX_BODY_BYTES must be an integer of at least 1024.',
    );
  }

  if (!config.honeypotField.trim()) {
    throw new Error('QUOTATION_HONEYPOT_FIELD cannot be empty.');
  }

  if (!Number.isInteger(config.turnstile.timeoutMs) || config.turnstile.timeoutMs < 1000) {
    throw new Error(
      'TURNSTILE_VERIFY_TIMEOUT_MS must be an integer of at least 1000.',
    );
  }

  if (!config.turnstile.enabled) {
    return;
  }

  if (!config.turnstile.secretKey) {
    throw new Error(
      'TURNSTILE_SECRET_KEY is required when TURNSTILE_ENABLED is true.',
    );
  }

  if (
    process.env.NODE_ENV === 'production' &&
    TEST_TURNSTILE_SECRETS.has(config.turnstile.secretKey)
  ) {
    throw new Error('Cloudflare Turnstile test secrets cannot be used in production.');
  }

  if (process.env.NODE_ENV === 'production' && !config.turnstile.expectedHostname) {
    throw new Error(
      'TURNSTILE_EXPECTED_HOSTNAME is required when Turnstile is enabled in production.',
    );
  }
}

export async function enforcePublicPermissionAllowlist(
  strapi: Core.Strapi,
): Promise<void> {
  const roleQuery = strapi.db.query(
    'plugin::users-permissions.role',
  ) as unknown as {
    findOne(args: unknown): Promise<{ id: number } | undefined>;
  };
  const permissionQuery = strapi.db.query(
    'plugin::users-permissions.permission',
  ) as unknown as {
    findMany(args: unknown): Promise<Permission[]>;
    delete(args: unknown): Promise<void>;
    create(args: unknown): Promise<Permission>;
  };
  const publicRole = await roleQuery.findOne({
    where: { type: 'public' },
    select: ['id'],
  });

  if (!publicRole) {
    strapi.log.warn('Public role was not found; permission hardening was skipped.');
    return;
  }

  const permissions = await permissionQuery.findMany({
    where: { role: { id: publicRole.id } },
    select: ['id', 'action'],
  });
  const disallowed = permissions.filter(
    (permission) => !PUBLIC_PERMISSION_ALLOWLIST.has(permission.action),
  );

  for (const permission of disallowed) {
    await permissionQuery.delete({ where: { id: permission.id } });
  }

  const existingAllowedActions = new Set(
    permissions
      .filter((permission) => PUBLIC_PERMISSION_ALLOWLIST.has(permission.action))
      .map((permission) => permission.action),
  );
  const missingAllowedActions = [...PUBLIC_PERMISSION_ALLOWLIST].filter(
    (action) => !existingAllowedActions.has(action),
  );

  for (const action of missingAllowedActions) {
    await permissionQuery.create({
      data: {
        action,
        role: publicRole.id,
      },
    });
  }

  if (disallowed.length > 0) {
    strapi.log.info(
      `Removed ${disallowed.length} disallowed Public role permission(s).`,
    );
  }


  if (missingAllowedActions.length > 0) {
    strapi.log.info(
      `Added ${missingAllowedActions.length} required Public role permission(s).`,
    );
  }
}
