# Why Robotmk — Design Spec

Date: 2026-07-09
Branch: why-robotmk

## Goal

Give the homepage a clear, differentiated answer to "why choose Robotmk over
alternatives" — anchored on the strongest, most concrete argument available
(pricing fairness), backed by a standalone page with the full case.

Two visitor personas already established for this site apply here too:
Checkmk admins discovering Robot Framework, and Robot Framework users
discovering Checkmk/Robotmk. Both should find the pricing argument and the
pillar list persuasive regardless of which side they're coming from.

## Verified facts (do not deviate)

Source: `why-robotmk.md` (briefing) + user-supplied pricing comparison image.

1. Checkmk Synthetic Monitoring price depends on **one variable only**: the
   number of monitored test cases. Interval and test length/complexity
   (steps/requests per test) have zero impact on price.
2. Action/request-based competitors (Dynatrace, Datadog) price as a function
   of multiple compounding variables. Do not claim *all* competitors work
   this way — frame the contrast specifically around the
   action/request-consumption pricing model.
3. Worked comparison (15-min interval, 5 test cases, 8 requests/test =
   1,401,600 actions/year unless noted otherwise):

   | | Dynatrace | Datadog | Checkmk Synthetic Monitoring |
   |---|---|---|---|
   | Interval | 15 min | 15 min | arbitrary |
   | Test cases | 5 | 5 | **15** |
   | Billed by | actions (network requests) | full test runs | test cases only |
   | Requests/test | 8 (unlimited on Checkmk) | 8 (unlimited on Checkmk) | unlimited |
   | Rate | $4.50 / 1k actions | $12 / 1k full test runs | flat |
   | Cost/year (15-min) | $6,307 (~€5,550) | $2,102.40 (~€1,849) | **€1,620** |
   | Cost/year (5-min interval) | $18,921 (~€16,650) | $6,307 (~€5,550) | **€1,620 (unchanged)** |

4. Derived relative multiples (for the homepage teaser, which uses relative
   framing only — no euro figures):
   - At 15-min interval: Dynatrace ≈ **3.4×** more expensive than Checkmk;
     Datadog ≈ **1.1×** (not a strong headline number on its own).
   - At 5-min interval: Dynatrace ≈ **10.3×** more expensive; Datadog ≈
     **3.4×** more expensive.
   - Headline claim to use: **"up to 10x more"**, paired with framing that
     the gap grows as interval shortens (this is the honest, defensible
     version — it reframes the mechanism rather than cherry-picking a single
     multiple).
5. The full page may show absolute figures (both currencies, labeled as an
   illustrative/example calculation, not a live vendor quote). The homepage
   teaser shows **relative comparison only** — no dollar/euro figures.

## Architecture

Two new content surfaces, cross-linked, following the site's existing
`bridge` / `bridge-teaser` pattern (short homepage teaser → full standalone
page):

1. **Homepage teaser section** (`why`) — inserted in `layouts/index.html`
   between the existing `solution` section and `bridge-teaser` section.
   Data in `data/en/home.yaml` and `data/de/home.yaml` under a new `why:`
   key, structured like the existing `bridge_teaser:` key.
2. **Standalone page** `/why-robotmk/` (same slug both languages, per the
   `/bridge/` precedent) — implemented as a Hugo *section*, exactly
   matching how `/bridge/` resolves: `content/why-robotmk/_index.en.md` +
   `content/why-robotmk/_index.de.md`, dedicated layout
   `layouts/why-robotmk/list.html` (can't reuse `_default/single.html`,
   which is prose-only — this page needs a data-driven pricing table +
   pillar grid). Content data in new `data/en/why-robotmk.yaml` /
   `data/de/why-robotmk.yaml`, following the `data/en/services.yaml`
   pattern (structured YAML, not markdown body).
3. **Cross-link from `solution` section**: one additional CTA link in the
   existing `solution` section (`layouts/index.html`) pointing to
   `/why-robotmk/`.
4. **Nav entry**: add "Why Robotmk" to `hugo.yaml` main menu, both
   languages, alongside Home / Robotmk Bridge / Services / Blog, at weight 3
   (between Bridge and Services): Home(1) → Bridge(2) → Why Robotmk(3) →
   Services(4) → Blog(5).
5. **New CSS**: `assets/css/sections/why-robotmk.css` (or added to
   `sections/homepage.css` for the teaser + `sections/pages.css` for the
   standalone page). No existing pricing/comparison table component exists
   to reuse — the `.pricing-table__*` classes found in `assets/css/home.css`
   belong to a large legacy/vendor stylesheet unrelated to the current
   design system and must not be reused or extended.

## Homepage teaser section (`why`)

Structure mirrors `bridge_teaser` (eyebrow / heading / body / CTA), plus a
relative-comparison stat line and 3 pillars:

- **Eyebrow**: "Why Robotmk"
- **Heading**: "Pay for what matters. Not for pretending to test more."
- **Body**: explains the one-variable pricing model (test cases only;
  interval and complexity are free).
- **Stat line**: relative-only claim — "Action-based competitors can cost up
  to 10x more — and the gap grows every time you shorten the test interval."
  No absolute currency figures here (see Verified Facts §5).
- **3 pillars** (one line each, icon + short phrase — the 3 most
  differentiated points not already covered by the `solution` or
  `bridge-teaser` sections elsewhere on the same page):
  1. Open source — Robot Framework, zero lock-in from day one.
  2. Deepest integration — built into Checkmk, not bolted on.
  3. No talent risk — Robot Framework is readable, maintainable, and
     40,000+ engineers already know it.
- **CTA**: "See the full comparison →" → `/why-robotmk/`

Pillars deliberately exclude: community size / 40k+ users (already in
`solution`), technology-agnostic (already in `solution`), Bridge / other
frameworks (has its own dedicated `bridge-teaser` section immediately
below), no vendor lock-in as a standalone point (folded into "open source"
here to avoid restating `solution`'s "no vendor lock-in" bullet).

## Standalone page `/why-robotmk/`

Full case, no restrictions on restating points already touched elsewhere on
the homepage (a visitor landing directly on this page hasn't necessarily
seen the homepage).

1. **Intro** — expands the teaser's core claim: price is a function of test
   case count only; interval and test complexity are free variables.
2. **Full pricing comparison table** — reproduces the Verified Facts §3
   table (Dynatrace, Datadog, Checkmk columns; interval, test cases, billed
   by, requests/test, rate, cost/year at baseline and at 5-min interval).
   Table must scroll horizontally on narrow viewports rather than break
   layout (no existing responsive table pattern in this codebase — needs a
   `overflow-x: auto` wrapper, consistent with the artifact/mobile
   guidelines already used elsewhere in this project's practices).
3. **Formula callout** — `tests × rate` (Checkmk) vs. `interval × tests ×
   requests/test × rate` (action-based), labeled explicitly as an
   illustrative example, not a live/current vendor quote.
4. **7 pillars**, each a short paragraph (copy to be written during
   implementation, following the `blog_tone` skill conventions and this
   site's existing tone of voice):
   1. Open source — Robot Framework + Robotmk, nothing closed-box.
   2. No vendor trap — standard, portable tooling.
   3. Deepest integration into Checkmk — native plugin, not bolted on via
      API.
   4. One framework for every technology — web, desktop, API, SAP, Citrix,
      mobile.
   5. Robotmk Bridge — bring JUnit, pytest, Gatling, ZAP results in without
      rewriting anything.
   6. Lingua franca of test automation — Robot Framework, 40,000+ users
      worldwide.
   7. No talent risk — extendable, maintainable, readable; no hiring/
      onboarding risk.

Copy for the table's exact wording and all 7 pillar paragraphs is written
during implementation, not in this spec — the facts, structure, and tone
direction above are the binding constraints.

## i18n

Both `en` and `de` variants required for all new content (home.yaml `why:`
block, why-robotmk.yaml, why-robotmk content file, nav entry) — matching
the site's existing fully-bilingual convention. Currency figures on the
full page should show both $ and € as in the source material.

## Files touched (implementation reference, not exhaustive)

- `layouts/index.html` — add `why` section, add CTA link in `solution`
  section
- `data/en/home.yaml`, `data/de/home.yaml` — add `why:` key
- `content/why-robotmk.en.md`, `content/why-robotmk.de.md` — new
- `data/en/why-robotmk.yaml`, `data/de/why-robotmk.yaml` — new
- `layouts/why-robotmk/single.html` — new
- `assets/css/sections/why-robotmk.css` (or extend `homepage.css` /
  `pages.css`) — new/modified
- `hugo.yaml` — add nav entry, both language menus

## Testing / verification

- Visual check via local Hugo dev server for both `en` and `de`, desktop
  and narrow-viewport widths (per the `run` skill), confirming: homepage
  teaser renders in correct position, pricing table scrolls horizontally
  rather than overflowing on mobile, all links resolve (`solution` → why
  page, teaser CTA → why page, nav entry → why page).
- No automated tests exist for this static-content site; verification is
  visual + link-check.
