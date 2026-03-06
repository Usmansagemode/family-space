# Family Space — Developer Guide

This document covers everything needed to go from zero to a running local development environment, including all third-party service setup.

---

## Table of contents

1. [Prerequisites](#1-prerequisites)
2. [Clone & install](#2-clone--install)
3. [Environment variables](#3-environment-variables)
4. [Supabase setup](#4-supabase-setup)
5. [Google OAuth setup](#5-google-oauth-setup)
6. [Google Calendar API setup](#6-google-calendar-api-setup)
7. [Running locally](#7-running-locally)
8. [Project structure](#8-project-structure)
9. [Key patterns & conventions](#9-key-patterns--conventions)
10. [Deployment](#10-deployment)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Prerequisites

| Tool    | Version | Notes                                                                            |
| ------- | ------- | -------------------------------------------------------------------------------- |
| Node.js | 20+     | Use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) |
| npm     | 10+     | Comes with Node                                                                  |
| Git     | any     | —                                                                                |

You will also need accounts on:

- [Supabase](https://supabase.com) (free tier is fine)
- [Google Cloud Console](https://console.cloud.google.com)

---

## 2. Clone & install

```bash
git clone <repo-url> family-space
cd family-space
npm install
```

---

## 3. Environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Both values come from your Supabase project (see section 4).

> **Demo mode**: If either variable is missing or the file does not exist, the app runs in demo mode with in-memory data and no authentication. This is useful for UI work that does not need a real backend.

---

## 4. Supabase setup

### 4.1 Create a project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**, choose a name (e.g. `family-space`), pick a region close to your users, set a database password.
3. Wait for the project to provision (~1 min).

### 4.2 Get your API keys

In the Supabase dashboard go to **Project Settings → API**.

- Copy **Project URL** → `VITE_SUPABASE_URL`
- Copy **anon / public** key → `VITE_SUPABASE_ANON_KEY`

Paste both into your `.env` file.

### 4.3 Run the database schema

Go to **SQL Editor** in the Supabase dashboard and run the following blocks in order.

#### Tables

```sql
-- Families
create table families (
  id                        uuid primary key default gen_random_uuid(),
  name                      text not null default 'Our Family',
  google_calendar_id        text,
  google_calendar_embed_url text,
  created_at                timestamptz default now()
);

-- User profiles (mirrors auth.users into the public schema so it can be joined)
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  email      text,
  avatar_url text
);

-- Family membership (many-to-many, supports invites and multi-member families)
create table user_families (
  user_id   uuid references profiles(id) on delete cascade,
  family_id uuid references families(id) on delete cascade,
  role      text not null default 'member', -- 'owner' | 'member'
  joined_at timestamptz default now(),
  primary key (user_id, family_id)
);

-- One-time invite tokens
create table invites (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid references families(id) on delete cascade not null,
  token       uuid not null default gen_random_uuid() unique,
  accepted_at timestamptz,
  created_at  timestamptz default now()
);

-- Spaces (columns on the board)
create table spaces (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid references families(id) on delete cascade not null,
  name       text not null,
  color      text not null,
  type       text not null default 'store', -- 'person' | 'store'
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

-- Items (tasks / grocery entries)
create table items (
  id              uuid primary key default gen_random_uuid(),
  space_id        uuid references spaces(id) on delete cascade not null,
  title           text not null,
  description     text,
  quantity        text,        -- store spaces only (e.g. "2", "500g", "1 dozen")
  sort_order      integer not null default 0,
  start_date      timestamptz, -- person spaces only
  end_date        timestamptz, -- person spaces only
  completed       boolean not null default false,
  completed_at    timestamptz,
  google_event_id text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
```

#### Profile trigger

This auto-creates a profile row whenever a new user signs up for the first time.

```sql
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

#### Row Level Security

```sql
-- Enable RLS
alter table families    enable row level security;
alter table profiles    enable row level security;
alter table user_families enable row level security;
alter table invites     enable row level security;
alter table spaces      enable row level security;
alter table items       enable row level security;

-- Helper function: returns the family IDs the current user belongs to.
-- Must be security definer to avoid infinite recursion in RLS policies
-- that reference user_families.
create or replace function get_my_family_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select family_id from user_families where user_id = auth.uid()
$$;

-- Profiles: users can read all profiles, update only their own
create policy "Profiles are readable by authenticated users"
  on profiles for select to authenticated using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- user_families: any family member can see all members of their family
create policy "Family members can view all members"
  on user_families for select
  using (family_id in (select get_my_family_ids()));

create policy "Users can insert own membership"
  on user_families for insert
  with check (auth.uid() = user_id);

-- Needed for acceptInvite upsert (onConflict update path)
create policy "Users can update own membership"
  on user_families for update
  using (auth.uid() = user_id);

create policy "Owners can delete members"
  on user_families for delete
  using (family_id in (select get_my_family_ids()));

-- Families: readable and writable by any member
create policy "Family members can read family"
  on families for select
  using (id in (select get_my_family_ids()));

create policy "Family members can update family"
  on families for update
  using (id in (select get_my_family_ids()));

create policy "Authenticated users can create families"
  on families for insert to authenticated
  with check (true);

-- Invites: family members can create; anyone can read (needed for invite acceptance)
create policy "Family members can create invites"
  on invites for insert
  with check (family_id in (select get_my_family_ids()));

create policy "Anyone can read invites by token"
  on invites for select using (true);

create policy "Anyone can accept an invite"
  on invites for update using (true);

-- Spaces: full access for family members
create policy "Family members full access to spaces"
  on spaces for all
  using  (family_id in (select get_my_family_ids()))
  with check (family_id in (select get_my_family_ids()));

-- Items: full access for family members (via space → family)
create policy "Family members full access to items"
  on items for all
  using (exists (
    select 1 from spaces
    where spaces.id = items.space_id
    and spaces.family_id in (select get_my_family_ids())
  ))
  with check (exists (
    select 1 from spaces
    where spaces.id = items.space_id
    and spaces.family_id in (select get_my_family_ids())
  ));
```

---

## 5. Google OAuth setup

This enables "Sign in with Google" and grants the app permission to write to Google Calendar on behalf of the user.

### 5.1 Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Click the project dropdown at the top → **New Project**.
3. Give it a name (e.g. `family-space`) and click **Create**.

### 5.2 Enable the Google Calendar API

1. In the left sidebar go to **APIs & Services → Library**.
2. Search for **Google Calendar API** and click it.
3. Click **Enable**.

### 5.3 Configure the OAuth consent screen

1. Go to **APIs & Services → OAuth consent screen**.
2. Choose **External** and click **Create**.
3. Fill in:
   - **App name**: Family Space
   - **User support email**: your email
   - **Developer contact email**: your email
4. Click **Save and Continue** through the Scopes screen (you will add scopes via Supabase).
5. On the **Test users** screen, add the Gmail addresses of everyone who will use the app during development/testing.
6. Click **Save and Continue** until done.

> **Production**: When you want anyone to sign in (not just test users), you will need to submit the app for Google verification. For personal family use, keeping it in testing mode is fine indefinitely.

### 5.4 Create OAuth credentials

1. Go to **APIs & Services → Credentials**.
2. Click **Create Credentials → OAuth 2.0 Client ID**.
3. Choose **Web application**.
4. Under **Authorised redirect URIs** add:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
   Replace `<your-project-ref>` with your actual Supabase project reference (visible in your Supabase URL).
5. Click **Create**.
6. Copy the **Client ID** and **Client Secret** — you will need them in the next step.

### 5.5 Configure Supabase Google provider

1. In the Supabase dashboard go to **Authentication → Providers**.
2. Find **Google** and toggle it on.
3. Paste in the **Client ID** and **Client Secret** from step 5.4.
4. Make sure the **Callback URL** shown matches what you added in Google Cloud.
5. Click **Save**.

### 5.6 Add Calendar scope

The app needs the `calendar.events` scope so it can create and delete events.

In Supabase, go to **Authentication → Providers → Google** and add this to the **Scopes** field (space-separated):

```
https://www.googleapis.com/auth/calendar.events
```

Save again.

### 5.7 Test sign-in

1. Start the dev server (`npm run dev`).
2. Open `http://localhost:3000`.
3. Click **Sign in with Google**.
4. Complete the Google auth flow.
5. You should land on the board view. If you see an error, check [Troubleshooting](#11-troubleshooting).

---

## 6. Google Calendar API setup

This is optional. The app works without it — items simply won't sync to Google Calendar.

### 6.1 Create a dedicated calendar

1. Open [Google Calendar](https://calendar.google.com).
2. In the left sidebar under **Other calendars** click the **+** icon.
3. Choose **Create new calendar**.
4. Give it a name (e.g. `Family Space`) and click **Create calendar**.

### 6.2 Find the Calendar ID

1. Click the three dots next to your new calendar → **Settings**.
2. Scroll down to **Integrate calendar**.
3. Copy the **Calendar ID** — it looks like `abc123@group.calendar.google.com`.

### 6.3 Get the embed URL

On the same Settings page, scroll down to **Integrate calendar** and find the **Embed code** section.

The embed URL looks like:

```
https://calendar.google.com/calendar/embed?src=abc123%40group.calendar.google.com&ctz=America%2FNew_York
```

Copy the full URL (not the `<iframe>` tag, just the `src` value).

### 6.4 Add both to Family Space settings

1. Sign in to the app.
2. Click the avatar in the top-right → **Settings**.
3. Paste the **Calendar ID** into the Google Calendar ID field.
4. Paste the **embed URL** into the Calendar Embed URL field.
5. Click **Save**.

Any item you create with a date will now appear in that Google Calendar automatically.

---

## 7. Running locally

```bash
# Start dev server (port 3000)
npm run dev

# Type-check
npx tsc --noEmit

# Lint + format
npm run check

# Build for production
npm run build

# Preview production build
npm run preview
```

The app runs on `http://localhost:3000` in dev mode.

---

## 8. Project structure

```
src/
├── routes/
│   ├── __root.tsx        # Root shell: providers, Header, Toaster
│   └── index.tsx         # Main page: auth gate, Board/Calendar tabs
│
├── components/
│   ├── ui/               # shadcn/ui primitives (Radix UI wrappers)
│   ├── auth/
│   │   └── LoginPage.tsx # Public landing page + sign-in button
│   ├── board/
│   │   ├── SpaceView.tsx     # Horizontal drag-and-drop board
│   │   ├── SpaceColumn.tsx   # Single space column
│   │   ├── ItemCard.tsx      # Task card with checkbox
│   │   ├── AddItemSheet.tsx  # Create / edit item form
│   │   ├── AddSpaceSheet.tsx # Create / edit space form
│   │   └── HistorySheet.tsx  # Completed items with re-add
│   ├── Header.tsx        # App header with family name + user dropdown
│   ├── SettingsSheet.tsx # Family name, calendar ID, embed URL
│   └── CalendarView.tsx  # Google Calendar iframe
│
├── hooks/
│   ├── auth/
│   │   └── useUserFamily.ts       # Fetch/create family for current user
│   ├── spaces/
│   │   ├── useSpaces.ts           # Read spaces for a family
│   │   └── useSpaceMutations.ts   # Create, update, delete, reorder spaces
│   └── items/
│       ├── useItems.ts            # Read items for a space
│       └── useItemMutations.ts    # Create, update, complete, delete, re-add items
│
├── contexts/
│   ├── auth.tsx          # AuthContext: user, providerToken, signIn, signOut
│   └── board.tsx         # BoardContext: familyId, providerToken, calendarId
│
├── entities/
│   ├── Item.ts           # Item TypeScript type
│   └── Space.ts          # Space TypeScript type
│
├── lib/
│   ├── supabase.ts           # Supabase client (null in demo mode)
│   ├── google-calendar.ts    # Google Calendar REST API wrappers
│   ├── config.ts             # SPACE_COLORS palette, DEMO_FAMILY_ID
│   ├── utils.ts              # cn(), formatDate(), hasExplicitTime(), useIsDark()
│   └── supabase/
│       ├── families.ts       # Family CRUD
│       ├── spaces.ts         # Space CRUD + reorder
│       └── items.ts          # Item CRUD + complete + reAdd
│
└── styles.css            # Tailwind v4 + OKLCH theme variables
```

---

## 9. Key patterns & conventions

### Demo mode

If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are not set, `isDemoMode = true`. Every data function in `src/lib/supabase/` has an in-memory fallback branch. Use this for UI development without a Supabase connection.

### Data fetching

All server state lives in TanStack Query. Query keys follow this convention:

```ts
;['family', familyId][('family', 'user', userId)][('spaces', familyId)][ // single family by ID // family belonging to a user // spaces for a family
  ('items', spaceId)
] // items for a space
```

### Mutations

Mutations are grouped in `useXxxMutations` hooks. Each returns `{ create, update, remove, ... }`. Every mutation shows a `toast.error` on failure. Invalidate related query keys in `onSuccess`.

### Sheet closing pattern

Sheets do **not** close themselves on submit. The parent component closes the sheet in the mutation's `onSuccess` callback:

```ts
create.mutate(input, { onSuccess: () => setOpen(false) })
```

This keeps the sheet (and its loader) visible until the server confirms success.

### Space type behaviour

`SpaceType` is `'person' | 'store'`. The two types have different item fields:

| Field | `person` | `store` |
|-------|----------|---------|
| `quantity` | — | ✓ free-text (e.g. "2", "500g") |
| `start_date` / `end_date` | ✓ | — |
| Google Calendar sync | ✓ (when date set) | — |

`AddItemSheet` receives a `spaceType` prop and conditionally renders the relevant fields. `ItemCard` shows `× {quantity}` inline when quantity is present.

### Space colours

Colours are OKLCH strings (e.g. `oklch(0.88 0.10 230)`). The `extractHue()` utility pulls the hue component out for per-space checkbox and card theming. The palette is defined in `src/lib/config.ts`.

### Date sentinel

When a user picks a date with no time, the date is stored at noon local time (`T12:00:00`). `hasExplicitTime(date)` returns `false` when hours === 12 and minutes === 0. This keeps dates and datetimes in the same column in Supabase.

### Code style

- **Prettier**: `semi: false`, `singleQuote: true`, `trailingComma: 'all'`
- **TypeScript**: strict mode, `noUnusedLocals`, `noUnusedParameters`
- **Components**: named exports, props typed inline
- **Path alias**: `#/` maps to `src/` (configured in `package.json` imports and `tsconfig.json`)

---

## 10. Deployment

The app is a client-side Vite/React SPA. Any static host works.

### Netlify / Vercel

1. Connect the repo.
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Supabase — update redirect URIs

After deploying, add your production URL to the **Authorised redirect URIs** in Google Cloud Console:

```
https://your-app.vercel.app
```

And add it in Supabase under **Authentication → URL Configuration → Redirect URLs**.

---

## 11. Troubleshooting

### "Invalid login" / OAuth error after sign-in

- Check that the redirect URI in Google Cloud Console exactly matches the Supabase callback URL (including no trailing slash).
- Check that your email is in the **Test users** list in Google Cloud Console.
- Check that the Google provider is enabled in Supabase **Authentication → Providers**.

### Calendar events not appearing in Google Calendar

- Confirm the Calendar ID in Settings matches the one in Google Calendar → Settings → Integrate calendar.
- Check the browser console for a 401 or 403 error from the Calendar API. This usually means the OAuth token has expired — sign out and sign back in.
- Make sure the `https://www.googleapis.com/auth/calendar.events` scope is listed in the Supabase Google provider scopes field.

### Family members not showing / only one member appears

- The `profiles` table must exist and be populated. If you added users before creating the trigger, backfill them:
  ```sql
  insert into profiles (id, email, name, avatar_url)
  select id, email,
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'avatar_url'
  from auth.users
  on conflict (id) do nothing;
  ```
- Check the `get_my_family_ids()` function exists — without it the `user_families` RLS policy will cause infinite recursion and crash the app.
- Check the RLS policy on `user_families` uses `get_my_family_ids()`, **not** a direct `select from user_families` subquery (that causes infinite recursion).

### Items load but spaces are empty / vice versa

- Check the RLS policies are applied (section 4.3). A missing policy silently returns empty arrays.
- In the Supabase dashboard, go to **Table Editor** and verify rows exist in the `spaces` and `items` tables.

### App shows demo data after adding `.env`

- Vite reads `.env` at startup. Restart the dev server after adding or changing `.env`.

### TypeScript errors on `zod`

This project uses Zod v4. The API changed slightly from v3. Refer to the [Zod v4 migration guide](https://zod.dev) if you see type errors on schema methods.
