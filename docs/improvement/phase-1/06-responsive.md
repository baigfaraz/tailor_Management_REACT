# 06 — Responsive

Measured with Playwright at 320 / 375 / 768 / 1440 / 1920 px wide (`raw/ui-audit.json` → `responsive`). Overflow = `scrollWidth − viewport width`. Tablet (768) is the primary device (see `01-context.md`).

## Matrix

| Page | 320 | 375 | 768 | 1440 | 1920 | Finding IDs |
|---|---|---|---|---|---|---|
| Welcome `/` | ⚠️ no overflow; 50/50 split squeezes text to ~150px column, image distorted | ⚠️ same | ✅ | ✅ | ✅ | RESP-005 |
| Dashboard `/Home` | ❌ +304px overflow, "Search" card off-screen | ❌ +277px | ❌ +80px | ✅ | ✅ | RESP-001, RESP-003 |
| Add customer modal | ❌ fields cut off at right edge (`add-customer-modal-320.png`) | ❌ | ⚠️ modal fits, page behind overflows (`add-customer-modal-768.png`) | ✅ | ✅ | RESP-004 |
| All Customers | ❌ +220px | ❌ +165px | ✅ | ✅ | ⚠️ very wide rows, data spread across 1,850px | RESP-002 |
| Detail modal | ⚠️ fixed 370px groups | ⚠️ | ✅ | ⚠️ long single column | ⚠️ | RESP-004, UI-004 |
| Search | ✅ | ✅ | ✅ | ✅ | ✅ | RESP-006 (targets) |

Body text is ≥16px everywhere (0 smaller elements found). Landscape phone (e.g. 812×375) behaves like the 768 column for width.

## Findings

### RESP-001: Dashboard cards never wrap; overflow even on tablet
- Severity: High
- Where: `.cards` in `App.css:129-135`, `Card.js:10` (`width: 18rem` inline)
- Evidence: overflow +80px at 768, +277px at 375, +304px at 320; Phase 0 `dashboard-mobile.png` shows "Add Customer" card off-screen.
- Cause: `display:flex; flex-direction:row` without `flex-wrap`, fixed 18rem cards, no breakpoints.
- Impact: On the primary device the page scrolls sideways; on phones the main action is hidden.
- Suggested direction: Responsive grid (auto-fit, min card width), cards shrink.
- Effort: S
- Related: K-004, FEAT-003

### RESP-002: Customer table overflows on phones
- Severity: High
- Where: `AllCustomer.js`, `.table-container`
- Evidence: +220px at 320, +165px at 375 (Phase 0 `all-customers-mobile.png`).
- Cause: 6-column table with fixed margins, no responsive pattern.
- Impact: Status columns and delete icon need sideways scrolling on phones.
- Suggested direction: Card/list layout under ~640px; keep table on tablet and desktop.
- Effort: M
- Related: K-004, UI-003

### RESP-003: Header does not adapt
- Severity: Medium
- Where: `Header.js`, `.App-header`, `.companyName`, `.headerOptions`
- Evidence: Phase 0 `dashboard-mobile.png`: brand wraps to 3 lines, header background ends at viewport width while content overflows.
- Cause: Fixed margins (`2rem`, `3rem`), no small-screen layout; header width = viewport while body is wider.
- Impact: Cramped nav, broken-looking header.
- Suggested direction: AppShell with compact header on small screens.
- Effort: S
- Related: UI-006

### RESP-004: Forms and detail view use fixed widths
- Severity: High
- Where: `.LabelandField { width: 370px }` (`App.css:286-291`), `DetailModal.js` 3-column `Row`s
- Evidence: `add-customer-modal-320.png`: inputs cut off; labels beside inputs wrap to 2 lines at 768.
- Cause: Fixed pixel width; label and input side by side at every size.
- Impact: Adding a customer on a phone is not possible without zooming; tablet layout cramped.
- Suggested direction: Labels above inputs, fluid widths, 1/2/3 columns by breakpoint.
- Effort: S (with Phase 3 form components)
- Related: UX-004, UI-004

### RESP-005: Welcome page split layout on phones
- Severity: Low
- Where: `.adjustScreen`, `.getStartedDiv`, `.ImageDiv`
- Evidence: `welcome-320.png`, Phase 0 `welcome-mobile.png`.
- Cause: Fixed 50/50 split at all widths.
- Impact: Narrow text column, distorted photo.
- Suggested direction: Resolved by FEAT-001 (remove) or stack vertically.
- Effort: S
- Related: FEAT-001, UI-005

### RESP-006: Touch targets below 44×44px
- Severity: Medium
- Where: header links, trash icon (18px), card link inside button, search input height
- Evidence: small targets per page: Dashboard 8, All Customers 12 (`td`, `svg`), Search 3 (`raw/ui-audit.json`). axe `target-size` serious on Welcome and Dashboard.
- Cause: Default link/icon sizes, no padding.
- Impact: Mis-taps on tablet, especially next to delete.
- Suggested direction: Minimum 44px targets in Button/IconButton components.
- Effort: S
- Related: A11Y-008, UX-005
