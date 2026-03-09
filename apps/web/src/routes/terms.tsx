import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold">Terms of Service</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Last updated: March 6, 2026
      </p>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground">
          By using Family Space at{' '}
          <a
            href="https://family-space.usmankm.com"
            className="underline underline-offset-4"
          >
            https://family-space.usmankm.com
          </a>
          , you agree to these Terms of Service. If you do not agree, do not use
          the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">
          2. Description of Service
        </h2>
        <p className="text-muted-foreground">
          Family Space is a personal family management tool that lets you
          organize tasks, grocery lists, and chores for your household. It
          optionally integrates with Google Calendar to sync dated items.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">3. Your Account</h2>
        <ul className="text-muted-foreground list-disc space-y-2 pl-6">
          <li>
            You are responsible for maintaining the security of your account.
          </li>
          <li>
            You must not share your login credentials or allow unauthorized
            access to your account.
          </li>
          <li>
            You are responsible for all activity that occurs under your account.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">4. Acceptable Use</h2>
        <p className="text-muted-foreground mb-2">You agree not to:</p>
        <ul className="text-muted-foreground list-disc space-y-2 pl-6">
          <li>Use the service for any unlawful purpose.</li>
          <li>Attempt to gain unauthorized access to other users' data.</li>
          <li>Interfere with or disrupt the service or its infrastructure.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">
          5. Google Calendar Integration
        </h2>
        <p className="text-muted-foreground">
          If you connect Google Calendar, you authorize Family Space to create,
          update, and delete calendar events on your behalf for items you manage
          in the app. You may revoke this access at any time via your Google
          Account settings.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">6. Your Data</h2>
        <p className="text-muted-foreground">
          You own your data. We do not claim ownership of any content you create
          in Family Space. See our{' '}
          <a href="/privacy" className="underline underline-offset-4">
            Privacy Policy
          </a>{' '}
          for details on how we handle your data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">
          7. Disclaimer of Warranties
        </h2>
        <p className="text-muted-foreground">
          Family Space is provided "as is" without warranties of any kind. We do
          not guarantee the service will be uninterrupted, error-free, or that
          data will never be lost. Use the service at your own risk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">
          8. Limitation of Liability
        </h2>
        <p className="text-muted-foreground">
          To the fullest extent permitted by law, Family Space and its operators
          shall not be liable for any indirect, incidental, or consequential
          damages arising from your use of the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">9. Termination</h2>
        <p className="text-muted-foreground">
          We reserve the right to suspend or terminate access to the service at
          any time, with or without notice, for conduct that we believe violates
          these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">10. Changes to Terms</h2>
        <p className="text-muted-foreground">
          We may update these terms from time to time. Continued use of the
          service after changes constitutes acceptance of the new terms.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">11. Contact</h2>
        <p className="text-muted-foreground">
          Questions about these terms? Contact us at{' '}
          <a
            href="mailto:usmansagemode@gmail.com"
            className="underline underline-offset-4"
          >
            usmansagemode@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  )
}
