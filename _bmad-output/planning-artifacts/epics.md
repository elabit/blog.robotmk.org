---
stepsCompleted: [1, 2, 3, 4]
status: final
completedAt: 2026-06-09
inputDocuments:
  - "_bmad-output/planning-artifacts/prds/prd-Robotmk-Homepage-2026-06-08/prd.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-Robotmk-Homepage-2026-06-08/DESIGN.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-Robotmk-Homepage-2026-06-08/EXPERIENCE.md"
  - "_bmad-output/planning-artifacts/architecture.md"
---

# Robotmk Homepage - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for the Robotmk Homepage redesign, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-001.1: Hero zeigt die Monitoring Gap in max. 2 Sätzen + einer visuellen Metapher (The Gap Visualization)
FR-001.2: Primärer CTA "Clarity Call buchen" ist always-visible im Header (persistent nav button)
FR-001.3: Hero enthält sekundären CTA "Wie es funktioniert ↓" für nicht-kaufbereite Besucher
FR-001.4: Tagline "And the monitoring said: everything is green." erscheint als Hero-Subline

FR-002.1: Visuelle Erklärung "Was ist Synthetic Monitoring?" auf Homepage — max. 10 Sekunden zu verstehen
FR-002.2: Homepage adressiert beide Zielgruppen (Benjamin / Alex); Benjamin hat Priorität; sein Pfad ist ohne Klick klar

FR-003.1: Simon Meggle sichtbar als Person — Foto, Name, Kurzbiografie auf Homepage
FR-003.2: "Erfinder von Robotmk" und "Product Manager Synthetic Monitoring @ Checkmk" explizit kommuniziert
FR-003.3: Checkmk-Logo / Partnerschaftssignal auf der Seite sichtbar

FR-004.1: Blog-Artikel können als "pinned" markiert werden und erscheinen immer oben in der Liste
FR-004.2: Sprachauswahl im Blog behält den Nutzer in der Blog-Sektion (Bug-Fix: kein Redirect zur Homepage)
FR-004.3: Blog-Kategorien/Taxonomie überarbeitet für bessere Auffindbarkeit

FR-005.1: Alle Lead Magnets mit Email-Capture-Formular (GetResponse Double-Opt-In)
FR-005.2: Blueprint-Katalog filterbar nach Kategorie (Coming Soon in v1)
FR-005.3: Kurse mit Level-Badge (Beginner / Intermediate / Advanced), Dauer, Preis
FR-005.4: Kauf-Links führen zu Thrivecart (externe Links, kein Embed)
FR-005.5: Masterclass-Block prominent mit Link zu lp.robotmk.org

FR-006.1: Clarity Call Buchungs-Widget direkt auf der Services-Seite eingebettet (Placeholder bis OQ-5)
FR-006.2: Partnership-Modelle (PRO / GROWTH) mit Preistabelle sichtbar
FR-006.3: GROWTH Early Access Vorteil explizit hervorgehoben

FR-007.1: 3–5 Testimonials mit Foto, Name, Unternehmen, Zitat (Placeholder-Content)
FR-007.2: Mindestens 1 Testimonial mit konkretem Outcome ("vorher/nachher")

FR-008.1: Link / CTA zu GitHub Codespace auf Homepage und Learn-Seite
FR-008.2: Kurze Erklärung: "Ohne Setup, sofort im Browser ausprobieren"

FR-009.1: Newsletter-Signup auf Homepage (nach Blog-Preview-Sektion)
FR-009.2: Dedizierte Newsletter-Seite bleibt erhalten
FR-009.3: Lead-Magnet-Downloads triggern automatisch Newsletter-Subscription (Double-Opt-In)

### NonFunctional Requirements

NFR-001: Design System — Dark Mode Default, #15D1A0 Akzent, #1e262e Hintergrund, 3 Fonts (Space Grotesk / Inter / JetBrains Mono), 0px border-radius, CSS Custom Properties als Single Source of Truth
NFR-002: SEO — Meta-Tags für alle Seiten, Schema.org JSON-LD (Person, Organization, Course, BlogPosting), hreflang EN/DE, primäre Keywords
NFR-003: Performance — Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms; WebP, lazy loading; Self-Hosted Fonts; keine unnötigen Drittanbieter-Scripts
NFR-004: Tech Stack — Hugo (bestehend), Custom Theme via layouts/ (kein Mainroad), Cloudflare Pages, Vanilla JS (kein jQuery), GetResponse, Giscus, GTM, VGWort
NFR-005: Accessibility — WCAG 2.1 AA Kontraste, Tastaturnavigation, Alt-Texte, Focus-Ring, prefers-reduced-motion

### Additional Requirements

- AD-001: Mainroad Theme entfernen (git submodule deinit; hugo.yaml bereinigen) — erstes Implementierungsschritt
- AD-002: CSS Custom Properties + Hugo Pipes; `assets/css/tokens.css` als Design System Foundation
- AD-003: jQuery 3.5.1 + jquery-migrate entfernen; Vanilla JS Module Pattern (export function init())
- AD-004: Gap Visualization als strukturiertes HTML/CSS (keine SVG); IntersectionObserver für Animation
- AD-005: Language Switcher Fix — `translationKey` in allen 24 bestehenden Blog-Posts; `.Translations` im Partial
- AD-006: Neue Hugo Sections `content/learn/` + `content/services/`; je eigene `layouts/learn/list.html` + `layouts/services/list.html`
- AD-007: Booking Widget als `layouts/partials/integrations/booking-widget.html` Placeholder bis OQ-5 (Cal.com empfohlen)
- AD-008: Cloudflare Pages Git-Integration aktivieren; Build-Command `hugo --minify`; Preview Deploys für `redesign`-Branch
- AD-009: Self-Hosted Fonts — Space Grotesk, Inter, JetBrains Mono als WOFF2 in `static/fonts/`; @font-face in base.css

### UX Design Requirements

UX-DR1: Design System Tokens — alle Farb-, Typografie-, Spacing- und Component-Tokens aus DESIGN.md als CSS Custom Properties in `assets/css/tokens.css`; Dark/Light Mode via @media (prefers-color-scheme)
UX-DR2: Navigation — solid sticky dark bar (64px), Logo links, Nav-Links Mitte, CTA-Button rechts; Hamburger Mobile Full-Screen Overlay; Active-State: 2px solid primary underline
UX-DR3: Hero — Split Layout (50/50 desktop); links: Eyebrow + H1 (2-zeilig, "green" in primary) + Tagline + 2 CTAs; rechts: Gap Visualization; mobile: gestapelt
UX-DR4: Gap Visualization — 3 Zonen (Infra ✓ / Gap dashed error / UX ✗); CSS pulse-Animation (4s); IntersectionObserver Trigger; ARIA-Label; prefers-reduced-motion aware
UX-DR5: Stats Bar — 3 Spalten mit vertical rules; $14.000/min (error), 2.5× (primary), #1 (primary); Display-Typografie; harte Top-Border 2px primary
UX-DR6: Die Lösung Section — 3-Node Flow [RF → Robotmk → Checkmk] + 2 Entry Cards (Checkmk / RF); Robotmk-Node mit Akzent-Border
UX-DR7: Founder Section — 40/60 Split (Foto / Text); kein circular crop; 2 Credential-Badges; Ghost CTA "Meine Geschichte →"
UX-DR8: Product Cards — Level-Badge top-right, 48px Icon-Placeholder, Titel, Beschreibung, Preis, CTA; Hover: Border → primary
UX-DR9: Testimonials — 3 Cards (★★★★★ primary, Quote italic, Author + Company); Placeholder bis Simon liefert
UX-DR10: Newsletter CTA Section — volle Breite, primary Hintergrund, dunkler Text; Inline Form; Button "Abonnieren" (nie "Submit")
UX-DR11: Interactive States — alle States (Default/Hover/Active/Disabled) für: button-primary, button-ghost, card, nav-link, input; Transition 150ms ease
UX-DR12: Accessibility — Focus-Ring 2px solid primary offset 3px; ARIA-Labels auf allen Icon-Buttons und Gap-Viz; lang-Attribut via Hugo; Keyboard-Navigation vollständig
UX-DR13: Language Switcher Fix — Blog-Sprachwechsel navigiert zur übersetzten Post-Version (nicht Homepage); Fallback: Section-Root (/de/blog/)
UX-DR14: Lead-Magnet Flow — nach Email-Submit: Inline-Bestätigung ohne Page-Reload; Vanilla JS DOM-Swap; Double-Opt-In (GetResponse)
UX-DR15: Blog-Preview auf Homepage — 3 gepinnte/aktuelle Posts; wenn leer: Section unsichtbar (kein Error)

### FR Coverage Map

| FR/AD/UX-DR | Epic | Kurznotiz |
| --- | --- | --- |
| FR-001.1-4 | Epic 2 | Hero Section |
| FR-002.1-2 | Epic 2 | Gap Visualization |
| FR-003.1-3 | Epic 2 | Founder Section |
| FR-004.1-3 | Epic 4 | Blog Pinning + Language Fix |
| FR-005.1-5 | Epic 3 | Learn Page |
| FR-006.1-3 | Epic 3 | Services Page |
| FR-007.1-2 | Epic 2 | Testimonials |
| FR-008.1-2 | Epic 2 + 3 | Codespace CTAs |
| FR-009.1-3 | Epic 2 + 3 | Newsletter |
| NFR-001 | Epic 1 | Design System |
| NFR-002 | Epic 5 | SEO + Schema.org |
| NFR-003 | Epic 1 | Fonts + Hugo Pipes |
| NFR-004 | Epic 1 + 5 | Tech Stack |
| NFR-005 | Epic 5 | WCAG 2.1 AA |
| AD-001 | Epic 1 | Mainroad entfernen |
| AD-002 | Epic 1 | CSS Custom Properties |
| AD-003 | Epic 1 | jQuery → Vanilla JS |
| AD-004 | Epic 2 | Gap Viz HTML/CSS |
| AD-005 | Epic 4 | Language Switcher Fix |
| AD-006 | Epic 3 | neue Hugo Sections |
| AD-007 | Epic 3 | Booking Widget Placeholder |
| AD-008 | Epic 5 | Cloudflare CI/CD |
| AD-009 | Epic 1 | Self-Hosted Fonts |
| UX-DR1 | Epic 1 | tokens.css |
| UX-DR2 | Epic 1 | Navigation |
| UX-DR3-10 | Epic 2 | Homepage Sections |
| UX-DR11 | Epic 1 | Interactive States |
| UX-DR12 | Epic 5 | Accessibility |
| UX-DR13 | Epic 4 | Language Switcher |
| UX-DR14-15 | Epic 2 | Key Flows |

## Epic List

### Epic 1: Foundation — Site Shell & Design System

Besucher erleben eine schnelle, konsistente, barrierearme Site mit robuster technischer Basis. Mainroad wird entfernt, das CSS Design System aufgebaut, Schriften selbst gehostet und die Shell-Templates (baseof, nav, footer) implementiert.

**FRs/ADs covered:** AD-001, AD-002, AD-003, AD-009, NFR-001, NFR-003, UX-DR1, UX-DR2, UX-DR11

### Epic 2: Homepage — Besucher-Konversion

Benjamin erkennt in ≤5 Sekunden sein Problem, versteht die Lösung und kann einen Clarity Call buchen. Alex findet seinen Einstieg. Alle Homepage-Sections werden implementiert: Hero, Gap Visualization, Stats Bar, Die Lösung, Founder, Einstiegswege, Testimonials, Blog Preview, Newsletter CTA.

**FRs covered:** FR-001.1-4, FR-002.1-2, FR-003.1-3, FR-007.1-2, FR-008.1-2, FR-009.1, AD-004, UX-DR3–UX-DR10, UX-DR14, UX-DR15

### Epic 3: Learn & Services Pages

Besucher können alle Lernressourcen durchstöbern, Lead Magnets herunterladen und Services direkt buchen oder anfragen.

**FRs covered:** FR-005.1-5, FR-006.1-3, FR-008.1 (Learn), FR-009.2-3, AD-006, AD-007

### Epic 4: Blog & Sprachsystem

Besucher navigieren den Blog in ihrer Sprache ohne Redirects zur Homepage. Simon kann wichtige Artikel pinnen. Taxonomie ist aufgeräumt.

**FRs covered:** FR-004.1-3, AD-005, UX-DR13

### Epic 5: SEO, Accessibility & Deployment

Die Site ist über Suchmaschinen auffindbar, für alle Nutzer zugänglich (WCAG 2.1 AA) und deployed sich automatisch bei jedem Git-Push auf main.

**FRs covered:** NFR-002, NFR-004, NFR-005, AD-008, UX-DR12

---

## Stories

### Epic 1 Stories: Foundation — Site Shell & Design System

**Epic Goal:** Mainroad entfernen, Design System aufbauen, Shell-Templates und Navigation implementieren. Alle nachfolgenden Epics können auf dieser Basis aufbauen.

**Requirements covered:** AD-001, AD-002, AD-003, AD-009, NFR-001, NFR-003, UX-DR1, UX-DR2, UX-DR11

**Story Count:** 7

---

#### Story 1.1: Mainroad Theme entfernen und Hugo neu konfigurieren

**User Story:**
As a developer,
I want the Mainroad theme removed and Hugo configured for direct layouts/ override,
So that there are no theme conflicts blocking the redesign.

**Acceptance Criteria:**

- Given the existing repo has `themes/mainroad` as a git submodule
- When the developer runs the cleanup steps
- Then `git submodule deinit themes/mainroad` and `git rm themes/mainroad` complete without errors
- And `hugo.yaml` no longer contains a `theme:` entry
- And `hugo server` starts without errors (empty pages are expected at this stage)
- And `.gitmodules` no longer references mainroad

---

#### Story 1.2: CSS Design System Foundation

**User Story:**
As a site visitor,
I want the site to use a consistent visual design system,
So that every element looks coherent and on-brand.

**Acceptance Criteria:**

- Given a fresh `assets/css/` directory
- When the developer creates the CSS foundation files
- Then `assets/css/tokens.css` defines all color, typography, spacing, and component tokens from DESIGN.md as CSS Custom Properties
- And `:root { --color-primary: #15D1A0; --color-background: #1e262e; ... }` is the only place hex values appear
- And `@media (prefers-color-scheme: light)` overrides the surface tokens for light mode
- And `assets/css/reset.css` provides a minimal modern CSS reset
- And `assets/css/main.css` serves as the Hugo Pipes entry point and @imports all CSS files
- And `hugo build` produces a fingerprinted CSS output without errors

---

#### Story 1.3: Self-Hosted Fonts einbinden

**User Story:**
As a site visitor,
I want pages to load with the correct fonts immediately,
So that I can read content without layout shifts or waiting for external font requests.

**Acceptance Criteria:**

- Given the CSS foundation from Story 1.2 is in place
- When the developer adds font files and declarations
- Then Space Grotesk (Bold, SemiBold), Inter (Regular, SemiBold, Italic) und JetBrains Mono (Regular) als WOFF2 liegen in `static/fonts/`
- And `@font-face` Deklarationen in `assets/css/base.css` referenzieren die lokalen Dateien mit `font-display: swap`
- And kein Request geht an fonts.googleapis.com (prüfbar im Browser Network-Tab)
- And `--font-display`, `--font-body`, `--font-code` tokens in `tokens.css` referenzieren die korrekten Families
- And Fallback Stack `system-ui, -apple-system, sans-serif` ist definiert

---

#### Story 1.4: baseof.html — Site Shell

**User Story:**
As a site visitor,
I want every page to have a consistent HTML structure with proper language attributes,
So that the site works correctly across browsers, search engines, and screen readers.

**Acceptance Criteria:**

- Given Fonts (1.3) und CSS Foundation (1.2) sind vorhanden
- When der Developer `layouts/_default/baseof.html` erstellt
- Then jede Seite hat `<html lang="{{ .Site.Language.Lang }}">` gesetzt
- And `<head>` enthält: charset, viewport, CSS via Hugo Pipes (fingerprinted), Font-Preloads
- And GTM partial und GetResponse WebConnect partial sind eingebunden (kopiert aus bestehendem Code)
- And VGWort partial wird conditional für Blog-Posts eingebunden
- And `<body>` enthält: nav partial stub, `{{ block "main" . }}`, footer partial stub
- And baseof.html enthält `{{ partial "head/seo.html" . }}` als Stub-Call — das Partial existiert zunächst leer und wird in Epic 5 befüllt
- And alle bestehenden jQuery-Script-Tags sind aus dem HTML entfernt — kein `jquery.min.js` oder `jquery-migrate.js` wird mehr geladen (AD-003)
- And `hugo server` rendert Seiten ohne Template-Fehler
- And HTML ist valide (keine fehlenden Close-Tags, korrektes Nesting)

---

#### Story 1.5: Navigation implementieren

**User Story:**
As a site visitor,
I want a sticky navigation bar with the primary CTA always visible,
So that I can book a Clarity Call or navigate the site from any scroll position.

**Acceptance Criteria:**

- Given baseof.html ruft `{{ partial "nav.html" . }}` auf
- When der Developer `layouts/partials/nav.html` und zugehörige Assets erstellt
- Then Navigation ist sticky (position: fixed, top: 0, z-index: 100), 64px hoch, mit `1px solid var(--color-surface-border)` Bottom-Border
- And Logo-Placeholder links, Nav-Links (Home | Learn | Services | Blog | About) in der Mitte, "Clarity Call buchen →" Button (button-primary) rechts
- And Aktuelle Seite hat `2px solid var(--color-primary)` underline und volle Opacity
- And EN | DE Language Switcher ist sichtbar (navigiert vorerst zur Homepage der anderen Sprache — vollständiger Fix in Epic 4)
- And Mobile (≤768px): Hamburger-Icon ersetzt die Links; Klick öffnet Full-Screen Overlay
- And `assets/js/nav.js` handhabt nur den Hamburger Toggle via Vanilla JS (`export function init()`)
- And Focus-Ring (`2px solid var(--color-primary)`, offset 3px) ist bei Keyboard-Navigation sichtbar
- And Navigation ist per Tastatur vollständig bedienbar (Tab-Reihenfolge: Logo → Links → CTA)

---

#### Story 1.6: Footer implementieren

**User Story:**
As a site visitor,
I want a consistent footer on every page,
So that I can always find navigation links, contact information, and legal pages.

**Acceptance Criteria:**

- Given baseof.html ruft `{{ partial "footer.html" . }}` auf
- When der Developer `layouts/partials/footer.html` erstellt
- Then Footer enthält: Nav-Links (Home, Learn, Services, Blog, About), Social Links (GitHub, E-Mail), ELABIT GmbH (klein, rechtlicher Hinweis), Copyright-Jahr via Hugo `.Now.Year`
- And Footer-Hintergrund ist `var(--color-surface)` mit `1px solid var(--color-surface-border)` Top-Border
- And ELABIT ist sichtbar aber visuell zurückhaltend (body-sm, on-surface-muted)
- And Alle Footer-Links sind funktional (interne Hugo-Links via `{{ relLangURL }}`)

---

#### Story 1.7: Component-CSS & Interactive States

**User Story:**
As a site visitor,
I want buttons, cards, and form elements to respond consistently to hover and focus,
So that the interface feels polished and accessible on every interaction.

**Acceptance Criteria:**

- Given tokens.css definiert alle Design-Token-Variablen
- When der Developer die Component-CSS-Dateien erstellt
- Then `assets/css/components/buttons.css` implementiert button-primary, button-ghost, button-dark mit allen States (Default/Hover/Active/Disabled)
- And `assets/css/components/cards.css` implementiert card mit `hover: border-color → var(--color-primary)` Transition
- And `assets/css/components/badges.css` implementiert badge (0px radius, primary border + text)
- And `assets/css/components/forms.css` implementiert input mit focus-border
- And Alle Transitions sind `150ms ease`
- And `@media (prefers-reduced-motion: reduce)` deaktiviert alle Transitions und Animations
- And `border-radius: 0` (via `var(--radius)`) ist überall gesetzt — keine abgerundeten Ecken
- And Kein `box-shadow` auf irgendeiner Komponente

---

### Epic 2 Stories: Homepage — Besucher-Konversion

**Epic Goal:** Benjamin erkennt in ≤5 Sekunden sein Problem, versteht die Lösung und kann einen Clarity Call buchen. Alex findet seinen Einstieg. Alle Homepage-Sections implementiert.

**Requirements covered:** FR-001.1-4, FR-002.1-2, FR-003.1-3, FR-007.1-2, FR-008.1-2, FR-009.1, AD-004, UX-DR3–UX-DR10, UX-DR14, UX-DR15

**Story Count:** 9

---

#### Story 2.1: Homepage Layout & Section-Rahmen

**User Story:**
As a site visitor,
I want a homepage that loads instantly with the correct page structure,
So that I can immediately see the content without blank sections or layout errors.

**Acceptance Criteria:**

- Given die Site Shell aus Epic 1 ist vorhanden
- When der Developer `layouts/index.html` (EN) und `layouts/index.de.html` (DE) erstellt
- Then die Homepage rendert ohne Template-Fehler in `hugo server`
- And alle Section-Container sind vorhanden (als Stubs, die in folgenden Stories befüllt werden): hero, stats-bar, die-loesung, founder, einstiegswege, testimonials, blog-preview, newsletter-cta
- And Section-Trennlinien sind `1px solid var(--color-surface-border)` zwischen jeder Section
- And Abwechselnde Hintergründe: background → surface → background → surface (etc.)
- And `<main>` hat korrektes ARIA-Landmark

---

#### Story 2.2: Hero Section

**User Story:**
As a site visitor (Benjamin),
I want to see my exact problem described in the hero within 5 seconds of landing,
So that I know this site is for me and keep reading instead of bouncing.

**Acceptance Criteria:**

- Given Homepage-Layout aus Story 2.1
- When der Developer die Hero-Section implementiert
- Then Hero ist ein 50/50 Split-Layout (desktop); left: Text-Block, right: Gap Visualization Placeholder
- And Left Column enthält in dieser Reihenfolge: Eyebrow-Label "SYNTHETIC MONITORING" (label-Typografie, primary), H1 (2-zeilig, display-Typografie 56px), Tagline (Inter italic, on-surface-muted), CTA-Row
- And Das Wort "green" in der H1 ist `color: var(--color-primary)` — alle anderen Wörter sind `var(--color-on-surface)`
- And CTA-Row: "Clarity Call buchen →" (button-primary) links, "Wie es funktioniert ↓" (button-ghost) rechts — niemals zwei button-primary nebeneinander
- And Mobile (≤768px): gestapelt, Text oben, Visualization unten (100% Breite)
- And Tagline: *"And the monitoring said: everything is green."* — exakter Wortlaut, unveränderlich

---

#### Story 2.3: Gap Visualization

**User Story:**
As a site visitor,
I want to see a visual diagram of the Monitoring Gap,
So that I immediately understand the problem without reading a paragraph of text.

**Acceptance Criteria:**

- Given Hero-Section aus Story 2.2
- When der Developer die Gap Visualization als strukturiertes HTML/CSS implementiert (kein SVG, kein Canvas)
- Then Visualization hat 3 Zonen: Top-Panel (INFRASTRUCTURE MONITORING, surface bg, 4 items mit ✓ in primary), Gap-Bar (2px dashed error, Label "← Monitoring Gap →" in error), Bottom-Panel (USER EXPERIENCE, surface-low bg, 4 items mit ✗ in error)
- And Gap-Bar pulse-Animation: `opacity: 0.6 → 1.0 → 0.6`, Dauer 4s, unendlich
- And Animation startet via `IntersectionObserver` beim Scroll-Into-View (200ms Delay) — nicht beim Page-Load
- And `@media (prefers-reduced-motion: reduce)`: Animation ist vollständig deaktiviert
- And `aria-label="Diagram showing the Monitoring Gap: infrastructure monitoring shows all green while user experience shows failures"` ist gesetzt
- And Visualization ist rein dekorativ für Screen Reader (role="img", aria-hidden für interne Elemente)

---

#### Story 2.4: Stats Bar

**User Story:**
As a site visitor,
I want to see concrete numbers that quantify the business impact of the Monitoring Gap,
So that I can build the business case for acting on the problem.

**Acceptance Criteria:**

- Given Hero-Section ist vorhanden
- When der Developer die Stats Bar implementiert
- Then Stats Bar hat `2px solid var(--color-primary)` als harte Top-Border
- And 3 Spalten, getrennt durch `1px solid var(--color-surface-border)` vertical rules
- And Spalte 1: `$14,000 / min` in `var(--color-error)`, Label: "Durchschnittliche Kosten einer Minute Ausfall"
- And Spalte 2: `2.5×` in `var(--color-primary)`, Label: "Kostensteigerung in 10 Jahren (2014–2024)"
- And Spalte 3: `#1` in `var(--color-primary)`, Label: "Meistgenutztes Synthetic Monitoring Plugin für Checkmk"
- And Zahlen in display-Typografie (Space Grotesk), Labels in body-sm (on-surface-variant)
- And Stats Bar ist `<section>` mit `role="region"` und `aria-label`

---

#### Story 2.5: Die Lösung Section

**User Story:**
As a site visitor,
I want to see how Robot Framework, Robotmk, and Checkmk fit together,
So that I understand the solution in one visual scan without technical explanations.

**Acceptance Criteria:**

- Given Stats Bar ist vorhanden
- When der Developer die Lösung-Section implementiert
- Then Flow-Diagramm zeigt 3 Nodes horizontal: [Robot Framework] → [Robotmk] → [Checkmk Synthetic Monitoring]
- And Pfeile zwischen Nodes sind einfache CSS-Elemente (kein SVG)
- And Robotmk-Node hat `border: 2px solid var(--color-primary)` (Akzent-Signal als Connector)
- And Darunter: 2 Entry-Point-Cards nebeneinander (desktop), gestapelt (mobile)
- And Card links: "Ich nutze Checkmk" — Pain acknowledgment, CTA → `/learn/`
- And Card rechts: "Ich nutze Robot Framework" — Opportunity framing, CTA → GitHub Codespace (`target="_blank" rel="noopener noreferrer"`)
- And GitHub Codespace Link hat Begleittext: "Ohne Setup, sofort im Browser ausprobieren"

---

#### Story 2.6: Founder Section

**User Story:**
As a site visitor,
I want to see who built Robotmk and their credentials,
So that I trust the expertise behind the product before booking a call.

**Acceptance Criteria:**

- Given Die Lösung Section ist vorhanden
- When der Developer die Founder-Section implementiert
- Then Layout: 40/60 Split (Foto links / Text rechts), kein circular crop, scharfe Kante
- And Foto: Simon Meggle Porträt-Placeholder (grauer Bereich mit Alt-Text "Simon Meggle, Erfinder von Robotmk")
- And H2: "Erfunden. Perfektioniert. Nativ in Checkmk."
- And Bio-Paragraph: First-person, 3–4 Sätze beginning mit "Seit 2009..."
- And 2 Credential-Badges (badge-Komponente): "🔧 Erfinder von Robotmk" + "📋 Product Manager Synthetic Monitoring @ Checkmk"
- And Ghost-CTA: "Meine Geschichte →" → `/about/`
- And Checkmk-Credential-Badge ist visuell prominent — dies ist der wichtigste Trust-Signal für Benjamin

---

#### Story 2.7: Testimonials Section

**User Story:**
As a site visitor,
I want to see real feedback from people who have used Robotmk,
So that I trust the product before committing to a call.

**Acceptance Criteria:**

- Given Founder-Section ist vorhanden
- When der Developer die Testimonials-Section implementiert
- Then 3 Cards nebeneinander (desktop), gestapelt (mobile)
- And Jede Card enthält: ★★★★★ (in `var(--color-primary)`), Quote (body-md, italic), Autor-Name (Inter semibold) + Company (on-surface-variant)
- And Placeholder-Content ist vorhanden (Section ist sichtbar und messbar im Analytics)
- And Mindestens 1 Placeholder-Testimonial enthält konkreten Outcome ("vorher/nachher"-Format)
- And Section-Heading ist vorhanden und klar

---

#### Story 2.8: Blog Preview Section

**User Story:**
As a site visitor,
I want to see featured blog posts on the homepage,
So that I can dive deeper into technical content if I'm not ready to book a call.

**Acceptance Criteria:**

- Given Blog-Posts in `content/blog/` sind vorhanden
- When der Developer die Blog-Preview-Section implementiert
- Then Section zeigt 3 Blog-Posts (gepinnte Posts bevorzugt; Fallback: aktuellste)
- And Gepinnte Posts werden via Front-Matter-Parameter `pinned: true` markiert und priorisiert (vollständige Implementierung in Epic 4)
- And Wenn keine Posts vorhanden sind oder Hugo-Query leer zurückgibt: Section ist vollständig unsichtbar (kein Error, kein Leerpflatzhalter)
- And Jede Post-Preview enthält: Titel, Datum, kurze Beschreibung, "Weiterlesen →" Link
- And Section hat CTA: "Alle Artikel →" → `/blog/`

---

#### Story 2.9: Newsletter CTA Section

**User Story:**
As a site visitor,
I want to subscribe to the Robotmk newsletter directly from the homepage,
So that I can stay informed without having to search for a signup form.

**Acceptance Criteria:**

- Given Blog Preview Section ist vorhanden
- When der Developer die Newsletter-CTA-Section implementiert
- Then Section hat `background: var(--color-primary)` (volle Breite), Text in `var(--color-on-primary)`
- And Inline-Formular: Email-Input + "Abonnieren"-Button (button-dark, dunkler Fill) — Button-Text niemals "Submit"
- And Formular verbindet sich mit GetResponse via bestehendem WebConnect-Code
- And Client-side Email-Validierung on blur (nicht on submit), kein CAPTCHA
- And Nach erfolgreichem Submit: Inline-Bestätigung "Check your inbox! We've sent the download link." ohne Page-Reload (Vanilla JS DOM-Swap)
- And Double-Opt-In über GetResponse (GDPR-konform)

---

### Epic 3 Stories: Learn & Services Pages

**Epic Goal:** Besucher können alle Lernressourcen durchstöbern, Lead Magnets herunterladen und Services direkt buchen oder anfragen.

**Requirements covered:** FR-005.1-5, FR-006.1-3, FR-008.1, FR-009.2-3, AD-006, AD-007

**Story Count:** 6

---

#### Story 3.1: Hugo Sections Learn & Services anlegen

**User Story:**
As a developer,
I want new Hugo content sections for Learn and Services,
So that both areas have their own URLs, layouts, and content files.

**Acceptance Criteria:**

- Given die Site Shell aus Epic 1 ist vorhanden
- When der Developer die neuen Sections anlegt
- Then `content/learn/_index.en.md` und `content/learn/_index.de.md` existieren mit korrektem Front Matter (title, description)
- And `content/services/_index.en.md` und `content/services/_index.de.md` existieren
- And `layouts/learn/list.html` rendert die Learn-Section
- And `layouts/services/list.html` rendert die Services-Section
- And `/en/learn/` und `/en/services/` sind via `hugo server` erreichbar (200 OK)
- And Nav-Links "Learn" und "Services" verlinken korrekt auf die Sections

---

#### Story 3.2: Learn Page — Lead Magnets mit Email-Capture

**User Story:**
As a site visitor,
I want to download free learning resources by entering my email,
So that I can get practical value immediately without paying.

**Acceptance Criteria:**

- Given Learn-Section aus Story 3.1 ist vorhanden
- When der Developer die Lead-Magnet-Section implementiert
- Then Lead Magnets werden als Cards (card-Komponente) dargestellt: Titel, Beschreibung, "Kostenlos" Badge, Download-Button
- And Klick auf Download-Button öffnet ein Inline-Formular (Email-Input + "Herunterladen"-Button) — kein Seitenaufruf
- And Nach erfolgreichem Submit: Inline-Bestätigung "Check your inbox!" ohne Page-Reload (Vanilla JS DOM-Swap)
- And GetResponse Double-Opt-In wird getriggert (GDPR)
- And Lead-Magnet-Downloads triggern automatisch Newsletter-Subscription

---

#### Story 3.3: Learn Page — Kurse & Masterclass

**User Story:**
As a site visitor,
I want to browse video courses with level, duration, and pricing information,
So that I can find the right course for my experience level and budget.

**Acceptance Criteria:**

- Given Learn-Section ist vorhanden
- When der Developer die Kurs-Section und Masterclass-Block implementiert
- Then Kurs-Cards zeigen: Level-Badge oben-rechts (Beginner / Intermediate / Advanced), 48px Icon-Placeholder, Titel (headline-sm), Beschreibung (body-sm), Preis (headline-sm, primary) oder "Kostenlos"
- And Level-Badge verwendet badge-Komponente (0px radius, primary border + text)
- And Kauf-Links führen zu Thrivecart (`target="_blank" rel="noopener noreferrer"`)
- And Masterclass-Block ist prominent hervorgehoben mit Link zu `lp.robotmk.org` (external, `target="_blank"`)
- And Blueprint-Katalog-Section trägt "Coming Soon" Badge und ist nicht verlinkt
- And GitHub Codespace CTA: "Im Browser ausprobieren — ohne Setup" → Codespace Link

---

#### Story 3.4: Services Page — Clarity Call Buchungs-Widget

**User Story:**
As a site visitor (Benjamin who is ready to talk),
I want to book a Clarity Call directly on the Services page,
So that I can schedule time with Simon without leaving the site or sending an email.

**Acceptance Criteria:**

- Given Services-Section aus Story 3.1 ist vorhanden
- When der Developer das Buchungs-Widget implementiert
- Then `layouts/partials/integrations/booking-widget.html` existiert als Placeholder-Partial
- And Placeholder zeigt: Text "Clarity Call direkt buchen" + Inline-Hinweis "Kalender-Integration folgt (OQ-5)" + Fallback-E-Mail-Link `simon.meggle@elabit.de`
- And Sobald OQ-5 (Cal.com-Entscheidung) abgeschlossen ist, wird der Placeholder durch das echte Widget ersetzt — Story gilt als done mit dem Placeholder
- And Das Partial ist auf der Services-Page prominent eingebunden (oberhalb der Partnership-Cards)

---

#### Story 3.5: Services Page — Partnership-Modelle & Preistabelle

**User Story:**
As a site visitor,
I want to see the available service tiers with clear pricing and a highlighted recommendation,
So that I can evaluate which engagement model fits my situation.

**Acceptance Criteria:**

- Given Services-Section und Booking-Widget-Placeholder (3.4) sind vorhanden
- When der Developer die Partnership-Cards implementiert
- Then 2 Cards werden dargestellt: PRO Partnership und GROWTH Partnership nebeneinander (desktop), gestapelt (mobile)
- And GROWTH-Card hat `border-top: 2px solid var(--color-primary)` (Empfehlungs-Signal) und "Early Access"-Badge
- And Jede Card enthält: Modell-Name (headline-md), Engagement-Typ (One-time / Recurring), Preis, Feature-Liste, CTA-Button
- And GROWTH-Card zeigt "Early Access Training"-Themen (teilweise aufgelistet, erzeugt Vorfreude)
- And GROWTH Early Access Vorteil ist explizit hervorgehoben (Badge + Text)

---

#### Story 3.6: Dedizierte Newsletter-Seite

**User Story:**
As a site visitor who wants to subscribe to the newsletter,
I want a dedicated newsletter signup page,
So that I can subscribe even when I navigate directly to the newsletter section.

**Acceptance Criteria:**

- Given GetResponse-Integration ist vorhanden
- When der Developer die dedizierte Newsletter-Seite beibehält/erstellt
- Then `/en/newsletter/` und `/de/newsletter/` sind erreichbar
- And Seite enthält: Titel, Kurzbeschreibung des Newsletter-Inhalts, Email-Formular, "Abonnieren"-Button
- And Dieselbe GetResponse-Integration wie auf der Homepage (Story 2.9)
- And Bestehende Newsletter-Seite bleibt erhalten / migriert in neues Layout

---

### Epic 4 Stories: Blog & Sprachsystem

**Epic Goal:** Besucher navigieren den Blog in ihrer Sprache ohne Redirects zur Homepage. Simon kann wichtige Artikel pinnen. Taxonomie ist aufgeräumt.

**Requirements covered:** FR-004.1-3, AD-005, UX-DR13

**Story Count:** 4

---

#### Story 4.1: Blog-Layout im neuen Design

**User Story:**
As a site visitor,
I want the blog section to use the same design system as the rest of the site,
So that the reading experience feels consistent and on-brand.

**Acceptance Criteria:**

- Given Design System aus Epic 1 ist vorhanden
- When der Developer `layouts/blog/list.html` und `layouts/blog/single.html` erstellt
- Then Blog-Listen-Seite zeigt Posts als Cards im neuen Design (card-Komponente, Titel, Datum, Description, Tags)
- And Blog-Single-Seite rendert Content mit korrekter Typografie (body-lg, Inter) und Code-Blöcke in JetBrains Mono
- And VGWort-Pixel wird auf Single-Pages conditional eingebunden
- And Giscus-Kommentare bleiben erhalten (bestehendes Script eingebunden)
- And `/en/blog/` und `/de/blog/` sind erreichbar; bestehende Artikel-URLs bleiben unverändert (keine Link-Breaks)

---

#### Story 4.2: Artikel pinnen

**User Story:**
As Simon (site owner),
I want to mark blog articles as pinned so they always appear at the top of the blog list,
So that I can surface the most important content for new visitors regardless of publish date.

**Acceptance Criteria:**

- Given Blog-Layout aus Story 4.1 ist vorhanden
- When Simon `pinned: true` in das Front Matter eines Blog-Posts setzt
- Then Gepinnte Posts erscheinen immer oben in der Blog-Liste, sortiert nach Datum unter sich
- And Nicht-gepinnte Posts folgen darunter, ebenfalls nach Datum sortiert
- And Gepinnte Posts haben ein visuelles Signal (z. B. "📌 Empfohlen"-Badge, label-Typografie, primary-Farbe)
- And Homepage Blog-Preview (Story 2.8) bevorzugt gepinnte Posts
- And Kein Build-Fehler wenn kein Post `pinned: true` gesetzt hat

---

#### Story 4.3: Language Switcher Fix — Blog behält Sprachkontext

**User Story:**
As a blog reader,
I want switching language to take me to the translated version of the article I'm reading,
So that I don't lose my place by being redirected to the homepage.

**Acceptance Criteria:**

- Given bestehende 24 Blog-Posts ohne `translationKey`
- When der Developer den Language Switcher Fix implementiert
- Then alle 24 bestehenden Blog-Posts erhalten `translationKey: "<slug>"` im Front Matter
- And `layouts/partials/nav.html` Language Switcher nutzt `{{ range .Translations }}<a href="{{ .Permalink }}">{{ .Language.LanguageName }}</a>{{ end }}`
- And Wenn ein Post in der Zielsprache existiert: Switcher navigiert zur übersetzten Post-Version
- And Wenn kein übersetzter Post existiert: Switcher navigiert zur Section-Root (`/de/blog/`) mit Fallback-Banner "Diese Seite ist noch nicht auf Deutsch verfügbar."
- And Banner ist dismissible und cookie-persisted
- And Kein Redirect zur Homepage mehr — der Bug aus v0 ist behoben

---

#### Story 4.4: Blog-Taxonomie aufräumen

**User Story:**
As a site visitor,
I want to filter blog posts by meaningful categories,
So that I can find articles relevant to my use case without scrolling through everything.

**Acceptance Criteria:**

- Given Blog-Layout aus Story 4.1 ist vorhanden
- When der Developer die Taxonomie überarbeitet
- Then Bestehende Kategorien/Tags werden auf ein übersichtliches Set reduziert (z. B.: Getting Started, Checkmk, Robot Framework, Architecture, Case Study)
- And `hugo.yaml` Taxonomie-Konfiguration ist bereinigt
- And Tag-Seiten (`/en/tags/<tag>/`) rendern korrekt im neuen Design
- And Jeder Blog-Post hat mindestens eine sinnvolle Kategorie gesetzt
- And Alte, ungenutzte Tags werden entfernt (keine 404s für bisher gelinkte Tags — Redirect-Liste in Cloudflare falls nötig)

---

### Epic 5 Stories: SEO, Accessibility & Deployment

**Epic Goal:** Die Site ist über Suchmaschinen auffindbar, für alle Nutzer zugänglich (WCAG 2.1 AA) und deployed sich automatisch bei jedem Git-Push auf main.

**Requirements covered:** NFR-002, NFR-004, NFR-005, AD-008, UX-DR12

**Story Count:** 5

---

#### Story 5.1: Meta-Tags & Open Graph für alle Seiten

**User Story:**
As a site owner,
I want every page to have complete SEO meta-tags and Open Graph data,
So that search engines index pages correctly and social shares display properly.

**Acceptance Criteria:**

- Given baseof.html aus Story 1.4 ist vorhanden
- When der Developer das SEO-Head-Partial implementiert
- Then `layouts/partials/head/seo.html` setzt für jede Seite: `<title>`, `meta description`, `<link rel="canonical">`, `hreflang` (EN/DE), `og:title`, `og:description`, `og:url`, `og:image`
- And `hreflang` Tags referenzieren korrekt die jeweilige Sprachversion jeder Seite
- And Blog-Posts nutzen Post-spezifische `description` aus Front Matter; Fallback: Site-Description
- And `og:image` hat einen sinnvollen Default (Robotmk Logo/Banner)
- And Kein doppelter `<title>` oder `<meta description>` auf irgendeiner Seite

---

#### Story 5.2: Schema.org JSON-LD

**User Story:**
As a site owner,
I want structured data markup on key pages,
So that search engines understand the content type and show rich results.

**Acceptance Criteria:**

- Given SEO-Partial aus Story 5.1 ist vorhanden
- When der Developer Schema.org JSON-LD implementiert
- Then Homepage enthält `Organization` Schema: name "ELABIT GmbH", url, logo, sameAs (GitHub, LinkedIn)
- And About-Seite / Founder-Section enthält `Person` Schema: Simon Meggle, jobTitle, worksFor Checkmk
- And Blog-Posts enthalten `BlogPosting` Schema: headline, datePublished, author, url
- And Learn-Seite Kurs-Cards enthalten `Course` Schema: name, description, provider, url
- And JSON-LD ist valide (prüfbar via Google Rich Results Test)

---

#### Story 5.3: Primäre SEO-Keywords & Robots.txt

**User Story:**
As a site owner,
I want the site to be crawlable and target the right search queries,
So that Benjamin and Alex find robotmk.org when searching for Synthetic Monitoring solutions.

**Acceptance Criteria:**

- Given Meta-Tags und JSON-LD aus Stories 5.1/5.2 sind vorhanden
- When der Developer SEO-Konfiguration abschließt
- Then `static/robots.txt` erlaubt alle Crawler, verweist auf `sitemap.xml`
- And Hugo generiert automatisch `sitemap.xml` (alle Seiten, beide Sprachen, korrekte `lastmod`)
- And Primäre Keywords sind in Page-Titles und H1s der wichtigsten Seiten enthalten: "Synthetic Monitoring", "Robotmk", "Robot Framework Checkmk", "Checkmk Synthetic Monitoring Plugin"
- And `hugo.yaml` hat `enableRobotsTXT: true` gesetzt

---

#### Story 5.4: WCAG 2.1 AA Accessibility Audit & Fixes

**User Story:**
As a site visitor with accessibility needs,
I want the site to be fully operable with keyboard and screen reader,
So that I can access all content and functionality regardless of how I interact with my browser.

**Acceptance Criteria:**

- Given alle Epic 1–4 Stories sind implementiert
- When der Developer den Accessibility-Audit durchführt und Findings behebt
- Then alle interaktiven Elemente haben sichtbaren Focus-Ring (`2px solid var(--color-primary)`, offset 3px) — niemals `outline: none` ohne sichtbare Alternative
- And Tab-Reihenfolge folgt der visuellen Leserichtung auf allen Seiten
- And Gap Visualization hat korrektes `aria-label` (spezifiziert in Story 2.3)
- And Alle Icon-only Buttons haben `aria-label`
- And Kontrastverhältnisse werden überprüft: body text (#e8edf2 auf #1e262e) ≥ 7:1 (AAA), primary (#15D1A0 auf #1e262e) ≥ 4.5:1 (AA), error (#ff6b6b auf #1e262e) ≥ 4.5:1 (AA) — Fixes wo nötig
- And Light Mode Kontraste ebenfalls geprüft und compliant
- And Alle Bilder haben `alt`-Texte; dekorative Bilder haben `alt=""`

---

#### Story 5.5: Cloudflare Pages Deployment & CI/CD

**User Story:**
As a developer,
I want the site to deploy automatically on every push to main,
So that Simon can publish content by merging a PR without any manual deploy steps.

**Acceptance Criteria:**

- Given das Projekt liegt auf GitHub im `redesign`-Branch
- When der Developer Cloudflare Pages konfiguriert
- Then Cloudflare Pages Build-Command ist `hugo --minify`
- And Build-Verzeichnis ist `public`
- And Hugo-Version ist explizit in der Cloudflare-Konfiguration gesetzt (verhindert Breaking Changes bei Cloudflare Hugo-Updates)
- And Preview Deploys sind für den `redesign`-Branch aktiviert (jeder Push erzeugt eine Preview-URL)
- And Merge auf `main` triggert automatisch den Production-Deploy
- And Build schlägt fehl und deployed nicht, wenn `hugo --minify` einen Fehler wirft (kein Silent-Fail)
- And Deploy-Logs sind in Cloudflare Pages einsehbar

---

## Story Summary

| Epic | Stories | Requirements covered |
| --- | --- | --- |
| Epic 1: Foundation — Site Shell & Design System | 7 | AD-001/002/003/009, NFR-001/003, UX-DR1/2/11 |
| Epic 2: Homepage — Besucher-Konversion | 9 | FR-001.1-4, FR-002.1-2, FR-003.1-3, FR-007.1-2, FR-008.1-2, FR-009.1, AD-004, UX-DR3–10/14/15 |
| Epic 3: Learn & Services Pages | 6 | FR-005.1-5, FR-006.1-3, FR-008.1, FR-009.2-3, AD-006/007 |
| Epic 4: Blog & Sprachsystem | 4 | FR-004.1-3, AD-005, UX-DR13 |
| Epic 5: SEO, Accessibility & Deployment | 5 | NFR-002/004/005, AD-008, UX-DR12 |
| **Gesamt** | **31** | **Alle 22 FRs + 5 NFRs + 9 ADs + 15 UX-DRs** |
