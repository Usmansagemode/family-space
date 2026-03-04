import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LayoutGrid, CalendarDays } from 'lucide-react'
import { SpaceView } from '#/components/board/SpaceView'
import { CalendarView } from '#/components/CalendarView'
import { LoginPage } from '#/components/auth/LoginPage'
import { Skeleton } from '#/components/ui/skeleton'
import { cn } from '#/lib/utils'
import { useAuthContext } from '#/contexts/auth'
import { useUserFamily } from '#/hooks/auth/useUserFamily'
import { isDemoMode } from '#/lib/supabase'
import { DEMO_FAMILY_ID } from '#/lib/config'

export const Route = createFileRoute('/')({
  component: BoardPage,
})

type Tab = 'board' | 'calendar'

function BoardPage() {
  if (isDemoMode) {
    return (
      <FamilyContent
        familyId={DEMO_FAMILY_ID}
        providerToken={null}
        calendarId={null}
      />
    )
  }
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
  const [tab, setTab] = useState<Tab>(() => {
    try {
      const stored = window.localStorage.getItem('fs-tab')
      if (stored === 'calendar') return 'calendar'
    } catch {}
    return 'board'
  })

  function handleTabChange(newTab: Tab) {
    setTab(newTab)
    try {
      window.localStorage.setItem('fs-tab', newTab)
    } catch {}
  }

  return (
    <div className="flex h-full">
      {/* Vertical tab sidebar */}
      <div className="flex shrink-0 flex-col border-r border-border/40 py-3">
        <TabButton
          active={tab === 'board'}
          icon={<LayoutGrid className="h-4 w-4" />}
          onClick={() => handleTabChange('board')}
        >
          Spaces
        </TabButton>
        <TabButton
          active={tab === 'calendar'}
          icon={<CalendarDays className="h-4 w-4" />}
          onClick={() => handleTabChange('calendar')}
        >
          Calendar
        </TabButton>
      </div>

      {/* Content — both mounted to preserve iframe state */}
      <div className={cn('min-w-0 flex-1', tab !== 'board' && 'hidden')}>
        <SpaceView
          familyId={familyId}
          providerToken={providerToken}
          calendarId={calendarId}
        />
      </div>
      <div className={cn('min-w-0 flex-1', tab !== 'calendar' && 'hidden')}>
        <CalendarView embedUrl={embedUrl} />
      </div>
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
