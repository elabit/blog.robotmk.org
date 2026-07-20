---
draft: false
title: Effiziente Python-Integration in Robotmk dank RCC
# --- Italic subheading
lead: Alles, was Du über das 'virtualenv on steroids' wissen musst.
# -- giscus id to match comments
commentid: rcc-efficient-python-integration
# -- predefined URL
slug: rcc-efficient-python-integration
# -- for posts in menubar, use this (shorter) title
# menutitle: 
description:
date: 2024-04-16T15:49:17+02:00
categories:
  - knowhow
tags:
  - rcc
  - robotmk
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
thumbnail: img/rcc-environments.png
vgwort: https://vg04.met.vgwort.de/na/468b05b78f234036bc4ce4c1822010df
translationKey: "rcc-ultimate-tool"
---

In diesem Blogartikel beleuchten wir die Hintergründe der Entwicklung von RCC, die Probleme, die es löst, und den immensen Vorteil, den es im Robotmk-Projekt bringt.

<!--more-->

## Robocorp RCC: Problem gelöst, Vorteile für alle

### Über Robocorp

[Robocorp](https://www.robocorp.com) ist ein führender Anbieter von plattformübergreifender Prozessautomatisierung.
Dabei setzte das Unternehmen vor nicht all zu langer Zeit noch auf Robot Framework unf pflegte dafür sogar eine eigene Mate-Library, die sogenannte `rpaframework`-Library. (Wenn Du diese irgendwo in Deinen Robot Framework Suites verwendest, solltest Du darüber nachdenken, sie abzulösen - darüber später mehr).  
Seit Anfang 2024 allerdings richtet sich Robocorp stark an Python-Entwickler; diese Abkehr ist zwar schade für die Robot Framework Community, jedoch ist RCC nach wie vor *der* Unterbau für Robocorp-Automatisierungen.

Sehen wir uns das mal genauer an.

### Der Use Case von Robocorp

Kunden von Robocorp erstellen lokal also Automatisierungen und möchten diese in der Cloud-Infrastruktur von Robocorp ausführen lassen.

> Ein Beispiel für so eine Automatisierung:  
>
> 1. Laden eines Excel-Files von einem IMAP-Postfach
> 2. Lesen von Daten aus einer REST-API für jeden Datensatz
> 3. und anschließendes Verschicken der Ergebnisse pro Datensatz an einen Empfänger.  
>
> (Python-Profis gähnen hier vielleicht :smile:, aber die Idee dahinter ist, dass für die zuverlässige Ausführung dieser Automatisierungen keine lokale Infrastruktur betrieben werden muss.)

RCC ist mit Sicherheit so alt wie die Geschäftsidee von Robocorp selbst - denn vor dem ersten Kunden galt es, ein ganz fundamentales Problem zu lösen:  
Wie können die **Umgebungen** mit all ihren Abhängigkeiten **zuverlässig und plattformunabhängig reproduziert** werden, damit der Automatisierungs-Code der Anwender am Ende so etwas wie "**portabel**" wird?

Es war also ein Mechanismus notwendig, mit dem solche Umgebungen ("Environments") abstrakt beschrieben werden können, um sie woanders exakt wieder aufbauen zu können.

So entstand das Kommandozeilentool RCC (Robocorp Command Line Control).  

> RCC erstellt anhand abstrakter Definitionen isolierte Python-Umgebungen.  
> Diese Umgebungen kapseln alle erforderlichen Bibliotheken und Abhängigkeiten und sorgen so dafür, dass die Anwendungen unabhängig voneinander und ohne Konflikte laufen.  

### Vorteile für Robotmk

An dieser Stelle ein Wort der Warnung: wer sich nun in die Dokumentation von Robocorp eingräbt, kann aufs falsche Gleis kommen, weil die Dokumentation an allen möglichen Stellen sehr RPA-lastig und am Use Case von Robocorp ausgerichtet ist. Das lässt sich leider nicht ändern.  

Allerdings hilft es wiederum zu wissen, dass in Robotmk nur ein kleiner Teil der ganzen Funktionen von RCC überhaupt gebraucht werden. Im Normalfall wird der Robotmk-Anwender mit RCC kaum in Berührung kommen.

> Robotmk profitiert allein schon dadurch von RCC, dass es die Erstellung solcher isolierter Python-Umgebungen ermöglicht.

---

## RCC verstehen

Um RCC zu erklären, verwende gerne eine <green>Analogie zu Docker</green>.

### Analogie zu Docker

Wie Du sicher weißt, sind Docker-Container leichtgewichtige, portable Einheiten, die Software und alle ihre Abhängigkeiten enthalten. Das ermöglicht den Betrieb von Anwendungen konsistent auf verschiedenen Umgebungen/Plattformen.  

> Ein `Dockerfile` beschreibt, wie das einem Container zugrunde liegende "Docker-Image" konkret auszusehen hat: das Betriebssystem, zu installierende Software, Konfigurationsbefehle, bereitgestellte Dateien usw.

Ein Beispiel (achte nicht auf Details, die sind nicht so wichtig):

```bash
FROM ubuntu:latest
RUN apt-get update && apt-get install -y \
    curl \
    vim \
    git
CMD ["bash"]
```

Mit diesem Dockerfile kann ich eine Blaupause ("Image") namens `my-workplace` bauen und einen ersten Container mit dem Namen `my-container` davon starten.

```bash
docker build -t my-workplace .
docker run -dit --name my-container my-workplace /bin/bash
```

Angenommen, ich hätte weder `vim` noch `curl` auf meinem Host-Betriebssystem, so könnte ich dennoch diese Befehle im Container-Betriebssystem ausführen:

```bash
docker exec mein-container curl http://www.robotmk.org
docker exec mein-container vim my-personal-notes
```

Alles, was Du also brauchst, um mein Beispiel auf *Deinem* Host nachzustellen, ist dieses `Dockerfile`. Es spezifiziert, wie das Image aussehen soll.

Nun sind wir von RCC nicht mehr weit entfernt.

### Wie RCC funktioniert

Ein Unterschied, der bei RCC sofort ins Auge springt: statt eines einzigen Files sind bei RCC zwei Dateien im Spiel, die ich im folgenden erklären will.  
Auch wenn nur wenige Bestandteile für Robotmk relevant sind (markiert mit ⭐️), so müssen sie doch vorhanden sein. Es lohnt sich also, sie zu verstehen.

#### robot.yaml

> Die <mark>Haupt-Konfigurationsdatei</mark> des Robots.  
> Wenn Du einen neuen Robot für Robotmk anlegen willst, kannst Du dieses File als Gerüst nehmen.  
Es sind keine Anpassungen daran notwendig.

```yaml
# "Tasks" sind vordefinierte Einstiegspunkte für die Automatisierung. Irrelevant für Robotmk.
tasks:
  my_cool_task:
    shell: python -m robot --report NONE --outputdir output --logtitle "Task log" tests.robot

# ⭐️ Die wohl wichtigste Zeile in dieser Datei - die aber auch nie geändert werden muss. 
environmentConfigs:
  - conda.yaml

# === Falls der Robot als RCC-Task (1) aufgerufen wird:
# - Ausgabeverzeichnis für Robot Framework
artifactsDir: output

# - Erweiterung des Suchpfades für Binaries
PATH:
  - .
# - Erweiterung des Suchpfades für Python-Packages
PYTHONPATH:
  - .
# Nur benötigt, falls ein Robot gezippt und woandershin gepusht werden soll. 
ignoreFiles:
  - .gitignore
```

#### conda.yaml

> Beschreibt die zu installierenden <mark>Abhängigkeiten</mark>.  
> Dazu zählt alles - beginnend bei der/den zu installierenden Programmiersprache(n).

Nachfolgend ein Template für eine typische `conda.yaml`, die ein Environment für Playwright-basierte Tests beschreibt:

```yaml
# Nutze conda-forge als Paketquelle 
channels:
  - conda-forge

dependencies:
  # ⭐️ Von conda-forge zu installierende Programmiersprachen und Tools
  - python>=3.12
  - pip=23.2.1
  - nodejs>=20
  # ⭐️ von Pypi (mittels pip-Befehl) zu installierende Python-Packages
  - pip:
    - robotframework==7
    - robotframework-browser==18.2.0

# ⭐️ Nach der Installation auszuführende Schritte. In diesem Fall wird die Initialisierung der NodeJS-Packages mit diesem Befehl angestoßen. 
rccPostInstall:
  - rfbrowser init
```

Auch diese Datei kannst Du als Basis-Template immer wieder verwenden. `rccPostInstall` ist tatsächlich nur für die Installation der Browser-Library notwendig - der Punkt kann weggelassen werden, wenn der Test gar nicht webbasiert ist.

**In Kürze:**

- `robot.yaml` - Haupt-Config, im Fall von Robotmk extrem statisch
- `conda.yaml` - Definition der Abhängigkeiten, hängt von der Robot Framework Suite ab.

---

## Verwendung von RCC

Es ist wichtig zu wissen, an welchen Stellen im Robotmk-Workflow RCC zum Einsatz kommt - und wenn ja, wie:

- Bei der <green>regulären Ausführung</green> der Tests durch den <green>Robotmk Scheduler</green> auf einem <green>Testclient</green> passiert alles im Hintergrund und <green>automatisch</green>:
  - Das RCC-Binary wird zusammen mit dem Checkmk-Agenten nach `C:\ProgramData\checkmk\agent\bin` installiert.
  - Der Robotmk Scheduler erstellt die Environments für alle Suites, bei denen die Verwendung von RCC vorgesehen ist.
- Anders sieht es aus auf einem <green>Entwicklungs-Rechner</green>, auf dem der </green>Benutzer einen Test <green>manuell ausführen</green> will:
  - Dieser Rechner ist (üblicherweise) nicht im Monitoring, ergo ist RCC dort gar nicht vorhanden.
  - Der Benutzer muss das Environment manuell erzeugen und selbst dafür sorgen, dass es in der Entwicklungsumgebung aktiv ist.

Man sieht also: RCC ist in Robotmk so gut integriert, dass außer der Installation des Checkmk-Agenten auf dem Zielhost nichts weiter notwendig ist.
Die Verwendung von RCC als Benutzer sehen wir uns im folgenden genauer an.

### RCC herunterladen

Hier kannst Du der Anleitung folgen, wie ich sie im Schnellstart-Artikel unter [Download von RCC]({{< ref "getting-started/index.de.md#download-von-rcc" >}}) geschrieben habe. RCC sollte über die Benutzervariable `%PATH%` aufrufbar sein.

### In einem RCC-Environment entwickeln

Das ist der einzige Punkt, an dem Du - zumindest momentan, wir haben aber schon Ideen - noch nicht ganz an der Kommandozeile vorbeikommst: bevor Du loslegen kannst, mit VS Code (empfohlen, aber auch andere Editoren sind möglich) Deine Robot Framework-Tests zu schreiben, musst Du das entsprechende RCC-Environment erzeugen und aktivieren.

Stelle sicher, dass Du Visual Studio Code und darin die Extension [RobotCode](https://marketplace.visualstudio.com/items?itemName=d-biehl.robotcode&ssr=false#review-details) installiert hast.

Wir nehmen als Beispiel die Robot-[Suite](https://github.com/elabit/robotmk-examples/tree/main/web/cmk_synthetic_web) aus dem Schnellstart-Tutorial.


Das folgende Video zeigt:

- Öffnen der `.robot`-Datei direkt in VS Code. Obwohl die Extension RobotCode installiert ist, werden keine Bedienelemente angezeigt, um den test zu starten. Das liegt daran, dass die Extension gar keinen Python-Interpreter, geschweige denn eine RobotFramework-Installation findet.
  
{{< figure src="img/windows-rcc-nopython.gif" loading="lazy" >}}

Im zweiten Video siehst Du, wie das RCC-Environment erzeugt wird und das darin gestartete VS Code Zugriff auf Python hat - der Robot kann gestartet werden: 

- Öffnen einer `cmd` im Verzeichnis der Suite (=wo die beiden RCC-Files `robot.yaml` und `conda.yaml` liegen).
- `rcc task shell` zum Aktivieren des Python-Environments. Sollte es nicht existieren, wird es neu erstellt.
- `code .` zum Öffnen des aktuellen Ordners in VS Code. Da zu diesem Zeitpunkt in der CMD bereits die Pfade auf das RCC-Environment "umgebogen" wurden, verhält sich diese CMD nun so, als wäre Python und alle Packages im Betriebssystem installiert. Auch das darin gestartete VS Code verwendet diese Interpreter.
- Den Start der Robot Framework Suite über die Debug/Start-Schaltflächen der RobotCode-Extension. Hier könntest Du nun direkt loslegen und den Test erweitern/anpassen.

{{< figure src="img/windows-rcc-python.gif" loading="lazy" >}}

---

<green>Abschließend lässt sich sagen</green>, dass RCC ein mächtiges Werkzeug ist, das die Entwicklung und Ausführung von Robotframework-Code erheblich vereinfacht, indem es dafür isolierte und portable Python-Umgebungen schafft.  
Ich hoffe, die Analogie zu Docker hat verdeutlicht, wie RCC dazu beiträgt, die Robots konsistent und ohne viel Aufwand über verschiedene Plattformen hinweg zu betreiben.
