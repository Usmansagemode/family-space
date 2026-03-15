import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
})

function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold">Welcome to Family Space</h1>
        <p className="text-muted-foreground">
          Create your family or join an existing one to get started.
        </p>
        {/* Onboarding flow: create family → set currency/locale → seed categories */}
      </div>
    </div>
  )
}
