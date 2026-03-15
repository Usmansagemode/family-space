-- ============================================================
-- Family Space — Supabase Schema
-- Run this in a NEW Supabase project's SQL editor.
-- Do NOT run against daily-expenses or family-calendar projects.
-- ============================================================

-- ============================================================
-- CORE: FAMILIES & AUTH
-- ============================================================

CREATE TABLE families (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                        TEXT NOT NULL,
  plan                        TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  currency                    TEXT NOT NULL DEFAULT 'USD',   -- e.g. 'USD', 'GBP', 'PKR'
  locale                      TEXT NOT NULL DEFAULT 'en-US', -- e.g. 'en-US', 'en-GB'
  google_calendar_id          TEXT,
  google_calendar_embed_url   TEXT,
  google_refresh_token        TEXT,                          -- long-lived token for calendar sync
  created_at                  TIMESTAMPTZ DEFAULT now(),
  updated_at                  TIMESTAMPTZ DEFAULT now()
);

-- Mirrors auth.users — auto-populated via trigger on signup
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  email       TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE family_members (
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  family_id  UUID REFERENCES families(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, family_id)
);

-- Shareable invite tokens
CREATE TABLE invites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'base64url'),
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at     TIMESTAMPTZ,
  used_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- SPACES (board columns: person or location)
-- ============================================================

CREATE TABLE spaces (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id           UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  color               TEXT,                          -- OKLCH string e.g. 'oklch(0.72 0.20 15)'
  type                TEXT NOT NULL CHECK (type IN ('person', 'location')),
  sort_order          INTEGER NOT NULL DEFAULT 0,
  -- Controls whether this space appears in expense pickers
  -- person + true  → shows in "Paid by" dropdown
  -- location + true → shows in "Location" dropdown
  -- either + false  → board column only (e.g. "Backyard" chore column)
  show_in_expenses    BOOLEAN NOT NULL DEFAULT true,
  -- Location spaces can be assigned to a person for accountability
  assigned_person_id  UUID REFERENCES spaces(id) ON DELETE SET NULL,
  deleted_at          TIMESTAMPTZ,                   -- soft delete; never hard-delete if expenses reference
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- CATEGORIES
-- ============================================================

CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  color       TEXT,                                  -- OKLCH string
  icon        TEXT,                                  -- Lucide icon name e.g. 'ShoppingCart'
  sort_order  INTEGER NOT NULL DEFAULT 0,
  deleted_at  TIMESTAMPTZ,                           -- soft delete; see deletion policy in SPEC.md
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- EXPENSES
-- ============================================================

CREATE TABLE expenses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id    UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  amount       NUMERIC(12, 2) NOT NULL,
  -- All three FKs use ON DELETE SET NULL — deleting a category/space never destroys expense records.
  -- UI renders "(Uncategorized)", "(Unknown location)", "(Unknown member)" for null FKs.
  category_id  UUID REFERENCES categories(id) ON DELETE SET NULL,
  location_id  UUID REFERENCES spaces(id) ON DELETE SET NULL,   -- must be type='location'
  paid_by_id   UUID REFERENCES spaces(id) ON DELETE SET NULL,   -- must be type='person' + show_in_expenses=true
  date         DATE NOT NULL,
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INCOME
-- ============================================================

-- Recurring / expected income sources (wage, side gig, etc.)
CREATE TABLE income_sources (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  person_id   UUID REFERENCES spaces(id) ON DELETE SET NULL,    -- person type space; null = family-wide
  name        TEXT NOT NULL,                                    -- e.g. 'Salary', 'Freelance', 'Rental'
  type        TEXT CHECK (type IN ('wage', 'side_gig', 'other')),
  amount      NUMERIC(12, 2) NOT NULL,                          -- expected amount per frequency
  frequency   TEXT CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'yearly')),
  start_date  DATE,
  end_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Actual logged income entries
CREATE TABLE income_entries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id        UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  income_source_id UUID REFERENCES income_sources(id) ON DELETE SET NULL,
  person_id        UUID REFERENCES spaces(id) ON DELETE SET NULL,
  amount           NUMERIC(12, 2) NOT NULL,
  date             DATE NOT NULL,
  description      TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- BUDGETS
-- ============================================================

-- null person_id = family-wide budget
-- null category_id = overall spend budget (not per-category)
-- Both null = total family budget for the period
CREATE TABLE budgets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id    UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  person_id    UUID REFERENCES spaces(id) ON DELETE CASCADE,
  category_id  UUID REFERENCES categories(id) ON DELETE CASCADE,
  amount       NUMERIC(12, 2) NOT NULL,
  period       TEXT NOT NULL CHECK (period IN ('monthly', 'yearly')),
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ITEMS (grocery / chore cards on the board)
-- ============================================================

CREATE TABLE items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id        UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  family_id       UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  quantity        TEXT,                                         -- e.g. '2x', '1 bag'
  recurrence      TEXT CHECK (recurrence IN ('daily', 'weekly', 'monthly', 'yearly')),
  sort_order      INTEGER NOT NULL DEFAULT 0,
  start_date      TIMESTAMPTZ,                                  -- ISO with time; noon sentinel = date only
  end_date        TIMESTAMPTZ,
  completed       BOOLEAN NOT NULL DEFAULT false,
  completed_at    TIMESTAMPTZ,
  completed_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  google_event_id TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TRACKERS (debt / savings / loans) — Pro feature
-- ============================================================

CREATE TABLE trackers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id       UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  initial_balance NUMERIC(12, 2) NOT NULL DEFAULT 0,
  current_balance NUMERIC(12, 2) NOT NULL DEFAULT 0,
  color           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tracker_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracker_id  UUID NOT NULL REFERENCES trackers(id) ON DELETE CASCADE,
  family_id   UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  description TEXT,
  debit       NUMERIC(12, 2) NOT NULL DEFAULT 0,
  credit      NUMERIC(12, 2) NOT NULL DEFAULT 0,
  balance     NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TRIGGERS: updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_families_updated_at        BEFORE UPDATE ON families        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_profiles_updated_at        BEFORE UPDATE ON profiles        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_spaces_updated_at          BEFORE UPDATE ON spaces          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_categories_updated_at      BEFORE UPDATE ON categories      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_expenses_updated_at        BEFORE UPDATE ON expenses        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_income_sources_updated_at  BEFORE UPDATE ON income_sources  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_budgets_updated_at         BEFORE UPDATE ON budgets         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_items_updated_at           BEFORE UPDATE ON items           FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_trackers_updated_at        BEFORE UPDATE ON trackers        FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    ),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- INDEXES
-- ============================================================

-- expenses: monthly view (most common — "show me March 2026")
CREATE INDEX idx_expenses_family_date
  ON expenses (family_id, date DESC);

-- expenses: yearly analytics by month
CREATE INDEX idx_expenses_family_year_month
  ON expenses (family_id, EXTRACT(YEAR FROM date)::int, EXTRACT(MONTH FROM date)::int);

-- expenses: category filter & chart drilldown
CREATE INDEX idx_expenses_family_category
  ON expenses (family_id, category_id)
  WHERE category_id IS NOT NULL;

-- expenses: paid_by filter (member split reports)
CREATE INDEX idx_expenses_family_paid_by
  ON expenses (family_id, paid_by_id)
  WHERE paid_by_id IS NOT NULL;

-- expenses: location filter (store reports)
CREATE INDEX idx_expenses_family_location
  ON expenses (family_id, location_id)
  WHERE location_id IS NOT NULL;

-- spaces: board column fetch (active, ordered)
CREATE INDEX idx_spaces_family_type_order
  ON spaces (family_id, type, sort_order)
  WHERE deleted_at IS NULL;

-- spaces: expense picker dropdowns (active + visible)
CREATE INDEX idx_spaces_expense_picker
  ON spaces (family_id, type, show_in_expenses)
  WHERE deleted_at IS NULL AND show_in_expenses = true;

-- categories: picker + chart legend (active only)
CREATE INDEX idx_categories_family_active
  ON categories (family_id, sort_order)
  WHERE deleted_at IS NULL;

-- items: board column (active, sorted)
CREATE INDEX idx_items_space_active
  ON items (space_id, sort_order)
  WHERE completed = false;

-- items: history tab (completed, most recent first)
CREATE INDEX idx_items_space_completed
  ON items (space_id, completed_at DESC)
  WHERE completed = true;

-- items: activity feed across family
CREATE INDEX idx_items_family_recent
  ON items (family_id, updated_at DESC);

-- items: recurring item job
CREATE INDEX idx_items_recurring
  ON items (family_id, recurrence)
  WHERE recurrence IS NOT NULL AND completed = false;

-- income: date range queries
CREATE INDEX idx_income_entries_family_date
  ON income_entries (family_id, date DESC);

CREATE INDEX idx_income_entries_person_date
  ON income_entries (person_id, date DESC)
  WHERE person_id IS NOT NULL;

-- trackers: entry history
CREATE INDEX idx_tracker_entries_tracker_date
  ON tracker_entries (tracker_id, date DESC);

-- family_members: user → their families lookup
CREATE INDEX idx_family_members_user
  ON family_members (user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE families        ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites         ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces          ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_sources  ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_entries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets         ENABLE ROW LEVEL SECURITY;
ALTER TABLE items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE trackers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_entries ENABLE ROW LEVEL SECURITY;

-- Reusable helpers (SECURITY DEFINER so they bypass RLS when called inside policies)
CREATE OR REPLACE FUNCTION is_family_member(fid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM family_members
    WHERE family_id = fid AND user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_family_owner(fid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM family_members
    WHERE family_id = fid AND user_id = auth.uid() AND role = 'owner'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- families
CREATE POLICY "members can read their family"    ON families FOR SELECT USING (is_family_member(id));
CREATE POLICY "owners can update their family"   ON families FOR UPDATE USING (is_family_owner(id));
CREATE POLICY "authenticated users can create"   ON families FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- profiles
CREATE POLICY "read profiles of family members"  ON profiles FOR SELECT USING (
  id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM family_members fm1
    JOIN family_members fm2 ON fm1.family_id = fm2.family_id
    WHERE fm1.user_id = auth.uid() AND fm2.user_id = profiles.id
  )
);
CREATE POLICY "users can insert own profile"     ON profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "users can update own profile"     ON profiles FOR UPDATE USING (id = auth.uid());

-- family_members
CREATE POLICY "members can view roster"          ON family_members FOR SELECT USING (is_family_member(family_id));
CREATE POLICY "users can join a family"          ON family_members FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "owners can remove members"        ON family_members FOR DELETE USING (is_family_owner(family_id));

-- invites
-- Token is the secret — anyone with the token can read it to accept the invite
CREATE POLICY "members can read invites"         ON invites FOR SELECT USING (is_family_member(family_id) OR true);
CREATE POLICY "owners can manage invites"        ON invites FOR INSERT WITH CHECK (is_family_owner(family_id));
CREATE POLICY "owners can delete invites"        ON invites FOR DELETE USING (is_family_owner(family_id));
CREATE POLICY "anyone can mark invite used"      ON invites FOR UPDATE USING (true) WITH CHECK (true);

-- spaces
CREATE POLICY "members can read spaces"          ON spaces FOR SELECT USING (is_family_member(family_id));
CREATE POLICY "members can create spaces"        ON spaces FOR INSERT WITH CHECK (is_family_member(family_id));
CREATE POLICY "members can update spaces"        ON spaces FOR UPDATE USING (is_family_member(family_id));
CREATE POLICY "owners can delete spaces"         ON spaces FOR DELETE USING (is_family_owner(family_id));

-- categories
CREATE POLICY "members can read categories"      ON categories FOR SELECT USING (is_family_member(family_id));
CREATE POLICY "members can create categories"    ON categories FOR INSERT WITH CHECK (is_family_member(family_id));
CREATE POLICY "members can update categories"    ON categories FOR UPDATE USING (is_family_member(family_id));
CREATE POLICY "owners can delete categories"     ON categories FOR DELETE USING (is_family_owner(family_id));

-- expenses
CREATE POLICY "members can read expenses"        ON expenses FOR SELECT USING (is_family_member(family_id));
CREATE POLICY "members can create expenses"      ON expenses FOR INSERT WITH CHECK (is_family_member(family_id));
CREATE POLICY "members can update expenses"      ON expenses FOR UPDATE USING (is_family_member(family_id));
CREATE POLICY "members can delete expenses"      ON expenses FOR DELETE USING (is_family_member(family_id));

-- income_sources
CREATE POLICY "members can read income_sources"  ON income_sources FOR SELECT USING (is_family_member(family_id));
CREATE POLICY "members can create income_sources" ON income_sources FOR INSERT WITH CHECK (is_family_member(family_id));
CREATE POLICY "members can update income_sources" ON income_sources FOR UPDATE USING (is_family_member(family_id));
CREATE POLICY "members can delete income_sources" ON income_sources FOR DELETE USING (is_family_member(family_id));

-- income_entries
CREATE POLICY "members can read income_entries"  ON income_entries FOR SELECT USING (is_family_member(family_id));
CREATE POLICY "members can create income_entries" ON income_entries FOR INSERT WITH CHECK (is_family_member(family_id));
CREATE POLICY "members can update income_entries" ON income_entries FOR UPDATE USING (is_family_member(family_id));
CREATE POLICY "members can delete income_entries" ON income_entries FOR DELETE USING (is_family_member(family_id));

-- budgets
CREATE POLICY "members can read budgets"         ON budgets FOR SELECT USING (is_family_member(family_id));
CREATE POLICY "members can create budgets"        ON budgets FOR INSERT WITH CHECK (is_family_member(family_id));
CREATE POLICY "members can update budgets"        ON budgets FOR UPDATE USING (is_family_member(family_id));
CREATE POLICY "members can delete budgets"        ON budgets FOR DELETE USING (is_family_member(family_id));

-- items
CREATE POLICY "members can read items"           ON items FOR SELECT USING (is_family_member(family_id));
CREATE POLICY "members can create items"         ON items FOR INSERT WITH CHECK (is_family_member(family_id));
CREATE POLICY "members can update items"         ON items FOR UPDATE USING (is_family_member(family_id));
CREATE POLICY "members can delete items"         ON items FOR DELETE USING (is_family_member(family_id));

-- trackers
CREATE POLICY "members can read trackers"        ON trackers FOR SELECT USING (is_family_member(family_id));
CREATE POLICY "members can create trackers"      ON trackers FOR INSERT WITH CHECK (is_family_member(family_id));
CREATE POLICY "members can update trackers"      ON trackers FOR UPDATE USING (is_family_member(family_id));
CREATE POLICY "owners can delete trackers"       ON trackers FOR DELETE USING (is_family_owner(family_id));

-- tracker_entries
CREATE POLICY "members can read tracker_entries"   ON tracker_entries FOR SELECT USING (is_family_member(family_id));
CREATE POLICY "members can create tracker_entries" ON tracker_entries FOR INSERT WITH CHECK (is_family_member(family_id));
CREATE POLICY "members can update tracker_entries" ON tracker_entries FOR UPDATE USING (is_family_member(family_id));
CREATE POLICY "members can delete tracker_entries" ON tracker_entries FOR DELETE USING (is_family_member(family_id));
