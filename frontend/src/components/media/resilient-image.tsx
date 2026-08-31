'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

const DEFAULT_FALLBACK_IMAGE = '/og-sharv-packaging.jpg'

type ResilientImageProps = ImageProps & {
  fallbackSrc?: ImageProps['src']
}

/**
 * Keeps CMS-driven pages usable when an upstream upload is temporarily missing.
 * The fallback is bundled with the frontend, so it does not depend on Strapi.
 */
export function ResilientImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  onError,
  ...props
}: ResilientImageProps) {
  const [activeSrc, setActiveSrc] = useState(src)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    setActiveSrc(src)
    setIsFallback(false)
  }, [src])

  return (
    <Image
      {...props}
      src={activeSrc}
      onError={(event) => {
        onError?.(event)

        if (!isFallback) {
          setIsFallback(true)
          setActiveSrc(fallbackSrc)
        }
      }}
    />
  )
}
