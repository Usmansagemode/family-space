import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trackers')({
  component: TrackersPage,
})

function TrackersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Trackers</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Debt, savings, and loan trackers with running balance history. Pro feature — coming soon.
      </p>
    </div>
  )
}
