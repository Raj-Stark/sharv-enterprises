import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const PRODUCT_CATEGORY_UID = 'api::product-category.product-category' as const;
const MAX_CATEGORY_DEPTH = 100;

type RelationReference =
  | string
  | number
  | null
  | {
      documentId?: string;
      id?: string | number;
      set?: unknown[] | null;
      connect?: unknown[];
    };

const { ValidationError } = errors;

function getRelationReference(value: unknown): RelationReference | undefined {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'object') {
    return undefined;
  }

  const relation = value as Exclude<RelationReference, string | number | null>;

  if (Array.isArray(relation.set)) {
    return relation.set.length > 0
      ? getRelationReference(relation.set[0])
      : null;
  }

  if (Array.isArray(relation.connect)) {
    return relation.connect.length > 0
      ? getRelationReference(relation.connect[0])
      : undefined;
  }

  if (relation.documentId || relation.id !== undefined) {
    return relation;
  }

  return undefined;
}

async function resolveDocumentId(
  strapi: Core.Strapi,
  value: unknown,
): Promise<string | null | undefined> {
  const reference = getRelationReference(value);

  if (reference === undefined || reference === null) {
    return reference;
  }

  if (typeof reference === 'string') {
    return reference;
  }

  if (typeof reference === 'number') {
    const category = await strapi.db.query(PRODUCT_CATEGORY_UID).findOne({
      where: { id: reference },
      select: ['documentId'],
    });

    return category?.documentId ?? null;
  }

  if (reference.documentId) {
    return reference.documentId;
  }

  if (reference.id !== undefined) {
    const category = await strapi.db.query(PRODUCT_CATEGORY_UID).findOne({
      where: { id: reference.id },
      select: ['documentId'],
    });

    return category?.documentId ?? null;
  }

  return undefined;
}

async function getParentDocumentId(
  strapi: Core.Strapi,
  documentId: string,
): Promise<string | null> {
  const category = await strapi.documents(PRODUCT_CATEGORY_UID).findOne({
    documentId,
    fields: ['documentId'],
    populate: {
      parentCategory: {
        fields: ['documentId'],
      },
    },
  });

  if (!category) {
    throw new ValidationError('Selected parent category does not exist.');
  }

  return category.parentCategory?.documentId ?? null;
}

async function validateCategoryParent(
  strapi: Core.Strapi,
  categoryDocumentId: string | undefined,
  parentValue: unknown,
): Promise<void> {
  const parentDocumentId = await resolveDocumentId(strapi, parentValue);

  if (parentDocumentId === undefined || parentDocumentId === null) {
    return;
  }

  const visited = new Set<string>();

  if (categoryDocumentId) {
    visited.add(categoryDocumentId);
  }

  let currentDocumentId: string | null = parentDocumentId;

  for (let depth = 0; currentDocumentId; depth += 1) {
    if (depth >= MAX_CATEGORY_DEPTH || visited.has(currentDocumentId)) {
      throw new ValidationError(
        'A category cannot be its own parent or create a circular hierarchy.',
      );
    }

    visited.add(currentDocumentId);
    currentDocumentId = await getParentDocumentId(strapi, currentDocumentId);
  }
}

export function registerProductCategoryHierarchyValidation(
  strapi: Core.Strapi,
): void {
  strapi.documents.use(async (context, next) => {
    if (
      context.uid !== PRODUCT_CATEGORY_UID ||
      (context.action !== 'create' && context.action !== 'update')
    ) {
      return next();
    }

    const params = context.params as {
      data?: { parentCategory?: unknown };
      documentId?: string;
    };

    if (!params.data || !('parentCategory' in params.data)) {
      return next();
    }

    await validateCategoryParent(
      strapi,
      params.documentId,
      params.data.parentCategory,
    );

    return next();
  });
}
