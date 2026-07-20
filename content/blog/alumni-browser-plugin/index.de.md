---
draft: true
title: "Zwei Welten, ein Test: BrowserLibrary und Alumnium.ai"
# --- Italic subheading
# lead: 
# -- giscus id to match comments
commentid: alumnium-plugin
# -- predefined URL
# slug: 
# -- for posts in menubar, use this (shorter) title
# menutitle: 
description: 
date: "2025-05-25T16:00:26+02:00"
categories:
  - "news"
  - "libraries"
tags:
  - "web-testing"
  - "browserlibrary"
  - "alumnium"
  - "ai"
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
thumbnail: "img/alumnititle.png"
vgwort: https://vg04.met.vgwort.de/na/d7725f5b39a847119bb4c7272a1ea668
translationKey: "alumni-browser-plugin"
---

**Was passiert, wenn man die Präzision der Browser Library mit den Möglichkeiten von KI kombiniert?**

Genau das habe ich ausprobiert – und dabei ein Plugin gebaut, das zwei Welten miteinander verbindet: die etablierte **Robot Framework** [BrowserLibrary](https://robotframework-browser.org) und [Alumnium.ai](https://alumnium.ai).

*Sehr spannend!*  
Ein Testfall, gesteuert nur durch Anweisungen an ein LLM?  
Das musste ich ausprobieren – ***und es funktionierte auf Anhieb...***

<!--more-->

---

## Hintergrund

Seit einigen Jahren schon arbeite ich in allen Kundenprojekten mit der [Browser Library](https://github.com/MarketSquare/robotframework-browser). 

Eine wahre **Allzweckwaffe**. 🏹

Vergangene Woche wurde ich neugierig durch einen Hinweis im Slack-Channel von Robot Framework auf einen Medium-Artikel mit dem Titel ["From boring scripts to AI-powered magic"](https://medium.com/@scorpian.ameya/from-boring-scripts-to-ai-powered-magic-meet-alumnirobotlibrary-your-robot-frameworks-new-best-9ea25f8311c5).  

Der Autor **Ameya Natu** kündigte darin eine neue Bibliothek für Robot Framework an – die [AlumniRobotLibrary](https://github.com/ameyanatu/alumnirobot).

**Was ist Alumnium?**

{{< figure src="img/alumnium_icon.png" >}}

> **[Alumnium.ai](https://alumnium.ai)** ist ein (noch experimentelles) Projekt.  
> Es kann menschenlesbare Kommandos mit Hilfe von LLMs (z. B. OpenAI, Anthropic, Google Gemini) in konkrete Instruktionen für **Playwright** und **Selenium** übersetzen.  
> Alumnium ist also "nicht noch ein Testing-Framework", sondern baut auf diesen Frameworks auf.

### Ein erster Test

Es war Wochenende.  
Die Arbeit im Garten war getan und der Abend war verregnet. 🌧️  
Also husch die Kinder ins Bett gebracht und an den Mac gesetzt, um die AlumniumLibrary von Ameya zu testen...

Das [Minimal-Beispiel](https://github.com/ameyanatu/alumnirobot?tab=readme-ov-file#quick-start) auf der Seite dr Library ließ sich sofort starten. 👍

Hier wird die Alumnium-Library importiert und mit den Einstellungen für das verwendete backend (Playwright), sowie dem AI-Provider (OpenAI) initialisiert:

```
*** Settings ***
Library    alumnirobot.alumni_robot_library.AlumniRobotLibrary     
...  backend=playwright    browser=chromium    headless=True   
...  ai_provider=openai    ai_model=gpt-4o    api_key=YOUR_OPENAI_API_KEY
```


Der Test öffnet ein Browser-Fenster und übergibt dann jeweils die Anweisung und den aktuellen Seitenkontext (basierend auf dem Accessibility-Tree) an die KI; anhand der Antworten kann die Library dann Aktionen für das Backend (Playwright) erstellen: 

```
    Open Browser And Init Alumni    ${LOGIN_URL}
    Alumni Do    enter ${user['username']} into username field
    Alumni Do    enter ${user['password']} into password field
    Alumni Do    click the login button
    Alumni Check    page contains error message
    Alumni Quit
```

### Zwei Libraries, zwei Architekturen - zwei Welten

Mein naiver Versuch, BrowserLibrary zusammen mit der AlumniumLibrary zu verwenden, scheiterte. :-(

Die Browser Library kommuniziert mit Playwright über einen **asynchronen gRPC-Kanal**.  
Dabei wird jede Anweisung wird separat an den Driver (Playwright/Selenium) übermittelt.

Alumnium hingegen nutzt das **synchrone** Python-Interface von Playwright: `sync_playwright.start()` - für KI-gesteuerte Sequenzen offensichtlich absolut ausreichend.

> **Aus diesem technischen Grund schließen sich die beiden Libraries leider gegenseitig aus**; ihre Keywords lassen sich nicht gemeinsam in einem Test case verwenden.

Ich wollte eine Lösung dafür finden. 

---

## Lösung


### Das Beste aus beiden Welten: Alumnium als Plugin für die BrowserLibrary

Zunächst versuchte ich, den Code der Alumnium-Library so zu modifizieren, dass er den von der Browser-Library gestarteten Browser verwenden kann.  
Allerdings muss Alumnium mit dem Page-Objekt instantiert werden, das man von Playwright erhält.  
Eine Integration in dieser Richtung hätte also einen viel zu starken Eingriff in die BrowserLibrary erfordert.

**Da erinnerte ich mich an etwas**: die BrowserLibrary kann mit dem Keyword [Connect To Browser](https://marketsquare.github.io/robotframework-browser/Browser.html#Connect%20To%20Browser) auch einen anderen "fremden" Browser automatisieren, wenn dieser mit der Option `--remote-debugging-port=<port>` gestartet wurde.  
Auf diesem Port (`http://127.0.0.1:<port>`) verbindet sich die Library und kann den Browser dann per **Chrome DevTools Protocol** steuern. 

Also versuchte ich die andere Richtung: ich erweiterte die BrowserLibrary über die [Python-Plugin-API](https://marketsquare.github.io/robotframework-browser/Browser.html#Plugins) um die folgenden **Alumnium-Keywörter**: 

- `New AI Browser`: erzeugt eine Browser-Instanz mit offenem CDP-Port, auf den sich die BrowserLibrary direkt verbindet
- `New AI Page`: erzeugt eine neue Page, mit der Alumnium instantiiert wird
- AI-Keywords: 
  - `AI Do`: Führe Aktion aus
  - `AI Check`: Führe Assertion aus
  - `AI Get`: Lese Wert aus der Seite (zum Speichern in einer Variablen)

**Und es klappte!** 🎉  

Über ein Borwserlib-Plugin existiert nur eine einzige Browserinstanz.  
Ich kann damit den Browser innerhalb eines Tests **gleichzeitig** mit den Keywords von Alumnium (für KI-Aktionen) **und**  der Browser Library (für klassische Keywords) steuern.

### Die Lösung im Detail

{{< figure src="img/rf-tests.png" title="Der gleiche Taschenrechner-Test mit KI (oben) und Browserlib (unten)" >}}

1. Mit der Anweisung ***"Calculate the sum of 2 + 2. Then Multiply the result by 12 and then divide it by 6"*** übergebe ich der KI gleich eine ganze Reihe von Anweisungen.  
Nach meinen Experimenten kann ich schon mal sagen: die Anweisung muss umso präziser verfasst sein, je mehr Einzelschritte enthalten sind. (Vereinzelt wurde im Test auch "*2+2*12/6*" gerechnet und der Test schlug natürlich dann fehl.)
2. Im BrowserLib-Test muss jede Eingabe im Taschenrechner zeilenweise angegeben werden.  
Das ist länger, klar. Dafür aber umso **präziser** und nebenbei auch noch **schneller**. 


{{< figure src="img/alumnium-calc.gif" title="Die Taschenrechner-Tests von oben in Action. Gut zu sehen: KI kostet Zeit..." >}}


---

## Ausblick


### Installation und Verwendung

Neben Python und NodeJS sind Robot Framework und BrowserLibrary sind Grundvoraussetzung.  
Die zweite Zeile zeigt die Installation des PLugins: 

```
pip install robotframework==7.2 robotframework-browser==19.3
pip install robotframework-alumniumbrowserplugin==0.1.4
```

> Ersetze die Versionsnummer 0.1.4 ggf. durch eine aktuellere, die Du unter [diesem Link](https://pypi.org/project/robotframework-alumniumbrowserplugin/) findest. 

Das von der BrowserLibrary her bekannte `rfbrowser init` würde nebst Playwright auch die Binaries der drei untersützten Browser laden.  
Hier läuft das anders: Alumnium installiert sein "eigenes" Playwright, dessen Browser (Chromium) die BrowserLibrary über den CDP-Port mitnutzt. Deshalb müssen beide Befehle ausgeführt werden: 

```
# Initialisierung der BrowserLibrary (ohne Laden der Browser-Binaries)
rfbrowser init --skip-browsers
# Initialisierung von Playwright für Alumnium, Installieren von Chromium
playwright install chromium
```

**Lade das Plugin** mit der Browser Library in einem .robot-File:

```
*** Settings ***
Library   Browser  plugins=AlumniumBrowserPlugin
```

Start der Browser-Instanz:

```
    New AI Browser  browser=chromium  headless=False
    ...    ai_model=${AI_MODEL}
    ...    api_key=${AI_API_KEY}
```

Die drei Variablen am besten nicht im .robot-File hinterlegen, sondern Robot Framrowrk auf der Kommandozeile mit `--variable` übergeben.  

✨ **Bonus-Tipp**: 

- `${AI_MODEL}` in **robot.toml** ablegen (z.b. `openai/gpt-4o`)
- `${AI_API_KEY}` in **.robot.toml** (diese wird in in **.gitignore** aufgenommen und nicht ins Git committed)

### Große Auswahl an LLMs

Alumnium unterstützt die ganze Bandbreite [cloudbasierter LLM-Modelle](https://alumnium.ai/docs/getting-started/configuration/):

{{< figure src="img/aimodels.png" title="Von Alumnium unterstützte AI-Modelle" >}}

<!-- Darüber hinaus ist es auch möglich, die URL zu einem **lokalen, selbst gehosteten LLM** anzugeben.  -->


### Was das wirklich bringt

Ehrlich gesagt: **eine genaue Meinung muss ich mir darüber erst noch bilden.**  

Präzise CSS/XPath-Selektoren sind unschlagbar und sind der Garant für robuste Tests.  
Deshalb habe ich diesem Thema in meinem Training für Synthetic Monitoring sogar ein eigenes Modul gewidmet.  

Sämtliche Testschritte ab sofort nur noch von der KI übersetzen zu lassen ist sicher nicht die Lösung.

Starte doch einfach mal das Beispielprojekt: [https://github.com/simonmeggle/rf-alumniumbrowserplugin-example](https://github.com/simonmeggle/rf-alumniumbrowserplugin-example) und beobachte die beiden Testfälle:

- Der **native Test** mit der Browser Library flitzt in Rekordzeit durch die gleiche UI 🏎️
- Der **AI-Test** wirkt fast meditativ 🧘‍♀️ – die KI analysiert die Seite, überlegt, generiert die passenden Playwright-Befehle... 💤

👉 Vernünftig und selektiv eingesetzt kann Alumnium für BrowserLibrary aber einen echten **Mehrwert** bieten. 

Ich denke da zum Beispiel an folgendes praktisches **Beispiel**:  

➡️ Ein **Product Owner** beschreibt einen Test in natürlicher Sprache.  
➡️ Die KI setzt diesen in **ausführbaren Code** um – lauffähig, aber noch nicht optimal.  
➡️ Der Test Automation Engineer übersetzt den Test später mit **präzisen, performanten Keywords** und **spezifischen Selektoren**.

**Weitere Ideen:** 

- **Frühes Prototyping**: Stell Dir vor, Du hast eine grobe Anforderung und musst daraus schnell lauffähige Tests erzeugen
- Hilfe bei **komplizierten DOM-Strukturen**: Alumnium kann sicher helfen, wenn bestimmte Selektoren nur sehr umständlich (oder mit Workarounds) zu bestimmen sind. 
- **Explorative Testautomatisierung**: Du beschreibst das Ziel und lässt die KI den Klickpfad bauen. (Stelle ich mir spannend vor!)
- **Validierung nach UI-Änderungen**: Um schnell zu prüfen, ob die Kernfunktionen noch verfügbar sind. (⚠️ Vorsicht allerdings: In aller Regel sollte - und kann - man Selektoren so bauen, dass sie Update-sicher sind!)

Usw... 

---

## Fazit: Spielerei oder Zukunft?

Mein [AlumniumBrowserPlugin](https://github.com/elabit/robotframework-alumniumbrowserplugin) ist aktuell noch in einem frühen Stadium – aber es funktioniert.  

Die Kombination aus:

- 🎯 zielgerichteter Testautomatisierung mit der Browser Library
- 💬 deklarativer Szenariobeschreibung per KI-Prompt
- 🧠 und einem kleinen Architektur-Hack

...könnte ein kleiner **Gamechanger** fürs Web-Testing werden.

Ich bleibe dran – und freue mich auf euer Feedback.  

Danke an **Ameya Natu** für die Inspiration!

🔗 Das Plugin gibt’s hier: [`robotframework-alumniumbrowserplugin`](https://github.com/elabit/robotframework-alumniumbrowserplugin)  
🔗 Und das passende Demo-Projekt hier: [`rf-alumniumbrowserplugin-example`](https://github.com/simonmeggle/rf-alumniumbrowserplugin-example)