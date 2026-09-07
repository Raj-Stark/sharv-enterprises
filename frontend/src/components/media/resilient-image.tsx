'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

const DEFAULT_FALLBACK_IMAGE = '/images/catalogue-fallback.svg'
const RETRY_DELAY_MS = 10_000
const MAX_AUTOMATIC_RETRIES = 2

type ResilientImageProps = ImageProps & {
  fallbackSrc?: ImageProps['src']
}

type ImageFailure = {
  attempts: number
  showFallback: boolean
  source: ImageProps['src']
}

/**
 * Keeps CMS-driven pages usable when an upstream upload is temporarily missing.
 * The fallback is bundled with the frontend, so it does not depend on Strapi.
 */
export function ResilientImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  onError,
  ...props
}: ResilientImageProps) {
  const [failure, setFailure] = useState<ImageFailure | null>(null)
  const isFallback = failure?.source === src && failure.showFallback

  useEffect(() => {
    if (
      !isFallback ||
      !failure ||
      failure.attempts > MAX_AUTOMATIC_RETRIES
    ) {
      return
    }

    const retryTimer = window.setTimeout(() => {
      setFailure((current) =>
        current?.source === src
          ? { ...current, showFallback: false }
          : current,
      )
    }, RETRY_DELAY_MS)

    return () => window.clearTimeout(retryTimer)
  }, [failure, isFallback, src])

  useEffect(() => {
    if (!isFallback) return

    const retryOriginal = () => {
      setFailure((current) =>
        current?.source === src
          ? { ...current, attempts: 0, showFallback: false }
          : current,
      )
    }
    const retryWhenVisible = () => {
      if (document.visibilityState === 'visible') retryOriginal()
    }

    window.addEventListener('online', retryOriginal)
    document.addEventListener('visibilitychange', retryWhenVisible)

    return () => {
      window.removeEventListener('online', retryOriginal)
      document.removeEventListener('visibilitychange', retryWhenVisible)
    }
  }, [isFallback, src])

  return (
    <Image
      {...props}
      alt={alt}
      src={isFallback ? fallbackSrc : src}
      onError={(event) => {
        onError?.(event)

        if (!isFallback) {
          setFailure((current) => ({
            attempts: current?.source === src ? current.attempts + 1 : 1,
            showFallback: true,
            source: src,
          }))
        }
      }}
    />
  )
}
