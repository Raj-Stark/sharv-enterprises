import type { Metadata } from 'next'
import Link from 'next/link'

import { DiscoveryCard } from '@/components/discovery/discovery-card'
import { EmptyState } from '@/components/site/empty-state'
import { getApplications } from '@/lib/strapi/queries'

export const metadata: Metadata = {
  title: 'Applications',
  description:
    'Browse mechanical sealing applications and discover the products connected to each equipment or operating use case.',
  alternates: { canonical: '/applications' },
}

export default async function ApplicationsPage() {
  const applications = await getApplications()

  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950 py-8 text-white sm:py-10 lg:py-12">
        <div className="industrial-grid absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <nav className="text-[10px] font-black uppercase tracking-[0.12em] text-white/50" aria-label="Breadcrumb">
            <Link className="transition hover:text-white" href="/">Home</Link>
            <span className="px-2">/</span>
            <span className="text-white">Applications</span>
          </nav>
          <p className="mt-5 text-[11px] font-black uppercase tracking-[0.16em] text-orange-400">Application discovery</p>
          <h1 className="mt-3 max-w-4xl text-[2.15rem] font-black leading-[1.08] tracking-[-0.04em] sm:text-[2.7rem] lg:text-5xl">Start with what the seal needs to do.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Application pages connect equipment and operating requirements to the published product catalogue.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {applications.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {applications.map((application) => (
                <DiscoveryCard item={application} key={application.documentId} />
              ))}
            </div>
          ) : (
            <EmptyState
              actionHref="/quote"
              actionLabel="Describe the application"
              description="Application pages will appear here as they are published. You can still send equipment and operating details for review."
              title="Application pages are being prepared"
            />
          )}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">Alternative route</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Have an existing model or product reference?</h2>
          </div>
          <Link className="inline-flex min-h-11 items-center bg-slate-950 px-5 text-xs font-black uppercase tracking-[0.12em] text-white hover:bg-orange-600" href="/products">
            Browse product catalogue
          </Link>
        </div>
      </section>
    </main>
  )
}
