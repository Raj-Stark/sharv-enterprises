import 'server-only'

const DEFAULT_STRAPI_URL = 'http://127.0.0.1:1337'

export class StrapiRequestError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'StrapiRequestError'
    this.status = status
  }
}

export function getStrapiServerUrl(): string {
  return (
    process.env.STRAPI_URL?.trim() ||
    process.env.NEXT_PUBLIC_STRAPI_URL?.trim() ||
    DEFAULT_STRAPI_URL
  ).replace(/\/$/, '')
}

export function getStrapiPublicUrl(): string {
  return (
    process.env.NEXT_PUBLIC_STRAPI_URL?.trim() ||
    process.env.STRAPI_URL?.trim() ||
    DEFAULT_STRAPI_URL
  ).replace(/\/$/, '')
}

export function getMediaUrl(mediaUrl?: string | null): string | null {
  if (!mediaUrl) {
    return null
  }

  if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
    return mediaUrl
  }

  return `${getStrapiPublicUrl()}${mediaUrl.startsWith('/') ? '' : '/'}${mediaUrl}`
}

export async function strapiFetch<T>(
  pathname: string,
  params?: URLSearchParams,
): Promise<T> {
  const query = params?.toString()
  const url = `${getStrapiServerUrl()}${pathname}${query ? `?${query}` : ''}`
  let response: Response

  try {
    response = await fetch(url, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    })
  } catch {
    throw new StrapiRequestError(
      'The catalogue service is temporarily unavailable. Please try again.',
    )
  }

  if (!response.ok) {
    throw new StrapiRequestError(
      `The catalogue service returned ${response.status}.`,
      response.status,
    )
  }

  return (await response.json()) as T
}
