import type { Metadata } from 'next'
import Link from 'next/link'

import { CategoryCard } from '@/components/products/category-card'
import { ProductGrid } from '@/components/products/product-grid'
import { EmptyState } from '@/components/site/empty-state'
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

  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950 py-12 text-white sm:py-16">
        <div className="industrial-grid absolute inset-0 opacity-25" />
        <div className="absolute -right-32 -top-40 size-[34rem] rounded-full bg-catalogue-accent/25 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <nav className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60" aria-label="Breadcrumb">
            <Link className="hover:text-white" href="/">Home</Link>
            <span className="px-2">/</span>
            <span className="text-white">Products</span>
          </nav>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white">
                Mechanical sealing catalogue
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.045em] text-white sm:text-6xl">
                Find the right seal without catalogue guesswork.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                Review product images, model references and technical information before starting a tracked WhatsApp enquiry.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60">Selection flow</p>
              <ol className="mt-4 grid gap-3 text-sm font-bold text-white">
                <li className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-white text-xs text-black">1</span>Choose a product type</li>
                <li className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-white text-xs text-black">2</span>Review model and details</li>
                <li className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-white text-xs text-black">3</span>Request technical confirmation</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-8" id="categories">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black">
                Browse catalogue
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-black">
                Filter by product category
              </h2>
            </div>
            {selectedCategory && (
              <Link className="text-xs font-black uppercase tracking-[0.12em] text-black underline decoration-catalogue-accent underline-offset-4" href="/products">
                Clear filter ×
              </Link>
            )}
          </div>
          {categories.length > 0 ? (
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
              <Link
                aria-current={!selectedCategory ? 'page' : undefined}
                className={`shrink-0 rounded-lg border px-4 py-2.5 text-xs font-bold transition-colors ${!selectedCategory ? 'border-catalogue-accent bg-catalogue-accent text-white shadow-sm' : 'border-slate-300 bg-white text-black hover:border-catalogue-accent-border hover:bg-catalogue-accent-soft'}`}
                href="/products"
              >
                All products
              </Link>
              {categories.map((category) => (
                <Link
                  aria-current={selectedCategory === category.slug ? 'page' : undefined}
                  className={`shrink-0 rounded-lg border px-4 py-2.5 text-xs font-bold transition-colors ${selectedCategory === category.slug ? 'border-catalogue-accent bg-catalogue-accent text-white shadow-sm' : 'border-slate-300 bg-white text-black hover:border-catalogue-accent-border hover:bg-catalogue-accent-soft'}`}
                  href={`/products?category=${encodeURIComponent(category.slug)}`}
                  key={category.documentId}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              Category filters will appear after the first category is published.
            </p>
          )}
        </div>
      </section>

      <section className="bg-[#f7f7f9] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black">
                {selectedCategoryName ?? 'All published products'}
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-black">
                Explore {products.length} {products.length === 1 ? 'product' : 'products'}
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-5 text-slate-500">Open any product to review specifications, applications and its tracked quotation path.</p>
          </div>
          {products.length > 0 ? (
            <ProductGrid products={products} />
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
        </div>
      </section>

      {categories.length > 0 && (
        <section className="border-t border-slate-200 bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-8 max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black">Category overview</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-black">Browse by product family</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Open a category page for its published products and related technical context.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {categories.slice(0, 6).map((category) => (
                <CategoryCard category={category} key={category.documentId} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
