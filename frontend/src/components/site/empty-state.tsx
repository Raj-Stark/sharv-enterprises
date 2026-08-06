import Link from 'next/link'

type EmptyStateProps = {
  eyebrow?: string
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
}

export function EmptyState({
  eyebrow = 'Catalogue update',
  title,
  description,
  actionHref = '/',
  actionLabel = 'Back to home',
}: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-sm border border-dashed border-slate-300 bg-white px-6 py-12 text-center sm:px-10">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#e62825_0_32%,#0757a0_32%_66%,#d9e4ed_66%)]" />
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600">
        {eyebrow}
      </p>
      <h2 className="mx-auto mt-3 max-w-xl text-2xl font-black tracking-tight text-slate-950">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        {description}
      </p>
      <Link
        className="mt-7 inline-flex min-h-11 items-center justify-center rounded-sm border border-slate-950 px-5 text-xs font-black uppercase tracking-[0.14em] text-slate-950 transition-colors hover:bg-slate-950 hover:text-white"
        href={actionHref}
      >
        {actionLabel}
      </Link>
    </div>
  )
}
