-- ============================================================
-- Family Space — Demo Seed Script
-- Purpose: Populate a realistic family for marketing screenshots
-- ============================================================
--
-- BEFORE RUNNING:
--   1. Create a demo account in your app (sign up with email/Google)
--   2. Go to Supabase Dashboard → Authentication → Users
--   3. Copy the UUID of the demo user
--   4. Replace <<YOUR_DEMO_USER_ID>> below with that UUID
--   5. Run this entire script in Supabase SQL Editor
--      (uses service role — bypasses RLS automatically)
--
-- AFTER RUNNING:
--   - Sign in as the demo user to see the populated data
--   - The family will be on the 'pro' plan so all features are visible
--   - Take screenshots as described in docs/screenshots-guide.md
--
-- TO CLEAN UP:
--   Run docs/demo-cleanup.sql to remove all demo data
-- ============================================================

do $$
declare
  -- ── CHANGE THIS ──────────────────────────────────────────
  v_user_id        uuid := '5d84a45e-a4cc-4514-a5a3-79e14adca8ed';  -- replace with your demo user's UUID
  -- ─────────────────────────────────────────────────────────

  v_family_id      uuid := gen_random_uuid();

  -- Person spaces  (Zoro + Nami stay, Coby & Vivi are randoms from across the series)
  s_zoro           uuid := gen_random_uuid();   -- Straw Hat swordsman
  s_nami           uuid := gen_random_uuid();   -- Straw Hat navigator
  s_coby           uuid := gen_random_uuid();   -- Marine captain, East Blue
  s_vivi           uuid := gen_random_uuid();   -- Alabasta princess, Grand Line

  -- Store spaces
  s_walmart        uuid := gen_random_uuid();
  s_costco         uuid := gen_random_uuid();
  s_tt             uuid := gen_random_uuid();
  s_shoppers       uuid := gen_random_uuid();
  s_timhortons     uuid := gen_random_uuid();
  s_gas            uuid := gen_random_uuid();

  -- Categories
  c_groceries      uuid := gen_random_uuid();
  c_dining         uuid := gen_random_uuid();
  c_gas            uuid := gen_random_uuid();
  c_utilities      uuid := gen_random_uuid();
  c_pharmacy       uuid := gen_random_uuid();
  c_kids           uuid := gen_random_uuid();
  c_clothing       uuid := gen_random_uuid();
  c_household      uuid := gen_random_uuid();
  c_entertainment  uuid := gen_random_uuid();
  c_personal       uuid := gen_random_uuid();

begin

  -- ── 1. Family ──────────────────────────────────────────────────────────────
  insert into families (id, name, plan, currency, locale, created_at)
  values (v_family_id, 'The Grand Line', 'pro', 'CAD', 'en-CA', now())
  on conflict do nothing;

  -- ── 2. Membership ──────────────────────────────────────────────────────────
  insert into user_families (user_id, family_id, role, joined_at)
  values (v_user_id, v_family_id, 'owner', now())
  on conflict do nothing;

  -- ── 3. Spaces: people (type='person') ─────────────────────────────────────
  insert into spaces (id, family_id, name, type, show_in_expenses, color, sort_order, is_system, linked_user_id)
  values
    (s_zoro,  v_family_id, 'Zoro',  'person', true, 'oklch(0.82 0.10 152)', 0, true,  v_user_id),
    (s_nami,  v_family_id, 'Nami',  'person', true, 'oklch(0.82 0.10 55)',  1, false, null),
    (s_coby,  v_family_id, 'Coby',  'person', true, 'oklch(0.82 0.10 15)',  2, false, null),
    (s_vivi,  v_family_id, 'Vivi',  'person', true, 'oklch(0.82 0.10 240)', 3, false, null);

  -- ── 4. Spaces: stores (type='store') ──────────────────────────────────────
  insert into spaces (id, family_id, name, type, show_in_expenses, color, sort_order, is_system, linked_user_id)
  values
    (s_walmart,    v_family_id, 'Walmart',             'store', true, 'oklch(0.82 0.10 260)', 4, false, null),
    (s_costco,     v_family_id, 'Costco',              'store', true, 'oklch(0.82 0.10 22)',  5, false, null),
    (s_tt,         v_family_id, 'T&T Supermarket',     'store', true, 'oklch(0.82 0.10 140)', 6, false, null),
    (s_shoppers,   v_family_id, 'Shoppers Drug Mart',  'store', true, 'oklch(0.82 0.10 345)', 7, false, null),
    (s_timhortons, v_family_id, 'Tim Hortons',         'store', true, 'oklch(0.82 0.10 50)',  8, false, null),
    (s_gas,        v_family_id, 'Gas Station',         'store', true, 'oklch(0.82 0.10 228)', 9, false, null);

  -- ── 5. Categories ──────────────────────────────────────────────────────────
  insert into categories (id, family_id, name, color, icon, sort_order)
  values
    (c_groceries,     v_family_id, 'Groceries',      'oklch(0.82 0.10 152)', 'shopping-cart',  0),
    (c_dining,        v_family_id, 'Dining Out',     'oklch(0.82 0.10 22)',  'utensils',       1),
    (c_gas,           v_family_id, 'Gas',            'oklch(0.82 0.10 228)', 'fuel',           2),
    (c_utilities,     v_family_id, 'Utilities',      'oklch(0.84 0.11 88)',  'zap',            3),
    (c_pharmacy,      v_family_id, 'Pharmacy',       'oklch(0.82 0.10 0)',   'pill',           4),
    (c_kids,          v_family_id, 'Kids',           'oklch(0.82 0.10 308)', 'baby',           5),
    (c_clothing,      v_family_id, 'Clothing',       'oklch(0.82 0.10 270)', 'shirt',          6),
    (c_household,     v_family_id, 'Household',      'oklch(0.82 0.10 50)',  'home',           7),
    (c_entertainment, v_family_id, 'Entertainment',  'oklch(0.82 0.10 320)', 'tv',             8),
    (c_personal,      v_family_id, 'Personal Care',  'oklch(0.82 0.10 345)', 'sparkles',       9);

  -- ── 6. Expenses (Oct–Dec 2025 + Jan 2026) ──────────────────────────────────
  -- ~60 expenses across 4 months — needed for all 9 analytics charts to look good

  -- October 2025
  insert into expenses (id, family_id, amount, category_id, location_id, paid_by_id, date, description)
  values
    (gen_random_uuid(), v_family_id, 187.43, c_groceries,  s_walmart,    s_zoro,  '2025-10-03', 'Weekly grocery run'),
    (gen_random_uuid(), v_family_id, 312.89, c_groceries,  s_costco,     s_zoro,  '2025-10-05', 'Costco bulk run'),
    (gen_random_uuid(), v_family_id,  68.20, c_groceries,  s_tt,         s_nami,  '2025-10-07', 'Asian groceries'),
    (gen_random_uuid(), v_family_id,  82.50, c_gas,        s_gas,        s_zoro,  '2025-10-09', 'Gas fill-up'),
    (gen_random_uuid(), v_family_id,  54.30, c_dining,     s_timhortons, s_nami,  '2025-10-11', 'Coffee + lunch'),
    (gen_random_uuid(), v_family_id, 143.00, c_utilities,  null,         s_zoro,  '2025-10-14', 'Hydro bill'),
    (gen_random_uuid(), v_family_id,  95.60, c_pharmacy,   s_shoppers,   s_nami,  '2025-10-15', 'Prescriptions'),
    (gen_random_uuid(), v_family_id, 156.78, c_groceries,  s_walmart,    s_nami,  '2025-10-17', 'Mid-month groceries'),
    (gen_random_uuid(), v_family_id,  47.90, c_gas,        s_gas,        s_coby,  '2025-10-19', 'Gas'),
    (gen_random_uuid(), v_family_id, 210.00, c_kids,       s_walmart,    s_zoro,  '2025-10-21', 'Back to school supplies'),
    (gen_random_uuid(), v_family_id,  89.99, c_clothing,   null,         s_vivi,  '2025-10-23', 'Winter jacket'),
    (gen_random_uuid(), v_family_id,  38.50, c_dining,     s_timhortons, s_coby,  '2025-10-25', 'Family breakfast out'),
    (gen_random_uuid(), v_family_id, 199.45, c_groceries,  s_costco,     s_zoro,  '2025-10-28', 'Costco top-up'),
    (gen_random_uuid(), v_family_id, 120.00, c_utilities,  null,         s_zoro,  '2025-10-30', 'Internet + phone');

  -- November 2025
  insert into expenses (id, family_id, amount, category_id, location_id, paid_by_id, date, description)
  values
    (gen_random_uuid(), v_family_id, 203.12, c_groceries,  s_walmart,    s_nami,  '2025-11-02', 'Weekly grocery run'),
    (gen_random_uuid(), v_family_id, 289.50, c_groceries,  s_costco,     s_zoro,  '2025-11-04', 'Costco run'),
    (gen_random_uuid(), v_family_id,  72.40, c_groceries,  s_tt,         s_vivi,  '2025-11-06', 'T&T groceries'),
    (gen_random_uuid(), v_family_id,  85.80, c_gas,        s_gas,        s_zoro,  '2025-11-07', 'Gas fill-up'),
    (gen_random_uuid(), v_family_id, 145.00, c_utilities,  null,         s_zoro,  '2025-11-10', 'Hydro bill'),
    (gen_random_uuid(), v_family_id,  62.35, c_pharmacy,   s_shoppers,   s_nami,  '2025-11-12', 'Medicine + vitamins'),
    (gen_random_uuid(), v_family_id, 178.90, c_groceries,  s_walmart,    s_zoro,  '2025-11-14', 'Groceries'),
    (gen_random_uuid(), v_family_id,  44.99, c_dining,     null,         s_coby,  '2025-11-16', 'Pizza night'),
    (gen_random_uuid(), v_family_id,  51.20, c_gas,        s_gas,        s_coby,  '2025-11-18', 'Gas'),
    (gen_random_uuid(), v_family_id, 320.00, c_household,  s_walmart,    s_zoro,  '2025-11-20', 'Winter supplies + decor'),
    (gen_random_uuid(), v_family_id,  79.99, c_entertainment, null,      s_nami,  '2025-11-22', 'Netflix + Disney+'),
    (gen_random_uuid(), v_family_id, 134.50, c_clothing,   null,         s_vivi,  '2025-11-24', 'Winter coats'),
    (gen_random_uuid(), v_family_id, 215.67, c_groceries,  s_costco,     s_nami,  '2025-11-27', 'Costco top-up'),
    (gen_random_uuid(), v_family_id,  58.90, c_dining,     s_timhortons, s_coby,  '2025-11-29', 'Coffee + snacks'),
    (gen_random_uuid(), v_family_id, 130.00, c_utilities,  null,         s_zoro,  '2025-11-30', 'Internet + gas bill');

  -- December 2025
  insert into expenses (id, family_id, amount, category_id, location_id, paid_by_id, date, description)
  values
    (gen_random_uuid(), v_family_id, 198.45, c_groceries,  s_walmart,    s_nami,  '2025-12-01', 'Weekly groceries'),
    (gen_random_uuid(), v_family_id, 445.20, c_groceries,  s_costco,     s_zoro,  '2025-12-04', 'Holiday Costco haul'),
    (gen_random_uuid(), v_family_id,  88.75, c_groceries,  s_tt,         s_vivi,  '2025-12-06', 'T&T for holiday cooking'),
    (gen_random_uuid(), v_family_id,  90.40, c_gas,        s_gas,        s_zoro,  '2025-12-07', 'Gas fill-up'),
    (gen_random_uuid(), v_family_id, 165.00, c_utilities,  null,         s_zoro,  '2025-12-09', 'Hydro — heating season'),
    (gen_random_uuid(), v_family_id,  42.15, c_pharmacy,   s_shoppers,   s_nami,  '2025-12-10', 'Cold medicine'),
    (gen_random_uuid(), v_family_id, 385.00, c_kids,       null,         s_zoro,  '2025-12-14', 'Holiday gifts'),
    (gen_random_uuid(), v_family_id, 156.30, c_groceries,  s_walmart,    s_nami,  '2025-12-15', 'Mid-month groceries'),
    (gen_random_uuid(), v_family_id,  78.50, c_dining,     null,         s_coby,  '2025-12-18', 'Holiday dinner out'),
    (gen_random_uuid(), v_family_id,  55.00, c_entertainment, null,      s_vivi,  '2025-12-20', 'Movie tickets + popcorn'),
    (gen_random_uuid(), v_family_id, 234.90, c_groceries,  s_costco,     s_zoro,  '2025-12-22', 'Holiday food shop'),
    (gen_random_uuid(), v_family_id,  47.80, c_gas,        s_gas,        s_nami,  '2025-12-23', 'Gas'),
    (gen_random_uuid(), v_family_id, 195.00, c_clothing,   null,         s_vivi,  '2025-12-26', 'Boxing Day sale'),
    (gen_random_uuid(), v_family_id, 140.00, c_utilities,  null,         s_zoro,  '2025-12-29', 'Internet + phone'),
    (gen_random_uuid(), v_family_id,  63.40, c_personal,   s_shoppers,   s_nami,  '2025-12-30', 'Personal care items');

  -- January 2026
  insert into expenses (id, family_id, amount, category_id, location_id, paid_by_id, date, description)
  values
    (gen_random_uuid(), v_family_id, 175.60, c_groceries,  s_walmart,    s_zoro,  '2026-01-02', 'New year grocery run'),
    (gen_random_uuid(), v_family_id, 298.45, c_groceries,  s_costco,     s_zoro,  '2026-01-05', 'Costco monthly run'),
    (gen_random_uuid(), v_family_id,  66.80, c_groceries,  s_tt,         s_vivi,  '2026-01-07', 'T&T groceries'),
    (gen_random_uuid(), v_family_id,  88.20, c_gas,        s_gas,        s_coby,  '2026-01-08', 'Gas fill-up'),
    (gen_random_uuid(), v_family_id, 148.00, c_utilities,  null,         s_zoro,  '2026-01-10', 'Hydro bill'),
    (gen_random_uuid(), v_family_id,  72.50, c_pharmacy,   s_shoppers,   s_nami,  '2026-01-11', 'Flu season meds'),
    (gen_random_uuid(), v_family_id, 164.75, c_groceries,  s_walmart,    s_nami,  '2026-01-13', 'Mid-month groceries'),
    (gen_random_uuid(), v_family_id,  39.99, c_dining,     s_timhortons, s_coby,  '2026-01-15', 'Coffee + lunch'),
    (gen_random_uuid(), v_family_id,  53.40, c_gas,        s_gas,        s_coby,  '2026-01-17', 'Gas'),
    (gen_random_uuid(), v_family_id, 119.00, c_household,  s_walmart,    s_zoro,  '2026-01-19', 'Cleaning supplies + storage bins'),
    (gen_random_uuid(), v_family_id,  45.00, c_entertainment, null,      s_vivi,  '2026-01-21', 'Streaming subscriptions'),
    (gen_random_uuid(), v_family_id, 182.30, c_groceries,  s_costco,     s_zoro,  '2026-01-24', 'Costco top-up'),
    (gen_random_uuid(), v_family_id,  67.80, c_personal,   s_shoppers,   s_nami,  '2026-01-25', 'Hair + personal care'),
    (gen_random_uuid(), v_family_id, 135.00, c_utilities,  null,         s_zoro,  '2026-01-28', 'Internet + phone'),
    (gen_random_uuid(), v_family_id,  58.90, c_dining,     null,         s_coby,  '2026-01-30', 'Takeout — pizza');

  -- ── 7. Board items ─────────────────────────────────────────────────────────

  -- Walmart grocery list
  insert into items (id, space_id, title, quantity, sort_order, completed, created_by)
  values
    (gen_random_uuid(), s_walmart, 'Olive oil',        '1 bottle',  0, false, v_user_id),
    (gen_random_uuid(), s_walmart, 'Greek yogurt',     '2 x 750g',  1, false, v_user_id),
    (gen_random_uuid(), s_walmart, 'Tide pods',        '1 pack',    2, false, v_user_id),
    (gen_random_uuid(), s_walmart, 'Whole milk',       '2 x 2L',    3, false, v_user_id),
    (gen_random_uuid(), s_walmart, 'Chicken breast',   '2 kg',      4, false, v_user_id),
    (gen_random_uuid(), s_walmart, 'Apples — Gala',   '1 bag',     5, false, v_user_id),
    (gen_random_uuid(), s_walmart, 'Baby carrots',     '1 bag',     6, false, v_user_id),
    (gen_random_uuid(), s_walmart, 'Shredded cheese',  '2 packs',   7, false, v_user_id),
    (gen_random_uuid(), s_walmart, 'Pita bread',       '2 packs',   8, true,  v_user_id),
    (gen_random_uuid(), s_walmart, 'Dish soap',        null,        9, true,  v_user_id);

  -- Costco list
  insert into items (id, space_id, title, quantity, sort_order, completed, created_by)
  values
    (gen_random_uuid(), s_costco, 'Kirkland salmon fillets',    '1 pack',   0, false, v_user_id),
    (gen_random_uuid(), s_costco, 'Rotisserie chicken',         null,       1, false, v_user_id),
    (gen_random_uuid(), s_costco, 'Nature Valley granola bars', '2 boxes',  2, false, v_user_id),
    (gen_random_uuid(), s_costco, 'Kirkland almond milk',       '6-pack',   3, false, v_user_id),
    (gen_random_uuid(), s_costco, 'Paper towels',               '1 pack',   4, false, v_user_id),
    (gen_random_uuid(), s_costco, 'Toilet paper',               '1 case',   5, false, v_user_id),
    (gen_random_uuid(), s_costco, 'Frozen edamame',             '2 bags',   6, true,  v_user_id);

  -- T&T list
  insert into items (id, space_id, title, quantity, sort_order, completed, created_by)
  values
    (gen_random_uuid(), s_tt, 'Jasmine rice',        '10 kg bag', 0, false, v_user_id),
    (gen_random_uuid(), s_tt, 'Soy sauce',           '1 bottle',  1, false, v_user_id),
    (gen_random_uuid(), s_tt, 'Dumpling wrappers',   '2 packs',   2, false, v_user_id),
    (gen_random_uuid(), s_tt, 'Baby bok choy',       '1 bunch',   3, false, v_user_id),
    (gen_random_uuid(), s_tt, 'Sesame oil',          '1 bottle',  4, false, v_user_id),
    (gen_random_uuid(), s_tt, 'Fresh tofu',          '2 blocks',  5, false, v_user_id);

  -- Zoro chores (classic — reliable but directionally challenged)
  insert into items (id, space_id, title, sort_order, completed, created_by, start_date)
  values
    (gen_random_uuid(), s_zoro, 'Book car oil change',        0, false, v_user_id, (now() + interval '3 days')::timestamptz),
    (gen_random_uuid(), s_zoro, 'Call insurance for renewal', 1, false, v_user_id, (now() + interval '7 days')::timestamptz),
    (gen_random_uuid(), s_zoro, 'Fix bathroom light fixture', 2, false, v_user_id, null),
    (gen_random_uuid(), s_zoro, 'Take out the recycling',     3, false, v_user_id, null),
    (gen_random_uuid(), s_zoro, 'Vacuum downstairs',          4, true,  v_user_id, null);

  -- Nami chores (she would absolutely be the one tracking finances and scheduling)
  insert into items (id, space_id, title, sort_order, completed, created_by, start_date)
  values
    (gen_random_uuid(), s_nami, 'Renew Costco membership',      0, false, v_user_id, (now() + interval '5 days')::timestamptz),
    (gen_random_uuid(), s_nami, 'Book dentist appointments',    1, false, v_user_id, (now() + interval '10 days')::timestamptz),
    (gen_random_uuid(), s_nami, 'Review monthly budget',        2, false, v_user_id, (now() + interval '2 days')::timestamptz),
    (gen_random_uuid(), s_nami, 'Renew home internet plan',     3, false, v_user_id, null),
    (gen_random_uuid(), s_nami, 'Pick up prescription refills', 4, false, v_user_id, null);

  -- Coby chores (eager, wholesome, marine energy)
  insert into items (id, space_id, title, sort_order, completed, created_by, start_date)
  values
    (gen_random_uuid(), s_coby, 'Mow the lawn',               0, false, v_user_id, (now() + interval '4 days')::timestamptz),
    (gen_random_uuid(), s_coby, 'Take bins to the curb',      1, false, v_user_id, null),
    (gen_random_uuid(), s_coby, 'Clean the garage',           2, false, v_user_id, null),
    (gen_random_uuid(), s_coby, 'Replace smoke alarm battery',3, true,  v_user_id, null);

  -- Vivi chores (princess energy, graceful but gets things done)
  insert into items (id, space_id, title, sort_order, completed, created_by, start_date)
  values
    (gen_random_uuid(), s_vivi, 'Order birthday cake',        0, false, v_user_id, (now() + interval '6 days')::timestamptz),
    (gen_random_uuid(), s_vivi, 'School registration forms',  1, false, v_user_id, (now() + interval '14 days')::timestamptz),
    (gen_random_uuid(), s_vivi, 'Organise pantry',            2, false, v_user_id, null),
    (gen_random_uuid(), s_vivi, 'Return library books',       3, true,  v_user_id, null);

  raise notice 'Demo seed complete. Family ID: %', v_family_id;
  raise notice 'Sign in with user ID: %', v_user_id;
  raise notice 'Tip: hard-refresh (Cmd+Shift+R) after signing in to clear the query cache.';

end $$;
