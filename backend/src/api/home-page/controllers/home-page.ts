/**
 * home-page controller
 */

import { factories } from '@strapi/strapi';

const HOME_PAGE_UID = 'api::home-page.home-page' as const;

export default factories.createCoreController(HOME_PAGE_UID, ({ strapi }) => ({
  async find(ctx) {
    await this.validateQuery!(ctx);
    const sanitizedQuery = await this.sanitizeQuery!(ctx);
    const entity = await strapi.service(HOME_PAGE_UID).find(sanitizedQuery);

    if (!entity) {
      ctx.status = 200;
      return { data: null, meta: {} };
    }

    const sanitizedEntity = await this.sanitizeOutput!(entity, ctx);

    return this.transformResponse!(sanitizedEntity);
  },
}));
