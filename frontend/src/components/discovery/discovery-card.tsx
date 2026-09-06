import { ResilientImage as Image } from '@/components/media/resilient-image'
import Link from 'next/link'

import { getMediaUrl } from '@/lib/strapi/client'
import type { ApplicationSummary } from '@/lib/strapi/types'

export function DiscoveryCard({
  item,
}: {
  item: ApplicationSummary
}) {
  const imageUrl = getMediaUrl(item.image?.url)
  const href = `/applications/${item.slug}`

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <Link className="relative block aspect-[16/9] overflow-hidden bg-slate-900" href={href}>
        {imageUrl && item.image ? (
          <Image
            alt={item.image.alternativeText ?? item.name}
            className="object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            src={imageUrl}
          />
        ) : (
          <div className="industrial-grid absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#0f5b99,#052f5f_62%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <span className="absolute left-4 top-4 bg-orange-500 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white">
          Application
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-black tracking-tight text-slate-950">
          <Link className="hover:text-orange-600" href={href}>
            {item.name}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {item.summary}
        </p>
        <Link className="mt-auto pt-6 text-[10px] font-black uppercase tracking-[0.16em] text-orange-600" href={href}>
          View application <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}
