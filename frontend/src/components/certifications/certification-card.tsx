import { ResilientImage as Image } from '@/components/media/resilient-image'

import { getMediaUrl } from '@/lib/strapi/client'
import type { CertificationSummary } from '@/lib/strapi/types'

function formatType(value: string): string {
  return value.replaceAll('_', ' ')
}

function formatDate(value?: string | null): string | null {
  if (!value) return null

  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

export function CertificationCard({
  certification,
}: {
  certification: CertificationSummary
}) {
  const logoUrl = getMediaUrl(certification.logo?.url)
  const documentUrl = getMediaUrl(certification.document?.url)
  const recordUrl = certification.verificationUrl ?? documentUrl
  const validUntil = formatDate(certification.validUntil)

  return (
    <article className="group flex h-full flex-col border border-slate-200 bg-white p-6 transition-colors hover:border-slate-400 sm:p-7">
      <div className="flex items-start justify-between gap-5">
        <div className="relative grid size-16 shrink-0 place-items-center overflow-hidden border border-slate-200 bg-slate-50">
          {logoUrl ? (
            <Image
              alt={certification.logo?.alternativeText ?? `${certification.name} logo`}
              className="object-contain p-2"
              fill
              sizes="64px"
              src={logoUrl}
            />
          ) : (
            <span className="text-lg font-black text-slate-300" aria-hidden="true">
              ✓
            </span>
          )}
        </div>
        <span className="bg-orange-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-orange-700">
          {formatType(certification.type)}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-black leading-tight tracking-tight text-slate-950">
        {certification.name}
      </h3>
      {(certification.standardCode || certification.issuingAuthority) && (
        <p className="mt-3 text-xs font-bold uppercase leading-5 tracking-[0.08em] text-slate-500">
          {[certification.standardCode, certification.issuingAuthority]
            .filter(Boolean)
            .join(' · ')}
        </p>
      )}
      {certification.description && (
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
          {certification.description}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate-100 pt-5 text-xs">
        <span className="font-bold text-slate-500">
          {validUntil ? `Valid until ${validUntil}` : 'Published compliance record'}
        </span>
        {recordUrl && (
          <a
            className="font-black uppercase tracking-[0.12em] text-orange-600 hover:text-orange-700"
            href={recordUrl}
            rel="noreferrer"
            target="_blank"
          >
            Verify ↗
          </a>
        )}
      </div>
    </article>
  )
}
