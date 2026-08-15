'use client'

import { useEffect, useState } from 'react'

export function ArticleReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function updateProgress() {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-1 bg-transparent" aria-hidden="true">
      <div className="h-full origin-left bg-brand-accent transition-transform duration-100" style={{ transform: `scaleX(${progress})` }} />
    </div>
  )
}
