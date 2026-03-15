import type { Budget, BudgetPeriod } from '@family/types'
import { getSupabaseClient } from './client'

function rowToBudget(row: {
  id: string
  family_id: string
  person_id: string | null
  category_id: string | null
  amount: number
  period: string
  created_at: string
  updated_at: string
}): Budget {
  return {
    id: row.id,
    familyId: row.family_id,
    personId: row.person_id,
    categoryId: row.category_id,
    amount: row.amount,
    period: row.period as BudgetPeriod,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

export async function fetchBudgets(familyId: string): Promise<Budget[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data.map(rowToBudget)
}

export async function upsertBudget(input: {
  familyId: string
  personId: string | null
  categoryId: string | null
  amount: number
  period: BudgetPeriod
}): Promise<Budget> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('budgets')
    .upsert(
      {
        family_id: input.familyId,
        person_id: input.personId,
        category_id: input.categoryId,
        amount: input.amount,
        period: input.period,
      },
      { onConflict: 'family_id,person_id,category_id,period' },
    )
    .select()
    .single()

  if (error) throw error
  return rowToBudget(data)
}

export async function deleteBudget(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('budgets').delete().eq('id', id)
  if (error) throw error
}
