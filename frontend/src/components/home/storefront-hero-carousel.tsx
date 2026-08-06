'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'

export type StorefrontHeroSlide = {
  id: string
  eyebrow: string
  title: string
  description: string
  imageUrl: string | null
  imageAlt: string
  primaryHref: string
  primaryLabel: string
  secondaryHref: string
  secondaryLabel: string
  secondaryKind?: 'whatsapp' | 'link'
  reference?: string | null
}

export function StorefrontHeroCarousel({
  slides,
}: {
  slides: StorefrontHeroSlide[]
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const activeSlide = slides[activeIndex] ?? slides[0]

  const selectSlide = useCallback(
    (index: number) => {
      if (slides.length === 0) return
      setActiveIndex((index + slides.length) % slides.length)
    },
    [slides.length],
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener('change', updateMotionPreference)

    return () => mediaQuery.removeEventListener('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    if (slides.length < 2 || paused || reducedMotion) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 6500)

    return () => window.clearInterval(timer)
  }, [paused, reducedMotion, slides.length])

  if (!activeSlide) return null

  return (
    <section
      aria-label="Featured catalogue"
      aria-roledescription="carousel"
      className="bg-[#e7edf1] px-4 py-5 sm:px-6 sm:py-7"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-white shadow-[0_28px_90px_rgba(12,53,86,0.14)]">
        <div
          aria-live={paused ? 'polite' : 'off'}
          className="storefront-slide-in grid min-h-[34rem] lg:grid-cols-[0.9fr_1.1fr]"
          key={activeSlide.id}
        >
          <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-black px-3 py-2 text-[9px] font-black uppercase tracking-[0.17em] text-white">
                {activeSlide.eyebrow}
              </span>
              {activeSlide.reference && (
                <span className="rounded-full border border-black/15 px-3 py-2 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-black">
                  {activeSlide.reference}
                </span>
              )}
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl font-black leading-[1.02] tracking-[-0.055em] text-black sm:text-5xl lg:text-[3.8rem]">
              {activeSlide.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-black/60">
              {activeSlide.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-13 items-center justify-center rounded-lg bg-black px-7 text-xs font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-catalogue-accent focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black"
                href={activeSlide.primaryHref}
              >
                {activeSlide.primaryLabel} <span className="ml-3" aria-hidden="true">→</span>
              </Link>
              <Link
                className={activeSlide.secondaryKind === 'whatsapp'
                  ? 'inline-flex min-h-13 items-center justify-center gap-2 rounded-lg border border-whatsapp bg-white px-7 text-xs font-black uppercase tracking-[0.14em] text-black transition-colors hover:bg-whatsapp-soft focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-whatsapp'
                  : 'inline-flex min-h-13 items-center justify-center rounded-lg border border-black/20 bg-white px-7 text-xs font-black uppercase tracking-[0.14em] text-black transition-colors hover:border-black hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black'}
                href={activeSlide.secondaryHref}
              >
                {activeSlide.secondaryKind === 'whatsapp' && <WhatsAppIcon className="size-4 text-whatsapp" />}
                {activeSlide.secondaryLabel}
              </Link>
            </div>

            {slides.length > 1 && (
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <button
                  aria-label="Previous slide"
                  className="grid size-11 place-items-center rounded-full border border-black/15 bg-white text-xl font-black text-black transition hover:border-black"
                  onClick={() => selectSlide(activeIndex - 1)}
                  type="button"
                >
                  <span aria-hidden="true">←</span>
                </button>
                <div className="flex items-center gap-2" role="group" aria-label="Choose slide">
                  {slides.map((slide, index) => (
                    <button
                      aria-label={`Show slide ${index + 1}: ${slide.title}`}
                      aria-pressed={index === activeIndex}
                      className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-9 bg-black' : 'w-2.5 bg-black/20 hover:bg-black/50'}`}
                      key={slide.id}
                      onClick={() => selectSlide(index)}
                      type="button"
                    />
                  ))}
                </div>
                <button
                  aria-label="Next slide"
                  className="grid size-11 place-items-center rounded-full border border-black/15 bg-white text-xl font-black text-black transition hover:border-black"
                  onClick={() => selectSlide(activeIndex + 1)}
                  type="button"
                >
                  <span aria-hidden="true">→</span>
                </button>
                {!reducedMotion && (
                  <button
                    aria-label={paused ? 'Resume automatic slide rotation' : 'Pause automatic slide rotation'}
                    className="ml-1 min-h-11 rounded-full px-3 text-[9px] font-black uppercase tracking-[0.13em] text-black/55 hover:text-black"
                    onClick={() => setPaused((current) => !current)}
                    type="button"
                  >
                    {paused ? 'Play' : 'Pause'}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="relative min-h-[22rem] overflow-hidden bg-slate-950 lg:min-h-full">
            {activeSlide.imageUrl ? (
              <Image
                alt={activeSlide.imageAlt}
                className="object-cover"
                fill
                priority={activeIndex === 0}
                sizes="(max-width: 1024px) 100vw, 55vw"
                src={activeSlide.imageUrl}
              />
            ) : (
              <div className="industrial-grid absolute inset-0 opacity-40" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-black/65 px-5 py-4 backdrop-blur-sm sm:bottom-7 sm:left-7 sm:right-7">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/60">Storefront</p>
                <p className="mt-1 text-sm font-black text-white">Browse · Compare · Enquire</p>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white font-mono text-xs font-black text-black">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
