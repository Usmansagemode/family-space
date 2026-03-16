# Family Space

SaaS platform for families: grocery lists, chore management, and expense tracking — all in one place.

## Reference Projects

- **family-calendar** (`/Users/usmankhalid/Documents/Personal Projects/family-calendar`)
  — Boilerplate source. Board, spaces, items, drag & drop, invite flow, Google Calendar sync, monorepo structure, Supabase auth.
- **daily-expenses** (`/Users/usmankhalid/Documents/Personal Projects/daily-expenses`)
  — Feature source. Expense table, yearly analytics (9 charts), trackers, CSV/PDF import wizard (Gemini AI).

## Billing & Pricing

See `docs/billing-gates.md` for:
- Plan tiers (Free / Plus $5 / Pro $10) and feature gates
- How `usePlan()` hook works and where each gate lives
- Step-by-step Stripe setup (when ready to go live)
- How to test plans locally without Stripe

## Project Specification

See `SPEC.md` in this directory for the full project specification including:
- Data model (all tables + SQL)
- Deletion edge cases & decision matrix
- SaaS database indexes
- Feature map & implementation phases
- Open questions

## Tech Stack

- **Monorepo**: Turbo + npm workspaces
- **Web**: TanStack Start (Vite, SSR) + TanStack Router (file-based routing)
- **Mobile**: Expo (React Native + NativeWind)
- **Database**: Supabase (PostgreSQL + RLS)
- **Auth**: Supabase (Google OAuth + email/password)
- **Styling**: Tailwind CSS v4 + OKLCH colors
- **UI**: shadcn/ui (new-york) + MagicUI
- **Animation**: Motion (motion/react) — NOT framer-motion
- **Charts**: Recharts
- **Tables**: TanStack Table + TanStack Query v5
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **Forms**: React Hook Form + Zod
- **AI**: Google Gemini (PDF bank statement parsing)
- **Icons**: Lucide React
- **Path alias**: `@/` → `src/`

## Key Design Rules

### Spaces
- `type = 'person'` → appears as "Paid by" in expenses
- `type = 'store'` → appears as "Location" in expenses + as grocery list columns
- `type = 'chore'` → board only, never shown in expense pickers
- All spaces soft-deleted (`deleted_at`), never hard deleted if expenses reference them

### Categories
- Live in `categories` table per family — nothing hardcoded
- Soft-deleted (`deleted_at`); archived categories still show on historical expenses
- Delete dialog: if 0 expenses → hard delete; if >0 → "Archive" or "Reassign & Delete"

### Foreign Keys
- `expenses.category_id`, `expenses.location_id`, `expenses.paid_by_id` all use `ON DELETE SET NULL`
- UI shows "(Uncategorized)", "(Unknown location)", "(Unknown member)" for nulled FKs

### Date Handling
- **NEVER** use `new Date("YYYY-MM-DD")` — UTC shift breaks in US timezones
- Use `parseLocalDate()` from `@/lib/dateUtils` for all date string parsing
- Supabase DATE columns queried with plain strings (`"2026-01-15"`), never `.toISOString()`
- `items` uses TIMESTAMPTZ; `expenses` uses DATE (no time component)

### Multi-tenancy
- Every table has `family_id`; RLS enforces family isolation
- All queries scoped to `family_id` from auth context
- Indexes built around `(family_id, ...)` composite patterns

### Currency & Locale
- `formatCurrency()` for full display (tooltips, cards, tables)
- `formatCurrencyCompact()` for chart axis ticks
- Locale/currency stored per-family in `families` table

### Code Conventions
- TypeScript strict mode
- Imports sorted via `eslint-plugin-simple-import-sort`
- Unused vars prefixed with `_`
- `use<Feature>` hooks for queries, `use<Feature>Mutations` for mutations
- Feature components in `src/components/<feature>/`
- Shared entity types in `packages/types/src/`
