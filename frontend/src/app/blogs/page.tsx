import type { Metadata } from 'next'
import Link from 'next/link'

import { BlogCard } from '@/components/blog/blog-card'
import { EmptyState } from '@/components/site/empty-state'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getBlogCategories, getBlogPosts } from '@/lib/strapi/queries'

type BlogsPageProps = {
  searchParams: Promise<{ category?: string | string[] }>
}

export async function generateMetadata({ searchParams }: BlogsPageProps): Promise<Metadata> {
  const rawCategory = (await searchParams).category
  const category = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory

  const metadata = buildPageMetadata({
    title: 'Insights & Technical Articles',
    description:
      'Read practical packaging guides about stretch film, tapes, security seals, transit protection and product sourcing.',
    pathname: '/blogs',
  })

  return category
    ? { ...metadata, robots: { index: false, follow: true } }
    : metadata
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const rawCategory = (await searchParams).category
  const selectedCategory = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory
  const [posts, categories] = await Promise.all([
    getBlogPosts(selectedCategory),
    getBlogCategories(),
  ])
  const selectedCategoryName = selectedCategory
    ? categories.find((category) => category.slug === selectedCategory)?.name
    : undefined

  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950 py-8 text-white sm:py-10 lg:py-12">
        <div className="industrial-grid absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <nav className="text-[10px] font-black uppercase tracking-[0.12em] text-white/50" aria-label="Breadcrumb">
            <Link className="transition hover:text-white" href="/">Home</Link>
            <span className="px-2">/</span>
            <span className="text-white">Insights</span>
          </nav>
          <p className="mt-5 text-[11px] font-black uppercase tracking-[0.16em] text-orange-400">Technical insight</p>
          <h1 className="mt-3 max-w-4xl text-[2.15rem] font-black leading-[1.08] tracking-[-0.04em] sm:text-[2.7rem] lg:text-5xl">Practical knowledge for better product decisions.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Browse published articles connected to products, applications and operating requirements.
          </p>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-5 sm:px-8">
            <Link
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold ${!selectedCategory ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-300 text-slate-600 hover:border-slate-950'}`}
              href="/blogs"
            >
              All insights
            </Link>
            {categories.map((category) => (
              <Link
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold ${selectedCategory === category.slug ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-300 text-slate-600 hover:border-slate-950'}`}
                href={`/blogs?category=${encodeURIComponent(category.slug)}`}
                key={category.documentId}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">Published articles</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">{selectedCategoryName ?? 'Latest insights'}</h2>
            </div>
            <span className="text-xs font-bold text-slate-500">{posts.length} {posts.length === 1 ? 'article' : 'articles'}</span>
          </div>
          {posts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.documentId} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              actionHref={selectedCategory ? '/blogs' : '/products'}
              actionLabel={selectedCategory ? 'View all insights' : 'Browse products'}
              description={selectedCategory ? 'No published article is available in this category yet.' : 'Published technical articles will appear here automatically.'}
              title={selectedCategory ? 'This category is ready for its first article' : 'Insights are being prepared'}
            />
          )}
        </div>
      </section>
    </main>
  )
}
