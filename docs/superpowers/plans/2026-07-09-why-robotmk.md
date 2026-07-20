# Why Robotmk Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Why Robotmk" homepage teaser section (pricing-fairness stat + 3 pillars) and a standalone bilingual `/why-robotmk/` page (full pricing comparison table + 7 pillars), cross-linked from the homepage's existing "solution" section and the main nav.

**Architecture:** Pure Hugo content/data/template/CSS work, no JS, no build tooling beyond Hugo itself. Follows this site's existing `bridge` / `bridge-teaser` pattern exactly: a short teaser lives inline in `layouts/index.html` driven by `data/{en,de}/home.yaml`, and the full page is a Hugo **section** (`content/why-robotmk/_index.{en,de}.md`) with its own list template (`layouts/why-robotmk/list.html`) and data file (`data/{en,de}/why-robotmk.yaml`), matching how `content/bridge/_index.{en,de}.md` + `layouts/bridge/list.html` already work.

**Tech Stack:** Hugo v0.124 (extended), no npm/build step — CSS is concatenated server-side via `resources.Concat` in `layouts/partials/head/css.html`. Verification is `hugo` build + `grep` on generated HTML in `public/` (this site has no automated test framework).

## Global Constraints

- Pricing figures are "verified facts" from the spec — copy them exactly, do not recompute or round differently: Dynatrace $6,307/yr (~€5,550) at 15-min, $18,921/yr (~€16,650) at 5-min; Datadog $2,102/yr (~€1,849) at 15-min, $6,307/yr (~€5,550) at 5-min; Checkmk €1,620/yr flat, 15 test cases, unlimited requests, arbitrary interval.
- Homepage teaser uses **relative comparison only** ("up to 10× more") — no dollar/euro figures on the homepage. The standalone page may show absolute figures, explicitly labeled as an illustrative example, not a live vendor quote.
- All new content must exist in both `en` and `de` — this site is fully bilingual, no exceptions.
- Reuse existing design tokens from `assets/css/tokens.css` (`--color-*`, `--text-*`, `--space-*`, `--font-*`). Do not introduce new hard-coded colors or hex values.
- Do not reuse `.page-hero` / `--color-border` / `--color-text-primary` / `--color-text-secondary` from `assets/css/sections/pages.css` — these variables are **not defined anywhere** in `tokens.css` (verified via `grep -rn` across `assets/css/`); that pattern is pre-existing stale CSS. Use the correct, defined tokens instead (`--color-surface-border`, `--color-on-surface`, `--color-on-surface-variant`), following the pattern used correctly in `assets/css/sections/homepage.css`.
- No new nav template code needed — `layouts/partials/nav.html` already renders `.Site.Menus.main` generically; adding a nav entry is a `hugo.yaml` data change only.
- Sharp corners everywhere (`--radius: 0px`), no box-shadows — matches every existing component.

---

### Task 1: Homepage data — `why` teaser block + solution CTA copy

**Files:**
- Modify: `data/en/home.yaml`
- Modify: `data/de/home.yaml`

**Interfaces:**
- Produces: `$home.why.eyebrow`, `$home.why.heading`, `$home.why.body`, `$home.why.stat_line`, `$home.why.pillars` (list of `{icon, label, text}`), `$home.why.cta` — consumed by Task 2's homepage template.
- Produces: `$home.solution.cta_why` — consumed by Task 2's solution-section CTA link.

- [ ] **Step 1: Verify the keys don't exist yet**

Run: `grep -n "^why:" data/en/home.yaml data/de/home.yaml`
Expected: no output (keys absent) — confirms we're not duplicating.

- [ ] **Step 2: Add `cta_why` to the `solution` block in `data/en/home.yaml`**

Find the `solution:` block's `flow_aria` line and add the new key directly after it:

```yaml
  flow_aria: "Flow: Robot Framework → Robotmk → Checkmk Synthetic Monitoring"
  cta_why: "Why Robotmk over the alternatives →"
```

- [ ] **Step 3: Add `cta_why` to the `solution` block in `data/de/home.yaml`**

```yaml
  flow_aria: "Flow: Robot Framework → Robotmk → Checkmk Synthetic Monitoring"
  cta_why: "Warum Robotmk statt der Alternativen →"
```

- [ ] **Step 4: Append the `why` block to `data/en/home.yaml`**

Add this new top-level section, placed after `solution:` and before `# ── Founder ──` (matching the section-comment style already used in this file):

```yaml
# ── Why Robotmk ───────────────────────────────────────────────────────────────
why:
  eyebrow: "Why Robotmk"
  heading: "Pay for what matters. Not for pretending to test more."
  body: "Some tools charge by network request, by check interval, by the minute. Checkmk Synthetic Monitoring charges for exactly one thing: the number of test cases you monitor. Test as often as you like, as thoroughly as you like — the price doesn't move."
  stat_line: "Action-based competitors can cost up to 10× more — and the gap grows every time you shorten the test interval."
  pillars:
    - icon: "🔓"
      label: "Open source"
      text: "Robot Framework, zero lock-in from day one."
    - icon: "🔗"
      label: "Deepest integration"
      text: "Built into Checkmk, not bolted on."
    - icon: "🧑‍💻"
      label: "No talent risk"
      text: "Readable, maintainable — and 40,000+ engineers already know it."
  cta: "See the full comparison →"
```

- [ ] **Step 5: Append the `why` block to `data/de/home.yaml`**

Same placement (after `solution:`, before `# ── Founder ──`):

```yaml
# ── Why Robotmk ───────────────────────────────────────────────────────────────
why:
  eyebrow: "Warum Robotmk"
  heading: "Zahl für das, was zählt. Nicht dafür, mehr zu testen vorzugaukeln."
  body: "Manche Tools berechnen pro Netzwerk-Request, pro Check-Intervall, pro Minute. Checkmk Synthetic Monitoring berechnet genau eine Sache: die Anzahl der überwachten Testfälle. Teste so oft du willst, so gründlich du willst — der Preis bleibt gleich."
  stat_line: "Aktionsbasierte Wettbewerber können bis zu 10× teurer sein — und der Abstand wächst mit jedem kürzeren Testintervall."
  pillars:
    - icon: "🔓"
      label: "Open Source"
      text: "Robot Framework — kein Vendor Lock-in von Anfang an."
    - icon: "🔗"
      label: "Tiefste Integration"
      text: "Nativ in Checkmk integriert, nicht angeflanscht."
    - icon: "🧑‍💻"
      label: "Kein Personalrisiko"
      text: "Lesbar, wartbar — und über 40.000 Engineers kennen es bereits."
  cta: "Zum vollständigen Vergleich →"
```

- [ ] **Step 6: Verify YAML parses via Hugo**

Run: `hugo --gc --destination /tmp/hugo-check-1 2>&1 | tail -20`
Expected: build succeeds (same `Pages | 96 | 93` summary as the untouched baseline, no `ERROR` lines). YAML syntax errors would show as a Hugo `ERROR` mentioning `home.yaml`.

Run: `rm -rf /tmp/hugo-check-1`

- [ ] **Step 7: Commit**

```bash
git add data/en/home.yaml data/de/home.yaml
git commit -m "Add Why Robotmk homepage teaser copy (en/de)"
```

---

### Task 2: Homepage template + CSS — teaser section and solution CTA link

**Files:**
- Modify: `layouts/index.html`
- Modify: `assets/css/sections/homepage.css`

**Interfaces:**
- Consumes: `$home.why.*` and `$home.solution.cta_why` from Task 1.
- Produces CSS classes `.why`, `.why__container`, `.why__eyebrow`, `.why__heading`, `.why__body`, `.why__stat-line`, `.why__pillars`, `.why__pillar`, `.why__pillar-icon`, `.why__pillar-label`, `.why__pillar-text`, `.loesung__cta` — used only within this task, no downstream consumers.

- [ ] **Step 1: Confirm current section order in `layouts/index.html`**

Run: `grep -n "^<section" layouts/index.html`
Expected: shows `hero`, `stats-bar`, `loesung`, `bridge-teaser`, `founder` in that order — confirms the insertion point (between `loesung` and `bridge-teaser`).

- [ ] **Step 2: Add the CTA link to the end of the `solution` (`loesung`) section**

In `layouts/index.html`, find this existing block (the flow diagram, immediately before the commented-out switcher):

```html
    <div class="loesung__flow">
      <img src="/images/rf_rmk_cmk-on_black.png"
           alt="{{ $home.solution.flow_aria }}"
           class="loesung__flow-img"
           loading="lazy">
    </div>
```

Add immediately after the closing `</div>` of `loesung__flow`:

```html
    <div class="loesung__cta">
      <a href="{{ "/why-robotmk/" | relLangURL }}" class="btn btn--ghost">{{ $home.solution.cta_why }}</a>
    </div>
```

- [ ] **Step 3: Add the new `why` teaser section**

Insert between the closing `</section>` of the `loesung` section and the opening `<section class="bridge-teaser section" ...>`:

```html
<section class="why section" id="why-robotmk-teaser" aria-label="{{ $home.why.eyebrow }}">
  <div class="why__container">
    <span class="why__eyebrow">{{ $home.why.eyebrow }}</span>
    <h2 class="why__heading">{{ $home.why.heading }}</h2>
    <p class="why__body">{{ $home.why.body }}</p>
    <p class="why__stat-line">{{ $home.why.stat_line }}</p>
    <ul class="why__pillars" role="list">
      {{- range $home.why.pillars }}
      <li class="why__pillar">
        <span class="why__pillar-icon" aria-hidden="true">{{ .icon }}</span>
        <span class="why__pillar-label">{{ .label }}</span>
        <span class="why__pillar-text">{{ .text }}</span>
      </li>
      {{- end }}
    </ul>
    <a href="{{ "/why-robotmk/" | relLangURL }}" class="btn btn--ghost">{{ $home.why.cta }}</a>
  </div>
</section>
```

- [ ] **Step 4: Add `.loesung__cta` CSS**

In `assets/css/sections/homepage.css`, find `.loesung__codespace-hint` (end of the Lösung section block, just before the `/* ====... Founder Section ...==== */` comment) and add directly after it:

```css
.loesung__cta {
  display: flex;
  justify-content: center;
  margin-top: var(--space-xl);
}
```

- [ ] **Step 5: Add `.why` teaser CSS**

Append to the end of `assets/css/sections/homepage.css` (after the existing `.bridge-teaser__body` rule, which is currently the last rule in the file):

```css

/* ============================================================
   Why Robotmk Teaser — Homepage Section
   ============================================================ */

.why {
  text-align: center;
  padding-block: var(--space-2xl);
}

.why__container {
  max-width: var(--content-width);
  margin-inline: auto;
  padding-inline: var(--space-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.why__eyebrow {
  font-size: var(--text-label-size);
  font-weight: var(--text-label-weight);
  letter-spacing: var(--text-label-letter-spacing);
  text-transform: uppercase;
  color: var(--color-primary);
}

.why__heading {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, var(--text-headline-lg-size));
  font-weight: var(--text-headline-lg-weight);
  letter-spacing: var(--text-headline-lg-letter-spacing);
  color: var(--color-on-surface);
  margin: 0;
}

.why__body {
  font-size: var(--text-body-lg-size);
  line-height: var(--text-body-lg-line-height);
  color: var(--color-on-surface-variant);
  max-width: 60ch;
  margin: 0;
}

.why__stat-line {
  font-size: var(--text-body-md-size);
  font-weight: 600;
  color: var(--color-primary);
  max-width: 60ch;
  margin: 0;
}

.why__pillars {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
  max-width: var(--content-width);
  margin: var(--space-md) 0 0;
  padding: 0;
  width: 100%;
}

.why__pillar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  text-align: center;
}

.why__pillar-icon {
  font-size: 1.5rem;
}

.why__pillar-label {
  font-weight: 600;
  color: var(--color-on-surface);
}

.why__pillar-text {
  font-size: var(--text-body-sm-size);
  color: var(--color-on-surface-variant);
  line-height: var(--text-body-sm-line-height);
}

@media (max-width: 768px) {
  .why__pillars {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Build and verify the teaser renders with expected content**

Run: `hugo --gc --destination /tmp/hugo-check-2 2>&1 | tail -20`
Expected: build succeeds, no `ERROR` lines (the `/why-robotmk/` links will 404 in this build since Task 4/5 haven't created that page yet — that's expected and fine, Hugo doesn't fail the build for internal links unless `--enableGitInfo`/strict linkchecking is configured, which it isn't here).

Run: `grep -o 'Pay for what matters[^<]*' /tmp/hugo-check-2/en/index.html`
Expected: `Pay for what matters. Not for pretending to test more.`

Run: `grep -o 'Zahl für das, was zählt[^<]*' /tmp/hugo-check-2/de/index.html`
Expected: `Zahl für das, was zählt. Nicht dafür, mehr zu testen vorzugaukeln.`

Run: `grep -c 'why__pillar"' /tmp/hugo-check-2/en/index.html`
Expected: `3`

Run: `rm -rf /tmp/hugo-check-2`

- [ ] **Step 7: Commit**

```bash
git add layouts/index.html assets/css/sections/homepage.css
git commit -m "Add Why Robotmk teaser section to homepage"
```

---

### Task 3: Standalone page content + data (en/de)

**Files:**
- Create: `content/why-robotmk/_index.en.md`
- Create: `content/why-robotmk/_index.de.md`
- Create: `data/en/why-robotmk.yaml`
- Create: `data/de/why-robotmk.yaml`

**Interfaces:**
- Produces: page front matter `.Title`, `.Params.Description` (consumed by `baseof.html`'s `<title>`/meta tags, no template changes needed there).
- Produces data keys `why-robotmk.hero.{title,subtitle}`, `why-robotmk.pricing.{heading,intro,formula_competitor,formula_checkmk,table.{caption,rows[].{label,dynatrace,datadog,checkmk}},source_note}`, `why-robotmk.pillars.{heading,items[].{icon,title,text}}`, `why-robotmk.cta.{text,button}` — consumed by Task 4's `layouts/why-robotmk/list.html`.

- [ ] **Step 1: Verify the section doesn't already exist**

Run: `ls content/why-robotmk 2>&1`
Expected: `ls: content/why-robotmk: No such file or directory`

- [ ] **Step 2: Create `content/why-robotmk/_index.en.md`**

```markdown
---
title: "Why Robotmk"
description: "See exactly why Checkmk Synthetic Monitoring's pricing, integration, and open-source foundation beat action-based competitors like Dynatrace and Datadog."
---
```

- [ ] **Step 3: Create `content/why-robotmk/_index.de.md`**

```markdown
---
title: "Warum Robotmk"
description: "Warum das Preismodell, die Integration und die Open-Source-Basis von Checkmk Synthetic Monitoring aktionsbasierten Wettbewerbern wie Dynatrace und Datadog überlegen sind."
---
```

- [ ] **Step 4: Create `data/en/why-robotmk.yaml`**

```yaml
hero:
  title: "Why Robotmk"
  subtitle: "Checkmk Synthetic Monitoring's price depends on exactly one variable: how many test cases you monitor. Interval and test complexity are free — always."

pricing:
  heading: "One formula vs. one formula"
  intro: "Action/request-based competitors price as a product of multiple compounding variables. Change any one of them, and the bill moves — often non-linearly. Checkmk prices on test cases only."
  formula_competitor: "interval × tests × requests/test × rate"
  formula_checkmk: "tests × rate"
  table:
    caption: "Example calculation — 15-minute interval, 5 test cases, 8 requests/test (1,401,600 actions/year). Illustrative example, not a live vendor quote."
    rows:
      - label: "Interval"
        dynatrace: "15 min"
        datadog: "15 min"
        checkmk: "arbitrary"
      - label: "Test cases"
        dynatrace: "5"
        datadog: "5"
        checkmk: "15"
      - label: "Billed by"
        dynatrace: "actions (network requests)"
        datadog: "full test runs"
        checkmk: "test cases only"
      - label: "Requests / test"
        dynatrace: "8"
        datadog: "8"
        checkmk: "unlimited"
      - label: "Rate"
        dynatrace: "$4.50 / 1,000 actions"
        datadog: "$12 / 1,000 full test runs"
        checkmk: "flat"
      - label: "Cost / year (15-min interval)"
        dynatrace: "$6,307 (~€5,550)"
        datadog: "$2,102 (~€1,849)"
        checkmk: "€1,620"
      - label: "Cost / year (5-min interval)"
        dynatrace: "$18,921 (~€16,650)"
        datadog: "$6,307 (~€5,550)"
        checkmk: "€1,620 (unchanged)"
  source_note: "Source: publicly listed Dynatrace and Datadog synthetic monitoring pricing, calculated for the scenario above. Checkmk figure: 15 test cases, unlimited requests/test length, arbitrary interval."

pillars:
  heading: "Seven reasons it holds up beyond price"
  items:
    - icon: "🔓"
      title: "Open source"
      text: "Robot Framework and Robotmk are both open source. Nothing closed-box to trust blindly — you can read it, audit it, extend it."
    - icon: "🚪"
      title: "No vendor trap"
      text: "Your tests are standard Robot Framework — portable, not hostage to one vendor's proprietary format."
    - icon: "🔗"
      title: "Deepest integration into Checkmk"
      text: "Robotmk is a native Checkmk plugin, not a bolted-on integration held together by an API and a prayer."
    - icon: "🧩"
      title: "One framework for every technology"
      text: "Web, desktop, API, SAP, Citrix, mobile — Robot Framework tests it all, so your team isn't juggling five tools for five technologies."
    - icon: "🌉"
      title: "The Robotmk Bridge"
      text: "Already invested in JUnit, pytest, Gatling, or ZAP? The Bridge brings those results into Checkmk too — no rewrite required."
    - icon: "🗣️"
      title: "The lingua franca of test automation"
      text: "Robot Framework has 40,000+ users worldwide. It's not a niche bet — it's the common language test automation engineers already speak."
    - icon: "🛡️"
      title: "No talent risk"
      text: "Robot Framework is readable, maintainable, and widely taught. You won't struggle to hire for it, or to hand it off."

cta:
  text: "Ready to see it running in your environment?"
  button: "Book a Clarity Call →"
```

- [ ] **Step 5: Create `data/de/why-robotmk.yaml`**

```yaml
hero:
  title: "Warum Robotmk"
  subtitle: "Der Preis von Checkmk Synthetic Monitoring hängt von genau einer Variable ab: der Anzahl überwachter Testfälle. Intervall und Testkomplexität sind immer kostenlos."

pricing:
  heading: "Eine Formel gegen eine Formel"
  intro: "Aktionsbasierte Wettbewerber berechnen den Preis als Produkt mehrerer sich verstärkender Variablen. Ändert sich eine davon, bewegt sich die Rechnung — oft nicht-linear. Checkmk berechnet nur nach Testfällen."
  formula_competitor: "Intervall × Tests × Requests/Test × Rate"
  formula_checkmk: "Tests × Rate"
  table:
    caption: "Beispielrechnung — 15-Minuten-Intervall, 5 Testfälle, 8 Requests/Test (1.401.600 Aktionen/Jahr). Illustratives Beispiel, kein aktuelles Angebot der Hersteller."
    rows:
      - label: "Intervall"
        dynatrace: "15 Min"
        datadog: "15 Min"
        checkmk: "beliebig"
      - label: "Testfälle"
        dynatrace: "5"
        datadog: "5"
        checkmk: "15"
      - label: "Abgerechnet nach"
        dynatrace: "Aktionen (Netzwerk-Requests)"
        datadog: "vollständigen Testläufen"
        checkmk: "nur Testfällen"
      - label: "Requests / Test"
        dynatrace: "8"
        datadog: "8"
        checkmk: "unbegrenzt"
      - label: "Rate"
        dynatrace: "$4,50 / 1.000 Aktionen"
        datadog: "$12 / 1.000 Testläufe"
        checkmk: "pauschal"
      - label: "Kosten / Jahr (15-Min-Intervall)"
        dynatrace: "$6.307 (~5.550 €)"
        datadog: "$2.102 (~1.849 €)"
        checkmk: "1.620 €"
      - label: "Kosten / Jahr (5-Min-Intervall)"
        dynatrace: "$18.921 (~16.650 €)"
        datadog: "$6.307 (~5.550 €)"
        checkmk: "1.620 € (unverändert)"
  source_note: "Quelle: öffentlich gelistete Preise von Dynatrace und Datadog für Synthetic Monitoring, berechnet für das obige Szenario. Checkmk-Wert: 15 Testfälle, unbegrenzte Request-Anzahl/Testlänge, beliebiges Intervall."

pillars:
  heading: "Sieben Gründe, die über den Preis hinausgehen"
  items:
    - icon: "🔓"
      title: "Open Source"
      text: "Robot Framework und Robotmk sind beide Open Source. Keine Blackbox, der du blind vertrauen musst — du kannst sie lesen, prüfen, erweitern."
    - icon: "🚪"
      title: "Kein Vendor Lock-in"
      text: "Deine Tests sind Standard-Robot-Framework — portabel, nicht gefangen im proprietären Format eines Herstellers."
    - icon: "🔗"
      title: "Tiefste Integration in Checkmk"
      text: "Robotmk ist ein natives Checkmk-Plugin, keine angeflanschte Integration, die nur von einer API zusammengehalten wird."
    - icon: "🧩"
      title: "Ein Framework für jede Technologie"
      text: "Web, Desktop, API, SAP, Citrix, Mobile — Robot Framework testet alles, damit dein Team nicht fünf Tools für fünf Technologien jonglieren muss."
    - icon: "🌉"
      title: "Die Robotmk Bridge"
      text: "Schon in JUnit, pytest, Gatling oder ZAP investiert? Die Bridge bringt auch diese Ergebnisse nach Checkmk — ganz ohne Neuschreiben."
    - icon: "🗣️"
      title: "Die Lingua Franca der Testautomatisierung"
      text: "Robot Framework hat über 40.000 Nutzer weltweit. Keine Nischenwette — die gemeinsame Sprache, die Testautomatisierungs-Engineers bereits sprechen."
    - icon: "🛡️"
      title: "Kein Personalrisiko"
      text: "Robot Framework ist lesbar, wartbar und weit verbreitet gelehrt. Du wirst weder Schwierigkeiten haben, dafür einzustellen, noch es zu übergeben."

cta:
  text: "Bereit, es in deiner Umgebung laufen zu sehen?"
  button: "Clarity Call buchen →"
```

- [ ] **Step 6: Verify YAML parses (page will 404 until Task 4 adds the template, but data-file syntax is checkable now)**

Run: `hugo --gc --destination /tmp/hugo-check-3 2>&1 | tail -20`
Expected: build succeeds, no `ERROR` lines mentioning `why-robotmk.yaml`.

Run: `rm -rf /tmp/hugo-check-3`

- [ ] **Step 7: Commit**

```bash
git add content/why-robotmk data/en/why-robotmk.yaml data/de/why-robotmk.yaml
git commit -m "Add Why Robotmk standalone page content and data (en/de)"
```

---

### Task 4: Standalone page layout template + CSS

**Files:**
- Create: `layouts/why-robotmk/list.html`
- Create: `assets/css/sections/why-robotmk.css`
- Modify: `layouts/partials/head/css.html`

**Interfaces:**
- Consumes: all `why-robotmk.*` data keys produced by Task 3.
- Produces CSS classes `.why-hero`, `.why-hero__title`, `.why-hero__subtitle`, `.why-pricing__heading`, `.why-pricing__intro`, `.why-pricing__formulas`, `.why-pricing__formula`, `.why-pricing__formula--checkmk`, `.why-pricing__formula-label`, `.why-pricing__formula-expr`, `.why-pricing__table-wrapper`, `.why-pricing__table`, `.why-pricing__table-checkmk`, `.why-pricing__source`, `.why-pillars__heading`, `.why-pillars__grid`, `.why-pillar-card__icon`, `.why-pillar-card__title`, `.why-pillar-card__text`, `.why-cta__container`, `.why-cta__text` — no downstream consumers.

- [ ] **Step 1: Confirm Hugo's layout lookup for a data-driven section (reference: how `/bridge/` resolves)**

Run: `cat layouts/bridge/list.html | head -5`
Expected: starts with `{{ define "title" }}...{{ end }}` then `{{ define "main" }}` — confirms the template shape to follow. `content/why-robotmk/_index.{en,de}.md` (created in Task 3) plus `layouts/why-robotmk/list.html` (this task) is exactly this same pairing, so no `type:` front matter override is needed — Hugo resolves the section name (`why-robotmk`) to the layout directory automatically.

- [ ] **Step 2: Create `layouts/why-robotmk/list.html`**

```html
{{ define "title" }}{{ .Title }} — {{ .Site.Title }}{{ end }}

{{ define "main" }}
{{- $why := index .Site.Data .Site.Language.Lang "why-robotmk" -}}

<section class="why-hero section">
  <div class="container">
    <h1 class="why-hero__title">{{ $why.hero.title }}</h1>
    <p class="why-hero__subtitle">{{ $why.hero.subtitle }}</p>
  </div>
</section>

<section class="why-pricing section section--surface">
  <div class="container">
    <h2 class="why-pricing__heading">{{ $why.pricing.heading }}</h2>
    <p class="why-pricing__intro">{{ $why.pricing.intro }}</p>

    <div class="why-pricing__formulas">
      <div class="why-pricing__formula">
        <span class="why-pricing__formula-label">Dynatrace / Datadog</span>
        <code class="why-pricing__formula-expr">{{ $why.pricing.formula_competitor }}</code>
      </div>
      <div class="why-pricing__formula why-pricing__formula--checkmk">
        <span class="why-pricing__formula-label">Checkmk</span>
        <code class="why-pricing__formula-expr">{{ $why.pricing.formula_checkmk }}</code>
      </div>
    </div>

    <div class="why-pricing__table-wrapper">
      <table class="why-pricing__table">
        <caption>{{ $why.pricing.table.caption }}</caption>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Dynatrace</th>
            <th scope="col">Datadog</th>
            <th scope="col">Checkmk Synthetic Monitoring</th>
          </tr>
        </thead>
        <tbody>
          {{- range $why.pricing.table.rows }}
          <tr>
            <th scope="row">{{ .label }}</th>
            <td>{{ .dynatrace }}</td>
            <td>{{ .datadog }}</td>
            <td class="why-pricing__table-checkmk">{{ .checkmk }}</td>
          </tr>
          {{- end }}
        </tbody>
      </table>
    </div>
    <p class="why-pricing__source">{{ $why.pricing.source_note }}</p>
  </div>
</section>

<section class="why-pillars section">
  <div class="container">
    <h2 class="why-pillars__heading">{{ $why.pillars.heading }}</h2>
    <div class="why-pillars__grid">
      {{- range $why.pillars.items }}
      <div class="card why-pillar-card">
        <div class="why-pillar-card__icon" aria-hidden="true">{{ .icon }}</div>
        <h3 class="why-pillar-card__title">{{ .title }}</h3>
        <p class="why-pillar-card__text">{{ .text }}</p>
      </div>
      {{- end }}
    </div>
  </div>
</section>

<section class="why-cta section section--surface">
  <div class="container why-cta__container">
    <h2 class="why-cta__text">{{ $why.cta.text }}</h2>
    <a href="{{ "/services/" | relLangURL }}" class="btn btn--primary">{{ $why.cta.button }}</a>
  </div>
</section>

{{ end }}
```

- [ ] **Step 3: Create `assets/css/sections/why-robotmk.css`**

```css
/* ============================================================
   Why Robotmk — Standalone Page
   ============================================================ */

.why-hero {
  text-align: center;
}

.why-hero__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, var(--text-display-size));
  font-weight: var(--text-display-weight);
  letter-spacing: var(--text-display-letter-spacing);
  color: var(--color-on-surface);
  margin: 0 0 var(--space-md);
}

.why-hero__subtitle {
  font-size: var(--text-body-lg-size);
  line-height: var(--text-body-lg-line-height);
  color: var(--color-on-surface-variant);
  max-width: 60ch;
  margin-inline: auto;
}

.why-pricing__heading,
.why-pillars__heading {
  text-align: center;
  font-family: var(--font-display);
  font-size: var(--text-headline-lg-size);
  font-weight: var(--text-headline-lg-weight);
  margin-bottom: var(--space-md);
}

.why-pricing__intro {
  text-align: center;
  max-width: 70ch;
  margin: 0 auto var(--space-xl);
  color: var(--color-on-surface-variant);
  line-height: var(--text-body-md-line-height);
}

.why-pricing__formulas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
}

.why-pricing__formula {
  border: 1px solid var(--color-surface-border);
  padding: var(--space-md) var(--space-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.why-pricing__formula--checkmk {
  border-color: var(--color-primary);
}

.why-pricing__formula-label {
  font-size: var(--text-label-size);
  font-weight: var(--text-label-weight);
  letter-spacing: var(--text-label-letter-spacing);
  text-transform: uppercase;
  color: var(--color-on-surface-variant);
}

.why-pricing__formula-expr {
  font-family: var(--font-code);
  font-size: var(--text-code-size);
  color: var(--color-on-surface);
}

.why-pricing__formula--checkmk .why-pricing__formula-expr {
  color: var(--color-primary);
}

.why-pricing__table-wrapper {
  overflow-x: auto;
  margin-bottom: var(--space-md);
}

.why-pricing__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
}

.why-pricing__table caption {
  caption-side: top;
  text-align: left;
  font-size: var(--text-body-sm-size);
  color: var(--color-on-surface-muted);
  margin-bottom: var(--space-sm);
}

.why-pricing__table th,
.why-pricing__table td {
  border: 1px solid var(--color-surface-border);
  padding: var(--space-sm) var(--space-md);
  text-align: left;
  font-size: var(--text-body-sm-size);
}

.why-pricing__table thead th {
  font-family: var(--font-display);
  color: var(--color-on-surface);
}

.why-pricing__table-checkmk {
  color: var(--color-primary);
  font-weight: 600;
}

.why-pricing__source {
  font-size: var(--text-body-sm-size);
  color: var(--color-on-surface-muted);
}

.why-pillars__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

.why-pillar-card__icon {
  font-size: 1.75rem;
  margin-bottom: var(--space-sm);
}

.why-pillar-card__title {
  font-family: var(--font-display);
  font-size: var(--text-headline-sm-size);
  font-weight: 600;
  margin: 0 0 var(--space-xs);
}

.why-pillar-card__text {
  font-size: var(--text-body-sm-size);
  color: var(--color-on-surface-variant);
  line-height: var(--text-body-sm-line-height);
  margin: 0;
}

.why-cta__container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}

.why-cta__text {
  font-family: var(--font-display);
  font-size: var(--text-headline-md-size);
  font-weight: var(--text-headline-md-weight);
  margin: 0;
}

@media (max-width: 768px) {
  .why-pillars__grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Register the new CSS file in the concat pipeline**

In `layouts/partials/head/css.html`, the file currently reads:

```html
{{- $tokens   := resources.Get "css/tokens.css" -}}
{{- $reset    := resources.Get "css/reset.css" -}}
{{- $base     := resources.Get "css/base.css" -}}
{{- $buttons  := resources.Get "css/components/buttons.css" -}}
{{- $cards    := resources.Get "css/components/cards.css" -}}
{{- $badges   := resources.Get "css/components/badges.css" -}}
{{- $forms    := resources.Get "css/components/forms.css" -}}
{{- $nav      := resources.Get "css/components/nav.css" -}}
{{- $toolsticker := resources.Get "css/components/tools-ticker.css" -}}
{{- $hero     := resources.Get "css/sections/hero.css" -}}
{{- $homepage := resources.Get "css/sections/homepage.css" -}}
{{- $pages    := resources.Get "css/sections/pages.css" -}}
{{- $blog     := resources.Get "css/sections/blog.css" -}}
{{- $css := slice $tokens $reset $base $buttons $cards $badges $forms $nav $toolsticker $hero $homepage $pages $blog
    | resources.Concat "css/main.css"
    | fingerprint -}}
<link rel="stylesheet" href="{{ $css.RelPermalink }}" integrity="{{ $css.Data.Integrity }}">
```

Replace it with (adds `$whyRobotmk` fetch and inserts it into the `slice`, right after `$pages`):

```html
{{- $tokens   := resources.Get "css/tokens.css" -}}
{{- $reset    := resources.Get "css/reset.css" -}}
{{- $base     := resources.Get "css/base.css" -}}
{{- $buttons  := resources.Get "css/components/buttons.css" -}}
{{- $cards    := resources.Get "css/components/cards.css" -}}
{{- $badges   := resources.Get "css/components/badges.css" -}}
{{- $forms    := resources.Get "css/components/forms.css" -}}
{{- $nav      := resources.Get "css/components/nav.css" -}}
{{- $toolsticker := resources.Get "css/components/tools-ticker.css" -}}
{{- $hero     := resources.Get "css/sections/hero.css" -}}
{{- $homepage := resources.Get "css/sections/homepage.css" -}}
{{- $pages    := resources.Get "css/sections/pages.css" -}}
{{- $whyRobotmk := resources.Get "css/sections/why-robotmk.css" -}}
{{- $blog     := resources.Get "css/sections/blog.css" -}}
{{- $css := slice $tokens $reset $base $buttons $cards $badges $forms $nav $toolsticker $hero $homepage $pages $whyRobotmk $blog
    | resources.Concat "css/main.css"
    | fingerprint -}}
<link rel="stylesheet" href="{{ $css.RelPermalink }}" integrity="{{ $css.Data.Integrity }}">
```

- [ ] **Step 5: Build and verify the standalone page renders with expected content**

Run: `hugo --gc --destination /tmp/hugo-check-4 2>&1 | tail -20`
Expected: build succeeds, no `ERROR` lines, and the page count increases by 1 per language versus the Task 1 baseline (96→97 EN, 93→94 DE) since `content/why-robotmk/_index.*.md` now resolves to a real page.

Run: `ls /tmp/hugo-check-4/en/why-robotmk/index.html /tmp/hugo-check-4/de/why-robotmk/index.html`
Expected: both files exist.

Run: `grep -o 'One formula vs. one formula' /tmp/hugo-check-4/en/why-robotmk/index.html`
Expected: `One formula vs. one formula`

Run: `grep -c '<tr>' /tmp/hugo-check-4/en/why-robotmk/index.html`
Expected: `8` (1 header row + 7 data rows)

Run: `grep -o '€1,620' /tmp/hugo-check-4/en/why-robotmk/index.html`
Expected: `€1,620` appears (at least once)

Run: `grep -c 'why-pillar-card' /tmp/hugo-check-4/en/why-robotmk/index.html`
Expected: at least `7` (one per pillar)

Run: `grep -o 'why-robotmk[^"]*\.css' /tmp/hugo-check-4/en/index.html`
Expected: no direct match (CSS is concatenated into `main.css`, not linked by filename) — instead verify the concat succeeded:

Run: `grep -l 'why-hero__title' /tmp/hugo-check-4/en/css/main.*.css`
Expected: the fingerprinted `main.*.css` file path is printed (confirms `why-robotmk.css` rules made it into the bundle).

Run: `rm -rf /tmp/hugo-check-4`

- [ ] **Step 6: Commit**

```bash
git add layouts/why-robotmk assets/css/sections/why-robotmk.css layouts/partials/head/css.html
git commit -m "Add Why Robotmk standalone page template and styles"
```

---

### Task 5: Nav entry

**Files:**
- Modify: `hugo.yaml`

**Interfaces:**
- Consumes: nothing new — `layouts/partials/nav.html` already ranges over `.Site.Menus.main` generically (verified: no template change needed).
- Produces: two new menu entries, `en` and `de`, resolved by Hugo into `.Site.Menus.main`.

- [ ] **Step 1: Confirm current menu weights**

Run: `grep -n "weight:\|name:\|url:" hugo.yaml | sed -n '1,30p'`
Expected: shows `Home` (weight 1), `Robotmk Bridge ✨` (weight 2), `Services` (weight 3), `Blog` (weight 4) for both `en` and `de` menus.

- [ ] **Step 2: Insert "Why Robotmk" at weight 3 and bump Services/Blog in the `en` menu**

In `hugo.yaml`, under `languages.en.menu.main`, change:

```yaml
        - name: "Robotmk Bridge ✨"
          url: "/en/bridge/"
          weight: 2
        - name: "Services"
          url: "/en/services/"
          weight: 3
        - name: "Blog"
          url: "/en/blog/"
          weight: 4
```

to:

```yaml
        - name: "Robotmk Bridge ✨"
          url: "/en/bridge/"
          weight: 2
        - name: "Why Robotmk"
          url: "/en/why-robotmk/"
          weight: 3
        - name: "Services"
          url: "/en/services/"
          weight: 4
        - name: "Blog"
          url: "/en/blog/"
          weight: 5
```

- [ ] **Step 3: Insert "Warum Robotmk" at weight 3 and bump Services/Blog in the `de` menu**

Under `languages.de.menu.main`, change:

```yaml
        - name: "Robotmk Bridge ✨"
          url: "/de/bridge/"
          weight: 2
        - name: "Services"
          url: "/de/services/"
          weight: 3
        - name: "Blog"
          url: "/de/blog/"
          weight: 4
```

to:

```yaml
        - name: "Robotmk Bridge ✨"
          url: "/de/bridge/"
          weight: 2
        - name: "Warum Robotmk"
          url: "/de/why-robotmk/"
          weight: 3
        - name: "Services"
          url: "/de/services/"
          weight: 4
        - name: "Blog"
          url: "/de/blog/"
          weight: 5
```

- [ ] **Step 4: Build and verify the nav renders the new entry in the right position**

Run: `hugo --gc --destination /tmp/hugo-check-5 2>&1 | tail -20`
Expected: build succeeds, no `ERROR` lines.

Run: `grep -o 'nav__link[^>]*>[^<]*</a>' /tmp/hugo-check-5/en/index.html`
Expected: five links in order — `Home`, `Robotmk Bridge ✨`, `Why Robotmk`, `Services`, `Blog`.

Run: `grep -o 'nav__link[^>]*>[^<]*</a>' /tmp/hugo-check-5/de/index.html`
Expected: five links in order — `Home`, `Robotmk Bridge ✨`, `Warum Robotmk`, `Services`, `Blog`.

Run: `rm -rf /tmp/hugo-check-5`

- [ ] **Step 5: Commit**

```bash
git add hugo.yaml
git commit -m "Add Why Robotmk to main navigation"
```

---

### Task 6: Full-site verification (visual + link check)

**Files:** none (verification only)

- [ ] **Step 1: Full production-flag build across both languages**

Run: `hugo --gc --minify --destination /tmp/hugo-final-check 2>&1 | tail -20`
Expected: build succeeds, no `ERROR` or `WARN` lines beyond the pre-existing `author key` deprecation warning noted in this plan's baseline check.

- [ ] **Step 2: Confirm every new/changed internal link target actually exists as a file**

Run:
```bash
test -f /tmp/hugo-final-check/en/why-robotmk/index.html && echo "EN why-robotmk OK"
test -f /tmp/hugo-final-check/de/why-robotmk/index.html && echo "DE why-robotmk OK"
```
Expected: both `OK` lines print.

Run: `rm -rf /tmp/hugo-final-check`

- [ ] **Step 3: Manual visual check in the browser**

Use the `run` skill (or `hugo server` directly) to start the local dev server, then check in-browser for both `/en/` and `/de/`:
- Homepage: the new "Why Robotmk" / "Warum Robotmk" section appears between the solution section and the Bridge teaser, with the 3-pillar row and stat line visible; the solution section's new CTA link works.
- Narrow viewport (~375px): the 3-pillar grid stacks to 1 column, no horizontal overflow.
- `/why-robotmk/` (both languages): pricing table is readable; on narrow viewport it scrolls horizontally inside its own wrapper rather than breaking the page layout; all 7 pillar cards render; the bottom CTA links to `/services/`.
- Top nav: "Why Robotmk" / "Warum Robotmk" appears between Bridge and Services, both desktop nav and the mobile hamburger overlay.

Report back with a short pass/fail per checkpoint above; fix any visual issues found before considering the task complete.

- [ ] **Step 4: Final commit if Step 3 required fixes**

If Step 3 required any code changes, stage and commit them with a message describing the specific visual fix (e.g. `git commit -m "Fix Why Robotmk pillar grid overflow on narrow viewports"`). If no fixes were needed, skip this step — nothing to commit.
