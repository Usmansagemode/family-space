import type { FamilyPlan, FeatureKey } from '@family/types'
import { useDynamicPlan } from './useDynamicPlan'

/**
 * Returns the resolved value for a single feature gate.
 * Boolean features (analytics, export, aiImport) return boolean.
 * Limit features (memberLimit, splitGroupLimit) return number | null (null = unlimited).
 *
 * Uses useDynamicPlan internally so admin overrides are always respected.
 */
export function useFeatureGate(
  familyId: string,
  plan: FamilyPlan,
  key: 'analytics' | 'export' | 'aiImport',
): boolean
export function useFeatureGate(
  familyId: string,
  plan: FamilyPlan,
  key: 'memberLimit' | 'splitGroupLimit',
): number | null
export function useFeatureGate(
  familyId: string,
  plan: FamilyPlan,
  key: FeatureKey,
): boolean | number | null {
  const limits = useDynamicPlan(familyId, plan)
  switch (key) {
    case 'memberLimit':     return limits.memberLimit
    case 'splitGroupLimit': return limits.splitGroupLimit
    case 'analytics':       return limits.can.analytics
    case 'export':          return limits.can.export
    case 'aiImport':        return limits.can.aiImport
  }
}
