import type { Metadata } from 'next'
import { ResilientImage as Image } from '@/components/media/resilient-image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProductGrid } from '@/components/products/product-grid'
import { EmptyState } from '@/components/site/empty-state'
import { FaqList } from '@/components/site/faq-list'
import { getMediaUrl } from '@/lib/strapi/client'
import { getCategoryBySlug, getProducts } from '@/lib/strapi/queries'
import { buildPageMetadata, buildSeoMetadata } from '@/lib/seo/metadata'

type CategoryPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return buildPageMetadata({
      title: 'Category not found',
      description: 'The requested Sharv Enterprises product category could not be found.',
      pathname: `/products/category/${slug}`,
      noIndex: true,
    })
  }

  return buildSeoMetadata({
    seo: category.seo,
    fallbackTitle: category.name,
    fallbackDescription:
      category.description ??
      `Browse ${category.name} products from Sharv Enterprises.`,
    fallbackImage: category.image,
    pathname: `/products/category/${category.slug}`,
  })
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProducts(slug),
  ])

  if (!category) notFound()

  const imageUrl = getMediaUrl(category.image?.url)

  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {imageUrl && category.image && (
          <Image
            alt={category.image.alternativeText ?? category.name}
            className="object-cover opacity-30"
            fill
            priority
            sizes="100vw"
            src={imageUrl}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/50" />
        <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:py-12">
          <nav className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500" aria-label="Breadcrumb">
            <Link className="hover:text-white" href="/">Home</Link>
            <span className="px-2">/</span>
            <Link className="hover:text-white" href="/products">Products</Link>
            <span className="px-2">/</span>
            <span className="text-orange-400">{category.name}</span>
          </nav>
          {category.parentCategory && (
            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-orange-400">
              {category.parentCategory.name}
            </p>
          )}
          <h1 className="mt-3 max-w-4xl text-[2.15rem] font-black leading-[1.08] tracking-[-0.04em] sm:text-[2.7rem] lg:text-5xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {category.subcategories && category.subcategories.length > 0 && (
        <section className="border-b border-slate-200 bg-white py-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 sm:px-8">
            <span className="mr-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              Subcategories
            </span>
            {category.subcategories.map((subcategory) => (
              <Link
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:border-slate-950 hover:text-slate-950"
                href={`/products/category/${subcategory.slug}`}
                key={subcategory.documentId}
              >
                {subcategory.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">
                Published catalogue
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </h2>
            </div>
            <Link className="text-xs font-black uppercase tracking-[0.12em] text-slate-950 hover:text-orange-600" href="/products">
              All products →
            </Link>
          </div>
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <EmptyState
              actionHref="/products"
              actionLabel="View complete catalogue"
              description="This category is published, but it does not have a published product yet."
              title="Products will appear here automatically"
            />
          )}
        </div>
      </section>

      <FaqList faqs={category.faqs} eyebrow="Category FAQ" title="Category questions" />
    </main>
  )
}
