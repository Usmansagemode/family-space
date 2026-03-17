import { useEffect, useRef, useState } from 'react'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { AlertTriangle } from 'lucide-react'
import { Toaster } from '#/components/ui/sonner'
import { TooltipProvider } from '#/components/ui/tooltip'
import { Header } from '#/components/Header'
import { AppNav } from '#/components/AppNav'
import { AuthProvider } from '#/contexts/auth'
import { useAuthContext } from '#/contexts/auth'
import { useUserFamily } from '#/hooks/auth/useUserFamily'
import { useBannedCheck } from '#/hooks/auth/useBannedCheck'

import TanStackQueryProvider from '#/integrations/tanstack-query/root-provider'
import TanStackQueryDevtools from '#/integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=stored==='dark'?'dark':stored==='light'?'light':(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(mode);root.setAttribute('data-theme',mode);root.style.colorScheme=mode;}catch(e){}})();`

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Family Space' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-title', content: 'Family Space' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/family-space-logo.jpg', type: 'image/jpeg' },
      { rel: 'apple-touch-icon', href: '/family-space-logo.jpg' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
  shellComponent: RootDocument,
})

const PULL_THRESHOLD = 80

function SuspendedOverlay({ reason }: { reason: string | null }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold">Account Suspended</h1>
      <p className="max-w-sm text-muted-foreground">
        {reason
          ? reason
          : 'Your family account has been suspended. Please contact support for assistance.'}
      </p>
      <p className="text-sm text-muted-foreground">
        Email:{' '}
        <a href="mailto:support@familyspace.app" className="underline">
          support@familyspace.app
        </a>
      </p>
    </div>
  )
}

function BannedOverlay({ reason }: { reason: string | null }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold">Account Suspended</h1>
      <p className="max-w-sm text-muted-foreground">
        {reason
          ? reason
          : 'Your account has been suspended. Please contact support for assistance.'}
      </p>
      <p className="text-sm text-muted-foreground">
        Email:{' '}
        <a href="mailto:support@familyspace.app" className="underline">
          support@familyspace.app
        </a>
      </p>
    </div>
  )
}

function AuthedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext()
  const { data: family } = useUserFamily(user?.id)
  const { banned, banReason } = useBannedCheck(user?.id)
  const mainRef = useRef<HTMLElement>(null)
  const touchStartY = useRef(0)
  const [pullProgress, setPullProgress] = useState(0) // 0–1
  const [releasing, setReleasing] = useState(false)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return

    function onTouchStart(e: TouchEvent) {
      touchStartY.current = e.touches[0].clientY
      setReleasing(false)
    }

    function onTouchMove(e: TouchEvent) {
      if (el!.scrollTop > 0) {
        setPullProgress(0)
        return
      }
      const delta = e.touches[0].clientY - touchStartY.current
      if (delta > 0) setPullProgress(Math.min(delta / PULL_THRESHOLD, 1))
    }

    function onTouchEnd() {
      if (pullProgress >= 1) {
        setReleasing(true)
        setTimeout(() => window.location.reload(), 300)
      } else {
        setPullProgress(0)
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd)
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [pullProgress])

  if (!user) return <>{children}</>

  // User banned — sign out already triggered by useBannedCheck
  if (banned) {
    return <BannedOverlay reason={banReason} />
  }

  // Family suspended — show full-screen block instead of app content
  if (family?.suspendedAt) {
    return <SuspendedOverlay reason={(family as { suspendReason?: string | null }).suspendReason ?? null} />
  }

  return (
    <div className="relative flex min-h-0 flex-1">
      <AppNav />
      {/* Pull-to-refresh indicator — mobile only */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-50 flex justify-center sm:hidden"
        style={{
          transform: `translateY(${releasing ? 8 : (pullProgress * 48 - 40)}px)`,
          opacity: pullProgress,
          transition: releasing ? 'opacity 0.2s' : undefined,
        }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-md ring-1 ring-border">
          <svg
            className={`h-4 w-4 text-emerald-500 ${releasing ? 'animate-spin' : ''}`}
            style={releasing ? undefined : { transform: `rotate(${pullProgress * 360}deg)` }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
        </div>
      </div>
      <main ref={mainRef} className="flex min-h-0 flex-1 flex-col overflow-auto overscroll-contain pb-16 sm:pb-0">
        {children}
      </main>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere]">
        <AuthProvider>
          <TanStackQueryProvider>
            <TooltipProvider>
              <div className="flex h-screen flex-col overflow-hidden">
                <Header />
                <AuthedLayout>{children}</AuthedLayout>
              </div>
            </TooltipProvider>
            <Toaster richColors position="bottom-right" />
            <TanStackDevtools
              config={{ position: 'bottom-right' }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
              ]}
            />
          </TanStackQueryProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  )
}
