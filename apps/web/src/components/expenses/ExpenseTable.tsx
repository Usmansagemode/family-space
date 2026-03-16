import { useState, useMemo } from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import { BulkEditBar } from '#/components/expenses/BulkEditBar'
import { formatCurrency, parseLocalDate } from '#/lib/utils'
import { cn } from '#/lib/utils'
import type { Category, Space, ExpenseWithNames } from '@family/types'

type SortField = 'date' | 'amount'
type SortDir = 'asc' | 'desc'

type Patch = {
  categoryId?: string | null
  locationId?: string | null
  paidById?: string | null
  description?: string
  date?: string
  amount?: number
}

type Props = {
  expenses: ExpenseWithNames[]
  categories: Category[]
  locationSpaces: Space[]
  personSpaces: Space[]
  familyId: string
  currency?: string
  locale?: string
  onEdit: (expense: ExpenseWithNames) => void
  onDelete: (id: string) => void
  onDeleteMany: (ids: string[]) => void
  onBulkUpdate: (ids: string[], patch: Patch) => void
}

export function ExpenseTable({
  expenses,
  categories,
  locationSpaces,
  personSpaces,
  currency,
  locale,
  onEdit,
  onDelete,
  onDeleteMany,
  onBulkUpdate,
}: Props) {
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortDir('desc') }
  }

  const sorted = useMemo(() => {
    return [...expenses].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortField === 'date') return a.date.localeCompare(b.date) * dir
      return (a.amount - b.amount) * dir
    })
  }, [expenses, sortField, sortDir])

  const allSelected = sorted.length > 0 && sorted.every((e) => selected.has(e.id))

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(sorted.map((e) => e.id)))
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedIds = [...selected]

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-40" />
    if (sortDir === 'asc') return <ArrowUp className="h-3 w-3" />
    return <ArrowDown className="h-3 w-3" />
  }

  if (expenses.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed py-16 text-muted-foreground">
        No expenses this month. Add one to get started.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {selectedIds.length > 0 && (
        <BulkEditBar
          selectedCount={selectedIds.length}
          categories={categories}
          locationSpaces={locationSpaces}
          personSpaces={personSpaces}
          onApply={(patch) => {
            onBulkUpdate(selectedIds, patch)
            setSelected(new Set())
          }}
          onDelete={() => {
            onDeleteMany(selectedIds)
            setSelected(new Set())
          }}
          onClear={() => setSelected(new Set())}
        />
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="w-10 px-4 py-3 text-left">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  className="flex items-center gap-1 text-xs font-medium text-muted-foreground"
                  onClick={() => toggleSort('date')}
                >
                  Date <SortIcon field="date" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Description
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  className="ml-auto flex items-center gap-1 text-xs font-medium text-muted-foreground"
                  onClick={() => toggleSort('amount')}
                >
                  Amount <SortIcon field="amount" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Paid by</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((expense) => {
              const isSelected = selected.has(expense.id)
              const d = parseLocalDate(expense.date)
              return (
                <tr
                  key={expense.id}
                  className={cn(
                    'border-b last:border-0 transition-colors hover:bg-muted/20',
                    isSelected && 'bg-blue-50/50 dark:bg-blue-950/20',
                  )}
                >
                  <td className="px-4 py-3">
                    <Checkbox checked={isSelected} onCheckedChange={() => toggleOne(expense.id)} aria-label="Select row" />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                    {d.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="max-w-[200px] px-4 py-3">
                    {expense.description
                      ? <span className="block truncate">{expense.description}</span>
                      : <span className="italic text-muted-foreground">—</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums">
                    {formatCurrency(expense.amount, currency, locale)}
                  </td>
                  <td className="px-4 py-3">
                    {expense.categoryName ? (
                      <div className="flex items-center gap-1.5">
                        {expense.categoryColor && (
                          <span
                            className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ background: expense.categoryColor }}
                          />
                        )}
                        <span className="text-sm">{expense.categoryName}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{expense.locationName ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{expense.paidByName ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onEdit(expense)}>
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => onDelete(expense.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
