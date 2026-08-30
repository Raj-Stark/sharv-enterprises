import type { Metadata } from 'next'

import { getMediaUrl } from '@/lib/strapi/client'
import type { SeoComponent, StrapiMedia } from '@/lib/strapi/types'

import { getSiteUrl } from './site-url'

export const DEFAULT_SOCIAL_IMAGE_PATH = '/og-sharv-packaging.jpg'
export const DEFAULT_SOCIAL_IMAGE_ALT =
  'Sharv Enterprises industrial packaging materials and security supplies'
export const SOCIAL_IMAGE_WIDTH = 1200
export const SOCIAL_IMAGE_HEIGHT = 630

function socialTitle(title: string): string {
  return title.toLocaleLowerCase().includes('sharv enterprises')
    ? title
    : `${title} | Sharv Enterprises`
}

function normalizedTitle(title: string): string {
  return title.replace(/\b([a-z][a-z-]*)\s+\1\b/gi, '$1').trim()
}

function isShareReadyImage(media?: StrapiMedia | null): media is StrapiMedia {
  if (!media?.url || !media.width || !media.height) return false

  const ratio = media.width / media.height
  return media.width >= 600 && media.height >= 315 && ratio >= 1.75 && ratio <= 2.05
}

function socialImage(...candidates: Array<StrapiMedia | null | undefined>) {
  const media = candidates.find(isShareReadyImage)
  const mediaUrl = media ? getMediaUrl(media.url) : null

  if (media && mediaUrl) {
    return {
      url: mediaUrl,
      secureUrl: mediaUrl.startsWith('https://') ? mediaUrl : undefined,
      width: media.width,
      height: media.height,
      alt: media.alternativeText?.trim() || DEFAULT_SOCIAL_IMAGE_ALT,
    }
  }

  const url = getSiteUrl(DEFAULT_SOCIAL_IMAGE_PATH)

  return {
    url,
    secureUrl: url.startsWith('https://') ? url : undefined,
    width: SOCIAL_IMAGE_WIDTH,
    height: SOCIAL_IMAGE_HEIGHT,
    alt: DEFAULT_SOCIAL_IMAGE_ALT,
    type: 'image/jpeg',
  }
}

export function getDefaultSocialImage() {
  return socialImage()
}

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
  const title = normalizedTitle(seo?.metaTitle ?? fallbackTitle)
  const description = seo?.metaDescription ?? fallbackDescription
  const openGraphTitle = socialTitle(normalizedTitle(seo?.ogTitle ?? title))
  const image = socialImage(seo?.ogImage, fallbackImage)
  const documentTitle: Metadata['title'] = title.toLocaleLowerCase().includes('sharv enterprises')
    ? { absolute: title }
    : title

  return {
    title: documentTitle,
    description,
    alternates: {
      canonical: pathname,
    },
    robots: seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      siteName: 'Sharv Enterprises',
      locale: 'en_IN',
      title: openGraphTitle,
      description: seo?.ogDescription ?? description,
      url: getSiteUrl(pathname),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: openGraphTitle,
      description: seo?.ogDescription ?? description,
      images: [image],
    },
  }
}

export function buildPageMetadata({
  title,
  description,
  pathname,
  noIndex = false,
}: {
  title: string
  description: string
  pathname: string
  noIndex?: boolean
}): Metadata {
  const metadata = buildSeoMetadata({
    fallbackTitle: title,
    fallbackDescription: description,
    pathname,
  })

  return noIndex
    ? { ...metadata, robots: { index: false, follow: true } }
    : metadata
}
