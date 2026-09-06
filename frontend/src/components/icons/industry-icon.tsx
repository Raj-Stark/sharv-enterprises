export type IndustryIconName =
  | 'logistics'
  | 'shipping'
  | 'ecommerce'
  | 'automobile'
  | 'pharmaceuticals'
  | 'fmcg'
  | 'food'
  | 'textile'
  | 'electronics'

export function IndustryIcon({
  name,
  className = 'size-6',
}: {
  name: IndustryIconName
  className?: string
}) {
  const commonProps = {
    className,
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
    'aria-hidden': true,
  }

  switch (name) {
    case 'logistics':
      return (
        <svg {...commonProps}>
          <path d="M3 6.5h11v9H3zM14 9.5h4l3 3v3h-7z" />
          <path d="M6.5 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17.5 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        </svg>
      )
    case 'shipping':
      return (
        <svg {...commonProps}>
          <path d="M3 7h18v11H3zM7 7v11M11 7v11M15 7v11M19 7v11" />
          <path d="M5 4h14" />
        </svg>
      )
    case 'ecommerce':
      return (
        <svg {...commonProps}>
          <path d="M5 8h14l-1 12H6L5 8Z" />
          <path d="M9 9V6a3 3 0 0 1 6 0v3M9 13h6" />
        </svg>
      )
    case 'automobile':
      return (
        <svg {...commonProps}>
          <path d="m4 14 2-5h12l2 5v4H4v-4Z" />
          <path d="M7 18v2M17 18v2M6 14h12M8 9l1-3h6l1 3" />
          <circle cx="8" cy="15.5" r="1" /><circle cx="16" cy="15.5" r="1" />
        </svg>
      )
    case 'pharmaceuticals':
      return (
        <svg {...commonProps}>
          <rect x="5" y="3" width="14" height="18" rx="3" />
          <path d="M9 3v4h6V3M12 10v7M8.5 13.5h7" />
        </svg>
      )
    case 'fmcg':
      return (
        <svg {...commonProps}>
          <path d="m4 7 8-4 8 4-8 4-8-4Z" />
          <path d="m4 7 8 4v10l-8-4V7ZM20 7l-8 4v10l8-4V7Z" />
          <path d="m8 5 8 4" />
        </svg>
      )
    case 'food':
      return (
        <svg {...commonProps}>
          <path d="M7 3v6M4.5 3v4.5A1.5 1.5 0 0 0 6 9v12M9.5 3v4.5A1.5 1.5 0 0 1 8 9" />
          <path d="M15 21v-7M15 14c0-6 2-10 5-11v18" />
        </svg>
      )
    case 'textile':
      return (
        <svg {...commonProps}>
          <path d="m8 4-5 3 2.5 4L8 9v11h8V9l2.5 2L21 7l-5-3a4.5 4.5 0 0 1-8 0Z" />
          <path d="M9.5 4a2.5 2.5 0 0 0 5 0" />
        </svg>
      )
    case 'electronics':
      return (
        <svg {...commonProps}>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
          <path d="m13 8-3 5h3l-2 4" />
        </svg>
      )
  }
}
