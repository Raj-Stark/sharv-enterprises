import Image from 'next/image'
import Link from 'next/link'

import { getMediaUrl } from '@/lib/strapi/client'
import type { BlogPostSummary } from '@/lib/strapi/types'

function formatDate(value?: string): string | null {
  if (!value) return null

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function BlogCard({
  post,
  headingLevel = 2,
}: {
  post: BlogPostSummary
  headingLevel?: 2 | 3
}) {
  const imageUrl = getMediaUrl(post.coverImage?.url)
  const publishedDate = formatDate(post.publishedAt)
  const Heading = headingLevel === 3 ? 'h3' : 'h2'

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <Link className="relative block aspect-[16/10] overflow-hidden bg-slate-100" href={`/blogs/${post.slug}`}>
        {imageUrl ? (
          <Image
            alt={post.coverImage.alternativeText ?? post.title}
            className="object-cover transition duration-500 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            src={imageUrl}
          />
        ) : (
          <div className="industrial-grid absolute inset-0 bg-slate-900" />
        )}
        {post.featured && (
          <span className="absolute left-4 top-4 bg-slate-950 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white">
            Featured insight
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
          <span className="text-orange-600">{post.category.name}</span>
          {publishedDate && <span>{publishedDate}</span>}
        </div>
        <Heading className="mt-3 text-xl font-black leading-tight tracking-tight text-slate-950">
          <Link className="hover:text-orange-600" href={`/blogs/${post.slug}`}>
            {post.title}
          </Link>
        </Heading>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate-100 pt-5 text-xs text-slate-500">
          <span>{post.author.name}</span>
          <Link className="font-black uppercase tracking-[0.12em] text-orange-600" href={`/blogs/${post.slug}`}>
            Read →
          </Link>
        </div>
      </div>
    </article>
  )
}
