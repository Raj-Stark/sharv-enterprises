'use client'

import Image from 'next/image'
import { useState } from 'react'

export type ProductGalleryImage = {
  id: string
  src: string
  alt: string
}

export function ProductGallery({
  images,
  productName,
  featured = false,
}: {
  images: ProductGalleryImage[]
  productName: string
  featured?: boolean
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex]

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.09)]">
        {activeImage ? (
          <Image
            alt={activeImage.alt}
            className="object-contain p-5 sm:p-8"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            src={activeImage.src}
          />
        ) : (
          <div className="grid h-full place-items-center text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Product image
          </div>
        )}

        {featured && (
          <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-white shadow-sm sm:left-5 sm:top-5">
            Featured
          </span>
        )}

        {activeImage && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-black/75 px-4 py-3 text-white backdrop-blur-sm sm:bottom-5 sm:left-5 sm:right-5">
            <span className="truncate pr-4 text-[10px] font-black uppercase tracking-[0.12em]">{productName}</span>
            <span className="shrink-0 font-mono text-[10px]">{String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1" aria-label="Product images">
          {images.map((image, index) => (
            <button
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-pressed={index === activeIndex}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border bg-white transition sm:w-24 ${index === activeIndex ? 'border-black ring-2 ring-black/10' : 'border-slate-200 hover:border-black/50'}`}
              key={image.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <Image alt="" className="object-contain p-2" fill sizes="96px" src={image.src} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
