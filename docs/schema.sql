-- ================================================================
-- FAMILY SPACE — COMPLETE DATABASE SETUP
-- Safe to re-run: drops everything first, then rebuilds clean.
-- Run the entire script in one shot in Supabase SQL Editor.
-- ================================================================


-- ----------------------------------------------------------------
-- PART 1: DROP EVERYTHING (reverse dependency order)
-- ----------------------------------------------------------------

drop trigger if exists on_auth_user_created        on auth.users;
drop trigger if exists set_item_created_by_trigger on items;

drop function if exists handle_new_user()                    cascade;
drop function if exists set_item_created_by()                cascade;
drop function if exists find_or_create_family(uuid)          cascade;
drop function if exists accept_invite(uuid, uuid, uuid)      cascade;
drop function if exists is_family_member(uuid)               cascade;
drop function if exists is_family_owner(uuid)                cascade;
drop function if exists item_is_family_member(uuid)          cascade;
drop function if exists update_updated_at()                  cascade;

drop table if exists tracker_entries  cascade;
drop table if exists trackers         cascade;
drop table if exists budgets          cascade;
drop table if exists income_entries   cascade;
drop table if exists income_sources   cascade;
drop table if exists expenses         cascade;
drop table if exists items            cascade;
drop table if exists invites          cascade;
drop table if exists categories       cascade;
drop table if exists spaces           cascade;
drop table if exists user_families    cascade;
drop table if exists family_members   cascade;
drop table if exists families         cascade;
drop table if exists profiles         cascade;


-- ----------------------------------------------------------------
-- PART 2: TABLES
-- ----------------------------------------------------------------

-- Mirrors auth.users — auto-populated via trigger on signup
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  email      text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table families (
  id                        uuid primary key default gen_random_uuid(),
  name                      text not null,
  plan                      text not null default 'free' check (plan in ('free', 'pro')),
  currency                  text not null default 'USD',
  locale                    text not null default 'en-US',
  google_calendar_id        text,
  google_calendar_embed_url text,
  google_refresh_token      text,
  created_at                timestamptz default now(),
  updated_at                timestamptz default now()
);

-- user_families: many-to-many users <-> families
-- The second FK to profiles is required for PostgREST to resolve
-- .select('user_id, role, profiles(name, email, avatar_url)') joins.
create table user_families (
  user_id   uuid not null references auth.users(id) on delete cascade,
  family_id uuid not null references families(id)   on delete cascade,
  role      text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz default now(),
  primary key (user_id, family_id),
  constraint user_families_profile_fkey
    foreign key (user_id) references profiles(id) on delete cascade
);

-- Shareable invite links; token is the secret passed in the URL
create table invites (
  token       uuid primary key default gen_random_uuid(),
  family_id   uuid not null references families(id) on delete cascade,
  accepted_at timestamptz,
  created_at  timestamptz default now()
);

-- Board columns: person (paid-by / chore assignee) or store (grocery list) or chore
create table spaces (
  id                 uuid primary key default gen_random_uuid(),
  family_id          uuid not null references families(id) on delete cascade,
  name               text not null,
  color              text not null default 'oklch(0.7 0.15 250)',
  type               text not null default 'store' check (type in ('person', 'store', 'chore')),
  sort_order         integer not null default 0,
  show_in_expenses   boolean not null default true,
  assigned_person_id uuid references spaces(id) on delete set null,
  -- person spaces auto-created on join are system spaces — cannot be deleted
  is_system          boolean not null default false,
  -- links a person space back to the family member it represents
  linked_user_id     uuid references auth.users(id) on delete set null,
  deleted_at         timestamptz,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

-- Expense categories per family; soft-deleted to preserve history
create table categories (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references families(id) on delete cascade,
  name       text not null,
  color      text,
  icon       text,
  sort_order integer not null default 0,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- All three FKs use ON DELETE SET NULL — deleting a space/category
-- never destroys expense records. UI shows "(Unknown)" for null FKs.
create table expenses (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references families(id) on delete cascade,
  amount      numeric(12, 2) not null,
  category_id uuid references categories(id) on delete set null,
  location_id uuid references spaces(id) on delete set null,   -- type='store'
  paid_by_id  uuid references spaces(id) on delete set null,   -- type='person'
  date        date not null,
  description text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Recurring / expected income sources
create table income_sources (
  id         uuid primary key default gen_random_uuid(),
  family_id  uuid not null references families(id) on delete cascade,
  person_id  uuid references spaces(id) on delete set null,
  name       text not null,
  type       text check (type in ('salary', 'side_gig', 'freelance', 'business', 'rental', 'investment', 'other')),
  amount     numeric(12, 2) not null,
  frequency  text check (frequency in ('weekly', 'biweekly', 'monthly', 'yearly')),
  start_date date,
  end_date   date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Actual logged income entries
create table income_entries (
  id               uuid primary key default gen_random_uuid(),
  family_id        uuid not null references families(id) on delete cascade,
  income_source_id uuid references income_sources(id) on delete set null,
  person_id        uuid references spaces(id) on delete set null,
  amount           numeric(12, 2) not null,
  date             date not null,
  description      text,
  created_at       timestamptz default now()
);

-- Budgets: null person_id = family-wide; null category_id = overall
create table budgets (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references families(id) on delete cascade,
  person_id   uuid references spaces(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  amount      numeric(12, 2) not null,
  period      text not null check (period in ('monthly', 'yearly')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Board task / grocery cards (no family_id — scoped via space → family)
create table items (
  id              uuid primary key default gen_random_uuid(),
  space_id        uuid not null references spaces(id) on delete cascade,
  title           text not null,
  description     text,
  quantity        text,
  recurrence      text check (recurrence in ('daily', 'weekly', 'monthly', 'yearly')),
  sort_order      integer not null default 0,
  start_date      timestamptz,
  end_date        timestamptz,
  completed       boolean not null default false,
  completed_at    timestamptz,
  completed_by    uuid references auth.users(id) on delete set null,
  created_by      uuid references auth.users(id) on delete set null,
  google_event_id text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Trackers: debt / savings / loans
create table trackers (
  id              uuid primary key default gen_random_uuid(),
  family_id       uuid not null references families(id) on delete cascade,
  title           text not null,
  description     text,
  initial_balance numeric(12, 2) not null default 0,
  current_balance numeric(12, 2) not null default 0,
  color           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table tracker_entries (
  id         uuid primary key default gen_random_uuid(),
  tracker_id uuid not null references trackers(id) on delete cascade,
  family_id  uuid not null references families(id) on delete cascade,
  date       date not null,
  description text,
  debit      numeric(12, 2) not null default 0,
  credit     numeric(12, 2) not null default 0,
  balance    numeric(12, 2) not null default 0,
  created_at timestamptz default now()
);


-- ----------------------------------------------------------------
-- PART 3: GRANTS
-- SQL-created tables start with no grants; RLS blocks everything
-- before policies are evaluated without these.
-- ----------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on profiles        to authenticated;
grant select, insert, update, delete on families        to authenticated;
grant select, insert, update, delete on user_families   to authenticated;
grant select, insert, update, delete on spaces          to authenticated;
grant select, insert, update, delete on categories      to authenticated;
grant select, insert, update, delete on expenses        to authenticated;
grant select, insert, update, delete on income_sources  to authenticated;
grant select, insert, update, delete on income_entries  to authenticated;
grant select, insert, update, delete on budgets         to authenticated;
grant select, insert, update, delete on items           to authenticated;
grant select, insert, update, delete on trackers        to authenticated;
grant select, insert, update, delete on tracker_entries to authenticated;
grant select                          on invites         to anon;
grant select, insert, update          on invites         to authenticated;


-- ----------------------------------------------------------------
-- PART 4: UPDATED_AT TRIGGER
-- ----------------------------------------------------------------

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at        before update on profiles        for each row execute function update_updated_at();
create trigger trg_families_updated_at        before update on families        for each row execute function update_updated_at();
create trigger trg_spaces_updated_at          before update on spaces          for each row execute function update_updated_at();
create trigger trg_categories_updated_at      before update on categories      for each row execute function update_updated_at();
create trigger trg_expenses_updated_at        before update on expenses        for each row execute function update_updated_at();
create trigger trg_income_sources_updated_at  before update on income_sources  for each row execute function update_updated_at();
create trigger trg_budgets_updated_at         before update on budgets         for each row execute function update_updated_at();
create trigger trg_items_updated_at           before update on items           for each row execute function update_updated_at();
create trigger trg_trackers_updated_at        before update on trackers        for each row execute function update_updated_at();


-- ----------------------------------------------------------------
-- PART 5: SIGNUP TRIGGER
-- Auto-creates a profile row whenever a user signs up.
-- SECURITY DEFINER + search_path = public is required — without it
-- the trigger runs in the auth schema and cannot find public.profiles.
-- ----------------------------------------------------------------

create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- ----------------------------------------------------------------
-- PART 6: SET created_by TRIGGER ON ITEMS
-- Auto-stamps created_by = auth.uid() on every new item row.
-- ----------------------------------------------------------------

create or replace function set_item_created_by()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.created_by := auth.uid();
  return new;
end;
$$;

create trigger set_item_created_by_trigger
  before insert on items
  for each row execute function set_item_created_by();


-- ----------------------------------------------------------------
-- PART 7: RLS HELPER FUNCTIONS
-- SECURITY DEFINER lets them query user_families without going
-- through RLS on that table (prevents infinite recursion).
-- ----------------------------------------------------------------

create or replace function is_family_member(fid uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists(
    select 1 from user_families where user_id = auth.uid() and family_id = fid
  )
$$;

create or replace function is_family_owner(fid uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists(
    select 1 from user_families
    where user_id = auth.uid() and family_id = fid and role = 'owner'
  )
$$;

-- For items: checks membership via the parent space (items have no family_id)
create or replace function item_is_family_member(sid uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists(
    select 1
    from spaces s
    join user_families uf on uf.family_id = s.family_id
    where s.id = sid and uf.user_id = auth.uid()
  )
$$;

grant execute on function is_family_member(uuid)      to authenticated;
grant execute on function is_family_owner(uuid)       to authenticated;
grant execute on function item_is_family_member(uuid) to authenticated;


-- ----------------------------------------------------------------
-- PART 8: RPC FUNCTIONS
-- Called via supabase.rpc() — never as direct table operations.
-- ----------------------------------------------------------------

-- Called on every login. Upserts the profile and returns the user's
-- family, creating one (as owner) if they don't have one yet.
-- Also ensures a system person space exists for this member.
create or replace function find_or_create_family(p_user_id uuid)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_family_id uuid;
  v_family    families%rowtype;
  v_name      text;
begin
  insert into profiles (id, name, email, avatar_url)
  select id, coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'), email, raw_user_meta_data->>'avatar_url'
  from auth.users where id = p_user_id
  on conflict (id) do update
    set name = excluded.name, email = excluded.email, avatar_url = excluded.avatar_url;

  select family_id into v_family_id
  from user_families where user_id = p_user_id
  order by joined_at asc limit 1;

  if v_family_id is not null then
    -- Ensure system person space exists (idempotent)
    select coalesce(p.name, u.email) into v_name
    from auth.users u left join profiles p on p.id = u.id
    where u.id = p_user_id;

    insert into spaces (family_id, name, type, show_in_expenses, is_system, linked_user_id, sort_order)
    select v_family_id, coalesce(v_name, 'Member'), 'person', true, true, p_user_id,
           coalesce((select max(sort_order) + 1 from spaces where family_id = v_family_id), 0)
    where not exists (
      select 1 from spaces where family_id = v_family_id and linked_user_id = p_user_id and type = 'person'
    );

    select * into v_family from families where id = v_family_id;
    return row_to_json(v_family);
  end if;

  insert into families (name) values ('Our Family') returning * into v_family;
  insert into user_families (user_id, family_id, role) values (p_user_id, v_family.id, 'owner');

  -- Create owner's system person space
  select coalesce(p.name, u.email) into v_name
  from auth.users u left join profiles p on p.id = u.id
  where u.id = p_user_id;

  insert into spaces (family_id, name, type, show_in_expenses, is_system, linked_user_id, sort_order)
  values (v_family.id, coalesce(v_name, 'Owner'), 'person', true, true, p_user_id, 0);

  return row_to_json(v_family);
end;
$$;

-- Called when a user accepts a family invite link.
create or replace function accept_invite(p_token uuid, p_user_id uuid, p_family_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_name text;
begin
  insert into profiles (id, name, email, avatar_url)
  select id, coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'), email, raw_user_meta_data->>'avatar_url'
  from auth.users where id = p_user_id
  on conflict (id) do update
    set name = excluded.name, email = excluded.email, avatar_url = excluded.avatar_url;

  -- Delete solo families auto-created on signup (user is the only member)
  delete from families
  where id in (
    select uf.family_id from user_families uf
    where uf.user_id = p_user_id
      and uf.family_id != p_family_id
      and (select count(*) from user_families where family_id = uf.family_id) = 1
  );

  delete from user_families where user_id = p_user_id and family_id != p_family_id;

  insert into user_families (user_id, family_id, role)
  values (p_user_id, p_family_id, 'member')
  on conflict (user_id, family_id) do nothing;

  -- Create system person space for the new member (idempotent)
  select coalesce(p.name, u.email) into v_name
  from auth.users u left join profiles p on p.id = u.id
  where u.id = p_user_id;

  insert into spaces (family_id, name, type, show_in_expenses, is_system, linked_user_id, sort_order)
  select p_family_id, coalesce(v_name, 'Member'), 'person', true, true, p_user_id,
         coalesce((select max(sort_order) + 1 from spaces where family_id = p_family_id), 0)
  where not exists (
    select 1 from spaces where family_id = p_family_id and linked_user_id = p_user_id and type = 'person'
  );

  update invites set accepted_at = now() where token = p_token;
end;
$$;

grant execute on function find_or_create_family(uuid)     to authenticated;
grant execute on function accept_invite(uuid, uuid, uuid) to authenticated;


-- ----------------------------------------------------------------
-- PART 9: ROW LEVEL SECURITY
-- ----------------------------------------------------------------

alter table profiles        enable row level security;
alter table families        enable row level security;
alter table user_families   enable row level security;
alter table invites         enable row level security;
alter table spaces          enable row level security;
alter table categories      enable row level security;
alter table expenses        enable row level security;
alter table income_sources  enable row level security;
alter table income_entries  enable row level security;
alter table budgets         enable row level security;
alter table items           enable row level security;
alter table trackers        enable row level security;
alter table tracker_entries enable row level security;


-- ----------------------------------------------------------------
-- PART 10: POLICIES
-- INSERT on families/user_families goes through SECURITY DEFINER
-- RPCs (find_or_create_family, accept_invite) — no direct insert policy needed.
-- ----------------------------------------------------------------

-- profiles
create policy "profiles_select" on profiles
  for select to authenticated using (true);
create policy "profiles_update" on profiles
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- families
create policy "families_select" on families
  for select to authenticated using (is_family_member(id));
create policy "families_update" on families
  for update to authenticated
  using (is_family_owner(id)) with check (is_family_owner(id));
create policy "families_delete" on families
  for delete to authenticated using (is_family_owner(id));

-- user_families
create policy "user_families_select" on user_families
  for select to authenticated using (is_family_member(family_id));
create policy "user_families_delete" on user_families
  for delete to authenticated
  using (user_id = auth.uid() or is_family_owner(family_id));

-- invites
create policy "invites_select"  on invites for select using (true);
create policy "invites_insert"  on invites
  for insert to authenticated with check (is_family_member(family_id));
create policy "invites_update"  on invites
  for update to authenticated using (true) with check (true);

-- spaces
create policy "spaces_select" on spaces
  for select to authenticated using (is_family_member(family_id));
create policy "spaces_insert" on spaces
  for insert to authenticated with check (is_family_member(family_id));
create policy "spaces_update" on spaces
  for update to authenticated
  using (is_family_member(family_id)) with check (is_family_member(family_id));
create policy "spaces_delete" on spaces
  for delete to authenticated using (is_family_member(family_id));

-- categories
create policy "categories_select" on categories
  for select to authenticated using (is_family_member(family_id));
create policy "categories_insert" on categories
  for insert to authenticated with check (is_family_member(family_id));
create policy "categories_update" on categories
  for update to authenticated
  using (is_family_member(family_id)) with check (is_family_member(family_id));
create policy "categories_delete" on categories
  for delete to authenticated using (is_family_member(family_id));

-- expenses
create policy "expenses_select" on expenses
  for select to authenticated using (is_family_member(family_id));
create policy "expenses_insert" on expenses
  for insert to authenticated with check (is_family_member(family_id));
create policy "expenses_update" on expenses
  for update to authenticated
  using (is_family_member(family_id)) with check (is_family_member(family_id));
create policy "expenses_delete" on expenses
  for delete to authenticated using (is_family_member(family_id));

-- income_sources
create policy "income_sources_select" on income_sources
  for select to authenticated using (is_family_member(family_id));
create policy "income_sources_insert" on income_sources
  for insert to authenticated with check (is_family_member(family_id));
create policy "income_sources_update" on income_sources
  for update to authenticated
  using (is_family_member(family_id)) with check (is_family_member(family_id));
create policy "income_sources_delete" on income_sources
  for delete to authenticated using (is_family_member(family_id));

-- income_entries
create policy "income_entries_select" on income_entries
  for select to authenticated using (is_family_member(family_id));
create policy "income_entries_insert" on income_entries
  for insert to authenticated with check (is_family_member(family_id));
create policy "income_entries_update" on income_entries
  for update to authenticated
  using (is_family_member(family_id)) with check (is_family_member(family_id));
create policy "income_entries_delete" on income_entries
  for delete to authenticated using (is_family_member(family_id));

-- budgets
create policy "budgets_select" on budgets
  for select to authenticated using (is_family_member(family_id));
create policy "budgets_insert" on budgets
  for insert to authenticated with check (is_family_member(family_id));
create policy "budgets_update" on budgets
  for update to authenticated
  using (is_family_member(family_id)) with check (is_family_member(family_id));
create policy "budgets_delete" on budgets
  for delete to authenticated using (is_family_member(family_id));

-- items (scoped via space → family, no family_id column on items)
create policy "items_select" on items
  for select to authenticated using (item_is_family_member(space_id));
create policy "items_insert" on items
  for insert to authenticated with check (item_is_family_member(space_id));
create policy "items_update" on items
  for update to authenticated
  using (item_is_family_member(space_id)) with check (item_is_family_member(space_id));
create policy "items_delete" on items
  for delete to authenticated using (item_is_family_member(space_id));

-- trackers
create policy "trackers_select" on trackers
  for select to authenticated using (is_family_member(family_id));
create policy "trackers_insert" on trackers
  for insert to authenticated with check (is_family_member(family_id));
create policy "trackers_update" on trackers
  for update to authenticated
  using (is_family_member(family_id)) with check (is_family_member(family_id));
create policy "trackers_delete" on trackers
  for delete to authenticated using (is_family_owner(family_id));

-- tracker_entries
create policy "tracker_entries_select" on tracker_entries
  for select to authenticated using (is_family_member(family_id));
create policy "tracker_entries_insert" on tracker_entries
  for insert to authenticated with check (is_family_member(family_id));
create policy "tracker_entries_update" on tracker_entries
  for update to authenticated
  using (is_family_member(family_id)) with check (is_family_member(family_id));
create policy "tracker_entries_delete" on tracker_entries
  for delete to authenticated using (is_family_member(family_id));


-- ----------------------------------------------------------------
-- PART 11: INDEXES
-- ----------------------------------------------------------------

-- expenses: monthly view
create index idx_expenses_family_date
  on expenses (family_id, date desc);

-- expenses: yearly analytics by month
create index idx_expenses_family_year_month
  on expenses (family_id, cast(extract(year from date) as int), cast(extract(month from date) as int));

-- expenses: category drilldown
create index idx_expenses_family_category
  on expenses (family_id, category_id)
  where category_id is not null;

-- expenses: paid_by split reports
create index idx_expenses_family_paid_by
  on expenses (family_id, paid_by_id)
  where paid_by_id is not null;

-- expenses: location reports
create index idx_expenses_family_location
  on expenses (family_id, location_id)
  where location_id is not null;

-- spaces: board fetch (active, ordered)
create index idx_spaces_family_type_order
  on spaces (family_id, type, sort_order)
  where deleted_at is null;

-- spaces: expense picker dropdowns
create index idx_spaces_expense_picker
  on spaces (family_id, type, show_in_expenses)
  where deleted_at is null and show_in_expenses = true;

-- categories: picker + chart (active only)
create index idx_categories_family_active
  on categories (family_id, sort_order)
  where deleted_at is null;

-- items: active board cards
create index idx_items_space_active
  on items (space_id, sort_order)
  where completed = false;

-- items: completed history (most recent first)
create index idx_items_space_completed
  on items (space_id, completed_at desc)
  where completed = true;

-- items: activity feed (recent items across spaces)
create index idx_items_space_recent
  on items (space_id, created_at desc);

-- items: recurring job
create index idx_items_recurring
  on items (space_id, recurrence)
  where recurrence is not null and completed = false;

-- income entries: date range
create index idx_income_entries_family_date
  on income_entries (family_id, date desc);

-- tracker entries: history
create index idx_tracker_entries_tracker_date
  on tracker_entries (tracker_id, date desc);

-- user_families: user → their families
create index idx_user_families_user
  on user_families (user_id);
