'use client'

import { ResilientImage as Image } from '@/components/media/resilient-image'
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
  const hasMultipleImages = images.length > 1

  function showPreviousImage() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1,
    )
  }

  function showNextImage() {
    setActiveIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1,
    )
  }

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_22px_60px_rgba(12,53,86,0.1)]">
        {activeImage ? (
          <Image
            alt={activeImage.alt}
            className="object-contain p-4 sm:p-7 lg:p-8"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            src={activeImage.src}
          />
        ) : (
          <div className="grid h-full place-items-center text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            {productName}
          </div>
        )}

        {featured && (
          <span className="absolute left-4 top-4 rounded-full bg-orange-50 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.09em] text-orange-700 shadow-sm sm:left-5 sm:top-5">
            Featured product
          </span>
        )}

        {activeImage && hasMultipleImages && (
          <span className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white/90 px-3 py-2 font-mono text-[10px] font-bold text-slate-600 shadow-sm backdrop-blur-sm sm:right-5 sm:top-5" aria-live="polite">
            {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
        )}

        {hasMultipleImages && (
          <>
            <button
              aria-label="Show previous product image"
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/95 text-lg font-black text-brand-navy shadow-md transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue sm:left-5"
              onClick={showPreviousImage}
              type="button"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              aria-label="Show next product image"
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/95 text-lg font-black text-brand-navy shadow-md transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue sm:right-5"
              onClick={showNextImage}
              type="button"
            >
              <span aria-hidden="true">→</span>
            </button>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2" aria-label="Choose a product image">
          {images.map((image, index) => (
            <button
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-pressed={index === activeIndex}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border bg-white transition sm:w-24 ${index === activeIndex ? 'border-brand-blue ring-2 ring-brand-blue/15' : 'border-slate-200 hover:border-blue-300'}`}
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
