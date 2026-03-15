import type { Expense, ExpenseWithNames } from '@family/types'
import { getSupabaseClient } from './client'

function rowToExpense(row: {
  id: string
  family_id: string
  amount: number
  category_id: string | null
  location_id: string | null
  paid_by_id: string | null
  date: string
  description: string | null
  created_at: string
  updated_at: string
}): Expense {
  return {
    id: row.id,
    familyId: row.family_id,
    amount: row.amount,
    categoryId: row.category_id,
    locationId: row.location_id,
    paidById: row.paid_by_id,
    date: row.date,
    description: row.description ?? undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

function rowToExpenseWithNames(row: {
  id: string
  family_id: string
  amount: number
  category_id: string | null
  location_id: string | null
  paid_by_id: string | null
  date: string
  description: string | null
  created_at: string
  updated_at: string
  categories: { name: string; color: string | null } | null
  location: { name: string } | null
  paid_by: { name: string } | null
}): ExpenseWithNames {
  return {
    ...rowToExpense(row),
    categoryName: row.categories?.name ?? null,
    categoryColor: row.categories?.color ?? null,
    locationName: row.location?.name ?? null,
    paidByName: row.paid_by?.name ?? null,
  }
}

/** Fetch expenses for a given month, joined with display names. */
export async function fetchExpensesByMonth(
  familyId: string,
  year: number,
  month: number, // 1-based
): Promise<ExpenseWithNames[]> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate =
    month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, '0')}-01`

  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('expenses')
    .select(
      `*, categories(name, color), location:location_id(name), paid_by:paid_by_id(name)`,
    )
    .eq('family_id', familyId)
    .gte('date', startDate)
    .lt('date', endDate)
    .order('date', { ascending: false })

  if (error) throw error
  return (data as Parameters<typeof rowToExpenseWithNames>[0][]).map(rowToExpenseWithNames)
}

/** Fetch all expenses for a year (for yearly analytics). */
export async function fetchExpensesByYear(
  familyId: string,
  year: number,
): Promise<ExpenseWithNames[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('expenses')
    .select(
      `*, categories(name, color), location:location_id(name), paid_by:paid_by_id(name)`,
    )
    .eq('family_id', familyId)
    .gte('date', `${year}-01-01`)
    .lt('date', `${year + 1}-01-01`)
    .order('date', { ascending: true })

  if (error) throw error
  return (data as Parameters<typeof rowToExpenseWithNames>[0][]).map(rowToExpenseWithNames)
}

export async function createExpense(input: {
  familyId: string
  amount: number
  date: string
  categoryId?: string | null
  locationId?: string | null
  paidById?: string | null
  description?: string
}): Promise<Expense> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      family_id: input.familyId,
      amount: input.amount,
      date: input.date,
      category_id: input.categoryId ?? null,
      location_id: input.locationId ?? null,
      paid_by_id: input.paidById ?? null,
      description: input.description ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return rowToExpense(data)
}

export async function updateExpense(
  id: string,
  input: Partial<{
    amount: number
    date: string
    categoryId: string | null
    locationId: string | null
    paidById: string | null
    description: string
  }>,
): Promise<Expense> {
  const update: Record<string, unknown> = {}
  if (input.amount !== undefined) update.amount = input.amount
  if (input.date !== undefined) update.date = input.date
  if ('categoryId' in input) update.category_id = input.categoryId
  if ('locationId' in input) update.location_id = input.locationId
  if ('paidById' in input) update.paid_by_id = input.paidById
  if (input.description !== undefined) update.description = input.description

  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('expenses')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return rowToExpense(data)
}

export async function deleteExpense(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('expenses').delete().eq('id', id)
  if (error) throw error
}

export async function deleteExpenses(ids: string[]): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('expenses').delete().in('id', ids)
  if (error) throw error
}
