export type IncomeType = 'wage' | 'side_gig' | 'other'
export type IncomeFrequency = 'weekly' | 'biweekly' | 'monthly' | 'yearly'

export type IncomeSource = {
  id: string
  familyId: string
  /** person type space; null = family-wide income */
  personId: string | null
  name: string
  type: IncomeType
  /** Expected amount per frequency period */
  amount: number
  frequency: IncomeFrequency
  startDate?: string
  endDate?: string
  createdAt: Date
  updatedAt: Date
}

export type IncomeEntry = {
  id: string
  familyId: string
  incomeSourceId: string | null
  personId: string | null
  amount: number
  /** YYYY-MM-DD */
  date: string
  description?: string
  createdAt: Date
}
