import type { IncomeEntry, IncomeFrequency, IncomeSource, IncomeType } from '@family/types'
import { getSupabaseClient } from './client'

function rowToSource(row: {
  id: string
  family_id: string
  person_id: string | null
  name: string
  type: string
  amount: number
  frequency: string
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}): IncomeSource {
  return {
    id: row.id,
    familyId: row.family_id,
    personId: row.person_id,
    name: row.name,
    type: row.type as IncomeType,
    amount: row.amount,
    frequency: row.frequency as IncomeFrequency,
    startDate: row.start_date ?? undefined,
    endDate: row.end_date ?? undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

function rowToEntry(row: {
  id: string
  family_id: string
  income_source_id: string | null
  person_id: string | null
  amount: number
  date: string
  description: string | null
  created_at: string
}): IncomeEntry {
  return {
    id: row.id,
    familyId: row.family_id,
    incomeSourceId: row.income_source_id,
    personId: row.person_id,
    amount: row.amount,
    date: row.date,
    description: row.description ?? undefined,
    createdAt: new Date(row.created_at),
  }
}

export async function fetchIncomeSources(familyId: string): Promise<IncomeSource[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('income_sources')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data.map(rowToSource)
}

export async function createIncomeSource(input: {
  familyId: string
  personId?: string | null
  name: string
  type: IncomeType
  amount: number
  frequency: IncomeFrequency
  startDate?: string
  endDate?: string
}): Promise<IncomeSource> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('income_sources')
    .insert({
      family_id: input.familyId,
      person_id: input.personId ?? null,
      name: input.name,
      type: input.type,
      amount: input.amount,
      frequency: input.frequency,
      start_date: input.startDate ?? null,
      end_date: input.endDate ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return rowToSource(data)
}

export async function updateIncomeSource(
  id: string,
  input: Partial<{
    name: string
    type: IncomeType
    amount: number
    frequency: IncomeFrequency
    startDate: string | null
    endDate: string | null
  }>,
): Promise<IncomeSource> {
  const update: Record<string, unknown> = {}
  if (input.name !== undefined) update.name = input.name
  if (input.type !== undefined) update.type = input.type
  if (input.amount !== undefined) update.amount = input.amount
  if (input.frequency !== undefined) update.frequency = input.frequency
  if ('startDate' in input) update.start_date = input.startDate
  if ('endDate' in input) update.end_date = input.endDate

  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('income_sources')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return rowToSource(data)
}

export async function deleteIncomeSource(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('income_sources').delete().eq('id', id)
  if (error) throw error
}

export async function fetchIncomeEntries(
  familyId: string,
  year: number,
  month?: number,
): Promise<IncomeEntry[]> {
  const supabase = getSupabaseClient()
  let query = supabase
    .from('income_entries')
    .select('*')
    .eq('family_id', familyId)
    .gte('date', `${year}-01-01`)
    .lt('date', `${year + 1}-01-01`)
    .order('date', { ascending: false })

  if (month !== undefined) {
    const start = `${year}-${String(month).padStart(2, '0')}-01`
    const end =
      month === 12
        ? `${year + 1}-01-01`
        : `${year}-${String(month + 1).padStart(2, '0')}-01`
    query = supabase
      .from('income_entries')
      .select('*')
      .eq('family_id', familyId)
      .gte('date', start)
      .lt('date', end)
      .order('date', { ascending: false })
  }

  const { data, error } = await query
  if (error) throw error
  return data.map(rowToEntry)
}

export async function createIncomeEntry(input: {
  familyId: string
  incomeSourceId?: string | null
  personId?: string | null
  amount: number
  date: string
  description?: string
}): Promise<IncomeEntry> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('income_entries')
    .insert({
      family_id: input.familyId,
      income_source_id: input.incomeSourceId ?? null,
      person_id: input.personId ?? null,
      amount: input.amount,
      date: input.date,
      description: input.description ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return rowToEntry(data)
}

export async function deleteIncomeEntry(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('income_entries').delete().eq('id', id)
  if (error) throw error
}
