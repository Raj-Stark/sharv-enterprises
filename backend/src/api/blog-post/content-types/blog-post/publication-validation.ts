import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const BLOG_POST_UID = 'api::blog-post.blog-post' as const;
const BLOG_AUTHOR_UID = 'api::blog-author.blog-author' as const;
const BLOG_CATEGORY_UID = 'api::blog-category.blog-category' as const;
const { ValidationError } = errors;

type RelationSummary = {
  documentId?: string;
  name?: string;
};

type BlogPostDraft = {
  title?: string;
  author?: RelationSummary | null;
  category?: RelationSummary | null;
  coverImage?: unknown;
};

async function requirePublishedRelation(
  strapi: Core.Strapi,
  relation: RelationSummary | null | undefined,
  relationUid: typeof BLOG_AUTHOR_UID | typeof BLOG_CATEGORY_UID,
  relationLabel: 'author' | 'category',
): Promise<void> {
  if (!relation?.documentId) {
    throw new ValidationError(
      `Publish blocked: select a blog ${relationLabel} before publishing this post.`,
    );
  }

  const publishedRelation = await strapi.documents(relationUid).findOne({
    documentId: relation.documentId,
    status: 'published',
    fields: ['documentId', 'name'],
  });

  if (!publishedRelation) {
    const selectedName = relation.name?.trim();
    const selectedDescription = selectedName
      ? `The selected ${relationLabel} “${selectedName}”`
      : `The selected blog ${relationLabel}`;

    throw new ValidationError(
      `Publish blocked: ${selectedDescription} is still a draft. Publish the ${relationLabel} first, then publish this blog post again.`,
    );
  }
}

async function validateBlogPostPublication(
  strapi: Core.Strapi,
  documentId: string,
): Promise<void> {
  const draft = (await strapi.documents(BLOG_POST_UID).findOne({
    documentId,
    status: 'draft',
    fields: ['documentId', 'title'],
    populate: {
      author: {
        fields: ['documentId', 'name'],
      },
      category: {
        fields: ['documentId', 'name'],
      },
      coverImage: true,
    },
  })) as BlogPostDraft | null;

  if (!draft) {
    throw new ValidationError(
      'Publish blocked: the blog draft could not be found. Save the draft and try again.',
    );
  }

  if (!draft.coverImage) {
    throw new ValidationError(
      'Publish blocked: add a cover image before publishing this blog post.',
    );
  }

  await requirePublishedRelation(
    strapi,
    draft.author,
    BLOG_AUTHOR_UID,
    'author',
  );
  await requirePublishedRelation(
    strapi,
    draft.category,
    BLOG_CATEGORY_UID,
    'category',
  );
}

export function registerBlogPostPublicationValidation(
  strapi: Core.Strapi,
): void {
  strapi.documents.use(async (context, next) => {
    if (context.uid !== BLOG_POST_UID || context.action !== 'publish') {
      return next();
    }

    const params = context.params as { documentId?: string };

    if (!params.documentId) {
      throw new ValidationError(
        'Publish blocked: the blog post identifier is missing. Save the draft and try again.',
      );
    }

    await validateBlogPostPublication(strapi, params.documentId);

    return next();
  });
}
