# Design Tokens

Source files: `src/styles/tokens.css` (primitives, sizes, z-index, motion) and `src/styles/theme.css` (semantic tokens exposed to Tailwind). Tailwind's default colors, fonts, shadows, radii and text sizes are removed, so only these tokens produce utilities.

Layers:

- **Primitive** (`--p-*`): raw palette. Never used in components.
- **Semantic** (`--color-*`, `--font-*`, `--text-*`, `--radius-*`, `--shadow-*`): what components use, through Tailwind utilities (`bg-surface`, `text-muted`, `border-input`, `shadow-card`, `rounded-md`, `font-display`).
- **Component** (`--control-*`, `--sidebar-width`, `--content-max`): sizes shared by several components.

Contrast ratios computed with the WCAG formula (`raw/contrast.txt`).

## Color — semantic

| Token (utility)                 | Value                             | Use                                                     | Contrast                                    |
| ------------------------------- | --------------------------------- | ------------------------------------------------------- | ------------------------------------------- |
| `canvas` (`bg-canvas`)          | shell-50 `#fdf1ef`                | page background                                         | fg 15.77:1 · muted 6.16:1                   |
| `subtle`                        | ink-100 `#f6f1ee`                 | segmented-control track, hover rows                     | muted 6.07:1                                |
| `surface`                       | white                             | cards, sidebar, inputs, dialogs                         | fg 17.43:1 · muted 6.80:1                   |
| `surface-hover`                 | ink-50 `#faf7f5`                  | row hover                                               | —                                           |
| `overlay`                       | ink 45%                           | dialog backdrop                                         | —                                           |
| `skeleton`                      | ink-200 `#ece6e1`                 | loading placeholders                                    | —                                           |
| `fg` (`text-fg`)                | ink-950 `#191a1b`                 | main text                                               | see above                                   |
| `muted`                         | ink-600 `#5e5a5a`                 | secondary text, icons, labels                           | ≥ 6.07:1 on all backgrounds                 |
| `placeholder`                   | ink-550 `#6f6a65`                 | input placeholders                                      | 5.35:1 on surface                           |
| `inverse`                       | white                             | text on ink                                             | 17.43:1                                     |
| `on-primary`                    | lime-400 `#d4ff4c`                | text on primary buttons                                 | 15.11:1 on ink                              |
| `border`                        | ink-200 `#ece6e1`                 | dividers, card hairlines (decorative)                   | —                                           |
| `input`                         | ink-500 `#8a847e`                 | input, checkbox, radio borders                          | 3.70:1 surface · 3.34:1 canvas              |
| `input-hover`                   | ink-700 `#4e5154`                 | hovered field border                                    | 8.2:1                                       |
| `focus`                         | lavender-600 `#6b5bb0`            | focus ring (2px, 2px offset)                            | 5.60:1 surface · 5.07:1 canvas · 3.11:1 ink |
| `outline`                       | lavender-200 `#cbc2ea`            | secondary button outline (decorative; label identifies) | 1.69:1                                      |
| `primary` / `primary-hover`     | ink-950 / ink-900                 | primary button fill                                     | —                                           |
| `secondary-hover`               | lavender-50 `#f3f0fb`             | secondary button hover                                  | —                                           |
| `ghost-hover`                   | ink-100                           | ghost/icon button hover                                 | —                                           |
| `danger` / `danger-hover`       | red-600 `#b42318` / red-700       | destructive buttons, error text/borders                 | white 6.57:1 · on surface 6.57:1            |
| `brand`                         | lime-400                          | logo tile, active-nav dot (on ink only)                 | ink on lime 15.11:1                         |
| `success-bg` / `-fg` / `-dot`   | lime-100 / lime-900 / lime-600    | complete, paid                                          | fg on bg 8.92:1                             |
| `warning-bg` / `-fg` / `-dot`   | amber-100 / amber-800 / amber-600 | pending                                                 | 7.34:1                                      |
| `accent-bg` / `-fg`             | blossom-100 / blossom-800         | payment due                                             | 7.64:1                                      |
| `danger-bg` / `-fg` / `-border` | red-50 / red-600 / red-200        | error alerts                                            | 6.05:1                                      |
| `info-bg` / `-fg`               | lilac-100 / blue-900              | info alerts                                             | 8.15:1                                      |

Rule: never put text in `brand` lime on a light background.

## Color — primitives

| Scale        | Values                                                                                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ink          | 950 `#191a1b`, 900 `#2c2d30`, 800 `#3f3f46`, 700 `#4e5154`, 600 `#5e5a5a`, 550 `#6f6a65`, 500 `#8a847e`, 400 `#beb9b3`, 300 `#d8d3ce`, 200 `#ece6e1`, 100 `#f6f1ee`, 50 `#faf7f5`, white |
| shell        | 50 `#fdf1ef`, 100 `#f9e4df`                                                                                                                                                              |
| lime         | 100 `#eefbc7`, 400 `#d4ff4c`, 600 `#6b8a00`, 900 `#3a4a00`                                                                                                                               |
| lavender     | 50 `#f3f0fb`, 200 `#cbc2ea`, 600 `#6b5bb0`                                                                                                                                               |
| blossom      | 100 `#f5ddee`, 800 `#6b2d5c`                                                                                                                                                             |
| lilac / blue | lilac-100 `#d7e5fe`, blue-900 `#1e3a8a`                                                                                                                                                  |
| plum         | 800 `#4c305a`                                                                                                                                                                            |
| amber        | 100 `#fdecc8`, 600 `#b7791f`, 800 `#6b4400`                                                                                                                                              |
| red          | 50 `#fef3f2`, 200 `#fecdca`, 600 `#b42318`, 700 `#912018`                                                                                                                                |

## Typography

| Token          | Value                        | Use                                                          |
| -------------- | ---------------------------- | ------------------------------------------------------------ |
| `font-sans`    | Lexend Variable              | all UI and body text (weights 300, 400, 500, 600)            |
| `font-display` | Fraunces Variable (+ italic) | page titles, section titles, large numbers (weights 300–400) |
| `font-mono`    | system monospace             | not used yet                                                 |

| Utility     | Size | Line height | Typical use                         |
| ----------- | ---- | ----------- | ----------------------------------- |
| `text-xs`   | 12px | 1.5         | captions                            |
| `text-sm`   | 14px | 1.43        | labels, table cells, helper text    |
| `text-base` | 16px | 1.5         | body, inputs (16px avoids iOS zoom) |
| `text-lg`   | 18px | 1.5         | card titles                         |
| `text-xl`   | 20px | 1.4         | sub-headings                        |
| `text-2xl`  | 24px | 1.3         | section titles (display font)       |
| `text-3xl`  | 30px | 1.25        | stat numbers                        |
| `text-4xl`  | 36px | 1.2         | page titles on phones               |
| `text-5xl`  | 44px | 1.1         | page titles                         |
| `text-6xl`  | 56px | 1.05        | rare display                        |

Display headings use `tracking-tight` (−0.025em) or `-0.03em`.

Fonts are self-hosted from `@fontsource-variable/*` (OFL), `font-display: swap`, split by unicode range so phones download only Latin. Google Fonts are no longer needed once `App.css` is removed (end of migration); then the server CSP can drop `fonts.googleapis.com`.

## Spacing & sizing

Tailwind's 4px spacing scale (`p-2` = 8px, `gap-4` = 16px, …), used on the 8px rhythm: 8, 12, 16, 24, 32, 40, 48, 64.

| Token             | Value  | Use                                               |
| ----------------- | ------ | ------------------------------------------------- |
| `--control-sm`    | 36px   | compact buttons (filters)                         |
| `--control-md`    | 44px   | default buttons, inputs, nav items (touch target) |
| `--control-lg`    | 48px   | large buttons                                     |
| `--sidebar-width` | 240px  | app shell sidebar                                 |
| `--content-max`   | 1200px | page content width                                |

## Radius

| Utility        | Value  | Use                        |
| -------------- | ------ | -------------------------- |
| `rounded-sm`   | 6px    | checkboxes                 |
| `rounded-md`   | 8px    | buttons, inputs, nav items |
| `rounded-lg`   | 12px   | small cards, stat cards    |
| `rounded-xl`   | 16px   | large cards, dialogs       |
| `rounded-full` | 9999px | badges, pills, avatars     |

## Elevation

| Utility          | Value                                  | Use                    |
| ---------------- | -------------------------------------- | ---------------------- |
| `shadow-xs`      | 0 1px 2px 5%                           | buttons                |
| `shadow-sm`      | 0 2px 3px −2px 15%                     | inputs on hover, chips |
| `shadow-card`    | 1px ring + 0 16px 40px −8px 8%         | large cards, tables    |
| `shadow-raised`  | 1px ring + 0 24px 64px −40px driftwood | stat cards             |
| `shadow-overlay` | 1px ring + 0 24px 64px −12px 18%       | dialogs, toasts        |

## Layering (z-index)

`--z-base 0`, `--z-dropdown 10`, `--z-sticky 20`, `--z-header 30`, `--z-overlay 40`, `--z-modal 50`, `--z-popover 60`, `--z-toast 70`, `--z-tooltip 80`. Use `z-(--z-modal)`; never raw numbers.

## Breakpoints

Tailwind defaults, mobile-first: `sm` 640, `md` 768 (tablet, primary device), `lg` 1024, `xl` 1280, `2xl` 1536. The sidebar shows from `lg`; below it, navigation sits in a top bar.

## Motion

| Token                                                      | Value                                                 |
| ---------------------------------------------------------- | ----------------------------------------------------- |
| `--duration-fast`                                          | 120ms (hover, exits)                                  |
| `--duration-normal`                                        | 200ms (enter, dialogs)                                |
| `--duration-slow`                                          | 320ms (rare)                                          |
| `--ease-standard` / `-enter` / `-exit`                     | `cubic-bezier(.2,0,0,1)` / `(0,0,0,1)` / `(.3,0,1,1)` |
| `animate-fade-in`, `animate-fade-out`, `animate-dialog-in` | overlay and dialog motion                             |

`prefers-reduced-motion: reduce` turns all animation and transitions off (base.css).

## Dark mode (later)

Override the `--color-*` variables under `[data-theme="dark"]` on `<html>`; components need no change.
