import { createFileRoute } from '@tanstack/react-router'
import { Ban, CheckCircle, Shield, ShieldOff } from 'lucide-react'
import { AdminLayout } from '@/components/AdminLayout'
import { PageHeader } from '@/components/shared/PageHeader'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useAdminUser, useAdminUserMutations } from '@/hooks/useAdminUsers'
import { formatDate } from '@/lib/utils'

export const Route = createFileRoute('/users/$userId')({
  component: UserDetailPage,
})

function UserDetailPage() {
  const { userId } = Route.useParams()
  const { data: user, isLoading } = useAdminUser(userId)
  const { ban, unban, promote, demote } = useAdminUserMutations()

  if (isLoading || !user) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded-lg bg-muted" />
          <div className="h-48 rounded-xl bg-muted" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <PageHeader
          title={user.name ?? user.email ?? 'User'}
          description={`ID: ${user.id}`}
          action={
            <div className="flex items-center gap-2">
              {user.isAdmin ? (
                <ConfirmDialog
                  title="Remove admin privileges"
                  description={`Remove admin access for ${user.name ?? user.email}?`}
                  confirmLabel="Remove"
                  destructive
                  onConfirm={() => demote.mutateAsync({ userId })}
                  trigger={
                    <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent">
                      <ShieldOff className="h-4 w-4" />
                      Remove Admin
                    </button>
                  }
                />
              ) : (
                <ConfirmDialog
                  title="Promote to admin"
                  description={`Grant ${user.name ?? user.email} full admin access to this portal?`}
                  confirmLabel="Promote"
                  onConfirm={() => promote.mutateAsync({ userId })}
                  trigger={
                    <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent">
                      <Shield className="h-4 w-4" />
                      Make Admin
                    </button>
                  }
                />
              )}

              {user.bannedAt ? (
                <ConfirmDialog
                  title="Unban user"
                  description={`Restore account access for ${user.name ?? user.email}?`}
                  confirmLabel="Unban"
                  onConfirm={() => unban.mutateAsync({ userId })}
                  trigger={
                    <button className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                      <CheckCircle className="h-4 w-4" />
                      Unban
                    </button>
                  }
                />
              ) : (
                <ConfirmDialog
                  title="Ban user"
                  description={`This will block ${user.name ?? user.email} from signing in. A reason is required.`}
                  confirmLabel="Ban"
                  destructive
                  onConfirm={async () => {
                    const reason = window.prompt('Reason for ban:')
                    if (reason) await ban.mutateAsync({ userId, reason })
                  }}
                  trigger={
                    <button className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/20">
                      <Ban className="h-4 w-4" />
                      Ban
                    </button>
                  }
                />
              )}
            </div>
          }
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[
            { label: 'Email', value: user.email ?? '—' },
            { label: 'Families', value: user.familyCount },
            { label: 'Joined', value: formatDate(user.createdAt) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p className="mt-1 text-base font-semibold">{String(value)}</p>
            </div>
          ))}
        </div>

        {user.isAdmin && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Shield className="h-4 w-4" />
              This user has admin access to the portal
            </p>
          </div>
        )}

        {user.bannedAt && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-950/20">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              Banned {formatDate(user.bannedAt)}
            </p>
            {user.banReason && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                Reason: {user.banReason}
              </p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
