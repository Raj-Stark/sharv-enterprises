'use client'

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="industrial-grid flex min-h-[70vh] items-center px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-[var(--line)] bg-white p-8 shadow-[0_24px_80px_rgba(12,29,43,0.08)] sm:p-12">
        <p className="eyebrow">Connection interrupted</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-black sm:text-5xl">
          Content abhi load nahi ho paaya.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600">
          Connection check karke dobara try karein. Agar issue continue rahe,
          tracked WhatsApp quotation ya direct contact option use karein.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--accent-dark)]"
        >
          Try again
        </button>
      </div>
    </main>
  )
}
