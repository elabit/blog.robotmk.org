---
draft: true
title: "Drei Pakete, fünfzig Downloads"
# --- Italic subheading
lead: "Was `rfbrowser init` wirklich tut - und warum die Antwort auf das Problem längst in Deinem `output`-Verzeichnis liegt."
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

Robotmk nimmt Dir eine Menge Arbeit ab: Du schreibst in einer Konfigurationsdatei auf, was Dein Test braucht, und der überwachte Host baut sich die passenden Laufzeitumgebungen für Robot Framework selbst zusammen.

Ich habe mir im Rahmen eines Kundenprojektes einmal genauer angesehen, was da eigentlich passiert, und bin dabei auf ein paar Punkte gestoßen, die mir nicht gefallen haben. Die gute Nachricht vorweg: Das Gegenmittel ist eine einzige Datei, und RCC schreibt sie Dir längst - Du musst sie nur benutzen.

<!--more-->

## Das Problem kompakt erklärt

Die Pakete, die RCC für Robot Framework installiert, kommen von öffentlichen Plattformen wie PyPI und npm - dort darf grundsätzlich jeder etwas veröffentlichen.

Und genau da liegt das Problem: Wenn jemand eines solcher Pakete missbraucht, indem er eine manipulierte Version nachschiebt, holt sich Dein Robotmk-Host diese Version beim nächsten Bau von ganz allein.

**Auf einem Server, der in Deinem Netz steht und Zugangsdaten für die Anwendungen kennt, die er testet.**

> **Info:** Der Fachbegriff hierfür ist "**Supply-Chain-Angriff**" - nicht der Angreifer greift Dich an, sondern etwas, das Du benutzt und dem Du vertraust. Die bekannten Fälle der letzten Jahre liefen fast alle so ab.

---

## Konkretes Beispiel

Hier eine `conda.yaml`, wie sie ein Environment für Robot Framework beschreibt:

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

Die Inhalte kurz erklärt:

- Python, Pip und Nodejs werden von [conda-forge](https://conda-forge.org) geladen, einem Community-getriebenen Repository.
- Pip ist Pythons interner Paketmanager: sobald er installiert ist, holt er sich von [PyPI](https://pypi.org) RobotFramework, die Browser Library und die CryptoLibrary.
- Im Falle der Browser Library kommt noch die letzte Zeile hinzu: `rfbrowser init` startet ein Python-Programm, mit dem das auf NodeJS basierende Playwright initialisiert wird. *Darauf gehen wir gleich genauer ein.*

---

## Wo die Kette hält - und wo nicht

Die gute Nachricht zuerst: **Auf der Node-Seite ist alles festgezurrt.** Playwright bringt ein [`package-lock.json`](https://github.com/microsoft/playwright/blob/main/package-lock.json) mit, in dem jedes Paket mit exakter Version und Prüfsumme steht, und installiert genau die - nicht das, was gerade aktuell ist. Da kann nichts unbemerkt hineinrutschen.

Zwei andere Stellen sind aber offen.

### Erstens: der nachgeladene Browser

`rfbrowser init` holt am Ende Chromium von einem Download-Server. Eine Prüfsumme wird dabei nirgends verglichen. Was ankommt, wird ausgepackt und benutzt. Wie wenig das trägt, hat sich bei meinem Testlauf von selbst gezeigt:

```
10:47:17  npx --quiet playwright install
10:47:20  Error: Download failed: server returned code 400 body
          'GatewayExceptionResponse'.
          URL: https://playwright.azureedge.net/builds/chromium/1084/chromium-mac-arm64.zip
10:47:22  |                    |   0% of 131.1 Mb
10:47:43  |████████████████████| 100% of 131.1 Mb
10:48:21  rfbrowser init completed
```

Ein Fehlschlag, ein stiller zweiter Versuch, ein Erfolg - und niemand prüft, ob das, was da im zweiten Anlauf ankam, auch das ist, was ankommen sollte.

### Zweitens: schwaches Versions-Pinning in Python

Schau Dir die `conda.yaml` oben an: dort stehen drei Python-Pakete mit fester Version. Im gebauten Environment liegen deutlich mehr.

Wie kann das sein? Ganz einfach: **faule Entwickler sind gute Entwickler**, denn sie nutzen bestehenden Python-Code, statt ihn selbst zu schreiben. Solche Abhängigkeiten bleiben für Dich in `conda.yaml` unsichtbar. Sie stecken in den Paketen selbst - oft sehr vage bis gar nicht:

- `mypackage==2` installiert das aktuellste *mypackage*, Hauptsache über Version 2
- `mypackage>=2.1` installiert das aktuellste *mypackage*, Hauptsache über Version 2.1
- `mypackage` installiert das aktuellste *mypackage*, *egal* welche Version das ist

Erwarte also lieber nicht, dass Du nächste Woche exakt das gleiche Environment bauen kannst. Und genau das ist der Hebel für einen Angreifer: Nicht die drei Pakete, die Du bewusst hingeschrieben hast, sind das Problem - sondern eines der vielen, die automatisch nachgezogen werden.

Ist Robotmk deshalb unbenutzbar? Nein. Ist das ein Problem von RCC? Erst recht nicht - RCC bringt die Lösung von Haus aus mit, und die meisten Anwender wissen nur nicht, dass sie sie schon haben.

---

## Die Lösung liegt schon in `output/`

Immer wenn Du RCC von der Kommandozeile aufrufst, schreibt es nebenbei eine Datei namens `environment_<os>_<arch>_freeze.yaml` in Dein `output`-Verzeichnis. Die meisten übersehen sie. Sie ist die eigentliche Antwort auf alles oben.

Denn in ihr steht nicht, was Du wolltest, sondern **was Du tatsächlich bekommen hast** - jedes einzelne Paket, auch die, die Du nie hingeschrieben hast, jedes auf eine exakte Version festgenagelt:

> **Beleg · `environment_linux_amd64_freeze.yaml`** (rcc `v17.29.1`)
>
> ```yaml
> channels:
> - conda-forge
> dependencies:
> - _openmp_mutex=4.5
> - bzip2=1.0.8
> - ca-certificates=2026.4.22
> - icu=75.1
> - libgcc=15.2.0
> - libsqlite=3.53.1
> - nodejs=22.11.0
> - openssl=3.6.2
> - pip=23.2.1
> - python=3.12.13
> - setuptools=82.0.1
> - ...
> - pip:
>   - cffi==2.0.0
>   - click==8.3.3
>   - grpcio==1.80.0
>   - grpcio-tools==1.80.0
>   - overrides==7.7.0
>   - protobuf==6.33.6
>   - pycparser==3.0
>   - robotframework==7.4
>   - robotframework-assertion-engine==4.0.0
>   - robotframework-browser==19.14.2
>   - robotframework-crypto==0.3.0
>   - robotframework-pythonlibcore==4.5.0
>   - typing_extensions==4.15.0
>   - wcwidth==0.7.0
>   - wrapt==2.1.2
>   - ...
> rccPostInstall:
> - rfbrowser init
> ```
>
> 28 conda-Pakete, 22 pip-Pakete. Aus drei bewusst gewählten Zeilen sind fünfzig gepinnte Einträge geworden.

Genau die Pakete, die vorher unsichtbar waren - `cffi`, `pycparser`, `wcwidth`, `wrapt`, `overrides` -, stehen jetzt namentlich und mit Version da. **Das schließt exakt das Loch, um das es in diesem Artikel geht.**

### Einbauen

Die Datei gehört eine Ebene höher, neben die `conda.yaml`, und wird in der `robot.yaml` eingetragen:

```yaml
environmentConfigs:
  - environment_windows_amd64_freeze.yaml
  - environment_linux_amd64_freeze.yaml
  - environment_darwin_amd64_freeze.yaml
  - conda.yaml
```

RCC sucht diese Liste von oben nach unten ab; **der erste Treffer gewinnt**. Ab dann baut jeder Host aus der Freeze-Datei statt aus der `conda.yaml` - und bekommt Paket für Paket dasselbe.

### Warum das ohne Prüfsummen reicht

Im Freeze-File steht keine einzige Prüfsumme, und das wirft regelmäßig die Frage auf, ob ein Versions-Pin überhaupt etwas taugt. Er tut es:

- **PyPI ist unveränderlich.** Ein einmal veröffentlichter Dateiname ist verbrannt - auch nach dem Löschen einer Version lässt sich derselbe Name nicht erneut hochladen. Wer `robotframework==7.4` pinnt, bekommt dieselben Bytes wie beim Bau.
- **Conda-Pakete werden ohnehin per SHA-256 verifiziert**, die der Paketmanager aus der Repodata des Kanals zieht.
- **Die Node-Seite kommt gratis mit.** Weil `robotframework-browser==19.14.2` gepinnt ist und das `package-lock.json` *im Wheel* dieser Version liegt, ist der komplette npm-Baum transitiv mitgepinnt.

Ein Versions-Pin ist in der Praxis also nahezu ein Inhalts-Pin. Für den Rest bräuchte es eine kompromittierte Registry - ein anderes Bedrohungsmodell als das hier beschriebene.

---

## Was der Freeze nicht kann

Damit hier niemand mit falschen Erwartungen rausgeht. Vier Punkte, und den ersten musst Du kennen, sonst wiegst Du Dich in falscher Sicherheit.

### 1. Der Post-Install bleibt außen vor ⚠️

Wirf noch einmal einen Blick auf die letzte Zeile des Freeze-Files oben:

```yaml
rccPostInstall:
- rfbrowser init
```

Diese Zeile ist **unverändert aus der `conda.yaml` übernommen**, nicht eingefroren. Der Freeze friert die Paketliste ein - nicht das, was ein Post-Install-Kommando danach aus dem Netz nachlädt.

Konkret heißt das: Der ungeprüfte Chromium-Download aus dem Log oben findet weiterhin statt. Auf jedem Host, bei jedem Bau, ohne Prüfsumme. Das ist die einzige Stelle, an der der Freeze wirklich nichts ausrichtet - und der einzige Grund, weiter unten über ein Artefakt nachzudenken.

Zwei Dinge sind auch ohne größeren Umbau zu haben:

```bash
# Browser-Binaries einmal zentral bereitstellen, Hosts laden nichts nach
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers

# oder: den Download-Weg umlenken statt den CDN direkt zu nutzen
PLAYWRIGHT_DOWNLOAD_HOST=https://<eigener-host>
```

Beide Variablen sind im gebauten Environment verifiziert; es braucht dafür keinen Patch an Robotmk oder der Browser Library. Was sie **nicht** leisten: eine Prüfsummenverifikation. Die gibt es in Playwright schlicht nicht, und ein umgelenkter Download ist ein kontrollierter Weg - keine geprüfte Datei.

### 2. Er gilt pro Plattform - und fällt sonst still zurück

Der Dateiname trägt Betriebssystem und Architektur, und RCC nimmt aus `environmentConfigs` den ersten *existierenden* Eintrag. Liegt für Deine Zielplattform kein Freeze im Repo, rutscht RCC klaglos auf die `conda.yaml` durch - und baut wieder mit losen Versionen. Ohne Fehlermeldung.

Deshalb: je Zielplattform ein Freeze, gebaut auf einem Host dieser Plattform. Sonst greift der Schutz auf der halben Flotte nicht, und niemand merkt es.

### 3. Er landet im `artifactsDir` - also meist im `.gitignore`

RCC schreibt die Datei nach `output/`, und dieses Verzeichnis steht in den meisten Repos auf der Ignore-Liste. Der Freeze wirkt erst, wenn Du ihn aktiv eine Ebene hochziehst und eincheckst. Klingt banal - ist erfahrungsgemäß der häufigste Grund, warum das Konzept in freier Wildbahn nicht greift.

### 4. Er ist eine Momentaufnahme, kein Denkmal

Ein Freeze hält den Zustand vom Bautag fest, und das ist genau sein Zweck: Updates werden vom nächtlichen Zufall zu einer Entscheidung, die Du triffst. Der Preis dafür ist, dass Du sie auch treffen musst - Sicherheitsfixes kommen nicht mehr von selbst herein.

Plane das Erneuern deshalb als bewussten, wiederkehrenden Vorgang ein, so wie Du es bei einem Betriebssystem-Image auch tun würdest. Und lass einen Freeze nicht jahrelang unangetastet stehen: Irgendwann sind einzelne Versionen zurückgezogen oder aus dem Kanal geräumt, und dann baut er gar nicht mehr.

---

## Der eine Blick, der sich lohnt

Bleibt ein Punkt, der aus den vier oben folgt und der wichtiger ist als jedes Werkzeug: **Der Freeze nagelt auch das fest, was am Bautag schon faul war** - und zwar auf allen Hosts, dauerhaft.

Ein Pin macht aus einem zufälligen Risiko eine bewusste Entscheidung. Das ist der ganze Gewinn. Aber eine bewusste Entscheidung sollte man einmal angeschaut haben, bevor man sie trifft. Also: einmal scannen, direkt nach dem Bau, bevor der Freeze ins Repo geht. Kein Cronjob, kein Dauerbetrieb - **einmal**.

```bash
# Pfad des gebauten Environments ermitteln
PREFIX=$(rcc holotree variables --space refbuild --robot robot.yaml --json \
  | python3 -c "import json,sys; print([v['value'] for v in json.load(sys.stdin) \
                if v['key']=='CONDA_PREFIX'][0])")

# Python-Seite - --all ist nicht optional, siehe Falle 1
"$PREFIX/bin/python" -m pip freeze --all > frozen.txt

# Node-Seite - das Lockfile liegt im Wheel der Browser Library
find "$PREFIX" -path "*/Browser/wrapper/package-lock.json" -exec cp {} . \;

# Scannen
osv-scanner scan source --no-resolve -L "requirements.txt:frozen.txt"
osv-scanner scan source --no-resolve -L "package-lock.json:package-lock.json"
```

Auf Windows liegt der Interpreter unter `<prefix>\python.exe` statt `<prefix>/bin/python`. Wichtig: Der Scanner wird **nicht** ins Environment installiert - sonst prüfst Du etwas anderes als das, was in Produktion läuft.

Und eine Faustregel, die nichts kostet: **Nimm keine Direktabhängigkeit, die jünger als zwei Wochen ist.** Kompromittierte Pakete werden meist binnen weniger Tage entdeckt und zurückgezogen. Bei einem Environment, das ohnehin nicht wöchentlich wechselt, tut diese Karenzzeit nicht weh. Ausnahme: Ein Sicherheitsupdate darf sie brechen.

---

## Drei Messfallen

Jetzt kommt der Abschnitt, der mir persönlich der wichtigste ist. Alle drei Fallen sind bei der Untersuchung tatsächlich zugeschnappt, und alle drei führen zu Zahlen, die **falsch sind, ohne falsch auszusehen**.

Getestet gegen rcc `v17.29.1` und osv-scanner `2.5.1`.

### Falle 1 - `pip freeze` unterschlägt drei Pakete

`pip freeze` lässt `pip`, `setuptools` und `wheel` per Default weg. Klingt harmlos. Ist es nicht:

```
$ python -m pip freeze       | wc -l
119
$ python -m pip freeze --all | wc -l
122
$ diff …
> pip==23.2.1
> setuptools==84.0.0
> wheel==0.48.0
```

Ausgerechnet `pip 23.2.1` - die Version, die auch in unserer `conda.yaml` oben steht - trägt allein **13 Advisories**, die andernfalls nie aufgetaucht wären. Drei Zeilen Differenz, ein Drittel aller Funde. `--all` ist keine Option, sondern Pflicht.

<!-- NACHMESSEN: Zahlen stammen aus dem alten Playground-Stand -->

### Falle 2 - osv-scanner erfindet Pakete

Beim Scannen einer Manifest-Datei löst osv-scanner per Default transitive Abhängigkeiten über deps.dev auf. Das klingt hilfreich und ist es hier nicht: Der Scanner meldet dann Pakete und Versionen, **die in Deinem Environment gar nicht existieren**.

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

Die tatsächlich installierten Python-Distributionen kommen darin **nicht vor**. Der Scan findet stattdessen die Dev-Requirements der Browser Library. Er ist also nicht bloß unvollständig - er ist irreführend. Mit `--experimental-plugins=python/wheelegg` liest osv-scanner zwar `dist-info/METADATA`, zieht dann rekursiv aber auch `node_modules` mit und zählt Pakete doppelt.

### Und die vierte, die keine Falle ist, sondern eine Entwarnung

Das `package-lock.json` enthält zwei Sorten von Paketen: die, die im Betrieb installiert werden, und die, die nur zum Entwickeln der Library selbst gebraucht werden. Installiert wird nur die erste Sorte. Der Scanner weiß das nicht und meldet alles:

| Ebene | Gemeldet | Real installiert |
|---|---:|---:|
| Python (`frozen.txt`) | 144 / 6 | 144 / 6 |
| npm (`package-lock.json`) | 90 / 31 | 17 / 5 |

Von 90 gemeldeten npm-Advisories betrafen **73 Pakete, die nie installiert werden.** Faktor 5 an falscher Dringlichkeit. Bevor Du Dir also Sorgen machst: Lies die Funde gegen die tatsächlich installierten Pakete gegen.

<!-- NACHMESSEN: alle Zahlen dieser Tabelle stammen aus dem alten Playground-Stand -->

---

## Wenn es mehr als eine Handvoll Hosts sind

Der Freeze sorgt dafür, dass alle Hosts *dasselbe* bauen. Er sorgt nicht dafür, dass sie *seltener* bauen: Bei fünfzig Hosts sprechen weiterhin fünfzig Rechner mit PyPI, conda-forge und dem Playwright-CDN - und laden dabei jeweils den ungeprüften Chromium-Tarball aus Punkt 1.

Wenn Dich das stört (oder wenn Deine Hosts ohnehin kein Internet sehen dürfen), gibt es den nächsten Schritt fertig in RCC:

```bash
rcc holotree export --robot robot.yaml --zipfile hololib.zip   # auf dem Referenzhost
rcc holotree import hololib.zip                                # auf dem Zielhost
export RCC_NO_BUILD=1
```

Das Interessante daran: `rcc holotree export` schreibt nicht die Paketliste, sondern den vollständigen Zustand **nach** dem Browser-Download - die Binaries eingeschlossen, jede Datei mit SHA-256. Damit findet der ungeprüfte Download genau **einmal** statt, unter Aufsicht, statt N-mal unbeaufsichtigt. `rcc holotree check` prüft die Library später gegen diese Digests.

Den Weg habe ich in [RCC-Environments in isolierten Umgebungen]({{< ref "/rcc-envoffline/" >}}) schon einmal ausführlich beschrieben - dort als Lösung für air-gapped Hosts. Der Mechanismus ist derselbe, der Sicherheitsgewinn ein Nebeneffekt.

Für die meisten Umgebungen ist das aber der zweite Schritt. Der erste ist die Datei in `output/`.

---

## Fazit 🔭

Angefangen hat das mit einer Frage zu einer einzigen Zeile `conda.yaml`. Herausgekommen ist keine Sicherheitslücke und kein Skandal, sondern etwas Nützlicheres: eine klare Vorstellung davon, wo die Lieferkette eines RCC-Environments belastbar ist und wo nicht.

Und eine Erkenntnis, die mich selbst überrascht hat: **Das Werkzeug dagegen liegt bei jedem Kommandozeilenlauf ungenutzt in `output/`.** Kein Artifactory, kein Mirror, kein Build-Team. Eine Datei hochziehen, vier Zeilen `robot.yaml`, einmal hinschauen, bevor Du sie festnagelst.

Der ehrliche Anspruch lautet danach nicht "das Environment ist sicher", sondern:

> *Gebaut aus Paketen mit fester Version, geprüft am TT.MM., unverändert seitdem - bis auf den Browser, den ich bewusst zentral bereitstelle.*

Das ist der Satz, der trägt, wenn jemand nachfragt. Und er ist deutlich mehr wert als ein Häkchen.

Mich interessiert Deine Sicht: **Nutzt Ihr die Freeze-Dateien - oder lagen sie bei Euch bisher auch nur in `output/` herum?** Schreib es in die Kommentare oder schick mir eine Mail.
