import { useState } from 'react'
import {
  LayoutGrid,
  CalendarDays,
  Receipt,
  RefreshCw,
  Check,
  Sparkles,
  ImageIcon,
  ShoppingCart,
  TrendingUp,
  ArrowDownLeft,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Input } from '#/components/ui/input'
import { useAuthContext } from '#/contexts/auth'
import Footer from '#/components/Footer'

// ── Google SVG ────────────────────────────────────────────────────────────────

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

// ── Screenshot placeholder ────────────────────────────────────────────────────

function ScreenshotSlot({
  label,
  tag,
  className = '',
}: {
  label: string
  tag?: string
  className?: string
}) {
  return (
    <div
      className={`relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/40 ${className}`}
    >
      {tag && (
        <span className="absolute right-3 top-3 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-border backdrop-blur-sm">
          {tag}
        </span>
      )}
      <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
        <ImageIcon className="h-8 w-8" />
        <span className="px-4 text-center text-xs leading-relaxed">
          {label}
        </span>
      </div>
    </div>
  )
}

// ── Email auth form ───────────────────────────────────────────────────────────

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
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? 'Please wait…'
          : mode === 'signin'
            ? 'Sign in'
            : 'Create account'}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        {mode === 'signin' ? (
          <>
            No account?{' '}
            <button
              type="button"
              className="underline underline-offset-2 hover:text-foreground"
              onClick={() => {
                setMode('signup')
                setError(null)
                setMessage(null)
              }}
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
              onClick={() => {
                setMode('signin')
                setError(null)
                setMessage(null)
              }}
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </form>
  )
}

// ── Quick-feature bento cards ─────────────────────────────────────────────────

const QUICK_FEATURES = [
  {
    icon: <Receipt className="h-5 w-5" />,
    title: 'Expense tracking',
    body: 'Log who paid, where, and what for — with categories, locations, and per-member totals.',
  },
  {
    icon: <ArrowDownLeft className="h-5 w-5" />,
    title: 'Income tracking',
    body: 'Record salaries, freelance, and other income per person. See net cash flow at a glance.',
  },
  {
    icon: <RefreshCw className="h-5 w-5" />,
    title: 'Recurring transactions',
    body: 'Set up rent, subscriptions, and paycheques once. They log themselves every month.',
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: 'Yearly analytics',
    body: '9 interactive charts break down spending by month, category, member, and store.',
  },
  {
    icon: <ShoppingCart className="h-5 w-5" />,
    title: 'Grocery lists',
    body: 'Organised by store. Shared in real time. Add from history in one tap.',
  },
  {
    icon: <LayoutGrid className="h-5 w-5" />,
    title: 'Chores board',
    body: 'Drag-and-drop tasks per person. Dated items sync straight to Google Calendar.',
  },
]

// ── Deep-dive feature rows ────────────────────────────────────────────────────

const FEATURE_ROWS = [
  {
    badge: null,
    eyebrow: 'Finances',
    title: "Your family's full financial picture.",
    body: 'Track every expense and income entry in one place. The monthly chart shows income vs spending at a glance — so you always know where you stand before the month ends.',
    bullets: [
      'Per-member expense totals with month-over-month comparison',
      'Custom categories and store locations per family',
      'Bulk edit, Quick Tag, and duplicate detection built in',
    ],
    screenshotSrc: '/screenshots/expenses-desktop.png',
    screenshotAlt:
      'Family Space finances page showing income vs expense chart, per-member summary cards, and expense table with category badges',
    screenshotLabel:
      'screenshot: finances page — FinancialsChart (income vs expense bars) at top, ExpenseSummary cards per member below, expense table with category badges. Light mode.',
    screenshotTag: 'Finances',
  },
  {
    badge: null,
    eyebrow: 'Income & recurring',
    title: 'Log income and expenses. Automate both.',
    body: 'Record salaries, freelance, and other income per person. Set up recurring transactions — rent, subscriptions, paycheques — and they log themselves every cycle, income included.',
    bullets: [
      'Income types: Salary, Freelance, Rental, Business, and more',
      'Recurring expenses and income with weekly / monthly / yearly frequency',
      'Missed entries caught up automatically — no manual back-filling',
    ],
    screenshotSrc: '/screenshots/income-recurring-desktop.png',
    screenshotAlt:
      'Family Space income tab showing total income card and list of income entries with type icons and person names',
    screenshotLabel:
      'screenshot: finances page income tab — total income card in green at top, list of income entries with type icons and person names. Light mode.',
    screenshotTag: 'Income & Recurring',
  },
  {
    badge: null,
    eyebrow: 'Yearly analytics',
    title: 'A full year of spending, visualised.',
    body: '9 interactive charts break down every dollar by month, category, member, and store. Filter by month, category, location, or who paid — export to PDF or Excel in one click.',
    bullets: [
      'Monthly spending trend, category donut, and member comparison',
      'Category heatmap across all 12 months',
      'Export to PDF report or Excel for your records (Plus+)',
    ],
    screenshotSrc: '/screenshots/analytics-desktop.png',
    screenshotAlt:
      'Family Space analytics page showing year selector, total spend, and multiple charts including bar chart, donut, and heatmap',
    screenshotLabel:
      'screenshot: analytics page — year selector, total spend in bold, 3–4 charts side by side (bar chart, donut, heatmap), export button visible. Light mode.',
    screenshotTag: 'Analytics',
  },
  {
    badge: null,
    eyebrow: 'Shared board',
    title: 'Everyone sees their own lane.',
    body: 'Create a column for each family member and each store. Grocery runs, chores, errands — everything visible at a glance, drag-and-dropped into place.',
    bullets: [
      'Separate "Lists" and "Chores" tabs — keep shopping away from tasks',
      'Dated items sync straight to Google Calendar',
      'Search across all items in one keystroke',
    ],
    screenshotSrc: '/screenshots/board-desktop.png',
    screenshotAlt:
      'Family Space board view with store columns showing grocery items with checkboxes and dates',
    screenshotLabel:
      'screenshot: board view with 3–4 store columns (Walmart, Costco, T&T) — items with checkboxes and dates, dark mode.',
    screenshotTag: 'Board',
  },
  {
    badge: 'Pro',
    eyebrow: 'AI bank import',
    title: 'Import your statement in seconds.',
    body: 'Upload a PDF bank statement and Gemini AI extracts every transaction automatically. Review the mapped columns, correct anything, and import the whole month in one go.',
    bullets: [
      'Supports standard and wide-format bank exports',
      'AI maps columns to your categories automatically',
      'Preview and edit before importing anything',
    ],
    screenshotSrc: '/screenshots/ai-import-desktop.png',
    screenshotAlt:
      'Family Space AI import wizard showing extracted transactions with category mapping dropdowns and editable rows',
    screenshotLabel:
      'screenshot: AI import wizard step 2 or 3 — extracted transactions with category mapping dropdowns, some rows highlighted/edited. Light mode.',
    screenshotTag: 'AI Import',
  },
]

// ── Pricing ───────────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Everything a family needs to get started.',
    popular: false,
    cta: 'Get started free',
    features: [
      'Shared grocery & chores board',
      'Expense & income tracking',
      'Recurring transactions',
      'Up to 3 family members',
      'Google Calendar sync',
    ],
  },
  {
    name: 'Plus',
    price: '$5',
    period: 'per month',
    description: 'Deeper insight for families who want to save more.',
    popular: true,
    cta: 'Start with Plus',
    features: [
      'Everything in Free',
      'Up to 5 family members',
      'Yearly analytics (9 charts)',
      'Export to PDF & Excel',
      'Monthly budget tracking',
    ],
  },
  {
    name: 'Pro',
    price: '$10',
    period: 'per month',
    description: 'Unlimited everything — powered by AI.',
    popular: false,
    cta: 'Start with Pro',
    features: [
      'Everything in Plus',
      'Unlimited family members',
      'AI PDF bank statement import',
      'Split expenses between members',
      'Priority support',
    ],
  },
]

// ── Main page ─────────────────────────────────────────────────────────────────

export function LoginPage() {
  const { signInWithGoogle } = useAuthContext()

  return (
    <div className="h-full overflow-y-auto">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-6 pb-16 pt-20 text-center sm:pt-28">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Free to get started — no credit card
        </span>

        <h1 className="text-4xl font-bold tracking-tight sm:text-[3.25rem] sm:leading-[1.12]">
          One app for your family's{' '}
          <span className="text-muted-foreground">
            money, groceries, and chores.
          </span>
        </h1>

        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
          Family Space replaces scattered spreadsheets and group chats with
          shared expense tracking, income logging, recurring transactions,
          yearly analytics, and a real-time board — all in one place.
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
          <span className="text-xs text-muted-foreground">
            or sign in with email
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <EmailAuthForm />
      </section>

      {/* ── Hero screenshot ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <img
          src="/screenshots/hero-finances.png"
          alt="Family Space finances page showing monthly income vs expense chart, per-member summary cards, and expense table"
          className="w-full rounded-2xl border border-border shadow-md aspect-video sm:aspect-21/9 object-cover object-top"
          loading="lazy"
        />
      </section>

      {/* ── Quick features bento ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Built for how families actually work
          </h2>
          <p className="mt-2 text-muted-foreground">
            Finances, lists, and chores — one app, always in sync.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-muted/30 p-5 transition-colors hover:bg-muted/50"
            >
              <div className="mb-3 inline-flex items-center justify-center rounded-lg border border-border bg-background p-2 text-foreground">
                {f.icon}
              </div>
              <h3 className="mb-1 font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature deep-dive rows ────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl space-y-28 px-6 pb-32">
        {FEATURE_ROWS.map((f, i) => {
          const textFirst = i % 2 === 0
          return (
            <div
              key={f.title}
              className="grid items-center gap-10 md:grid-cols-2"
            >
              {/* Text */}
              <div className={textFirst ? 'md:order-1' : 'md:order-2'}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {f.eyebrow}
                  </span>
                  {f.badge && (
                    <Badge
                      variant="secondary"
                      className="gap-1 text-[10px] uppercase tracking-wide"
                    >
                      <Sparkles className="h-3 w-3" />
                      {f.badge}
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {f.title}
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="text-muted-foreground">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Screenshot */}
              <div className={textFirst ? 'md:order-2' : 'md:order-1'}>
                {f.screenshotSrc ? (
                  <img
                    src={f.screenshotSrc}
                    alt={f.screenshotAlt}
                    className="w-full rounded-2xl border border-border shadow-md"
                    loading="lazy"
                  />
                ) : (
                  <ScreenshotSlot
                    label={f.screenshotLabel}
                    tag={f.screenshotTag}
                  />
                )}
              </div>
            </div>
          )
        })}
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/20 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Simple, honest pricing
            </h2>
            <p className="mt-2 text-muted-foreground">
              Start free. Upgrade when you're ready.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  plan.popular
                    ? 'border-foreground/30 bg-background shadow-lg'
                    : 'border-border bg-background/60'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background px-3 py-0.5 text-xs font-semibold">
                    Most popular
                  </span>
                )}

                <div className="mb-6">
                  <p className="text-sm font-semibold text-muted-foreground">
                    {plan.name}
                  </p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / {plan.period}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="text-muted-foreground">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? 'default' : 'outline'}
                  className="w-full"
                  onClick={signInWithGoogle}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            All plans include a 7-day free trial of paid features. Cancel
            anytime.
          </p>
        </div>
      </section>

      {/* ── Social proof / stats strip ────────────────────────────────────── */}
      <section className="border-t border-border px-6 py-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-around gap-8 text-center sm:flex-row sm:gap-4">
          {[
            { value: 'Free', label: 'to get started' },
            { value: '< 1 min', label: 'setup time' },
            { value: '9 charts', label: 'of yearly analytics' },
            { value: 'AI-powered', label: 'bank import (Pro)' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mobile screenshots strip ──────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/20 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Works great on mobile too
            </h2>
            <p className="mt-2 text-muted-foreground">
              Log expenses from anywhere. Track income on the go.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <img
              src="/screenshots/mobile-board.png"
              alt="Family Space board view on mobile showing grocery list columns with checkboxes and bottom navigation"
              className="w-full rounded-2xl border border-border shadow-md aspect-9/16 object-cover object-top"
              loading="lazy"
            />
            <img
              src="/screenshots/mobile-finances.png"
              alt="Family Space finances page on mobile showing income vs expense chart and expense rows"
              className="w-full rounded-2xl border border-border shadow-md aspect-9/16 object-cover object-top"
              loading="lazy"
            />
            <img
              src="/screenshots/mobile-analytics.png"
              alt="Family Space analytics page on mobile showing year selector, total spend, and charts"
              className="w-full rounded-2xl border border-border shadow-md aspect-9/16 object-cover object-top"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to get organised?
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Set up takes less than a minute. Free forever for small families.
          </p>
          <Button
            size="lg"
            onClick={signInWithGoogle}
            className="mt-8 gap-3 px-7 py-6 text-base"
          >
            {GOOGLE_SVG}
            Get started with Google
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            No credit card required.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
