import type { Core } from '@strapi/strapi';

import { registerCertificationValidation } from './api/certification/content-types/certification/validation';
import { registerProductCategoryHierarchyValidation } from './api/product-category/content-types/product-category/hierarchy';
import { registerQuotationWhatsappTracking } from './api/quotation-request/content-types/quotation-request/tracking';
import { registerSeoLandingPathValidation } from './api/seo-landing-page/content-types/seo-landing-page/path-validation';
import {
  enforcePublicPermissionAllowlist,
  validateQuotationSecurityConfig,
} from './security/public-permissions';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    registerCertificationValidation(strapi);
    registerProductCategoryHierarchyValidation(strapi);
    registerQuotationWhatsappTracking(strapi);
    registerSeoLandingPathValidation(strapi);
    validateQuotationSecurityConfig(strapi);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await enforcePublicPermissionAllowlist(strapi);
  },
};
