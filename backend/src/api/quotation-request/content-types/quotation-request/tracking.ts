import type { Core } from '@strapi/strapi';

const QUOTATION_REQUEST_UID =
  'api::quotation-request.quotation-request' as const;

export function registerQuotationWhatsappTracking(strapi: Core.Strapi): void {
  strapi.documents.use(async (context, next) => {
    if (
      context.uid !== QUOTATION_REQUEST_UID ||
      (context.action !== 'create' && context.action !== 'update')
    ) {
      return next();
    }

    const params = context.params as {
      data?: Record<string, unknown>;
    };

    if (params.data?.whatsappStatus === 'received') {
      params.data.whatsappReceivedAt ??= new Date().toISOString();
    }

    if (params.data?.whatsappStatus === 'initiated') {
      params.data.whatsappReceivedAt = null;
    }

    return next();
  });
}
