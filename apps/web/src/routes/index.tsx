import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ShoppingCart, CheckCheck, CalendarDays, Search } from 'lucide-react'
import { SpaceView } from '#/components/board/SpaceView'
import { CalendarView } from '#/components/CalendarView'
import { LoginPage } from '#/components/auth/LoginPage'
import { SearchDialog } from '#/components/SearchDialog'
import { Skeleton } from '#/components/ui/skeleton'
import { cn } from '#/lib/utils'
import { useAuthContext } from '#/contexts/auth'
import { useUserFamily } from '#/hooks/auth/useUserFamily'

export const Route = createFileRoute('/')({
  component: BoardPage,
})

type Tab = 'lists' | 'chores' | 'calendar'

function BoardPage() {
  return <AuthGate />
}

function AuthGate() {
  const { user, loading } = useAuthContext()

  if (loading) return <BoardSkeleton />
  if (!user) return <LoginPage />
  return <FamilyBoard userId={user.id} />
}

function FamilyBoard({ userId }: { userId: string }) {
  const { providerToken } = useAuthContext()
  const { data: family, isLoading } = useUserFamily(userId)

  if (isLoading) return <BoardSkeleton />
  if (!family) return null

  return (
    <FamilyContent
      familyId={family.id}
      providerToken={providerToken}
      calendarId={family.googleCalendarId ?? null}
      embedUrl={family.googleCalendarEmbedUrl}
    />
  )
}

function FamilyContent({
  familyId,
  providerToken,
  calendarId,
  embedUrl,
}: {
  familyId: string
  providerToken: string | null
  calendarId: string | null
  embedUrl?: string
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [tab, setTab] = useState<Tab>(() => {
    try {
      const stored = window.localStorage.getItem('fs-tab')
      if (stored === 'chores') return 'chores'
      if (stored === 'calendar') return 'calendar'
    } catch {}
    return 'lists'
  })

  // Redirect calendar tab to lists on mobile (no calendar tab in mobile nav)
  useEffect(() => {
    if (tab === 'calendar' && window.innerWidth < 640) {
      setTab('lists')
    }
  }, [tab])

  function handleTabChange(newTab: Tab) {
    setTab(newTab)
    try {
      window.localStorage.setItem('fs-tab', newTab)
    } catch {}
  }

  return (
    <div className="flex h-full">
      {/* Vertical tab sidebar — desktop only */}
      <div className="hidden shrink-0 flex-col border-r border-border/40 py-3 sm:flex">
        <TabButton
          active={tab === 'lists'}
          icon={<ShoppingCart className="h-4 w-4" />}
          onClick={() => handleTabChange('lists')}
        >
          Lists
        </TabButton>
        <TabButton
          active={tab === 'chores'}
          icon={<CheckCheck className="h-4 w-4" />}
          onClick={() => handleTabChange('chores')}
        >
          Chores
        </TabButton>
        <TabButton
          active={tab === 'calendar'}
          icon={<CalendarDays className="h-4 w-4" />}
          onClick={() => handleTabChange('calendar')}
        >
          Calendar
        </TabButton>
        <TabButton
          active={false}
          icon={<Search className="h-4 w-4" />}
          onClick={() => setSearchOpen(true)}
        >
          Search
        </TabButton>
      </div>

      {/* Content + mobile bottom nav */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* SpaceView — remounts when switching between lists/chores */}
        {tab === 'lists' && (
          <div className="min-h-0 flex-1">
            <SpaceView
              familyId={familyId}
              providerToken={providerToken}
              calendarId={calendarId}
              typeFilter="store"
            />
          </div>
        )}
        {tab === 'chores' && (
          <div className="min-h-0 flex-1">
            <SpaceView
              familyId={familyId}
              providerToken={providerToken}
              calendarId={calendarId}
              typeFilter="person"
            />
          </div>
        )}
        {/* CalendarView mounted always to preserve iframe state — desktop only */}
        <div className={cn('min-h-0 flex-1', tab !== 'calendar' && 'hidden')}>
          <CalendarView embedUrl={embedUrl} />
        </div>

        {/* Bottom tab bar — mobile only (no Calendar tab) */}
        <div className="flex shrink-0 border-t border-border/40 bg-background/90 backdrop-blur-sm sm:hidden">
          <MobileTabButton
            active={tab === 'lists'}
            icon={<ShoppingCart className="h-5 w-5" />}
            onClick={() => handleTabChange('lists')}
          >
            Lists
          </MobileTabButton>
          <MobileTabButton
            active={tab === 'chores'}
            icon={<CheckCheck className="h-5 w-5" />}
            onClick={() => handleTabChange('chores')}
          >
            Chores
          </MobileTabButton>
          <MobileTabButton
            active={false}
            icon={<Search className="h-5 w-5" />}
            onClick={() => setSearchOpen(true)}
          >
            Search
          </MobileTabButton>
        </div>
      </div>
      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        familyId={familyId}
        providerToken={providerToken}
        calendarId={calendarId ?? null}
      />
    </div>
  )
}

function TabButton({
  active,
  icon,
  onClick,
  children,
}: {
  active: boolean
  icon: React.ReactNode
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center gap-1.5 px-3 py-3 text-[10px] font-medium tracking-wide transition-colors',
        active
          ? 'text-foreground'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {/* Active indicator — right edge bar */}
      {active && (
        <span className="absolute right-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-foreground" />
      )}
      {icon}
      {children}
    </button>
  )
}

function MobileTabButton({
  active,
  icon,
  onClick,
  children,
}: {
  active: boolean
  icon: React.ReactNode
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium tracking-wide transition-colors',
        active ? 'text-foreground' : 'text-muted-foreground',
      )}
    >
      {icon}
      {children}
    </button>
  )
}

function BoardSkeleton() {
  return (
    <div className="flex h-full gap-4 p-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex h-full w-72 shrink-0 flex-col gap-3 rounded-xl border border-border bg-muted/30 p-3"
        >
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </div>
      ))}
    </div>
  )
}
