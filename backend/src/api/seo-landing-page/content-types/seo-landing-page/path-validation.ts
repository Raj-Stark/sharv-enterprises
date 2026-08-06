import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const SEO_LANDING_PAGE_UID =
  'api::seo-landing-page.seo-landing-page' as const;
const PATH_PATTERN = /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
const RESERVED_PREFIXES = [
  '/admin',
  '/api',
  '/_next',
  '/uploads',
  '/products',
  '/applications',
  '/blogs',
  '/quote',
];

const { ValidationError } = errors;

function validateLandingPath(value: unknown): asserts value is string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new ValidationError('path must be a non-empty internal path.');
  }

  if (!PATH_PATTERN.test(value)) {
    throw new ValidationError(
      'path must be lowercase, start with /, and use clean kebab-case segments without a trailing slash, query, or hash.',
    );
  }

  if (
    RESERVED_PREFIXES.some(
      (prefix) => value === prefix || value.startsWith(`${prefix}/`),
    )
  ) {
    throw new ValidationError('path uses a reserved application path.');
  }
}

export function registerSeoLandingPathValidation(strapi: Core.Strapi): void {
  strapi.documents.use(async (context, next) => {
    if (
      context.uid !== SEO_LANDING_PAGE_UID ||
      (context.action !== 'create' && context.action !== 'update')
    ) {
      return next();
    }

    const params = context.params as {
      data?: Record<string, unknown>;
    };

    if (params.data && 'path' in params.data) {
      validateLandingPath(params.data.path);
    }

    return next();
  });
}
