import {
  Briefcase,
  Building2,
  CircleDollarSign,
  Home,
  type LucideIcon,
  TrendingUp,
  User,
  Wallet,
} from 'lucide-react'
import type { IncomeFrequency, IncomeType } from '@family/types'

export type IncomeTypeDef = { id: IncomeType; label: string; icon: LucideIcon; color: string }

export const INCOME_TYPES: IncomeTypeDef[] = [
  { id: 'salary',     label: 'Salary',     icon: Briefcase,        color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { id: 'side_gig',  label: 'Side Gig',   icon: CircleDollarSign, color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  { id: 'freelance',  label: 'Freelance',  icon: User,             color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  { id: 'business',   label: 'Business',   icon: Building2,        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  { id: 'rental',     label: 'Rental',     icon: Home,             color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { id: 'investment', label: 'Investment', icon: TrendingUp,       color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  { id: 'other',      label: 'Other',      icon: Wallet,           color: 'bg-muted text-muted-foreground' },
]

export type FrequencyDef = { id: IncomeFrequency; label: string; perMonth: number }

export const FREQUENCIES: FrequencyDef[] = [
  { id: 'weekly',    label: 'Weekly',    perMonth: 52 / 12 },
  { id: 'biweekly',  label: 'Bi-weekly', perMonth: 26 / 12 },
  { id: 'monthly',   label: 'Monthly',   perMonth: 1 },
  { id: 'yearly',    label: 'Yearly',    perMonth: 1 / 12 },
]

export function getIncomeTypeDef(type: IncomeType): IncomeTypeDef {
  return INCOME_TYPES.find((t) => t.id === type) ?? INCOME_TYPES[INCOME_TYPES.length - 1]!
}

export function toMonthly(amount: number, frequency: IncomeFrequency): number {
  return amount * (FREQUENCIES.find((f) => f.id === frequency)?.perMonth ?? 1)
}
