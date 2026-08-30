'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'
import {
  OFFICIAL_EMAIL,
  OFFICIAL_WHATSAPP_DISPLAY,
  OFFICIAL_WHATSAPP_URL,
} from '@/lib/business/contact'

import { Brand } from './brand'

type SiteHeaderProps = {
  companyName?: string
  enquiryEmail?: string
}

const primaryNavigation = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About us' },
  { href: '/products', label: 'Products' },
  { href: '/applications', label: 'Applications' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/contact', label: 'Contact' },
] as const

function isNavigationItemActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteHeader({ companyName, enquiryEmail = OFFICIAL_EMAIL }: SiteHeaderProps) {
  const pathname = usePathname()
  const mobileMenuRef = useRef<HTMLDetailsElement>(null)
  const quoteIsActive = pathname === '/quote'

  useEffect(() => {
    mobileMenuRef.current?.removeAttribute('open')
  }, [pathname])

  function closeMobileMenu() {
    mobileMenuRef.current?.removeAttribute('open')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl">
      <div className="bg-brand-navy text-white">
        <div className="mx-auto flex min-h-7 max-w-7xl items-center justify-between gap-4 px-5 text-[10px] font-extrabold uppercase tracking-[0.1em] sm:px-8">
          <span className="hidden sm:inline">Packaging · Protection · Security</span>
          <div className="flex w-full items-center justify-between gap-3 text-blue-100/75 sm:w-auto sm:justify-end">
            <a className="transition hover:text-white" href={`mailto:${enquiryEmail}`}>
              <span className="sm:hidden">Email us</span>
              <span className="hidden sm:inline">Email {enquiryEmail}</span>
            </a>
            <span className="text-white/25" aria-hidden="true">•</span>
            <a className="transition hover:text-white" href={OFFICIAL_WHATSAPP_URL} rel="noreferrer" target="_blank">
              <span className="sm:hidden">WhatsApp</span>
              <span className="hidden sm:inline">WhatsApp {OFFICIAL_WHATSAPP_DISPLAY}</span>
            </a>
          </div>
        </div>
      </div>
      <div className="relative mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-5 py-2 sm:px-8">
        <Brand companyName={companyName} />
        <nav
          className="hidden items-center gap-5 text-sm font-semibold text-slate-700 lg:flex xl:gap-7"
          aria-label="Primary navigation"
        >
          {primaryNavigation.map((item) => {
            const isActive = isNavigationItemActive(pathname, item.href)

            return (
              <Link
                aria-current={isActive ? 'page' : undefined}
                className={`border-b-2 px-0.5 py-2 transition-colors ${isActive ? 'border-brand-blue font-extrabold text-brand-blue' : 'border-transparent hover:border-brand-blue hover:text-brand-blue'}`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <details className="relative ml-auto lg:hidden" ref={mobileMenuRef}>
          <summary className="cursor-pointer list-none rounded-lg border border-slate-300 px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-950 marker:hidden">
            Menu
          </summary>
          <nav className="absolute right-0 top-full mt-3 grid w-64 rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-700 shadow-[0_20px_60px_rgba(15,23,42,0.16)]" aria-label="Mobile navigation">
            {primaryNavigation.map((item) => {
              const isActive = isNavigationItemActive(pathname, item.href)

              return (
                <Link
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-lg border-l-2 px-3 py-3 transition-colors ${isActive ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-transparent hover:bg-blue-50 hover:text-brand-blue'}`}
                  href={item.href}
                  key={item.href}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              aria-current={quoteIsActive ? 'page' : undefined}
              className={`mt-2 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-center text-xs uppercase tracking-[0.12em] text-white transition-colors ${quoteIsActive ? 'bg-brand-navy ring-2 ring-blue-200' : 'bg-brand-blue hover:bg-brand-navy'}`}
              href="/quote"
              onClick={closeMobileMenu}
            >
              <WhatsAppIcon className="size-4" />
              Get a quote
            </Link>
          </nav>
        </details>
        <Link
          aria-current={quoteIsActive ? 'page' : undefined}
          className={`hidden min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-extrabold uppercase tracking-[0.07em] text-white transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue sm:inline-flex sm:px-5 ${quoteIsActive ? 'bg-brand-navy ring-2 ring-blue-200' : 'bg-brand-blue hover:bg-brand-navy'}`}
          href="/quote"
        >
          <WhatsAppIcon className="size-4 text-green-300" />
          Get a quote
        </Link>
      </div>
    </header>
  )
}
