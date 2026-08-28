import fs from 'node:fs';
import path from 'node:path';

import type { Core } from '@strapi/strapi';

type DocumentRecord = {
  id?: number;
  documentId: string;
  name?: string;
  slug?: string;
};

type UploadedFile = {
  id: number;
  documentId?: string;
  name: string;
};

type ProductSeed = {
  name: string;
  slug: string;
  sku: string;
  category: string;
  shortDescription: string;
  featured?: boolean;
  specifications: Array<[string, string, string?]>;
  features: Array<[string, string]>;
};

const CATEGORY_SEEDS = [
  ['Adhesive Tape', 'adhesive-tape', 'Carton sealing, printed branding and dependable everyday closure.'],
  ['Container Security', 'container-security', 'Tamper-evident seals for containers, trailers and controlled access.'],
  ['Packaging Materials', 'packaging-materials', 'Essential materials for shipping, storage and routine handling.'],
  ['Protective Packaging', 'protective-packaging', 'Cushioning and surface protection for safer product movement.'],
  ['Strapping', 'strapping', 'Secure bundling and load restraint for demanding transport conditions.'],
  ['Stretch Film', 'stretch-film', 'Hand, machine and coloured films for stable, protected pallet loads.'],
] as const;

const APPLICATION_SEEDS = [
  ['Carton Sealing', 'carton-sealing', 'Reliable closure for cartons used in warehousing, distribution and export dispatch.'],
  ['Pallet Unitisation', 'pallet-unitisation', 'Stabilise pallet loads during storage, handling and transportation.'],
  ['Cargo Security', 'cargo-security', 'Tamper-evident protection for containers, trailers and controlled-access loads.'],
  ['Export Packaging', 'export-packaging', 'Packaging support for long-distance transit, consolidation and port handling.'],
  ['Warehouse Handling', 'warehouse-handling', 'Materials for routine packing, movement, identification and storage.'],
  ['Transit Protection', 'transit-protection', 'Cushioning and surface protection for products in transit.'],
] as const;

const PRODUCT_SEEDS: ProductSeed[] = [
  {
    name: 'BOPP Packing Tape',
    slug: 'bopp-packing-tape',
    sku: 'SE-AT-BOPP-011',
    category: 'adhesive-tape',
    shortDescription: 'Pressure-sensitive BOPP tape for dependable carton sealing, dispatch and everyday warehouse use.',
    featured: true,
    specifications: [['Material', 'BOPP film'], ['Adhesive', 'Acrylic'], ['Colour', 'Brown / Transparent']],
    features: [['Reliable carton closure', 'Consistent adhesion for routine packing and dispatch.'], ['Clean unwind', 'Designed for smooth manual or dispenser application.']],
  },
  {
    name: 'Printed Packaging Tape',
    slug: 'printed-packaging-tape',
    sku: 'SE-AT-PRT-012',
    category: 'adhesive-tape',
    shortDescription: 'Custom-printed packaging tape for branded carton sealing, handling messages and tamper visibility.',
    specifications: [['Material', 'BOPP film'], ['Printing', 'Custom'], ['Application', 'Carton sealing']],
    features: [['Brand visibility', 'Carry a logo or handling message directly on the seal.'], ['Practical security', 'Makes opened or replaced carton tape easier to notice.']],
  },
  {
    name: 'Cable Seal',
    slug: 'cable-seal',
    sku: 'SE-CS-CAB-006',
    category: 'container-security',
    shortDescription: 'Adjustable tamper-evident cable seal for containers, trucks, drums and controlled-access equipment.',
    featured: true,
    specifications: [['Type', 'Adjustable cable seal'], ['Marking', 'Sequential numbering'], ['Application', 'Container security']],
    features: [['Tamper evidence', 'Supports visible inspection before cargo acceptance.'], ['Traceable identification', 'Sequential numbering helps operational record keeping.']],
  },
  {
    name: 'Bolt Seal',
    slug: 'bolt-seal',
    sku: 'SE-CS-BLT-007',
    category: 'container-security',
    shortDescription: 'High-security bolt seal for freight containers and trailer doors requiring controlled removal.',
    specifications: [['Type', 'High-security bolt seal'], ['Marking', 'Unique numbering'], ['Use', 'Freight containers']],
    features: [['Controlled removal', 'Requires an appropriate cutting tool at destination.'], ['Clear identification', 'Unique numbering supports seal verification.']],
  },
  {
    name: 'Corrugated Boxes',
    slug: 'corrugated-boxes',
    sku: 'SE-PM-CBX-013',
    category: 'packaging-materials',
    shortDescription: 'Corrugated shipping boxes in practical sizes and board combinations for storage and transport.',
    specifications: [['Construction', 'Corrugated board'], ['Style', 'Custom / Standard'], ['Printing', 'Available on request']],
    features: [['Size flexibility', 'Options can be matched to product dimensions and load.'], ['Dispatch ready', 'Suitable for storage, secondary packing and distribution.']],
  },
  {
    name: 'Coloured Stretch Film',
    slug: 'colored-stretch-film',
    sku: 'SE-SF-CLR-003',
    category: 'stretch-film',
    shortDescription: 'Coloured stretch film for load identification, light concealment and organised pallet handling.',
    specifications: [['Application', 'Hand wrapping'], ['Colour', 'Multiple options'], ['Core', 'Standard']],
    features: [['Load identification', 'Use colour to separate routes, customers or handling groups.'], ['Basic concealment', 'Reduces immediate visibility of packed contents.']],
  },
  {
    name: 'Bubble Wrap',
    slug: 'bubble-wrap',
    sku: 'SE-PP-BBL-015',
    category: 'protective-packaging',
    shortDescription: 'Lightweight air-bubble cushioning for fragile products, void filling and surface protection.',
    featured: true,
    specifications: [['Material', 'LDPE'], ['Format', 'Roll'], ['Bubble size', 'On request']],
    features: [['Impact cushioning', 'Helps reduce shock during handling and transit.'], ['Flexible wrapping', 'Conforms around products with irregular shapes.']],
  },
  {
    name: 'EPE Foam Roll',
    slug: 'epe-foam-roll',
    sku: 'SE-PP-EPE-016',
    category: 'protective-packaging',
    shortDescription: 'Closed-cell EPE foam roll for scratch protection, interleaving and lightweight cushioning.',
    specifications: [['Material', 'EPE foam'], ['Format', 'Roll'], ['Thickness', 'On request']],
    features: [['Surface protection', 'Helps prevent abrasion between packed components.'], ['Low-weight cushioning', 'Adds protection without excessive packing weight.']],
  },
  {
    name: 'PP Strapping Roll',
    slug: 'pp-strapping-roll',
    sku: 'SE-ST-PPR-008',
    category: 'strapping',
    shortDescription: 'Polypropylene strapping for cartons, bundles and light-to-medium unit loads.',
    featured: true,
    specifications: [['Material', 'Polypropylene'], ['Application', 'Manual / Machine'], ['Colour', 'Multiple options']],
    features: [['Efficient bundling', 'Suitable for routine carton and bundle restraint.'], ['Application options', 'Available for manual or compatible machine use.']],
  },
  {
    name: 'PET Strapping Roll',
    slug: 'pet-strapping-roll',
    sku: 'SE-ST-PET-009',
    category: 'strapping',
    shortDescription: 'Polyester strapping for heavier palletised loads requiring dependable retained tension.',
    specifications: [['Material', 'Polyester'], ['Application', 'Pallet strapping'], ['Joint', 'Seal / Friction weld']],
    features: [['Retained tension', 'Helps keep unit loads restrained through handling.'], ['Heavy-load option', 'Suitable where PP strapping is not sufficient.']],
  },
  {
    name: 'Hand Stretch Film',
    slug: 'hand-stretch-film',
    sku: 'SE-SF-HND-001',
    category: 'stretch-film',
    shortDescription: 'Manual stretch film for flexible pallet wrapping, bundling and protection from dust and handling.',
    specifications: [['Application', 'Hand wrapping'], ['Material', 'LLDPE'], ['Colour', 'Transparent / Black']],
    features: [['Flexible manual use', 'Practical for varied pallet sizes and lower wrapping volumes.'], ['Load containment', 'Helps keep cartons grouped during movement.']],
  },
  {
    name: 'Machine Stretch Film',
    slug: 'machine-stretch-film',
    sku: 'SE-SF-MCH-002',
    category: 'stretch-film',
    shortDescription: 'Machine-grade stretch film for consistent high-volume pallet wrapping and controlled application.',
    featured: true,
    specifications: [['Application', 'Machine wrapping'], ['Material', 'LLDPE'], ['Pre-stretch', 'Machine dependent']],
    features: [['Consistent wrapping', 'Supports repeatable film application across pallet loads.'], ['High-volume use', 'Designed for compatible powered wrapping equipment.']],
  },
];

const paragraph = (text: string) => ({
  type: 'paragraph',
  children: [{ type: 'text', text }],
});

function documents(strapi: Core.Strapi, uid: string) {
  return strapi.documents(uid as never) as unknown as {
    findFirst(args: Record<string, unknown>): Promise<DocumentRecord | null>;
    findOne(args: Record<string, unknown>): Promise<DocumentRecord | null>;
    create(args: Record<string, unknown>): Promise<DocumentRecord>;
    publish(args: Record<string, unknown>): Promise<DocumentRecord>;
  };
}

async function ensurePublished(
  strapi: Core.Strapi,
  uid: string,
  filters: Record<string, unknown>,
  data: Record<string, unknown>,
): Promise<DocumentRecord> {
  const service = documents(strapi, uid);
  const published = await service.findFirst({ filters, status: 'published' });

  if (published) return published;

  const draft = await service.findFirst({ filters, status: 'draft' });
  const record = draft ?? (await service.create({ data }));

  await service.publish({ documentId: record.documentId });

  return (await service.findOne({
    documentId: record.documentId,
    status: 'published',
  })) ?? record;
}

async function ensureStarterImage(strapi: Core.Strapi): Promise<UploadedFile> {
  const fileQuery = strapi.db.query('plugin::upload.file') as unknown as {
    findOne(args: Record<string, unknown>): Promise<UploadedFile | null>;
  };
  const existing = await fileQuery.findOne({
    where: { name: 'sharv-packaging-starter.jpg' },
  });

  if (existing) return existing;

  const imagePath = path.resolve(
    process.cwd(),
    process.env.STARTER_IMAGE_PATH || 'seed-assets/sharv-packaging-starter.jpg',
  );

  if (!fs.existsSync(imagePath)) {
    throw new Error(`Starter image was not found at ${imagePath}.`);
  }

  const stat = fs.statSync(imagePath);
  const uploadService = strapi.plugin('upload').service('upload') as unknown as {
    upload(args: Record<string, unknown>): Promise<UploadedFile[]>;
  };
  const uploaded = await uploadService.upload({
    data: {
      fileInfo: {
        name: 'sharv-packaging-starter.jpg',
        alternativeText: 'Industrial packaging products prepared for dispatch',
        caption: 'Sharv Enterprises packaging range',
      },
    },
    files: {
      filepath: imagePath,
      originalFilename: 'sharv-packaging-starter.jpg',
      mimetype: 'image/jpeg',
      size: stat.size,
    },
  });

  if (!uploaded[0]) throw new Error('Starter image upload did not return a file.');

  return uploaded[0];
}

export async function seedStarterContent(strapi: Core.Strapi): Promise<void> {
  if (process.env.STARTER_CONTENT_ENABLED !== 'true') return;

  const starterImage = await ensureStarterImage(strapi);
  const categories = new Map<string, DocumentRecord>();

  for (const [name, slug, description] of CATEGORY_SEEDS) {
    const category = await ensurePublished(
      strapi,
      'api::product-category.product-category',
      { slug },
      { name, slug, description },
    );
    categories.set(slug, category);
  }

  for (const [name, slug, summary] of APPLICATION_SEEDS) {
    await ensurePublished(strapi, 'api::application.application', { slug }, {
      name,
      slug,
      summary,
      content: [paragraph(summary)],
      featured: ['pallet-unitisation', 'export-packaging', 'cargo-security'].includes(slug),
      sortOrder: APPLICATION_SEEDS.findIndex((item) => item[1] === slug),
    });
  }

  const products = new Map<string, DocumentRecord>();

  for (const seed of PRODUCT_SEEDS) {
    const category = categories.get(seed.category);
    if (!category) throw new Error(`Missing starter category ${seed.category}.`);

    const product = await ensurePublished(strapi, 'api::product.product', { slug: seed.slug }, {
      name: seed.name,
      slug: seed.slug,
      sku: seed.sku,
      modelNumber: seed.sku,
      shortDescription: seed.shortDescription,
      description: [
        paragraph(seed.shortDescription),
        paragraph('Final size, grade, colour and packing configuration are confirmed against the application and order quantity.'),
      ],
      coverImage: starterImage.id,
      category: { connect: [category.documentId] },
      specifications: seed.specifications.map(([label, value, unit], index) => ({
        label,
        value,
        unit,
        groupName: 'General',
        highlighted: index < 3,
        sortOrder: index,
      })),
      features: seed.features.map(([title, description], index) => ({
        title,
        description,
        highlighted: index === 0,
        sortOrder: index,
      })),
      featured: seed.featured ?? false,
      seo: {
        metaTitle: `${seed.name} Supplier | Sharv Enterprises`,
        metaDescription: seed.shortDescription.slice(0, 180),
        focusKeyword: seed.name,
        noIndex: false,
      },
    });
    products.set(seed.slug, product);
  }

  const siteSetting = documents(strapi, 'api::site-setting.site-setting');
  if (!(await siteSetting.findFirst({ status: 'published' }))) {
    const draft = await siteSetting.create({ data: {
      companyName: 'Sharv Enterprises',
      enquiryEmail: 'info@sharventerprises.com',
      phone: '+91 98188 36151',
      whatsappNumber: '+91 98188 36151',
      defaultInquiryMessage: 'Hello Sharv Enterprises, I would like product and quotation support.',
    } });
    await siteSetting.publish({ documentId: draft.documentId });
  }

  const homePage = documents(strapi, 'api::home-page.home-page');
  if (!(await homePage.findFirst({ status: 'published' }))) {
    const primary = products.get('bopp-packing-tape');
    const secondary = products.get('bubble-wrap');
    const tertiary = products.get('cable-seal');
    if (!primary || !secondary || !tertiary) throw new Error('Starter showcase products are missing.');

    const draft = await homePage.create({ data: {
      heroEyebrow: 'Industrial packaging for India and export',
      heroTitle: 'Packaging that protects every shipment.',
      heroDescription: 'Stretch films, security seals, strapping, tapes and protective packaging supplied with practical product-selection support.',
      heroImage: starterImage.id,
      productShowcase: {
        badgeEyebrow: 'Built for business',
        badgeTitle: 'Pack · Protect · Dispatch',
        primaryProduct: { connect: [primary.documentId] },
        secondaryProduct: { connect: [secondary.documentId] },
        tertiaryProduct: { connect: [tertiary.documentId] },
        footerEyebrow: 'Live catalogue',
        footerText: 'Compare products. Keep context in your quote.',
        ctaLabel: 'View all',
      },
      deliveryEyebrow: 'Export enquiries',
      deliveryTitle: 'Packaging support across key markets',
      deliveryDescription: 'Share your product, size and destination details for a practical supply discussion.',
      deliveryAreas: [
        ['United Kingdom', 'Export enquiries for packaging and cargo-security requirements.'],
        ['Germany', 'Product-selection and commercial support for export requirements.'],
        ['UAE', 'Packaging supply enquiries for the United Arab Emirates.'],
        ['Saudi Arabia', 'Industrial packaging and dispatch support.'],
        ['Qatar', 'Packaging and container-security enquiries.'],
        ['Kuwait', 'Product and quotation support for export buyers.'],
        ['Bahrain', 'Packaging material and cargo-security enquiries.'],
        ['Nepal', 'Regional packaging supply enquiries.'],
        ['Bangladesh', 'Industrial packaging and protection enquiries.'],
        ['Sri Lanka', 'Packaging material and export enquiry support.'],
        ['Singapore', 'Commercial and product-selection enquiries.'],
      ].map(([name, description], sortOrder) => ({
        name,
        market: 'export',
        description,
        sortOrder,
      })),
      seo: {
        metaTitle: 'Sharv Enterprises | Industrial Packaging Solutions',
        metaDescription: 'Industrial packaging materials, stretch films, container seals, strapping, tapes and protective packaging for India and export enquiries.',
        focusKeyword: 'industrial packaging supplier',
        noIndex: false,
      },
    } });
    await homePage.publish({ documentId: draft.documentId });
  }

  const blogCategory = await ensurePublished(strapi, 'api::blog-category.blog-category', { slug: 'packaging-guides' }, {
    name: 'Packaging Guides',
    slug: 'packaging-guides',
    description: 'Practical product selection and packaging guidance.',
    featured: true,
    sortOrder: 0,
  });
  const blogAuthor = await ensurePublished(strapi, 'api::blog-author.blog-author', { slug: 'sharv-enterprises-team' }, {
    name: 'Sharv Enterprises Team',
    slug: 'sharv-enterprises-team',
    jobTitle: 'Packaging Solutions Team',
    bio: 'Practical packaging guidance from the Sharv Enterprises product team.',
    expertise: 'Stretch film, protective packaging, cargo security and dispatch materials',
  });
  const blogService = documents(strapi, 'api::blog-post.blog-post');
  if (!(await blogService.findFirst({ filters: { slug: 'what-is-stretch-film' }, status: 'published' }))) {
    const stretchProducts = ['hand-stretch-film', 'machine-stretch-film', 'colored-stretch-film']
      .map((slug) => products.get(slug)?.documentId)
      .filter((documentId): documentId is string => Boolean(documentId));
    const draft = await blogService.create({ data: {
      title: 'What Is Stretch Film? A Practical Packaging Guide',
      slug: 'what-is-stretch-film',
      excerpt: 'Understand how stretch film stabilises pallet loads and how hand, machine and coloured options differ.',
      content: [
        paragraph('Stretch film is an elastic plastic film wrapped around cartons or products to combine them into a more stable unit load.'),
        { type: 'heading', level: 2, children: [{ type: 'text', text: 'Where stretch film is used' }] },
        paragraph('It is commonly used for pallet unitisation, warehouse movement, protection from dust and keeping mixed cartons together during transport.'),
        { type: 'heading', level: 2, children: [{ type: 'text', text: 'Choosing the right option' }] },
        paragraph('Hand film suits flexible or lower-volume wrapping. Machine film supports repeatable high-volume application. Coloured film can help with identification and basic concealment.'),
        paragraph('Share the pallet size, approximate load weight, wrapping method and destination so the suitable film configuration can be discussed.'),
      ],
      coverImage: starterImage.id,
      category: { connect: [blogCategory.documentId] },
      author: { connect: [blogAuthor.documentId] },
      relatedProducts: { connect: stretchProducts },
      featured: true,
      seo: {
        metaTitle: 'What Is Stretch Film? | Sharv Enterprises',
        metaDescription: 'A practical guide to hand, machine and coloured stretch film for pallet wrapping, load stability and transit protection.',
        focusKeyword: 'what is stretch film',
        noIndex: false,
      },
    } });
    await blogService.publish({ documentId: draft.documentId });
  }

  strapi.log.info('Sharv starter content is ready.');
}
