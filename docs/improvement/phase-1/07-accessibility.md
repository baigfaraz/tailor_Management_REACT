# 07 — Accessibility (target WCAG 2.2 AA)

## 7a. Automated

axe-core 4.10 via `@axe-core/playwright` (tags wcag2a/aa, 21a/aa, 22aa, best-practice) on 4 pages + 2 modals: `raw/ui-audit.json` → `axe`. Phase 0 Lighthouse A11y: 77–96; All Customers with live data: 86.

| Rule | Impact | Pages | Nodes | WCAG |
|---|---|---|---|---|
| image-alt | critical | Welcome, Dashboard | 4 | 1.1.1 |
| nested-interactive | serious | Welcome, Dashboard | 4 | 4.1.2 |
| target-size | serious | Welcome, Dashboard | 8 | 2.5.8 |
| color-contrast | serious | All Customers | 5 | 1.4.3 |
| aria-dialog-name | serious | Add modal, Detail modal | 2 | 4.1.2 |
| heading-order | moderate | 3 pages | 3 | best practice |
| landmark-one-main / region | moderate | all | many | best practice |
| empty-table-header | minor | All Customers | 1 | best practice |

## 7b. Manual checks

| Check | Result |
|---|---|
| Keyboard reach | ❌ Customer rows and delete icon are not focusable (`rows-focusable: false`). A keyboard user cannot open a detail, change status, or delete. Cards need 2 Tab stops each (button + inner link). |
| Focus visible | ⚠️ Visible on buttons/links (browser default). ❌ Search input has none (`.searchfield:focus { box-shadow: none }`). |
| Focus order | ✅ Logical on all pages. |
| Modals | ✅ Bootstrap traps focus and closes on Escape. ❌ No accessible name (title is not linked). |
| Skip link | ❌ None (only 2 nav links, low impact). |
| Headings & landmarks | ❌ Brand is the only `h1` on every page; nav items are `h3`; no `main`, no `nav`; section titles use non-standard `<text>`. |
| Forms | ✅ Inputs have `<label>` via `controlId`. ❌ Radio groups have no group label (`fieldset/legend`); required not indicated; errors not shown at all. |
| Images | ❌ 3 dashboard images have no `alt`; Welcome image `alt=" "` (whitespace). |
| Color contrast | ❌ See table below. ❌ Status conveyed by color only (Complete/Pending words exist, so text is present; but the danger red on bg fails). |
| Motion | ✅ Only Bootstrap modal fade, which respects `prefers-reduced-motion`. |
| Zoom 200% | ⚠️ Equivalent to ~720px viewport: dashboard overflows (RESP-001). |
| Screen reader | ⚠️ Spot check through the Chromium accessibility tree (`raw/ui-audit.json` → `aria`), not a live VoiceOver session. Findings: card images unnamed, table cells exposed as plain cells with no action, modals announced as unnamed dialogs. Do a real VoiceOver pass in Phase 5. |
| `lang` | ✅ `en` |

Contrast (`raw/contrast.md`, WCAG formula):

| Pair | Ratio | Needed | Result |
|---|---|---|---|
| `#dbd8e3` on `#352f44` (body) | 9.10 | 4.5 | ✅ |
| `#dbd8e3` on `#5c5470` (rows, cards) | 5.05 | 4.5 | ✅ |
| `greenyellow` on `#5c5470` (Complete) | 5.79 | 4.5 | ✅ |
| `lightcoral` on `#5c5470` (Pending) | 2.74 | 4.5 | ❌ |
| `red` on `#352f44` (Customer Not Found) | 3.20 | 4.5 | ❌ |
| `#5c5470` on `#2a2438` (nav hover) | 2.10 | 4.5 | ❌ |

## Findings (grouped by WCAG criterion)

### A11Y-001: Customer list cannot be used with a keyboard (2.1.1 Keyboard)
- Severity: High
- Where: `AllCustomer.js:93-161`
- Evidence: `onClick` on `<td>` and on the `Trash` SVG; no `tabIndex`, no button.
- Cause: Click handlers on non-interactive elements.
- Impact: Keyboard and switch users cannot open, update or delete customers.
- Suggested direction: Row link/button for "open", real `<button aria-label="Delete …">` for delete.
- Effort: S
- Related: UX-005, RESP-006

### A11Y-002: Text contrast failures (1.4.3 Contrast Minimum, 1.4.11 Non-text)
- Severity: Medium
- Where: `.PendingStatus`, `.dataNotFound`, `.headeroptionText:hover`
- Evidence: 2.74:1, 3.20:1, 2.10:1 (table above); axe color-contrast ×5.
- Cause: Named colors chosen by eye.
- Impact: "Pending" hard to read on a tablet in daylight.
- Suggested direction: Accessible status colors in tokens; badge with text.
- Effort: S
- Related: UI-001

### A11Y-003: Missing focus indicator on search input (2.4.7 Focus Visible)
- Severity: Medium
- Where: `App.css:447-451`
- Evidence: `box-shadow: none` on focus; harness `focusVisible=false`.
- Cause: Bootstrap focus ring removed for looks.
- Impact: Keyboard users lose their place.
- Suggested direction: Token-based focus ring on all controls.
- Effort: S
- Related: UI-003

### A11Y-004: Dialogs have no accessible name (4.1.2 Name, Role, Value)
- Severity: Medium
- Where: `DetailModal.js:101`, `ShowDetailModal.js:79`
- Evidence: axe `aria-dialog-name` ×2.
- Cause: `Modal` without `aria-labelledby`.
- Impact: Screen readers announce "dialog" with no title.
- Suggested direction: Shared Dialog component sets the name from its title.
- Effort: S
- Related: UI-003

### A11Y-005: Buttons wrapping links (4.1.2)
- Severity: Medium
- Where: `Card.js:17-23`, `WelcomePage.js:22-26`
- Evidence: axe `nested-interactive` ×4; two Tab stops per card.
- Cause: Bootstrap `Button` with a router `Link` inside.
- Impact: Confusing announcements, double Tab stops.
- Suggested direction: One element (`Button as={Link}`).
- Effort: S
- Related: UI-003

### A11Y-006: No landmarks, wrong heading structure (1.3.1 Info and Relationships)
- Severity: Low
- Where: `Header.js`, all pages
- Evidence: semantics scan: landmarks `[header]` only; `h1` brand; `h3` nav; `<text>` section titles.
- Cause: Headings used for size.
- Impact: Hard to navigate by headings/landmarks.
- Suggested direction: AppShell with `header/nav/main`; one page `h1`.
- Effort: S
- Related: UI-006

### A11Y-007: Images without text alternatives (1.1.1 Non-text Content)
- Severity: Medium
- Where: `Card.js:13`, `WelcomePage.js:29`
- Evidence: axe `image-alt` critical ×4.
- Cause: `alt` missing or whitespace.
- Impact: Screen readers read file names.
- Suggested direction: Decorative images `alt=""`; meaningful ones described (likely replaced by icons in Phase 3).
- Effort: S
- Related: UI-005

### A11Y-008: Small touch targets (2.5.8 Target Size Minimum)
- Severity: Medium
- Where: see RESP-006
- Evidence: axe `target-size` ×8.
- Cause: No minimum size on links/icons.
- Impact: Mis-taps, including next to delete.
- Suggested direction: 44px minimum in components.
- Effort: S
- Related: RESP-006

### A11Y-009: Radio groups lack a group label; required fields not indicated (1.3.1, 3.3.2)
- Severity: Medium
- Where: `DetailModal.js:239-372`
- Evidence: Radios "Kurta/Shalwar", "Color/Ban", payment and order status sit under a styled `<text>` heading, not a `legend`. No required markers; no error messages.
- Cause: Bootstrap `Form.Check` used without `fieldset`.
- Impact: Screen readers read "Kurta, radio" with no question.
- Suggested direction: RadioGroup component with legend; required + error props on fields.
- Effort: S
- Related: UX-004
