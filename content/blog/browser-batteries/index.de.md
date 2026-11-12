---
draft: true
title: "Browser Batteries: NodeJS im Gepäck"
# --- Italic subheading
lead: "Das Batteries-included-Paket der Browser Library unter der Lupe"
# -- giscus id to match comments
commentid: browser-batteries
# -- predefined URL
# slug:
# -- for posts in menubar, use this (shorter) title
# menutitle:
#description:
date: "2026-11-12T09:00:00+01:00"
categories:
  - background
tags:
  - robotmk
  - robot-framework
  - rcc
  - browser-library
  - environments
  - nodejs
  - installation
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
thumbnail: "img/title.png"
# vgwort:
translationKey: "browser-batteries"
---

Bei der Recherche zu [RCC-Environments und die Supply Chain]({{< ref "/rcc-env-supplychain/" >}}) bin ich unter anderem am **robotframework-browser-batteries** Paket hängengeblieben.

Bisher flog das für mich unterm Radar: wozu soll ich NodeJS über ein Python-Package installieren, wenn ich es dank RCC sowieso im Environment installieren kann.  

Wenn Du die gleiche Frage im Kopf hast, oder "Batteries" noch nie gehört hast, lies weiter.  

In diesem Artikel hab ich zusammengetragen, was das Batteries-Paket ist, und wann Du es einsetzen solltest.

<!--more-->

## Hintergrund: Warum überhaupt NodeJS?

Anders als die vielen anderen Libraries für Robot Framework ist die [Browser Library](https://robotframework-browser.org) kein reines Python-Paket.

Die Keywords der Library (z. B. `Fill Text` oder `Click`) sind in Python geschrieben; die eigentliche Steuerung des Browsers aber übernimmt [Playwright](https://playwright.dev) — eine NodeJS-Bibliothek.  

Zwischen beiden Welten läuft ein NodeJS-Prozess, den die Library über **gRPC** anspricht:

    Robot Framework → BrowserLibrary (Python) → gRPC → NodeJS + Playwright → Browser

Das hat Folgen für die Umgebung: um die BrowserLibrary zu verwenden, benötigst Du eine NodeJS-Runtime und die dazugehörigen Pakete.  
Zusammen mit den Browser-Binaries kommen dabei leicht über 700 MB zusammen.

> **Info:** gRPC (=Google Remote Procedure Call) ist ein Protokoll für Aufrufe zwischen Prozessen. Für Dich als Anwender bleibt das im Hintergrund. Mit diesem Kanal wird quasi ein `Click` auf der Python-Seite zu einem Playwright-Aufruf auf der NodeJS-Seite "übersetzt".

Auf einem Test-Host müssen also zwei Dinge liegen: 

1. eine NodeJS-Runtime
2. die NodeJS-Pakete von Playwright. 

Bisher haben wir über die `conda.yaml`-Datei beides dediziert bereitgestellt. Das zeigt das nachfolgende Beispiel:


```yaml
dependencies:
  - python=3.12
  - pip=23.2.1
  - nodejs>=26.13
  - pip:
      - robotframework>=7.5
      - robotframework-browser>=21.0
rccPostInstall:
  - rfbrowser init chromium
```

## Die neue Variante: Browser Batteries

Für jede Major-Version der Browser Library gibt es seit Version 19.9 ein passendes "Wheel"-Paket, das die NodeJS-Runtime und die Playwright-Pakete mitbringt.

> Info: Ein "Wheel" ist ein Python-Paketformat, das die Installation von Paketen vereinfacht. Es enthält bereits kompilierte Dateien und Abhängigkeiten, sodass keine zusätzlichen Installationsschritte erforderlich sind.

```yaml
dependencies:
  - python=3.12
  - pip=23.2.1
  - pip:
      - robotframework>=7.5  
      - robotframework-browser[bb]>=21.0
rccPostInstall:
  - rfbrowser install chromium
```

Drei Dinge haben sich gegenüber der bisherigen Variante geändert:

- `robotframework-browser[bb]`: Das Extra `[bb]` installiert den Python-Teil wie gehabt, zieht aber das passende Batteries-Wheel mit.
- `rfbrowser install`: Der "PostInstall"-Befehl heißt jetzt nicht mehr `init`, sondern `install`. Hintergrund: `init` installierte die NodeJS-Abhängigkeiten *und* Browser-Binaries, `install` muss nur die Browser herunterladen, da die NodeJS-Seite ja schon vorliegt.
- `nodejs=`: Das **muss raus**. Lässt Du es stehen, liegen zwei NodeJS-Runtimes im Environment, die sich gegenseitig in die Quere kommen. Batteries bringt die passende Version mit.

## Der Vergleich 

Ich habe beide Varianten hinsichtlich der Installation und des Platzverbrauchs verglichen.

### Platzverbrauch


|                    | conda-forge `nodejs` + `rfbrowser init` | `[bb]`-Wheel                |
| ------------------ | --------------------------------------- | --------------------------- |
| NodeJS-Runtime     | 99,9 MB                                 | 95,5 MB                     |
| npm + corepack     | 12,0 MB (1.926 Dateien)                 | nicht enthalten             |
| `node_modules`     | ~33,9 MB (~2.844 Dateien)               | 33,9 MB (2.844 Dateien)     |
| **auf der Platte** | **~146 MB, ~4.780 Dateien**             | **130,7 MB, 2.853 Dateien** |
| Download           | 34,5 MB + ~85 npm-Tarballs              | 45,4 MB, ein Wheel          |

Die Ersparnis ist genau der npm-Fußabdruck: **gerade mal 15 MB.**  
➡️ Platz ist kein Argument, in keiner Richtung.

### Installation

In der letzten Tabellenzeile versteckt sich der eigentliche Gewinn, der gleich mehrere Vorteile bringt: 

#### Weniger Dateien, weniger Downloads

- Ohne Batteries lädt der Host ein conda-Paket **und** rund 85 Pakete aus der npm-Registry.  
- Mit Batteries lädt er eine (1) Datei.

Das ist nicht nur schneller, sondern auch ein Ziel im Internet weniger, das u.U. freigeschaltet werden muss. 

#### Proxy-Settings und TLS-Inspektion

Ich habe ja bereits im Artikel [Proxy-Settings verstehen und anwenden]({{< ref "/proxies-test/" >}}) beschrieben, wie viel Spaß man mit Proxies haben kann... 

`npm` ist da nochmal eine eigene Disziplin: `.npmrc`, `strict-ssl`, `cafile`, `NODE_EXTRA_CA_CERTS` - und teilt davon nichts mit pip oder conda. 

Im Batteries-Wheel dagegen liegt `npm` gar nicht mehr mit drin, weil es schlicht nicht gebraucht wird: der Browser-Download läuft über den mitgelieferten Node, nicht über `npx`.

#### Garantierte NodeJS-Version

Schon öfter wurde ich von Kunden gefragt, welche NodeJS-Version denn nun die richtige sei.  
Ich sage dann ganz offen: "Ich weiß es nicht", weil ich glaube, dass es keine Rolle spielt.  

Trotzdem hast Du mi "Batteries" die Gewissheit, dass die richtige NodeJS-Version verwendet wird. Damit fällt eine ganze Fehler-Kategorie weg: ggf. seltsames gRPC-Verhalten nach einem NodeJS-Upgrade.


## Daran solltest Du denken

Nichts davon ist geschenkt, drei Punkte solltest Du vorher prüfen:

- **Alte Plattformen fallen heraus:** Die Wheels sind gebaut für **glibc 2.28** (zu finden auf Debian 10, RHEL 8, Ubuntu 20.04), Windows 10 / Server 2016 und macOS 13.5. Darunter bekommst Du das Paket nicht zum laufen.
- **Versions-Gleichschritt:** Das Batteries-Paket koppelt `robotframework-browser` in *exakt* einer Version an eine NodeJS-Version. Eines allein hochzuziehen, geht nicht. (Braucht man aber auch nicht wirklch - ich will es nur erwähnt haben.)
- **Die Verantwortung verschiebt sich von conda-forge zu PyPI** bzw. dem Package-Maintainer der Browser-Library.


## Was das für die Supply Chain bedeutet

Die folgenden Punkte sind nur relevant, wenn Du den Artikel [RCC-Environments und die Supply Chain]({{< ref "/rcc-env-supplychain/" >}}) für Dich von Bedeutung hältst.

**Vorher:** Über die Datei `package-lock.json` mit exakten Versionen und Prüfsummen konnte die Lieferkette jederzeit aufs Paket genau geprüft werden. 

**Mit Batteries** verschiebt sich die Lage: 

- **Positiv** daran: Die NodeJS-Seite wird ein einziges pip-versioniertes Paket und landet damit im **Freeze-File** und in der [Karenzzeitprüfung]({{< ref "/rcc-env-supplychain/" >}}) - wo der npm-Baum vorher nie auftauchte. 
- **Zu beachten:** Statt 84 Prüfsummen, die npm einzeln gegen das Lockfile prüft, prüfst Du nur noch einen einzigen Wheel-Hash gegen PyPI. (Die Nachweisbarkeit bleibt allerdings erhalten, denn das Lockfile reist ja im Wheel mit.)

An den **Browser-Binaries** ändert Batteries nichts - die kommen weiterhin ohne Prüfsummenvergleich von einem CDN.

## Fazit

Wir können also festhalten: Browser Batteries ist keine Platzoptimierung, sondern eher eine **Installationsoptimierung**: Es entfernt npm als dritten Paketmanager aus der Kette und damit den fragilsten Schritt beim Bau eines RCC-Environments.

Auf einem Entwicklungsrechner mit offenem Internetzugang wirst Du außer einer kürzeren Bauzeit kaum etwas merken. 

In einem Unternehmensnetz mit Proxy, TLS-Inspektion und Virenscanner sieht das sicher wieder anders aus.

Wenn Du dazu Erfahrung oder eine Meinung hast, freue ich mich über einen Kommentar unter dem Artikel.