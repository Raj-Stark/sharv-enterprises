import Link from 'next/link'

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import {
  OFFICIAL_WHATSAPP_DISPLAY,
  OFFICIAL_WHATSAPP_URL,
} from '@/lib/business/contact'

import { Brand } from './brand'

type SiteHeaderProps = {
  companyName?: string
}

const primaryNavigation = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/applications', label: 'Applications' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const

export function SiteHeader({ companyName }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl">
      <div className="bg-brand-navy text-white">
        <div className="mx-auto flex min-h-7 max-w-7xl items-center justify-between gap-4 px-5 text-[10px] font-extrabold uppercase tracking-[0.1em] sm:px-8">
          <span>Packaging · Protection · Security</span>
          <a className="hidden text-blue-100/75 transition hover:text-white sm:inline" href={OFFICIAL_WHATSAPP_URL} rel="noreferrer" target="_blank">
            WhatsApp {OFFICIAL_WHATSAPP_DISPLAY}
          </a>
        </div>
      </div>
      <div className="relative mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-5 py-2 sm:px-8">
        <Brand companyName={companyName} />
        <nav
          className="hidden items-center gap-5 text-sm font-semibold text-slate-700 lg:flex xl:gap-7"
          aria-label="Primary navigation"
        >
          {primaryNavigation.map((item) => (
            <Link className="border-b-2 border-transparent py-2 transition-colors hover:border-brand-blue hover:text-brand-blue" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <details className="relative ml-auto lg:hidden">
          <summary className="cursor-pointer list-none rounded-lg border border-slate-300 px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-950 marker:hidden">
            Menu
          </summary>
          <nav className="absolute right-0 top-full mt-3 grid w-64 rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-700 shadow-[0_20px_60px_rgba(15,23,42,0.16)]" aria-label="Mobile navigation">
            {primaryNavigation.map((item) => (
              <Link className="rounded-lg px-3 py-3 hover:bg-blue-50 hover:text-brand-blue" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue px-3 py-3 text-center text-xs uppercase tracking-[0.12em] text-white" href="/quote">
              <WhatsAppIcon className="size-4" />
              Get a quote
            </Link>
          </nav>
        </details>
        <Link
          className="hidden min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 text-xs font-extrabold uppercase tracking-[0.07em] text-white transition hover:-translate-y-0.5 hover:bg-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue sm:inline-flex sm:px-5"
          href="/quote"
        >
          <WhatsAppIcon className="size-4 text-green-300" />
          Get a quote
        </Link>
      </div>
    </header>
  )
}
