---
draft: true
title: "RCC-Environment - sicher bauen"
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
Die gute Nachricht: Das Gegenmittel ist eine einzige Datei, und RCC schreibt sie Dir längst - Du musst sie nur benutzen.

<!--more-->

## Ein kurzes Vorwort zu RCC

**RCC** wurde ursprünglich von **Robocorp** entwickelt.  
Robocorp war ein Startup, das Robot Framework in die Cloud bringen wollte.

RCC sollte für die Automatisierungen einen stabilen und idempotenten Unterbau garantieren - auf Kundenseite (während der Entwicklung) und in der Cloud (bei der Ausführung).

Nach der Übernahme durch **Sema4.ai** im Jahr 2024 wurde das Werkzeug neu lizenziert und ist heute proprietär; die Weiterentwicklung der offenen Version wurde eingestellt.

Checkmk pflegt seitdem einen **eigenen Fork** auf Basis der letzten quelloffenen Fassung, der fester Bestandteil von Robotmk/Synthetic Monitoring ist.

(RCC kann auch ohne Robotmk genutzt werden, z.B. für die lokale Entwicklung von Robot Framework Automatisierungen. In diesem Artikel geht es aber um die Nutzung in Verbindung mit Robotmk.)

RCC kann unter diesem Link heruntergeladen werden: [Robotmk Releases](https://github.com/elabit/robotmk/releases)

---

## Das Problem kompakt erklärt

Die Pakete, die RCC für Robot Framework installiert, kommen von öffentlichen Plattformen wie PyPI und npm - dort darf grundsätzlich jeder etwas veröffentlichen.

Und genau da liegt das Problem: Wenn jemand eines solcher Pakete missbraucht, indem er eine manipulierte Version nachschiebt, holt sich Dein Robotmk-Host diese Version beim nächsten Bau von ganz allein.

**Auf einem Server, der in Deinem Netz steht und Zugangsdaten für die Anwendungen kennt, die er testet.**

> Der Fachbegriff hierfür ist "**Supply-Chain-Angriff**" - nicht der **Angreifer** greift Dich an, sondern etwas, das Du benutzt und dem Du vertraust.  
> Die bekannten Fälle der letzten Jahre liefen fast alle so ab.

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

- **Python, Pip und Nodejs** werden von [conda-forge](https://conda-forge.org) geladen, einem Community-getriebenen Repository.
- Pip (Pythons interner Paketmanager) installiert die drei Pakete unterhalb des `pip:`-Schlüssels von [PyPI](https://pypi.org).
- Im Falle der **Browser Library** kommt noch die letzte Zeile hinzu: `rfbrowser init` startet ein Python-Programm, mit dem das auf NodeJS basierende Playwright initialisiert wird. *Darauf gehen wir jetzt genauer ein.*

---

## Wo die Kette hält - und wo nicht

Ich habe mir angesehen, was beim Bau dieses Environments tatsächlich passiert.

Die gute Nachricht zuerst: **Auf der Node-Seite (`rfbrowser init`) ist alles im grünen Bereich.**

Dieser Befehl installiert u.a. **Playwright**, und das kommt mit einer Datei namens [`package-lock.json`](https://github.com/microsoft/playwright/blob/main/package-lock.json), in der jedes Paket mit exakter Version und Prüfsumme steht.  
Und genau mit dieser Version werden sämtliche Pakete installiert - da kann nichts unbemerkt hineinrutschen.

Zwei andere Stellen sind aber offen:

❌ **Erstens: der nachgeladene Browser.** `rfbrowser init` holt am Ende Chromium von einem Download-Server. Eine Prüfsumme wird dabei nirgends verglichen.

❌ **Zweitens: schwaches Versions-Pinning in Python.** Die `conda.yaml` gibt zwar nur drei Python-Pakete mit fester Version an:

```
  - pip:
      - robotframework==7.4
      - robotframework-browser==19.14.2
      - robotframework-crypto==0.3
```

Aber im fertigen Environment liegen deutlich mehr.

Wie kann das sein?

Ganz einfach: **faule Entwickler sind gute Entwickler**, denn sie nutzen bestehenden Python-Code in ihrem Projekt, statt ihn selbst zu schreiben.

Allerdings bleiben solche Abhängigkeiten für Dich in `conda.yaml` unsichtbar.  
Sie stecken in den Paketen selbst - oft sehr vage bis gar nicht festgelegt. Die Abhängigkeit von einem Paket `mypackage` kann also z.B. als `mypackage>=2.1` oder - noch schlimmer - einfach als `mypackage` angegeben sein.

=> Erwarte also lieber nicht, dass Du nächste Woche exakt das gleiche Environment bauen kannst.

**Und genau das ist der Hebel für einen Angreifer:**

- Nicht die drei Pakete, die Du in `conda.yaml` bewusst hingeschrieben hast, sind das Problem.
- Sondern eines der vielen, die automatisch nachinstalliert werden, um die Sub-Dependencies zu erfüllen.

Du fragst Dich vielleicht: *Ist Robotmk deshalb unbenutzbar?* **Nein.**

Oder: *Ist das ein Problem von RCC?* **Nein**, im Gegenteil - RCC bringt die Lösung von Haus aus mit, und die meisten Anwender wissen nur nicht, dass sie sie schon haben.

---

## Die Lösung liegt schon in `output/`

Wechsle in Dein Robot-Verzeichnis und baue das Environment:

```bash
rcc task script --space refbuild-web --robot robot.yaml -- python --version
```

Was macht dieser Befehl?

- `rcc task script`: Startet den Befehl hinter dem doppelten Bindestrich im Environment
- `--space refbuild-web` (optional): Weist RCC an, nicht das Environment im Default-Namespace zu überschreiben
- `--robot robot.yaml`: Gibt den Pfad zur RCC-Konfigurationsdatei an (die auf `conda.yaml` verweist)
- `python --version`: Ein beliebiger Befehl, der im gebauten Environment ausgeführt wird. Ich habe ihn gewählt, weil er schnell ist und keine weiteren Abhängigkeiten hat.

Das baut das Environment inklusive Post-Install. Und nebenbei entsteht eine Datei, die die meisten übersehen: `output/environment_<os>_<arch>_freeze.yaml`. Die Platzhalter `<os>` und `<arch>` stehen für die Plattform, auf der Du gerade baust.

Diese Datei ist die eigentliche Antwort auf alles oben. Denn in ihr steht nicht, was Du wolltest, sondern **was Du tatsächlich bekommen hast** - alle (!) transitiven Abhängigkeiten, jede auf eine exakte Version festgenagelt:

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

Schiebe die Datei eine Ebene nach oben ins Robot-Verzeichnis (neben die `conda.yaml`). Öffne dann die `robot.yaml` und trage die Freeze-Datei unter `environmentConfigs` **vor** der `conda.yaml` ein:

```yaml
environmentConfigs:
  - environment_windows_amd64_freeze.yaml
  - environment_linux_amd64_freeze.yaml
  - environment_darwin_amd64_freeze.yaml
  - conda.yaml
```

Beim nächsten Bau verwendet RCC die erste Datei dieser Liste, die vorhanden ist **und auf die Plattform passt**. Ab dann baut jeder Host aus der Freeze-Datei statt aus der `conda.yaml` - und bekommt Paket für Paket dasselbe.

Diesen Vorgang wiederholst Du für jede Plattform, die Du unterstützen willst.

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

Konkret heißt das: Der ungeprüfte Chromium-Download von oben findet weiterhin statt. Auf jedem Host, bei jedem Bau, ohne Prüfsumme. Das ist die einzige Stelle, an der der Freeze wirklich nichts ausrichtet - und der einzige Grund, weiter unten über ein Artefakt nachzudenken.

Zwei Dinge sind auch ohne größeren Umbau zu haben:

```bash
# Browser-Binaries einmal zentral bereitstellen, Hosts laden nichts nach
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers

# oder: den Download-Weg umlenken statt den CDN direkt zu nutzen
PLAYWRIGHT_DOWNLOAD_HOST=https://<eigener-host>
```

Beide Variablen sind im gebauten Environment verifiziert; es braucht dafür keinen Patch an Robotmk oder der Browser Library. Was sie **nicht** leisten: eine Prüfsummenverifikation. Die gibt es in Playwright schlicht nicht, und ein umgelenkter Download ist ein kontrollierter Weg - keine geprüfte Datei.

### 2. Er gilt pro Plattform - und fällt sonst still zurück

Der Dateiname trägt Betriebssystem und Architektur. Liegt für Deine Zielplattform kein passender Freeze im Repo, rutscht RCC klaglos auf die `conda.yaml` durch - und baut wieder mit losen Versionen. Ohne Fehlermeldung.

Deshalb: je Zielplattform ein Freeze, gebaut auf einem Host dieser Plattform. Sonst greift der Schutz auf der halben Flotte nicht, und niemand merkt es.

### 3. Er landet im `artifactsDir` - also meist im `.gitignore`

RCC schreibt die Datei nach `output/`, und dieses Verzeichnis steht in den meisten Repos auf der Ignore-Liste. Der Freeze wirkt erst, wenn Du ihn aktiv eine Ebene hochziehst und eincheckst. Klingt banal - ist erfahrungsgemäß der häufigste Grund, warum das Konzept in freier Wildbahn nicht greift.

### 4. Er ist eine Momentaufnahme, kein Denkmal

Ein Freeze hält den Zustand vom Bautag fest, und das ist genau sein Zweck: Updates werden vom nächtlichen Zufall zu einer Entscheidung, die Du triffst. Der Preis dafür ist, dass Du sie auch treffen musst - Sicherheitsfixes kommen nicht mehr von selbst herein.

Plane das Erneuern deshalb als bewussten, wiederkehrenden Vorgang ein, so wie Du es bei einem Betriebssystem-Image auch tun würdest. Und lass einen Freeze nicht jahrelang unangetastet stehen: Irgendwann sind einzelne Versionen zurückgezogen oder aus dem Kanal geräumt, und dann baut er gar nicht mehr.

---

## Der eine Blick, der sich lohnt

Bleibt ein Punkt, der aus den vier oben folgt und der wichtiger ist als jedes Werkzeug: **Der Freeze nagelt auch das fest, was am Bautag schon faul war** - und zwar auf allen Hosts, dauerhaft.

Ein Pin macht aus einem zufälligen Risiko eine bewusste Entscheidung. Das ist der ganze Gewinn. Aber eine bewusste Entscheidung sollte man einmal angeschaut haben, bevor man sie trifft. Also: einmal prüfen, direkt nach dem Bau, bevor der Freeze ins Repo geht. Kein Cronjob, kein Dauerbetrieb - **einmal**.

### Prüfgrundlage exportieren

```bash
# Python-Stack auflisten - --all ist nicht optional, siehe Falle 1
rcc task script --space refbuild-web -- pip freeze --all > frozen.txt

# Lockfile der Browser Library ins Robot-Verzeichnis kopieren
rcc task script --space refbuild-web -- sh -c 'find "$CONDA_PREFIX" -path "*/Browser/wrapper/package-lock.json" -exec cp {} . \;'
```

### Karenzzeit prüfen

Die Regel: **Lade keine Abhängigkeiten, die jünger als 14 Tage sind.** Kompromittierte Pakete werden meist binnen weniger Tage entdeckt und zurückgezogen - statistisch deckt das schon den Großteil der realen Angriffsfenster ab.

Für die Prüfung habe ich ein kleines Script geschrieben: [`pypi_grace_check.py`](https://gist.github.com/simonmeggle/32d62e5ffd1a829507c02ea8842624db). Es liest per Default `frozen.txt` und prüft auf ein Mindestalter von 14 Tagen:

```bash
rcc task script --space refbuild-web -- python3 pypi_grace_check.py
...
  363 d  ok  cffi 2.0.0
  161 d  ok  grpcio 1.80.0
 1143 d  ok  pip 23.2.1
  172 d  ok  protobuf 6.33.6
  153 d  ok  robotframework-browser 19.14.2
  228 d  ok  wheel 0.46.3
  ...
```

Ausnahme: Ein Sicherheitsupdate darf die Karenzzeit brechen - sonst zwingt Dich Deine eigene Regel, ein bekanntes Loch zwei Wochen offen zu lassen.

### Auf Schwachstellen prüfen

Lade den **OSV-Scanner** von Google herunter ([Releases](https://github.com/google/osv-scanner/releases), Installation per brew, winget etc. [hier](https://google.github.io/osv-scanner/installation/)):

```bash
osv-scanner scan source --no-resolve -L "requirements.txt:frozen.txt"
osv-scanner scan source --no-resolve -L "package-lock.json:package-lock.json"
```

Beide Flags und beide Dateien sind bewusst gewählt - warum, steht gleich unter [Drei Messfallen](#drei-messfallen). Wichtig: Der Scanner wird **nicht** ins Environment installiert - sonst prüfst Du etwas anderes als das, was in Produktion läuft.

---

## Drei Messfallen

Jetzt kommt der Abschnitt, der mir persönlich der wichtigste ist. Alle drei Fallen sind bei der Untersuchung tatsächlich zugeschnappt, und alle drei führen zu Zahlen, die **falsch sind, ohne falsch auszusehen**.

Getestet gegen rcc `v17.29.1` und osv-scanner `2.5.1`.

### Falle 1 - `pip freeze` unterschlägt drei Pakete

`pip freeze` lässt `pip`, `setuptools` und `wheel` per Default weg. Klingt harmlos. Ist es nicht:

```
$ pip freeze       | wc -l
22
$ pip freeze --all | wc -l
25
$ diff …
> pip==23.2.1
> setuptools==80.10.2
> wheel==0.46.3
```

Ausgerechnet `pip 23.2.1` - die Version, die auch in unserer `conda.yaml` oben steht - trägt allein **13 Advisories**, die andernfalls nie aufgetaucht wären. Drei Zeilen Differenz, ein Drittel aller Funde. `--all` ist keine Option, sondern Pflicht.

<!-- NACHMESSEN: Zeilenzahlen/Versionen aus der pypi_grace_check-Ausgabe abgeleitet (25 inkl. pip/setuptools/wheel).
     "13 Advisories" und "ein Drittel aller Funde" stammen noch aus dem alten Playground-Stand. -->

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

<!-- NACHMESSEN: Phantomfund stammt aus dem alten Playground-Stand (setuptools 84.0.0, pdfminer-six ist im Beispiel-Env nicht enthalten) -->

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

Der Freeze sorgt dafür, dass alle Hosts *dasselbe* bauen. Er sorgt nicht dafür, dass sie *seltener* bauen: Bei fünfzig Hosts sprechen weiterhin fünfzig Rechner mit PyPI, conda-forge und dem Playwright-CDN - und laden dabei jeweils den ungeprüften Chromium-Download aus Punkt 1.

Wenn Dich das stört (oder wenn Deine Hosts ohnehin kein Internet sehen dürfen), gibt es den nächsten Schritt fertig in RCC:

```bash
rcc holotree export --robot robot.yaml --zipfile hololib.zip   # auf dem Referenzhost
rcc holotree import hololib.zip                                # auf dem Zielhost
export RCC_NO_BUILD=1
```

Das Interessante daran: `rcc holotree export` schreibt nicht einfach nur den "Einkaufszettel", sondern packt den komplett beladenen Einkaufswagen zusammen - die Browser-Binaries eingeschlossen, jede Datei mit SHA-256. Damit findet der ungeprüfte Download genau **einmal** statt, unter Aufsicht, statt N-mal unbeaufsichtigt. `rcc holotree check` prüft die Library später gegen diese Digests.

Wie man Environments aus einem ZIP-File lädt, habe ich in [RCC-Environments in isolierten Umgebungen]({{< ref "/rcc-envoffline/" >}}) schon einmal ausführlich beschrieben - dort als Lösung für air-gapped Hosts. Der Mechanismus ist derselbe, der Sicherheitsgewinn ein Nebeneffekt.

Für die meisten Umgebungen ist das aber der zweite Schritt. Der erste ist die Datei in `output/`.

---

## Fazit 🔭

Angefangen hat das mit einer Frage zu einer einzigen Zeile `conda.yaml`. Herausgekommen ist keine Sicherheitslücke und kein Skandal, sondern etwas Nützlicheres: eine klare Vorstellung davon, wo die Lieferkette eines RCC-Environments belastbar ist und wo nicht.

Und eine Erkenntnis, die mich selbst überrascht hat: **Das Werkzeug dagegen liegt bei jedem Kommandozeilenlauf ungenutzt in `output/`.** Kein Artifactory, kein Mirror, kein Build-Team. Eine Datei hochziehen, vier Zeilen `robot.yaml`, einmal hinschauen, bevor Du sie festnagelst.

Der ehrliche Anspruch lautet danach nicht "das Environment ist sicher", sondern:

> *Gebaut aus Paketen mit fester Version und mindestens 14 Tagen Karenz, geprüft am TT.MM., unverändert seitdem - bis auf den Browser, den ich bewusst zentral bereitstelle.*

Das ist der Satz, der trägt, wenn jemand nachfragt. Und er ist deutlich mehr wert als ein Häkchen.

Mich interessiert Deine Sicht: **Nutzt Ihr die Freeze-Dateien - oder lagen sie bei Euch bisher auch nur in `output/` herum?** Schreib es in die Kommentare oder schick mir eine Mail.
