import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/charts')({
  component: ChartsPage,
})

function ChartsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Yearly Analytics</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        9 interactive charts — monthly totals, by category, by member, by location, and more.
        Pro feature — coming soon.
      </p>
    </div>
  )
}
