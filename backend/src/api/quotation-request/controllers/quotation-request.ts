import { randomBytes } from 'node:crypto';

import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const QUOTATION_REQUEST_UID =
  'api::quotation-request.quotation-request' as const;
const PRODUCT_UID = 'api::product.product' as const;
const SITE_SETTING_UID = 'api::site-setting.site-setting' as const;
const OFFICIAL_WHATSAPP_NUMBER = '+919818836151';
const OFFICIAL_WHATSAPP_DIGITS = '919818836151';
const MAX_ITEMS = 5;
const MAX_WHATSAPP_MESSAGE_LENGTH = 3000;
const PHONE_PATTERN = /^[0-9+() .-]{8,30}$/;
const SUBMISSION_TOKEN_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;
const SOURCE_PATH_PATTERN = /^\/(?!\/)[^?#\s]*$/;
const UNITS = new Set([
  'piece',
  'roll',
  'pack',
  'box',
  'set',
  'meter',
  'kilogram',
] as const);

const { ValidationError } = errors;

type UnknownRecord = Record<string, unknown>;
type QuotationUnit = (typeof UNITS extends Set<infer T> ? T : never);

type QuotationLineItemInput = {
  product?: string;
  productNameSnapshot: string;
  skuSnapshot?: string;
  quantity: number;
  unit: QuotationUnit;
  requirements?: string;
};

type SiteSettingSnapshot = {
  companyName?: string | null;
  defaultInquiryMessage?: string | null;
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredString(
  data: UnknownRecord,
  field: string,
  maxLength: number,
): string {
  const value = data[field];

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ValidationError(`${field} is required.`);
  }

  const normalized = value.trim();

  if (normalized.length > maxLength) {
    throw new ValidationError(`${field} must be at most ${maxLength} characters.`);
  }

  return normalized;
}

function optionalString(
  data: UnknownRecord,
  field: string,
  maxLength: number,
): string | undefined {
  const value = data[field];

  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new ValidationError(`${field} must be a string.`);
  }

  const normalized = value.trim();

  if (normalized.length > maxLength) {
    throw new ValidationError(`${field} must be at most ${maxLength} characters.`);
  }

  return normalized || undefined;
}

function requiredEnum<T extends string>(
  data: UnknownRecord,
  field: string,
  allowed: ReadonlySet<T>,
): T {
  const value = requiredString(data, field, 50);

  if (!allowed.has(value as T)) {
    throw new ValidationError(`${field} has an unsupported value.`);
  }

  return value as T;
}

function normalizeBuyerWhatsappNumber(data: UnknownRecord): string {
  const value = requiredString(data, 'whatsappNumber', 30);

  if (!PHONE_PATTERN.test(value)) {
    throw new ValidationError(
      'whatsappNumber must be a valid international WhatsApp number.',
    );
  }

  const digits = value.replace(/\D/g, '');

  if (digits.length < 8 || digits.length > 15) {
    throw new ValidationError(
      'whatsappNumber must contain 8 to 15 digits including country code.',
    );
  }

  return `+${digits}`;
}

async function generateRequestNumber(strapi: any): Promise<string> {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const suffix = randomBytes(4).toString('hex').toUpperCase();
    const requestNumber = `QR-${date}-${suffix}`;
    const existing = await strapi.documents(QUOTATION_REQUEST_UID).findFirst({
      filters: { requestNumber },
      fields: ['documentId'],
    });

    if (!existing) {
      return requestNumber;
    }
  }

  throw new Error('Could not generate a unique quotation request number.');
}

async function normalizeItems(
  strapi: any,
  value: unknown,
): Promise<QuotationLineItemInput[]> {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ValidationError('At least one quotation item is required.');
  }

  if (value.length > MAX_ITEMS) {
    throw new ValidationError(`A quotation request can contain at most ${MAX_ITEMS} items.`);
  }

  return Promise.all(
    value.map(async (rawItem, index) => {
      if (!isRecord(rawItem)) {
        throw new ValidationError(`items[${index}] must be an object.`);
      }

      const productDocumentId = optionalString(
        rawItem,
        'productDocumentId',
        100,
      );
      let product:
        | { documentId: string; name: string; sku?: string | null }
        | undefined;

      if (productDocumentId) {
        product = await strapi.documents(PRODUCT_UID).findOne({
          documentId: productDocumentId,
          status: 'published',
          fields: ['documentId', 'name', 'sku'],
        });

        if (!product) {
          throw new ValidationError(
            `items[${index}].productDocumentId must reference a published product.`,
          );
        }
      }

      const customProductName = optionalString(rawItem, 'productName', 200);

      if (!product && !customProductName) {
        throw new ValidationError(
          `items[${index}] requires productDocumentId or productName.`,
        );
      }

      const rawQuantity = rawItem.quantity;
      const quantity =
        typeof rawQuantity === 'number' ? rawQuantity : Number(rawQuantity);

      if (!Number.isFinite(quantity) || quantity < 0.001) {
        throw new ValidationError(
          `items[${index}].quantity must be at least 0.001.`,
        );
      }

      return {
        product: product?.documentId,
        productNameSnapshot: product?.name ?? customProductName!,
        skuSnapshot: product?.sku ?? optionalString(rawItem, 'sku', 100),
        quantity,
        unit: requiredEnum(rawItem, 'unit', UNITS),
        requirements: optionalString(rawItem, 'requirements', 600),
      };
    }),
  );
}

function buildWhatsappMessage(
  quotationRequest: any,
  siteSetting?: SiteSettingSnapshot | null,
): string {
  const intro =
    siteSetting?.defaultInquiryMessage?.trim() ||
    `Hello ${siteSetting?.companyName?.trim() || 'Sharv Enterprises'}, I would like to request a quotation.`;
  const lines = [
    intro,
    '',
    `Reference: ${quotationRequest.requestNumber}`,
    `Name: ${quotationRequest.fullName}`,
  ];

  if (quotationRequest.companyName) {
    lines.push(`Company: ${quotationRequest.companyName}`);
  }

  lines.push(
    `Buyer WhatsApp: ${quotationRequest.whatsappNumber}`,
    `Delivery: ${quotationRequest.deliveryDestination}`,
    '',
  );

  const items = Array.isArray(quotationRequest.items)
    ? quotationRequest.items
    : [];

  items.forEach((item: any, index: number) => {
    const prefix = items.length > 1 ? `Item ${index + 1}` : 'Product';
    lines.push(`${prefix}: ${item.productNameSnapshot}`);

    if (item.skuSnapshot) {
      lines.push(`SKU / model: ${item.skuSnapshot}`);
    }

    lines.push(`Quantity: ${item.quantity} ${item.unit}`);

    if (item.requirements) {
      lines.push(`Requirement: ${item.requirements}`);
    }

    if (index < items.length - 1) {
      lines.push('');
    }
  });

  if (quotationRequest.message) {
    lines.push('', `Additional note: ${quotationRequest.message}`);
  }

  lines.push('', 'Please share quotation guidance and the next steps.');

  const message = lines.join('\n');

  if (message.length > MAX_WHATSAPP_MESSAGE_LENGTH) {
    throw new ValidationError(
      'The combined WhatsApp enquiry is too long. Please shorten the requirements.',
    );
  }

  return message;
}

function setHandoffResponse(
  ctx: any,
  quotationRequest: any,
  siteSetting: SiteSettingSnapshot | null | undefined,
  statusCode: number,
): void {
  const whatsappMessage = buildWhatsappMessage(quotationRequest, siteSetting);
  ctx.status = statusCode;
  ctx.body = {
    data: {
      requestNumber: quotationRequest.requestNumber,
      status: 'whatsapp_initiated',
      whatsappUrl: `https://wa.me/${OFFICIAL_WHATSAPP_DIGITS}?text=${encodeURIComponent(whatsappMessage)}`,
      whatsappMessage,
    },
  };
}

export default factories.createCoreController(
  QUOTATION_REQUEST_UID,
  ({ strapi }) => ({
    async create(ctx) {
      const body = ctx.request.body;

      if (!isRecord(body) || !isRecord(body.data)) {
        throw new ValidationError('Request body must contain a data object.');
      }

      const data = body.data;
      const submissionToken = requiredString(data, 'submissionToken', 64);

      if (!SUBMISSION_TOKEN_PATTERN.test(submissionToken)) {
        throw new ValidationError('submissionToken has an invalid format.');
      }

      const existingRequest = await strapi
        .documents(QUOTATION_REQUEST_UID)
        .findFirst({
          filters: { submissionToken },
          populate: { items: true },
        });

      if (existingRequest) {
        const currentSetting = await strapi
          .documents(SITE_SETTING_UID)
          .findFirst({
            status: 'published',
            fields: ['companyName', 'defaultInquiryMessage'],
          });

        setHandoffResponse(ctx, existingRequest, currentSetting, 200);
        return;
      }

      const siteSetting = (await strapi
        .documents(SITE_SETTING_UID)
        .findFirst({
          status: 'published',
          fields: ['companyName', 'defaultInquiryMessage'],
        })) as SiteSettingSnapshot | null;

      const fullName = requiredString(data, 'fullName', 120);
      const whatsappNumber = normalizeBuyerWhatsappNumber(data);
      const companyName = optionalString(data, 'companyName', 200);
      const deliveryDestination = requiredString(
        data,
        'deliveryDestination',
        200,
      );

      if (data.consentToContact !== true) {
        throw new ValidationError('consentToContact must be accepted.');
      }

      const sourcePage = optionalString(data, 'sourcePage', 512);

      if (sourcePage && !SOURCE_PATH_PATTERN.test(sourcePage)) {
        throw new ValidationError(
          'sourcePage must be an internal path without a query or hash.',
        );
      }

      const items = await normalizeItems(strapi, data.items);
      const requestNumber = await generateRequestNumber(strapi);
      const whatsappInitiatedAt = new Date().toISOString();
      const quotationData = {
        submissionToken,
        requestNumber,
        fullName,
        whatsappNumber,
        recipientWhatsappNumber: OFFICIAL_WHATSAPP_NUMBER,
        companyName,
        deliveryDestination,
        items,
        message: optionalString(data, 'message', 1000),
        sourcePage,
        referrer: optionalString(data, 'referrer', 2000),
        utmSource: optionalString(data, 'utmSource', 100),
        utmMedium: optionalString(data, 'utmMedium', 100),
        utmCampaign: optionalString(data, 'utmCampaign', 150),
        consentToContact: true,
        whatsappStatus: 'initiated' as const,
        whatsappInitiatedAt,
        status: 'new' as const,
      };

      buildWhatsappMessage(quotationData, siteSetting);

      let quotationRequest;

      try {
        quotationRequest = await strapi.documents(QUOTATION_REQUEST_UID).create({
          data: quotationData,
          populate: { items: true },
        });
      } catch (error) {
        quotationRequest = await strapi
          .documents(QUOTATION_REQUEST_UID)
          .findFirst({
            filters: { submissionToken },
            populate: { items: true },
          });

        if (!quotationRequest) {
          throw error;
        }
      }

      setHandoffResponse(ctx, quotationRequest, siteSetting, 201);
    },
  }),
);
