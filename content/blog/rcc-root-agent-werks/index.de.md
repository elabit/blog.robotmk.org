---
draft: true
title: "Root, RCC und /opt: Die Geschichte von drei Werks"
# --- Italic subheading
lead: "Erst ein Verbot, dann eine Checkbox, dann die Aufhebung: Warum Checkmk beim Thema Root-Agent + RCC dreimal nachgebessert hat - und warum Du Deine Agenten deshalb nicht umstellen musst."
# -- giscus id to match comments
commentid: rcc-root-agent-werks
# -- predefined URL
# slug:
# -- for posts in menubar, use this (shorter) title
# menutitle:
#description:
date: "2026-09-07T10:00:00+02:00"
categories:
  - background
tags:
  - robotmk
  - rcc
  - checkmk
  - agent
  - linux
  - environments
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
#thumbnail: "img/title.png"
vgwort:
translationKey: "rcc-root-agent-werks"
---

Wer die Checkmk-Werks zum Thema **Synthetic Monitoring** in den letzten Monaten mitgelesen hat, dürfte kurz gestutzt haben. Innerhalb von vier Monaten sind drei Werks erschienen, die sich auf den ersten Blick gegenseitig widersprechen: Erst wird eine Konstellation **verboten**, dann bekommt sie eine **Ausnahme-Checkbox**, und schließlich fällt das Verbot **ganz weg**.

Aus mehreren Gesprächen weiß ich, dass das für Verwirrung gesorgt hat. Besonders hartnäckig hält sich dabei ein Missverständnis: *"Wir müssen jetzt alle Linux-Agenten auf Non-Root umstellen."*

Das musst Du nicht. Warum nicht - und was hinter der Zickzack-Linie steckt - schauen wir uns hier an.

<!--more-->

---

## Akt 1: Ein Berechtigungsschaden unter /opt

*(Werk [#19460](https://checkmk.com/werk/19460), 3. Mai 2026, Bug Fix, inkompatibel)*

Am Anfang stand ein sehr konkretes, sehr unangenehmes Problem - und das hatte nichts mit Robotmk selbst zu tun, sondern mit **RCC**, dem Werkzeug, das die Python-Umgebungen für Deine Robot-Framework-Tests baut.

RCC legt seine Umgebungen, Caches und Holotree-Daten in einem eigenen Basisverzeichnis ab.

> **Info:** RCC bestimmt sein Basisverzeichnis (`ROBOCORP_HOME`) abhängig vom ausführenden Benutzer. Für normale Benutzer landet es unterhalb des Home-Verzeichnisses. Läuft RCC dagegen **als root**, ist der Default unter Linux `/opt/robocorp`.

Und genau hier lag der Hund begraben: Wenn dieses Verzeichnis noch **nicht existierte** und RCC es als root anlegte, konnte es dabei die Rechte des *Elternverzeichnisses* `/opt` mit anfassen - von `555` auf `750`.

Das klingt nach einer Kleinigkeit. Ist es nicht.

`/opt` ist auf vielen Systemen ein Sammelplatz. Auf einem Checkmk-Server liegt dort unter `/opt/omd` die komplette Site-Struktur. Ein `750` auf `/opt` bedeutet: Alles, was nicht root ist, kommt nicht mehr durch - der Site-User erreicht seine eigene Site nicht mehr. Aufgefallen ist das zuerst auf **SLES 16**, betroffen sein kann aber jedes System, auf dem noch etwas anderes unter `/opt` wohnt.

Die Reaktion im Mai war die naheliegende: Wenn eine Kombination Schaden anrichten kann, lässt man sie gar nicht erst zu. Seit Werk 19460 bricht das **Agentenbacken** mit einer Fehlermeldung ab, sobald ein Linux-Agentenpaket für Root-Deployment mit RCC-basierten Plänen kombiniert wird. Als Migrationsweg nannte das Werk zwei Optionen: den Host auf **Non-Root-Deployment** umstellen (Regel *"Customize agent package (Linux)"*) oder RCC durch **Conda-Umgebungen** ersetzen.

Nachvollziehbar - aber eben auch: ein ziemlich breites Netz für einen recht schmalen Fisch. 🐟

---

## Akt 2: Die Notausfahrt

*(Werk [#20186](https://checkmk.com/werk/20186), 11. August 2026, ab 2.5.0p12)*

Ein Verbot ist schnell geschrieben. In der Praxis stellte sich dann heraus, was sich in solchen Fällen fast immer herausstellt: Es gibt gute Gründe, warum Setups so sind, wie sie sind.

Kunden hatten eigene Plugins, Automatisierungen und Testskripte, die **fest verdrahtete Pfade** verwenden oder aus anderen Gründen einen Root-Kontext brauchen. Für die war "stell einfach auf Non-Root um" kein Nachmittagsprojekt, sondern eine Umbauaktion mit unklarem Ende.

Deshalb kam im August eine Option **"Allow agent deployment as root"** in die Regel *"Robotmk Scheduler (Linux)"*, direkt bei den RCC-Einstellungen. Standardmäßig ausgeschaltet. Wer sie aktiviert, bestätigt damit implizit: *Ich habe Werk 19460 gelesen und weiß, worauf ich mich einlasse.*

Das war ehrlicher als das pauschale Verbot. Ganz rund war es trotzdem nicht - eine Checkbox, deren einzige Aufgabe darin besteht, eine andere Einschränkung wieder auszuhebeln, ist selten ein gutes Zeichen für das Design darunter.

---

## Akt 3: Aufklärung statt Verbot

*(Werk [#20190](https://checkmk.com/werk/20190), 2. September 2026, derzeit 3.0.0b1)*

Der dritte Schritt ist der interessanteste, weil er die Perspektive dreht.

Sowohl die ursprüngliche Restriktion **als auch** die Bypass-Checkbox sind verschwunden. Das Backen eines Linux-Agenten gelingt jetzt immer - unabhängig davon, in welchem Benutzerkontext der Agent läuft und ob RCC im Spiel ist. An die Stelle der Blockade tritt **Inline-Hilfe**: überall dort, wo RCC als *Environment Creation Mode* ausgewählt werden kann, steht der Hinweis direkt daneben.

Der Kern der Sache, im Originalton des Werks:

> *"...so you can make an informed choice instead of being blocked or having to opt out via a checkbox."*

Das ist mehr als Kosmetik. Das eigentliche Problem war nie "root plus RCC" als solches, sondern ein sehr spezifischer Nebeneffekt beim **erstmaligen Anlegen** eines Verzeichnisses unterhalb von `/opt`. Ein Verbot, das die gesamte Kombination trifft, adressiert einen Bruchteil der Fälle und blockiert den Rest ohne Not.

---

## Was heißt das jetzt für Dich?

Die wichtigste Botschaft zuerst, weil sie in der Werk-Chronologie leicht untergeht:

**Niemand zwingt Dich auf den Non-Root-Agenten.**

Der Non-Root-Agent ist eine gute Sache und aus Sicherheitssicht in vielen Umgebungen der bessere Weg. Aber er ist keine Voraussetzung dafür, Robotmk mit RCC unter Linux zu betreiben. Je nach Version stellt sich die Lage so dar:

- **2.4.0p33 / 2.5.0p6 bis p11:** Das Backen bricht bei Root + RCC ab. Hier hilft entweder das Update auf p12 oder einer der beiden im Werk genannten Wege (Non-Root bzw. Conda).
- **Ab 2.5.0p12:** Die Option *"Allow agent deployment as root"* in der Regel *"Robotmk Scheduler (Linux)"* hebt die Einschränkung auf. Ein Häkchen, fertig.
- **Ab 3.0:** Es gibt nichts mehr aufzuheben. Du triffst die Entscheidung, die Inline-Hilfe liefert den Kontext dazu.

### Der Fünf-Sekunden-Check

Unabhängig von der Version lohnt sich auf jedem Host, der Root-Agent und RCC kombiniert, ein kurzer Blick:

```bash
# Rechte von /opt prüfen - Soll: 555 (oder 755)
stat -c "%a %U:%G" /opt

# Falls hier 750 steht: reparieren
chmod 555 /opt
```

Und wenn Du auf Nummer sicher gehen willst, nimmst Du RCC die Gelegenheit einfach vorweg. Existiert das Verzeichnis bereits mit sauberen Rechten, gibt es für RCC nichts mehr anzulegen - und damit auch nichts zu verstellen:

```bash
install -d -m 755 -o root -g root /opt/robocorp
```

Das ist kein offizieller Migrationsweg aus dem Werk, sondern schlicht das, was ich im Rahmen des Deployments ohnehin mit ausrolle. Es kostet eine Zeile und nimmt der ganzen Diskussion die Spitze.

---

## Meine Einordnung

Drei Werks für ein Thema wirken auf den ersten Blick nach Unentschlossenheit. Ich lese es anders.

Der erste Reflex - **blockieren** - ist bei einem Bug, der ein Produktivsystem lahmlegen kann, absolut richtig. Lieber eine Fehlermeldung beim Backen als ein unerreichbares `/opt/omd` um drei Uhr nachts. Dass die Blockade dann zu grob geraten war, zeigt sich in aller Regel erst im Feld. Und dass sie nach vier Monaten durch etwas Präziseres ersetzt wurde, spricht eher für den Prozess als gegen ihn.

Was mir am Endergebnis gefällt: Es traut dem Administrator etwas zu. Eine gut platzierte Inline-Hilfe an genau der Stelle, an der die Entscheidung tatsächlich fällt, wirkt in meiner Erfahrung nachhaltiger als eine Sperre, die man mit einem Häkchen wegklickt, ohne den Grund je gelesen zu haben.

Offen bleibt für mich die Frage nach dem Default. `ROBOCORP_HOME` unterhalb von `/opt` ist für einen als root laufenden Prozess eine Konvention aus einer Zeit, in der RCC vor allem auf Entwicklerlaptops zu Hause war. Ob das für einen Monitoring-Agenten auf einem Server die glücklichste Wahl ist, darüber ließe sich reden.

Wie handhabt Ihr das? Lauft Ihr auf Euren überwachten Linux-Hosts weiterhin mit Root-Agent, oder habt Ihr die Gelegenheit genutzt und auf Non-Root umgestellt? Ich bin gespannt auf Eure Erfahrungen in den Kommentaren.
