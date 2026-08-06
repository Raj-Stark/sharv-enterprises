import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="industrial-grid flex min-h-[70vh] items-center px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">404 · Not found</p>
        <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] text-black sm:text-6xl">
          Yeh page ya published entry nahi mili.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-neutral-600">
          URL change ho sakta hai, ya content abhi published nahi hai. Active
          product range aur discovery pages se current information dekhein.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--ink)] px-6 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--accent)]"
        >
          Browse products
        </Link>
      </div>
    </main>
  )
}
