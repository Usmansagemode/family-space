# Screenshot Guide — Landing Page

Screenshots replace the placeholder boxes in `LoginPage.tsx`.
Once captured, save as WebP (or PNG) and drop into `apps/web/public/screenshots/`.
Then replace each `<ScreenshotSlot>` with a real `<img>` tag.

---

## Setup: Demo User & Family

Before taking screenshots, populate a realistic demo family.
See `docs/demo-seed.sql` for the full seed script.

**Demo family goal:**
- Family name: "The Khans" (or your own)
- 3–4 members: e.g. Usman, Fatima, Adam, Sara
- Spaces: Walmart, Costco, T&T, Usman, Fatima, Adam (type=person + type=store)
- ~40–60 expenses spread across 3 months
- ~20 board items across spaces
- Categories: Groceries, Dining Out, Gas, Utilities, Pharmacy, Kids, Clothing

---

## Screenshots to Take (7 total)

### 1. `hero-board.png` — Full-width hero (top of page)
**Slot tag:** "Full app"
**View:** Board tab (`/?tab=lists`)
**What to show:**
- 3 store columns visible: Walmart, Costco, T&T
- Each column has 4–6 realistic items (e.g. "Olive oil", "Greek yogurt", "Tide pods", "Paper towels")
- 1–2 items have dates set (shows the calendar badge)
- App header visible at top
- **Mode: Dark mode**
- **Window width: 1440px**
- **Crop: full browser window minus browser chrome**

---

### 2. `board-desktop.png` — Board feature row
**Slot tag:** "Board"
**View:** Board tab, zoomed in slightly
**What to show:**
- 2–3 columns, items with completion checkboxes, dates, member avatars
- One column in a hovered/focused state
- **Mode: Dark or Light (either looks good)**
- **Window width: 1280px, aspect 16:9**

---

### 3. `expenses-desktop.png` — Expense tracking feature row
**Slot tag:** "Expenses"
**View:** `/expenses`
**What to show:**
- A full month (e.g. January 2026), 10–15 expense rows
- The summary bar at the top showing per-person totals
- At least 2 filter chips active (e.g. "Groceries", "January")
- Mix of categories: use different colored category badges
- **Mode: Light mode** (tables read better in light)
- **Window width: 1280px, aspect 16:9**

---

### 4. `analytics-desktop.png` — Analytics feature row
**Slot tag:** "Analytics"
**View:** `/charts`
**What to show:**
- The ChartsHero section with 3–4 charts visible
- Monthly spending trend chart (bar chart — most recognisable)
- Category breakdown (pie or donut)
- **Real data is critical here** — the charts must have varied, realistic numbers
- Year selector showing 2025 or 2026
- **Mode: Dark mode** (charts pop more in dark)
- **Window width: 1440px, aspect 16:9 or 21:9**

---

### 5. `ai-import-desktop.png` — AI import feature row
**Slot tag:** "AI Import"
**View:** `/import` → Step 2 (column mapping) or Step 3 (preview table)
**What to show:**
- The transaction review table: 8–10 rows with Amount, Date, Description, Category columns
- Category dropdowns visible and mapped
- 1–2 rows in an "edited" state (yellow/orange highlight)
- **Mode: Light mode**
- **Window width: 1280px, aspect 16:9**

---

### 6–8. Mobile screenshots (3 tall portraits)
Use Chrome DevTools → device emulation → iPhone 14 Pro (390×844)
Or take real device screenshots.

#### 6. `mobile-board.png`
**Slot tag:** "Mobile board"
**View:** Board on mobile (`/?tab=lists`)
- Single column visible with 4–5 items
- Bottom navigation bar visible
- **Mode: Light mode**
- **Aspect: 9:16 (portrait)**

#### 7. `mobile-expense.png`
**Slot tag:** "Mobile add expense"
**View:** Expense dialog open on mobile
- Amount field filled: "$47.23"
- Category selected: "Groceries"
- Store selected: "Walmart"
- Paid by filled in
- **Mode: Dark mode**
- **Aspect: 9:16 (portrait)**

#### 8. `mobile-analytics.png`
**Slot tag:** "Mobile analytics"
**View:** `/charts` on mobile
- At least 1 full chart visible (monthly bar chart ideal)
- Year selector visible at top
- **Mode: Light or Dark**
- **Aspect: 9:16 (portrait)**

---

## Replacing Placeholders in Code

Once you have the images, open `LoginPage.tsx` and replace each `<ScreenshotSlot>` with:

```tsx
<img
  src="/screenshots/hero-board.png"
  alt="Family Space board view showing grocery lists organised by store"
  className="w-full rounded-2xl border border-border shadow-md"
  loading="lazy"
/>
```

Match each `tag` value to the corresponding filename above.

---

## Tips for Great Screenshots

- Use **real, meaningful data** — "Tide pods $14.99" reads better than "Item 1"
- **Dark mode** works best for the board and analytics (high contrast, looks modern)
- **Light mode** works best for the expense table and dialogs (readability)
- Hide dev tools panels and browser extensions before capturing
- Use a tool like **CleanShot X** (macOS) for clean, shadow-free captures
- Export as **WebP at 2x resolution** for crisp retina display
- Compress with `squoosh.app` if files exceed 300KB
