const DEFAULT_STRAPI_PUBLIC_URL = 'http://127.0.0.1:1337'

function getPublicMediaBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_STRAPI_URL?.trim() || DEFAULT_STRAPI_PUBLIC_URL
  ).replace(/\/$/, '')
}

export function getPublicMediaUrl(mediaUrl?: string | null): string | null {
  if (!mediaUrl) return null

  if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
    return mediaUrl
  }

  return `${getPublicMediaBaseUrl()}${mediaUrl.startsWith('/') ? '' : '/'}${mediaUrl}`
}
