import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Last updated: March 6, 2026
      </p>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">1. Overview</h2>
        <p className="text-muted-foreground">
          Family Space ("we", "our", or "us") is a personal family management
          app available at{' '}
          <a
            href="https://family-space.usmankm.com"
            className="underline underline-offset-4"
          >
            https://family-space.usmankm.com
          </a>
          . This policy explains what data we collect, how we use it, and your
          rights regarding your information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">2. Data We Collect</h2>
        <ul className="text-muted-foreground list-disc space-y-2 pl-6">
          <li>
            <strong>Account information:</strong> Email address and display name
            provided when you sign in.
          </li>
          <li>
            <strong>Family data:</strong> Spaces, items, and tasks you create
            within the app.
          </li>
          <li>
            <strong>Google Calendar data:</strong> If you connect Google
            Calendar, we access your calendar events solely to create, update,
            and delete events that correspond to items you manage in Family
            Space. We do not read unrelated calendar data.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">3. How We Use Your Data</h2>
        <ul className="text-muted-foreground list-disc space-y-2 pl-6">
          <li>To provide and operate the Family Space service.</li>
          <li>
            To sync calendar events when you set dates on items (Google Calendar
            integration only).
          </li>
          <li>To send invitations to family members you add.</li>
          <li>We do not sell, rent, or share your data with third parties.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">
          4. Google API Services
        </h2>
        <p className="text-muted-foreground">
          Family Space's use of information received from Google APIs adheres to
          the{' '}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements. Google Calendar access is
          used only to read and write calendar events directly initiated by your
          actions in the app.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">5. Data Storage</h2>
        <p className="text-muted-foreground">
          Your data is stored securely in Supabase (PostgreSQL). We use
          row-level security to ensure each family can only access their own
          data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">6. Data Retention</h2>
        <p className="text-muted-foreground">
          Your data is retained as long as your account is active. You may
          request deletion of your data at any time by contacting us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">7. Children's Privacy</h2>
        <p className="text-muted-foreground">
          Family Space is not directed at children under 13. We do not knowingly
          collect personal information from children under 13.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">8. Changes to This Policy</h2>
        <p className="text-muted-foreground">
          We may update this policy occasionally. We will notify you of
          significant changes by updating the date at the top of this page.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">9. Contact</h2>
        <p className="text-muted-foreground">
          For questions or data deletion requests, contact us at{' '}
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
