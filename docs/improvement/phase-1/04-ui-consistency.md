# 04 — UI Consistency

Sources: `raw/colors.txt`, `raw/font-sizes.txt`, `raw/font-families.txt`, `raw/font-weights.txt`, `raw/spacing.txt`, `raw/misc-tokens.txt`, Phase 0 + Phase 1 screenshots.

## 4a. Design values in use

| Category | Distinct values | Detail |
|---|---|---|
| Colors | 19 | Brand purples: `#dbd8e3` (34 uses), `#2a2438` (14), `#5c5470` (6), `#352f44` (3). Status: `greenyellow`, `lightcoral`, `red` (named colors). Leftovers: `#007bff`/`#0056b3` (Bootstrap 4 blue, unused class), `#f2f2f2`, `#f5f5f5`, `#ddd`, `#ccc`, `#fff`, 2× `rgba(0,0,0,…)`. `#000000` theme color in HTML/manifest. |
| Font families | 3 | Montserrat (12), Dancing Script (3, brand + modal titles), Mogra (2, nav + dashboard text). Two are decorative display fonts used for UI text. |
| Font sizes | 11 | 16, 17, 18, 19, 20, 21, 24, 25 px + 1rem, 1.2rem, 1.5rem. No scale. |
| Font weights | 4 | `bold` (12), 400, 200 (body text on Welcome at weight 200). |
| Spacing | 15 | 2rem (11), 1rem (10), 10px (7), 20px (5), 8px 12px, 50px, 40px, 22px, 5rem, 3rem, 5px, … Mixed px and rem. |
| Radius | 3 | 4px (2, unused classes), 50rem pill (description), Bootstrap defaults elsewhere. |
| Shadows | 2 | inline `0 4px 6px rgba(0,0,0,.1)` on cards, `0 0 5px` (unused class). |
| z-index | 0 | Bootstrap defaults only. |
| Breakpoints | 0 custom | No `@media` rules in `App.css`. Only Bootstrap grid `md` in `SearchScreen`. |
| Icons | 1 set | `react-bootstrap-icons` (only `Trash`, 18px). |
| Imagery | 4 | Stock photos; payment photo (cash) on the "Search" card does not match its meaning. Welcome photo distorted (stretched to fill, no `object-fit`). |

## 4b. Component variants

| Element | Variants found | Where | Should be (proposal) |
|---|---|---|---|
| Button | 4: `.cardButton` (light on dark), `.button` (purple), `.searchButton` (dark), Bootstrap default primary/secondary underneath | Card, modals, Searchbar | 1 `Button` with `primary`, `secondary`, `danger`, `ghost` variants and `sm/md` sizes |
| Link-as-button | Bootstrap `Button` wrapping router `Link` (3 cards + Welcome) | `Card.js`, `WelcomePage.js` | `Button as={Link}` or styled link |
| Text input | 2: `.textField` (undefined class, Bootstrap default), `.searchfield` (filled, no focus ring) | DetailModal, Searchbar | 1 `TextField` with label, hint, error, unit suffix |
| Radio / checkbox | Bootstrap default | DetailModal | `RadioGroup` (segmented control on tablet) |
| Modal | 3: full-screen add form, `size="l"` (invalid) detail, small confirm ×2 | DetailModal, ShowDetailModal | `Dialog` (named, focus-managed) + `ConfirmDialog`; large forms move to pages |
| Section heading | `<text className="customerDetailText">` (non-standard element, dark tag look) | both modals | `h2`/`h3` with tokens |
| Label/value pair | `Form.Group` + `Form.Label` + `<p>` with fixed 370px width | ShowDetailModal | Description list (`dl`) component, responsive grid |
| Table | 1 custom table | AllCustomer | Responsive `DataTable` (table on tablet/desktop, cards on phone) |
| Status | colored text only (`greenyellow` / `lightcoral`) | AllCustomer | `StatusBadge` with text + icon + accessible colors |
| Card | 1 (Bootstrap card + inline style) | Card.js | `Card` (or dashboard tiles) |
| Navigation | `h3` + `Link` | Header | `AppShell` with `nav`, active state |
| Empty state | 1 text (`No data availaible to show!`) | AllCustomer | `EmptyState` with action |
| Error state | none (reuses empty text / "Customer Not Found.") | AllCustomer, Search | `ErrorState` with retry |
| Loading | none | everywhere | `Spinner` / skeleton rows |
| Toast / alert | none | — | `Toast` for save/delete/status feedback |
| Tabs, pagination, tooltip, avatar | none | — | Pagination later with search (PERF-007) |

## 4c. Visual review per page

### UI-001: No design tokens; 19 colors, 11 font sizes, 15 spacing values
- Severity: Medium
- Where: `src/App.css`, `Card.js:10`, `public/index.html`
- Evidence: counts above; px and rem mixed for the same role (e.g. section titles 19px, page titles 21px/24px/25px).
- Cause: Values typed per rule, no variables.
- Impact: Inconsistent look; the new brand cannot be applied in one place.
- Suggested direction: Token set (color, type scale, spacing, radius, shadow) as CSS custom properties; new brand applied there.
- Effort: M
- Related: ARCH-003

### UI-002: Decorative script fonts used for interface text
- Severity: Medium
- Where: `.companyName`, `.customModalTitle` (Dancing Script), `.headeroptionText`, `.descriptionText` (Mogra)
- Evidence: `screenshots/dashboard-1920.png`; Phase 0 `dashboard-desktop.png`: nav and description paragraph in Mogra; modal titles in a handwriting script.
- Cause: Display fonts chosen for character, applied to UI copy.
- Impact: Lower legibility; three font downloads; LCP element on list/search pages is the script heading (PERF-001).
- Suggested direction: One UI family (plus optional display face for the logo only), self-hosted.
- Effort: S
- Related: PERF-001

### UI-003: Four button styles and no shared form components
- Severity: Medium
- Where: see 4b
- Evidence: `.cardButton`, `.button`, `.searchButton`, Bootstrap defaults; 3 modal styles.
- Cause: Styles written per screen.
- Impact: Inconsistent interactions; every new screen adds another variant.
- Suggested direction: Component library (Button, TextField, RadioGroup, Dialog, ConfirmDialog, DataTable, StatusBadge, Toast, EmptyState/ErrorState, Spinner, AppShell).
- Effort: L
- Related: A11Y-001, A11Y-004, A11Y-005, A11Y-008

### UI-004: Detail view is a long single column of label/value rows
- Severity: Medium
- Where: `ShowDetailModal.js`, `screenshots/detail-modal-stale-status-1440.png`
- Evidence: 17 values stacked vertically at 1440px; actions in a footer off-screen; no grouping of order vs measurements.
- Cause: Every field in its own `Row` with fixed 370px width.
- Impact: Hard to scan at the counter; the most important info (status, balance due) is at the bottom.
- Suggested direction: Summary header (name, contact, statuses, total) + measurements grid; actions at the top.
- Effort: M
- Related: FEAT-006

### UI-005: Imagery does not match meaning and is distorted
- Severity: Low
- Where: `HomePage.js` cards, `WelcomePage.js`
- Evidence: Cash photo for "Search Customer"; Welcome image 2048×3072 stretched with `width/height: 100%`.
- Cause: Stock photos picked per card; no `object-fit`.
- Impact: Looks unpolished.
- Suggested direction: Icons or simple illustrations in the new brand; drop the hero photo with FEAT-001.
- Effort: S
- Related: FEAT-001, PERF-002

### UI-006: Page structure has no page titles
- Severity: Low
- Where: all pages
- Evidence: Only `h1` is the brand name; nav links are `h3`; list title is `<text>`.
- Cause: Headings used for styling.
- Impact: No clear "you are here"; screen readers get a wrong outline.
- Suggested direction: `AppShell` with brand in header and a real page `h1` per page.
- Effort: S
- Related: A11Y-006, UX-008

## Draft token list (input for Phase 3, not final)

The owner asked for a new brand, so these are the roles that must exist, with the current value only as a reference.

| Token role | Current value | Note |
|---|---|---|
| `color-bg` | `#352f44` | Dark theme today; Phase 3 decides light vs dark (tablet in a bright shop favors light) |
| `color-surface` | `#5c5470` | Cards, table rows |
| `color-surface-strong` | `#2a2438` | Header, table head |
| `color-text` | `#dbd8e3` | 9.1:1 on bg |
| `color-success` | `greenyellow` | Needs an accessible success color |
| `color-warning` / pending | `lightcoral` | Fails contrast on surface (2.74:1) |
| `color-danger` | `red` | 3.2:1 on bg, fails |
| Type scale | 16 / 18 / 20 / 24 px in use | Proposal: 14, 16, 18, 20, 24, 30 |
| Spacing scale | 1rem, 2rem, 10px, 20px most used | Proposal: 4px base (4, 8, 12, 16, 24, 32, 48) |
| Radius | none consistent | Proposal: 6px controls, 12px cards |
| Font | Montserrat (most used) | One UI family |
