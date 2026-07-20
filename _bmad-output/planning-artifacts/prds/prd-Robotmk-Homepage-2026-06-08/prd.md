---
title: "robotmk.org Redesign — Product Requirements Document"
status: final
created: 2026-06-08
updated: 2026-06-08
---

# robotmk.org Redesign — PRD

## 1. Vision

> *robotmk.org ist die zentrale Anlaufstelle für IT-Teams, die Robot Framework für Synthetic Monitoring einsetzen wollen — mit klaren Lernpfaden, bewährten Dienstleistungen und einer Expertengemeinschaft um Simon Meggle als einzigen dedizierten Spezialisten in dieser Nische.*

**Nordstern:** In 18 Monaten führt die Seite regelmäßig zu First Calls, die sich zu POCs entwickeln. Newsletter-Abonnenten folgen dem Blog aktiv. Kurse und Blueprints werden kontinuierlich verkauft. Simon Meggle wird wahrgenommen als *der* Experte für Robot Framework im Synthetic Monitoring — eine Nische, die er allein besetzt.

---

## 2. Problem Statement — Die Monitoring Gap

**Das Problem in einem Satz:** Die meisten IT-Monitoring-Setups überwachen, ob die Infrastruktur läuft — aber nicht, ob Benutzer tatsächlich arbeiten können. Diese Lücke zwischen grünem Dashboard und funktionierender Anwendung ist die *Monitoring Gap*.

**Die Zahlen dahinter:** Durchschnittliche Kosten einer Stunde Ausfall: $14.000/Minute (2024, Studie über ~500 Unternehmen). 2014 waren es $5.600 — in zehn Jahren mehr als verdoppelt. Zwei Stunden Ausfall eines geschäftskritischen Webshops: $1,68 Millionen. In vielen Fällen zeigte das Monitoring dabei: alles grün.

**Das aktuelle Website-Problem:** robotmk.org war bisher primär ein Blog — ohne klare Botschaft für Erstbesucher, ohne strukturiertes Angebot, ohne niederschwelligen Einstieg. Wer die Seite fand, verstand nicht sofort, was Robotmk ist und warum er hier richtig ist.

---

## 3. Zielgruppen

### 3.1 Primär: Benjamin — Der Checkmk-Admin mit Monitoring Gap

**Profil:** Systemadministrator, 5–15 Jahre Erfahrung, hohe Checkmk-Expertise. Betreibt IT für Unternehmen mit geschäftskritischen Webanwendungen (z. B. Webshop). Nicht zwingend Python-erfahren.

**Schmerz:** Hat ein großes Checkmk-Setup, aber die Benutzerperspektive ist unsichtbar. Fehler werden erst durch User-Reports oder manuelle Tests entdeckt — obwohl Monitoring läuft. Druck von oben steigt.

**Such-Trigger:** Googelt "synthetic monitoring", "application testing checkmk", "robotmk".

**Was er braucht (0–5 Sek):** Sofortige Wiedererkennung: "Das ist mein Problem, das ist die Lösung." Dazu: die Bestätigung, beim Erfinder und Experten gelandet zu sein — nicht beim Vertrieb.

**Idealer nächster Schritt:** Clarity Call buchen — unverbindlich, 30 Minuten, konkret.

**Sekundäres Muster:** Besucher, die Robotmk bereits kennen und Lernmaterial suchen (Kurse, Blueprints, Cheat Sheets).

### 3.2 Sekundär: Alex — Der RF-Practitioner der Checkmk entdeckt

**Profil:** QA Engineer, DevOps, Testautomatisierer. Schreibt bereits `.robot`-Files. Kennt Robot Framework gut, aber Checkmk kaum oder gar nicht.

**Schmerz / Opportunity:** Seine RF-Tests laufen nur on-demand — nicht kontinuierlich. Er fragt sich nicht, ob es eine bessere Lösung gibt; er weiß noch nicht, dass es eine gibt.

**Kernbotschaft für ihn:** "Deine RF-Skills reichen bereits. Die harte Integrationsarbeit hat Robotmk übernommen. Du brauchst jetzt nur noch Checkmk."

**Idealer nächster Schritt:** GitHub Codespace starten (friktionslos, sofort) oder YouTube-Tutorial schauen. Danach ggf. Clarity Call.

---

## 4. Positionierung

### 4.1 Die Einzigartigkeit

robotmk.org ist keine Checkmk-Marketingseite. Es ist die unabhängige, authoritative Quelle — betrieben vom **Gründer und geistigen Vater von Robotmk**, der gleichzeitig als **Product Manager Synthetic Monitoring bei Checkmk** arbeitet. 

Checkmk hat Robotmk nicht gebaut. Checkmk hat den Mann eingestellt, der Robotmk gebaut hat.

Dieser Umstand muss als Vertrauenssignal sichtbar sein — nicht versteckt, sondern prominent. Er erklärt, warum es eine eigene Site gibt, und macht den Besucher sicher: *hier laufen alle Fäden zusammen.*

### 4.2 Markenarchitektur

- **Primärmarke auf der Website:** Robotmk (Simon Meggle)
- **ELABIT GmbH:** Nur im Footer (rechtlich) und in der About/Origin-Story erwähnt
- **Checkmk:** Als Partner und Plattform sichtbar — aber robotmk.org ist nicht Checkmk-owned

### 4.3 Kernbotschaft

**Für Benjamin:** "Dein Monitoring zeigt grün. Aber deine User kämpfen. Die Monitoring Gap schließt du mit Robot Framework — und Checkmk macht es einfacher als jede andere Lösung."

**Für Alex:** "Deine RF-Tests können mehr als testen. Sie können kontinuierlich überwachen. Robotmk hat die Integrationsarbeit bereits erledigt."

---

## 5. Produktlandschaft

### 5.1 Vollständige Produkttreppe

| Stufe | Produkt / Service | Preis | Primäre Zielgruppe |
|---|---|---|---|
| 0 | Blog, YouTube, GitHub Codespace, Podcast (optional) | Gratis | Alle |
| 1 | Lead Magnets: RF Debugging Cheat Sheet, VS Code Shortcuts, XPath/CSS Cheat Sheet, Monitoring Gap Calculator | Gratis + Email | Benjamin, Alex |
| 2 | Blueprints (fertige RF-Tests für Open-Source-Tools) | €29–99 / Blueprint | Beide |
| 2 | Mini-Videokurse | €99–299 | Beide |
| 3 | Themen-Kurse: "Web Testing Unfolded", "Desktop Testing", "AI-driven Test Development", "Stable Web Selectors" | €299–999 | Beide |
| 4 | Robotmk Masterclass (4 Tage, remote/on-site München) | €3.300–3.550 | Benjamin (Invest) |
| 5 | Clarity Call (kostenlos, 30 Min) | Gratis | Benjamin |
| 5 | Kickoff-Paket: Test-Review & Architektur (4 Tage) | €6.400 | Benjamin (Unternehmen) |
| 6 | PRO Partnership (8h/Monat, €200/h) | €1.600/Monat | Bestehende Kunden |
| 6 | GROWTH Partnership (2 Tage/Monat, Early Access Trainings) | €2.400/Monat | Strategische Partner |

### 5.2 Blueprint — Neue Produktkategorie

Blueprints sind fertige, einsatzbereite Robot Framework Testsuites für verbreitete Open-Source-Unternehmenstools (z. B. OTRS Login + Ticket-Suche). Sie:
- Lösen das Blank-Page-Problem für neue Nutzer
- Sind sofort deploybar (Codespace-ready)
- Sind günstiger Einstieg in das Ökosystem
- Haben einen natürlichen Service-Upsell: "Blueprint erweitern und auf Kundensystem anpassen"

Blueprint-Katalog auf der Website: filterbar nach Tool-Kategorie, mit Preview und direktem Kauf via Thrivecart.

### 5.3 GROWTH Partnership — Early Access als Retention-Feature

Das GROWTH-Modell beinhaltet exklusiven Early Access zu Trainings, die noch nicht öffentlich sind. Dieser Vorteil muss auf der Website sichtbar kommuniziert werden (nicht nur im Angebots-PDF). Geplante Topics: Playwright Advanced, AI-Integration, Mobile Testing, CI/CD, Security.

---

## 6. Site-Architektur

### 6.1 Navigationsstruktur (Hauptmenü)

```
Home | Learn | Services | Blog | About | [Clarity Call buchen →]
```

- **[Clarity Call buchen →]** als persistent sichtbarer Primär-CTA im Header (Button, Akzentfarbe)

### 6.2 Seiten-Übersicht

#### 6.2.1 Homepage (/)

Ziel: Jeden Besucher in ≤ 5 Sekunden abholen — Benjamin wie Alex — ohne für keinen zu sprechen.

Sektionen in Reihenfolge:

| # | Sektion | Zweck | Key Content |
|---|---|---|---|
| 1 | **Hero** | Sofortige Problemresonanz | Headline: Monitoring Gap benennen. Subline: "And the monitoring said: everything is green." Kurze Erklärung. Zwei CTAs: "Clarity Call" + "Learn more ↓" |
| 2 | **Was ist die Monitoring Gap?** | Problem vertieft | Grafik/Animation: Infrastruktur-Monitoring vs. User Experience Monitoring. Stat: $14.000/Minute. |
| 3 | **Die Lösung** | Produkt erklären | Simple Erklärung: RF + Checkmk = Synthetic Monitoring. Kurze Animation/Grafik "So funktioniert's". Zwei Einstiege: "Ich kenne Checkmk" / "Ich kenne Robot Framework" |
| 4 | **Warum hier?** | Vertrauen aufbauen | Simon Meggle: Foto, "Erfinder von Robotmk". "Seit 2009 arbeite ich an diesem Problem." "Seit Checkmk 2.3 ist Robotmk native Feature." Badge: Product Manager Synthetic Monitoring @ Checkmk |
| 5 | **Einstiegswege** | Conversion nach Zielgruppe | Drei Cards: "Jetzt ausprobieren" (Codespace) / "Lernen" (Kurse) / "Projekt starten" (Clarity Call) |
| 6 | **Testimonials** | Social Proof | [PLACEHOLDER: 3–5 Testimonials mit Name, Unternehmen, Foto] |
| 7 | **Aktuelle Blog-Artikel** | Content-Frische | 3 gepinnte/aktuelle Posts |
| 8 | **Newsletter CTA** | Listenaufbau | "Synthetic Monitoring Insights — alle 2 Wochen." |
| 9 | **Footer** | Navigation + Legal | Links, Social, ELABIT GmbH (klein) |

#### 6.2.2 Learn (/learn)

Ziel: Strukturierte Übersicht aller Lernressourcen. Produkttreppe sichtbar machen.

Sektionen:
- **Lead Magnets** — kostenlose Downloads (Cheat Sheets, Calculator) mit Email-Capture
- **Blueprints** — Katalog, filterbar nach Tool/Kategorie, Kauflink (Thrivecart)
- **Videokurse** — Kacheln mit Level, Dauer, Preis, CTA
- **Masterclass** — Prominenter Block, Link zur separaten LP (lp.robotmk.org)
- **GitHub Codespace** — "Sofort ausprobieren, kein Setup nötig"
- **YouTube** — Eingebettete Playlist oder Link

#### 6.2.3 Services (/services)

Ziel: Klare, kaufbare Angebote für Benjamin.

Sektionen:
- **Clarity Call** — Erklärung + Buchungs-Widget (Thinkific/Cal.com)
- **Kickoff-Paket** (€6.400) — 4 Tage Review + Architektur, Inhalte, Übergang zu Partnership
- **PRO Partnership** (€1.600/Monat) — Stundenkontingent, Konditionen
- **GROWTH Partnership** (€2.400/Monat) — Stundenkontingent + Early Access
- **Blueprint Customizing** — "Ich passe Blueprints auf dein System an"

#### 6.2.4 Blog (/blog)

Verbesserungen gegenüber Status quo:
- **Artikel pinnen:** Wichtige Artikel erscheinen immer oben (unabhängig vom Datum)
- **Verbesserte Taxonomie:** Kategorien überarbeiten für bessere Auffindbarkeit
- **Sprachauswahl-Fix:** Klick auf Sprachauswahl im Blog → bleibt in Blog-Sektion (nicht zur Startseite)
- **Featured-Artikel** sichtbar auf Homepage

#### 6.2.5 About (/about)

Sektionen:
- **Origin Story:** "Seit 2009 arbeite ich an diesem Problem..." (aus Speaker Notes)
- **Robotmk Geschichte:** Prototypen → RF entdeckt → Robotmk 2020 → native in Checkmk 2.3
- **Checkmk Partnership:** Rolle als Product Manager Synthetic Monitoring — klare, stolze Kommunikation
- **ELABIT GmbH:** Erwähnt als operatives Unternehmen hinter der Arbeit
- **Kontakt:** E-Mail, LinkedIn

---

## 7. Functional Requirements

### FR-001 — Hero Section
- **FR-001.1:** Hero zeigt die Monitoring Gap in max. 2 Sätzen + einer visuellen Metapher
- **FR-001.2:** Primärer CTA "Clarity Call buchen" ist always-visible im Header
- **FR-001.3:** Hero enthält sekundären CTA "Mehr erfahren ↓" für nicht-kaufbereite Besucher
- **FR-001.4:** Tagline "And the monitoring said: everything is green." erscheint als Hero-Subline oder Eyecatcher

### FR-002 — Erklärungsgrafik / Animation
- **FR-002.1:** Visuelle Erklärung "Was ist Synthetic Monitoring?" auf Homepage, max. 10 Sekunden zu verstehen
- **FR-002.2:** Die Homepage adressiert beide Zielgruppen (Benjamin + Alex) ohne für keine zu sprechen. Die konkrete visuelle Umsetzung (Cards, Tabs, Scroll-Pfade o. ä.) ist UX-Entscheidung (Sally). Anforderung: Benjamin (Checkmk-Admin) erhält Priorität; sein Pfad muss ohne Klick klar sein.

### FR-003 — Founder Credibility
- **FR-003.1:** Simon Meggle ist sichtbar als Person — Foto, Name, Kurzbiografie auf Homepage
- **FR-003.2:** "Erfinder von Robotmk" und "Product Manager Synthetic Monitoring @ Checkmk" explizit kommuniziert
- **FR-003.3:** Checkmk-Logo / Partnerschaftssignal auf der Seite sichtbar

### FR-004 — Blog
- **FR-004.1:** Artikel können als "pinned" markiert werden und erscheinen immer oben in der Liste
- **FR-004.2:** Sprachauswahl im Blog behält den Nutzer in der Blog-Sektion (Bug-Fix)
- **FR-004.3:** Kategorien/Taxonomie überarbeitet

### FR-005 — Produktkatalog
- **FR-005.1:** Alle Lead Magnets mit Email-Capture-Formular (GetResponse-Integration vorhanden)
- **FR-005.2:** Blueprint-Katalog filterbar nach Kategorie
- **FR-005.3:** Kurse mit Level-Badge (Beginner / Intermediate / Advanced), Dauer, Preis
- **FR-005.4:** Kauflinks führen zu Thrivecart (extern)
- **FR-005.5:** Masterclass-Block prominent mit Link zu lp.robotmk.org

### FR-006 — Services
- **FR-006.1:** Clarity Call Buchungs-Widget direkt auf der Services-Seite eingebettet
- **FR-006.2:** Partnership-Modelle (PRO / GROWTH) mit Preistabelle
- **FR-006.3:** GROWTH Early Access Vorteil explizit hervorgehoben

### FR-007 — Testimonials
- **FR-007.1:** [PLACEHOLDER] 3–5 Testimonials mit Foto, Name, Unternehmen, Zitat
- **FR-007.2:** Mindestens 1 Testimonial mit konkretem Outcome ("vorher/nachher")

### FR-008 — GitHub Codespace Integration
- **FR-008.1:** Link / CTA zu GitHub Codespace (Spielwiese) auf Homepage und Learn-Seite
- **FR-008.2:** Kurze Erklärung: "Ohne Setup, sofort im Browser ausprobieren"

### FR-009 — Newsletter
- **FR-009.1:** Newsletter-Signup auf Homepage (nach Blog-Preview-Sektion)
- **FR-009.2:** Dedizierte Newsletter-Seite bleibt erhalten
- **FR-009.3:** Lead-Magnet-Downloads triggern automatisch Newsletter-Subscription (Double-Opt-In)

---

## 8. Non-Functional Requirements

### NFR-001 — Design System
- Dark Mode ist der Default, Light Mode als Option
- Primärfarbe: #15D1A0 (Akzent)
- Hintergrund Dark: #1e262e
- Hintergrund Element: #2C3843
- Font: Technisch, modern — z. B. JetBrains Mono (Code-Aspekte) + Inter oder Space Grotesk (Fließtext)
- Klar strukturiert, keine visuellen Überladungen

### NFR-002 — SEO
- Meta-Tags für alle Seiten
- Strukturierte Daten (Schema.org) für Kurse, Person, Organization
- Primäre Keywords: "synthetic monitoring", "robot framework monitoring", "checkmk synthetic monitoring", "robotmk"
- Blog-Artikel-Taxonomie SEO-optimiert
- hreflang-Tags korrekt für EN/DE (vorhanden, aber zu prüfen)

### NFR-003 — Performance
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- Bilder: WebP, lazy loading
- Keine unnötigen Drittanbieter-Scripts ohne Consent

### NFR-004 — Technischer Stack (Constraints)
- Framework: Hugo (bestehendes Repo bleibt Basis)
- Theme: Mainroad als Basis-Theme → wird stark überschrieben/ersetzt
- Hosting: Cloudflare Pages
- Kurs-Verkauf: Thrivecart (extern, Links von der Seite)
- E-Mail: GetResponse (Integration bereits vorhanden)
- Kommentare: Giscus (bleibt im Blog)
- Buchungs-Widget: Thinkific oder Cal.com für Clarity Call
- Sprachen: EN (primär) + DE (Übersetzung folgt)

### NFR-005 — Accessibility
- WCAG 2.1 AA Kontraste (besonders wichtig bei Dark Mode + Akzentfarbe)
- Tastaturnavigation
- Alt-Texte für alle nicht-dekorativen Bilder

---

## 9. Success Metrics

| Metric | Baseline (heute) | Ziel (12 Monate) | Messung |
|---|---|---|---|
| Clarity Call Buchungen | [ASSUMPTION: ~0–2/Monat] | ≥ 8/Monat | Buchungs-Tool |
| Newsletter-Abonnenten | [ASSUMPTION: unbekannt] | +500 neue Abos | GetResponse |
| Kurs-Käufe | [ASSUMPTION: sporadisch] | ≥ 5/Monat (alle Kurse komb.) | Thrivecart |
| Blueprint-Verkäufe | 0 (neu) | ≥ 20/Monat nach Launch | Thrivecart |
| Bounce Rate Homepage | [ASSUMPTION: hoch] | < 60% | Analytics |
| Durchschn. Sitzungsdauer | [ASSUMPTION: < 1 Min] | > 2 Min | Analytics |
| Organic Search Traffic | [ASSUMPTION: gering] | +100% in 12 Monaten | Search Console |

**Counter-Metric:** Clarity Calls, die nicht zu einer weiteren Aktion führen — Frühwarnsignal für falsches Targeting oder Messaging.

---

## 10. Open Questions

| # | Frage | Owner | Priorität |
|---|---|---|---|
| OQ-1 | Aktuelle Newsletter-Abonnenten-Zahl bei GetResponse? | Simon | Hoch (Baseline) |
| OQ-2 | Analytics-Daten der aktuellen Site: woher kommt Traffic, welche Seiten werden besucht? | Simon | Hoch (Baseline) |
| OQ-3 | Checkmk-Logo: Darf es auf robotmk.org verwendet werden (Partnerschaft)? | Simon/Checkmk | Mittel |
| OQ-4 | Blueprint-Preismodell: Einzel vs. Bundle? Subscription möglich? | Simon | Mittel |
| OQ-5 | Clarity Call Tool: Thinkific oder anderes Buchungstool (Cal.com, Calendly)? | Simon | Mittel |
| OQ-6 | Sprache der neuen Homepage: EN-first mit DE-Übersetzung, oder gleichzeitig? | Simon | Mittel |
| OQ-7 | Monitoring Gap Calculator: Technisch auf Hugo umsetzbar, oder externer Embed? | Architect | Niedrig |
| OQ-8 | Bestehendes Mainroad-Theme ersetzen (Custom) oder heavy-override? | Architect | Niedrig |

---

## 11. Out of Scope (v1)

- Backend / Datenbank / eigene Kurs-Plattform (alles läuft über Thrivecart)
- Eigenes Buchungssystem (Widget-Embed reicht)
- Community-Forum / Slack (externe Links ausreichend)
- Mobile App
- Automatisiertes CRM-System
- Mehrsprachige Seite gleichzeitig launchen (DE kann nachgezogen werden)
