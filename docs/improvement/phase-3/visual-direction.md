# Visual Direction (approved 2026-10-20)

## Inputs

- Reference: Statamic control panel (`demo.statamic.com/cp/dashboard`) and the owner's DESIGN.md style reference ("warm editorial sunset": warm cream canvas, thin display serif + light geometric sans, near-black filled primary with electric-lime text, lavender outlines, 8px radii, whisper shadows).
- Users: one tailor shop; staff on desktop and tablet at the counter, phone secondary (Phase 1 `01-context.md`).
- Brand: new; the owner asked Claude to propose. Name shown in the app: **"Tailor"** with a logo mark.

## Options shown

Three directions on the two key screens (Customers dashboard, Add customer), design canvas: <https://claude.ai/artifact/RhNebdNVwenjbZmFuhbuCx> (private to the owner).

| Option              | Summary                                                                                |
| ------------------- | -------------------------------------------------------------------------------------- |
| A · Editorial Warm  | White canvas, warm-shell sidebar, 48–56px thin Fraunces headlines, airy cards          |
| **B · Warm Canvas** | Warm-shell canvas, white raised cards, settings-style form sections, pill choice chips |
| C · Quiet Minimal   | Top navigation, mostly white, serif only in page titles, denser rows                   |

**Chosen: B, with a light sidebar** (owner change: white sidebar instead of the dark ink one), wordmark "Tailor" with a lime scissors logo.

## Decisions

| Topic             | Decision                                                                                                                                                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Personality       | Warm, calm, editorial; quiet UI with one confident primary action                                                                                                                                                                        |
| Canvas / surfaces | Warm shell `#fdf1ef` page canvas; white cards with a 1px ring + soft diffuse shadow; white sidebar                                                                                                                                       |
| Primary action    | Ink `#191a1b` fill with electric-lime `#d4ff4c` text; one per view                                                                                                                                                                       |
| Secondary action  | White with 1.5px lavender `#cbc2ea` outline and ink text                                                                                                                                                                                 |
| Accent use        | Lime only on dark fills, as the logo tile, or as the active-nav dot; never lime text on light backgrounds                                                                                                                                |
| Neutrals          | Warm grays (ink scale)                                                                                                                                                                                                                   |
| Status            | Pending = amber, payment due = blossom pink, complete/paid = lime tint, errors = red; always with an icon or text                                                                                                                        |
| Fonts             | **Fraunces** (display: page titles, section titles, big numbers; weights 300–400) + **Lexend** (all UI and body; 300–600). Both SIL Open Font License, self-hosted via Fontsource. Substitutes for Statamic's licensed p22-mackinac-pro. |
| Density           | Comfortable; 44px controls (touch targets)                                                                                                                                                                                               |
| Radius            | 8px controls, 12px small cards, 16px large cards, full for pills/badges                                                                                                                                                                  |
| Shadows           | Whisper-level: 1px ring + 40–64px diffuse blur for cards; 1–2px for buttons                                                                                                                                                              |
| Icons             | **Lucide** (one set), 1.75px stroke, through the `Icon` component                                                                                                                                                                        |
| Illustration      | None for now; no photos in the UI. Statamic's island illustrations and S-mark are not used (their brand).                                                                                                                                |
| Dark mode         | Later. Tokens are semantic so dark mode is a remap of `--color-*`.                                                                                                                                                                       |
| RTL               | Not needed (English only)                                                                                                                                                                                                                |
| Motion            | Minimal: fades and a short dialog rise (120–320ms); off with `prefers-reduced-motion`                                                                                                                                                    |

## Accessibility adjustments to the reference

| Reference value                       | Problem                     | Change                                                                    |
| ------------------------------------- | --------------------------- | ------------------------------------------------------------------------- |
| Mist `#cbd5e0` input borders          | 1.5:1, form fields need 3:1 | Input border `#8a847e` (3.70:1 on white, 3.34:1 on canvas)                |
| Lavender `#cbc2ea` focus ring         | 1.69:1, invisible focus     | Focus ring `#6b5bb0` (5.60:1 white, 5.07:1 canvas, 3.11:1 on ink buttons) |
| No status/error colors                | —                           | Added amber, blossom, lime tint, red with ≥ 6:1 text                      |
| Lavender outline on secondary buttons | 1.69:1 boundary             | Kept as decoration; the button is identified by its text label            |

## Scope note

Phase 3 delivers the look, tokens, components and app shell, applied to today's screens. The mockup's new dashboard content (stats + recent customers) and full-page form layout are page redesigns for Phase 5 (UI-004, UX-004b).
