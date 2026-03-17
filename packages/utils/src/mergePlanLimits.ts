import type { FamilyPlan } from '@family/types'

// Mirrors PlanLimits from @family/hooks — kept inline to avoid circular dep
export type PlanLimitsShape = {
  memberLimit: number | null
  splitGroupLimit: number | null
  can: {
    analytics: boolean
    export: boolean
    aiImport: boolean
  }
}

// Static fallback — mirrors PLAN_LIMITS in usePlan.ts, used when DB rows are absent
const PLAN_LIMITS_FALLBACK: Record<FamilyPlan, PlanLimitsShape> = {
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

type FeatureRow = {
  featureKey: string
  value: { enabled?: boolean; limit?: number | null }
}

/**
 * Merges plan_features rows + family_feature_overrides into a PlanLimits object.
 * Override rows always win over plan defaults.
 * Falls back to the static PLAN_LIMITS constant if a row is missing.
 */
export function mergePlanLimits(
  plan: FamilyPlan,
  planFeatures: FeatureRow[],
  overrides: FeatureRow[],
): PlanLimitsShape {
  const fallback = PLAN_LIMITS_FALLBACK[plan]

  // Build a lookup: featureKey → value (override wins over plan feature)
  const resolved = new Map<string, { enabled?: boolean; limit?: number | null }>()

  for (const row of planFeatures) {
    resolved.set(row.featureKey, row.value)
  }
  // Overrides clobber plan defaults
  for (const row of overrides) {
    resolved.set(row.featureKey, row.value)
  }

  function getBool(key: string, fallbackVal: boolean): boolean {
    const v = resolved.get(key)
    if (v === undefined) return fallbackVal
    return v.enabled ?? fallbackVal
  }

  function getLimit(key: string, fallbackVal: number | null): number | null {
    const v = resolved.get(key)
    if (v === undefined) return fallbackVal
    // value has a "limit" key — null means unlimited
    if ('limit' in v) return v.limit ?? null
    return fallbackVal
  }

  return {
    memberLimit: getLimit('memberLimit', fallback.memberLimit),
    splitGroupLimit: getLimit('splitGroupLimit', fallback.splitGroupLimit),
    can: {
      analytics: getBool('analytics', fallback.can.analytics),
      export: getBool('export', fallback.can.export),
      aiImport: getBool('aiImport', fallback.can.aiImport),
    },
  }
}
