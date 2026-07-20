# Use-Cases-Sektion — Design

**Datum:** 2026-07-17
**Branch:** `worktree-usecases`, rebased auf `why-robotmk` (erledigt)

## Ziel

Eine neue Hauptmenü-Kategorie „Use Cases" mit Dropdown und sechs Unterseiten. Jede Seite
benennt präzise ein Problem aus dem Betriebsalltag und zeigt, wie Robot Framework es löst.

Die Sektion trägt das **Breiten-Argument**: eine Sprache, jede Technologie. Das ist das
Argument gegen Einzweck-Werkzeuge und es entsteht erst aus der Summe der Seiten — deshalb
bekommt die Übersichtsseite eigenes Gewicht.

**Arbeitsteilung mit bestehenden Sektionen:** Die Why-Robotmk-Seite trägt das Checkmk- und
Pricing-Argument. Die Use Cases tragen die technische Breite. Deshalb bekommt keine
Use-Case-Seite einen eigenen Checkmk-Abschnitt; Checkmk erscheint ausschließlich als linke
Hälfte der Kontrast-Sicht im Beweis-Slot.

## Zielgruppen

Die zwei aus dem Redesign-Projekt:

- **Checkmk-Admins**, die Robot Framework entdecken — suchen nach Technologie
  („Citrix monitoring") und denken in Ausfällen.
- **Robot-Framework-Entwickler**, die Checkmk/Robotmk entdecken — lesen den Code.

Die gewählte Achse bedient beide: Der Admin googelt die Technologie, findet die Seite und
liest eine Überschrift, die seinen Montagmorgen beschreibt.

## Achse: Use Case, nicht Library

Die Seiten sind nach **Use Cases** geschnitten, nicht nach Libraries. Libraries sind das
Mittel und erscheinen innerhalb der Seite, nie im Titel.

Citrix ist der Beleg, dass das trägt: eine Use Case, zwei Libraries (Browser startet den
Browser, ImageHorizon übernimmt per Bilderkennung), keine davon namensgebend. Eine
Library-Achse hätte diese Seite gar nicht bilden können.

Pattern pro Seite: **Problem → Warum es weh tut → Wie RF es löst → Beweis → Code.**

## Phase 1: sechs Use Cases

| Slug | Problem-Satz (H1) | Libraries | Beweis-Slot |
|---|---|---|---|
| `web` | „Der Checkout bricht ab — und keiner merkt es." | Browser | GIF |
| `citrix` | „Die Filiale kommt morgens nicht rein." | Browser + ImageHorizon | GIF |
| `sap-gui` | „Die Transaktion hängt. Alle Server sind grün." | SapGui | GIF |
| `windows-desktop` | „Der Client von 2009, den keiner ablöst." | ImageHorizon + PlatynUI | GIF |
| `rest-api` | „200 OK heißt nicht, dass der Auftrag angelegt wurde." | Requests | Kontrast |
| `saas` | „Die Statuspage sagt grün. Deine Leute sagen was anderes." | Browser | Kontrast |

Die Problem-Sätze sind Startpunkt, nicht Gesetz — Simon passt sie beim Schreiben an.

**Zwei Seiten mit besonderem Winkel:**

- **REST API** muss offensiv abgrenzen, *warum überhaupt* Robot Framework: Checkmk kann
  HTTP-Checks längst selbst. Der Grund ist nicht „URL antwortet mit 200", sondern die
  mehrstufige Transaktion mit Zustand — Token holen, Auftrag anlegen, Status pollen,
  verifizieren, aufräumen. Ohne diese Abgrenzung fragt der Checkmk-Admin zu Recht „wozu?".
- **Windows Desktop** ist die einzige Seite mit zwei konkurrierenden Ansätzen statt einem:
  Bildvergleich (ImageHorizon — sieht, was der Mensch sieht, aber pixelabhängig) gegen
  PlatynUIs API-Zugriff auf den UI-Baum (robust, RF-first). Das ist kein Makel, sondern der
  Inhalt der Seite.

## Phase 2

- **Mainframe / 3270** (`Mainframe3270Library`) — „Der grüne Bildschirm, an dem das
  Geschäft hängt." Nische, aber Banken und Versicherungen, und dort ohne Konkurrenz.
  Verschoben, weil Screenshot-Material und Nutzungsrechte ungeklärt sind und Erfahrung
  fehlt. Blockiert die anderen sechs nicht.
- Zweite Reihe: E-Mail-Roundtrip, Datenbank-/Batch-Jobs (schwächer, weil Checkmk DBs nativ
  überwacht), Drucken, Login/SSO mit MFA-Strecke.

## Beweis-Slot

Vier Seiten bekommen ein Loop-GIF aus einer echten Umgebung (Web, Citrix, SAP, Desktop).
Zwei nicht — und bei REST API ist das **keine Ressourcenfrage, sondern inhärent**: Ein
API-Test ist unsichtbar, da bewegt sich kein Cursor.

Deshalb ist das Muster **nicht GIF-zentriert**. Der Beweis-Slot füllt genau eines:

1. **Loop-GIF**, wo eins existiert — die Kür.
2. **Kontrast-Sicht** als universeller Rückfall: links die Checkmk-Services, rechts der
   RF-Test dazu. Für alle Seiten produzierbar (nachgestellt).

Ergebnis: Alle Seiten sind strukturell identisch, keine sieht dünn aus. Die Rückfall-Logik
sitzt im Layout, nicht in der Disziplin des Autors.

## Seitenmuster (Subpage)

```
┌─────────────────────────────────────┐
│ USE CASE · CITRIX          (eyebrow)│
│ Die Filiale kommt morgens nicht rein│  ← H1 = Problem
│ Session startet, App hängt im Splash│  ← Teaser
│   [isometrisches Gitter im Hintergrund]
├─────────────────────────────────────┤
│  ▶ BEWEIS-SLOT                      │  ← GIF oder Kontrast-Sicht
├─────────────────────────────────────┤
│ WARUM ES WEH TUT │ WIE RF ES LÖST   │
├─────────────────────────────────────┤
│ *** Test Cases ***        [.robot]  │  ← ohne Syntax-Highlighting, s.u.
├─────────────────────────────────────┤
│        [ Clarity Call buchen → ]    │
└─────────────────────────────────────┘
```

## Übersichtsseite `/use-cases/`

Karten-Grid mit sechs Karten, jede mit dem Problem-Satz als Aufhänger. Diese Seite trägt
das Breiten-Argument, das keine Einzelseite liefern kann.

Der Menüpunkt „Use Cases" verlinkt auf sie **und** öffnet das Dropdown — der Klick landet
also nicht im Leeren.

Gerendert über `layouts/use-cases/list.html` aus `_index.{de,en}.md`. Die Karten ziehen
`problem` und `libraries` aus dem Front Matter der Kinder (`.Pages`), damit Übersicht und
Subpage nicht auseinanderlaufen können.

## Architektur

### Content-Modell: Page Bundles

Wie im Blog, nicht wie `data/*.yaml`:

```
content/use-cases/
  _index.de.md
  _index.en.md
  citrix/
    index.de.md
    index.en.md
    img/citrix.gif
    img/citrix-contrast.png
```

**Warum Bundles statt `data/`:** Das GIF liegt neben seinem Text. Use Cases sind text- und
asset-schwer; `data/`-YAML trennt beides über die halbe Repo-Struktur. (Die
Why-Robotmk-Sektion nutzt `data/` zu Recht — sie ist zahlen-, nicht asset-getrieben.)

Front Matter trägt die strukturierten Felder, der Body die Prosa:

```yaml
---
title: "Citrix"
weight: 20
problem: "Die Filiale kommt morgens nicht rein."
teaser: "Session startet, App hängt im Splash. Checkmk sagt: alles grün."
libraries: ["Browser", "ImageHorizon"]
proof:
  gif: "img/citrix.gif"
  contrast: "img/citrix-contrast.png"
---
```

### Layouts

- `layouts/use-cases/single.html` — rendert Hero, Beweis-Slot, Libraries und CTA aus dem
  Front Matter; der Markdown-Body liefert die zwei Prosa-Blöcke und den Code-Fence.
- `layouts/use-cases/list.html` — Karten-Grid der Übersicht.

Damit ist „einheitlich" **erzwungen** statt Disziplinsache: Ein Autor kann eine Seite nicht
versehentlich anders aussehen lassen.

### Menü — zwei Render-Pfade

**Gerendert wird `layouts/partials/nav.html`** (via `baseof.html:35`).
`layouts/partials/menu.html` und `header.html` sind auf diesem Branch **toter Code** und
werden nicht angefasst.

`nav.html` rangt an zwei Stellen flach über `.Site.Menus.main`:

- **Zeile 16** — Desktop-Leiste `.nav__links`. Braucht ein Dropdown (Hover **und**
  Tastatur/Klick, sonst ist es nicht bedienbar).
- **Zeile 68** — Mobile Full-Screen-Overlay `.nav__overlay-links`. Braucht ein Akkordeon
  oder eine eingerückte Unterliste. Ein Hover-Dropdown wäre hier Unsinn; im Full-Screen-
  Overlay ist Platz für eine offene Unterliste.

Menü-Einträge kommen wie alle anderen aus `hugo.yaml` (pro Sprache, explizite URLs) — nicht
aus dem Front Matter. Gemischte Quellen machen die Navigation unlesbar; wer `hugo.yaml`
öffnet, soll das ganze Menü sehen.

```yaml
- identifier: usecases
  name: "Use Cases"
  url: "/de/use-cases/"
  weight: 4
- name: "Citrix"
  parent: usecases
  url: "/de/use-cases/citrix/"
  weight: 20
```

**Die Gewichte müssen umnumeriert werden.** Aktuell belegt: Home 1, Robotmk Bridge 2,
Why Robotmk 3, Services 4, Blog 5. Use Cases gehört zwischen Why Robotmk und Services —
das Menü liest sich dann als Argument (Why) → Beleg (Use Cases) → Kauf (Services). Also
Use Cases auf 4, **Services auf 5, Blog auf 6** — in beiden Sprachen. Ohne das kollidiert
Use Cases mit Services auf Gewicht 4 und Hugo sortiert die beiden nach Name, was niemand
beabsichtigt.

CSS dafür in `assets/css/components/nav.css` (Dropdown gehört zur Nav-Komponente, nicht
zur Use-Cases-Sektion).

### Code-Blöcke: kein Syntax-Highlighting

**Empirisch geprüft (Hugo 0.124.1):** Chroma hat **keinen RobotFramework-Lexer**.
` ```robotframework `, ` ```robot ` und ` ```RobotFramework ` kommen alle als Klartext
heraus; Kontrollgruppe ` ```bash ` und ` ```python ` highlightet einwandfrei. Das ist kein
Konfigurationsfehler, der Lexer existiert nicht.

Die `.robot`-Snippets werden deshalb **ohne Syntax-Coloring** gesetzt: Monospace, Rahmen,
Token-Farben, gute Zeilenhöhe. Kein JS, keine Fremdbibliothek, kein selbstgebauter
Highlighter. Bewusst gegen die ursprüngliche Anforderung „mit Syntax-Highlight"
entschieden — der Preis (Prism.js oder ein handgeschriebener Render-Hook) steht in keinem
Verhältnis zum Gewinn.

Fence-Sprache bleibt ` ```robot ` wie im Blog. Sie färbt nichts, benennt aber die Sprache
im `data-lang`-Attribut und hält die Konvention einheitlich.

**Bestandsbefund, nicht Teil dieses Plans:** Die `robot`-Blöcke in
`content/blog/ihl-skimage-pr/` sind aus demselben Grund seit jeher unformatiert. Und
Chroma backt wegen `noClasses: true` (Default) Monokai als Inline-Style ein
(`background-color:#272822`) — bestehende Code-Blöcke folgen deshalb keinem Theme-Token.
Beides gehört in `TODO.md`, nicht in diesen Plan.

### CSS

Neu: `assets/css/sections/use-cases.css`, eingehängt in die Concat-Slice in
`layouts/partials/head/css.html`. **Kein bedingtes Laden pro Section** — das Repo bündelt
alles zu einer fingerprinted `main.css`, und ein Sonderweg für diese eine Sektion wäre
Inkonsistenz ohne Gegenwert.

Nutzt die Tokens aus `assets/css/tokens.css` — keine eigenen Farb- oder Abstandswerte.

**Hero-Motiv:** Das isometrische Gitter aus `why-hero-motif.html` wird aufgegriffen, damit
beide Sektionen zusammengehören — **ohne die grünen Strahlen**. Simons Commit hat sie
bereits entfernt; das Motiv wird als wiederverwendbares Partial verallgemeinert, statt es
zu kopieren.

## Risiken

**Dropdown an zwei Render-Pfaden** — die eigentliche Arbeit. Desktop-Dropdown und
Mobile-Akkordeon sind zwei verschiedene Interaktionen über derselben Menü-Datenstruktur.
Beide müssen getestet werden, das Desktop-Dropdown auch per Tastatur.

Frühere Einschätzung revidiert: Der `@critical`-Eintrag „responsive design: schmäler →
Menubar crappy" im `TODO` bezieht sich auf das tote `menu.html`. `nav.html` hat einen
sauberen Hamburger mit `aria-expanded`/`aria-controls` und Breakpoint bei 768px. Das
Risiko ist deutlich kleiner als zunächst angenommen. **`TODO` entsprechend nachziehen.**

**Asset-Nachschub** — sechs Seiten × zwei Sprachen = 12 Texte, dazu vier GIFs und zwei
Kontrast-Sichten. Das ist der übliche Punkt, an dem so etwas auf halber Strecke
liegenbleibt. Das Muster ist deshalb so gebaut, dass eine Seite auch ohne GIF vollständig
aussieht.

## Verworfene Alternativen

- **Reine Library-Achse** — hätte Citrix nicht abbilden können und läse sich wie ein
  Library-Katalog, nicht wie ein Kaufgrund.
- **Reine Business-Szenario-Achse** — verfehlt die Tech-Keywords, nach denen die Zielgruppe
  sucht.
- **GIF-Hero** — zwei von sechs Seiten können den Slot nicht füllen.
- **Split-Screen** — `.robot`-Code braucht Breite; auf Mobil klappt ohnehin alles
  untereinander.
- **Checkmk-Screenshots pro Seite aus echten Umgebungen** — verworfen. Sechs Umgebungen
  wären nötig; die nachgestellte Kontrast-Sicht liefert dasselbe Argument.
- **Eigenes Mini-Token-Set auf `main`** — verworfen, deshalb der Rebase auf `why-robotmk`.
  `main` hat einen 1359-zeiligen Mainroad-Monolithen ohne ein einziges Custom Property;
  „einheitliches Design" ist dort nicht einlösbar.

**Kopplung, die daraus folgt:** Use Cases können erst live gehen, wenn `why-robotmk` landet.
Bewusst akzeptiert.

## Aufräumen (nebenbei)

Nach Simons Beams-Entfernung sind zwei Leichen übrig: der `why-beam`-Gradient in den
`<defs>` von `why-hero-motif.html` und die Regel `.why-hero__motif-beams` in
`why-robotmk.css`. Der Kommentar oben behauptet weiterhin „two teal beams echo its light
shafts". Beim Verallgemeinern des Motivs mit entfernen.

## Hinfällig geworden

Die erste Fassung dieser Spec führte „`git submodule update --init`" als blockierende
Voraussetzung. **Falsch:** `theme:` steht auf `why-robotmk` nicht mehr in `hugo.yaml`, die
Theme-Abhängigkeit ist bereits entfallen. Der Build läuft mit leerem `themes/mainroad`.
