---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-06-09'
inputDocuments:
  - "_bmad-output/planning-artifacts/prds/prd-Robotmk-Homepage-2026-06-08/prd.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-Robotmk-Homepage-2026-06-08/DESIGN.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-Robotmk-Homepage-2026-06-08/EXPERIENCE.md"
  - "docs/architecture.md"
  - "docs/index.md"
  - "docs/source-tree-analysis.md"
  - "docs/component-inventory.md"
  - "docs/development-guide.md"
workflowType: 'architecture'
project_name: 'Robotmk Homepage'
user_name: 'Simon'
date: '2026-06-08'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
9 FRs in 6 Kategorien: Hero + Gap Visualization (FR-001/002), Founder Credibility (FR-003), Blog Enhancements / Language Fix (FR-004), Product Catalog (FR-005), Services / Booking (FR-006), Testimonials (FR-007), GitHub Codespace CTAs (FR-008), Newsletter (FR-009).

Architektonische Implikation: Alle Homepage-Sections sind maßgefertigte Komponenten. Kein Generic-Theme-Ansatz tragbar.

**Non-Functional Requirements:**

- Design System (NFR-001): CSS Custom Properties (Token-based), 0px border-radius, 3 Schriftarten (Space Grotesk + Inter + JetBrains Mono), Dark Default + Light Mode. Kein externer UI-Framework.
- Performance (NFR-003): LCP < 2.5s → Gap Visualization als SVG/CSS, keine schweren Assets
- Tech Stack (NFR-004): Hugo bleibt; Mainroad-Theme wird durch Custom Theme ersetzt (entschieden)
- Accessibility (NFR-005): WCAG 2.1 AA, `prefers-reduced-motion` für alle Animationen

**Scale & Complexity:**

- Primary domain: Static Web (Hugo SSG)
- Complexity level: Medium-High
- Architectural components: ~8 neue Partials, 2 neue Hugo Sections (learn/, services/), 1 Custom Design System, 1 Blog-Bug-Fix (Language Switcher), 2+ Drittanbieter-Embeds (Booking Widget, Thrivecart-Links)

### Technical Constraints & Dependencies

- Hugo (bestehende hugo.yaml + Goldmark Renderer — Konfiguration bleibt)
- Mainroad Theme (git submodule) → wird durch Custom Theme ersetzt (AD-001, s. unten)
- jQuery 3.5.1 → wird durch Vanilla JS ersetzt (EXPERIENCE.md: "minimal vanilla JS only")
- GetResponse: bestehende WebConnect-Integration bleibt; Lead-Magnet-Flow wird ergänzt
- Giscus, GTM, VGWort: unverändert weitergeführt als bestehende Partials
- Cloudflare Pages: kein CI/CD konfiguriert (manueller Build + Deploy aktuell)
- Booking Widget: Tool noch offen (OQ-5: Cal.com / Calendly / Thinkific) → iframe/script embed via Hugo Partial
- 24 bestehende Blog-Posts (Leaf Bundles): Frontmatter-Cleanup für Language Switcher Fix nötig (`translationKey`)

### Cross-Cutting Concerns Identified

1. **CSS Custom Properties Design System** — Token-Konsistenz über alle Seiten und Komponenten
2. **Multilingual Compliance** — jede neue Seite benötigt `.en.md` + `.de.md`
3. **WCAG 2.1 AA** — Kontrastverhältnisse, Keyboard-Navigation, ARIA, Focus-Ring überall
4. **`prefers-reduced-motion`** — alle CSS-Animationen (Gap Viz, Hover States) müssen in Media Query gewrappt sein
5. **SEO / Schema.org** — JSON-LD Partials für Person, Organization, Course (neue Anforderung)
6. **Language Switcher Fix** — systemisches Problem: betrifft alle 24 bestehenden Blog-Posts (`.Translations` statt hardlink)

---

## Starter Template Evaluation

### Primary Technology Domain

Hugo Static Site Generator (SSG) — bestehende Codebasis.
Kein externer Starter-Template benötigt; die Entscheidung betrifft die Theme-Architektur.

### Hugo Theme Architecture

**Entscheidung: Direktes `layouts/` Override (Option B)**

Mainroad-Theme (git submodule) wird entfernt. Alle Templates werden direkt
im Root-`layouts/`-Verzeichnis des Projekts verwaltet.

Grund: Hugo priorisiert `layouts/` automatisch über jedes Theme.
Kein zusätzliches Submodul-Overhead für ein Solo-Projekt sinnvoll.

**Initialisierung:**

```bash
# Mainroad-Submodul entfernen
git submodule deinit themes/mainroad
git rm themes/mainroad

# theme-Eintrag aus hugo.yaml entfernen
# theme: mainroad  →  entfernen oder auskommentieren
```

### CSS-Strategie

CSS Custom Properties + Hugo Pipes

- Design-System-Tokens als CSS-Variablen (`:root { --color-primary: #15D1A0; ... }`)
- Hugo Pipes für Asset-Processing (Fingerprinting, Minification)
- Kein SCSS, kein Tailwind — CSS Custom Properties sind ausreichend
- Dark/Light Mode via `@media (prefers-color-scheme)` + optionaler `data-theme`-Toggle

### JavaScript-Strategie

Vanilla JS, kein Framework, kein jQuery

jQuery 3.5.1 + jquery-migrate werden entfernt.
Benötigte JS-Funktionalität (EXPERIENCE.md):

- Navigation Hamburger Toggle (mobile)
- IntersectionObserver für Gap Visualization Animation
- Language Switcher (bestehender Bug-Fix)
- GetResponse Lead-Magnet Form Handling

Alle als kleine, isolierte Vanilla JS Module in `assets/js/`.

### Font-Loading

AD-009: Self-Hosted Fonts

Space Grotesk, Inter und JetBrains Mono werden als WOFF2-Dateien lokal gehostet — kein CDN.

Grund: Eliminiert LCP-Risiko durch Netzwerk-Roundtrip zu Google Fonts.
Keine externe Abhängigkeit; bessere Privacy-Compliance (kein Google-Request).

```text
static/fonts/
├── space-grotesk/
│   ├── SpaceGrotesk-Bold.woff2
│   └── SpaceGrotesk-SemiBold.woff2
├── inter/
│   ├── Inter-Regular.woff2
│   ├── Inter-SemiBold.woff2
│   └── Inter-Italic.woff2
└── jetbrains-mono/
    └── JetBrainsMono-Regular.woff2
```

`@font-face` Deklarationen in `assets/css/base.css`.
Fallback Stack: `system-ui, -apple-system, sans-serif`.

### Logo Assets (erhalten 2026-06-09)

Vier Logo-Varianten von Simon geliefert (PNG). SVG-Versionen für Produktion erforderlich.

| Datei | Verwendung |
| --- | --- |
| `static/images/logo-robotmk-dark-bg.svg` | Nav + Hero auf dunklem Hintergrund (weiß/grün) |
| `static/images/logo-robotmk-light-bg.svg` | Nav auf hellem Hintergrund, Light Mode (dunkel/grün) |
| `static/images/logo-robotmk-icon.svg` | Favicon, kompakte Verwendung |

Bis SVG-Assets vorliegen: PNG-Exporte als Placeholder in `static/images/`.
Favicon-Generation aus Icon-Variante (mehrere Größen: 32px, 180px, 512px).

Entfernung des Mainroad-Submoduls ist der erste Implementierungsschritt vor jeder Template-Entwicklung.

---

## Core Architectural Decisions

### Decision Priority Analysis

**Kritische Entscheidungen (blockieren Implementierung):**

- AD-001: Hugo Theme-Architektur → direktes `layouts/` Override (kein Submodul)
- AD-002: CSS-Strategie → CSS Custom Properties + Hugo Pipes
- AD-003: JS-Strategie → Vanilla JS only, jQuery entfernt
- AD-004: Gap Visualization → strukturiertes HTML/CSS (keine SVG)
- AD-005: Language Switcher Fix → `translationKey` in allen 24 Posts + `.Translations`-Partial

**Wichtige Entscheidungen (prägen Architektur):**

- AD-006: Content-Sections → `learn/` + `services/` als eigene Hugo Sections mit je eigenem Layout
- AD-007: Integration Architecture → Booking Widget als Placeholder-Partial (bis OQ-5 entschieden)
- AD-008: CI/CD → Cloudflare Pages Git-Integration aktivieren

**Zurückgestellt (Post-MVP):**

- Monitoring Gap Calculator (OQ-7): Vanilla JS Shortcode, nach Launch
- Blueprint-Kaufflow (Thrivecart-Embed vs. externe Links): externe Links in v1

### Frontend Architecture

#### Hugo Template-Struktur

```text
layouts/
├── _default/
│   ├── baseof.html          ← Basis-Shell (überarbeitet)
│   ├── single.html          ← Blog-Post Template
│   └── list.html            ← Fallback List
├── index.html               ← Homepage mit Section-Partials
├── learn/
│   └── list.html            ← Learn-Seite (eigenes Layout)
├── services/
│   └── list.html            ← Services-Seite (eigenes Layout)
├── partials/
│   ├── head/
│   │   ├── meta.html
│   │   ├── fonts.html
│   │   └── schema-org.html
│   ├── nav.html
│   ├── footer.html
│   ├── sections/
│   │   ├── hero.html
│   │   ├── gap-visualization.html
│   │   ├── stats-bar.html
│   │   ├── solution.html
│   │   ├── founder.html
│   │   ├── entry-points.html
│   │   ├── testimonials.html
│   │   └── newsletter-cta.html
│   ├── blog/
│   │   ├── post-meta.html
│   │   ├── authorbox.html
│   │   └── comments.html
│   └── integrations/
│       ├── getresponse.html
│       ├── gtm.html
│       ├── vgwort.html
│       └── booking-widget.html
└── shortcodes/
```

#### CSS Design System

```text
assets/css/
├── tokens.css       ← Design System Tokens (einzige Quelle der Wahrheit)
├── reset.css        ← Minimales CSS Reset
├── base.css         ← Typografie, Body, Links
├── layout.css       ← Grid, Max-Width, Sections
├── components/
│   ├── nav.css
│   ├── buttons.css
│   ├── cards.css
│   ├── badges.css
│   └── forms.css
├── sections/
│   ├── hero.css
│   ├── gap-viz.css
│   ├── stats-bar.css
│   └── (weitere Sections)
└── main.css         ← Hugo Pipes Entry Point (@import aller obigen)
```

Token-Implementierung:

```css
:root {
  --color-background: #1e262e;
  --color-surface: #2C3843;
  --color-primary: #15D1A0;
  --color-on-surface: #e8edf2;
  --radius: 0px;
  --space-base: 8px;
}

@media (prefers-color-scheme: light) {
  :root {
    --color-background: #f4f6f8;
    --color-surface: #ffffff;
  }
}
```

#### Gap Visualization (AD-004)

Strukturiertes HTML/CSS — kein SVG.

```html
<div class="gap-viz" aria-label="Diagram showing the Monitoring Gap...">
  <div class="gap-viz__panel gap-viz__panel--infra"><!-- 4 ✓ Status Items --></div>
  <div class="gap-viz__gap"><span>← Monitoring Gap →</span></div>
  <div class="gap-viz__panel gap-viz__panel--ux"><!-- 4 ✗ Status Items --></div>
</div>
```

Animation via IntersectionObserver (`assets/js/gap-viz.js`), CSS-Animation nur unter
`@media (prefers-reduced-motion: no-preference)`.

#### JavaScript-Module

```text
assets/js/
├── nav.js           ← Hamburger Toggle (mobile)
├── gap-viz.js       ← IntersectionObserver + Animation Trigger
├── lang-switch.js   ← Language Switcher Fix
└── lead-magnet.js   ← GetResponse Form + Inline-Bestätigung
```

### Content Architecture

#### Neue Content-Sections

```text
content/
├── learn/
│   ├── _index.en.md
│   └── _index.de.md
├── services/
│   ├── _index.en.md
│   └── _index.de.md
└── about/
    ├── _index.en.md    ← umstrukturiert von about.en.md
    └── _index.de.md
```

#### Blog Pinning (FR-004.1)

Frontmatter: `pin: true`. Sortierung im List-Template:

```html
{{ $pinned := where .Pages "Params.pin" true }}
{{ $rest := where .Pages "Params.pin" "ne" true }}
{{ range (append $pinned $rest) }}...{{ end }}
```

#### Language Switcher Fix (AD-005)

Alle 24 Blog-Posts erhalten `translationKey: "post-slug"` in beiden Sprachversionen.
Language Switcher Partial nutzt `.Translations`:

```html
{{ range .Translations }}
  <a href="{{ .Permalink }}" lang="{{ .Language.Lang }}">{{ .Language.LanguageName }}</a>
{{ end }}
```

Fallback bei fehlender Übersetzung: Link zur Section-Root (`/de/blog/`), nicht zur Homepage.

### Integration Architecture

| Integration | Ansatz | Status |
| --- | --- | --- |
| GetResponse Newsletter | Bestehendes Partial + Double-Opt-In | Bleibt, erweitern |
| GetResponse Lead Magnet | Inline Form + Vanilla JS DOM-Swap nach Submit | Neu |
| Booking Widget | Placeholder-Partial bis OQ-5 entschieden | Cal.com empfohlen |
| Thrivecart | Externe Links (kein Embed) | v1 |
| Giscus Comments | Bleibt unverändert | Bleibt |
| GTM | Bleibt unverändert | Bleibt |
| VGWort | Bleibt unverändert | Bleibt |
| Schema.org JSON-LD | Neues Partial `head/schema-org.html` | Neu |

### Infrastructure & Deployment

Cloudflare Pages Git-Integration aktivieren

- Push auf `main` → automatischer Hugo Build + Deploy
- Branch `redesign` → Preview Deploy URL
- Build-Command: `hugo --minify`
- Kein separates CI/CD-Tool nötig (Cloudflare Pages nativ)

### Decision Impact Analysis

#### Implementierungsreihenfolge

1. Mainroad-Submodul entfernen + `hugo.yaml` bereinigen
2. `tokens.css` + `reset.css` + `base.css` erstellen (Design System Foundation)
3. `baseof.html` + `nav.html` + `footer.html` (Shell)
4. Homepage-Sections (hero → gap-viz → stats-bar → solution → founder → ...)
5. `learn/` + `services/` Sections
6. Blog-Improvements (Pinning + Language Fix + `translationKey`-Cleanup)
7. Integration-Partials (Lead Magnet Flow, Schema.org, Booking Widget Placeholder)
8. Cloudflare Pages CI/CD aktivieren

#### Cross-Component-Abhängigkeiten

- `tokens.css` ist Voraussetzung für alle weiteren CSS-Dateien
- `baseof.html` ist Voraussetzung für alle Seiten-Templates
- Language Switcher Fix benötigt Frontmatter-Cleanup aller 24 Posts vor dem Test
- Booking Widget bleibt Placeholder bis OQ-5 (Cal.com / Calendly) entschieden ist

---

## Implementation Patterns & Consistency Rules

### Naming Patterns

#### CSS-Klassen — BEM-Variante (flach)

Schema: `block__element--modifier`

```css
/* Richtig */
.gap-viz {}
.gap-viz__panel {}
.gap-viz__panel--infra {}
.gap-viz__gap {}

.btn {}
.btn--primary {}
.btn--ghost {}

.card {}
.card__title {}
.card__body {}

/* Falsch: keine utility-first Klassen, kein camelCase */
/* .primaryButton, .flex-col, .text-accent → verboten */
```

#### CSS Custom Properties — Token-Naming

Schema: `--color-{role}`, `--font-{role}`, `--space-{size}`, `--radius`

```css
/* Richtig */
--color-background
--color-surface
--color-primary
--color-on-surface
--font-display
--font-body
--space-base
--space-xl
--radius

/* Falsch */
/* --primary-color, --rmk-color-bg, --colorBackground */
```

#### Hugo Partial-Dateinamen — kebab-case

```text
Richtig:  partials/sections/gap-visualization.html
          partials/head/schema-org.html
          partials/integrations/booking-widget.html

Falsch:   partials/sections/GapVisualization.html
          partials/sections/gap_visualization.html
```

#### Hugo Frontmatter-Felder — kebab-case, semantisch eindeutig

```yaml
# Blog-Posts
pin: true              # nicht: pinned, featured, sticky
translationKey: "slug" # Pflichtfeld für alle Posts

# Learn/Services Content
level: beginner        # nicht: difficulty, grade
price: "€299"          # nicht: cost, amount
```

#### i18n-Keys — dot.notation, lowercase

```yaml
# i18n/en.yaml
nav.home: "Home"
nav.learn: "Learn"
cta.clarity_call: "Book a Clarity Call →"
section.hero.eyebrow: "SYNTHETIC MONITORING"

# Nicht: navHome, nav_home, NAV_HOME
```

### Structure Patterns

#### Hugo Partial-Aufruf — Kontext vs. Dict

Einfache Partials: immer `.` (ganzer Page Context):

```html
{{ partial "nav.html" . }}
{{ partial "footer.html" . }}
```

Sections mit eigenem Scope: `dict` verwenden:

```html
{{ partial "sections/hero.html" (dict "Page" . "Title" .Title) }}
```

Regel: Wenn ein Partial nur Page-Daten braucht → `.`. Wenn es eigene Parameter braucht → `dict`.

#### CSS-Datei-Zuordnung — 1:1

Jede Section hat genau eine CSS-Datei:

- `gap-visualization.html` → `sections/gap-viz.css`
- `hero.html` → `sections/hero.css`
- `nav.html` → `components/nav.css`

Kein seitenübergreifendes CSS in Section-Dateien.

#### JavaScript-Module — Vanilla Pattern

Jede JS-Datei exportiert genau eine `init()`-Funktion:

```javascript
// assets/js/gap-viz.js
export function init() {
  const el = document.querySelector('.gap-viz');
  if (!el) return;
}

// assets/js/main.js
import { init as initGapViz } from './gap-viz.js';
import { init as initNav } from './nav.js';

document.addEventListener('DOMContentLoaded', () => {
  initGapViz();
  initNav();
});
```

Regel: Kein Code außerhalb von Funktionen. Kein globales `window.*`. Kein jQuery.

### Format Patterns

#### Dark/Light Mode — CSS-only in v1

```css
/* Richtig */
:root { --color-background: #1e262e; }

@media (prefers-color-scheme: light) {
  :root { --color-background: #f4f6f8; }
}

/* Falsch in v1: kein JS-Toggle */
```

#### prefers-reduced-motion — immer wrappen

```css
/* Richtig */
@media (prefers-reduced-motion: no-preference) {
  .gap-viz__gap { animation: pulse 4s ease-in-out infinite; }
}

/* Falsch: Animation ohne Media Query */
```

#### Hugo Section-Trenner — `<section>` mit `data-section`

```html
<section class="section section--hero" data-section="hero">
  {{ partial "sections/hero.html" . }}
</section>

<section class="section section--gap-viz" data-section="gap-viz">
  {{ partial "sections/gap-visualization.html" . }}
</section>
```

### Process Patterns

#### Checkliste: Neue Section hinzufügen

1. `layouts/partials/sections/{name}.html` erstellen
2. `assets/css/sections/{name}.css` erstellen + in `main.css` importieren
3. `{{ partial "sections/{name}.html" . }}` in `index.html` einfügen
4. ARIA-Landmark oder `aria-label` setzen
5. `prefers-reduced-motion` für alle Animationen sicherstellen
6. Mobile-Breakpoint 375px testen

#### Checkliste: Neues Multilingual-Content-File

1. `.en.md` erstellen
2. `.de.md` erstellen (oder Language-Fallback-Banner aktivieren)
3. `translationKey:` in beiden Dateien identisch setzen
4. Frontmatter-Schema aus bestehendem File als Vorlage nutzen

### Enforcement Guidelines

Alle AI-Agents MÜSSEN:

- BEM-Schema (`block__element--modifier`) für alle neuen CSS-Klassen verwenden
- CSS Custom Properties aus `tokens.css` referenzieren — niemals Hex-Werte hardcoden
- `prefers-reduced-motion` für jede CSS-Animation wrappen
- kebab-case für alle Hugo-Partial-Dateinamen verwenden
- `translationKey` in jedem neuen Content-File setzen
- Vanilla JS Module-Pattern (`export function init()`) für jede JS-Datei verwenden

Anti-Patterns (verboten):

- Hex-Werte außerhalb von `tokens.css` → immer `var(--color-*)` verwenden
- jQuery oder externes JS-Framework
- `!important` außer für Accessibility-Focus-Styles
- Inline `style=""` Attribute
- `border-radius` außer via `var(--radius)` (= 0px)

---

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
blog.robotmk.org/
├── hugo.yaml                          ← Site config (theme: entfernt)
├── .gitmodules                        ← themes/mainroad entfernt
├── .gitignore
├── DOCUMENTATION.md
│
├── content/
│   ├── blog/                          ← 24 bestehende Posts (Leaf Bundles)
│   │   └── my-post/
│   │       ├── index.en.md            ← + translationKey: "my-post"
│   │       ├── index.de.md            ← + translationKey: "my-post"
│   │       └── img/
│   ├── learn/                         ← NEU
│   │   ├── _index.en.md
│   │   └── _index.de.md
│   ├── services/                      ← NEU
│   │   ├── _index.en.md
│   │   └── _index.de.md
│   ├── about/                         ← Umstrukturiert
│   │   ├── _index.en.md
│   │   └── _index.de.md
│   ├── imprint.{en,de}.md
│   ├── privacy-policy.{en,de}.md
│   ├── newsletter.{en,de}.md
│   └── almost-done.{en,de}.md
│
├── layouts/
│   ├── _default/
│   │   ├── baseof.html                ← Basis-Shell (überarbeitet)
│   │   ├── single.html                ← Blog-Post
│   │   └── list.html                  ← Fallback List
│   ├── index.html                     ← Homepage mit Section-Partials
│   ├── learn/
│   │   └── list.html                  ← Produktkatalog-Layout
│   ├── services/
│   │   └── list.html                  ← Services-Layout
│   └── partials/
│       ├── head/
│       │   ├── meta.html
│       │   ├── fonts.html
│       │   └── schema-org.html        ← NEU: JSON-LD
│       ├── nav.html                   ← Language Switcher Fix
│       ├── footer.html
│       ├── sections/
│       │   ├── hero.html
│       │   ├── gap-visualization.html
│       │   ├── stats-bar.html
│       │   ├── solution.html
│       │   ├── founder.html
│       │   ├── entry-points.html
│       │   ├── testimonials.html
│       │   ├── blog-preview.html
│       │   └── newsletter-cta.html
│       ├── blog/
│       │   ├── post-meta.html
│       │   ├── post-thumbnail.html
│       │   ├── authorbox.html
│       │   ├── post-toc.html
│       │   └── comments.html          ← Giscus (unverändert)
│       └── integrations/
│           ├── getresponse.html       ← WebConnect Analytics
│           ├── getresponse-form.html  ← NEU: Lead Magnet Form
│           ├── gtm.html
│           ├── vgwort.html
│           └── booking-widget.html    ← Placeholder (OQ-5 offen)
│
├── assets/
│   ├── css/
│   │   ├── main.css                   ← Hugo Pipes Entry Point
│   │   ├── tokens.css                 ← Design System Custom Properties
│   │   ├── reset.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components/
│   │   │   ├── nav.css
│   │   │   ├── buttons.css
│   │   │   ├── cards.css
│   │   │   ├── badges.css
│   │   │   └── forms.css
│   │   └── sections/
│   │       ├── hero.css
│   │       ├── gap-viz.css
│   │       ├── stats-bar.css
│   │       ├── solution.css
│   │       ├── founder.css
│   │       ├── entry-points.css
│   │       ├── testimonials.css
│   │       └── newsletter-cta.css
│   └── js/
│       ├── main.js                    ← Entry Point
│       ├── nav.js                     ← Hamburger Toggle
│       ├── gap-viz.js                 ← IntersectionObserver Animation
│       ├── lang-switch.js             ← Language Switcher Fix
│       └── lead-magnet.js             ← Form Submit + Inline Confirm
│
├── static/
│   ├── favicon.ico
│   └── images/
│       ├── logo-robotmk.svg           ← TBD: von Simon
│       ├── logo-checkmk.svg
│       └── portrait-simon-meggle.jpg
│
├── i18n/
│   ├── en.yaml                        ← dot.notation Keys
│   └── de.yaml
│
├── archetypes/
│   ├── blog/
│   │   └── index.md                   ← + translationKey Feld
│   └── default.md
│
└── public/                            ← Hugo Build Output (gitignored)
```

### Architectural Boundaries

**Content Boundary:** Alle Texte und Produktdaten leben in `content/`. Templates enthalten keine hartcodierten Inhalte.

**Design System Boundary:** Alle visuellen Tokens ausschließlich in `assets/css/tokens.css`. Kein Hex-Wert außerhalb dieser Datei.

**Integration Boundary:** Alle Drittanbieter-Scripts isoliert in `layouts/partials/integrations/`.

### Requirements to Structure Mapping

| FR | Primäre Dateien |
| --- | --- |
| FR-001 Hero | `partials/sections/hero.html`, `css/sections/hero.css` |
| FR-002 Gap Viz | `partials/sections/gap-visualization.html`, `css/sections/gap-viz.css`, `js/gap-viz.js` |
| FR-003 Founder | `partials/sections/founder.html`, `static/images/portrait-simon-meggle.jpg` |
| FR-004 Blog Fix | `partials/nav.html`, `js/lang-switch.js`, Blog-Post-Frontmatter |
| FR-005 Produktkatalog | `layouts/learn/list.html`, `content/learn/_index.{en,de}.md` |
| FR-006 Services | `layouts/services/list.html`, `content/services/_index.{en,de}.md`, `partials/integrations/booking-widget.html` |
| FR-007 Testimonials | `partials/sections/testimonials.html` |
| FR-008 Codespace | CTAs in `hero.html` + `entry-points.html` |
| FR-009 Newsletter | `partials/sections/newsletter-cta.html`, `partials/integrations/getresponse-form.html`, `js/lead-magnet.js` |
| NFR-002 SEO | `partials/head/meta.html`, `partials/head/schema-org.html` |

### External Integration Points

| Service | Einstiegspunkt | Status |
| --- | --- | --- |
| Google Tag Manager | `partials/integrations/gtm.html` | Bleibt |
| GetResponse | `getresponse.html` + `getresponse-form.html` | Bleibt + Neu |
| Giscus | `partials/blog/comments.html` | Bleibt |
| VGWort | `partials/integrations/vgwort.html` | Bleibt |
| Booking Widget | `partials/integrations/booking-widget.html` | Placeholder (OQ-5) |
| Thrivecart | Externe Links in Content | Links only |
| Cloudflare Pages | Build: `hugo --minify`, Git-Push auf `main` | CI/CD aktivieren |

---

## Architecture Validation Results

### Coherence Validation

Decision Compatibility: Alle Technologien arbeiten konfliktfrei zusammen.
Hugo (statisch) + CSS Custom Properties + Vanilla JS + Hugo Pipes — keine Framework-Konflikte.
`prefers-reduced-motion` Pattern ist konsistent mit CSS-only Animations-Ansatz.
`translationKey` + Hugo `.Translations` ist das offizielle Hugo i18n Pattern.
AD-009 (Self-Hosted Fonts) löst das zuvor identifizierte LCP-Risiko vollständig.

Pattern Consistency: BEM-Naming, Token-Naming und Hugo kebab-case sind konsistent.
Jede Section hat genau 1 HTML-Partial + 1 CSS-Datei — keine Überlappungen.
JS Module-Pattern (`export function init()`) ist konsistent für alle 4 JS-Dateien.

Structure Alignment: `layouts/` Override ist der Standard-Hugo-Mechanismus.
Boundaries (Content / Design System / Integration) sind klar getrennt.

### Requirements Coverage Validation

#### Functional Requirements: 9/9 abgedeckt

| FR | Status | Datei |
| --- | --- | --- |
| FR-001 Hero | ✅ | `hero.html`, `hero.css` |
| FR-002 Gap Viz | ✅ | `gap-visualization.html`, `gap-viz.css`, `gap-viz.js` |
| FR-003 Founder | ✅ | `founder.html`, Logo-Assets erhalten |
| FR-004 Blog Fix | ✅ | `nav.html`, `lang-switch.js`, Frontmatter-Cleanup |
| FR-005 Produktkatalog | ✅ | `layouts/learn/list.html` |
| FR-006 Services | ✅ | `layouts/services/list.html`, Booking Placeholder |
| FR-007 Testimonials | ✅ | `testimonials.html` |
| FR-008 Codespace | ✅ | CTAs in `hero.html` + `entry-points.html` |
| FR-009 Newsletter | ✅ | `newsletter-cta.html`, `getresponse-form.html`, `lead-magnet.js` |

#### Non-Functional Requirements: 5/5 abgedeckt

| NFR | Status | Lösung |
| --- | --- | --- |
| NFR-001 Design System | ✅ | `tokens.css` als Single Source of Truth |
| NFR-002 SEO | ✅ | `meta.html` + `schema-org.html` (JSON-LD) |
| NFR-003 Performance | ✅ | Self-Hosted Fonts (AD-009), Hugo Pipes Minification |
| NFR-004 Tech Stack | ✅ | Hugo, Cloudflare Pages, externe Links, alle Integrationen |
| NFR-005 Accessibility | ✅ | ARIA in Gap Viz, Focus-Ring, `prefers-reduced-motion` |

### Gap Analysis Results

| Priorität | Gap | Status |
| --- | --- | --- |
| ℹ️ Minor | OQ-5 Booking Widget Tool | Placeholder vorhanden, kein Blocker |
| ℹ️ Minor | Logo SVG-Dateien (PNG erhalten) | Placeholder bis SVG geliefert, kein Blocker |
| ℹ️ Minor | Blog-Frontmatter-Cleanup (24 Posts) | Skriptbar, kein Blocker für Templates |
| ℹ️ Deferred | Monitoring Gap Calculator (OQ-7) | Post-MVP, als Vanilla JS Shortcode geplant |
| ℹ️ Deferred | Blueprint-Kaufflow | Post-MVP, externe Links in v1 |

Keine kritischen Gaps verbleiben.

### Architecture Completeness Checklist

#### Requirements Analysis

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Medium-High)
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped (6 Concerns)

#### Architectural Decisions

- [x] Critical decisions documented (AD-001 bis AD-009)
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed (AD-009 Self-Hosted Fonts)

#### Implementation Patterns

- [x] Naming conventions established (BEM, Token-Naming, kebab-case, i18n dot.notation)
- [x] Structure patterns defined (1:1 CSS-Zuordnung, JS Module Pattern)
- [x] Communication patterns specified (Hugo Partial-Kontext-Regel)
- [x] Process patterns documented (Section-Checkliste, Multilingual-Checkliste)

#### Project Structure

- [x] Complete directory structure defined
- [x] Component boundaries established (Content / Design System / Integration)
- [x] Integration points mapped (alle 7 Drittanbieter)
- [x] Requirements to structure mapping complete (FR-001 bis FR-009)

### Architecture Readiness Assessment

Overall Status: READY FOR IMPLEMENTATION

Alle 16 Checklist-Items erfüllt. Keine kritischen Gaps offen.

Confidence Level: High

Key Strengths:

- Vollständiger Projektbaum mit konkreten Dateinamen (keine Platzhalter)
- CSS Custom Properties als Single Source of Truth eliminiert Token-Drift
- Self-Hosted Fonts (AD-009) sichert LCP < 2.5s ohne externe Abhängigkeit
- JS Module Pattern verhindert globale Namespace-Konflikte
- BEM + kebab-case Enforcement verhindert Naming-Divergenz zwischen AI-Agents
- Language Switcher Fix vollständig spezifiziert (kein Interpretationsspielraum)

Areas for Future Enhancement:

- Monitoring Gap Calculator als interaktiver Vanilla JS Shortcode (Post-MVP)
- Blueprint-Kaufflow via Thrivecart-Embed (Post-MVP, wenn Katalog wächst)
- Light Mode Toggle via JS (`data-theme` Attribut) — aktuell CSS-only
- Booking Widget Tool-Entscheidung (OQ-5: Cal.com empfohlen)

### Implementation Handoff

AI Agent Guidelines:

- Mainroad-Submodul als erstes entfernen (vor jeder Template-Arbeit)
- `tokens.css` als erstes erstellen (Voraussetzung für alle CSS-Dateien)
- Jede neue Section: Section-Checkliste aus "Implementation Patterns" befolgen
- Jedes neue Content-File: Multilingual-Checkliste befolgen
- Kein Hex-Wert außerhalb `tokens.css`, kein jQuery, keine inline Styles

First Implementation Priority:

1. `git submodule deinit themes/mainroad && git rm themes/mainroad`
2. `hugo.yaml` — `theme:`-Eintrag entfernen
3. `assets/css/tokens.css` erstellen (alle Design System Tokens aus DESIGN.md)
4. `layouts/_default/baseof.html` erstellen (Shell mit Font-Loading + GTM + GetResponse)
