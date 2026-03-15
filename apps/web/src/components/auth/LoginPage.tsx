import { useState } from 'react'
import { LayoutGrid, CalendarDays, Clock, ImageIcon, Receipt, BarChart3, FileUp } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { useAuthContext } from '#/contexts/auth'

const GOOGLE_SVG = (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
)

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex aspect-video w-full items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/40">
      <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
        <ImageIcon className="h-8 w-8" />
        <span className="text-xs">{label}</span>
      </div>
    </div>
  )
}

const FEATURES = [
  {
    icon: <LayoutGrid className="h-5 w-5" />,
    title: 'A space for everyone',
    body: 'Create a column for each family member and each store you shop at. Every task, errand, and appointment lives exactly where it belongs — and you see it all at once.',
    placeholder: 'Board view screenshot',
  },
  {
    icon: <CalendarDays className="h-5 w-5" />,
    title: 'Your calendar, automatically updated',
    body: 'Add a date (or a time) to any task and it syncs to your shared Google Calendar — no copy-pasting, no double entry. Everyone stays in the loop without extra effort.',
    placeholder: 'Calendar sync screenshot',
  },
  {
    icon: <Receipt className="h-5 w-5" />,
    title: 'Track every family expense',
    body: 'Log expenses by category, location, and who paid. See a running total for each person and filter by month, store, or category in seconds.',
    placeholder: 'Expense table screenshot',
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: 'Yearly analytics at a glance',
    body: 'Nine charts break down your spending by month, category, and family member — so you know exactly where the money goes and can plan ahead with confidence.',
    placeholder: 'Analytics charts screenshot',
  },
  {
    icon: <FileUp className="h-5 w-5" />,
    title: 'Import your bank statements with AI',
    body: 'Upload a PDF bank statement and Gemini AI extracts every transaction automatically. Review, adjust, and import in one go — no manual entry required.',
    placeholder: 'PDF import wizard screenshot',
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: 'History that works for you',
    body: "Bought olive oil last month? Re-add it in one tap. Family Space remembers what you've added to each space so your routine never starts from scratch.",
    placeholder: 'History feature screenshot',
  },
]

function EmailAuthForm() {
  const { signInWithEmail, signUpWithEmail } = useAuthContext()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    const err =
      mode === 'signin'
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password)

    setLoading(false)
    if (err) {
      setError(err)
    } else if (mode === 'signup') {
      setMessage('Check your email to confirm your account.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 w-full max-w-sm space-y-3">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        {mode === 'signin' ? (
          <>
            No account?{' '}
            <button
              type="button"
              className="underline underline-offset-2 hover:text-foreground"
              onClick={() => { setMode('signup'); setError(null); setMessage(null) }}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              className="underline underline-offset-2 hover:text-foreground"
              onClick={() => { setMode('signin'); setError(null); setMessage(null) }}
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </form>
  )
}

export function LoginPage() {
  const { signInWithGoogle } = useAuthContext()

  return (
    <div className="h-full overflow-y-auto">
      {/* ── Hero ── */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-6 pb-20 pt-24 text-center">
        <span className="mb-6 inline-flex items-center rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
          Free for families
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          One place for everything
          <br />
          <span className="text-muted-foreground">your family shares.</span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
          Family Space is a shared board for tasks, groceries, and appointments
          — plus expense tracking and yearly analytics — organised by person and
          store, and synced to Google Calendar.
        </p>
        <Button
          size="lg"
          onClick={signInWithGoogle}
          className="mt-8 gap-3 px-7 py-6 text-base"
        >
          {GOOGLE_SVG}
          Sign in with Google
        </Button>
        <div className="mt-6 flex w-full max-w-sm items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <EmailAuthForm />
      </section>

      {/* ── Feature rows ── */}
      <section className="mx-auto max-w-5xl space-y-24 px-6 pb-28">
        {FEATURES.map((f, i) => {
          const textFirst = i % 2 === 0
          return (
            <div
              key={f.title}
              className="grid items-center gap-10 md:grid-cols-2"
            >
              {/* Text block */}
              <div className={textFirst ? 'md:order-1' : 'md:order-2'}>
                <div className="mb-4 inline-flex items-center justify-center rounded-xl border border-border bg-muted/60 p-3 text-foreground">
                  {f.icon}
                </div>
                <h2 className="text-2xl font-bold tracking-tight">{f.title}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </div>

              {/* Placeholder image */}
              <div className={textFirst ? 'md:order-2' : 'md:order-1'}>
                <Placeholder label={f.placeholder} />
              </div>
            </div>
          )
        })}
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to get organised?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Set up takes less than a minute. Your family will thank you.
          </p>
          <Button
            size="lg"
            onClick={signInWithGoogle}
            className="mt-8 gap-3 px-7 py-6 text-base"
          >
            {GOOGLE_SVG}
            Sign in with Google
          </Button>
        </div>
      </section>
    </div>
  )
}
