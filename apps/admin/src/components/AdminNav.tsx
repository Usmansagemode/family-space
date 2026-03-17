import { Link } from '@tanstack/react-router'
import {
  BarChart3,
  Building2,
  CreditCard,
  LayoutDashboard,
  Mail,
  ScrollText,
  ToggleLeft,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/families', label: 'Families', icon: Building2 },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/billing', label: 'Billing', icon: CreditCard },
  { to: '/feature-flags', label: 'Feature Flags', icon: ToggleLeft },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/invites', label: 'Invites', icon: Mail },
  { to: '/audit', label: 'Audit Log', icon: ScrollText },
] as const

export function AdminNav() {
  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <span className="font-semibold text-sidebar-foreground tracking-tight">
          Family Space
          <span className="ml-1.5 rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
            Admin
          </span>
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors',
              'hover:bg-sidebar-accent hover:text-sidebar-foreground',
              '[&.active]:bg-sidebar-accent [&.active]:text-sidebar-primary',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
