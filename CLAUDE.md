# Family Board — Claude Instructions

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
```
If these are missing, the app runs in **demo mode** with seeded in-memory data. No error is thrown.

## Tech Stack
- **Framework**: TanStack Start (SSR) + TanStack Router (file-based) + React 19
- **Data fetching**: TanStack Query v5
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
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
│   └── index.tsx           # Board page (main view)
├── components/
│   ├── ui/                 # shadcn copy-paste components (never edit manually)
│   ├── board/
│   │   ├── BoardView.tsx   # DndContext + horizontal scroll, renders SpaceColumns
│   │   ├── SpaceColumn.tsx # Single draggable column
│   │   ├── ItemCard.tsx    # Card with checkbox + colored left stripe
│   │   ├── AddSpaceSheet.tsx
│   │   ├── AddItemSheet.tsx
│   │   └── HistorySheet.tsx
│   ├── Header.tsx          # "Family Board" title + demo badge + theme toggle
│   └── ThemeToggle.tsx     # Light/dark/auto cycle, persists to localStorage
├── hooks/
│   ├── spaces/
│   │   ├── useSpaces.ts
│   │   └── useSpaceMutations.ts
│   └── items/
│       ├── useItems.ts
│       └── useItemMutations.ts
├── entities/
│   ├── Space.ts            # Space type + SpaceType union
│   └── Item.ts             # Item type
├── lib/
│   ├── supabase.ts         # Client + isDemoMode export
│   ├── supabase/
│   │   ├── spaces.ts       # CRUD + demo in-memory store
│   │   └── items.ts        # CRUD + demo in-memory store
│   ├── config.ts           # SPACE_COLORS (8 OKLCH presets) + DEMO_FAMILY_ID
│   └── utils.ts            # cn(), formatDate(), formatDateFull()
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

### Hooks pattern
```ts
// useXxxMutations returns grouped mutation objects
export function useSpaceMutations(familyId: string) {
  return { create, update, remove, reorder }  // useMutation instances
}
```
- Always call `queryClient.invalidateQueries` in `onSuccess`
- Always call `toast.error(...)` in `onError`
- Optimistic updates via `queryClient.setQueryData` in `onMutate` (used for complete/delete)

### Supabase pattern
- `isDemoMode` is exported from `lib/supabase.ts` — check it at the top of every function
- Demo stores are mutable module-level arrays (reset on page reload)
- DB column → TS property mapping: `snake_case` → `camelCase` (e.g., `space_id` → `spaceId`)
- All CRUD functions in `lib/supabase/spaces.ts` or `lib/supabase/items.ts` — never inline Supabase calls in components or hooks

### Modals
- **Sheet**: all forms (AddSpaceSheet, AddItemSheet, HistorySheet)
- **Dialog**: confirmations (not yet used but use for destructive confirms)
- Sheet pattern: `open` + `onOpenChange` props, `useEffect` to reset form state when `open` changes

## Supabase Schema
Run this SQL in the Supabase dashboard to set up the database:

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
  title text not null,
  description text,
  start_date timestamptz,
  end_date timestamptz,
  completed boolean not null default false,
  completed_at timestamptz,
  google_event_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on all tables
alter table families enable row level security;
alter table spaces enable row level security;
alter table items enable row level security;
```

## Key Design Decisions
- `DEMO_FAMILY_ID` is hardcoded in `lib/config.ts` and passed from `routes/index.tsx` — when adding real auth, replace this with the authenticated user's family ID
- Space colors are OKLCH strings from `SPACE_COLORS` in `lib/config.ts` — add colors there, not inline
- Board layout uses `h-screen overflow-hidden` → header fixed at `h-14` → main `min-h-0 flex-1` → horizontal scroll inside BoardView
- dnd-kit uses `PointerSensor` with `activationConstraint: { distance: 8 }` to prevent accidental drags on click

## Planned Features (not yet built)
- Google Calendar integration: OAuth via Supabase Google provider, bi-directional event sync on item date set/complete/delete
- Real auth: Supabase Auth, family_id scoping via RLS
- Settings page: connect Google account + enter shared calendar ID
