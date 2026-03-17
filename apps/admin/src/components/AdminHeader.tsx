import { LogOut, Shield } from 'lucide-react'
import { useAdminAuth } from '@/contexts/auth'

export function AdminHeader() {
  const { adminUser, signOut } = useAdminAuth()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      <div />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium text-foreground">
            {adminUser?.email ?? 'Admin'}
          </span>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </header>
  )
}
