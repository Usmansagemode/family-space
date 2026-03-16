import type { FamilyPlan } from '@family/types'

export type PlanLimits = {
  memberLimit: number | null // null = unlimited
  splitGroupLimit: number | null // null = unlimited
  can: {
    analytics: boolean
    export: boolean
    aiImport: boolean
  }
}

const PLAN_LIMITS: Record<FamilyPlan, PlanLimits> = {
  free: {
    memberLimit: 3,
    splitGroupLimit: 1,
    can: { analytics: false, export: false, aiImport: false },
  },
  plus: {
    memberLimit: 5,
    splitGroupLimit: null,
    can: { analytics: true, export: true, aiImport: false },
  },
  pro: {
    memberLimit: null,
    splitGroupLimit: null,
    can: { analytics: true, export: true, aiImport: true },
  },
}

export function usePlan(plan: FamilyPlan): PlanLimits {
  return PLAN_LIMITS[plan]
}
