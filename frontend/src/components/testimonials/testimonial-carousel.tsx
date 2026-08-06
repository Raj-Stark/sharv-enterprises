import Image from 'next/image'
import type { CSSProperties } from 'react'

import { getMediaUrl } from '@/lib/strapi/client'
import type { TestimonialSummary } from '@/lib/strapi/types'

type TestimonialCarouselProps = {
  testimonials: TestimonialSummary[]
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: TestimonialSummary
}) {
  const photoUrl = getMediaUrl(testimonial.photo?.url)
  const byline = [testimonial.designation, testimonial.companyName]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="flex min-h-80 w-[20rem] max-w-[calc(100vw-2.5rem)] shrink-0 flex-col border border-black/10 bg-white p-6 sm:w-[24rem] sm:p-7 lg:w-[26rem]">
      <div className="flex items-start justify-between gap-4">
        {testimonial.rating ? (
          <p
            aria-label={`${testimonial.rating} out of 5 rating`}
            className="text-sm tracking-[0.16em] text-black"
          >
            <span aria-hidden="true">
              {'★'.repeat(testimonial.rating)}
              {'☆'.repeat(5 - testimonial.rating)}
            </span>
          </p>
        ) : (
          <span className="h-px w-12 bg-black" aria-hidden="true" />
        )}
        <span className="font-serif text-5xl leading-none text-black" aria-hidden="true">“</span>
      </div>

      <blockquote className="mt-7 flex-1">
        <p className="text-lg font-black leading-8 text-black">{testimonial.review}</p>
      </blockquote>

      <footer className="mt-8 flex items-center gap-4 border-t border-black/10 pt-5">
        <div className="relative grid size-13 shrink-0 place-items-center overflow-hidden rounded-full bg-black text-xs font-black text-white">
          {photoUrl ? (
            <Image
              alt={testimonial.photo?.alternativeText ?? `${testimonial.customerName} portrait`}
              className="object-cover"
              fill
              sizes="52px"
              src={photoUrl}
            />
          ) : (
            getInitials(testimonial.customerName)
          )}
        </div>
        <div className="min-w-0">
          <p className="font-black text-black">{testimonial.customerName}</p>
          {byline && (
            <p className="mt-1 text-xs leading-5 text-black/55">{byline}</p>
          )}
        </div>
      </footer>
    </article>
  )
}

export function TestimonialCarousel({
  testimonials,
}: TestimonialCarouselProps) {
  if (testimonials.length === 1) {
    return (
      <div className="mt-10 flex justify-center sm:justify-start">
        <TestimonialCard testimonial={testimonials[0]} />
      </div>
    )
  }

  const carouselStyle = {
    '--testimonial-duration': `${Math.max(28, testimonials.length * 9)}s`,
  } as CSSProperties

  return (
    <div
      aria-label="Customer testimonials"
      className="testimonial-marquee mt-10"
      role="region"
      style={carouselStyle}
    >
      <div className="testimonial-track">
        <div className="testimonial-group" role="list">
          {testimonials.map((testimonial) => (
            <div key={testimonial.documentId} role="listitem">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="testimonial-group">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={`duplicate-${testimonial.documentId}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
