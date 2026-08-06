export type StrapiPagination = {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export type StrapiCollectionResponse<T> = {
  data: T[]
  meta: {
    pagination: StrapiPagination
  }
}

export type StrapiSingleResponse<T> = {
  data: T | null
  meta: Record<string, unknown>
}

export type StrapiMediaFormat = {
  url: string
  width: number
  height: number
}

export type StrapiMedia = {
  id: number
  documentId: string
  name: string
  alternativeText?: string | null
  caption?: string | null
  width: number
  height: number
  url: string
  formats?: Record<string, StrapiMediaFormat> | null
}

export type SeoComponent = {
  id: number
  metaTitle: string
  metaDescription: string
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: StrapiMedia | null
  noIndex?: boolean
  focusKeyword?: string | null
}

export type FaqComponent = {
  id: number
  question: string
  answer: string
  sortOrder?: number
}

export type ProductFeature = {
  id: number
  title: string
  description?: string | null
  highlighted: boolean
  sortOrder?: number
}

export type ProductSpecification = {
  id: number
  label: string
  value: string
  unit?: string | null
  groupName?: string | null
  highlighted: boolean
  sortOrder?: number
}

export type TextNode = {
  type: 'text'
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
}

export type BlocksNode = {
  type: string
  level?: number
  format?: 'ordered' | 'unordered'
  url?: string
  image?: StrapiMedia
  children?: Array<BlocksNode | TextNode>
}

export type ProductCategorySummary = {
  id: number
  documentId: string
  name: string
  slug: string
  description?: string | null
  image?: StrapiMedia | null
  parentCategory?: ProductCategorySummary | null
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

export type ProductSummary = {
  id: number
  documentId: string
  name: string
  slug: string
  sku?: string | null
  modelNumber?: string | null
  shortDescription: string
  coverImage: StrapiMedia
  category: ProductCategorySummary
  featured: boolean
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

export type NamedRelation = {
  id: number
  documentId: string
  name: string
  slug: string
  description?: string | null
  summary?: string | null
}

export type CertificationSummary = {
  id: number
  documentId: string
  name: string
  type: string
  standardCode?: string | null
  issuingAuthority?: string | null
  certificateNumber?: string | null
  validFrom?: string | null
  validUntil?: string | null
  description?: string | null
  logo?: StrapiMedia | null
  document?: StrapiMedia | null
  verificationUrl?: string | null
  featured: boolean
  sortOrder?: number
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

export type TestimonialSummary = {
  id: number
  documentId: string
  customerName: string
  designation?: string | null
  companyName?: string | null
  review: string
  photo?: StrapiMedia | null
  rating?: number | null
  featured: boolean
  sortOrder?: number
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

export type ProductDetail = ProductSummary & {
  description: BlocksNode[]
  gallery?: StrapiMedia[] | null
  applications?: NamedRelation[]
  certifications?: CertificationSummary[]
  specifications?: ProductSpecification[]
  features?: ProductFeature[]
  faqs?: FaqComponent[]
  seo?: SeoComponent | null
  relatedBlogPosts?: BlogPostSummary[]
}

export type ProductCategoryDetail = ProductCategorySummary & {
  subcategories?: ProductCategorySummary[]
  products?: ProductSummary[]
  faqs?: FaqComponent[]
  seo?: SeoComponent | null
}

export type SiteSetting = {
  id: number
  documentId: string
  companyName: string
  enquiryEmail?: string | null
  phone?: string | null
  whatsappNumber?: string | null
  defaultInquiryMessage?: string | null
}

export type HomeDeliveryArea = {
  id: number
  name: string
  market: 'domestic' | 'export'
  description: string
  sortOrder?: number
}

export type HomePage = {
  id: number
  documentId: string
  heroEyebrow: string
  heroTitle: string
  heroDescription: string
  heroImage: StrapiMedia
  deliveryEyebrow?: string | null
  deliveryTitle?: string | null
  deliveryDescription?: string | null
  deliveryAreas?: HomeDeliveryArea[] | null
  seo?: SeoComponent | null
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

export type ApplicationSummary = {
  id: number
  documentId: string
  name: string
  slug: string
  summary: string
  image?: StrapiMedia | null
  featured: boolean
  sortOrder?: number
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

export type ApplicationDetail = ApplicationSummary & {
  content?: BlocksNode[] | null
  products?: ProductSummary[]
  faqs?: FaqComponent[]
  seo?: SeoComponent | null
}

export type BlogCategorySummary = {
  id: number
  documentId: string
  name: string
  slug: string
  description?: string | null
  image?: StrapiMedia | null
  featured: boolean
  sortOrder?: number
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

export type BlogAuthorSummary = {
  id: number
  documentId: string
  name: string
  slug: string
  jobTitle?: string | null
  bio: string
  expertise?: string | null
  photo?: StrapiMedia | null
  linkedinUrl?: string | null
  websiteUrl?: string | null
}

export type BlogTagSummary = {
  id: number
  documentId: string
  name: string
  slug: string
}

export type BlogPostSummary = {
  id: number
  documentId: string
  title: string
  slug: string
  excerpt: string
  coverImage: StrapiMedia
  category: BlogCategorySummary
  author: BlogAuthorSummary
  tags?: BlogTagSummary[]
  featured: boolean
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

export type BlogPostDetail = BlogPostSummary & {
  content: BlocksNode[]
  relatedProducts?: ProductSummary[]
  faqs?: FaqComponent[]
  seo?: SeoComponent | null
}

export type SeoLandingPage = {
  id: number
  documentId: string
  internalName: string
  path: string
  pageType:
    | 'category'
    | 'application'
    | 'export'
    | 'custom'
  audience: 'domestic' | 'export' | 'both'
  h1: string
  breadcrumbLabel?: string | null
  summary: string
  content: BlocksNode[]
  heroImage?: StrapiMedia | null
  category?: ProductCategorySummary | null
  application?: ApplicationSummary | null
  certification?: CertificationSummary | null
  products?: ProductSummary[]
  faqs?: FaqComponent[]
  seo: SeoComponent
  featured: boolean
  sortOrder?: number
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

export type SitemapEntry = {
  slug?: string
  path?: string
  updatedAt?: string
  image?: StrapiMedia | null
  coverImage?: StrapiMedia | null
}
