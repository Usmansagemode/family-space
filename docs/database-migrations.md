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
