import { Link, useRouterState } from '@tanstack/react-router'
import {
  BarChart3,
  CalendarDays,
  CheckCheck,
  Receipt,
  Settings,
  ShoppingCart,
  SplitSquareVertical,
  TrendingUp,
  Upload,
} from 'lucide-react'
import { cn } from '#/lib/utils'
import { useAuthContext } from '#/contexts/auth'
import { useUserFamily } from '#/hooks/auth/useUserFamily'

type NavItem =
  | { kind: 'link'; to: string; search?: Record<string, string>; exact: boolean; label: string; icon: React.ElementType }
  | { kind: 'button'; label: string; icon: React.ElementType; onClick: () => void }
  | { kind: 'separator' }

export function AppNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const search = useRouterState({ select: (s) => s.location.search as Record<string, string> })

  const { user } = useAuthContext()
  const { data: family } = useUserFamily(user?.id ?? '')

  function isActive(to: string, exact: boolean, searchParams?: Record<string, string>) {
    if (pathname !== to && (exact || !pathname.startsWith(to + '/'))) return false
    if (searchParams) {
      return Object.entries(searchParams).every(([k, v]) => (search as Record<string, string>)[k] === v)
    }
    return true
  }

  const items: NavItem[] = [
    { kind: 'link', to: '/charts', exact: false, label: 'Charts', icon: BarChart3 },
    { kind: 'link', to: '/expenses', exact: false, label: 'Expenses', icon: Receipt },
    { kind: 'link', to: '/import', exact: false, label: 'Import', icon: Upload },
    { kind: 'link', to: '/trackers', exact: false, label: 'Tracker', icon: TrendingUp },
    { kind: 'link', to: '/splits', exact: false, label: 'Splits', icon: SplitSquareVertical },
    { kind: 'separator' },
    { kind: 'link', to: '/', exact: true, search: { tab: 'lists' }, label: 'Lists', icon: ShoppingCart },
    { kind: 'link', to: '/', exact: true, search: { tab: 'chores' }, label: 'Tasks', icon: CheckCheck },
    { kind: 'link', to: '/', exact: true, search: { tab: 'calendar' }, label: 'Calendar', icon: CalendarDays },
    { kind: 'separator' },
    { kind: 'link', to: '/settings', exact: false, label: 'Settings', icon: Settings },
  ]

  // For board items with no explicit tab param, default Lists is active when tab is missing
  function isBoardItemActive(item: Extract<NavItem, { kind: 'link' }>) {
    if (item.to !== '/') return isActive(item.to, item.exact)
    if (pathname !== '/') return false
    const currentTab = (search as Record<string, string>).tab ?? 'lists'
    return currentTab === item.search?.tab
  }

  return (
    <>
      {/* Desktop: left vertical sidebar */}
      <nav className="hidden shrink-0 flex-col border-r border-border/40 py-3 print:hidden sm:flex">
        {items.map((item, i) => {
          if (item.kind === 'separator') {
            return <div key={i} className="mx-3 my-1.5 border-t border-border/40" />
          }

          if (item.kind === 'button') {
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="flex flex-col items-center gap-1.5 px-3 py-2.5 text-[10px] font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted">
                  <item.icon className="h-4 w-4" />
                </span>
                {item.label}
              </button>
            )
          }

          const active = isBoardItemActive(item)
          return (
            <Link
              key={item.label}
              to={item.to}
              search={item.search}
              style={{ color: 'inherit', textDecoration: 'none' }}
              className={cn(
                'relative flex flex-col items-center gap-1.5 px-3 py-2.5 text-[10px] font-medium tracking-wide transition-colors',
                active ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                  active ? 'bg-emerald-500/10' : 'hover:bg-muted',
                )}
              >
                <item.icon className="h-4 w-4" />
              </span>
              {item.label}
              {active && (
                <span className="absolute right-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-emerald-500" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Mobile: fixed bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-border/40 bg-background/95 backdrop-blur-sm print:hidden sm:hidden">
        {[
          { to: '/charts', label: 'Charts', icon: BarChart3 },
          { to: '/expenses', label: 'Expenses', icon: Receipt },
          { to: '/splits', label: 'Splits', icon: SplitSquareVertical },
          { to: '/', search: { tab: 'lists' }, label: 'Lists', icon: ShoppingCart },
          { to: '/', search: { tab: 'chores' }, label: 'Tasks', icon: CheckCheck },
        ].map((item) => {
          const active = item.to === '/'
            ? pathname === '/' && ((search as Record<string, string>).tab ?? 'lists') === item.search?.tab
            : pathname === item.to || pathname.startsWith(item.to + '/')
          return (
            <Link
              key={item.label}
              to={item.to}
              search={item.search}
              style={{ color: 'inherit', textDecoration: 'none' }}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium tracking-wide transition-colors',
                active
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-muted-foreground',
              )}
            >
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                  active && 'bg-emerald-500/10',
                )}
              >
                <item.icon className="h-5 w-5" />
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

    </>
  )
}
