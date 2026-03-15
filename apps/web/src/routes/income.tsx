import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/income')({
  component: IncomePage,
})

function IncomePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Income & Budgets</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Log income sources, track actual income, and set budgets per category or member — coming
        soon.
      </p>
    </div>
  )
}
