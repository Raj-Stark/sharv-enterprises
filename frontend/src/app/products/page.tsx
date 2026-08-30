import type { Metadata } from 'next'
import Link from 'next/link'

import { ProductCatalogue } from '@/components/products/product-catalogue'
import { ProductFamilyCard } from '@/components/products/product-family-card'
import { EmptyState } from '@/components/site/empty-state'
import { cleanCatalogueLabel } from '@/lib/business/catalogue'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getProductCategories, getProducts } from '@/lib/strapi/queries'

type ProductsPageProps = {
  searchParams: Promise<{ category?: string | string[] }>
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const rawCategory = (await searchParams).category
  const category = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory

  const metadata = buildPageMetadata({
    title: 'Product Catalogue',
    description:
      'Browse published Sharv Enterprises products for domestic supply and export enquiries.',
    pathname: '/products',
  })

  return category
    ? { ...metadata, robots: { index: false, follow: true } }
    : metadata
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const rawCategory = (await searchParams).category
  const selectedCategory = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory
  const [allProducts, categories] = await Promise.all([
    getProducts(),
    getProductCategories(),
  ])
  const activeCategory = selectedCategory
    ? categories.find((category) => category.slug === selectedCategory)
    : undefined
  const cleanSelectedCategoryName = activeCategory
    ? cleanCatalogueLabel(activeCategory.name)
    : undefined
  const products = activeCategory
    ? allProducts.filter((product) => product.category.slug === activeCategory.slug)
    : []
  const productFamilies = categories.map((category) => ({
    category,
    products: allProducts.filter((product) => product.category.slug === category.slug),
  }))

  return (
    <main>
      <section className="relative overflow-hidden bg-brand-navy py-7 text-white sm:py-9 lg:py-10">
        <div className="industrial-grid absolute inset-0 opacity-20" />
        <div className="absolute -right-40 -top-52 size-[38rem] rounded-full bg-blue-400/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <nav className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-white/55" aria-label="Breadcrumb">
            <Link className="transition hover:text-white" href="/">Home</Link>
            <span className="px-2">/</span>
            <span className="text-white">Products</span>
          </nav>

          <div className="mt-5 max-w-5xl border-l-2 border-orange-300/80 pl-5 sm:pl-7">
            <div className="max-w-4xl">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-orange-300">
                {cleanSelectedCategoryName ? 'Selected product family' : 'Industrial packaging catalogue'}
              </p>
              <h1 className="mt-3 max-w-4xl text-[2.15rem] font-extrabold leading-[1.06] tracking-[-0.035em] text-white sm:text-[2.7rem] lg:text-5xl">
                {cleanSelectedCategoryName
                  ? `Explore ${cleanSelectedCategoryName} products.`
                  : 'Choose the product family you need.'}
              </h1>
              <p className="mt-4 max-w-3xl text-[15px] leading-6 text-blue-100/75 sm:text-base sm:leading-7">
                {cleanSelectedCategoryName
                  ? `Compare only ${cleanSelectedCategoryName.toLocaleLowerCase()} products, review technical details and request pricing without losing context.`
                  : 'Start with a focused family so unrelated products stay out of the way. Compare specifications and request a quote without losing context.'}
              </p>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
                {cleanSelectedCategoryName ? (
                  <a className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 text-[10px] font-extrabold uppercase tracking-[0.06em] text-brand-navy shadow-sm transition hover:bg-blue-50 sm:px-6 sm:text-xs sm:tracking-[0.08em]" href="#catalogue">
                    View {products.length} {products.length === 1 ? 'product' : 'products'} <span className="ml-2" aria-hidden="true">↓</span>
                  </a>
                ) : (
                  <a className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 text-[10px] font-extrabold uppercase tracking-[0.06em] text-brand-navy shadow-sm transition hover:bg-blue-50 sm:px-6 sm:text-xs sm:tracking-[0.08em]" href="#families">
                    Browse product families <span className="ml-2" aria-hidden="true">↓</span>
                  </a>
                )}
                <Link className="inline-flex min-h-11 items-center justify-center px-2 text-[10px] font-extrabold uppercase tracking-[0.05em] text-blue-100 underline decoration-white/25 underline-offset-4 transition hover:text-white sm:text-xs sm:tracking-[0.08em]" href="/quote">
                  Not sure what fits? Get help <span className="ml-2" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!activeCategory ? (
        <section className="scroll-mt-32 bg-brand-surface py-12 sm:py-16 lg:py-20" id="families">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-600">Browse by product family</p>
                <h2 className="mt-2 max-w-2xl text-[2rem] font-extrabold tracking-[-0.03em] text-slate-950 sm:text-[2.65rem]">
                  Choose what you need to source.
                </h2>
              </div>
              <p className="max-w-lg text-sm leading-6 text-slate-600 lg:justify-self-end">
                Products stay separated by use and material type, so you can compare relevant options without unrelated items in the way.
              </p>
            </div>

            {productFamilies.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {productFamilies.map(({ category, products: familyProducts }, index) => (
                  <ProductFamilyCard
                    category={category}
                    key={category.documentId}
                    position={index + 1}
                    products={familyProducts}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                actionHref="/quote"
                actionLabel="Share a requirement"
                description="Our product families are being prepared. Share your application or specifications and our team will identify a suitable option."
                title="Product catalogue coming soon"
              />
            )}

            <aside className="mt-8 grid gap-5 rounded-2xl border border-blue-200 bg-blue-50/70 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-6">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-brand-blue">Not sure which family fits?</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">Send the application, required size or a model reference. We’ll help narrow it down before you request pricing.</p>
              </div>
              <Link className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-blue px-5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-brand-navy" href="/quote">
                Ask for guidance <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            </aside>
          </div>
        </section>
      ) : (
        <section className="scroll-mt-32 bg-brand-surface py-10 sm:py-14 lg:py-16" id="catalogue">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <nav className="mb-8 flex items-center gap-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Switch product family">
              <Link className="inline-flex min-h-10 shrink-0 items-center rounded-xl bg-brand-navy px-4 text-[10px] font-extrabold uppercase tracking-[0.07em] text-white transition hover:bg-brand-blue" href="/products#families">
                ← All product families
              </Link>
              <span className="h-6 w-px shrink-0 bg-slate-200" aria-hidden="true" />
              {categories.map((category) => {
                const isActive = category.slug === activeCategory.slug

                return (
                  <Link
                    aria-current={isActive ? 'page' : undefined}
                    className={`shrink-0 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${isActive ? 'border-blue-200 bg-blue-50 text-brand-blue' : 'border-transparent text-slate-600 hover:border-slate-200 hover:text-slate-950'}`}
                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                    key={category.documentId}
                  >
                    {cleanCatalogueLabel(category.name)}
                  </Link>
                )
              })}
            </nav>

            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-600">Focused product family</p>
                <h2 className="mt-2 text-[2rem] font-extrabold tracking-[-0.03em] text-slate-950 sm:text-[2.65rem]">
                  {cleanSelectedCategoryName}
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-600">
                Compare only this family. Search by product, model or SKU, then open a result for specifications and application guidance.
              </p>
            </div>

            {products.length > 0 ? (
              <ProductCatalogue
                familyName={cleanSelectedCategoryName ?? cleanCatalogueLabel(activeCategory.name)}
                products={products}
              />
            ) : (
              <EmptyState
                actionHref="/products#families"
                actionLabel="Choose another family"
                description="This family does not have an available product yet. Choose another family or contact us with your requirement."
                title="No product in this family yet"
              />
            )}

            <aside className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(12,53,86,0.07)] sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-7">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-600">Need a closer match?</p>
                <h2 className="mt-2 text-xl font-extrabold tracking-[-0.02em] text-slate-950 sm:text-2xl">Share your size, application or reference.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">We can help confirm the suitable option in this family or review a custom requirement.</p>
              </div>
              <Link className="mt-5 inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-brand-blue px-6 text-xs font-extrabold uppercase tracking-[0.07em] text-white transition hover:bg-brand-navy sm:mt-0" href="/quote">
                Get selection help <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            </aside>
          </div>
        </section>
      )}
    </main>
  )
}
