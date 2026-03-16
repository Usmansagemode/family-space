# Database Migrations

All schema changes after the initial setup, in chronological order.
Run these in the Supabase SQL Editor under **Database → SQL Editor**.

---

## 001 — Store-to-person assignment (2026-03-13)

Allows a store space to be assigned to a person space so the person can
launch that store's Focus Mode directly from their chores column.

```sql
alter table spaces
  add column assigned_person_id uuid references spaces(id) on delete set null;
```

**What it does**
- Adds a nullable self-referencing FK on `spaces`.
- Only store rows use this column (person rows leave it `null`).
- `on delete set null` means deleting a person space automatically clears
  any store assignments pointing to it — no orphaned references.

**No back-fill needed** — existing rows default to `null` (unassigned).

**Related code changes**
- `packages/types/src/Space.ts` — `assignedPersonId: string | null` added to `Space` type
- `packages/supabase/src/spaces.ts` — `rowToSpace` maps `assigned_person_id`, `updateSpace` accepts `assignedPersonId`
- `packages/hooks/src/spaces/useSpaceMutations.ts` — new `assign` mutation (no edit-sheet required)
- `apps/web/src/components/board/SpaceColumn.tsx` — "Assign to person" sub-menu on store columns; "Your stores" shop section on person columns
- `apps/web/src/components/board/SpaceView.tsx` — `allSpaces` + `onShop` props on SpaceColumn; FocusOverlay lookup uses full space list so cross-tab focus works

---

## 002 — Activity log (2026-03-16)

Replaces the derived-from-items activity feed with a dedicated `activity_log`
table that captures events across all domains (items, expenses, imports, member joins).

```sql
-- Table
create table activity_log (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references families(id) on delete cascade,
  actor_id   uuid references auth.users(id) on delete set null,
  event_type text not null,
  payload    jsonb not null default '{}',
  created_at timestamptz default now()
);

-- Grant
grant select, insert on activity_log to authenticated;

-- RLS
alter table activity_log enable row level security;
create policy "activity_log_select" on activity_log
  for select to authenticated using (is_family_member(family_id));
create policy "activity_log_insert" on activity_log
  for insert to authenticated with check (is_family_member(family_id));

-- Index
create index idx_activity_log_family_recent
  on activity_log (family_id, created_at desc);

-- Trigger: item.added
create or replace function log_item_added()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_family_id  uuid;
  v_space_name text;
  v_space_color text;
begin
  select family_id, name, color into v_family_id, v_space_name, v_space_color
  from spaces where id = NEW.space_id;

  insert into activity_log (family_id, actor_id, event_type, payload)
  values (
    v_family_id, auth.uid(), 'item.added',
    jsonb_build_object('title', NEW.title, 'space_name', v_space_name, 'space_color', v_space_color)
  );
  return NEW;
end;
$$;

create trigger log_item_added_trigger
  after insert on items
  for each row execute function log_item_added();

-- Trigger: item.completed
create or replace function log_item_completed()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_family_id  uuid;
  v_space_name text;
  v_space_color text;
begin
  if NEW.completed = true and (OLD.completed = false or OLD.completed is null) then
    select family_id, name, color into v_family_id, v_space_name, v_space_color
    from spaces where id = NEW.space_id;

    insert into activity_log (family_id, actor_id, event_type, payload)
    values (
      v_family_id, auth.uid(), 'item.completed',
      jsonb_build_object('title', NEW.title, 'space_name', v_space_name, 'space_color', v_space_color)
    );
  end if;
  return NEW;
end;
$$;

create trigger log_item_completed_trigger
  after update on items
  for each row execute function log_item_completed();
```

**What it does**
- Adds `activity_log` — a write-once append log scoped to `family_id`
- Items write via DB triggers (zero app-layer changes); expenses, imports, and member joins write from application code
- `event_type` values: `item.added`, `item.completed`, `expense.added`, `expenses.imported`, `member.joined`
- `payload` stores display-ready fields (title, amount, count, etc.) so the feed requires no joins at read time
- Feed window: last 14 days, limit 50 rows

**No back-fill needed** — feed only shows forward from when the migration runs.

**Related code changes**
- `packages/types/src/Activity.ts` — new `ActivityEventType` union + updated `ActivityEvent` shape
- `packages/supabase/src/activity.ts` — `logActivity()` (fire-and-forget) + `fetchActivityLog()`
- `packages/supabase/src/expenses.ts` — calls `logActivity` after `createExpense`
- `packages/supabase/src/invites.ts` — calls `logActivity` after `acceptInvite`
- `apps/web/src/contexts/csvImport.tsx` — calls `logActivity` once after bulk import (not per-row)
- `packages/hooks/src/family/useActivityFeed.ts` — reads from `activity_log` instead of deriving from `items`
- `apps/web/src/components/ActivitySheet.tsx` — per-event-type icons and render logic

---

## 003 — Recurring transactions (2026-03-16)

Replaces `recurring_expenses` with a unified `recurring_transactions` table that handles
both recurring expenses and recurring income. Adds `recurring_transaction_id` FK to both
`expenses` and `income_entries` to link generated rows back to their template.

```sql
-- 1. Unified recurring template table
create table recurring_transactions (
  id            uuid primary key default gen_random_uuid(),
  family_id     uuid not null references families(id) on delete cascade,
  direction     text not null check (direction in ('expense', 'income')),
  description   text not null,
  amount        numeric(12, 2) not null,
  frequency     text not null check (frequency in ('weekly', 'monthly', 'yearly')),
  start_date    date not null,
  next_due_date date not null,
  end_date      date,
  -- expense-only (null when direction = 'income')
  category_id   uuid references categories(id) on delete set null,
  location_id   uuid references spaces(id) on delete set null,
  paid_by_id    uuid references spaces(id) on delete set null,
  -- income-only (null when direction = 'expense')
  person_id     uuid references spaces(id) on delete set null,
  income_type   text check (income_type in ('salary', 'side_gig', 'freelance', 'business', 'rental', 'investment', 'other')),
  created_at    timestamptz default now()
);

-- 2. Grant
grant select, insert, update, delete on recurring_transactions to authenticated;

-- 3. RLS
alter table recurring_transactions enable row level security;
create policy "recurring_transactions_select" on recurring_transactions
  for select to authenticated using (is_family_member(family_id));
create policy "recurring_transactions_insert" on recurring_transactions
  for insert to authenticated with check (is_family_member(family_id));
create policy "recurring_transactions_update" on recurring_transactions
  for update to authenticated
  using (is_family_member(family_id)) with check (is_family_member(family_id));
create policy "recurring_transactions_delete" on recurring_transactions
  for delete to authenticated using (is_family_member(family_id));

-- 4. Add FK columns to expenses and income_entries
alter table expenses
  add column recurring_transaction_id uuid references recurring_transactions(id) on delete set null;
alter table income_entries
  add column recurring_transaction_id uuid references recurring_transactions(id) on delete set null;

-- 5. Indexes
create index idx_recurring_transactions_family
  on recurring_transactions (family_id, created_at desc);
create index idx_recurring_transactions_due
  on recurring_transactions (family_id, next_due_date);

-- 6. Migrate existing recurring_expenses rows (if any exist)
insert into recurring_transactions (
  id, family_id, direction, description, amount, frequency,
  start_date, next_due_date, end_date,
  category_id, location_id, paid_by_id, created_at
)
select
  id, family_id, 'expense', description, amount, frequency,
  start_date, next_due_date, end_date,
  category_id, location_id, paid_by_id, created_at
from recurring_expenses;

-- 7. Drop old table
drop table recurring_expenses;
```

**What it does**
- One `recurring_transactions` table replaces `recurring_expenses` — `direction` field determines expense vs income
- `expense`-direction rows carry `category_id`, `location_id`, `paid_by_id` (income fields null)
- `income`-direction rows carry `person_id`, `income_type` (expense fields null)
- `recurring_transaction_id` FK on both `expenses` and `income_entries` links generated entries back to template
- Catch-up and auto-generate logic branches on `direction` to call `createExpense` or `createIncomeEntry`

**No back-fill needed for FK columns** — existing expenses/income_entries set `recurring_transaction_id = null` (manual entries).

**Related code changes**
- `packages/types/src/RecurringTransaction.ts` — new unified type (replaces `RecurringExpense`)
- `packages/supabase/src/recurringTransactions.ts` — new CRUD functions
- `packages/supabase/src/expenses.ts` — `createExpense` accepts optional `recurringTransactionId`
- `packages/supabase/src/income.ts` — `createIncomeEntry` accepts optional `recurringTransactionId`
- `apps/web/src/lib/recurringExpenses.ts` — `CatchUpItem` now uses `RecurringTransaction`
- `apps/web/src/hooks/expenses/useRecurringTransactions.ts` — new query hook
- `apps/web/src/hooks/expenses/useRecurringTransactionMutations.ts` — new mutation hook
- `apps/web/src/components/expenses/RecurringTransactionDialog.tsx` — new dialog with direction toggle + income fields
- `apps/web/src/components/expenses/CatchUpDialog.tsx` — branches on `direction` for entry generation
- `apps/web/src/routes/expenses/index.tsx` — all recurring references updated
