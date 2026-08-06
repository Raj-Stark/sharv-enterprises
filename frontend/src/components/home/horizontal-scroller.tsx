'use client'

import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

export function HorizontalScroller({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canScrollBack, setCanScrollBack] = useState(false)
  const [canScrollForward, setCanScrollForward] = useState(false)

  const updateControls = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    setCanScrollBack(scroller.scrollLeft > 4)
    setCanScrollForward(
      scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 4,
    )
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    updateControls()
    const resizeObserver = new ResizeObserver(updateControls)
    resizeObserver.observe(scroller)
    scroller.addEventListener('scroll', updateControls, { passive: true })

    return () => {
      resizeObserver.disconnect()
      scroller.removeEventListener('scroll', updateControls)
    }
  }, [updateControls])

  const scroll = (direction: -1 | 1) => {
    const scroller = scrollerRef.current
    if (!scroller) return

    scroller.scrollBy({
      behavior: 'smooth',
      left: direction * Math.max(300, scroller.clientWidth * 0.82),
    })
  }

  return (
    <div>
      <div className="mb-5 flex justify-end gap-2">
        <button
          aria-label={`Scroll ${label} backward`}
          className="grid size-11 place-items-center rounded-full border border-black/15 bg-white text-lg font-black text-black transition enabled:hover:border-black disabled:cursor-not-allowed disabled:opacity-30"
          disabled={!canScrollBack}
          onClick={() => scroll(-1)}
          type="button"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          aria-label={`Scroll ${label} forward`}
          className="grid size-11 place-items-center rounded-full border border-black/15 bg-white text-lg font-black text-black transition enabled:hover:border-black disabled:cursor-not-allowed disabled:opacity-30"
          disabled={!canScrollForward}
          onClick={() => scroll(1)}
          type="button"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <div
        aria-label={label}
        className="storefront-scroller flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6"
        ref={scrollerRef}
        role="region"
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  )
}
