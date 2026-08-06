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
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-24">
        <div className="industrial-grid absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-orange-400">Application discovery</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.05em] sm:text-6xl">Start with what the seal needs to do.</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
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
