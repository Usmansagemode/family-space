import type { RecurringExpense } from '@family/types'
import { getSupabaseClient } from './client'

function rowToRecurring(row: {
  id: string
  family_id: string
  description: string
  amount: number
  category_id: string | null
  location_id: string | null
  paid_by_id: string | null
  frequency: string
  start_date: string
  next_due_date: string
  end_date: string | null
  created_at: string
}): RecurringExpense {
  return {
    id: row.id,
    familyId: row.family_id,
    description: row.description,
    amount: row.amount,
    categoryId: row.category_id,
    locationId: row.location_id,
    paidById: row.paid_by_id,
    frequency: row.frequency as RecurringExpense['frequency'],
    startDate: row.start_date,
    nextDueDate: row.next_due_date,
    endDate: row.end_date,
    createdAt: new Date(row.created_at),
  }
}

export async function fetchRecurringExpenses(familyId: string): Promise<RecurringExpense[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('recurring_expenses')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map(rowToRecurring)
}

export async function createRecurringExpense(input: {
  familyId: string
  description: string
  amount: number
  frequency: RecurringExpense['frequency']
  startDate: string
  nextDueDate: string
  endDate?: string | null
  categoryId?: string | null
  locationId?: string | null
  paidById?: string | null
}): Promise<RecurringExpense> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('recurring_expenses')
    .insert({
      family_id: input.familyId,
      description: input.description,
      amount: input.amount,
      frequency: input.frequency,
      start_date: input.startDate,
      next_due_date: input.nextDueDate,
      end_date: input.endDate ?? null,
      category_id: input.categoryId ?? null,
      location_id: input.locationId ?? null,
      paid_by_id: input.paidById ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return rowToRecurring(data)
}

export async function updateRecurringExpense(
  id: string,
  input: Partial<{
    description: string
    amount: number
    frequency: RecurringExpense['frequency']
    nextDueDate: string
    endDate: string | null
    categoryId: string | null
    locationId: string | null
    paidById: string | null
  }>,
): Promise<RecurringExpense> {
  const update: Record<string, unknown> = {}
  if (input.description !== undefined) update.description = input.description
  if (input.amount !== undefined) update.amount = input.amount
  if (input.frequency !== undefined) update.frequency = input.frequency
  if (input.nextDueDate !== undefined) update.next_due_date = input.nextDueDate
  if ('endDate' in input) update.end_date = input.endDate
  if ('categoryId' in input) update.category_id = input.categoryId
  if ('locationId' in input) update.location_id = input.locationId
  if ('paidById' in input) update.paid_by_id = input.paidById

  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('recurring_expenses')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return rowToRecurring(data)
}

export async function deleteRecurringExpense(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('recurring_expenses').delete().eq('id', id)
  if (error) throw error
}
