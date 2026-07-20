# Why Robotmk — Design Polish

Date: 2026-07-17
Status: Approved (brainstorming), pending implementation plan

## Goal

Raise the visual quality and clarity of the standalone **Why Robotmk** page
(`layouts/why-robotmk/list.html`, `assets/css/sections/why-robotmk.css`,
`data/{en,de}/why-robotmk.yaml`) without departing from the site's existing
design system: teal accent `#15D1A0`, sharp corners (the slider knob is the
only sanctioned round exception), and the isometric low-poly tech aesthetic
established by the homepage hero (`layouts/partials/hero-viz.html`).

Both languages (EN + DE) are maintained in parallel and every content/data
change must land in both `data/en/why-robotmk.yaml` and
`data/de/why-robotmk.yaml`.

## Scope — six changes

### 1. Consolidate the pricing story (remove chart redundancy)

Today the page tells the same "three vendors climb, one stays flat" story
twice: once with a static dumbbell chart in the pricing section, and again with
the interactive slider explorer lower down. Consolidate to a single, stronger
interactive graph.

- **Delete** the `.cost-chart` dumbbell block entirely from the template, its
  CSS (`assets/css/sections/why-robotmk.css` cost-chart rules), and its data
  (`pricing.chart.*`, `pricing.formula_*` usage by the dumbbell) — but keep the
  two formula strings, they are reused (see below).
- **Delete** the "One formula vs. one formula" / "Eine Formel gegen eine Formel"
  heading and its intro paragraph as the section's framing.
- **Dissolve** the separate `.why-explorer` section ("Try It Yourself" /
  eyebrow). The interactive explorer becomes THE pricing graph and moves up
  into the pricing section.
- **New pricing section order:** new heading → short intro → **formula-contrast
  callout** → **interactive explorer** → **worked-example table** → source note.
- **New pricing heading** (copy, tweakable):
  - EN: `Priced on one number — not four`
  - DE: `Ein Preis, eine Variable`
- **Formula-contrast callout:** a compact inline element (not a section
  heading) that keeps the core message alive by showing the two formulas
  side by side:
  - competitor: `interval × tests × requests/test × rate` (marked as the "bad"
    / error-status colour, consistent with existing status-colour logic)
  - Checkmk: `tests × rate` (primary/teal)
  - Reuses the existing `pricing.formula_competitor` / `pricing.formula_checkmk`
    data strings so nothing needs re-translating.
- The explorer markup, its JS (`assets/js/pricing-explorer.js`), sliders,
  tooltips, and disclaimer are preserved as-is functionally; only their
  wrapping section/eyebrow/heading change. The explorer's own eyebrow/heading
  data keys (`explorer.eyebrow`, `explorer.heading`, `explorer.intro`) are
  either dropped or repurposed as the pricing intro — decided in the plan to
  avoid a stranded second heading.
- **Result:** 4 content sections instead of 5 (Hero, Pricing, Pillars, CTA).

### 2. Redesign the seven pillar icons — monoline + teal accent detail

Replace all seven icons in `layouts/partials/why-icon.html`. Keep the monoline
base (24×24, `stroke=currentColor`, no baked fills) but give **each icon one
filled teal focal detail** — a node, dot, or small area rendered in
`--color-primary` — so each reads as intentional and distinct rather than a
generic stroke glyph.

- The teal detail must be a separate element the CSS can colour (e.g. a
  `class="why-icon__accent"` on the filled node), NOT hard-coded, so theme and
  hover behave.
- Each of the seven concepts gets a sharper, more specific motif:
  open-source, no vendor lock-in, deepest Checkmk integration, one framework for
  every technology, the Robotmk Bridge, lingua franca / community, no talent
  risk. Exact motifs decided during implementation.

### 3. Pillar cards — "mounted plaque" treatment

Make the reason cards less flat:

- **Four subtle teal corner dots** per card, positioned inset from each corner,
  suggesting a plaque screwed into place.
- A refined thin border on each card.
- Hover raises border + icon accent to teal (extends existing hover behaviour).
- Must degrade cleanly for the 7th "closing" full-width card variant
  (`.why-pillar-card--closing`) and at mobile breakpoints.

### 4. "Mehr erfahren" expandable info box per card

Each pillar card ends with a **"Mehr erfahren" / "Learn more" button** that
reveals a longer explanatory paragraph.

- Real semantic `<button>` with `aria-expanded` toggling; associated region has
  an id referenced by `aria-controls`.
- Gentle open/close animation (height/opacity transition); honours
  `prefers-reduced-motion` (instant, no animation).
- Progressive enhancement: without JS the content should remain reachable
  (e.g. `<details>`-based or content visible as fallback) — approach chosen in
  the plan.
- Requires **new expanded copy for all seven reasons in both EN and DE**
  (`pillars.items[].more` or similar new data key). Drafted during
  implementation; factual, on-brand, concise.
- New JS lives alongside existing page JS conventions (see how
  `pricing-explorer.js` is wired into `assets/js/main.js` / the build).

### 5. Hero — subtle background motif

Add a very restrained large-scale background texture behind the hero text
(`.why-hero`), derived from the homepage isometric SVG vocabulary:

- Isometric tile grid outline + one or two teal "beam" accents, low opacity,
  theme-aware (adapts to light/dark), positioned behind the centred hero text
  without reducing its legibility.
- Essentially static — no glitch/green→red effect. The page's message is
  "predictable / stable", so the motif should feel calm, not alarming.
- Respects `prefers-reduced-motion` (any motion is optional and subtle).
- Implemented as an inline/partial SVG or CSS background layer scoped to
  `.why-hero`; must not introduce horizontal scroll.

### 6. Reduce section spacing

Tighten the vertical rhythm **on this page only**. Reduce the section vertical
padding via a page-scoped override in `why-robotmk.css` (e.g. scoping under a
page wrapper or the `.why-*` section classes) so other pages using the shared
`.section` padding are unaffected.

## Constraints & non-goals

- No new external dependencies; all SVG/CSS/JS inline or in existing asset
  pipeline. Artifacts CSP-style self-containment is not required (this is the
  Hugo site), but follow existing asset-concat conventions.
- Do not restyle global tokens or components shared with other pages.
- Keep all copy factual and non-disparaging about competitors (per the original
  pricing briefing in `why-robotmk.md`).
- Every YAML/data change in EN must have its DE counterpart.
- Accessibility: keyboard operable expanders, visible focus, correct ARIA,
  reduced-motion support — matching the care already in the explorer CSS.

## Acceptance

- Pricing section shows exactly one graph (the interactive explorer), preceded
  by the formula-contrast callout and followed by the table; no dumbbell chart
  remains; no "formula vs formula" heading remains; page has 4 content sections.
- Seven redesigned icons render with a teal accent detail; hover works in both
  themes.
- Pillar cards show four corner dots + border; "Mehr erfahren" reveals longer
  copy with animated, accessible, reduced-motion-safe behaviour, in EN and DE.
- Hero shows a subtle, legible-preserving background motif.
- Section spacing on the page is visibly tighter; other pages unchanged.
- `hugo` builds without errors in both languages.
