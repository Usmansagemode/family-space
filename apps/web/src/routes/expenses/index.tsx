import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/expenses/')({
  component: ExpensesPage,
})

function ExpensesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Expenses</h1>
      <p className="text-muted-foreground mt-1 text-sm">Monthly expense table — coming soon.</p>
    </div>
  )
}
