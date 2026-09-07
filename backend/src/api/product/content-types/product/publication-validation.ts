import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

import {
  isStoredMediaAvailable,
  type StoredMedia,
} from '../../../../media/upload-integrity';

const PRODUCT_UID = 'api::product.product' as const;
const PRODUCT_CATEGORY_UID = 'api::product-category.product-category' as const;
const { ValidationError } = errors;

type ProductDraft = {
  name?: string;
  coverImage?: StoredMedia | null;
  gallery?: StoredMedia[] | null;
  category?: {
    documentId?: string;
    name?: string;
  } | null;
};

async function validateProductPublication(
  strapi: Core.Strapi,
  documentId: string,
): Promise<void> {
  const draft = (await strapi.documents(PRODUCT_UID).findOne({
    documentId,
    status: 'draft',
    fields: ['documentId', 'name'],
    populate: {
      coverImage: true,
      gallery: true,
      category: {
        fields: ['documentId', 'name'],
      },
    },
  })) as ProductDraft | null;

  if (!draft) {
    throw new ValidationError(
      'Publish blocked: the product draft could not be found. Save the draft and try again.',
    );
  }

  if (!draft.coverImage) {
    throw new ValidationError(
      'Publish blocked: add a cover image before publishing this product.',
    );
  }

  if (!isStoredMediaAvailable(draft.coverImage)) {
    throw new ValidationError(
      'Publish blocked: the selected cover image file is missing from media storage. Remove it, upload the image again, and then publish the product.',
    );
  }

  const missingGalleryImage = draft.gallery?.find(
    (image) => !isStoredMediaAvailable(image),
  );

  if (missingGalleryImage) {
    const imageName = missingGalleryImage.name?.trim();
    throw new ValidationError(
      imageName
        ? `Publish blocked: the gallery image “${imageName}” is missing from media storage. Remove it or upload it again before publishing this product.`
        : 'Publish blocked: a gallery image is missing from media storage. Remove it or upload it again before publishing this product.',
    );
  }

  if (!draft.category?.documentId) {
    throw new ValidationError(
      'Publish blocked: select a product category before publishing this product.',
    );
  }

  const publishedCategory = await strapi.documents(PRODUCT_CATEGORY_UID).findOne({
    documentId: draft.category.documentId,
    status: 'published',
    fields: ['documentId', 'name'],
  });

  if (!publishedCategory) {
    const categoryName = draft.category.name?.trim();
    throw new ValidationError(
      categoryName
        ? `Publish blocked: the selected category “${categoryName}” is still a draft. Publish the category first, then publish this product again.`
        : 'Publish blocked: the selected category is still a draft. Publish the category first, then publish this product again.',
    );
  }
}

export function registerProductPublicationValidation(
  strapi: Core.Strapi,
): void {
  strapi.documents.use(async (context, next) => {
    if (context.uid !== PRODUCT_UID || context.action !== 'publish') {
      return next();
    }

    const params = context.params as { documentId?: string };

    if (!params.documentId) {
      throw new ValidationError(
        'Publish blocked: the product identifier is missing. Save the draft and try again.',
      );
    }

    await validateProductPublication(strapi, params.documentId);

    return next();
  });
}
