import type { MetadataRoute } from 'next'

import { getSitemapContent } from '@/lib/strapi/queries'
import { getSiteUrl } from '@/lib/seo/site-url'

function lastModified(value?: string): Date | undefined {
  if (!value) return undefined
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: getSiteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: getSiteUrl('/products'), changeFrequency: 'weekly', priority: 0.9 },
    { url: getSiteUrl('/applications'), changeFrequency: 'weekly', priority: 0.8 },
    { url: getSiteUrl('/blogs'), changeFrequency: 'weekly', priority: 0.8 },
    { url: getSiteUrl('/about'), changeFrequency: 'monthly', priority: 0.7 },
    { url: getSiteUrl('/contact'), changeFrequency: 'monthly', priority: 0.75 },
    { url: getSiteUrl('/quote'), changeFrequency: 'monthly', priority: 0.7 },
  ]

  try {
    const content = await getSitemapContent()

    return [
      ...staticEntries,
      ...content.products.flatMap((entry) => entry.slug ? [{ url: getSiteUrl(`/products/${entry.slug}`), lastModified: lastModified(entry.updatedAt), changeFrequency: 'weekly' as const, priority: 0.8 }] : []),
      ...content.categories.flatMap((entry) => entry.slug ? [{ url: getSiteUrl(`/products/category/${entry.slug}`), lastModified: lastModified(entry.updatedAt), changeFrequency: 'weekly' as const, priority: 0.75 }] : []),
      ...content.applications.flatMap((entry) => entry.slug ? [{ url: getSiteUrl(`/applications/${entry.slug}`), lastModified: lastModified(entry.updatedAt), changeFrequency: 'monthly' as const, priority: 0.75 }] : []),
      ...content.blogs.flatMap((entry) => entry.slug ? [{ url: getSiteUrl(`/blogs/${entry.slug}`), lastModified: lastModified(entry.updatedAt), changeFrequency: 'monthly' as const, priority: 0.7 }] : []),
      ...content.landings.flatMap((entry) => entry.path ? [{ url: getSiteUrl(entry.path), lastModified: lastModified(entry.updatedAt), changeFrequency: 'monthly' as const, priority: 0.75 }] : []),
    ]
  } catch {
    return staticEntries
  }
}
