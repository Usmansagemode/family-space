# Family Space — Claude Instructions

## Project Overview

A family management kanban board. Each column ("Space") is either a family member or a store. Items live inside Spaces. Everything in one scrollable view.

## Commands

```bash
npm run dev       # start dev server at localhost:3000
npm run build     # production build
npm run check     # prettier write + eslint fix (run before committing)
npm run lint      # eslint only
npm run test      # vitest
```

## Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_CLIENT_SECRET=your-google-client-secret
```

If `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are missing, the app runs in **demo mode** with seeded in-memory data. No error is thrown.

## Tech Stack

- **Framework**: TanStack Start (SSR) + TanStack Router (file-based) + React 19
- **Data fetching**: TanStack Query v5
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Auth**: Supabase Google OAuth — `contexts/auth.tsx` manages session + provider token
- **Google Calendar**: bi-directional sync via Google Calendar REST API (`lib/google-calendar.ts`)
- **Styling**: Tailwind CSS v4, OKLCH color space, dark mode via class toggle
- **UI components**: shadcn/ui (New York style, copy-paste into `src/components/ui/`)
- **Icons**: Lucide React only — never HugeIcons or other icon sets
- **Forms**: React Hook Form + Zod (`zod` lives in devDependencies but bundles fine)
- **Toasts**: Sonner (`toast.success` / `toast.error`)
- **Drag & drop**: @dnd-kit/core + @dnd-kit/sortable
- **Dates**: date-fns

## Path Alias

Use `#/` for all imports from `src/`:

```ts
import { cn } from '#/lib/utils'
import type { Space } from '#/entities/Space'
```

Both `#/` and `@/` are configured in tsconfig, but `#/` is the project convention.

## Directory Structure

```
src/
├── routes/
│   ├── __root.tsx          # Root layout: header, providers, toaster
│   ├── index.tsx           # Board page (main view)
│   ├── invite.tsx          # Family invite acceptance flow
│   ├── privacy.tsx
│   └── terms.tsx
├── components/
│   ├── ui/                 # shadcn copy-paste components (never edit manually)
│   ├── board/
│   │   ├── SpaceView.tsx       # DndContext + board layout, renders SpaceColumns
│   │   ├── SpaceColumn.tsx     # Single draggable column with items list
│   │   ├── ItemCard.tsx        # Card with checkbox + colored background
│   │   ├── FocusOverlay.tsx    # Full-screen focus mode for a single space
│   │   ├── ItemDragOverlay.tsx # Ghost card shown while dragging
│   │   ├── AddSpaceSheet.tsx   # Create/edit space sheet
│   │   ├── AddItemSheet.tsx    # Create/edit item sheet (handles dates, recurrence, move)
│   │   └── HistorySheet.tsx    # Completed items history per space
│   ├── auth/
│   │   └── LoginPage.tsx       # Google sign-in landing
│   ├── Header.tsx              # App header: family name, activity, user menu, theme toggle
│   ├── SettingsSheet.tsx       # Family settings: name, members, Google Calendar connection
│   ├── ActivitySheet.tsx       # Recent activity feed (added/completed events)
│   ├── SearchDialog.tsx        # Cmd+K cross-space search
│   ├── CalendarView.tsx        # Embedded Google Calendar iframe
│   └── ThemeToggle.tsx         # Light/dark cycle, persists to localStorage
├── contexts/
│   ├── auth.tsx            # AuthProvider: user, providerToken, signInWithGoogle, signOut
│   └── board.tsx           # BoardProvider: familyId, providerToken, calendarId
├── hooks/
│   ├── useIsDark.ts        # Reactive dark mode detection (MutationObserver on <html>)
│   ├── spaces/
│   │   ├── useSpaces.ts
│   │   └── useSpaceMutations.ts
│   ├── items/
│   │   ├── useItems.ts
│   │   ├── useItemMutations.ts  # create, update, complete, remove, reAdd, move
│   │   └── useSearchItems.ts
│   ├── auth/
│   │   ├── useUserFamily.ts     # Finds or creates the family for the current user
│   │   └── useFamilyMembers.ts  # Lists members of a family
│   └── family/
│       ├── useFamily.ts
│       └── useActivityFeed.ts   # Recent add/complete events across all spaces
├── entities/
│   ├── Space.ts            # Space type + SpaceType union ('person' | 'store')
│   ├── Item.ts             # Item type + Recurrence union
│   ├── Activity.ts         # ActivityEvent type
│   └── Search.ts           # SearchResult type
├── lib/
│   ├── supabase.ts         # Client singleton + isDemoMode export
│   ├── supabase/
│   │   ├── spaces.ts       # CRUD + demo in-memory store
│   │   ├── items.ts        # CRUD + demo in-memory store
│   │   ├── families.ts     # Family + FamilyMember CRUD, findOrCreate
│   │   ├── activity.ts     # Recent activity feed query
│   │   └── invites.ts      # Invite creation + acceptance
│   ├── google-calendar.ts  # Google Calendar REST API: create/update/delete events
│   ├── calendar-sync.ts    # Higher-level sync helpers (tryCreate, tryDelete, syncOnUpdate)
│   ├── google-auth.ts      # signInWithGoogle() — shared by auth context + invite page
│   ├── date-utils.ts       # advanceDate() for recurring item scheduling
│   ├── config.ts           # SPACE_COLORS (OKLCH presets) + DEMO_FAMILY_ID
│   └── utils.ts            # cn(), formatDate(), formatDateFull(), hasExplicitTime(),
│                           #   formatTime(), extractHue(), getDateStatus(), DateStatus
└── styles.css              # Tailwind v4 + shadcn OKLCH CSS variables
```

## Code Conventions

### TypeScript

- Strict mode: `noUnusedLocals`, `noUnusedParameters`, `strict` all enabled
- Always use `type` imports for types: `import type { Space } from '#/entities/Space'`
- Named exports for all components (plus `export default` where needed for routes)

### Prettier

`semi: false`, `singleQuote: true`, `trailingComma: 'all'`

### File naming

- Components: `PascalCase.tsx`
- Hooks/utils: `camelCase.ts`
- Routes: `kebab-case.tsx` (TanStack Router convention)

### Components

- Small and focused, props-based composition
- No prop spreading unless wrapping a primitive (e.g., `<Input {...register('name')} />`)
- Named export from every component file
- Optional props (e.g. `onCreate?`) should be guarded with `?.` at the call site

### Hooks pattern

```ts
// useXxxMutations returns grouped mutation objects
export function useSpaceMutations(familyId: string) {
  return { create, update, remove, reorder } // useMutation instances
}
```

- Always call `queryClient.invalidateQueries` in `onSuccess`
- Always call `toast.error(...)` in `onError`
- Optimistic updates via `queryClient.setQueryData` in `onMutate` (used for complete/delete/move)
- Never import app-specific contexts directly inside hooks — pass values as parameters if needed

### Supabase pattern

- `isDemoMode` is exported from `lib/supabase.ts` — check it at the top of every function
- Demo stores are mutable module-level arrays (reset on page reload)
- DB column → TS property mapping: `snake_case` → `camelCase` (e.g., `space_id` → `spaceId`)
- All CRUD functions in `lib/supabase/` — never inline Supabase calls in components or hooks
- After `if (error) throw error`, Supabase types narrow `data` to non-null — use `data.map()` not `(data ?? []).map()`

### Google Calendar sync pattern

Calendar sync logic lives in `lib/calendar-sync.ts`, not inside hooks or components:

```ts
// Use these helpers in useItemMutations — never call google-calendar.ts directly from hooks
tryDeleteCalendarEvent(token, calendarId, googleEventId)
tryCreateCalendarEvent(token, calendarId, { title, startDate, endDate })
syncCalendarOnUpdate(token, calendarId, { existingEventId, title, ... })
```

### Google Auth pattern

```ts
// Always use lib/google-auth.ts — never duplicate signInWithOAuth calls
import { signInWithGoogle } from '#/lib/google-auth'

signInWithGoogle({ requestOfflineAccess: true })   // main app (needs refresh token)
signInWithGoogle({ redirectTo: window.location.href }) // invite page
```

### Modals

- **Sheet**: all forms (AddSpaceSheet, AddItemSheet, HistorySheet, SettingsSheet)
- **Dialog**: confirmations (not yet used but use for destructive confirms)
- Sheet pattern: `open` + `onOpenChange` props, `useEffect` to reset form state when `open` changes

### Dark mode

Use `useIsDark()` from `#/hooks/useIsDark` — not from `#/lib/utils`. It uses a MutationObserver on `<html class>` and is React-reactive.

## Supabase Schema

```sql
create table families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  google_calendar_id text,
  created_at timestamptz default now()
);

create table spaces (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  name text not null,
  color text not null,
  type text not null default 'store',   -- 'person' | 'store'
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

create table items (
  id uuid primary key default gen_random_uuid(),
  space_id uuid references spaces(id) on delete cascade,
  family_id uuid references families(id) on delete cascade,
  title text not null,
  description text,
  quantity text,
  recurrence text,                      -- 'daily' | 'weekly' | 'monthly' | 'yearly'
  sort_order integer not null default 0,
  start_date timestamptz,
  end_date timestamptz,
  completed boolean not null default false,
  completed_at timestamptz,
  created_by uuid references auth.users(id),
  google_event_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table user_families (
  user_id uuid references auth.users(id) on delete cascade,
  family_id uuid references families(id) on delete cascade,
  role text not null default 'member',  -- 'owner' | 'member'
  primary key (user_id, family_id)
);

create table invites (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade,
  token text unique not null,
  created_by uuid references auth.users(id),
  used_at timestamptz,
  created_at timestamptz default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  avatar_url text
);

-- Enable RLS on all tables
alter table families enable row level security;
alter table spaces enable row level security;
alter table items enable row level security;
alter table user_families enable row level security;
alter table invites enable row level security;
alter table profiles enable row level security;
```

## Key Design Decisions

- `DEMO_FAMILY_ID` is hardcoded in `lib/config.ts` — when real auth is active, `useUserFamily` resolves the family from the authenticated user
- Space colors are OKLCH strings from `SPACE_COLORS` in `lib/config.ts` — add colors there, not inline
- Board layout: `h-screen flex-col overflow-hidden` → header `h-14` → main `min-h-0 flex-1` → horizontal scroll inside SpaceView
- dnd-kit uses `PointerSensor` with `activationConstraint: { distance: 8 }` to prevent accidental drags on click
- Cross-space drag is only allowed between spaces of the same type (`person` ↔ `person`, `store` ↔ `store`)
- Noon (12:00) is the sentinel for "date picked, no explicit time" — `hasExplicitTime()` detects any other hour/minute
- Recurring items are advanced (not completed) when checked — `advanceDate()` in `lib/date-utils.ts`
- `BoardProvider` wraps the board and provides `familyId`, `providerToken`, `calendarId` to all child hooks without prop-drilling
