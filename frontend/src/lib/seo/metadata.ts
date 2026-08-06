import type { Metadata } from 'next'

import { getMediaUrl } from '@/lib/strapi/client'
import type { SeoComponent, StrapiMedia } from '@/lib/strapi/types'

export function buildSeoMetadata({
  seo,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
  pathname,
  type = 'website',
}: {
  seo?: SeoComponent | null
  fallbackTitle: string
  fallbackDescription: string
  fallbackImage?: StrapiMedia | null
  pathname: string
  type?: 'website' | 'article'
}): Metadata {
  const title = seo?.metaTitle ?? fallbackTitle
  const description = seo?.metaDescription ?? fallbackDescription
  const image = getMediaUrl(seo?.ogImage?.url ?? fallbackImage?.url)

  return {
    title,
    description,
    alternates: {
      canonical: pathname,
    },
    robots: seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      title: seo?.ogTitle ?? title,
      description: seo?.ogDescription ?? description,
      url: pathname,
      images: image ? [{ url: image }] : undefined,
    },
  }
}
