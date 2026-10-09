---
draft: true
title: "RCC-Environments - sicher bauen"
# --- Italic subheading
lead: "Ein kleiner Trick, der den Bau von Robot Framework Environments mit RCC sicherer macht."
# -- giscus id to match comments
commentid: rcc-env-supplychain
# -- predefined URL
# slug:
# -- for posts in menubar, use this (shorter) title
# menutitle:
#description:
date: "2026-08-31T09:00:00+02:00"
categories:
  - how-to
tags:
  - robotmk
  - rcc
  - environments
  - security
  - supply-chain
  - browser-library
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
thumbnail: "img/title.png"
# TODO: eigene VG-Wort-Zählmarke eintragen
vgwort:
translationKey: "rcc-env-supplychain"
---

**Robotmk** nimmt Dir eine Menge Arbeit ab:  
Du hinterlegst in einer Konfigurationsdatei (`conda.yaml`), welche Pakete Dein Test braucht, und der überwachte Host baut sich die passenden Laufzeitumgebungen für Robot Framework selbst zusammen.

Ich habe mir im Rahmen eines Kundenprojektes einmal genauer angesehen, was da eigentlich passiert, und bin dabei auf ein paar Punkte gestoßen, die mir nicht gefallen haben.  
Die gute Nachricht: Sie lassen sich mit einem einfachen Konzept umgehen.

<!--more-->

## Ein kurzes Vorwort zu RCC

**RCC** wurde ursprünglich von **Robocorp** entwickelt.  
Robocorp war ein Startup, das Robot Framework in die Cloud bringen wollte.  

RCC sollte für die Automatisierungen einen stabilen und idempotenten Unterbau garantieren - auf Kundenseite (während der Entwicklung) und in der Cloud (bei der Ausführung).  

Nach der Übernahme durch **Sema4.ai** im Jahr 2024 wurde das Werkzeug neu lizenziert und ist heute proprietär; die Weiterentwicklung der offenen Version wurde eingestellt.  

Checkmk pflegt seitdem einen **eigenen Fork** auf Basis der letzten quelloffenen Fassung, der fester Bestandteil von Robotmk/Synthetic Monitoring ist.

(RCC kann auch ohne Robotmk genutzt werden, z.B. für die lokale Entwicklung von Robot Framework Automatisierungen. In diesem Artikel geht es aber um die Nutzung in Verbindung mit Robotmk.)

RCC kann unter diesem Link heruntergeladen werden: [Robotmk Releases](https://github.com/elabit/robotmk/releases)

## Das Problem kompakt erklärt

Die Pakete, die RCC für Robot Framework installiert, kommen von öffentlichen Plattformen wie *PyPI* und *npm* - dort darf grundsätzlich jeder etwas veröffentlichen.  

Und genau da liegt das Problem: Wenn ein Maintainer eines Pakets plötzlich eine manipulierte Version nachschiebt, holt sich Dein Robotmk-Host diese Version beim nächsten Bau von ganz allein.

> Der Fachbegriff hierfür ist "**Supply-Chain-Angriff**": der **Angreifer** greift Dich nicht direkt an, sondern über etwas, das Du benutzt und dem Du vertraust.  
> Die bekannten Fälle der letzten Jahre liefen fast alle so ab.

---

## Konkretes Beispiel

Hier eine `conda.yaml`, mit der RCC ein Environment für Robot Framework baut: 

```yaml
channels:
  - conda-forge
dependencies:
  - python=3.12
  - pip=23.2.1
  - nodejs=22.11.0
  - pip:
      - robotframework==7.4
      - robotframework-browser==19.14.2
      - robotframework-crypto==0.3
rccPostInstall:
  - rfbrowser init chromium
```

Ich erkläre zunächst die Inhalte von oben: 

- **Python, Pip und Nodejs** werden von https://conda-forge.org geladen, einem Community-getriebenen Repository.
- Pip (Pythons interner Paketmanager) installiert die drei Pakete unterhalb des `pip:` Schlüssels
- Im Falle von **BrowserLibrary** kommt noch die letzte Zeile hinzu: `rfbrowser init` startet ein Python-Programm, mit dem das auf NodeJs basierende Playwright initialisiert wird. *Darauf gehen wir jetzt genauer ein.*

---

## Dependencies unter der Lupe

Ich habe mir einmal genauer angesehen, was beim Bau dieses Environments tatsächlich passiert.
Fangen wir unten an: 

### NodeJS

Der PostInstall-Befehl `rfbrowser init` installiert u.a. **Playwright**, und das kommt mit einer Datei Namens [package-lock.json](https://github.com/microsoft/playwright/blob/main/package-lock.json)), in der **jedes Paket** mit **exakter Version** und **Prüfsumme** steht.  


Da sämtliche Pakete mit exakter Version und Prüfsumme installiert werden, kann nichts unbemerkt hineinrutschen.

### Browser

In `rfbrowser init` werden auch die Browser-Binaries (hier nur "Chromium") von einem CDN herunter.

Eine Prüfsumme wird dabei nirgends verglichen.  

### Python 

Die `conda.yaml` gibt zwar nur drei Python-Pakete mit fester Version an...

```
  - pip:
      - robotframework==7.4
      - robotframework-browser==19.14.2
      - robotframework-crypto==0.3
```

...aber im fertigen Environment liegen **weit über hundert**.  

**Wie kann das sein?** 

Ganz einfach: **faule Entwickler sind gute Entwickler**, denn sie nutzen bestehenden Python-Code in ihrem Projekt, statt ihn selbst zu schreiben.

Solche "Sub-Dependencies" sind Dich in `conda.yaml` erst einmal unsichtbar, denn sie stecken in den Paketen selbst.  
Wie sie dort definiert sind (z.b.`mypackage>=2.1` oder -`mypackage`), siehst Du nicht.

Das bedeutet, dass es keine Garantie dafür gibt, dass sich Environments, die auf derselben `conda.yaml` basieren, immer mit dem gleichen Endergebnis bauen lassen.

Eines der hundert Pakete, die über Sub-Dependencies automatisch nachinstalliert werden, um die Sub-Dependencies zu erfüllen, kann also der Hebel für einen Angreifer sein. 

Wenn Du Dich an dieser Stelle vielleicht schon fragst: *Ist Robotmk deshalb unbenutzbar?*  
**Nein**, denn es gibt wirkungsvolle Strategien, die ich Dir unten vorstelle.  

---

## Das Problem: frisch kompromittierte Pakete

Ein frisch kompromittiertes und veröffneltichtes Paket steht **für ein bestimmtes Zeitfenster X** in keiner Malware-Datenbank, die von Scannern genutzt werden. In diesem Zeitfenster kann es also unbemerkt in Dein Environment gelangen.

Die wirksamste Strategie gegen diese Art von Angriffen ist ein kontrollierter Bauprozess, der die folgenden Punkte erfüllt:

- **Zeit.** Environments nicht auf brandneuen Versionen bauen. Kompromittierte Pakete werden meist binnen weniger Tage entdeckt und von dern Repos entfernt.
- **Einfrieren:** Ein einmal gebautes Environment kann sich kein neues bösartiges Paket einfangen.

---

## Das Rezept zu mehr Sicherheit in sieben Schritten

Im Standardbetrieb baut jeder Robotmk-Host sein Environment selbst.  
Das heißt: Jeder dieser Hosts baut seine eigenen Environments, und lädt sich die Quellen von PyPI, der npm-Registry und CDNs.  
Bei fünfzig Robotmk-Hosts ergibt das also fünfzig unbeaufsichtigte Einkaufstouren - bei jedem Rebuild erneut.

Wie man fertig gebaute Environments aus einem ZIP-File laden kann, habe ich in [RCC-Environments in isolierten Umgebungen]({{< ref "/rcc-envoffline/" >}}) schon einmal beschrieben - dort mit dem Fokus auf einer Lösung für air-gapped Hosts ohne jegliche Internetverbindung.  

Diesen Mechanismus machen wir uns hier in einem Workflow zu Nutze, mit dem Du das Risiko von Supply-Chain Attacken deutlich reduzieren kannst. 

Um es bildlich zu sagen: die ZIP-Datei, in die sich ein RCC-Environment exportieren lässt, enthält nicht einfach nur den "Einkaufszettel", sondern packt den komplett beladenen Einkaufswagen (die Browser-Binaries eingeschlossen) zusammen. 

Beim Import des ZIP-Files gibt es keine Möglichkeit, dass ein Host beim Rebuild ein neues Paket aus dem Internet zieht.

### Big Picture

Bevor wir in die einzelnen Schritte einsteigen, möchte ich die vier Artefakte hervorheben, die darin entstehen.  
Jedes Artefakt hat eine spezifische Rolle und beantwortet eine andere Frage:

| Schicht    | Artefakt                                | Beantwortet                                   |
| ---------- | --------------------------------------- | --------------------------------------------- |
| I. Absicht    | `conda.yaml`                            | Was will ich im Environment nutzen?           |
| II. Rezept | `environment_<os>_<arch>_freeze.yaml`   | Was soll genau installiert werden?        |
| III. Bewertung  | `requirements.txt`, `package-lock.json` | Sind die Python/Node-Pakete in Ordnung?                        |
| IV. Endprodukt   | `hololib.zip`                           | Das komplette, eingefrorene Environment |

Wichtig dabei: **Jede Schicht setzt die vorherige voraus.**  

- Aus der **conda.yaml** (I.) entsteht der eigentliche Bauplan, das **Freeze-File** (II.). Es bestimmt final, *womit* das ausgelieferte Artefakt (ZIP) gebaut wird.
- Das **ZIP** entscheidet, *wer* baut - nämlich niemand mehr außer dem Referenzsystem.


### Schritt 1 - Leg ein Referenzsystem an

👉 Referenzsystem = Ein Host je Plattform, mit Internetzugang, so nah wie möglich an der Zielumgebung: gleiche OS-Version, gleiche Architektur. 

Dieser Host ist der einzige Ort, an dem jemals ein Paket aus dem Internet gezogen wird.

Auf diesem Host brauchst Du: 

- Ein **Robot-Framework-Verzeichnis** mit `robot.yaml` und `conda.yaml`
- **RCC** (Download)[https://www.robotmk.org/en/blog/rcc-efficient-python-integration/#download-rcc]
- Das Script `depguard.py` (Download von [Gist](https://gist.github.com/simonmeggle/17abdec8f8039165404a69192d6e93fd))
- (optional) **OSV-Scanner** von Google (Download von [OSV Releases](https://github.com/google/osv-scanner/releases))

### Schritt 2 - Environment bauen

Wechsle in das Robot-Verzeichnis und baue das Environment:

```bash
rcc task script --space refbuild --robot robot.yaml -- python --version
```

Dieser Befehl baut ein komplettes RobotFramework-Environment, inklusive Browser-Binaries:

- `rcc task script`: Startet den Befehl hinter dem doppelten Bindestrich
- `--space refbuild` (optional, empfohlen): Weist RCC an, nicht das Environment im Default-Namespace zu überschreiben. 
- `--robot robot.yaml`: Gibt den Pfad zur RCC-Configdatei an (die auf `conda.yaml` verweist)
- `--`: Trennt die RCC-Parameter von dem Befehl, der im Environment ausgeführt werden soll
- `python --version`: Ein beliebiger Befehl, der im gebauten Environment ausgeführt wird. Ich habe hier `python --version` gewählt, weil er schnell ist und keine weiteren Abhängigkeiten hat.
  
Gleichzeitig legt RCC eine "**Freeze**"-Datei an: sie befindet sich im Unterordner `output`. Darin hat RCC nun alle transitiven Abhängigkeiten (Python & Node) **mit ihrer exakten Version** festgeschrieben.

Die Freeze-Datei benennt RCC nach dem Schema `environment_<os>_<arch>_freeze.yaml`, wobei die Platzhalter für die Plattform stehen, auf der Du gerade baust:

- `<os>` = Betriebssystem, also `linux`, `windows` oder `darwin` (ja, `darwin` - nicht `macos`)
- `<arch>` = Architektur, z.B. `amd64`

{{< figure src="img/freeze.png" title="Plattformspezifisches Freeze-File unter Windows mit AMD-Architektur" >}} 

Schiebe diese Datei nun 1 Ebene nach oben ins Robot-Verzeichnis (neben `conda.yaml`). 

{{< figure src="img/freeze_conda.png" title="Das Freeze-File wird neben conda.yaml abgelegt" >}} 

Öffne dann `robot.yaml` und trage die freeze-Datei unter dem Key `environmentConfigs` **vor** der `conda.yaml` ein. 

{{< figure src="img/robotfreeze.png" title="Das Freeze-File wird in robot.yaml referenziert" >}} 

> Möchtest Du das Environment auch auf Linux nutzen, wiederhole dort einfach den kompletten Schritt 2.

Achte darauf, dass `conda.yaml` in der Liste ganz unten steht, und die plattformspezifischen Freeze-Files davor. RCC verwendet als Bauplan die Datei, die zuerst auf die Plattform passt; `conda.yaml` ist der Fallback. 

### Schritt 3 - Karenzzeit von Python-Paketen prüfen

Wir stellen als Regel auf, keine Python-Abhängigkeiten laden zu wollen, die jünger als **14 Tage** sind. Statistisch deckt das schon den Großteil der realen Angriffsfenster ab.  

Um das zu prüfen, habe ich `depguard.py` geschrieben. Du kannst es [hier](https://gist.github.com/simonmeggle/17abdec8f8039165404a69192d6e93fd) herunterladen.

Leg es ins Robot-Verzeichnis und führe es mit `rcc task script` direkt im Environment aus:

```bash
rcc task script --space refbuild -- python3 depguard.py grace-check
```

```
  394 d  ok       cffi 2.0.0
  169 d  ok       click 8.3.3
  192 d  ok       grpcio 1.80.0
  192 d  ok       grpcio-tools 1.80.0
 1206 d  ok       natsort 8.4.0
  984 d  ok       overrides 7.7.0
 1174 d  ok       pip 23.2.1
  407 d  ok       prompt_toolkit 3.0.52
  204 d  ok       protobuf 6.33.6
  253 d  ok       psutil 7.2.2
  260 d  ok       pycparser 3.0
  280 d  ok       PyNaCl 1.6.2
  377 d  ok       PyYAML 6.0.3
  406 d  ok       questionary 2.1.1
  300 d  ok       robotframework 7.4
  239 d  ok       robotframework-assertion-engine 4.0.0
  185 d  ok       robotframework-browser 19.14.2
 2016 d  ok       robotframework-crypto 0.3.0
  265 d  ok       robotframework-pythonlibcore 4.5.0
  491 d  ok       seedir 0.5.1
  255 d  ok       setuptools 80.10.2
  409 d  ok       typing_extensions 4.15.0
  159 d  ok       wcwidth 0.7.0
  259 d  ok       wheel 0.46.3
  216 d  ok       wrapt 2.1.2
```

Die Ausgabe zeigt: alles ok, alle Pakete sind mindestens 14 Tage alt.

Was macht das Script genau?

- Es legt die **Prüfliste** an, indem es `pip freeze --all` aufruft und in `requirements.txt` speichert. 
- Es analysiert `requirements.txt`, um zurückgezogene Releases zu erkennen (Flag: `YANKED`). Ein von PyPI *zurückgezogenes* Release ist ein Warnsignal. 
- Es liefert einen Exitcode > 0 bei jedem Fund - also ist es scriptbar und auch für einen CI-Lauf brauchbar.

Zwei Schalter, die Du kennen solltest: `--min-age DAYS` ändert die Karenzzeit (Default 14), `-f FILE` prüft eine andere Datei (das überspringt `pip freeze`), und `-y` beantwortet alle Rückfragen mit ja, falls kein Terminal da ist.

**Was tun bei Funden?**

Wenn das Script bei Dir Pakete meldet, die zurückgezogen worden oder jünger als 14 Tage sind, öffne `conda.yaml` und ändere die Version des Pakets auf die letzte Version, die älter als 14 Tage ist. Du kannst das Alter der Versionen jederzeit auf [PyPI](https://pypi.org/) nachschauen.

> Man könnte nun einwenden, dass man durch die Festlegung auf ältere Versionen ja bewusst Verbesserungen außen vor lässt. Schließlich werden neue Lücken ja erst in neueren Versionen geschlossen.  
> Wenn man aber auf den Zeitstrahl schaut, erkennt man: Die Karenzzeit von lediglich 14 *Tagen* schützt vor **unbekannter, absichtlicher** Manipulation; Du nimmst einfach die neueste Version, die älter als 14 Tage ist - und das ist praktisch immer eine gefixte.

### Schritt 4 - Auf Schwachstellen prüfen

Jetzt die zweite Frage: Sind in den Paketen **bekannte** Lücken?  

Das beantwortet der [OSV-Scanner](https://github.com/google/osv-scanner) von Google, der die Datenbank [osv.dev](https://osv.dev) abfragt.  

Und auch hier übernimmt `depguard.py` die Arbeit:

```bash
rcc task script --space refbuild -- python3 depguard.py osv-scan
```

Ohne Argument prüft es **beide** für uns relevanten Bereiche: 

- Python (requirements.txt)
- NodeJS (package-lock.json). 

> Das Script erwartet das `osv-scanner`-Binary im `PATH` oder im aktuellen Verzeichnis - andernfalls fragt es, ob es den Scanner herunterladen soll und prüft den Download gegen die von Google veröffentlichte Checksumme. (Das ist der "Streber-Modus" - für einen Artikel über SupplyChains wäre alles andere auch schlecht zu rechtfertigen. 😄 )

Erwähnenswert ist, dass das `package-lock.json` der Browser Library **alles** enthält, was die Entwickler brauchen - nicht das, was bei Dir installiert wird.  
Im untersuchten Stand sind das 807 Einträge, von denen **722 mit `"dev": true` markiert** sind.  
Ein naiver Scan prüft also zu 90 % Zeug, das nie auf einem Robotmk-Host landet.

`depguard.py` filtert die Dev-Einträge deshalb automatisch aus einer Kopie des Lockfiles heraus, bevor es scannt, und sagt Dir, was es getan hat:

```
=== osv-scan node: package-lock.json ===
dev dependencies excluded: 722 skipped, 84 scanned (use --dev to include them)
```

(Mit `--dev` bekommst Du die vollständige Liste, wenn Du sie sehen willst.)

Übrig bleiben vier Pakete; die gefundenen Lücken sind real: `protobufjs` (12 Advisories), `@grpc/grpc-js` (4), `@protobufjs/utf8` (1) und `uuid` (1). 

#### Die Ausgabe lesen

So sieht ein Ergebnis aus (hier die Python-Seite, gekürzt):

```
Total 2 packages affected by 8 known vulnerabilities (0 Critical, 1 High, 6 Medium, 1 Low, 0 Unknown) from 1 ecosystem.
8 vulnerabilities can be fixed.

+-------------------------------------+------+-----------+------------+---------+---------------+
| OSV URL                             | CVSS | ECOSYSTEM | PACKAGE    | VERSION | FIXED VERSION |
+-------------------------------------+------+-----------+------------+---------+---------------+
| https://osv.dev/PYSEC-2026-196      | 8.0  | PyPI      | pip        | 23.2.1  | 26.1.2        |
| https://osv.dev/GHSA-wf93-45jw-7689 |      |           |            |         |               |
| https://osv.dev/PYSEC-2023-228      | 6.8  | PyPI      | pip        | 23.2.1  | 23.3          |
| https://osv.dev/GHSA-mq26-g339-26xf |      |           |            |         |               |
| https://osv.dev/PYSEC-2026-3447     | 6.1  | PyPI      | setuptools | 80.10.2 | 83.0.0        |
| https://osv.dev/GHSA-h35f-9h28-mq5c |      |           |            |         |               |
+-------------------------------------+------+-----------+------------+---------+---------------+
```

Das sieht jetzt erst einmal gruselig aus. Dinge, die man wissen muss, um das richtig zu lesen:

- OSV URL: Dort kann man die Details der Lücke/Schwachstelle nachlesen.
  - Jeder Fund steht mit **zwei** IDs da, einer `PYSEC-` und einer `GHSA-` - das sind Aliasse für dasselbe Problem.
- CVSS-Base-Score: Die Grenzen sind: 
  - 0,1-3,9 = *Low*
  - 4,0-6,9 = *Medium*
  - 7,0-8,9 = *High*
  - 9,0-10,0 = *Critical*
- ECOSYSTEM: PyPI = Python, npm = NodeJS
- PACKAGE: Name des Pakets, das die Lücke enthält
- **`FIXED VERSION`** sagt Dir, in welcher Version die Lücke behoben ist.  

Behalte aber auch im Kopf, dass das **CVSS ein Maß für Schwere** ist, nicht für Risiko. (Der Score weiß nicht, ob Dein Robot die betroffene Funktion überhaupt aufruft.)

### Schritt 5 - Bewerten und entscheiden

**Null Funde sind nicht das Ziel** - sie sind bei einem Environment aus Python, NodeJS und einem Browser auch nicht erreichbar.  
Die acht Funde oben stecken ausschließlich in `pip` und `setuptools`: Build-Werkzeug, das im Environment liegt, aber zur Testlaufzeit nicht aufgerufen wird.  
Das wird nie null, solange `pip` mitinstalliert ist.

Der Anspruch heißt deshalb nicht "keine Funde", sondern **"keine unbewerteten Funde"**. Arbeite die Liste in dieser Reihenfolge durch - CVSS kommt darin zuletzt:

1. **Ist das Paket überhaupt installiert?** Auf der npm-Seite fällt damit der größte Teil weg.
2. **Läuft es zur Testlaufzeit oder nur beim Bauen?** Das erledigt `pip` und `setuptools`.
3. **Nutzt der Robot diesen Codepfad?**
4. *Erst jetzt* CVSS - als Reihenfolge innerhalb des Rests, nicht als Einstieg.

#### Und wenn Du hochziehen willst: wo denn?

Entscheidest Du Dich für einen Fix, zeigt Dir die Spalte `FIXED VERSION` die Zielversion. Bleibt die Frage, wo Du sie einträgst - denn das betroffene Paket steht mit hoher Wahrscheinlichkeit gar nicht in Deiner `conda.yaml`. Es ist eine der vielen transitiven Abhängigkeiten.

**Die Antwort ist unintuitiv: nicht in die `conda.yaml`.** Sobald das Freeze-File in `environmentConfigs` davor steht, ist eine Änderung dort **wirkungslos** - ohne Fehlermeldung. Ich habe das mit zwei sich widersprechenden Dateien geprüft:

| Datei | Inhalt |
|---|---|
| `conda.yaml` | `six==1.17.0` |
| Freeze-File (steht zuerst) | `six==1.16.0` |

Installiert wurde `six 1.16.0`. Das Freeze-File gewinnt immer.

**Du trägst die Zielversion also ins Freeze-File ein.** Und das ist einfacher als es klingt: Das Freeze-File ist eine vollständige Environment-Spezifikation, kein Protokoll. Ein transitives Paket pinnst Du dort, indem Du es einfach hinschreibst - auch wenn es in der `conda.yaml` nie vorkam:

```yaml
- pip:
  - requests==2.31.0      # direkte Abhängigkeit
  - urllib3==1.26.18      # transitiv, in conda.yaml nicht erwähnt
```

Welche Sektion die richtige ist, sagt Dir das Freeze-File selbst:

- Steht das Paket **über** dem `- pip:`-Schlüssel, kommt es von conda-forge: ein Gleichheitszeichen, z.B. `openssl=3.6.5`.
- Steht es **darunter**, ist es ein pip-Paket: zwei Gleichheitszeichen, z.B. `cffi==2.1.0`.

Praktischer Hinweis: `pip` und `setuptools` liegen auf der conda-Seite - und das sind genau die beiden Pakete, die oben alle acht Funde verursachen.

Zwei Wege, und sie sind nicht gleichwertig:

- **Chirurgisch**, für einen einzelnen Fund: Version im Freeze-File ändern, neu bauen. Es bewegt sich genau ein Paket, Deine Bewertung aller anderen bleibt gültig. Für den Normalfall der richtige Weg.
- **Neu aufrollen**, beim geplanten Refresh: Freeze-File wegnehmen, Pin in die `conda.yaml`, aus der `conda.yaml` neu bauen - RCC erzeugt ein frisches Freeze-File. Dabei würfelst Du aber **alle** losen Abhängigkeiten neu, und Schritt 3 bis 5 musst Du danach komplett wiederholen.

Und in beiden Fällen: **Schreib den Pin zusätzlich in die `conda.yaml`.** Nicht weil er dort wirkt, sondern weil er sonst verloren geht, sobald jemand das Freeze-File löscht und neu baut. Die `conda.yaml` ist Dein Absichtsdokument - ein Kommentar wie `# CVE-Fix, siehe GHSA-...` gehört dorthin.

Zwei Dinge danach:

- **Die Fixversion muss die Karenzzeit bestehen.** Ein gerade erschienener Fix ist jünger als 14 Tage - dann greift die Ausnahme von oben. Lass `depguard.py grace-check` nach dem Rebuild erneut laufen.
- **Ein Konflikt ist die richtige Antwort.** Kann pip die Fixversion nicht auflösen, weil eine direkte Abhängigkeit sie ausschließt, hast Du genau die Information, die Du brauchst: Dann musst Du die direkte Abhängigkeit hochziehen, nicht die transitive.

#### Auf der NodeJS-Seite hast Du diesen Hebel nicht

Das muss man klar sagen, weil `FIXED VERSION` dort eine Handlung suggeriert, die es nicht gibt. Das `package-lock.json` liegt **im Wheel** der Browser Library - Du besitzt es nicht, und ein Freeze-File dafür gibt es nicht. Für Funde in `protobufjs` oder `@grpc/grpc-js` bleiben Dir drei Möglichkeiten:

1. `robotframework-browser` auf eine Version hochziehen, deren mitgeliefertes Lockfile den Fix enthält
2. bewerten und akzeptieren - es ist die gRPC-Brücke zwischen Python und NodeJS, kein von außen erreichbarer Angriffspfad
3. es der Browser Library melden

### Schritt 6 - Exportieren

Sobald Du also bei einer `conda.yaml` angekommen bist, die mit den Du mit Hilfe des Scripts `depguard.py` geprüft und bewertet hast, exportierst Du das Environment in eine ZIP-Datei:

```bash
rcc holotree export --space refbuild --robot robot.yaml --zipfile hololib.zip
```

Die Datei wird **nicht** versioniert - sie ist ein Binärartefakt und gehört nicht in ein Git-Repo. Ins Repo gehören `conda.yaml`, das Freeze-YAML, `requirements.txt`, `package-lock.json` und `osv-scanner.toml`.

### Schritt 7 - Verteilen und einziehen

Der Transportweg ist Deine Sache: kopieren, Ansible, ein Fileshare - was bei Dir ohnehin etabliert ist. Auf dem Zielhost:

```bash
rcc holotree import hololib.zip
rcc holotree check                 # prüft die Library gegen ihre Digests
export RCC_NO_BUILD=1              # alternativ: options.no-build in settings.yaml
```

`RCC_NO_BUILD=1` ist der eigentliche Schalter. Ab hier darf der Host kein Environment mehr selbst bauen. Was nicht in der Hololib liegt, läuft nicht - und das ist die **gewünschte** Fehlermeldung, kein Problem.

### Und danach: wiederholen

Ein grüner Scan heißt "keine zum Prüfzeitpunkt bekannten Schwachstellen". Dasselbe unveränderte Environment kann morgen verwundbar sein, ohne dass sich ein einziges Byte geändert hat. Der Scan muss deshalb wiederkehrend laufen - und das braucht keine Zielumgebung, nur die zwei Dateien aus dem Repo:

```cron
0 6 * * 1  osv-scanner scan source --no-resolve --config=/srv/robots/foo/osv-scanner.toml \
             -L requirements.txt:/srv/robots/foo/requirements.txt \
             -L package-lock.json:/srv/robots/foo/package-lock.json
```

> **Ehrlich gesagt:** Dieser Cron-Job schickt eine Mail, die nach drei Wochen niemand mehr liest. Er ist die richtige Sofortlösung und die falsche Dauerlösung. Was daraus ein Zustand wird, der auffällt, steht ganz unten im Ausblick.

---

## Drei Messfallen

Jetzt kommt der Abschnitt, der mir persönlich der wichtigste ist. Alle drei Fallen sind bei der Untersuchung tatsächlich zugeschnappt, und alle drei führen zu Zahlen, die **falsch sind, ohne falsch auszusehen**. Die eigentliche Botschaft dieses Artikels ist nicht "scanne Dein Environment", sondern: so scannst Du es richtig.

### Falle 1 - `pip freeze` unterschlägt drei Pakete

`pip freeze` lässt `pip`, `setuptools` und `wheel` per Default weg. Klingt harmlos. Ist es nicht:

```
$ rcc task script --space refbuild -- pip freeze       | wc -l
22
$ rcc task script --space refbuild -- pip freeze --all | wc -l
25
$ diff …
> pip==23.2.1
> setuptools==80.10.2
> wheel==0.46.3
```

Drei Zeilen Differenz. Und jetzt der Scan auf beide Dateien:

| Eingabe | Pakete | Funde |
|---|---:|---|
| `pip freeze --all` | 25 | **8** (7 in `pip 23.2.1`, 1 in `setuptools 80.10.2`) |
| `pip freeze` | 22 | `No issues found` |

Ohne `--all` bekommst Du also keinen um ein Drittel zu kurzen Scan, sondern einen **vollständig grünen - der zu 100 % falsch ist.** Sämtliche Funde dieses Environments stecken in genau den drei Paketen, die `pip freeze` weglässt. `--all` ist keine Option, sondern Pflicht - und genau deshalb erzeugt `depguard.py` die Datei bei Bedarf selbst, statt sich darauf zu verlassen, dass Du den Schalter kennst.

### Falle 2 - osv-scanner erfindet Pakete

Beim Scannen einer Manifest-Datei löst osv-scanner per Default transitive Abhängigkeiten über deps.dev auf. Das klingt hilfreich und ist es hier nicht: Der Scanner meldet dann Pakete und Versionen, **die in Deinem Environment gar nicht existieren**.

Wichtig für die Einordnung: Auf einer **vollständig gepinnten** Datei - und genau das ist die Ausgabe von `pip freeze --all` - ändert `--no-resolve` nichts. Ich habe beide Varianten gegeneinander laufen lassen: identisch, 8 Funde. Es gibt dort nichts aufzulösen.

Sobald die gescannte Datei aber **Versionsbereiche** enthält (`>=`), fängt das Raten an. Und das passiert schneller als man denkt - die Browser Library bringt selbst eine solche `requirements.txt` mit, die Dir in Falle 3 vor die Füße fällt:

> **Beleg · Phantomfund**
>
> ```
> gemeldet:     setuptools 9.1.0     (veröffentlicht 2014-12-29)   6 Advisories
> installiert:  setuptools 84.0.0    ohne Befund
> ```
>
> Zusätzlich erschien `pdfminer-six` doppelt, einmal als `20221105` und einmal als `20221105.0.0` - vier Advisories doppelt gezählt.

Mit `--no-resolve` verschwinden beide Artefakte, und jeder verbleibende Fund lässt sich Zeile für Zeile gegen die Installation verifizieren. Genau das willst Du: eine Liste, die Du nachprüfen kannst.

### Falle 3 - der rekursive Scan findet das Falsche

Der naheliegende Griff ist `osv-scanner -r` auf das entpackte Environment. Der liefert nicht, was er verspricht - denn osv-scanner sucht per Default Manifest- und Lock-Dateien, keine installierten Distributionen:

> **Beleg · `osv-scanner scan source -r <holotree-space>`**
>
> ```
> Scanned …/Browser/requirements.txt           → 10 Pakete   (deklariert, mit >=-Ranges)
> Scanned …/Browser/dev-requirements.txt       → 31 Pakete   (Dev-Deps der Library!)
> Scanned …/Browser/wrapper/package-lock.json  → 509 Pakete
> ```

Die über hundert tatsächlich installierten Python-Distributionen kommen darin **nicht vor**. Der Scan findet stattdessen die Dev-Requirements der Browser Library. Er ist also nicht bloß unvollständig - er ist irreführend. Mit `--experimental-plugins=python/wheelegg` liest osv-scanner zwar `dist-info/METADATA`, zieht dann rekursiv aber auch `node_modules` mit und zählt Pakete doppelt.

### Und die vierte, die keine Falle ist, sondern ein Gewinn

Diese Falle ist die einzige, die sich vollständig automatisieren lässt - deshalb erledigt `depguard.py` den Filter schon oben in [Schritt 4](#schritt-4---auf-schwachstellen-prüfen).

Der Punkt dahinter ist aber wichtig genug für eine eigene Betrachtung, denn er erklärt, warum ein Erstscan so erschreckend aussieht:

| Ebene | Gescannt | Advisories | High+Critical |
|---|---:|---:|---:|
| Python (`requirements.txt`) | 25 | 8 | 1 |
| npm, ungefiltert | 761 | 82 | 49 |
| npm, nur Laufzeit | 79 | 18 | 10 |

Auf der Python-Seite stimmen gemeldet und installiert überein - logisch, die Liste kommt ja aus der Installation selbst. Auf der npm-Seite dagegen betreffen **64 der 82 Advisories Pakete, die nie installiert werden.**

Wer also einen Erstscan macht und 49 High-Findings sieht, erschrickt zu Recht - und zu früh. Nach dem Filter sind es zehn, verteilt auf vier Pakete. Das ist eine Liste, die man an einem Nachmittag bewertet, statt eine, die man wegklickt.

---

## Bewerten, nicht abarbeiten

Der erste Lauf auf einem realen Environment lieferte bei mir 161 Funde. Wer daraus eine Abarbeitungsliste macht, hat schon verloren. Und wer bei jedem Fund automatisch neu baut, tauscht ein bekanntes Risiko gegen das unbekannte - das laut Bedrohungsmodell oben das größere ist.

Die Frage bei jedem Fund lautet nicht "wie hoch ist der CVSS", sondern: **Betrifft er einen Codepfad, den dieser Robot nutzt?**

- **Ja** → Rebuild einplanen, mit Karenzzeit, als bewusstes Ereignis.
- **Nein** → bewertet und akzeptiert, **mit Verfallsdatum**.

Ein CVSS 9 in einem Codepfad, den Dein Robot nie betritt, ist harmloser als ein CVSS 5 im HTTP-Client, über den Deine Credentials laufen.

Für den zweiten Fall gibt es einen Mechanismus, der ohne Prozess, ohne Dokument und ohne Erinnerung auskommt - eine `osv-scanner.toml` neben den Prüfdateien:

```toml
[[IgnoredVulns]]
id = "GHSA-2pr8-phx7-x9h3"
ignoreUntil = 2026-11-30
reason = "protobufjs: betroffener Codepfad wird vom Robot nicht erreicht. Bewertet 2026-08-31."
```

`ignoreUntil` ist dabei das Entscheidende: **Die Bewertung verfällt von selbst**, und der Fund kommt zurück, ohne dass jemand daran denken muss. Das ist "Freigabe als Zustand mit Verfallsdatum" - nur eben als drei Zeilen TOML im Repo statt als Prozess, den sich in den wenigsten Umgebungen wirklich jemand etabliert.

Bewusst **nicht** Teil des Konzepts: ein Freigabedokument, eine `SECURITY.md`, eine Vier-Augen-Regel. Die Begründung steht in der `reason`-Zeile, das Datum steht im Git-Log. Das reicht.

---

## Wenn Du im Internet-Modus bleiben willst

Nicht jede Umgebung braucht das Artefakt-Modell, und der Standardbetrieb bleibt vollkommen legitim: Hosts bauen selbst, ziehen ihre Pakete und tun das seit Jahren ohne Zwischenfall.

Wenn Du aus diesem Artikel nur **eine** Sache mitnimmst, dann diese: **Mach die Schritte 2 bis 5 trotzdem.** Das Freeze-File ist der Teil des Konzepts, der auch im Internet-Modus funktioniert - und er ist mit Abstand der billigste. Eine Datei hochschieben, vier Zeilen `robot.yaml`, einmal prüfen. Damit ist das Loch zu, um das es in diesem Artikel hauptsächlich geht: dass Dir eines von hundert unsichtbaren Sub-Dependencies untergeschoben wird.

Was das ZIP darüber hinaus bringt, ist der Rest: das ungeprüfte Browser-Binary und die N-fache Einkaufstour. Wichtig, aber der zweite Schritt.

Zwei weitere Dinge sind auch ohne das Artefakt-Modell ohne Aufwand zu haben:

```bash
# Browser-Binaries einmal bereitstellen, Hosts laden nichts nach
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers

# oder: den Download-Weg umlenken statt den CDN direkt zu nutzen
PLAYWRIGHT_DOWNLOAD_HOST=https://<eigener-host>
```

Beide Variablen sind im gebauten Environment verifiziert; es braucht dafür keinen Patch an Robotmk oder der Browser Library. Was sie **nicht** leisten: eine Prüfsummenverifikation der Binaries. Die gibt es in Playwright schlicht nicht, und ein umgelenkter Download ist ein kontrollierter Weg - keine geprüfte Datei.

---

## Was das Konzept nicht leistet

Damit hier niemand mit falschen Erwartungen rausgeht:

- **Es fängt kein frisch kompromittiertes Paket.** Die Karenzzeit verkleinert das Fenster, sie schließt es nicht. Ein Paket, das heute kompromittiert und in 20 Tagen entdeckt wird, geht durch.
- **Es verifiziert die Browser-Binaries beim ersten Bezug nicht.** Es sorgt nur dafür, dass dieser ungeprüfte Bezug **einmal** stattfindet statt N-mal, und zwar unter Aufsicht.
- **Es prüft die `hololib.zip` nicht auf dem Transportweg.** Ohne Rollentrennung ist der Bauende auch der Verteilende; eine Signatur wäre Theater. `rcc holotree import` scheitert an beschädigten Dateien, mehr wird bewusst nicht beansprucht.
- **Ein grüner Scan ist ein Zustand, keine Eigenschaft.** Er gilt für den Prüfzeitpunkt und für nichts danach.
- **Ein Versions-Pin ist kein Herkunftsnachweis.** Das Freeze-File pinnt Name und Version - keinen Hash und keinen Index. Solange Hosts selbst bauen, lösen sie weiter gegen den Index auf, der bei ihnen konfiguriert ist. Das schützt gegen "jemand schiebt eine neue Version nach", nicht gegen einen kompromittierten Mirror, einen TLS-aufbrechenden Proxy oder einen internen Index, der einen Paketnamen überschattet. Erst das ZIP schließt das, weil die Bytes mitreisen und `rcc holotree check` sie gegen ihre Digests prüft.
- **Baut jeder Host selbst, attestiert er sich selbst.** Jeder Host berechnet seine eigenen Digests über seinen eigenen Download. Es gibt keinen Quervergleich - ein Host, der ein manipuliertes Binary bekommt, verbucht es als korrekt.
- **Du tauschst Sicherheit gegen Verfügbarkeit.** Eine gepinnte Version, die zurückgezogen oder aus dem Kanal geräumt wird, bricht **jeden** Rebuild. Das ist der richtige Tausch - ein lauter Fehler ist besser als eine stille Ersetzung -, aber es ist ein neues Betriebsrisiko. Das `YANKED`-Urteil aus Schritt 3 ist Deine Frühwarnung dafür.

Der ehrliche Anspruch lautet deshalb nicht "das Environment ist sicher", sondern:

> *Geprüft am TT.MM., keine bekannten Schwachstellen außer den bewerteten, gebaut aus Paketen mit mindestens 14 Tagen Karenz, unverändert seit dem Export.*

Das ist der Satz, der trägt, wenn jemand nachfragt. Und er ist deutlich mehr wert als ein Häkchen.

---

## Fazit - und ein Ausblick 🔭

Angefangen hat das mit einer Frage zu einer einzigen Zeile `conda.yaml`. Herausgekommen ist keine Sicherheitslücke und kein Skandal, sondern etwas Nützlicheres: **eine klare Vorstellung davon, wo die Lieferkette eines RCC-Environments belastbar ist und wo nicht** - und ein Weg, der ohne Artifactory, ohne Mirror und ohne Build-Team auskommt.

Die eigentliche Bewegung ist dabei ganz unspektakulär: Statt dass hundert Hosts hundertmal unbeaufsichtigt einkaufen gehen, geht **ein** Host **einmal** einkaufen, und Du siehst ihm dabei zu.

Bleibt die ehrliche Schwachstelle: der Cron-Job aus Schritt 7. Er erzeugt eine Mail, keinen Zustand. Dabei betreibst Du längst ein System, dessen einziger Zweck es ist, wiederkehrende Prüfungen auszuführen und bei Abweichung zu alarmieren.

**Teil 2** beschreibt deshalb ein Checkmk-Agent-Plugin, das auf dem Scheduler-Host läuft, aus der `robotmk.json` liest, welche Environments überhaupt in Gebrauch sind, den Scanner mitbringt und je Environment einen Service liefert - mit einer Baseline beim Erstlauf, damit der Check bei Inbetriebnahme nicht als rote Wand startet, sondern genau das meldet, was Dich interessiert: *seit gestern ist etwas Neues bekannt geworden.*

Bis dahin interessiert mich Deine Sicht: **Baut Ihr Eure Environments auf jedem Host - oder habt Ihr das längst zentralisiert?** Und falls ja: Woran ist es bei Euch gescheitert, bevor es funktioniert hat? Schreib es in die Kommentare oder schick mir eine Mail.
