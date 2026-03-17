import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { AdminLayout } from '@/components/AdminLayout'
import { PageHeader } from '@/components/shared/PageHeader'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PlanOverrideDialog } from '@/components/billing/PlanOverrideDialog'
import { StripeStatusBadge } from '@/components/billing/StripeStatusBadge'
import { FamilyOverrideRow } from '@/components/flags/FamilyOverrideRow'
import {
  useAdminFamily,
  useAdminFamilyMutations,
  useAdminFamilyOverrides,
} from '@/hooks/useAdminFamilies'
import { formatDate } from '@/lib/utils'
import type { FamilyPlan } from '@family/types'

export const Route = createFileRoute('/families/$familyId')({
  component: FamilyDetailPage,
})

function FamilyDetailPage() {
  const { familyId } = Route.useParams()
  const { data: family, isLoading } = useAdminFamily(familyId)
  const { data: overrides = [] } = useAdminFamilyOverrides(familyId)
  const { changePlan, suspend, unsuspend, setOverride, removeOverride } =
    useAdminFamilyMutations()

  if (isLoading || !family) {
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
          title={family.name}
          description={`ID: ${family.id}`}
          action={
            <div className="flex items-center gap-2">
              <PlanOverrideDialog
                familyId={familyId}
                currentPlan={family.plan}
                onConfirm={(plan: FamilyPlan, reason: string) =>
                  changePlan.mutateAsync({ familyId, plan, reason })
                }
                trigger={
                  <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent">
                    Change Plan
                  </button>
                }
              />
              {family.suspendedAt ? (
                <ConfirmDialog
                  title="Unsuspend family"
                  description={`Restore access for "${family.name}"?`}
                  confirmLabel="Unsuspend"
                  onConfirm={() => unsuspend.mutateAsync({ familyId })}
                  trigger={
                    <button className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                      <CheckCircle className="h-4 w-4" />
                      Unsuspend
                    </button>
                  }
                />
              ) : (
                <ConfirmDialog
                  title="Suspend family"
                  description={`Suspending "${family.name}" will show a full-screen block to all members. Enter a reason below.`}
                  confirmLabel="Suspend"
                  destructive
                  onConfirm={async () => {
                    const reason = window.prompt('Reason for suspension:')
                    if (reason) await suspend.mutateAsync({ familyId, reason })
                  }}
                  trigger={
                    <button className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/20">
                      <AlertTriangle className="h-4 w-4" />
                      Suspend
                    </button>
                  }
                />
              )}
            </div>
          }
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Plan', value: family.plan },
            { label: 'Currency', value: family.currency },
            { label: 'Members', value: family.memberCount },
            { label: 'Expenses', value: family.expenseCount },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p className="mt-1 text-xl font-semibold capitalize">{String(value)}</p>
            </div>
          ))}
        </div>

        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Billing</h2>
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Stripe Customer</p>
              <p className="mt-0.5 font-mono text-xs">{family.stripeCustomerId ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Subscription</p>
              <p className="mt-0.5 font-mono text-xs">{family.stripeSubscriptionId ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <div className="mt-1">
                <StripeStatusBadge status={family.stripeSubscriptionStatus} />
              </div>
            </div>
          </div>
        </section>

        {family.suspendedAt && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
              Suspended {formatDate(family.suspendedAt)}
            </p>
            {family.suspendReason && (
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-500">
                Reason: {family.suspendReason}
              </p>
            )}
          </div>
        )}

        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Feature Overrides</h2>
          <p className="text-sm text-muted-foreground">
            Overrides apply on top of this family's plan defaults and win over the plan matrix.
          </p>
          <FamilyOverrideRow
            overrides={overrides}
            onAdd={(featureKey, value, note) =>
              setOverride.mutateAsync({ familyId, featureKey, value, note })
            }
            onRemove={(overrideId) => removeOverride.mutateAsync({ overrideId })}
          />
        </section>

        <p className="text-xs text-muted-foreground">
          Created {formatDate(family.createdAt)}
        </p>
      </div>
    </AdminLayout>
  )
}
