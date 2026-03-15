import { Trash2 } from 'lucide-react'
import { useCSVImport } from '#/contexts/csvImport'
import { formatCurrency } from '#/lib/utils'

interface Props {
  currency?: string
  locale?: string
}

export function ImportPreviewTable({ currency, locale }: Props) {
  const { mappedData, setMappedData } = useCSVImport()

  function removeRow(id: string) {
    setMappedData(mappedData.filter((e) => e.id !== id))
  }

  if (mappedData.length === 0) {
    return (
      <p className="text-muted-foreground text-sm text-center py-8">No expenses to preview.</p>
    )
  }

  return (
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
              <td className="px-3 py-2 max-w-48 truncate">{expense.description || '—'}</td>
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
  )
}
