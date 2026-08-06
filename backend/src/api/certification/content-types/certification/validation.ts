import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const CERTIFICATION_UID = 'api::certification.certification' as const;
const { ValidationError } = errors;

type CertificationData = {
  type?: unknown;
  standardCode?: unknown;
  certificateNumber?: unknown;
  validFrom?: unknown;
  validUntil?: unknown;
  verificationUrl?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateDateOrder(validFrom: unknown, validUntil: unknown): void {
  if (!validFrom || !validUntil) {
    return;
  }

  if (
    typeof validFrom !== 'string' ||
    typeof validUntil !== 'string' ||
    validFrom > validUntil
  ) {
    throw new ValidationError('validUntil cannot be earlier than validFrom.');
  }
}

function validateVerificationUrl(value: unknown): void {
  if (value === undefined || value === null || value === '') {
    return;
  }

  if (typeof value !== 'string') {
    throw new ValidationError('verificationUrl must be a valid HTTP or HTTPS URL.');
  }

  try {
    const url = new URL(value);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('Unsupported protocol');
    }
  } catch {
    throw new ValidationError('verificationUrl must be a valid HTTP or HTTPS URL.');
  }
}

export function registerCertificationValidation(strapi: Core.Strapi): void {
  strapi.documents.use(async (context, next) => {
    if (
      context.uid !== CERTIFICATION_UID ||
      (context.action !== 'create' && context.action !== 'update')
    ) {
      return next();
    }

    const params = context.params as {
      data?: CertificationData;
      documentId?: string;
    };

    if (!params.data) {
      return next();
    }

    const current = params.documentId
      ? await strapi.documents(CERTIFICATION_UID).findOne({
          documentId: params.documentId,
          fields: [
            'type',
            'standardCode',
            'certificateNumber',
            'validFrom',
            'validUntil',
            'verificationUrl',
          ],
        })
      : null;
    const type = params.data.type ?? current?.type;
    const standardCode = params.data.standardCode ?? current?.standardCode;
    const certificateNumber =
      params.data.certificateNumber ?? current?.certificateNumber;
    const validFrom = params.data.validFrom ?? current?.validFrom;
    const validUntil = params.data.validUntil ?? current?.validUntil;
    const verificationUrl =
      params.data.verificationUrl ?? current?.verificationUrl;

    if (type === 'standard' && !isNonEmptyString(standardCode)) {
      throw new ValidationError(
        'standardCode is required when certification type is standard.',
      );
    }

    if (type === 'certificate' && !isNonEmptyString(certificateNumber)) {
      throw new ValidationError(
        'certificateNumber is required when certification type is certificate.',
      );
    }

    validateDateOrder(validFrom, validUntil);
    validateVerificationUrl(verificationUrl);

    return next();
  });
}
