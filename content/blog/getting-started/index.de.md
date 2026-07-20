---
draft: false
pinned: true
title: Robotmk v2 Schnellstart
lead: Step by Step den ersten RobotFramework-Test mit Robotmk v2 in Checkmk integrieren.
commentid: rmkv2-quickstart
menutitle: Getting Started
date: 2025-11-08T21:37:42+02:00
categories:
  - tutorials
tags:
  - Installation
authorbox: true
sidebar: true
pager: false
# weight: 10
thumbnail: img/start-title4.png
slug: robotmk-v2-schnellstart
vgwort: https://vg04.met.vgwort.de/na/4787e61336494b11bc3806b9c667f658
translationKey: "getting-started"
---


Die für Checkmk 2.4 aktualisierte Schritt-für-Schritt-Anleitung für den gelungenen Einstieg in Synthetic Monitoring mit Robotmk!

<!--more-->

In diesem Tutorial lernst Du, wie Du einen Robot Framework-Test mit Hilfe von Robotmk in Checkmk integrierst.  
Nur einen Web-Test? Nein!  
Der Test soll Dir gleich einen kleinen Vorgeschmack geben auf das, was die Stärke von Robot Framework ist: die schiere Menge an Libraries für jeden erdenklichen Usecase.  
Der Test "web-images" öffnet die Seite einer Autoversicherung und prüft, ob die Startseite das Bild eines Motorrads enthält. Zum Einsatz kommen...

- [Browser-Library](https://marketsquare.github.io/robotframework-browser/Browser.html): die einen nennen sie eine Alternative, ich nenne sie den würdgien Nachfolger der Selenium-Library. Unter der Haube arbeitet [Playwright](https://playwright.dev), das Feature-technisch das deutlich betagtere Selenium in den Schatten stellt.
- [DoctestLibrary](https://github.com/manykarim/robotframework-doctestlibrary): eine echte Allzweckwaffe, um PDF-Dokumente und Bilder zu testen oder mit Referenz-Daten zu vergleichen.

## TL'DR - um was geht es hier eigentlich?

- **Robot Framework** ist das leistungsfähigste und flexibelste Testwerkzeug, das Du finden kannst. Es verschafft Dir die Automatisierungs-Power von Python, ohne Python schreiben zu müssen - denn Robot Framework ist stark auf Lesbarkeit und Wartbarkeit fokussiert.
- **Robotmk** ist die Integration von Robot Framework in Checkmk. Es ist der Brückenschlag von Testing (1x ausführen und zufrieden sein) zum Monitoring (dauerhaft ausführen, Daten aufzeichnen und überwachen).  Robotmk besteht aus
  - **Bakery**-Regel: zur Konfiguration des Robotmk-Schedulers
  - Robotmk-**Scheduler**: führt Robot Framework-Tests in regelmäßigen Intervallen aus
  - Robotmk-**Agent-Plugin**: liest die vom Scheduler geschriebenen Testergebnisse und generiert daraus eine Checkmk-kompatible Agentensektion.
  - Robotmk-**Check**: das Checkmk-seitige "Gegenstück": es parst die in der Agentensektion enthaltenen Results und discovert je Test einen Checkmk-Service.

## Bereite Dich vor

- einen Robotmk-**Testclient**: hier wird der Robotmk-Scheduler die Robot Framework-Tests in regelmäßigen intervallen ausführen und über den Checkmk-Agent-Output an Checkmk melden.
  - OS: Windows 11 oder Server 2022/2025 bzw. Ubuntu 22 oder 24 (die Limitierung bei Linux rührt von der Playwright-Bibliothek; weitere apt-Pakete erforderlich, siehe unten)
  - Internet-Zugriff (zum Download der Installations-Pakete durch `rcc`)
  - mind. 8 GB RAM
  - 4, besser 8 CPUs (2 CPUs funktionieren nicht - besser gar nicht erst versuchen)
  - Basis-Monitoring des Hosts durch Checkmk eingerichtet
- **Checkmk** >= 2.3 (bekommst Du [hier](https://checkmk.com/download) for free, wenn Du nicht über 750 Services kommst - reicht zum Testen locker)

(Wir werden in diesem Tutorial exemplarisch auf Windows eingehen; auf Linux funktioniert die Prozedur relativ ähnlich. Ich empfehle hier die siebenteilige Serie des Checkmk-Youtube-Kanals: <https://www.youtube.com/playlist?list=PL8DfRO2DvOK2XZVvaZwUztchXWoOYfnDM>)

---

## Legen wir los: Einrichtung des Testclients

### Download von RCC

> Der Checkmk-Agent, den wir gleich zusammen mit dem Scheduler installieren, wird das `rcc.exe`-Binary mitbringen. Du kannst diesen Schritt hier also überspringen, wenn Du den Robot gar nicht mehr selbst ausführen, sondern direkt mit dem Scheduler beginnen willst.

Für einen vorherigen Test oder aber die Einrichtung eines Entwicklungs-Hosts musst Du Dir das RCC-Binary selbst besorgen.  
Lade es [hier](https://github.com/elabit/robotmk/releases/tag/v3.0.2) herunter und speichere es an einem Ort Deiner Wahl unter `rcc.exe` ab. Ich habe mir angewöhnt, ein Verzeichnis `bin` im User-Profil anzulegen: `c:\Users\simonmeggle\bin\rcc.exe`

> **Hinweis:** In Checkmk 2.5 werden wir eine alternative Methode zu RCC bereitstellen, die auf Micromamba basiert und mit einem eigenen Kommandozeilentool `csm` (Checkmk Synthetic Monitoring) aufwartet. In Kürze werde ich diese Methode hier ebenfalls beschreiben. 

Füge diesen Ordner nun der User-Umgebungsvariable `%PATH%` hinzu:

{{< figure src="img/bin-path.png" title="Hinzufügen des RCC-Pfades zur User-Variable `%PATH%`" >}}

Öffne eine neue CMD und teste, ob Du `rcc` nun von einem beliebigen Ort ausführen kannst:

{{< figure src="img/cmd_where_rcc.png" title="Erster Aufruf von RCC" >}}

Falls es hier zu Problemen kommt, hier sind mögliche Fehlerquellen beschrieben, die ich in meinen Trainings bislang feststellen konnte: [RCC Troubleshooting](/de/blog/rcctrouble/)

### Download des Minimal-Tests

Nun ist es an der Zeit, das [Demo-Repo](https://github.com/Checkmk/robotmk-examples/archive/refs/heads/main.zip) mit der Robot-Suite herunterzuladen, die wir in Checkmk integrieren wollen.

> Das Repository <https://github.com/Checkmk/robotmk-examples> habe ich extra für Beispiel-Suites angelegt. Speichere es am Besten in Deinen Bookmarks.

Entzippe die Datei `master.zip` und speichere den Unterordner `examples/web/web-images` im Ordner `C:\robots\` ab. Dieser Ordner dient als sog. **Basisverzeichnis** für alle Robot-Suites.

{{< figure src="img/robot-basedir2.png" title="Speicherort des neuen Robots" >}}

### Testen des Robots mit RCC

> An dieser Stelle sei darauf hingewiesen, dass wir bisher *keinerlei Software* installiert haben. Jetzt schlägt die Stunde von RCC, welches im Hintergrund Python, NodeJs etc. komplett autonom in einem isolierten Environment installiert.

Öffne eine CMD und wechsle in den eben kopierten Ordner `C:\robots\web-images`.
Nun folgen ein paar Kommandos, die Du in genau dieser Reihenfolge ausführen solltest. Lies meine Erklärung, damit Du verstehst, wie RCC funktioniert:

- `where python`: Haben wir Python zur Verfügung?  
  Das Kommando `where` ist das Äquivalent zum Linux-Befehl `which` und versucht, den als Argument übergebenen Befehl ("Python") über die `%PATH%`-Variable zu finden.  
  Die `%PATH-Variable%` besteht in der Regel aus einer ganzen Reihe von Suchpfaden, die mit Semikolon voneinander getrennt sind. In genau dieser Reihenfolge der Pfade sucht Windows nach dem angegebenen Programm.
  Mit diesem Test möchte ich herausfinden, ob auf dem System zufällig schon Python installiert ist - und wenn ja, wo.  
  Auf einem frisch installierten System wird vermutlich überhaupt keine Ausgabe kommen.
- `rcc task shell`: Damit erzeugen wir die Laufzeit-Umgebung für unseren Test.  
  Wenn Du diesen Befehl ausführst, wirst Du viele Zeilen sehen, die ich an dieser Stelle gar nicht erklären muss bzw. kann - wichtig zu wissen ist: die Datei `conda.yaml` enthält alle Pakete, die jetzt installiert werden sollen. Das erledigt RCC vollautomatisch.  
  Wenn RCC fertig ist, bist Du im Environment. Man sagt: das Environment ist jetzt "aktiviert".
- `where python`: Diesmal erhalten wir von dem Kommando den Pfad zum Python-Interpreter im neu erstellten und jetzt aktivierten Environment zurück.
- `where robot`: Nicht nur Python, sondern auch Robot Framework ist installiert (ist das nicht cool...? 😎).
- `robot tests.robot`: Mit dem `robot`-Befehl können wir nun den RobotFramework-Test starten. Lass Dich überraschen 😉
  
> An dieser Stelle wirst Du unter Linux (Debian/Ubuntu) erst einmal Fehlermeldungen bekommen. Das liegt daran, dass bestimmte Pakete nachinstalliert werden müssen.  
> Jetzt ist der richtige Zeitpunkt dafür denn: im aktivierten Environment kannst Du die Pakete direkt mit dem Befehl `npx playwright install-deps` installieren. Natürlich funktioniert das nur, wenn Du mit Deinem Benutzer **root-Rechte** hast.  
> Andernfalls kannst Du `npx playwright install-deps --dry-run` ausführen und Dir die Kommandozeile für *apt install* einfach kopieren. Dann starte eine neue Shell mit root und füge sie dort ein. 
> Starte danach den Robot erneut mit `robot tests.robot`. 

{{< figure src="img/rcc-task-shell-run2.gif" title="Start des Robots mit RCC" loading="lazy">}}

**Dieser Abschnitt hat den Beweis erbracht: der Robot kann über RCC gestartet werden.** ✓

Wenn das für Dich bisher unspektakulär aussah, dann öffne jetzt mal das Logfile `C:\robots\web-images\log.html`.  
Der RobotFramework-Test hat nämlich nicht nur eine Webseite geöffnet.  
Er hat auch einen visuellen Vergleich durchgeführt, ob eines der Bilder in der "Hero"-Sektion auch wirklich das Motorrad enthält.

{{< figure src="img/loghtml-demo.gif" title="Das log.html mit dem Bildvergleich" loading="lazy">}}

Im nächsten Abschnitt wenden wir uns nun der Integration in Checkmk zu.

---

## Checkmk-Server

Auf dem Checkmk-Server (v2.4) ist bisher nicht viel passiert: der Windows-Host wird aktuell nur mit einem Vanilla-CMK-Agent überwacht:

{{< figure src="img/cmk-win1.png" title="Windows-Host in Checkmk" >}}

### Konfigurieren der Bakery

Der Robotmk-Scheduler kann auf Windows und Linux installiert werden. Es gibt dafür jeweils eine eigene Bakery-Regel, beide sind inhaltlich aber komplett gleich.  

> Pro Tipp: Alle Robotmk-Regeln findest Du am leichtesten, wenn Du im Setup-Menü den Suchstring "*robot*" eingibst.

Wir öffnen nun also die Regel-Page "*Robotmk Scheduler (Windows)*":

{{< figure src="img/bakery-search2.png" title="Alle Robotmk-Regeln werden am leichtesten über das Suchwort 'robot' gefunden." >}}

{{< figure src="img/bakery-rule2.png" title="Die Bakery-Rule für den Robotmk Scheduler." >}}

Nachfolgend erkläre ich Dir die Felder der Bakery-Regel mit den einzutragenden Werten:

| No  | Beschreibung                                                                                                       | Wert                      |
| --- | ------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| 1.  | Das Basisverzeichnis, in dem wir die Beispielsuite abgelegt hatten.                                                | `C:\robots`               |
| 2.  | Die erste (und einzige) parallele Ausführungsgruppe.                                                               |                           |
| 3.  | Je Ausführungsgruppe sind sequenzielle Ausführungen von Robot Framework-Suites möglich.                            |                           |
| 4.  | Ausführungsintervall der Gruppe                                                                                    | `3` minute                |
| 5.  | Name der zu testenden Applikation                                                                                  | `CarInsurance`            |
| 6.  | Der Pfad zur Robot Framework-Suite wird *relativ zum Basisverzeichnis* angegeben.                                  | `web-images\images.robot` |
| 7.  | Dieser Timeout bestimmt, wie viel Zeit die Suite vom Scheduler zur Ausführung bekommt. Danach wird sie terminiert. | `1`                       |
| 8.  | Relative Pfadangabe (wie 6.) zur `robot.yaml` (zentrale Config-Datei für RCC, enthält Verweis zur `conda.|yaml`)   | `web-images\robot.yaml`   |

Ganz unten wird die Regel auf den Host `windows` beschränkt:

{{< figure src="img/bakery-condition.png" title="Die Condition schränkt die Regel auf nur einen Host ein." >}}

Danach die Regel speichern.

### Agenten backen

Nun in die Agent Bakery wechseln...

{{< figure src="img/bakery-related.png" title="Das 'related'-Menü bietet eine praktische Abkürzung zur Bakery." >}}

...und einen neuen Installationsagenten backen:

{{< figure src="img/agent-bake.png" title="Backen eines neuen Agenten." >}}

Sobald die Erzeugung des Agenten-Installers fertig ist, siehst Du eine neue Zeile, in welcher ganz rechts der Host steht, auf den Du die Regel beschränkt hast (`windows`). Lade von hier das MSI-Paket herunter.

{{< figure src="img/agent-baked.png" title="Download MSI-Installer" >}}

### Discovery der Services

Der erste Service, der unmittelbar nach dem Deployment discovert werden kann ist der "Scheduler Status" service:

{{< figure src="img/discovery-schedulerstatus.png" title="Scheduler Status Service" >}}

Er überwacht den Robotmk Scheduler, der als Agent "Extension" dauerhaft neben dem Agenten herläuft.

Der Scheduler durchläuft nach dem Start des Agenten zwei Phasen:

- **Phase 1**: Sequenzielles Bauen aller RCC Environments
- **Phase 2**: Scheduling der Plans (=Konfigurierte Robot Framework-Suites) im konfigurierten Intervall.

Bis das Environment im Hintergrund vom Scheduler gebaut wurde, können ein paar Minuten vergehen.  
Wann es beendet ist, siehst Du daran, dass sich der Output des Scheduler Services ändert:

{{< figure src="img/plan-scheduling.png" title="Der Scheduler hat das Environment gebaut." >}}

Nachdem die erste Ausführung der Suite im Hintergrund (="headless") erfolgt ist, lassen sich zwei weitere Services discovern:

{{< figure src="img/discovery-plan-test2.png" title="Plan- u. TestService" >}}

- **Plan Service**: Genau wieder Scheduler Status ein an Administratoren gerichteter Service, der z.B. anschlägt, wenn Ergebnisse zu alt sind (=die Suite nicht mehr ausgeführt wird)
- **Test Service**: Gerichtet an Applikationsverantwortliche. Repräsentiert den Zustand (PASS/FAIL) des Tests aus Sicht von Robot Framework.

---

## Checkliste

Diese Checkliste fasst noch einmal alle Schritte in Kürze zusammen:

- ✓ Herunterladen und Entpacken des [Beispiel-Repos](https://github.com/elabit/robotmk-examples/archive/refs/heads/main.zip)
- ✓ Speichern der Robot-Suite im Basisverzeichnis  `C:\robots\`
- ✓ Die **Bakery-Regel** in Checkmk benötigt mindestens diese Einstellungen:
  - ✓ Basisverzeichnis (z.B. `C:\robots\`)
  - ✓ Ausführungsintervall der Gruppe
  - ✓ Application Name
  - ✓ (relativer) Pfad zum Suite-File/Verzeichnis
  - ✓ (relativer) Pfad zur `robot.yaml`
- ✓ Backen / Deployen / Installieren des Agenten
- ✓ Discovery

(Wenn alles geklappt hat, wäre das doch ein toller Zeitpunkt, das Projekt auf Github mit einem Stern :star: zu versehen, oder? :smile: )  
{{< github_button button="star" user="elabit" repo="robotmk" count="true" large="true" dark="false" >}}

---

## Wie geht es weiter?

Das war jetzt nur die Sitze des Eisberges... wir haben gerade mal zwei von über 200 RobotFramework-Libraries eingesetzt.  
Für Checkmk-Admins tut sich mit Robotmk eine neue Welt auf:

- Tests von Windows-Desktop-Applikationen
- Tests von RDP- und Citrix-Sessions
- API-Testing (REST/SOAP)
- Kubernetes-Testing
- PDF-Vergleiche
- MFA-Authentifizierungen mit OTP
- usw.

Ich brenne für dieses Thema und habe deswegen ein spezielles Training dafür entwickelt - die Trainingsinhalte findest Du auf <https://checkmk.com/trainings/classes>.  
Falls Du noch Fragen oder Probleme hast, buch doch einfach einen Clarity-Call (einfach oben auf "Support" klicken).  

Viel Spaß und tolle UMsetzungserfolge mit Robotmk!
