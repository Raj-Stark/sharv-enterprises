import Link from 'next/link'

import {
  OFFICIAL_COMPANY_NAME,
  OFFICIAL_EMAIL,
  OFFICIAL_PHONE_DISPLAY,
  OFFICIAL_PHONE_URL,
  OFFICIAL_WHATSAPP_DISPLAY,
  OFFICIAL_WHATSAPP_URL,
} from '@/lib/business/contact'
import type { SiteSetting } from '@/lib/strapi/types'

import { Brand } from './brand'

type SiteFooterProps = {
  setting?: SiteSetting | null
}

export function SiteFooter({ setting }: SiteFooterProps) {
  const companyName = setting?.companyName ?? OFFICIAL_COMPANY_NAME
  const enquiryEmail = setting?.enquiryEmail?.trim() || OFFICIAL_EMAIL
  const enquiryPhone = setting?.phone?.trim() || OFFICIAL_PHONE_DISPLAY
  const enquiryPhoneUrl = setting?.phone?.trim()
    ? `tel:${enquiryPhone.replace(/[^\d+]/g, '')}`
    : OFFICIAL_PHONE_URL

  return (
    <footer className="border-t-4 border-orange-500 bg-slate-950 text-slate-300" id="site-footer">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div className="max-w-md">
          <div className="max-w-sm">
            <Brand companyName={companyName} tone="inverse" />
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            Packaging materials, protective supplies and security seals with
            product-led quotation support for domestic and export enquiries.
          </p>
        </div>
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-[0.1em] text-white">
            Explore
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link className="hover:text-white" href="/products">
                Product catalogue
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/products#families">
                Product categories
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/applications">
                Use cases
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/blogs">
                Packaging guides
              </Link>
            </li>
            <li><Link className="hover:text-white" href="/about">About us</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-[0.1em] text-white">
            Buying
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link className="hover:text-white" href="/quote">WhatsApp quotation</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-[0.1em] text-white">
            Enquiries
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a className="font-bold text-white hover:text-green-300" href={OFFICIAL_WHATSAPP_URL} rel="noreferrer" target="_blank">
                WhatsApp {OFFICIAL_WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a className="break-all hover:text-white" href={`mailto:${enquiryEmail}`}>
                {enquiryEmail}
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={enquiryPhoneUrl}>
                {enquiryPhone}
              </a>
            </li>
            <li>
              <Link className="hover:text-white" href="/quote">
                Tracked WhatsApp enquiry
              </Link>
            </li>
            <li><Link className="hover:text-white" href="/contact">Contact us</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} {companyName}</span>
          <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>Product availability and specifications subject to confirmation.</span>
            <Link className="hover:text-slate-300" href="/media-credits">
              Media credits
            </Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
