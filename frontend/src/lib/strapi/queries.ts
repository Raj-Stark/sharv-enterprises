import 'server-only'

import { cache } from 'react'

import { strapiFetch } from './client'
import type {
  ApplicationDetail,
  ApplicationSummary,
  BlogCategorySummary,
  BlogPostDetail,
  BlogPostSummary,
  CertificationSummary,
  HomePage,
  ProductCategoryDetail,
  ProductCategorySummary,
  ProductDetail,
  ProductSummary,
  SeoLandingPage,
  SiteSetting,
  SitemapEntry,
  StrapiCollectionResponse,
  StrapiSingleResponse,
  TestimonialSummary,
} from './types'

function addProductCardPopulate(
  params: URLSearchParams,
  relation?: string,
): void {
  const prefix = relation ? `populate[${relation}][populate]` : 'populate'

  params.set(`${prefix}[coverImage]`, 'true')
  params.set(`${prefix}[category]`, 'true')
}

function addBlogCardPopulate(
  params: URLSearchParams,
  relation?: string,
): void {
  const prefix = relation ? `populate[${relation}][populate]` : 'populate'

  params.set(`${prefix}[coverImage]`, 'true')
  params.set(`${prefix}[category]`, 'true')
  params.set(`${prefix}[author][populate][photo]`, 'true')
  params.set(`${prefix}[tags]`, 'true')
}

function hasRequiredBlogRelations(
  post: BlogPostSummary | null | undefined,
): post is BlogPostSummary {
  return Boolean(
    post?.author?.documentId &&
      post.author.name?.trim() &&
      post.category?.documentId &&
      post.category.name?.trim(),
  )
}

function addDiscoverySort(params: URLSearchParams): void {
  params.set('sort[0]', 'featured:desc')
  params.set('sort[1]', 'sortOrder:asc')
  params.set('sort[2]', 'name:asc')
}

async function getFilteredProducts(
  relation: 'category' | 'applications',
  slug: string,
): Promise<ProductSummary[]> {
  const params = new URLSearchParams()
  params.set('sort[0]', 'featured:desc')
  params.set('sort[1]', 'name:asc')
  params.set('pagination[pageSize]', '100')
  params.set(`filters[${relation}][slug][$eq]`, slug)
  addProductCardPopulate(params)

  const response = await strapiFetch<StrapiCollectionResponse<ProductSummary>>(
    '/api/products',
    params,
  )

  return response.data
}

export async function getProducts(categorySlug?: string): Promise<ProductSummary[]> {
  if (categorySlug) return getFilteredProducts('category', categorySlug)

  const params = new URLSearchParams()
  params.set('sort[0]', 'featured:desc')
  params.set('sort[1]', 'name:asc')
  params.set('pagination[pageSize]', '100')
  addProductCardPopulate(params)

  const response = await strapiFetch<StrapiCollectionResponse<ProductSummary>>(
    '/api/products',
    params,
  )

  return response.data
}

export function getProductsByApplication(slug: string): Promise<ProductSummary[]> {
  return getFilteredProducts('applications', slug)
}

export async function getHomepageProducts(): Promise<ProductSummary[]> {
  const params = new URLSearchParams()
  params.set('sort[0]', 'featured:desc')
  params.set('sort[1]', 'name:asc')
  params.set('pagination[pageSize]', '6')
  params.set('filters[featured][$eq]', 'true')
  addProductCardPopulate(params)

  const response = await strapiFetch<StrapiCollectionResponse<ProductSummary>>(
    '/api/products',
    params,
  )

  return response.data
}

export async function getProductCategories(): Promise<ProductCategorySummary[]> {
  const params = new URLSearchParams()
  params.set('sort[0]', 'name:asc')
  params.set('pagination[pageSize]', '100')
  params.set('populate[image]', 'true')
  params.set('populate[parentCategory]', 'true')

  const response = await strapiFetch<
    StrapiCollectionResponse<ProductCategorySummary>
  >('/api/product-categories', params)

  return response.data
}

export const getProductBySlug = cache(
  async (slug: string): Promise<ProductDetail | null> => {
    const params = new URLSearchParams()
    params.set('filters[slug][$eq]', slug)
    params.set('pagination[pageSize]', '1')
    params.set('populate[coverImage]', 'true')
    params.set('populate[gallery]', 'true')
    params.set('populate[category][populate][image]', 'true')
    params.set('populate[applications]', 'true')
    params.set('populate[certifications][populate][logo]', 'true')
    params.set('populate[certifications][populate][document]', 'true')
    params.set('populate[specifications]', 'true')
    params.set('populate[features]', 'true')
    params.set('populate[faqs]', 'true')
    params.set('populate[seo][populate][ogImage]', 'true')
    addBlogCardPopulate(params, 'relatedBlogPosts')

    const response = await strapiFetch<StrapiCollectionResponse<ProductDetail>>(
      '/api/products',
      params,
    )

    return response.data[0] ?? null
  },
)

export const getCategoryBySlug = cache(
  async (slug: string): Promise<ProductCategoryDetail | null> => {
    const params = new URLSearchParams()
    params.set('filters[slug][$eq]', slug)
    params.set('pagination[pageSize]', '1')
    params.set('populate[image]', 'true')
    params.set('populate[parentCategory]', 'true')
    params.set('populate[subcategories][populate][image]', 'true')
    params.set('populate[faqs]', 'true')
    params.set('populate[seo][populate][ogImage]', 'true')

    const response = await strapiFetch<
      StrapiCollectionResponse<ProductCategoryDetail>
    >('/api/product-categories', params)

    return response.data[0] ?? null
  },
)

export async function getApplications(): Promise<ApplicationSummary[]> {
  const params = new URLSearchParams()
  addDiscoverySort(params)
  params.set('pagination[pageSize]', '100')
  params.set('populate[image]', 'true')

  const response = await strapiFetch<
    StrapiCollectionResponse<ApplicationSummary>
  >('/api/applications', params)

  return response.data
}

export async function getHomepageApplications(): Promise<ApplicationSummary[]> {
  const params = new URLSearchParams()
  addDiscoverySort(params)
  params.set('pagination[pageSize]', '6')
  params.set('populate[image]', 'true')

  const response = await strapiFetch<
    StrapiCollectionResponse<ApplicationSummary>
  >('/api/applications', params)

  return response.data
}

export const getApplicationBySlug = cache(
  async (slug: string): Promise<ApplicationDetail | null> => {
    const params = new URLSearchParams()
    params.set('filters[slug][$eq]', slug)
    params.set('pagination[pageSize]', '1')
    params.set('populate[image]', 'true')
    params.set('populate[faqs]', 'true')
    params.set('populate[seo][populate][ogImage]', 'true')

    const response = await strapiFetch<
      StrapiCollectionResponse<ApplicationDetail>
    >('/api/applications', params)

    return response.data[0] ?? null
  },
)

export async function getBlogCategories(): Promise<BlogCategorySummary[]> {
  const params = new URLSearchParams()
  params.set('sort[0]', 'featured:desc')
  params.set('sort[1]', 'sortOrder:asc')
  params.set('sort[2]', 'name:asc')
  params.set('pagination[pageSize]', '100')
  params.set('populate[image]', 'true')

  const response = await strapiFetch<
    StrapiCollectionResponse<BlogCategorySummary>
  >('/api/blog-categories', params)

  return response.data
}

export async function getBlogPosts(
  categorySlug?: string,
  pageSize = 100,
): Promise<BlogPostSummary[]> {
  const params = new URLSearchParams()
  params.set('sort[0]', 'featured:desc')
  params.set('sort[1]', 'publishedAt:desc')
  params.set('pagination[pageSize]', String(Math.min(pageSize, 100)))
  addBlogCardPopulate(params)

  if (categorySlug) {
    params.set('filters[category][slug][$eq]', categorySlug)
  }

  const response = await strapiFetch<StrapiCollectionResponse<BlogPostSummary>>(
    '/api/blog-posts',
    params,
  )

  return response.data.filter(hasRequiredBlogRelations)
}

export function getHomepageBlogPosts(): Promise<BlogPostSummary[]> {
  return getBlogPosts(undefined, 3)
}

export async function getHomepageCertifications(): Promise<CertificationSummary[]> {
  const params = new URLSearchParams()
  const today = new Date().toISOString().slice(0, 10)

  params.set('filters[featured][$eq]', 'true')
  params.set('filters[$or][0][validUntil][$null]', 'true')
  params.set('filters[$or][1][validUntil][$gte]', today)
  params.set('sort[0]', 'sortOrder:asc')
  params.set('sort[1]', 'name:asc')
  params.set('pagination[pageSize]', '6')
  params.set('populate[logo]', 'true')
  params.set('populate[document]', 'true')

  const response = await strapiFetch<
    StrapiCollectionResponse<CertificationSummary>
  >('/api/certifications', params)

  return response.data
}

export async function getHomepageTestimonials(): Promise<TestimonialSummary[]> {
  const params = new URLSearchParams()
  params.set('filters[featured][$eq]', 'true')
  params.set('sort[0]', 'sortOrder:asc')
  params.set('sort[1]', 'publishedAt:desc')
  params.set('pagination[pageSize]', '12')
  params.set('populate[photo]', 'true')

  const response = await strapiFetch<
    StrapiCollectionResponse<TestimonialSummary>
  >('/api/testimonials', params)

  return response.data
}

export const getBlogPostBySlug = cache(
  async (slug: string): Promise<BlogPostDetail | null> => {
    const params = new URLSearchParams()
    params.set('filters[slug][$eq]', slug)
    params.set('pagination[pageSize]', '1')
    addBlogCardPopulate(params)
    addProductCardPopulate(params, 'relatedProducts')
    params.set('populate[faqs]', 'true')
    params.set('populate[seo][populate][ogImage]', 'true')

    const response = await strapiFetch<
      StrapiCollectionResponse<BlogPostDetail>
    >('/api/blog-posts', params)

    const post = response.data[0]

    return hasRequiredBlogRelations(post) ? post : null
  },
)

export const getSeoLandingByPath = cache(
  async (path: string): Promise<SeoLandingPage | null> => {
    const params = new URLSearchParams()
    params.set('filters[path][$eq]', path)
    params.set('pagination[pageSize]', '1')
    params.set('populate[heroImage]', 'true')
    params.set('populate[category][populate][image]', 'true')
    params.set('populate[application][populate][image]', 'true')
    params.set('populate[certification][populate][logo]', 'true')
    params.set('populate[certification][populate][document]', 'true')
    addProductCardPopulate(params, 'products')
    params.set('populate[faqs]', 'true')
    params.set('populate[seo][populate][ogImage]', 'true')

    const response = await strapiFetch<
      StrapiCollectionResponse<SeoLandingPage>
    >('/api/seo-landing-pages', params)

    return response.data[0] ?? null
  },
)

export const getSiteSetting = cache(async (): Promise<SiteSetting | null> => {
  const response = await strapiFetch<StrapiSingleResponse<SiteSetting>>(
    '/api/site-setting',
  )

  return response.data
})

export const getHomePage = cache(async (): Promise<HomePage | null> => {
  const params = new URLSearchParams()
  params.set('populate[heroImage]', 'true')
  params.set('populate[deliveryAreas]', 'true')
  params.set('populate[seo][populate][ogImage]', 'true')

  const response = await strapiFetch<StrapiSingleResponse<HomePage>>(
    '/api/home-page',
    params,
  )

  return response.data
})

async function getAllSitemapEntries(
  endpoint: string,
  pathField: 'slug' | 'path',
): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = []
  let page = 1
  let pageCount = 1

  do {
    const params = new URLSearchParams()
    params.set('fields[0]', pathField)
    params.set('fields[1]', 'updatedAt')
    params.set('populate[seo]', 'true')
    params.set('pagination[page]', String(page))
    params.set('pagination[pageSize]', '100')

    const response = await strapiFetch<
      StrapiCollectionResponse<SitemapEntry & { seo?: { noIndex?: boolean } }>
    >(endpoint, params)

    entries.push(...response.data.filter((entry) => !entry.seo?.noIndex))
    pageCount = response.meta.pagination.pageCount
    page += 1
  } while (page <= pageCount)

  return entries
}

export async function getSitemapContent(): Promise<{
  products: SitemapEntry[]
  categories: SitemapEntry[]
  applications: SitemapEntry[]
  blogs: SitemapEntry[]
  landings: SitemapEntry[]
}> {
  const [products, categories, applications, blogs, landings] =
    await Promise.all([
      getAllSitemapEntries('/api/products', 'slug'),
      getAllSitemapEntries('/api/product-categories', 'slug'),
      getAllSitemapEntries('/api/applications', 'slug'),
      getAllSitemapEntries('/api/blog-posts', 'slug'),
      getAllSitemapEntries('/api/seo-landing-pages', 'path'),
    ])

  return { products, categories, applications, blogs, landings }
}
