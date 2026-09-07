---
draft: true
title: "RCC im Root-Agent - die Details"
# --- Italic subheading
lead: "Auf was Du achten musst, wenn Du den RCC-Umgebungsbau im Root-Agenten einsetzt."
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

Wer die Checkmk-Werks zum Thema **Synthetic Monitoring** in den letzten Monaten mitgelesen hat, dürfte kurz gestutzt haben.  
Innerhalb von vier Monaten sind drei Werks erschienen, die sich auf den ersten Blick gegenseitig widersprechen.

Musst Du Deine Linux-Agenten nun auf Non-Root umstellen? Der Artikel erklärt die Hintergründe, die Werk-Chronologie und die aktuelle Lage.

<!--more-->

---

## Akt 1: Berechtigungen unter /opt

*(Werk [#19460](https://checkmk.com/werk/19460), 3. Mai 2026, Bug Fix, inkompatibel)*

Am Anfang stand ein sehr konkretes, sehr unangenehmes Problem - und das hatte nichts mit Robotmk selbst zu tun, sondern mit **RCC**, dem Werkzeug, das die Python-Umgebungen für Deine Robot-Framework-Tests baut.

RCC legt seine Umgebungen, Caches und sonstige Daten in einem eigenen **Basisverzeichnis** ab.

> **Info:** RCC bestimmt sein Basisverzeichnis (`ROBOCORP_HOME`) abhängig vom ausführenden Benutzer. Für normale Benutzer liegt das immer im Home-Verzeichnis.  
> Läuft RCC dagegen **als root**, ist der Default unter Linux `/opt/robocorp`.

Und genau hier wurde unter SLES ein seltsames Verhalten beobachtet: Wenn dieses Verzeichnis noch **nicht existierte** und RCC es als root anlegte, modifizierte RCC dabei auch die Rechte des *Elternverzeichnisses* `/opt`.

`/opt` ist auf vielen Systemen der Ort, in dem Software installiert wird.  
Auf einem Checkmk-Server beispielsweise liegt dort unter `/opt/omd` die komplette Site-Struktur. Wenn hier die Rechte verpfuscht werden, erreicht der Site-User seine eigene Site nicht mehr.  
Wird der Robotmk-Host auch für andere Dinge verwendet (wovon wir aber grundsätzlich abraten), kann das Problem auch andere Software betreffen.

Die Reaktion im Mai war die naheliegende: Wenn eine Kombination Schaden anrichten kann, lassen wir sie lieber gar nicht erst zu.  
Seit Werk 19460 bricht das Backen des Agenten mit einer Fehlermeldung ab, sobald ein Linux-Agentenpaket für Root-Deployment mit RCC-basierten Plänen kombiniert wird.  
Als Migrationsweg nannte das Werk zwei Optionen: den Host auf **Non-Root-Deployment** umstellen (Regel *"Customize agent package (Linux)"*) oder RCC durch **Conda-Umgebungen** ersetzen.

---

## Akt 2: Bypass - Der Ausweg?

*(Werk [#20186](https://checkmk.com/werk/20186), 11. August 2026, ab 2.5.0p12)*

In der Praxis stellte sich dann heraus: Für Kunden mit Custom Plugins, Automatisierungen und Testskripten, die **fest verdrahtete Pfade** verwenden oder aus anderen Gründen einen Root-Kontext brauchen, war die Empfehlung, den Agenten auf nonroot umzustellen, eine Sackgasse.

Deshalb erschien im August eine Option **"Allow agent deployment as root"** in der Regel *"Robotmk Scheduler (Linux)"*, direkt bei den RCC-Einstellungen.  
Sie ist standardmäßig ausgeschaltet, und wer sie aktiviert, bestätigt damit implizit: *Ich habe das Werk 19460 gelesen und weiß, worauf ich mich einlasse.*

Das war schon mal ehrlicher als das pauschale Verbot.  
Eine Checkbox, deren einzige Aufgabe darin besteht, eine andere Einschränkung wieder auszuhebeln, ist aber designtechnisch fragwürdig.

Hinzu kommt, dass die Option nur in der Regel *"Robotmk Scheduler (Linux)"* auftaucht. Wer die Bakery gar nicht benutzt und Robotmk z. B. per Ansible deployt, kommt an dieser Stelle nie vorbei.

---

## Akt 3: Aufklärung statt Verbot

*(Werk [#20190](https://checkmk.com/werk/20190), 2. September 2026, derzeit 3.0.0b1)*

Der dritte Schritt dreht die Perspektive um.

Sowohl die ursprüngliche Restriktion **als auch** die Bypass-Checkbox sind verschwunden.  
Das Backen eines Linux-Agenten funktioniert jetzt immer - unabhängig davon, in welchem Benutzerkontext der Agent läuft und ob RCC im Spiel ist.  

An die Stelle des Verbots tritt **Inline-Hilfe**: überall dort, wo RCC als *Environment Creation Mode* ausgewählt werden kann, steht der Hinweis direkt daneben.

O-Ton des Werks:

> *"...so you can make an informed choice instead of being blocked or having to opt out via a checkbox."*

Das eigentliche Problem war ja nie "*root plus RCC*" als solches, sondern ein sehr spezifischer Nebeneffekt beim **erstmaligen Anlegen** eines Verzeichnisses unterhalb von `/opt` **unter SLES 16**.  
Ein Verbot, das die gesamte Kombination trifft, hätte nur einen Bruchteil der Fälle adressiert und den Rest grundlos blockiert.

---

## Was heißt das jetzt für Dich?

Die wichtigste Nachricht zuerst, weil sie in der Werk-Chronologie leicht untergeht:

**Du kannst beim Root-Agenten bleiben.**

Der Non-Root-Agent ist eine gute Sache... und aus Sicherheitssicht in vielen Umgebungen der bessere Weg.  
Aber er ist keine Voraussetzung dafür, Robotmk mit RCC unter Linux zu betreiben.  
Je nach Version stellt sich die Lage so dar:

- **2.4.0p33 / 2.5.0p6 bis p11:** Das Backen bricht bei Root + RCC ab. Hier hilft entweder das Update auf p12 oder einer der beiden im Werk genannten Wege (Non-Root bzw. Conda).
- **Ab 2.5.0p12:** Die Option *"Allow agent deployment as root"* in der Regel *"Robotmk Scheduler (Linux)"* hebt die Einschränkung auf. Ein Häkchen reicht.
- **Ab 3.0:** Du triffst die Entscheidung, die Inline-Hilfe liefert den Kontext dazu.

---

## Meine Einordnung

Vielleicht wirkt die ganze Geschichte auf den ersten Blick ein bisschen nach Hü und Hott.

Der erste Reflex (**blockieren**) war bei einem Bug, der im Worst Case ein Produktivsystem zerschießen kann, absolut richtig.  

Dass die Blockade dann zu grob geraten war, zeigt sich in aller Regel erst im Feld.  
Und dass sie nach vier Monaten durch etwas Präziseres ersetzt wurde, spricht eher für den Prozess als gegen ihn.

Die neue Lösung traut dem Admin natürlich etwas zu. Doku lesen (zumindest die Inline-Hilfe) war schon immer eine gute Idee. 😉

Wie handhabt Ihr das?  

Lauft Ihr auf Euren überwachten Linux-Hosts weiterhin mit Root-Agent, oder habt Ihr die Gelegenheit genutzt und auf Non-Root umgestellt?  

Schreibt es gern in die Kommentare.
