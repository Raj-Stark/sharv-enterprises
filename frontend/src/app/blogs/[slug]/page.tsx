import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleReadingProgress } from '@/components/blog/article-reading-progress'
import { BlocksRenderer } from '@/components/content/blocks-renderer'
import { ProductGrid } from '@/components/products/product-grid'
import { JsonLd } from '@/components/seo/json-ld'
import { FaqList } from '@/components/site/faq-list'
import { normalizeArticleContent } from '@/lib/content/article'
import { getMediaUrl } from '@/lib/strapi/client'
import { getBlogPostBySlug } from '@/lib/strapi/queries'
import { buildSeoMetadata } from '@/lib/seo/metadata'
import { getSiteUrl } from '@/lib/seo/site-url'

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

function formatDate(value?: string): string | null {
  if (!value) return null

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

function safeExternalUrl(value?: string | null): string | null {
  if (!value || !/^https:\/\//i.test(value)) return null
  return value
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) return { title: 'Article not found', robots: { index: false } }

  return buildSeoMetadata({
    seo: post.seo,
    fallbackTitle: post.title,
    fallbackDescription: post.excerpt,
    fallbackImage: post.coverImage,
    pathname: `/blogs/${post.slug}`,
    type: 'article',
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) notFound()

  const coverImageUrl = getMediaUrl(post.coverImage?.url)
  const authorImageUrl = getMediaUrl(post.author.photo?.url)
  const publishedDate = formatDate(post.publishedAt)
  const linkedinUrl = safeExternalUrl(post.author.linkedinUrl)
  const websiteUrl = safeExternalUrl(post.author.websiteUrl)
  const article = normalizeArticleContent(post.content)
  const articleCtaTitle = article.ctaTitle ?? 'Need help selecting the right packaging product?'
  const articleCtaDescription = article.ctaDescription ?? 'Share your application, operating conditions or model reference with Sharv Enterprises for product guidance.'

  return (
    <main>
      <ArticleReadingProgress />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          image: coverImageUrl ?? undefined,
          author: {
            '@type': 'Person',
            name: post.author.name,
          },
          mainEntityOfPage: getSiteUrl(`/blogs/${post.slug}`),
        }}
      />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <nav className="flex min-w-0 items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.09em] text-slate-500" aria-label="Breadcrumb">
            <Link className="shrink-0 transition hover:text-brand-blue" href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link className="shrink-0 transition hover:text-brand-blue" href="/blogs">Insights</Link>
            <span aria-hidden="true">/</span>
            <span className="truncate font-extrabold text-slate-800">{post.category.name}</span>
          </nav>
        </div>
      </section>

      <article>
        <header className="border-b border-slate-200 bg-brand-surface py-6 sm:py-8 lg:py-10">
          <div className="mx-auto grid max-w-7xl gap-7 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(26rem,0.95fr)] lg:items-center lg:gap-12">
            <div>
              <Link className="inline-flex rounded-full border border-blue-200 bg-white px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.09em] text-brand-blue transition hover:border-brand-blue" href={`/blogs?category=${encodeURIComponent(post.category.slug)}`}>
                {post.category.name}
              </Link>
              <h1 className="mt-4 max-w-3xl text-[2.15rem] font-extrabold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[2.7rem] lg:text-5xl">{post.title}</h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-base">{post.excerpt}</p>

              <div className="mt-5 flex items-center justify-between gap-5 border-t border-slate-200 pt-4 sm:justify-start">
                <div className="flex items-center gap-3">
                  {authorImageUrl && post.author.photo ? (
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-slate-200">
                      <Image alt={post.author.photo.alternativeText ?? post.author.name} className="object-cover" fill sizes="40px" src={authorImageUrl} />
                    </div>
                  ) : (
                    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-navy text-sm font-extrabold text-white">{post.author.name.charAt(0)}</div>
                  )}
                  <div>
                    <p className="text-sm font-extrabold text-slate-950">{post.author.name}</p>
                    {post.author.jobTitle && <p className="text-xs text-slate-500">{post.author.jobTitle}</p>}
                  </div>
                </div>
                <span className="hidden h-7 w-px bg-slate-200 sm:block" aria-hidden="true" />
                <div className="shrink-0 text-right sm:flex sm:items-center sm:gap-3 sm:text-left">
                  <p className="text-xs font-bold text-slate-500">{publishedDate ?? 'Recently published'}</p>
                  <span className="hidden size-1 rounded-full bg-slate-300 sm:block" aria-hidden="true" />
                  <p className="mt-1 text-xs font-bold text-slate-500 sm:mt-0">{article.readingMinutes} min read</p>
                </div>
              </div>
            </div>

            {coverImageUrl && (
              <div className="relative aspect-video overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-[0_20px_55px_rgba(12,53,86,0.12)] lg:aspect-[16/10]">
                <Image
                  alt={post.coverImage.alternativeText ?? post.title}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  src={coverImageUrl}
                />
              </div>
            )}
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16 lg:py-20">
          <div className="min-w-0">
            {article.toc.length > 0 && (
              <details className="mb-9 rounded-2xl border border-slate-200 bg-slate-50 lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-extrabold text-slate-950 marker:hidden">
                  On this page
                  <span className="text-brand-blue" aria-hidden="true">↓</span>
                </summary>
                <nav className="border-t border-slate-200 px-5 py-4" aria-label="Article contents">
                  <ol className="grid gap-3">
                    {article.toc.map((item, index) => (
                      <li key={item.id}>
                        <a className="flex gap-3 text-sm leading-6 text-slate-600 hover:text-brand-blue" href={`#${item.id}`}>
                          <span className="font-mono text-[10px] text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </details>
            )}

            <BlocksRenderer className="prose-catalogue article-prose" content={article.content} />

            <aside className="mt-12 overflow-hidden rounded-3xl bg-brand-navy p-6 text-white shadow-[0_20px_50px_rgba(12,53,86,0.16)] sm:p-8">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-300">Product selection support</p>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-[-0.025em] text-white sm:text-3xl">{articleCtaTitle}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100/75">{articleCtaDescription}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 text-xs font-extrabold uppercase tracking-[0.07em] text-brand-navy transition hover:bg-blue-50" href="/quote">
                  Discuss your requirement <span className="ml-2" aria-hidden="true">→</span>
                </Link>
                <Link className="inline-flex min-h-12 items-center justify-center px-4 text-xs font-extrabold uppercase tracking-[0.07em] text-white underline decoration-white/30 underline-offset-4 hover:text-blue-100" href="/products">
                  Browse products
                </Link>
              </div>
            </aside>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-6">
                <span className="mr-2 text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Topics</span>
                {post.tags.map((tag) => (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600" key={tag.documentId}>#{tag.name}</span>
                ))}
              </div>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-32 grid gap-5">
              {article.toc.length > 0 && (
                <nav className="rounded-2xl border border-slate-200 bg-white p-5" aria-label="Article contents">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-600">On this page</p>
                  <ol className="mt-4 grid gap-3 border-l border-slate-200 pl-4">
                    {article.toc.map((item) => (
                      <li key={item.id}>
                        <a className="block text-xs font-bold leading-5 text-slate-600 transition hover:text-brand-blue" href={`#${item.id}`}>{item.label}</a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              <div className="rounded-2xl bg-brand-surface p-5">
                <div className="flex items-center gap-3">
                  {authorImageUrl && post.author.photo ? (
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-slate-200">
                      <Image alt={post.author.photo.alternativeText ?? post.author.name} className="object-cover" fill sizes="48px" src={authorImageUrl} />
                    </div>
                  ) : (
                    <div className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-navy text-base font-extrabold text-white">{post.author.name.charAt(0)}</div>
                  )}
                  <div>
                    <p className="font-extrabold text-slate-950">{post.author.name}</p>
                    {post.author.jobTitle && <p className="mt-0.5 text-xs text-slate-500">{post.author.jobTitle}</p>}
                  </div>
                </div>
                <p className="mt-4 text-xs leading-6 text-slate-600">{post.author.bio}</p>
                {post.author.expertise && <p className="mt-4 border-t border-slate-200 pt-4 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-blue">{post.author.expertise}</p>}
                {(linkedinUrl || websiteUrl) && (
                  <div className="mt-4 flex gap-4 text-xs font-bold">
                    {linkedinUrl && <a className="text-brand-blue hover:text-brand-navy" href={linkedinUrl} rel="noreferrer" target="_blank">LinkedIn</a>}
                    {websiteUrl && <a className="text-brand-blue hover:text-brand-navy" href={websiteUrl} rel="noreferrer" target="_blank">Website</a>}
                  </div>
                )}
              </div>

              <Link className="rounded-2xl bg-brand-navy p-5 text-white transition hover:-translate-y-0.5 hover:shadow-lg" href="/quote">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.09em] text-orange-300">Ask Sharv</span>
                <span className="mt-2 block text-base font-extrabold leading-snug">Need help choosing a product?</span>
                <span className="mt-3 block text-xs font-bold text-blue-100/70">Start an enquiry →</span>
              </Link>
            </div>
          </aside>
        </div>
      </article>

      {post.relatedProducts && post.relatedProducts.length > 0 && (
        <section className="border-t border-slate-200 bg-brand-surface py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-600">Continue your research</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.025em] text-slate-950 sm:text-4xl">Related products</h2>
              </div>
              <Link className="text-xs font-extrabold uppercase tracking-[0.07em] text-brand-blue hover:text-brand-navy" href="/products">View complete catalogue →</Link>
            </div>
            <div className="mt-8"><ProductGrid headingLevel={3} products={post.relatedProducts} variant="catalogue" /></div>
          </div>
        </section>
      )}

      <FaqList faqs={post.faqs} eyebrow="Article FAQ" title="Related questions" />
    </main>
  )
}
