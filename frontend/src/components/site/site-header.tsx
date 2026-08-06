import Link from 'next/link'

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'

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
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 shadow-[0_8px_28px_rgba(5,47,95,0.07)] backdrop-blur">
      <div className="border-b-2 border-orange-500 bg-slate-950 text-white">
        <div className="mx-auto flex min-h-8 max-w-7xl items-center justify-between gap-4 px-5 text-[10px] font-bold uppercase tracking-[0.16em] sm:px-8">
          <span>Mechanical sealing products</span>
          <span className="hidden text-slate-300 sm:inline">India supply · Export enquiries</span>
        </div>
      </div>
      <div className="relative mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 py-2 sm:px-8">
        <Brand companyName={companyName} />
        <nav
          className="hidden items-center gap-4 text-[13px] font-bold text-slate-700 xl:flex xl:gap-6"
          aria-label="Primary navigation"
        >
          {primaryNavigation.map((item) => (
            <Link className="border-b-2 border-transparent py-2 transition-colors hover:border-orange-500 hover:text-slate-950" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <details className="relative ml-auto xl:hidden">
          <summary className="cursor-pointer list-none border border-slate-300 px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-950 marker:hidden">
            Menu
          </summary>
          <nav className="absolute right-0 top-full mt-3 grid w-64 border border-slate-200 bg-white p-3 text-sm font-bold text-slate-700 shadow-[0_20px_60px_rgba(15,23,42,0.16)]" aria-label="Mobile navigation">
            {primaryNavigation.map((item) => (
              <Link className="px-3 py-3 hover:bg-orange-50 hover:text-orange-700" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="mt-2 inline-flex items-center justify-center gap-2 bg-whatsapp px-3 py-3 text-center text-xs uppercase tracking-[0.12em] text-white" href="/quote">
              <WhatsAppIcon className="size-4" />
              WhatsApp quote
            </Link>
          </nav>
        </details>
        <Link
          className="hidden min-h-11 items-center justify-center gap-2 rounded-sm bg-whatsapp px-4 text-xs font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-whatsapp-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp sm:inline-flex sm:px-5"
          href="/quote"
        >
          <WhatsAppIcon className="size-4" />
          WhatsApp quote
        </Link>
      </div>
    </header>
  )
}
