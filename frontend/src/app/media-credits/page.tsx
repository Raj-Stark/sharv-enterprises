import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Media Credits',
  description: 'Source and licence details for third-party media used by Sharv Enterprises.',
  alternates: { canonical: '/media-credits' },
  robots: { index: false, follow: true },
}

const credits = [
  {
    title: 'Mechanical seal part01',
    creator: 'Miya.m',
    source: 'https://commons.wikimedia.org/wiki/File:Mechanical_seal_part01.jpg',
    licence: 'CC BY-SA 3.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    note: 'Original file retained; Strapi creates display-size variants.',
  },
  {
    title: 'Ultrananocrystalline diamond-coated pump seals',
    creator: 'U.S. Department of Energy',
    source:
      'https://commons.wikimedia.org/wiki/File:Ultrananocrystalline_diamond-coated_pump_seals.jpg',
    licence: 'Public domain (U.S. Government work)',
    licenceUrl:
      'https://commons.wikimedia.org/wiki/File:Ultrananocrystalline_diamond-coated_pump_seals.jpg#Licensing',
    note: 'Original file retained; Strapi creates display-size variants.',
  },
  {
    title: 'A Single Cartridge Seal',
    creator: 'GordonSBuck',
    source: 'https://commons.wikimedia.org/wiki/File:A_Single_Cartridge_Seal.jpg',
    licence: 'CC BY-SA 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    note: 'Original file retained; Strapi creates display-size variants.',
  },
]

export default function MediaCreditsPage() {
  return (
    <main className="bg-brand-surface py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
          Image provenance
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
          Media credits
        </h1>
        <p className="mt-5 max-w-2xl leading-7 text-slate-600">
          These source and licence details cover third-party mechanical-seal media used in
          the demonstration catalogue and technical articles.
        </p>

        <div className="mt-10 space-y-4">
          {credits.map((credit) => (
            <article className="border border-slate-200 bg-white p-6" key={credit.title}>
              <h2 className="text-xl font-black text-slate-950">{credit.title}</h2>
              <p className="mt-2 text-sm text-slate-600">Creator: {credit.creator}</p>
              <p className="mt-1 text-sm text-slate-600">{credit.note}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                <a
                  className="text-orange-700 underline underline-offset-4 hover:text-orange-900"
                  href={credit.source}
                  rel="noreferrer"
                  target="_blank"
                >
                  View original source
                </a>
                <a
                  className="text-orange-700 underline underline-offset-4 hover:text-orange-900"
                  href={credit.licenceUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {credit.licence}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
