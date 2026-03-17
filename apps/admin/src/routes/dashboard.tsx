import { createFileRoute } from '@tanstack/react-router'
import {
  BarChart3,
  Building2,
  Mail,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { AdminLayout } from '@/components/AdminLayout'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { usePlatformStats } from '@/hooks/usePlatformStats'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data: stats, isLoading } = usePlatformStats()

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Dashboard"
          description="Platform health overview"
        />

        {isLoading || !stats ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                label="Total Families"
                value={stats.totalFamilies}
                icon={Building2}
              />
              <StatCard
                label="Total Users"
                value={stats.totalUsers}
                icon={Users}
              />
              <StatCard
                label="Pending Invites"
                value={stats.pendingInvites}
                icon={Mail}
              />
              <StatCard
                label="Banned Users"
                value={stats.bannedUsers}
                icon={ShieldAlert}
              />
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Plan Distribution
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                  label="Free Families"
                  value={stats.freeFamilies}
                  icon={BarChart3}
                  className="border-muted"
                />
                <StatCard
                  label="Plus Families"
                  value={stats.plusFamilies}
                  icon={BarChart3}
                  className="border-blue-200 dark:border-blue-900/30"
                />
                <StatCard
                  label="Pro Families"
                  value={stats.proFamilies}
                  icon={BarChart3}
                  className="border-violet-200 dark:border-violet-900/30"
                />
              </div>
            </div>

            {stats.suspendedFamilies > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                  {stats.suspendedFamilies} family / families currently suspended
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  )
}
