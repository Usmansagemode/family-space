import { useMemo, useState } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteExpense } from '@family/supabase'
import type { ExpenseWithNames } from '@family/types'
import { useCSVImport } from '#/contexts/csvImport'
import type { ImportExpense } from '#/contexts/csvImport'
import { DuplicateExpenseDialog } from '#/components/expenses/DuplicateExpenseDialog'
import type { DuplicateEntry } from '#/components/expenses/DuplicateExpenseDialog'
import { detectDuplicates } from '#/lib/duplicate-detection'
import { formatCurrency } from '#/lib/utils'

interface Props {
  currency?: string
  locale?: string
  showDuplicates?: boolean
}

function importToEntry(e: ImportExpense): DuplicateEntry {
  return {
    id: e.id, date: e.date, amount: e.amount,
    description: e.description || undefined,
    categoryName: e.categoryName, locationName: e.locationName,
    paidByName: e.paidByName, source: 'import',
  }
}

function dbToEntry(e: ExpenseWithNames): DuplicateEntry {
  return {
    id: e.id, date: e.date, amount: e.amount, description: e.description,
    categoryName: e.categoryName, categoryColor: e.categoryColor,
    locationName: e.locationName, paidByName: e.paidByName, source: 'db',
  }
}

export function ImportPreviewTable({ currency, locale, showDuplicates = false }: Props) {
  const { mappedData, setMappedData, existingExpenses } = useCSVImport()

  // Track DB expenses deleted from the dialog (so they disappear from the detection pool)
  const [deletedDbIds, setDeletedDbIds] = useState<Set<string>>(new Set())
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)

  // Duplicate dialog state
  const [dupOpen, setDupOpen] = useState(false)
  const [dupFlagged, setDupFlagged] = useState<DuplicateEntry | null>(null)
  const [dupMatches, setDupMatches] = useState<DuplicateEntry[]>([])

  const visibleExisting = useMemo(
    () => existingExpenses.filter((e) => !deletedDbIds.has(e.id)),
    [existingExpenses, deletedDbIds],
  )

  const duplicateMap = useMemo(
    () => showDuplicates ? detectDuplicates([...mappedData, ...visibleExisting]) : new Map(),
    [mappedData, visibleExisting, showDuplicates],
  )

  function removeRow(id: string) {
    setMappedData(mappedData.filter((e) => e.id !== id))
  }

  function getMatches(id: string): DuplicateEntry[] {
    const matches = duplicateMap.get(id) ?? []
    return matches
      .map(({ id: mid, reason }) => {
        const imp = mappedData.find((e) => e.id === mid)
        if (imp) return { ...importToEntry(imp), reason }
        const db = visibleExisting.find((e) => e.id === mid)
        if (db) return { ...dbToEntry(db), reason }
        return null
      })
      .filter(Boolean) as DuplicateEntry[]
  }

  function closeDialog() { setDupOpen(false); setDupFlagged(null); setDupMatches([]) }

  async function handleDeleteMatch(id: string, source: 'db' | 'import') {
    const isFlagged = id === dupFlagged?.id

    if (source === 'import') {
      removeRow(id)
      if (isFlagged) { closeDialog(); return }
      const remaining = dupMatches.filter((m) => m.id !== id)
      if (remaining.length === 0) closeDialog()
      else setDupMatches(remaining)
    } else {
      setIsDeletingId(id)
      try {
        await deleteExpense(id)
        setDeletedDbIds((prev) => new Set([...prev, id]))
        if (isFlagged) { closeDialog(); return }
        const remaining = dupMatches.filter((m) => m.id !== id)
        if (remaining.length === 0) closeDialog()
        else setDupMatches(remaining)
      } catch {
        toast.error('Failed to delete expense')
      } finally {
        setIsDeletingId(null)
      }
    }
  }

  if (mappedData.length === 0) {
    return (
      <p className="text-muted-foreground text-sm text-center py-8">No expenses to preview.</p>
    )
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-xs text-muted-foreground">
              <th className="px-3 py-2.5 text-left font-medium">Date</th>
              <th className="px-3 py-2.5 text-left font-medium">Description</th>
              <th className="px-3 py-2.5 text-right font-medium">Amount</th>
              <th className="px-3 py-2.5 text-left font-medium">Category</th>
              <th className="px-3 py-2.5 text-left font-medium">Location</th>
              <th className="px-3 py-2.5 text-left font-medium">Paid By</th>
              <th className="px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {mappedData.map((expense) => (
              <tr key={expense.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{expense.date}</td>
                <td className="max-w-48 px-3 py-2">
                  <div className="flex min-w-0 items-center gap-1.5">
                    {duplicateMap.has(expense.id) && (
                      <button
                        type="button"
                        title="Possible duplicate — click to review"
                        aria-label="Possible duplicate — click to review"
                        className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-amber-500 transition-colors duration-150 hover:text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        onClick={() => {
                          setDupFlagged(importToEntry(expense))
                          setDupMatches(getMatches(expense.id))
                          setDupOpen(true)
                        }}
                      >
                        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                      </button>
                    )}
                    <span className="truncate">{expense.description || '—'}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-right font-medium tabular-nums whitespace-nowrap">
                  {formatCurrency(expense.amount, currency, locale)}
                </td>
                <td className="px-3 py-2 text-muted-foreground">{expense.categoryName ?? '—'}</td>
                <td className="px-3 py-2 text-muted-foreground">{expense.locationName ?? '—'}</td>
                <td className="px-3 py-2 text-muted-foreground">{expense.paidByName ?? '—'}</td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => removeRow(expense.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dupFlagged && (
        <DuplicateExpenseDialog
          open={dupOpen}
          onOpenChange={(o) => { setDupOpen(o); if (!o) { setDupFlagged(null); setDupMatches([]) } }}
          flagged={dupFlagged}
          matches={dupMatches}
          currency={currency}
          locale={locale}
          onDelete={handleDeleteMatch}
          onKeepAll={closeDialog}
          isDeleting={!!isDeletingId}
        />
      )}
    </>
  )
}
