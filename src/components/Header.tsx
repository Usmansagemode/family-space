import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Sun, Moon, Settings, LogOut, User, Activity } from 'lucide-react'
import { fetchFamily } from '#/lib/supabase/families'
import type { Family } from '#/lib/supabase/families'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '#/components/ui/dropdown-menu'
import { Badge } from '#/components/ui/badge'
import { Skeleton } from '#/components/ui/skeleton'
import { isDemoMode } from '#/lib/supabase'
import { useAuthContext } from '#/contexts/auth'
import { useIsDark } from '#/hooks/useIsDark'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { SettingsSheet } from './SettingsSheet'
import { ActivitySheet } from './ActivitySheet'
import { DEMO_FAMILY_ID } from '#/lib/config'

function applyTheme(mode: 'light' | 'dark') {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(mode)
  document.documentElement.setAttribute('data-theme', mode)
  document.documentElement.style.colorScheme = mode
}

export function Header() {
  const { user, signOut } = useAuthContext()
  const isDark = useIsDark()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activityOpen, setActivityOpen] = useState(false)

  const { data: demoFamily, isLoading: demoLoading } = useQuery({
    queryKey: ['family', DEMO_FAMILY_ID],
    queryFn: () => fetchFamily(DEMO_FAMILY_ID),
    enabled: isDemoMode,
    staleTime: Infinity,
  })

  // Don't fetch here — just subscribe to the cache the board page populates.
  // This avoids a race where Header caches null (no membership yet) with
  // staleTime:Infinity, which would prevent findOrCreateFamily from ever running.
  const userFamily = useQuery<Family>({
    queryKey: ['family', 'user', user?.id],
    queryFn: () => {
      throw new Error('unreachable')
    },
    enabled: false,
  }).data

  // Show skeleton while user is logged in but family hasn't been fetched yet
  const userFamilyLoading = !isDemoMode && !!user && userFamily === undefined

  const familyName = isDemoMode ? demoFamily?.name : userFamily?.name
  const familyNameLoading = isDemoMode ? demoLoading : userFamilyLoading

  function toggleTheme() {
    const next = isDark ? 'light' : 'dark'
    applyTheme(next)
    window.localStorage.setItem('theme', next)
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-[var(--header-bg)] px-4 backdrop-blur-md">
      {/* Title */}
      <div className="flex items-center gap-2.5">
        <img
          src="/family-space-logo.jpg"
          alt="Family Space"
          className="h-7 w-7 shrink-0 rounded-lg object-cover"
        />
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-none tracking-tight">
            Family Space
          </span>
          {familyNameLoading ? (
            <Skeleton className="mt-1 h-3 w-20" />
          ) : familyName ? (
            <span className="mt-0.5 text-[11px] leading-none text-muted-foreground">
              {familyName}
            </span>
          ) : null}
        </div>
        {isDemoMode && (
          <Badge variant="secondary" className="text-xs">
            Demo
          </Badge>
        )}
      </div>

      {/* Activity button */}
      {!isDemoMode && !!user && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setActivityOpen(true)}
              className="ml-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Activity className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Recent activity</TooltipContent>
        </Tooltip>
      )}

      {/* Avatar dropdown — only shown when authenticated */}
      {(isDemoMode || !!user) && (
        <div className={!isDemoMode && !!user ? '' : 'ml-auto'}>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ring-1 ring-border transition hover:ring-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {user?.user_metadata.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url as string}
                        className="h-8 w-8 rounded-full"
                        alt=""
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Account</TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="end" className="w-52">
              {/* User info */}
              {user && (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium leading-none">
                        {user.user_metadata.name as string}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </>
              )}

              {/* Dark mode toggle */}
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  toggleTheme()
                }}
              >
                {isDark ? <Sun /> : <Moon />}
                {isDark ? 'Light mode' : 'Dark mode'}
              </DropdownMenuItem>

              {/* Real mode only */}
              {!isDemoMode && (
                <>
                  <DropdownMenuItem onSelect={() => setSettingsOpen(true)}>
                    <Settings />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => void signOut()}
                  >
                    <LogOut />
                    Sign out
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {!isDemoMode && !!user && (
        <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
      )}
      {!isDemoMode && !!user && (
        <ActivitySheet
          open={activityOpen}
          onOpenChange={setActivityOpen}
          familyId={userFamily?.id}
        />
      )}
    </header>
  )
}

export default Header
