'use client'

import { useEffect, useRef, useState } from 'react'

type TurnstileApi = {
  render: (
    container: HTMLElement | string,
    options: {
      sitekey: string
      action?: string
      theme?: 'light' | 'dark' | 'auto'
      size?: 'normal' | 'compact' | 'flexible'
      callback: (token: string) => void
      'error-callback': () => void
      'expired-callback': () => void
    },
  ) => string
  remove: (widgetId: string) => void
  reset: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT_ID = 'cloudflare-turnstile-script'

export function TurnstileWidget({
  siteKey,
  onToken,
  resetSignal,
}: {
  siteKey: string
  onToken: (token: string | null) => void
  resetSignal: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let active = true

    const renderWidget = () => {
      if (!active || !containerRef.current || !window.turnstile || widgetIdRef.current) {
        return
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action: 'quotation_submit',
        theme: 'light',
        size: 'flexible',
        callback: (token) => {
          setLoadError(false)
          onToken(token)
        },
        'error-callback': () => {
          setLoadError(true)
          onToken(null)
        },
        'expired-callback': () => onToken(null),
      })
    }

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null

    if (window.turnstile) {
      renderWidget()
    } else if (existingScript) {
      existingScript.addEventListener('load', renderWidget)
      existingScript.addEventListener('error', () => setLoadError(true), { once: true })
    } else {
      const script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.addEventListener('load', renderWidget)
      script.addEventListener('error', () => setLoadError(true), { once: true })
      document.head.appendChild(script)
    }

    return () => {
      active = false
      existingScript?.removeEventListener('load', renderWidget)

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [onToken, siteKey])

  useEffect(() => {
    if (resetSignal > 0 && widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current)
      onToken(null)
    }
  }, [onToken, resetSignal])

  return (
    <div>
      <div className="min-h-16" ref={containerRef} />
      {loadError && (
        <p className="mt-2 text-xs font-bold text-black">
          Security check load nahi hua. Connection check karke page refresh karein.
        </p>
      )}
    </div>
  )
}
