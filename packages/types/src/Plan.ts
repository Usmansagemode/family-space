import type { FamilyPlan } from './Family'

export type FeatureKey =
  | 'memberLimit'
  | 'splitGroupLimit'
  | 'analytics'
  | 'export'
  | 'aiImport'

export type PlanLimits = {
  memberLimit: number | null      // null = unlimited
  splitGroupLimit: number | null  // null = unlimited
  can: {
    analytics: boolean
    export: boolean
    aiImport: boolean
  }
}

export const PLAN_LIMITS: Record<FamilyPlan, PlanLimits> = {
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
