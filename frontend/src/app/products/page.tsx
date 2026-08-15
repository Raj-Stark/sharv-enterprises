import type { Metadata } from 'next'
import Link from 'next/link'

import { ProductCatalogue } from '@/components/products/product-catalogue'
import { EmptyState } from '@/components/site/empty-state'
import { cleanCatalogueLabel } from '@/lib/business/catalogue'
import { getProductCategories, getProducts } from '@/lib/strapi/queries'

type ProductsPageProps = {
  searchParams: Promise<{ category?: string | string[] }>
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const rawCategory = (await searchParams).category
  const category = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory

  return {
    title: 'Product Catalogue',
    description:
      'Browse published Sharv Enterprises products for domestic supply and export enquiries.',
    alternates: { canonical: '/products' },
    robots: category ? { index: false, follow: true } : undefined,
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const rawCategory = (await searchParams).category
  const selectedCategory = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory
  const [products, categories] = await Promise.all([
    getProducts(selectedCategory),
    getProductCategories(),
  ])
  const selectedCategoryName = selectedCategory
    ? categories.find((category) => category.slug === selectedCategory)?.name
    : undefined
  const cleanSelectedCategoryName = selectedCategoryName
    ? cleanCatalogueLabel(selectedCategoryName)
    : undefined

  return (
    <main>
      <section className="relative overflow-hidden bg-brand-navy py-8 text-white sm:py-14 lg:py-16">
        <div className="industrial-grid absolute inset-0 opacity-20" />
        <div className="absolute -right-40 -top-52 size-[38rem] rounded-full bg-blue-400/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <nav className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-white/55" aria-label="Breadcrumb">
            <Link className="transition hover:text-white" href="/">Home</Link>
            <span className="px-2">/</span>
            <span className="text-white">Products</span>
          </nav>

          <div className="mt-6 grid gap-8 sm:mt-7 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-end lg:gap-16">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-orange-300">
                Industrial packaging catalogue
              </p>
              <h1 className="mt-4 max-w-4xl text-[2.35rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.55rem]">
                Packaging products, easier to compare and source.
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-blue-100/75 sm:mt-5 sm:text-base">
                Browse protective packaging, tapes, stretch films, strapping and security products—with technical details available before you request a quote.
              </p>

              <div className="mt-6 flex gap-2 sm:mt-7 sm:gap-3">
                <a className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-white px-3 text-[10px] font-extrabold uppercase tracking-[0.06em] text-brand-navy transition hover:bg-blue-50 sm:flex-none sm:px-6 sm:text-xs sm:tracking-[0.08em]" href="#catalogue">
                  Browse products <span className="ml-2" aria-hidden="true">↓</span>
                </a>
                <Link className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-white/20 px-3 text-[10px] font-extrabold uppercase tracking-[0.05em] text-white transition hover:border-white/40 hover:bg-white/10 sm:flex-none sm:px-6 sm:text-xs sm:tracking-[0.08em]" href="/quote">
                  Share a requirement <span className="ml-2" aria-hidden="true">→</span>
                </Link>
              </div>

              <dl className="mt-7 hidden max-w-md grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid lg:hidden">
                <div className="bg-brand-navy/70 px-4 py-3">
                  <dt className="text-[9px] font-extrabold uppercase tracking-[0.09em] text-blue-100/55">Published</dt>
                  <dd className="mt-1 text-lg font-extrabold text-white">{products.length} products</dd>
                </div>
                <div className="bg-brand-navy/70 px-4 py-3">
                  <dt className="text-[9px] font-extrabold uppercase tracking-[0.09em] text-blue-100/55">Product families</dt>
                  <dd className="mt-1 text-lg font-extrabold text-white">{categories.length} categories</dd>
                </div>
              </dl>
            </div>

            <aside className="hidden rounded-3xl border border-white/15 bg-white/[0.07] p-6 shadow-2xl backdrop-blur-sm lg:block">
              <div className="grid grid-cols-2 gap-5 border-b border-white/10 pb-5">
                <div>
                  <p className="text-3xl font-extrabold text-white">{products.length}</p>
                  <p className="mt-1 text-xs text-blue-100/60">Published products</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-white">{categories.length}</p>
                  <p className="mt-1 text-xs text-blue-100/60">Product families</p>
                </div>
              </div>
              <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-300">Need selection support?</p>
              <p className="mt-2 text-sm leading-6 text-blue-100/75">Send the application, size or model reference. Our team will help confirm the suitable option.</p>
              <Link className="mt-5 inline-flex items-center text-xs font-extrabold text-white underline decoration-white/30 underline-offset-4 hover:text-blue-100" href="/quote">
                Start a guided enquiry <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="sticky top-[100px] z-30 border-b border-slate-200 bg-white/95 py-3 shadow-[0_8px_24px_rgba(12,53,86,0.05)] backdrop-blur-xl" id="categories">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 sm:px-8">
          <p className="hidden shrink-0 text-[10px] font-extrabold uppercase tracking-[0.09em] text-slate-500 sm:block">Categories</p>
          {categories.length > 0 ? (
            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Link
                aria-current={!selectedCategory ? 'page' : undefined}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold transition-colors ${!selectedCategory ? 'border-brand-blue bg-brand-blue text-white shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-brand-blue hover:text-brand-blue'}`}
                href="/products"
              >
                All products
              </Link>
              {categories.map((category) => (
                <Link
                  aria-current={selectedCategory === category.slug ? 'page' : undefined}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold transition-colors ${selectedCategory === category.slug ? 'border-brand-blue bg-brand-blue text-white shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-brand-blue hover:text-brand-blue'}`}
                  href={`/products?category=${encodeURIComponent(category.slug)}`}
                  key={category.documentId}
                >
                  {cleanCatalogueLabel(category.name)}
                </Link>
              ))}
              {selectedCategory && (
                <Link className="shrink-0 px-2 py-2.5 text-xs font-extrabold text-brand-blue underline underline-offset-4" href="/products">
                  Clear ×
                </Link>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Category filters will appear after the first category is published.
            </p>
          )}
        </div>
      </section>

      <section className="scroll-mt-44 bg-brand-surface py-12 sm:py-16 lg:py-20" id="catalogue">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-600">
                {cleanSelectedCategoryName ?? 'Complete catalogue'}
              </p>
              <h2 className="mt-2 text-[2rem] font-extrabold tracking-[-0.025em] text-slate-950 sm:text-[2.5rem]">
                {cleanSelectedCategoryName ? `${cleanSelectedCategoryName} products` : 'Explore our products'}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600">Search by product, model or SKU. Open a result for specifications and application guidance.</p>
          </div>

          {products.length > 0 ? (
            <ProductCatalogue products={products} />
          ) : (
            <EmptyState
              actionHref={selectedCategory ? '/products' : '/'}
              actionLabel={selectedCategory ? 'View all products' : 'Back to home'}
              description={
                selectedCategory
                  ? 'This category does not have an available product yet. Try the complete catalogue or contact us with your requirement.'
                  : 'Our product catalogue is being prepared. Share your application or specifications and our team will help identify a suitable option.'
              }
              title={selectedCategory ? 'No product in this category yet' : 'Product catalogue coming soon'}
            />
          )}

          <aside className="mt-10 overflow-hidden rounded-3xl bg-brand-navy p-6 text-white shadow-[0_20px_50px_rgba(12,53,86,0.14)] sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-300">Can’t find an exact match?</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-white">Share your size, application or reference.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100/70">We can help identify a suitable published product or review a custom requirement.</p>
            </div>
            <Link className="mt-5 inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-white px-6 text-xs font-extrabold uppercase tracking-[0.07em] text-brand-navy transition hover:bg-blue-50 sm:mt-0" href="/quote">
              Get selection help <span className="ml-2" aria-hidden="true">→</span>
            </Link>
          </aside>
        </div>
      </section>
    </main>
  )
}
