---
draft: false
pinned: true
title: "Robotmk und RCC-Environments in isolierten Umgebungen"
# --- Italic subheading
lead: "Wie Du RCC-Environments per ZIP-Archiv auf air-gapped Test-Hosts bringst."
# -- giscus id to match comments
commentid: rcc-offline
# -- predefined URL
# slug: 
# -- for posts in menubar, use this (shorter) title
# menutitle: 
#description: "Robotmk kann RCC-Environments vollständig offline aufbauen. Dieser Artikel erklärt, warum das wichtig ist und wie es in der Praxis funktioniert."
date: "2026-04-27T10:42:47+02:00"
categories:
  - tutorials
tags:
  - "rcc"
  - "air-gapped"
  - "offline"
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
thumbnail: img/title.png
vgwort: https://vg04.met.vgwort.de/na/ed902983d9fa4e07b11b706e43e2da5b
translationKey: "rcc-envoffline"
---


RCC war einer der Gamechanger mit der Einführung von Robotmk V2 - das Tool kümmert sich um den kompletten Lifecycle der Python-Umgebungen für Robot Framework braucht.  

Das ist super praktisch, aber es gibt einen Haken: RCC setzt voraus, dass der Test-Host Zugriff auf das Internet hat, um die benötigten Pakete herunterzuladen.
Dieser Artikel beschreibt einen sehr praktischen Weg für den Einsatz in **abgeschotteten** Umgebungen.

<!--more-->


---

## Das Problem: Kein Internet auf dem Test-Host

Im Robotmk-Scheduler läuft die Erzeugung von Laufzeitumgebungen für die Tests geöhnlich so ab: 

- Checkmk-Agent startet => startet den Robotmk Scheduler
- Scheduler Phase 1: Bau der Environments
  - Lesen der Config => bestimmten aller auszuführenden Testsuites 
  - Pro Testsuite: Aufruf von RCC, welches die `robot.yaml` ausliest (welche auf `conda.yaml` verweist, in der die Dependencies stehen)
  - RCC ermittelt die benötigten Pakete und lädt alles direkt aus dem Internet - von PyPI, Conda-Forge, npmjs etc.
- Scheduler Phase 2: Ausführung der Tests

Das funktioniert prima, solange der Test-Host **uneingeschränkten Internetzugriff** hat.

In der Praxis sieht es aber oft ganz anders aus.  

Gerade in größeren Unternehmen, Behörden oder regulierten Branchen gibt es häufig Umgebungen, in denen ein direkter Download aus dem Internet schlicht **nicht erlaubt** ist - oder technisch gar nicht möglich ist:

- **Sicherheitsrichtlinien**: Die Test-Systeme sind in einem abgeschotteten Netzwerksegment. Ausgehende Verbindungen sind da nicht erlaubt.
- **Air-gapped Umgebungen**: Systeme ohne jegliche Netzwerkverbindung nach außen - etwa in der Industrie, Kritischer Infrastruktur (KRITIS) oder im militärischen Umfeld.
- **Compliance-Vorgaben**: Nur explizit freigegebene Software-Quellen dürfen genutzt werden. PyPI gehört nicht dazu.
- **Eingeschränkter Proxy**: Outbound-Traffic läuft über einen Proxy, der bestimmte Repositories blockiert.

In all diesen Fällen schlägt der übliche RCC-Workflow fehl - und damit auch das Bauen der Robot Framework-Umgebung.

Das ausführliche Fehler-Log über den Bau der Environments legt der Scheduler übrigens in diesen Verzeichnissen ab:

- Windows: `C:\ProgramData\checkmk\agent\robotmk_output\working\environment_building`
- Linux: `/var/lib/check_mk_agent/robotmk/scheduler/environment_building`

> **Gut zu wissen:** RCC hat für genau diese Szenarien einen eigenen Modus vorgesehen, der von Robotmk auch unterstützt wird. Den sehen wir uns jetzt an :-) 

---

## Wie RCC intern arbeitet – und warum das relevant ist

Bevor wir in die Praxis einsteigen, braucht es ein bisschen Hintergrundwissen über RCC.  
Das ist wichtig, um das Offline-Verfahren zu verstehen.

### Hololib und Holotree

RCC arbeitet intern mit zwei Konzepten:

- **Hololib**: Eine Sammlung von "Katalogen" ("Catalogs") - abstrakten Vorlagen, die beschreiben, welche Pakete und Binärdateien eine Umgebung enthält.
- **Holotree**: Der Ort, an dem RCC aus einem Katalog eine konkrete, aktivierbare Umgebung ("Space") instantiiert.

Der Workflow von RCC ist also vereinfacht: 

1. Katalog (Hololib) erzeugen
2. Konkrete Umgebung (Space im Holotree) erzeugen

Wenn Du normalerweise `rcc task shell` (Erzeugen und aktivieren) oder `rcc holotree vars` (nur Erzeugen) ausführst, passiert beides hintereinander - RCC lädt die Pakete herunter, baut den Katalog und instantiiert daraus eine Umgebung.

Im Offline-Modus werden die beiden Schritte getrennt: Den Katalog baust Du einmalig auf einem Rechner **mit** Internetzugriff, exportierst ihn als ZIP und verteilst ihn dann auf die Test-Hosts **ohne** Internet.  
Dort importiert der Robotmk-Scheduler den Katalog und baut daraus die Environments (Spaces) - ohne einen einzigen externen Download.

---

### Virtuelle Environments und absolute Pfade

Beim Aufbau von Python-Environments werden (ganz unabhängig von RCC) auch Binärdateien kompiliert.  
Diese Binärdateien verweisen wiederum auf andere Dateien im Environment; sie haben diese Pfade immer **absolut und fest** einkompiliert. Im Fall eines RCC-Environments sind das also Pfade innerhalb des *holotree path* - einem Unterordner von `ROBOCORP_HOME`.  
Das ist der Grund, warum Du virtuelle Environments, auch "klassisch" mit `venv` oder `conda` erstellt, nicht einfach umbenennen/verschieben kannst - die in die Binaries einkompilierten Pfade stimmen dann nicht mehr.
Was hingegen *funktioniert*, ist das gesamte Environment auf einen anderen Rechner zu kopieren, solange die Pfade identisch bleiben.  

---

### ROBOCORP_HOME

Die Umgebungsvariable `ROBOCORP_HOME` bestimmt, in welchem Verzeichnis RCC seine Environment-Daten ablegt - quasi das "Working Dir".  
Solange die Pfade in `ROBOCORP_HOME` auf Quell- und Zielrechner identisch sind, funktioniert das problemlos.

Robotmk setzt dieses RCC-Arbeitsverzeichnis für jeden Benutzer, unter dem Tests laufen sollen: 

| Betriebssystem | Ausführungskontext   | ROBOCORP_HOME                              |
|----------------|----------------------|--------------------------------------------|
| Windows        | SYSTEM (headless)    | `C:\robotmk\rcc_home\current_user`         |
| Windows        | Spezifischer Nutzer  | `C:\robotmk\rcc_home\<Nutzername>`         |
| Linux          | root (headless)      | `/opt/robotmk/rcc_home/current_user`       |
| Linux          | Spezifischer Nutzer  | `/opt/robotmk/rcc_home/<Nutzername>`       |

> **Hinweis zu Nutzerkontexten:**  
> Unter Windows läuft der Scheduler standardmäßig als `SYSTEM`. Einzelne Pläne können über *Execute plan as a specific user* mit einem anderen Nutzer ausgeführt werden.  
> Unter Linux lässt sich der Scheduler-Nutzer global über *Customize agent package (Unix) → Customize user* ändern. Das ist auch die dringliche Empfehlung. 

---

## Die Lösung: ZIP-Archiv

Soweit die Grundlagen, kommen wir zur eigentlichen Lösung.  
Der Weg über ein ZIP-Archiv (unter Linux: `.tar.gz`) ist die empfohlene Variante für air-gapped Umgebungen. Er ist einfacher als er klingt - das Prinzip in Kürze:  

1. Katalog auf einem Rechner **mit** Internetzugang (wir nennen ihn: "Referenzsystem") bauen (OS und Plattform müssen identisch sein mit den Test-Hosts)
2. Als ZIP exportieren
3. ZIP manuell auf den Test-Host kopieren
4. Robotmk-Scheduler so konfigurieren, dass er den Katalog aus dem ZIP importiert

> Im folgenden wird die Vorgehensweise am Beispiel von Windows beschrieben. Unter Linux funktioniert es analog, nur dass die Pfade natürlich anders aussehen und statt ZIP-Archiv ein `.tar.gz` verwendet wird.

### Schritt 1: ROBOCORP_HOME setzen


Öffne auf dem Referenzsystem ein Terminal und setze `ROBOCORP_HOME` auf denselben Pfad, unter dem der Scheduler mit RCC das Environment auf den Test-Hosts bauen wird (nur so stimmen die Pfade in den Binaries später).
(`current_user` ist hier ein interner Platzhalter für den Nutzer, unter dem der Scheduler laufen wird - muss nicht geändert werden)

**Windows - headless (SYSTEM):**

```cmd
C:\robots> set ROBOCORP_HOME=C:\robotmk\rcc_home\current_user
```

**Windows - spezifischer Nutzer (z.b. alice):**

```cmd
C:\robots> set ROBOCORP_HOME=C:\robotmk\rcc_home\alice
```

**Linux - headless:**

```bash
user@host:~$ export ROBOCORP_HOME=/opt/robotmk/rcc_home/current_user
```

**Linux - spezifischer Nutzer:**

```bash
user@host:~$ export ROBOCORP_HOME=/opt/robotmk/rcc_home/alice
```

---

### Schritt 2: Katalog bauen

Wechsle in das Verzeichnis Deines Robots und führe `rcc holotree vars` aus, um das Hololib-Environment zu bauen.

```cmd
C:\robots> cd webtest
C:\robots\webtest> rcc holotree vars
```

---

### Schritt 3: ZIP-Export vorbereiten

Prüfe zunächst, ob der Katalog korrekt angelegt wurde. Dazu bestimmst Du zunächst den "Blueprint"-Hash der `conda.yaml`...

```cmd
C:\robots\webtest> rcc holotree hash conda.yaml

Blueprint hash for [conda.yaml] is MCf6XqQnXsKIwtEn
```

...und suchst diesen dann in der Lste aller verfügbaren Kataloge:

```cmd
C:\robots\webtest> rcc holotree catalogs

Blueprint         Platform       Dirs    Files    Size     Relocate  Holotree path
---------         --------       ------  -------  -------  --------  -------------
MCf6XqQnXsKIwtEn  windows_amd64     358     4895     123M        28  c:\robotmk\rcc_home\current_user\ht
```

Nun kannst Du demn Katalog in ein ZIP exportieren:

```cmd
C:\robots\webtest> rcc holotree export -r robot.yaml --zipfile webtest-env.zip
```

---

### Schritt 4: ZIP auf den Test-Host kopieren

Kopiere das erzeugte Archiv auf den Test-Host.  
(Für diesen Schritt kannst Du natürlich auch Tools wie Ansible oder Salt benutzen.)

```
# Zielsystem:
C:\env-zip\webtest-env.zip
```

> Dieser Pfad ist frei wählbar.

---

### Schritt 5: Robotmk-Regel konfigurieren

Nun konfigurierst Du die Bakery-Regel *Robotmk Scheduler (Windows|Linux)* wie gewohnt. 
Die Option **Environment dependency handling** änderst Du nun von "Download" auf *Load from ZIP file* und trägst den Pfad zu Deinem ZIP-Archiv ein:



{{< figure src="img/offline-zip.gif" title="Bakery Configuration: Absoluten Pfad zum ZIP-Archiv auf dem Test-Client eingeben" >}} 




Wenn der Scheduler das nächste Mal startet, importiert er den Katalog innerhalb weniger Sekunden aus dem ZIP-File und baut daraus den Space (das eigentliche Environment) - vollständig ohne Internetzugriff.  
Statt Pakete herunterzuladen, wird lediglich ein Archiv entpackt.  

Das ist nicht nur **100% offline-fähig**, sondern auch **performant**.  

---

## Fazit

Mit dem ZIP-basierten Offline-Modus kannst Du auch Testhosts mit Environments versorgen, ohne dass diese eine Internetverbindung benötigen.  
**Robotmk** liefert hier eine pragmatische und gut funktionierende Lösung aus. 

Falls Du Fragen dazu hast oder Dir beim Einrichten nicht sicher bist, schreib in die Kommentare oder schick mir eine Mail - ich helfe gerne.




