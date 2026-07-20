# Why Robotmk Design Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the standalone Why Robotmk page — consolidate the two redundant pricing charts into one interactive graph, redesign the seven pillar icons, give the cards a "mounted plaque" look with expandable info boxes, add a subtle hero background motif, and tighten section spacing.

**Architecture:** Pure Hugo/CSS/vanilla-JS changes scoped to the `why-robotmk` page. Template `layouts/why-robotmk/list.html`, one CSS file `assets/css/sections/why-robotmk.css` (already in the concat pipeline), one icon partial `layouts/partials/why-icon.html`, bilingual data in `data/{en,de}/why-robotmk.yaml`, and one new JS module wired through `assets/js/main.js`. No new dependencies.

**Tech Stack:** Hugo v0.124 extended, ES modules built via `js.Build`, hand-written SVG + CSS custom properties (design tokens in `assets/css/tokens.css`).

## Global Constraints

- Teal accent is `--color-primary` (`#15D1A0`); error/"bad" status is `--color-error`. Never hard-code hex where a token exists.
- Sharp corners everywhere; the only sanctioned rounded exception is the existing slider knob. Corner dots are circles (dots), not rounded corners on boxes.
- Every content/data change in `data/en/why-robotmk.yaml` MUST have its matching change in `data/de/why-robotmk.yaml`.
- All motion must have a `@media (prefers-reduced-motion: reduce)` off-switch.
- Copy stays factual and non-disparaging about competitors.
- No horizontal page scroll may be introduced (existing code uses `overflow-x: hidden` guards on chart/explorer containers — preserve that discipline).
- Verification for every task: `hugo --quiet` builds both languages without error, plus a named visual check in `hugo server`.

**Build/verify commands:**
- Build check: `hugo --quiet && echo BUILD_OK`
- Local preview: `hugo server -D` then open `http://localhost:1313/why-robotmk/` (EN) and `http://localhost:1313/de/why-robotmk/` (DE)

---

### Task 1: Consolidate pricing section — remove dumbbell, fold explorer in, add formula callout

**Files:**
- Modify: `layouts/why-robotmk/list.html` (pricing section lines ~14-90, explorer section ~110-211)
- Modify: `assets/css/sections/why-robotmk.css` (delete cost-chart block ~53-291; add formula-callout rules)
- Modify: `data/en/why-robotmk.yaml`, `data/de/why-robotmk.yaml` (pricing + explorer keys)

**Interfaces:**
- Produces: a single `.why-pricing` section whose order is heading → intro → `.formula-callout` → `.explorer` (unchanged markup/JS) → `.why-pricing__table` → source note. The `.why-explorer` wrapper section is removed; `.explorer` itself (the JS hook) is preserved verbatim.

- [ ] **Step 1: Update data — new pricing heading, drop dumbbell chart keys, keep formulas**

In `data/en/why-robotmk.yaml`, under `pricing:` set:
```yaml
pricing:
  heading: "Priced on one number — not four"
  intro: "Action/request-based tools price as a product of several compounding variables — change any one and the bill moves, often non-linearly. Checkmk prices on test cases alone."
  formula_competitor: "interval × tests × requests/test × rate"
  formula_checkmk: "tests × rate"
  formula_competitor_label: "Usage-based tools"
  formula_checkmk_label: "Checkmk Synthetic Monitoring"
```
Delete the entire `pricing.chart:` block (caption/axis_max/ticks/rows). Keep `pricing.table:` and `pricing.source_note` unchanged.

In `data/de/why-robotmk.yaml`, under `pricing:` set:
```yaml
pricing:
  heading: "Ein Preis, eine Variable"
  intro: "Verbrauchsbasierte Tools berechnen den Preis als Produkt mehrerer sich verstärkender Variablen — ändere eine, und die Rechnung bewegt sich, oft nicht-linear. Checkmk rechnet allein nach Testfällen ab."
  formula_competitor: "Intervall × Tests × Requests/Test × Rate"
  formula_checkmk: "Tests × Rate"
  formula_competitor_label: "Verbrauchsbasierte Tools"
  formula_checkmk_label: "Checkmk Synthetic Monitoring"
```
Delete the `pricing.chart:` block in the DE file too.

- [ ] **Step 2: Move explorer intro copy into the explorer's controls (avoid a stranded second heading)**

The explorer keeps its `intro`, `interval_label`, sliders, vendors, disclaimer. Remove `explorer.eyebrow` and `explorer.heading` usage from the template (Step 3). Leave the `explorer.*` data keys in the YAML except delete `eyebrow` and `heading` from both language files (the pricing section heading now covers it). Keep `explorer.intro` — it becomes the lead line under the pricing intro is NOT needed; instead delete `explorer.intro` too and rely on `pricing.intro`. Net: delete `explorer.eyebrow`, `explorer.heading`, `explorer.intro` from both files.

- [ ] **Step 3: Rewrite the pricing + explorer template blocks**

In `layouts/why-robotmk/list.html`, replace the whole `<section class="why-pricing …">…</section>` AND the separate `<section class="why-explorer …">…</section>` with a single pricing section. Delete the entire `.cost-chart` markup (the `<div class="cost-chart">…</div>` and its `<p class="cost-chart__caption">`). New structure:

```html
<section class="why-pricing section section--surface">
  <div class="container">
    <h2 class="why-pricing__heading">{{ $why.pricing.heading }}</h2>
    <p class="why-pricing__intro">{{ $why.pricing.intro | safeHTML }}</p>

    <div class="formula-callout" aria-hidden="false">
      <div class="formula-callout__item formula-callout__item--bad">
        <span class="formula-callout__label">{{ $why.pricing.formula_competitor_label }}</span>
        <code class="formula-callout__formula">{{ $why.pricing.formula_competitor }}</code>
      </div>
      <span class="formula-callout__vs">vs</span>
      <div class="formula-callout__item formula-callout__item--good">
        <span class="formula-callout__label">{{ $why.pricing.formula_checkmk_label }}</span>
        <code class="formula-callout__formula">{{ $why.pricing.formula_checkmk }}</code>
      </div>
    </div>

    {{/* Interactive explorer — the single pricing graph. Markup preserved from the former why-explorer section. */}}
    <div class="explorer"
         data-requests-per-test="{{ $why.explorer.requests_per_test }}"
         data-usd-to-eur="{{ $why.explorer.usd_to_eur }}"
         data-dynatrace-rate="{{ $why.explorer.dynatrace_rate_usd_per_1k_actions }}"
         data-datadog-rate="{{ $why.explorer.datadog_rate_usd_per_1k_runs }}"
         data-grafana-rate="{{ $why.explorer.grafana_rate_usd_per_1k_runs }}"
         data-checkmk-min-price="{{ $why.explorer.checkmk_min_price_eur }}"
         data-checkmk-max-price="{{ $why.explorer.checkmk_max_price_eur }}"
         data-test-case-min="{{ $why.explorer.test_case_min }}"
         data-test-case-max="{{ $why.explorer.test_case_max }}"
         data-y-axis-max="{{ $why.explorer.y_axis_max }}">
      {{/* …explorer__body, controls, chart-col, hint, noscript — copied verbatim from current lines 128-206… */}}
    </div>

    <div class="why-pricing__table-wrapper">
      {{/* …existing table markup, unchanged from current lines 66-87… */}}
    </div>
    <p class="why-pricing__source">{{ $why.pricing.source_note }}</p>
    <p class="why-pricing__source">{{ $why.explorer.disclaimer }}</p>
  </div>
</section>
```
Copy the explorer's inner markup (`explorer__body` … `noscript`) verbatim from the current template. Delete the now-empty former `why-explorer` section entirely. Ensure only ONE `.explorer` element exists (the JS `initPricingExplorer` binds to it).

- [ ] **Step 4: Delete cost-chart CSS, add formula-callout CSS**

In `assets/css/sections/why-robotmk.css`, delete the entire cost-chart block (the banner comment "Cost Chart — dumbbell comparison" through `.cost-chart__caption { … }`, roughly current lines 53-291). Add:

```css
/* Formula contrast — compact inline callout replacing the old
   "formula vs formula" section heading. Same status-colour logic as
   the explorer: error for usage-based, primary for Checkmk. */
.formula-callout {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
  gap: var(--space-md);
  max-width: var(--content-width);
  margin: 0 auto var(--space-2xl);
}

.formula-callout__item {
  flex: 1 1 260px;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-md) var(--space-lg);
  border: 1px solid var(--color-surface-border);
  border-top: 2px solid var(--status-color);
  --status-color: var(--color-surface-border);
}

.formula-callout__item--bad  { --status-color: var(--color-error); }
.formula-callout__item--good { --status-color: var(--color-primary); }

.formula-callout__label {
  font-size: var(--text-label-size);
  font-weight: var(--text-label-weight);
  letter-spacing: var(--text-label-letter-spacing);
  text-transform: uppercase;
  color: var(--color-on-surface-variant);
}

.formula-callout__formula {
  font-family: var(--font-code);
  font-size: var(--text-code-size);
  color: var(--color-on-surface);
}

.formula-callout__item--good .formula-callout__formula { color: var(--color-primary); }

.formula-callout__vs {
  align-self: center;
  font-family: var(--font-code);
  font-size: var(--text-body-sm-size);
  color: var(--color-on-surface-muted);
}

@media (max-width: 640px) {
  .formula-callout__vs { display: none; }
}
```

- [ ] **Step 5: Delete the now-unused `.why-explorer*` heading CSS**

In `why-robotmk.css`, delete `.why-explorer`, `.why-explorer__eyebrow`, `.why-explorer__heading`, `.why-explorer__intro` rules (the explorer's former section-title styles; the `.explorer*` rules stay). Keep everything under `/* --- Sliders --- */` and below.

- [ ] **Step 6: Build + visual verify**

Run: `hugo --quiet && echo BUILD_OK`
Expected: `BUILD_OK`, no template errors about missing `$why.pricing.chart` or `$why.explorer.heading`.
Then `hugo server -D`, open `/why-robotmk/` and `/de/why-robotmk/`: pricing section shows heading → intro → two formula cards → working slider chart → table → source. No dumbbell chart anywhere. Sliders still move the bars.

- [ ] **Step 7: Commit**

```bash
git add layouts/why-robotmk/list.html assets/css/sections/why-robotmk.css data/en/why-robotmk.yaml data/de/why-robotmk.yaml
git commit -m "Consolidate Why Robotmk pricing to one interactive chart + formula callout"
```

---

### Task 2: Redesign the seven pillar icons (monoline + teal accent detail)

**Files:**
- Modify: `layouts/partials/why-icon.html` (full rewrite of the seven icon branches)
- Modify: `assets/css/sections/why-robotmk.css` (add `.why-icon__accent` colour rule)

**Interfaces:**
- Consumes: the `$item.icon` string keys already in the data (`open-source`, `no-lockin`, `integration`, `one-framework`, `bridge`, `community`, `no-risk`).
- Produces: each `<svg class="why-icon">` contains monoline strokes PLUS one filled element `class="why-icon__accent"` (fill, no stroke) that CSS colours teal independent of the stroke.

- [ ] **Step 1: Add the accent-colour CSS rule**

In `why-robotmk.css`, near the existing `.why-icon` rule, add:
```css
/* The single filled focal detail per icon — coloured independently of the
   monoline stroke so it stays teal while the stroke uses currentColor. */
.why-icon__accent {
  fill: var(--color-primary);
  stroke: none;
}
```

- [ ] **Step 2: Rewrite the icon partial**

In `layouts/partials/why-icon.html`, keep the wrapper `<svg class="why-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" …>` and the `{{ if eq $name … }}` dispatch. For each of the seven, draw a sharper monoline motif and add exactly one `<… class="why-icon__accent" fill … />` focal element (remove the SVG-level `fill="none"` only for that element by giving it its own fill via the class; since the class sets `fill: var(--color-primary)`, no inline fill needed). Concrete pattern, worked for `one-framework` (a hub with a filled centre node) and `open-source` (an open padlock with a filled teal keyhole):

```html
{{- if eq $name "one-framework" }}
<circle cx="12" cy="4"  r="1.6"/>
<circle cx="20" cy="12" r="1.6"/>
<circle cx="12" cy="20" r="1.6"/>
<circle cx="4"  cy="12" r="1.6"/>
<path d="M12 5.6V9M18.4 12H15M12 18.4V15M5.6 12H9"/>
<circle class="why-icon__accent" cx="12" cy="12" r="2.4"/>

{{- else if eq $name "open-source" }}
<rect x="5" y="11" width="14" height="9" rx="0"/>
<path d="M8 11V7.5A4 4 0 0 1 15.5 5"/>
<circle class="why-icon__accent" cx="12" cy="15.5" r="1.6"/>
{{- end }}
```
Apply the same "monoline shape + one `why-icon__accent` filled node" rule to the remaining five (`no-lockin`: two interlocking rings, accent = the overlap lens; `integration`: nested Checkmk-style hexagon/plug, accent = the connector dot; `bridge`: arch + deck, accent = a keystone dot at the apex; `community`: three-node cluster, accent = the central node; `no-risk`: shield + check, accent = the check tip or a filled dot). Keep every shape inside the 24×24 box, `stroke-linecap/linejoin=round` inherited from the wrapper.

- [ ] **Step 3: Build + visual verify**

Run: `hugo --quiet && echo BUILD_OK`
Then `hugo server -D`, open `/why-robotmk/`: all seven cards show an icon; each has a small teal filled detail; stroke colour still follows the card (grey default, teal on hover). Toggle site light/dark — accent stays teal, stroke adapts.

- [ ] **Step 4: Commit**

```bash
git add layouts/partials/why-icon.html assets/css/sections/why-robotmk.css
git commit -m "Redesign Why Robotmk pillar icons: monoline with teal accent detail"
```

---

### Task 3: Pillar cards — mounted-plaque corner dots + border polish

**Files:**
- Modify: `assets/css/sections/why-robotmk.css` (`.why-pillar-card` rules)
- Modify: `layouts/why-robotmk/list.html` (add corner-dot markup to the card)

**Interfaces:**
- Consumes: existing `.why-pillar-card`, `.why-pillar-card--closing` structure.
- Produces: each card renders four `.why-pillar-card__rivet` dots and a bordered surface; hover raises border to teal.

- [ ] **Step 1: Add corner-dot markup**

In `layouts/why-robotmk/list.html`, inside the pillar card `<div class="card why-pillar-card…">`, add as the FIRST children (before the icon), four dots wrapped so they can be positioned absolutely:
```html
<span class="why-pillar-card__rivets" aria-hidden="true">
  <span class="why-pillar-card__rivet"></span>
  <span class="why-pillar-card__rivet"></span>
  <span class="why-pillar-card__rivet"></span>
  <span class="why-pillar-card__rivet"></span>
</span>
```

- [ ] **Step 2: Card + rivet CSS**

In `why-robotmk.css`, extend the `.why-pillar-card` rules:
```css
.why-pillar-card {
  position: relative;
  border: 1px solid var(--color-surface-border);
  padding: var(--space-lg);
  transition: border-color var(--transition-fast);
}

.why-pillar-card:hover {
  border-color: var(--color-primary);
}

/* Four teal dots inset from the corners — reads as a plaque screwed into
   place. Muted at rest, full teal when the card is hovered/focused. */
.why-pillar-card__rivet {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-primary);
  opacity: 0.35;
  transition: opacity var(--transition-fast);
}
.why-pillar-card__rivet:nth-child(1) { top: var(--space-sm); left: var(--space-sm); }
.why-pillar-card__rivet:nth-child(2) { top: var(--space-sm); right: var(--space-sm); }
.why-pillar-card__rivet:nth-child(3) { bottom: var(--space-sm); left: var(--space-sm); }
.why-pillar-card__rivet:nth-child(4) { bottom: var(--space-sm); right: var(--space-sm); }

.why-pillar-card:hover .why-pillar-card__rivet {
  opacity: 0.9;
}
```
The existing `.why-pillar-card__icon` hover rule already flips icon colour to teal — keep it.

- [ ] **Step 3: Verify the closing (7th) card still works**

The `.why-pillar-card--closing` variant is `flex-direction: row` with a left accent border and extra left padding. Confirm the four rivets sit correctly inside it; if the left rivets collide with the 3px accent border, nudge with a scoped override:
```css
.why-pillar-card--closing .why-pillar-card__rivet:nth-child(1),
.why-pillar-card--closing .why-pillar-card__rivet:nth-child(3) {
  left: var(--space-md);
}
```

- [ ] **Step 4: Build + visual verify**

`hugo --quiet && echo BUILD_OK`, then `hugo server -D`: each of the six grid cards + the closing card shows four faint teal corner dots and a thin border; hovering a card brightens its dots and border to teal. Mobile (single column) still looks right.

- [ ] **Step 5: Commit**

```bash
git add layouts/why-robotmk/list.html assets/css/sections/why-robotmk.css
git commit -m "Add mounted-plaque corner dots and border polish to pillar cards"
```

---

### Task 4: "Mehr erfahren" expandable info box (data + markup + fallback)

**Files:**
- Modify: `data/en/why-robotmk.yaml`, `data/de/why-robotmk.yaml` (add `more:` and `more_label:` )
- Modify: `layouts/why-robotmk/list.html` (add `<details>` expander to each card)
- Modify: `assets/css/sections/why-robotmk.css` (expander styling)

**Interfaces:**
- Produces: each card contains `<details class="why-more">` with a `<summary class="why-more__toggle">` and `<div class="why-more__panel">`. This is the no-JS-accessible baseline; Task 5 animates it.

- [ ] **Step 1: Add expanded copy + a label to the data (both languages)**

In `data/en/why-robotmk.yaml`, add a `more:` line to each of the seven `pillars.items` and a shared label under `pillars:`. Example for the first two items; write factual expanded copy for all seven:
```yaml
pillars:
  heading: "Seven reasons it holds up beyond price"
  more_label: "Learn more"
  items:
    - icon: "open-source"
      title: "Open source"
      text: "Robot Framework and Robotmk are both open source. Nothing closed-box to trust blindly — you can read it, audit it, extend it."
      more: "Because the full source is public, your security team can audit exactly what runs in your environment, and you're never blocked waiting on a vendor to fix or extend something — you can patch it yourself or commission the community. There is no per-seat licence gate on the tooling itself."
    - icon: "no-lockin"
      title: "No vendor trap"
      text: "Your tests are standard Robot Framework — portable, not hostage to one vendor's proprietary format."
      more: "Every test you write is plain Robot Framework, the same syntax used far beyond Robotmk. If you ever move platforms, the tests come with you unchanged — no proprietary recorder format to re-author, no export that quietly drops half the logic."
```
Write `more:` for all seven. In `data/de/why-robotmk.yaml`, mirror with `more_label: "Mehr erfahren"` and a German `more:` for each of the seven items.

- [ ] **Step 2: Add the expander markup to the card body**

In `layouts/why-robotmk/list.html`, inside `.why-pillar-card__body`, after the `<p class="why-pillar-card__text">`, add:
```html
<details class="why-more">
  <summary class="why-more__toggle">
    <span class="why-more__toggle-text">{{ $why.pillars.more_label }}</span>
    <svg class="why-more__chevron" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>
  </summary>
  <div class="why-more__panel">
    <p>{{ $item.more }}</p>
  </div>
</details>
```

- [ ] **Step 3: Expander CSS (works without JS)**

In `why-robotmk.css`:
```css
.why-more {
  margin-top: var(--space-md);
}

.why-more__toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  cursor: pointer;
  list-style: none;
  font-size: var(--text-body-sm-size);
  font-weight: 600;
  color: var(--color-primary);
}
.why-more__toggle::-webkit-details-marker { display: none; }

.why-more__toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

.why-more__chevron {
  transition: transform var(--transition-fast);
}
.why-more[open] .why-more__chevron {
  transform: rotate(180deg);
}

.why-more__panel p {
  margin: var(--space-sm) 0 0;
  font-size: var(--text-body-sm-size);
  line-height: var(--text-body-sm-line-height);
  color: var(--color-on-surface-variant);
}
```

- [ ] **Step 4: Build + visual verify (no-JS baseline)**

`hugo --quiet && echo BUILD_OK`, then `hugo server -D`: each card shows a teal "Learn more"/"Mehr erfahren" toggle with a chevron; clicking it reveals the longer paragraph and rotates the chevron. Keyboard: Tab to the summary, Enter toggles. This works before any animation JS exists.

- [ ] **Step 5: Commit**

```bash
git add layouts/why-robotmk/list.html assets/css/sections/why-robotmk.css data/en/why-robotmk.yaml data/de/why-robotmk.yaml
git commit -m "Add expandable 'Learn more' box to each pillar card (details-based)"
```

---

### Task 5: Animate the expander (JS enhancement, reduced-motion safe)

**Files:**
- Create: `assets/js/pillar-expand.js`
- Modify: `assets/js/main.js` (import + init)

**Interfaces:**
- Consumes: `.why-more` `<details>` elements from Task 4.
- Produces: exported `init()` that adds smooth height animation on toggle, matching the `initPricingExplorer` module convention.

- [ ] **Step 1: Write the module**

Create `assets/js/pillar-expand.js`:
```js
// Smoothly animate <details class="why-more"> open/close. Progressive
// enhancement over the native, no-JS-accessible <details>. Honours
// prefers-reduced-motion (then it does nothing and native toggle stands).
export function init() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  document.querySelectorAll('.why-more').forEach((details) => {
    const panel = details.querySelector('.why-more__panel');
    if (!panel) return;

    details.addEventListener('click', (e) => {
      // Only intercept clicks on the summary toggle.
      const summary = details.querySelector('.why-more__toggle');
      if (!summary || !summary.contains(e.target)) return;
      e.preventDefault();

      if (details.open) {
        const start = panel.scrollHeight;
        panel.style.height = start + 'px';
        requestAnimationFrame(() => {
          panel.style.transition = 'height 220ms ease, opacity 180ms ease';
          panel.style.height = '0px';
          panel.style.opacity = '0';
        });
        panel.addEventListener('transitionend', function done() {
          details.open = false;
          panel.style.transition = '';
          panel.style.height = '';
          panel.style.opacity = '';
          panel.removeEventListener('transitionend', done);
        }, { once: true });
      } else {
        details.open = true;
        const target = panel.scrollHeight;
        panel.style.height = '0px';
        panel.style.opacity = '0';
        requestAnimationFrame(() => {
          panel.style.transition = 'height 220ms ease, opacity 180ms ease';
          panel.style.height = target + 'px';
          panel.style.opacity = '1';
        });
        panel.addEventListener('transitionend', function done() {
          panel.style.transition = '';
          panel.style.height = '';
          panel.style.opacity = '';
          panel.removeEventListener('transitionend', done);
        }, { once: true });
      }
    });
  });
}
```

- [ ] **Step 2: Wire it into main.js**

In `assets/js/main.js`, add the import alongside the others and call its init where the other `init*()` calls happen (match the existing pattern — find where `initPricingExplorer()` is invoked and add next to it):
```js
import { init as initPillarExpand } from './pillar-expand.js';
// …
initPillarExpand();
```

- [ ] **Step 3: Add `overflow: hidden` so height animation clips cleanly**

In `why-robotmk.css`, add to the panel:
```css
.why-more__panel {
  overflow: hidden;
}
```

- [ ] **Step 4: Build + visual verify**

`hugo --quiet && echo BUILD_OK` (Hugo runs `js.Build`, which bundles the new import). Then `hugo server -D`: clicking a toggle now animates the panel open/closed smoothly; chevron rotates. In the browser devtools, emulate `prefers-reduced-motion: reduce` and confirm the panel still toggles instantly (native), no jank.

- [ ] **Step 5: Commit**

```bash
git add assets/js/pillar-expand.js assets/js/main.js assets/css/sections/why-robotmk.css
git commit -m "Animate pillar 'Learn more' expander with reduced-motion fallback"
```

---

### Task 6: Hero — subtle isometric background motif

**Files:**
- Create: `layouts/partials/why-hero-motif.html` (inline SVG)
- Modify: `layouts/why-robotmk/list.html` (place motif in hero)
- Modify: `assets/css/sections/why-robotmk.css` (`.why-hero` positioning + motif layer)

**Interfaces:**
- Produces: a decorative, `aria-hidden` SVG layer behind `.why-hero`'s text, using site tokens, that does not affect layout or introduce horizontal scroll.

- [ ] **Step 1: Create the motif partial**

Create `layouts/partials/why-hero-motif.html` — a low-opacity isometric tile grid + one or two teal beam accents, drawn in the homepage SVG's vocabulary (isometric diamonds, `#15D1A0` beams) but static and calm. Use `currentColor`/tokens where possible so it adapts to theme; wrap in `<svg class="why-hero__motif" aria-hidden="true" …>`. Keep it a handful of `<polygon>` tile outlines and 1–2 `<rect>`/`<line>` beams at low `stroke-opacity`, no animation loop by default.

- [ ] **Step 2: Place it in the hero**

In `layouts/why-robotmk/list.html`, inside `<section class="why-hero section">`, as the first child of the section (before `.container`), add:
```html
{{ partial "why-hero-motif.html" . }}
```

- [ ] **Step 3: Position the motif behind the text**

In `why-robotmk.css`, extend `.why-hero`:
```css
.why-hero {
  position: relative;
  overflow: hidden; /* motif must never spill into page horizontal scroll */
}

.why-hero__motif {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.10;
}

.why-hero .container {
  position: relative;
  z-index: 1;
}
```
Tune `opacity` (0.06–0.14) so text contrast stays comfortable in both themes.

- [ ] **Step 4: Build + visual verify**

`hugo --quiet && echo BUILD_OK`, then `hugo server -D`: the hero shows a faint isometric/teal texture behind the title and subtitle; text remains fully legible. Check both light and dark site themes and a narrow phone width — no horizontal scrollbar appears.

- [ ] **Step 5: Commit**

```bash
git add layouts/partials/why-hero-motif.html layouts/why-robotmk/list.html assets/css/sections/why-robotmk.css
git commit -m "Add subtle isometric background motif to Why Robotmk hero"
```

---

### Task 7: Tighten section spacing (page-scoped)

**Files:**
- Modify: `assets/css/sections/why-robotmk.css` (page-scoped section padding override)

**Interfaces:**
- Consumes: the shared `.section` vertical padding from `assets/css/sections/pages.css`/base.
- Produces: reduced vertical rhythm on `.why-*` sections only; other pages unaffected.

- [ ] **Step 1: Find the shared section padding value**

Run: `grep -rn "\.section" assets/css/sections/pages.css assets/css/base.css assets/css/tokens.css | grep -i padding`
Note the current vertical padding (likely a `--space-*` token) so the override is a deliberate reduction, not a guess.

- [ ] **Step 2: Add the scoped override**

In `why-robotmk.css`, add near the top (after the header comment):
```css
/* Page-scoped: tighten the vertical rhythm on this page only. The shared
   .section padding is left intact for every other page. */
.why-hero.section,
.why-pricing.section,
.why-pillars.section,
.why-cta.section {
  padding-block: var(--space-2xl);
}
```
Pick the token one step below the shared value (if the shared padding is `--space-3xl`/`--space-4xl`, step down to `--space-2xl`). Adjust to taste during visual check.

- [ ] **Step 3: Build + visual verify**

`hugo --quiet && echo BUILD_OK`, then `hugo server -D`: the gaps between hero/pricing/pillars/CTA are visibly tighter than before but not cramped. Open another page (e.g. `/`) and confirm its section spacing is unchanged.

- [ ] **Step 4: Commit**

```bash
git add assets/css/sections/why-robotmk.css
git commit -m "Tighten Why Robotmk section spacing (page-scoped)"
```

---

## Self-Review

**Spec coverage:**
- Spec §1 (consolidate charts) → Task 1. ✓
- Spec §2 (redesign icons) → Task 2. ✓
- Spec §3 (card plaque treatment) → Task 3. ✓
- Spec §4 ("Mehr erfahren" box) → Tasks 4 (baseline) + 5 (animation). ✓
- Spec §5 (hero motif) → Task 6. ✓
- Spec §6 (section spacing) → Task 7. ✓

**Placeholder scan:** The only deliberately deferred creative details are the exact SVG path geometry for five of seven icons (Task 2) and the motif polygons (Task 6) — these are visual-iteration work with a concrete worked example and explicit rules given, not vague "implement later". The seven `more:` copy strings are shown by example (2 of 7) with instruction to write all seven factually; the executor drafts the remaining five during the task and the user reviews. Acceptable for a design task; flagged so the executor knows to actually author them.

**Type/name consistency:** `.why-more` / `.why-more__toggle` / `.why-more__panel` used identically in Tasks 4 and 5. `.why-icon__accent` defined in Task 2 CSS and used in Task 2 markup. `.why-pillar-card__rivet` consistent in Task 3. `pricing.formula_competitor_label` / `formula_checkmk_label` added in Task 1 data and consumed in Task 1 markup. Explorer `data-*` attributes preserved verbatim so `pricing-explorer.js` keeps working.
