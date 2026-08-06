/**
 * quotation-request router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter(
  'api::quotation-request.quotation-request',
  {
    only: ['create'],
    config: {
      create: {
        middlewares: ['global::quotation-security'],
      },
    },
  },
);
