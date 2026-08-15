import type { Schema, Struct } from '@strapi/strapi';

export interface HomepageDeliveryArea extends Struct.ComponentSchema {
  collectionName: 'components_homepage_delivery_areas';
  info: {
    description: 'A domestic or export delivery area shown on the homepage';
    displayName: 'Delivery Area';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 280;
      }>;
    market: Schema.Attribute.Enumeration<['domestic', 'export']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'domestic'>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    sortOrder: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
  };
}

export interface ProductFeature extends Struct.ComponentSchema {
  collectionName: 'components_product_features';
  info: {
    description: 'A product feature or customer benefit';
    displayName: 'Feature';
  };
  attributes: {
    description: Schema.Attribute.Text;
    highlighted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    sortOrder: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductSpecification extends Struct.ComponentSchema {
  collectionName: 'components_product_specifications';
  info: {
    description: 'A grouped product specification with an optional unit';
    displayName: 'Specification';
  };
  attributes: {
    groupName: Schema.Attribute.String;
    highlighted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    sortOrder: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    unit: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface QuotationLineItem extends Struct.ComponentSchema {
  collectionName: 'components_quotation_line_items';
  info: {
    description: 'A requested catalogue or custom product with quantity and commercial preferences';
    displayName: 'Quotation Line Item';
  };
  attributes: {
    product: Schema.Attribute.Relation<'manyToOne', 'api::product.product'>;
    productNameSnapshot: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    quantity: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0.001;
        },
        number
      >;
    requirements: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    skuSnapshot: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    unit: Schema.Attribute.Enumeration<
      ['piece', 'roll', 'pack', 'box', 'set', 'meter', 'kilogram']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'piece'>;
  };
}

export interface SharedFaq extends Struct.ComponentSchema {
  collectionName: 'components_shared_faqs';
  info: {
    description: 'A reusable question and answer';
    displayName: 'FAQ';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
    sortOrder: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Search and social metadata overrides';
    displayName: 'SEO';
  };
  attributes: {
    focusKeyword: Schema.Attribute.String;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ogDescription: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'homepage.delivery-area': HomepageDeliveryArea;
      'product.feature': ProductFeature;
      'product.specification': ProductSpecification;
      'quotation.line-item': QuotationLineItem;
      'shared.faq': SharedFaq;
      'shared.seo': SharedSeo;
    }
  }
}
