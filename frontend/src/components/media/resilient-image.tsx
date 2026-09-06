'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

const DEFAULT_FALLBACK_IMAGE = '/images/catalogue-fallback.svg'

type ResilientImageProps = ImageProps & {
  fallbackSrc?: ImageProps['src']
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
  const [failedSource, setFailedSource] = useState<ImageProps['src'] | null>(null)
  const isFallback = failedSource === src

  return (
    <Image
      {...props}
      alt={alt}
      src={isFallback ? fallbackSrc : src}
      onError={(event) => {
        onError?.(event)

        if (!isFallback) {
          setFailedSource(src)
        }
      }}
    />
  )
}
