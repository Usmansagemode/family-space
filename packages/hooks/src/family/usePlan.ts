import type { FamilyPlan } from '@family/types'
import { PLAN_LIMITS } from '@family/types'
export type { PlanLimits } from '@family/types'

export function usePlan(plan: FamilyPlan) {
  return PLAN_LIMITS[plan]
}
