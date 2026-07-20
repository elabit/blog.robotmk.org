---
draft: false
title: "Robocon 25: Auf nach Helsinki! ✈️"
# --- Italic subheading
# lead: 
# -- giscus id to match comments
# commentid: 
# -- predefined URL
# slug: 
# -- for posts in menubar, use this (shorter) title
# menutitle: 
description: 
date: "2025-02-10T11:19:14+01:00"
categories:
  - ""
tags:
  - "robocon"
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
thumbnail: "robocon_airport.png"
vgwort: https://vg04.met.vgwort.de/na/a0861cef6e754ee293afff3a1ae14a70
translationKey: "robocon25-agenda"
---

**Flughafen München, Terminal 2 Gate K10** - ich nutze die noch üppig vorhandene Wartezeit auf meinen Flieger, um die Agenda der Robocon 2025 genauer zu studieren.

👉 Dieses Jahr sind wirklich großartige Themen dabei!  


<!--more-->

## Die Robocon – Ein kurzer Überblick  

Die **Robocon** ([https://robocon.io](https://robocon.io)) ist die führende internationale Konferenz rund um Robot Framework.  
Sie findet jedes Jahr in Helsinki statt und wird von der **Robot Framework Foundation**, der hinter dem Projekt stehenden Non-Profit-Organisation, organisiert.  

Das Event bietet eine tolle Mischung aus **hochkarätigen Vorträgen, Lightning Talks und interaktiven Workshops**.  
Dabei richtet sich die Konferenz sowohl an Einsteiger als auch an erfahrene Nutzer von Robot Framework.  
**
Eine großartige Gelegenheit**, neue Einblicke zu gewinnen, Best Practices kennenzulernen und mit anderen Testautomatisierern ins Gespräch zu kommen.  

## Warum ich auf die Robocon 2025 besonders gespannt bin  

Natürlich freue ich mich jedes Jahr auf dieses Event – doch dieses Mal ganz besonders.  
Nicht nur, weil die Agenda randvoll mit **interessanten Themen** ist (siehe unten), sondern auch, weil dieses Jahr die **erste offizielle Zertifizierung** für Robot Framework namens "**RFCP**" 🏅 (Robot Framework Certified Professional), vorgestellt wird.  

Ich hatte die Ehre, in der Arbeitsgruppe mitzuwirken, die am Syllabus für das RFCP gearbeitet hat.  
Die Einführung dieser Zertifizierung ist ein Meilenstein für die Community und ein großer Schritt, um Robot Framework als professionelle Testautomatisierungslösung weiter zu etablieren.  
Ich bin stolz, einer der ersten akkreditierten Trainer zu sein und freue mich schon darauf, in Kürze meine ersten Trainings halten zu dürfen. (Hallo München, ich freue mich! 🙋‍♂️ )

Doch nun zum eigentlichen Highlight: die spannendsten Themen der diesjährigen Robocon.  

---

### KI und Selbstheilende Tests  

Man merkt deutlich, dass **KI langsam auch im Robot Framework-Ökosystem erwachsen wird**.  

Gleich mehrere Vorträge widmen sich diesem Thema – ein Zeichen dafür, dass sich Automatisierung und maschinelles Lernen immer mehr verzahnen.  

Besonders freue ich mich auf folgende Sessions:  

"**Make Automation Green Again - Experiments with AI supported self-healing**"

Hier wird **Many Kasiriha** zeigen, wie KI dazu beitragen kann, fehlschlagende Tests **schon während der Ausführung automatisch reparieren zu lassen**. 

(Manys Vorträge sind in der Community legendär – seine Art, komplexe Themen auf den Punkt zu bringen, sorgt regelmäßig für Reaktionen der Art **„Mehr davon!“** 😊  ) 

"**Appium Self-healing for RobotFramework AppiumLibrary**"

Mobile Testing auf **iOS und Android** ist ein Bereich, den ich mittelfristig auch unbedingt in mein Schulungsprogramm aufnehmen möchte.  

Die Möglichkeit, **selbstheilende Testmechanismen** direkt auch in die AppiumLibrary zu integrieren, könnte viele der typischen Herausforderungen im Mobile Testing entschärfen.  
Denn eines weiß ich aus eigener Erfahrung: Mobile UI-Tests sind oft eine echte Herausforderung – vor allem beim Debugging. 

"**Dear AI, Which Tests should Robot Framework Execute Now?**"

Der Titel allein klingt schon vielversprechend.  
**Elmar Jürgens** wird zeigen, wie KI dabei helfen kann, aus einer immer größer werdenden Testmenge **gezielt die Tests auszuwählen, die mit höchster Wahrscheinlichkeit den nächsten Bug finden**.  

Eine Lösung, die nicht nur Testzeit spart, sondern auch die Effizienz von Testautomatisierungen deutlich steigern könnte.  

"**Redefining Automation with Robot Freamework: Harnessing AI, LLMs, and Custom Libraries for Next-Gen Testing**"

Hier wird es garantiert spannend! **Siddhant Wadhwani** wird in einer **Live-Demo** zeigen, wie **AI und LLMs in Custom Libraries** eingesetzt werden können – unter anderem für selbstheilende Tests und Echtzeit-Testanalysen.  

**Mein Fazit vorab:** 

KI wird auch in der Testautomatisierung ein **Gamechanger** - *und das hier ist erst der Anfang*. 

---

### DevOps & CI/CD  

Als langjähriger **Ansible-Nutzer** denke ich bei **Infrastructure as Code (IaC)** natürlich sofort an das Provisionieren von On-Prem-Servern. Doch es gibt weit mehr spannende Möglichkeiten, wie Nils Balkow-Tychsen in seinem Talk zeigen wird: 

"**Infrastructure as Code – Yet another super power for your test automation**"

Nils hat eine Library für OpenTofu (den Open-Source-Fork von Terraform) entwickelt.  

Das bedeutet: Robot Framework kann nicht nur Tests ausführen, sondern auch seine eigene Testinfrastruktur dynamisch auf- und abbauen! Sehr cool!

---

### Performance- und Lasttests  

Zwei Vorträge widmen sich Performance-Testing – ein Bereich, der oft unterschätzt wird:  

"**Utilizing RF Swarm to Execute Performance Testing on PostgreSQL Database Upgrade**"

**Omoghomion Oredia** wird zeigen, wie er mit **RF Swarm eine PostgreSQL-Migration auf AWS** getestet hat.  

Ein praxisnahes Beispiel, das zeigt, wie Robot Framework über reine Funktionstests hinauswachsen kann.  

"**Perfbot – Integrated performance analysis of robot tests**"

Besonders auf diesen Talk von Lennart Potthoff bin ich gespannt wegen meiner Zweit-Rolle als Product Manager für Robotmk bei Checkmk.

Denn Performancemessungen und historische Aufzeichnungen sind **essenzielle Features von Robotmk**, um Robot Framework-Tests dauerhaft zu überwachen. Vielleicht lässt sich Perfbot ja ins **Synthetic Monitoring mit Robotmk** integrieren?  

---

### UI-Testing  

"**Robot Framework to the Rescue: Replacing EggPlant with a Custom UI-Test Library**"

Wow! Endlich tut sich etwas im Bereich des UI-Testings.

Die **PlatynUI-Library** tritt an als **cross-platform Desktop UI Automation Library** – und verspricht damit eine echte Alternative zu bestehenden Lösungen wie **ImageHorizonLibrary**.  

👉  Wird die PlatynUI-Library meine neue Lieblings-Library? Ich bin gespannt!  😉

---

## Zusammenfassung  

An der **Agenda** der Robocon 2025 kann man klare Trends ablesen:  

1. **KI** wird immer stärker mit Testautomatisierung kombiniert – **Self-healing, Predictive Testing & LLMs** halten Einzug.  
2. Mobile Testautomatisierung mit der **AppiumLibrary** rückt stärker in den Fokus (und wird auch allmählich benutzbar...)  
3. Robot Framework ist definitiv auch wichtig für **DevOps** & CI/CD-Themen.
4. Alte Tools werden durch neue Lösungen ersetzt und **werten das Robot Framework Ökosystem auf**: EggPlant → Robot Framework, Terraform → OpenTofu. ⭐️ 

---

## Fazit & Ausblick  

Die Robocon 2025 wird definitiv ein Highlight – nicht nur wegen der spannenden Themen, sondern auch wegen der großartigen Community.  
Ich freue mich auf den Austausch mit Gleichgesinnten, die neuesten Entwicklungen im Robot Framework-Ökosystem und natürlich auf ein paar Tage in Helsinki. 

**...boarding time! 💺**


P.S.: Ratet mal, wer so doof ist, ohne Mütze im Februar nach Helsinki zu fliegen 😂

![](window.png)