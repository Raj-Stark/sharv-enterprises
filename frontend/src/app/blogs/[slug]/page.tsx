import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BlocksRenderer } from '@/components/content/blocks-renderer'
import { ProductGrid } from '@/components/products/product-grid'
import { JsonLd } from '@/components/seo/json-ld'
import { FaqList } from '@/components/site/faq-list'
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

  return (
    <main>
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
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500" aria-label="Breadcrumb">
            <Link className="hover:text-orange-600" href="/">Home</Link>
            <span>/</span>
            <Link className="hover:text-orange-600" href="/blogs">Insights</Link>
            <span>/</span>
            <Link className="hover:text-orange-600" href={`/blogs?category=${encodeURIComponent(post.category.slug)}`}>{post.category.name}</Link>
          </nav>
        </div>
      </section>

      <article>
        <header className="bg-slate-950 py-14 text-white sm:py-20">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.16em]">
              <span className="text-orange-400">{post.category.name}</span>
              {publishedDate && <span className="text-slate-500">{publishedDate}</span>}
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[-0.05em] sm:text-6xl">{post.title}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">{post.excerpt}</p>
            <p className="mt-8 text-sm font-bold text-white">By {post.author.name}{post.author.jobTitle ? ` · ${post.author.jobTitle}` : ''}</p>
          </div>
        </header>

        {coverImageUrl && (
          <div className="mx-auto -mt-px max-w-6xl px-5 sm:px-8">
            <div className="relative aspect-[16/8] overflow-hidden bg-slate-100">
              <Image
                alt={post.coverImage.alternativeText ?? post.title}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1152px"
                src={coverImageUrl}
              />
            </div>
          </div>
        )}

        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_18rem]">
          <div>
            <BlocksRenderer content={post.content} />
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-200 pt-6">
                {post.tags.map((tag) => (
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600" key={tag.documentId}>#{tag.name}</span>
                ))}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="border-t-4 border-orange-500 bg-slate-950 p-6 text-white">
              <div className="flex items-center gap-4">
                {authorImageUrl && post.author.photo ? (
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-full">
                    <Image alt={post.author.photo.alternativeText ?? post.author.name} className="object-cover" fill sizes="56px" src={authorImageUrl} />
                  </div>
                ) : (
                  <div className="grid size-14 shrink-0 place-items-center rounded-full bg-orange-500 text-lg font-black">{post.author.name.charAt(0)}</div>
                )}
                <div>
                  <p className="font-black">{post.author.name}</p>
                  {post.author.jobTitle && <p className="mt-1 text-xs text-slate-400">{post.author.jobTitle}</p>}
                </div>
              </div>
              <p className="mt-5 text-xs leading-6 text-slate-300">{post.author.bio}</p>
              {post.author.expertise && <p className="mt-4 border-t border-slate-800 pt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-orange-400">Expertise · {post.author.expertise}</p>}
              {(linkedinUrl || websiteUrl) && (
                <div className="mt-4 flex gap-4 text-xs font-bold">
                  {linkedinUrl && <a className="text-orange-400 hover:text-orange-300" href={linkedinUrl} rel="noreferrer" target="_blank">LinkedIn</a>}
                  {websiteUrl && <a className="text-orange-400 hover:text-orange-300" href={websiteUrl} rel="noreferrer" target="_blank">Website</a>}
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>

      {post.relatedProducts && post.relatedProducts.length > 0 && (
        <section className="border-t border-slate-200 bg-brand-surface py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">Related catalogue</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Products mentioned in this insight</h2>
            <div className="mt-8"><ProductGrid products={post.relatedProducts} /></div>
          </div>
        </section>
      )}

      <FaqList faqs={post.faqs} eyebrow="Article FAQ" title="Related questions" />
    </main>
  )
}
