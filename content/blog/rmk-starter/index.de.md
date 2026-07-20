---
draft: false
title: "Robotmk-Starter: Sofort loslegen mit Synthetic Monitoring"
# --- Italic subheading
lead: "Kein Blindflug mehr: Fertige, CI-getestete Robot Framework Suites als Startpunkt für das erfolgreiche Synthetic Monitoring in Checkmk."
# -- giscus id to match comments
commentid: rmk-starter
# -- predefined URL
# slug: 
# -- for posts in menubar, use this (shorter) title
# menutitle: 
#description: "Robotmk kann RCC-Environments vollständig offline aufbauen. Dieser Artikel erklärt, warum das wichtig ist und wie es in der Praxis funktioniert."
date: "2026-05-06T10:42:47+02:00"
categories:
  - tutorials
tags:
  - rcc
  - robotframework
  - getting-started
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
thumbnail: img/cmk_rmk.png
vgwort: https://vg04.met.vgwort.de/na/2d95d237c15f446bb564e78199f946fe
translationKey: "rmk-starter"
---


Einsteiger in Robot Framework kennen das: man sitzt vor der ersten leeren `.robot` Datei und fragt sich: Wie fange ich an? Welche Dateien brauche ich? Wie spielen `robot.yaml`, `conda.yaml` und `robot.toml` zusammen?  

An dieser Stelle verliert man gerne den Faden - der richtige Startpunkt fehlt, sowie eine grundlegende Orientierung.

Hierfür habe ich das **Robotmk-Starter-Repo** erstellt: ein kuratiertes Set an fertigen, CI-getesteten Beispielen und Templates.  
In diesem Blogartikel stelle ich die drei wichtigsten Beispiele vor, erkläre die dahinterliegenden Konzepte und zeige, wie man sie sofort ausprobieren kann – entweder lokal oder direkt im Browser mit GitHub Codespaces.

<!--more-->

---

## Überblick

Das Repo ist User-facing in zwei Bereiche aufgeteilt:

- **`examples/`** – vollständige, sofort lauffähige Suites. Natürlich sind auch diese Suites keine Lösungen auf dem "Silbertablett", aber sie zeigen fertige Durchstiche, wie man bestimmte Herausforderungen meistert – z.b. Handhabung von Variablenfiles oder das Sessionhandling im Browser. (Das ist die beste Art, Robot Framework zu lernen.) 
- **`templates/`** – minimale Starter-Skeletons für eigene Projekte. Die Dateistruktur ist noch vorgegeben, die Test-Logik kommt ovn Dir. 

Was im Repo steht, funktioniert - weil alle Tests vorher automatisiert getestet wurden. 

Denn es gibt nichts Frustrierenderes, als ein Beispiel zu klonen, das nicht läuft - sei es wegen veralteter Abhängigkeiten, fehlender Dateien oder unklarer Anweisungen.  

> Erst Anfang des Jahres gab es einen ärgerlichen Bug in der Browser Library, der wegen einer kaputten Subdependency bereits gebaute Environments beim nächsten Bau zerschossen hat. 

Alle Beispiele kannst Du, wenn Du magst außerdem per Klick in **GitHub Codespaces** ausführen – inklusive Browser-Tests mit sichtbarem Desktop. Keine lokale Installation nötig.  
Hinweis: alles, was Du brauchst ist ein GitHub-Account und ein Browser - die Benutzung von Codespaces ist bis zu **60 Stunden pro Monat kostenlos**. Finde ich ziemlich großzügig! 

---

## Beispiel 1: cryptolibrary-simple – Passwörter von Anfang an richtig

Wer Suites in die Versionskontrolle eincheckt, hat sofort ein Problem: Wohin mit den Passwörtern? Klartext im Code ist keine Option.

Dieses Beispiel zeigt die fertige Lösung. [`robotframework-crypto`](https://github.com/Snooz82/robotframework-crypto) verschlüsselt Credentials, im Repository liegt nur ein `crypt:…`-Ciphertext, das Key-Passwort kommt zur Laufzeit als Umgebungsvariable. Kein Klartext ist je sichtbar – weder im Code noch in den Logs.

**Info:** `conda.yaml` definiert die gesamte Python-Umgebung reproduzierbar. RCC baut sie beim ersten `rcc run` automatisch auf – auf jedem Host identisch, ohne manuelle `pip install`-Schritte.

Dieses Beispiel ist bewusst schlank gehalten. Der Fokus liegt nicht auf dem Test, sondern auf dem Muster: Encrypt once, commit safely, decrypt at runtime. Dieses Muster zieht sich durch alle weiteren Beispiele, die noch folgen. 

---

## Beispiel 2: web-cryptolibrary – Der erste kleine Browser-Test

Hier kommt der Browser ins Spiel. Das Testziel ist die Login-Seite auf [practicetestautomation.com](https://practicetestautomation.com/practice-test-login/).

Zwei Testfälle stehen bewusst nebeneinander: der "falsche" Weg (Klartext-Passwort) und der richtige (verschlüsselt mit CryptoLibrary).  

**Info:** Die Browser Library basiert auf Playwright und bringt Chromium, Firefox und WebKit mit. RCC installiert alles aus der `conda.yaml` – auch Node.js 22.11.0.

---

## Beispiel 3: rf-python-varfiles – Konfiguration sauber trennen

Jede Suite braucht irgendwann Konfigurationsdaten: URLs für dev/test/prod, Browser-Profile, berechnete Werte zur Laufzeit etc...  
Wer das direkt in der `.robot`-Datei hardcodiert, kämpft beim nächsten Umgebungswechsel.

Dieses Beispiel zeigt gängige Muster, um Variablen aus Files zu lesen - inclusive der kleinen Fußangel, die beim Lesen aus YAML-Files gern übersehen wird: hierfür ist mämlich die Installation von `pyyaml` erforderlich (siehe `conda.yaml`, dort sind alle Pakete aufgelistet).  

**Info:** Robotmk-Suites laufen auf dem Monitoring-Host ohne zu wissen, gegen welche Umgebung sie laufen. Variable Files sind der saubere Weg, Konfiguration von Test-Logik zu trennen – ohne den Code zu verzweigen.


---

## Beispiel 4: rf-custom-library – Eigene Keywords in Python

Sobald eine Suite domänenspezifische Logik enthält (Berechnungen, API-Calls, Datenbankabfragen, proprietäre Systeme) gehört diese Logik nicht in die `.robot`-Datei.  
Die Lösung: eine eigene Python-Datei als RF-Bibliothek (aka "Library").

Das Beispiel zeigt das Minimalgerüst - plus einen subtilen Fehler beim Umgang mit **Typen**:

```python
from robot.api.deco import keyword

class CustomLibrary:

    @keyword("Say Hello")
    def say_hello(self, name):
        print(f"Hello, {name}!")

    @keyword("Add Numbers")
    def add_numbers(self, a, b):
        # RF übergibt alle Argumente als Strings – explizite Konvertierung ist Pflicht
        return int(a) + int(b)
```

**Erklärung:** RF übergibt alle Keyword-Argumente als Strings. `a + b` würde zwei **Strings verketten**, nicht Zahlen **addieren**. 

Der Import in der Suite ist denkbar einfach – ein einziger Pfad, keine separate Installation nötig:


---

## Template: web-browserlibrary – Browser-Tests richtig aufsetzen

Wer mit der Browser Library (Playwright) neu beginnt, steht vor Fragen wie

- *Wie strukturiere ich Resource-Dateien?*
- *Wo gehört der Browser-Start hin?*
- *Wie schalte ich zwischen headless und headed um?*
- *Wie stelle ich sicher, dass bei Fehlern automatisch ein Screenshot gemacht wird?*

Dieses Template beantwortet solche Fragen durch eine fertige, kopierbare Struktur.  

**Disclaimer**: es gibt wie immer viele Wege nach Rom. Gerade in diesem Boilerplate-Code steckt ganz viel von dem, wie ich selbst Browser-Tests strukturiere. Es ist aber kein Dogma, sondern ein Vorschlag, den Du gerne an Deine Bedürfnisse anpassen kannst.

---

## Drei Wege zum Ausprobieren

Wie kannst Du diese Beispiele nun für Dich nutzen? Es gibt drei Möglichkeiten - je nachdem, was Du vorhast und vorziehst: 

### Weg 1: GitHub Codespaces (empfohlen)

Jedes Beispiel hat eine eigene devcontainer-Konfiguration und wird automatisch in ein dediziertes Repo gespiegelt.  
Ein Klick auf "*Open in GitHub Codespaces*" startet eine vollständige Entwicklungsumgebung im Browser:

- RCC ist vorinstalliert
- VS Code - komplett im Browser
- Die Python-Umgebung wird automatisch gebaut
- Für Web-Tests startet der Devcontainer einen noVNC-Desktop auf `http://localhost:6080` - eine ausführliche Anleitung ist im README enthalten.

### Weg 2: VS Code lokal

```bash
git clone https://github.com/elabit/robotmk-starter
cd robotmk-starter/examples/web-webshop
rcc task shell   # baut die isolierte Umgebung und öffnet eine Shell
code .           # öffnet VS Code aus der aktivierten Umgebung
```

Für den besten Workflow empfiehlt sich die Extension [RobotCode](https://marketplace.visualstudio.com/items?itemName=d-biehl.robotcode) – sie bietet Syntax-Highlighting, Autocomplete und integrierte Run/Debug-Knöpfe für Robot Framework.

### Weg 3: Direkt auf der Konsole

```bash
cd examples/cryptolibrary-simple
rcc task shell
robot suite.robot
```

RCC baut die Umgebung beim ersten Aufruf automatisch und führt die Suite aus.

---

## Bonus: Komplette Checkmk-Instanz im Browser

Das Repo enthält außerdem ein `.devcontainer/`-Setup, das eine **vollständige Checkmk Pro 2.5-Instanz** hochfährt – inklusive Fluxbox/noVNC-Desktop:

Damit lässt sich das komplette Setup – Checkmk, Robotmk-Scheduler und die Beispiel-Suites – **ohne eine einzige lokale Installation** hands-on erleben. 

{{< figure src="img/codespace-cfg.png" title="Zuerst den Codespace konfigurieren..." >}} 

{{< figure src="img/cmk.png" title="... und dann Checkmk im Codespace-Container nutzen! " >}} 



---

## Fazit

Mit dem Robotmk-Starter Repository bekommst Du Beispiele, die garantiert laufen, Strukturen, die Du übernehmen kannst - unter der Garantie, dass die Beispiele nicht veralten.

Der Rest liegt bei Dir :-) - leg los: 

→ [https://github.com/elabit/robotmk-starter](https://github.com/elabit/robotmk-starter)

Welches Beispiel fehlt Deiner Meinung nach? Was möchtest Du als nächstes sehen? Schreib es gerne in die Kommentare!
