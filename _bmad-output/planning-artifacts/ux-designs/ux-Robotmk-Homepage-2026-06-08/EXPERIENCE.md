---
title: robotmk.org Redesign — UX Experience Specification
status: final
created: 2026-06-08
updated: 2026-06-08
---

# Foundation

**Form-factor:** Web — desktop-first, fully responsive down to 375px mobile. Target users (IT professionals, sysadmins) are primarily at a desk; mobile is a secondary surface for reading blog content.

**UI System:** Custom design system — no external component library. Visual identity reference: `DESIGN.md` (Precision Dark).

**Framework:** Hugo Static Site Generator. No client-side JS framework. Interactions are CSS-driven where possible; minimal vanilla JS for navigation toggle and form handling only.

**Languages:** English (primary), German (secondary). Every page ships in both languages. Language switcher in navigation. Language switch within Blog section must stay within Blog (not redirect to homepage) — this is a known bug in v0 to fix.

**Sources:** PRD `_bmad-output/planning-artifacts/prds/prd-Robotmk-Homepage-2026-06-08/prd.md` (final).

---

# Information Architecture

## Site Map

```
robotmk.org/
├── / (Home)                    ← Primary conversion surface
├── /learn/                     ← Full product ladder
│   ├── Lead magnets (downloads)
│   ├── Blueprints (Coming Soon)
│   ├── Video courses
│   └── → lp.robotmk.org/masterclass (external)
├── /services/                  ← High-touch service offerings
│   ├── Clarity Call (booking widget)
│   ├── Kickoff-Paket
│   ├── PRO Partnership
│   └── GROWTH Partnership
├── /blog/                      ← Content hub (existing, enhanced)
│   ├── /{year}/{slug}/         ← Individual posts (leaf bundles)
│   └── /tags/, /categories/    ← Revised taxonomy
└── /about/                     ← Founder + story + Checkmk relationship
```

**Navigation label:** `Home | Learn | Services | Blog | About | [Clarity Call buchen →]`

The "Clarity Call buchen →" item is a persistent primary CTA button (accent fill), not a nav link.

## URL Structure

Hugo multilingual with language prefix:
- English: `/en/`, `/en/learn/`, `/en/services/`, `/en/blog/`, `/en/about/`
- German: `/de/`, `/de/learn/`, `/de/services/`, `/de/blog/`, `/de/about/`
- Default redirect: `/` → `/en/`

---

# Voice and Tone

**Character:** The voice of a practitioner who has solved the problem — not a marketer who is selling it.

**Register:** Direct. Specific. No hedging. Simon speaks from experience, not aspiration.

**Rules:**
- Lead with the problem before the solution — always. The visitor must feel understood before they are pitched.
- Use real numbers: `$14,000 / minute`, `4 days`, `€3,300` — not "significant cost savings" or "affordable options."
- "You" not "one." Address the visitor directly.
- Technical terms are allowed when the audience knows them; never explain what "Robot Framework" is at the top of a page where it appears in the headline.
- The Monitoring Gap is a proper noun. Always capitalized. Used as a unifying concept across the site.
- Tagline is immutable: *"And the monitoring said: everything is green."* Used in Hero only.

**Microcopy patterns:**
- CTAs: Action verb + object + optional directional. "Clarity Call buchen →" not "Get Started."
- Empty states: What to do, not what went wrong.
- Badge copy: "Erfinder von Robotmk" not "Robotmk Creator" (German preferred for credentials even on EN pages — more precise).
- Error messages: Plain cause + plain action. Never blame the user.

---

# Component Patterns

Visual specs (colors, typography, spacing, shape) live in `DESIGN.md`. This section defines behavior only.

## Navigation

**Structure:** Logo (left) · Nav links (center) · CTA button (right). On mobile: hamburger toggle collapses center and right into a full-screen overlay menu.

**Sticky behavior:** Always solid from the first pixel. No transparent-then-solid transition. The nav is a fixed anchor — it does not transform on scroll.

**Active state:** Current page link has `2px solid {colors.primary}` underline, full-opacity text.

**Language switcher:** Appears in nav (or sub-nav) as `EN | DE`. Switching language navigates to the translated equivalent of the current page — not to the homepage. This is a hard requirement and a fix over v0 behavior.

## Hero Section

**Layout:** Two-column split at viewport height. Left: text + CTAs. Right: The Gap Visualization. On mobile: stacked — visualization below text, scaled to 100% width.

**Left column content:**
1. Eyebrow label (`label` typography, `{colors.primary}`): `SYNTHETIC MONITORING`
2. H1 display headline (Space Grotesk 56px bold): Two-line construction. The word "green" in the second line is colored `{colors.primary}` to set up the irony with the tagline.
3. Subline (Inter 18px, `on-surface-variant`)
4. Tagline (*"And the monitoring said: everything is green."* — Inter italic, `on-surface-muted`, smaller)
5. CTA row: Primary button ("Clarity Call buchen →") + Ghost button ("Wie es funktioniert ↓")

**Right column — The Gap Visualization:**

A purpose-built diagram (SVG or structured HTML/CSS). Not a screenshot. Three visual zones:

- **Zone 1 — Infrastructure** (`surface` background): Status row with 4 items (Server, Network, Database, Services) each showing ✓ in `{colors.primary}`. Prominent label "Everything green ✓" in accent.
- **Zone 2 — The Gap**: Explicit visual gap (empty space + `2px dashed {colors.error}` border). Label: `← Monitoring Gap →` in `{colors.error}`.
- **Zone 3 — User Experience** (`surface-low` background): 4 items (Login, Checkout, Search, Payment) showing ✗ in `{colors.error}` or loading state. Prominent label "$14,000 / min" in `{colors.error}`.

The visualization is static by default. Optional: a subtle CSS animation where the Gap zone pulses every 4 seconds (opacity 0.6 → 1.0 → 0.6). Animation must be `prefers-reduced-motion` aware — disable entirely if reduced motion is set.

## Stats Bar

Horizontal three-column row. Each column: large number (`display` scale) + descriptor (`body-sm`, `on-surface-variant`). Columns separated by `1px solid {colors.surface-border}` vertical rules.

**Values:**
1. `$14,000 / min` (in `{colors.error}`) — "Durchschnittliche Kosten einer Minute Ausfall"
2. `2.5×` (in `{colors.primary}`) — "Kostensteigerung in 10 Jahren (2014–2024)"
3. `#1` (in `{colors.primary}`) — "Meistgenutztes Synthetic Monitoring Plugin für Checkmk"

Hard top border: `2px solid {colors.primary}`.

## Die Lösung Section

**Flow diagram:** Three nodes in horizontal sequence with directional arrows between:
`[Robot Framework]` → `[Robotmk]` → `[Checkmk Synthetic Monitoring]`

The middle node (Robotmk) has an accent border to signal it as the connector. Each node is a card with an icon area and a short label.

**Entry point cards** (below the flow diagram): Two equal cards side by side.
- Left: "Ich nutze Checkmk" — pain acknowledgment + reassurance — CTA to `/learn/`
- Right: "Ich nutze Robot Framework" — opportunity framing — CTA to GitHub Codespace

On mobile: stacked vertically.

## Founder Section

**Layout:** 40/60 split. Photo (left, 40%) · Text (right, 60%).

**Photo:** Simon Meggle, professional portrait. Displayed in a sharp-bordered container (no circular crop). Logo asset TBD — will be provided by Simon. Placeholder gray rectangle until asset delivered.

**Text block:**
1. H2: "Erfunden. Perfektioniert. Nativ in Checkmk."
2. Bio paragraph: First-person, 3–4 sentences from the 2009 origin story. "Seit 2009 arbeite ich an der Frage..."
3. Two credential badges: "🔧 Erfinder von Robotmk" + "📋 Product Manager Synthetic Monitoring @ Checkmk"
4. Ghost CTA: "Meine Geschichte →" → `/about/`

The Checkmk partnership badge must be immediately readable. This is the most important trust signal on the page for Benjamin.

## Product Cards (Learn / Services Pages)

Cards use the `card` component from DESIGN.md. Hover state: border changes from `surface-border` to `{colors.primary}`.

**Learn cards** include:
- Level indicator (Beginner / Intermediate / Advanced) as a `badge` in top-right corner
- Category icon (placeholder circle, 48px)
- Title (headline-sm)
- One-line description (body-sm, on-surface-variant)
- Price (headline-sm, primary color) or "Kostenlos"
- CTA button

**Services cards** omit level/category and emphasize the engagement model (one-time vs. recurring).

## GROWTH Partnership Highlight

The GROWTH Partnership card receives special visual treatment vs. PRO:
- Accent top border (2px solid primary) — "recommended" signal
- "Early Access" badge prominently displayed
- List of upcoming Early Access Training topics (partially revealed — creates anticipation)

## Testimonials

Three equal cards in a row. Structure per card:
- 5 stars (★★★★★ in `{colors.primary}`)
- Quote text (body-md, italic)
- Author name (Inter semibold) + Company (on-surface-variant)
- Optional: role/title

All placeholder content until Simon provides real testimonials. The section must be built with placeholder copy so it is visible and measurable in analytics even before real testimonials land.

## Newsletter CTA Section

Full-width `{colors.primary}` background. Dark text (`{colors.on-primary}`). Inline form: email input + "Abonnieren" button (dark fill). Connects to GetResponse via existing integration. Double opt-in required (GDPR). The button text never says "Submit."

---

# State Patterns

## Interactive States

| Component | Default | Hover | Active / Pressed | Disabled |
|---|---|---|---|---|
| button-primary | Accent fill | Accent-dim fill | Scale 0.98 | 40% opacity, cursor not-allowed |
| button-ghost | Transparent | Accent 8% fill | Scale 0.98 | 40% opacity |
| card | Surface bg | Primary border | — | — |
| nav link | on-surface-variant | on-surface | Primary underline (active page) | — |
| input | Surface-border | Primary border | Primary border + focus ring | — |

## Empty / Loading States

**Blog section (homepage):** If no posts are returned, show nothing — do not show an error or an empty grid. The section is simply absent.

**Lead magnet downloads:** After email submit, replace form with: "Check your inbox! We've sent the download link." Same container, no page reload.

## Language Fallback

If a page exists in English but not yet in German (during transition): serve the English version with a banner: "Diese Seite ist noch nicht auf Deutsch verfügbar. / This page is not yet available in German." Banner dismissible, cookie-persisted.

---

# Interaction Primitives

**Scroll-linked behavior:** The Gap Visualization pulse animation plays on scroll-into-view, not on page load. Uses `IntersectionObserver` with a 200ms delay. Respects `prefers-reduced-motion`.

**CTA hierarchy:** Every page has exactly one `button-primary` visible above the fold. Secondary actions use `button-ghost`. Never two `button-primary` side by side — the "Clarity Call buchen →" in the nav counts as the page's primary CTA when the hero is scrolled past.

**External links:** All links to `lp.robotmk.org`, GitHub Codespace, Thrivecart, and Thinkific open in `target="_blank"` with `rel="noopener noreferrer"`.

**Form feedback:** Client-side email validation on blur (not on submit). No CAPTCHA on newsletter form — GetResponse handles spam at the API level.

**Blog language switching:** On a `/en/blog/my-post/` page, the language switcher navigates to `/de/blog/my-post/` (or `/de/blog/` if the German translation does not exist). Never to `/de/`.

---

# Accessibility Floor

**Contrast:**
- Body text on background: `#e8edf2` on `#1e262e` — ratio ≥ 7:1 (AAA) ✓
- Accent on background: `#15D1A0` on `#1e262e` — ratio ≥ 4.5:1 (AA) — verify with final assets ⚠️
- Error red on background: `#ff6b6b` on `#1e262e` — verify ⚠️
- In light mode: verify all text meets AA (4.5:1 minimum)

**Keyboard navigation:** Full keyboard operability. Tab order follows visual reading order. Focus ring: `2px solid {colors.primary}`, `outline-offset: 3px`. Never `outline: none` without a visible alternative.

**Screen readers:**
- The Gap Visualization must have an `aria-label` describing the diagram: "Diagram showing the Monitoring Gap: infrastructure monitoring shows all green while user experience shows failures."
- All icon-only buttons have `aria-label`.
- Stats bar numbers are in `<strong>` or heading elements, not decorative spans.

**Motion:** All CSS animations and transitions wrapped in `@media (prefers-reduced-motion: no-preference)`. Default (no preference stated) is no animation.

**Language:** `lang` attribute on `<html>` set to current language code (`en`, `de`). Hugo handles this via `.Site.Language.Lang`.

---

# Key Flows

## Flow 1 — Benjamin: Checkmk Admin discovers Robotmk

**Protagonist:** Benjamin, sysadmin, runs a large Checkmk setup for a company with a mission-critical webshop. His monitoring shows green but users report failures. Under pressure from management.

**Entry:** Google search "synthetic monitoring checkmk" or "robotmk"

1. Lands on `/en/` — Hero renders immediately.
2. **Climax beat:** Reads "Your monitoring shows green. Your users are struggling." — sees the Gap Visualization. Recognizes his situation. His next action is not a bounce.
3. Scrolls to Stats Bar — `$14,000/min` confirms the business case.
4. Scrolls to Lösung section — sees the three-step flow. Understands: RF + Checkmk = the answer. Sees entry card "Ich nutze Checkmk" — clicks.
5. Lands on `/learn/` — browses course options. Sees the Masterclass is out of budget/scope for now.
6. Returns to homepage, scrolls to Founder section — reads Simon's credentials. "Product Manager Synthetic Monitoring @ Checkmk" closes the trust loop.
7. Clicks "Clarity Call buchen →" in navigation or Einstiegswege section.
8. Books a 30-minute call.

**Success:** Clarity Call booked.

## Flow 2 — Alex: RF Developer discovers Checkmk

**Protagonist:** Alex, QA engineer, writes `.robot` files daily. Tests run on-demand only. Discovers robotmk.org through a blog post or GitHub reference.

**Entry:** A blog post link, or Google search "robot framework continuous monitoring"

1. Lands on a Blog post or the Homepage.
2. If Homepage: Hero entry card "Ich nutze Robot Framework" catches his eye.
3. Clicks — sees the proposition: "Your RF skills already work here. Robotmk handled the integration."
4. Follows link to GitHub Codespace — tries it in 2 minutes without any setup.
5. Returns to site, subscribes to Newsletter.
6. Optional: books a Clarity Call if the Codespace demo convinces him.

**Success:** Newsletter signup or Clarity Call.

## Flow 3 — Returning Visitor: Seeking learning material

**Protagonist:** Someone who already knows Robotmk, visited before, wants to deepen skills.

1. Types robotmk.org directly.
2. Navigates to `/learn/` via nav.
3. Browses course cards — filters or scrolls by level.
4. Either: downloads a free Lead Magnet (Cheat Sheet) → enters email → enters newsletter.
5. Or: purchases a video course via Thrivecart link.

**Success:** Lead magnet download or course purchase.
