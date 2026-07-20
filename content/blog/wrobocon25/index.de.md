---
draft: false
title: "Save the date: WROBOCON 2025"
# --- Italic subheading
lead: "Warum Du dieses Event nicht verpassen solltest"
# -- giscus id to match comments
commentid: "wrobocon25"
# -- predefined URL
# slug: 
# -- for posts in menubar, use this (shorter) title
# menutitle: 
description: 
date: "2025-09-22T07:35:47+02:00"
categories:
  - "events"
tags:
  - "wrobocon"
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
thumbnail: "wrobocon25.png"
translationKey: "wrobocon25"
---

Am 23. Oktober 2025 findet wieder die **WROBOCON** statt - online und for free!  
Du solltest diese Konferenz nicht verpassen, denn in der Agenda ist vielversprechend.  
👉 Meine Meinung und Empfehlungen zu den Vorträgen. 

<!--more-->

Für alle, die mit Robot Framework arbeiten oder sich dafür interessieren, ist die [WROBOCON](https://wrobocon.eu) die perfekte Gelegenheit, sich über neue Entwicklungen, Tools und Best Practices zu informieren – ganz bequem und ohne Reiseaufwand.

Sie kann mit Fug und Recht als die "*kleine Schwester*" der [ROBOCON](https://robocon.io) bezeichnet werden, die alljährlich in Helsinki stattfindet (dazu gibt es noch einen eigenen Post).

Organisiert wird die Veranstaltung von [Nice Project](https://niceproject.eu), einem Mitglied der Robot Framework Foundation.

---
 
## Warum teilnehmen?

Robot Framework ist in den letzten Jahren stark gewachsen.  
Ich muss wohl nicht extra erwähnen, dass Künstliche Intelligenz auch hier für einen enormen Innovationsschub gesorgt hat.  

Klar ist: nicht alles, was da aus dem Boden geschossen ist, wird langfristig überleben, aber schon jetzt zeichnet sich ab, was überlebt.  
Auch außerhalb von KI hat sich viel getan und die WROBOCON bietet einen idealen Überblick über diese Entwicklungen. 

--- 

## Agenda

### Anne Kramer: Model-Based Testing

![alt text](kramer.png)

Beim Model-basierten Testen geht es darum, neben der Durchführung von Tests auch ihre Erstellung möglichst weit zu automatisieren. Hierbei bedient man sich an Modellen, welche diesen Prozess systematisch und strukturiert beschreiben.  
Der **Benefit**: einheitliche und beschleunigte Erstellung von Testfällen.  

Auf diesen Vortrag von **Anne Kramer** bin ich äußerst gespannt.  
Standardisierung ist zwar besonders für größere Testlandschaften wichtig, aber alles fängt einmal klein an.  
Die Kunst besteht ja genau darin, *wachsende* Testlandschaften übersichtlich und skalierbar zu halten!

### Dirk O. Schweier: Robot Framework Listener as a Mediator of Metrics

![alt text](schweier.png)

**Dirk O. Schweier** zeigt in seinem Vortrag, wie **Robot Framework Listener** genutzt werden können, um Metriken aus Testläufen zu erfassen und weiterzugeben. 

> **Listener**  
Die Listener-API ist ein oft unterschätztes Feature in RF. Sie erlaubt es, beliebigen Python-Code während der Testausführung "einzuklinken" und auf bestimmte Ereignisse zu reagieren. Zum Beispiel, wenn ein Test startet, endet oder fehlschlägt.  
(In anderen Bereichen auch wird sowas auch "Hook" genannt).   
Damit lassen sich zusätzliche Aktionen ausführen, wie das Sammeln von Metriken, Erstellen von individuellen Logs oder das Versenden von Benachrichtigungen.

Für mich als alten Monitoring-Fan ist das natürlich ein gefundenes Fressen. 😃   
Das Sammeln von Metriken aus Testläufen ist ja eine der Kernfunktionen beim [Synthetic Monitoring / Robotmk](https://checkmk.com), wofür ich u.a. bei [Checkmk](https://checkmk.com) als Produktmanager tätig bin.  

Ich bin sehr gespannt, was Dirk da gebaut hat! 

### Robot Framework + PyTest, or Why You Should Test Your Tests

![alt text](borucki.png)

Wie jetzt!? *Tests testen*? 🫨 

**Ja, durchaus**! Wer sagt, denn dass Dein Test das richtige macht? 

**Kacper Borucki** zeigt in seinem Vortrag, wie man **Robot Framework** und **PyTest** miteinander kombinieren kann, um die Testqualität systematisch zu prüfen. 

### Artur Ziółkowski: Ten Tips & Tricks to Master Robot Framework

![alt text](artur.png)

Wer auf der Suche nach praxisnahen Tipps ist, sollte den Vortrag von Artur Ziółkowski nicht verpassen.  
Er gibt in seinem Vortrag kompakte Hinweise, die sofort im Arbeitsalltag umgesetzt werden können.


**Mein Tip**: unbedingt ansehen. Von solchen Talks kann man so viel mitnehmen - **es ist immer spannend zu sehen, wie andere arbeiten**!

### Sebastian Kupis: Lessons Learned

![alt text](kupis.png)

Mehr als "*Details to be announced*" war der Agenda nicht zu entnehmen. 😄  
Vermutlich aber geht dieser Talk in eine ähnliche Richtung wie der von Artur.

### Andrii Khaliavkin: RF-DependencyResolver

![alt text](andrii.png)

Ein technisches Highlight dürfte der Vortrag von Andrii werden: Er stellt den **RF-DependencyResolver** vor - ein Tool zur Verwaltung und Auflösung von Abhängigkeiten in Robot Framework Projekten.  
Gerade in größeren Projekten ist sauberes Dependency Management eine große Herausforderung.

### Robin Mackaij: A (semi)short history of OpenApiDriver

![alt text](robin.png)

Robin ist in der Community in bekannt wie ein bunter Hund - nicht zuletzt wegen seiner kürzlich neu aufgelegten [rf-openapitools](https://marketsquare.github.io/robotframework-openapitools/).  
Dabei handelt es sich um ein ganzes Set von Tools, die sich um das Thema "OpenAPI" ranken: 

- **OpenAPILibGen**: Ein Kommandozeilenwerkzeug, mit dem man aus OpenAPI-Dokumentationen Robot Framework Libraries erzeugen kann!  😎
- **OpenAPILibCore**: Eine Utility Library, die die Erzeugung von anderen Libraries für API-basiertes Testing erleichtert. 
- **OpenAPIDriver** (dieser Talk): Eine Erweiterung für die [DataDriver](https://github.com/Snooz82/robotframework-datadriver)-Library, mit der Testcases anhand von Informationen aus einem OpenAPI-Dokument erzeugt und ausgeführt werden können. 

### Jerzy Głowacki: Build Your Web Testing Framework with Browser Library

![alt text](jerzy.png)

**Ui, das klingt vielversprechend!**  
Nutzt Du die [Browser Library](https://marketsquare.github.io/robotframework-browser/Browser.html) für webbasierte Tests?  

Dann kennst Du das Problem vielleicht: Deine Tests funktionieren, aber der Code ist eher von der Sorte "*nicht schön, aber selten*".  
Ich kenne das aus meinen eigenen Anfängen mit Robot Framework: oft arbeitet man ausschließlich ergebnisorientiert und achtet gar nicht auf sauberer Strukturierung des Testcodes.  
Das Ergebnis: schwer lesbarer Testcode, den später niemand mehr warten kann bzw. will. (Das ist der Punkt, an dem es dann oft heißt, Robot Framework sei kompliziert 🤪)  

Jerzy wird einige gute Impulse geben, wie Testcases so geschrieben werden können, dass sie nachhaltig und skalierbar sind. 

### Daniel Biehl: Cross-Platform Desktop Testing with robotframework-platynui

![alt text](daniel.png)

Ich erinnere mich noch gut an die diesjährige Robocon 2025, als Daniel uns am Community Day die PlatynUI-Library gezeigt hatte (siehe auch mein [Blogeintrag](https://robotmk.org/de/blog/robocon25-unconference/#platynui--vielversprechender-ansatz-im-ui-testing)).  

Endlich eine Library für desktpbasiertes Testen - mit einem "RobotFramework-first Ansatz"!

✅ Cross-Platform: Läuft auf Windows, Mac & Linux.  
✅ Robot Framework First: Nutzt unter Windows nativ das UI Automation API, ohne Drittanbieter-Abhängigkeiten, komplett auf Robot Framework zugeschnitten.  
✅ Kein “Zombie-Klicken” mehr: Bildmusterbasierte Ansätze wie ImageHorizonLibrary haben oft das Problem, dass sie inaktive Buttons „sehen“ und fälschlicherweise anklicken, obwohl die Elemente nicht aktiv sind.  
Ich kenne das aus meiner langjährigen Praxis mit der ImageHorizonLibrary nur zu gut.  
✅ State-aware: Die Library erkennt, ob sich die UI nach einer Aktion tatsächlich verändert hat - oder ob sie noch einem Ladezustand verharrt und deswegen noch nicht bereit für den nächsten Klick ist.

Besonders freut mich, dass Daniel seine Library auch beim [Münchner UserGroup-Treffen (RFUGM)](https://www.linkedin.com/events/7363114016849747969/) im November live präsentieren wird! 

---

## Tipps

Auch wenn die Konferenz online und kostenlos ist, lohnt es sich, gut vorbereitet zu sein.  
Ein paar Tips, die sich für mich bewährt haben: 

-	Agenda durchgehen: Geh nicht ganz unvorbereitet in die Talks, hab zumindest eine grobe Idee, worum es geht. 
-	Fragen vorbereiten: Wenn du konkrete Herausforderungen hast, kannst du gezielt im Chat oder Q&A nachfragen.
-	Netzwerken: Nutze die Gelegenheit, dich mit anderen Teilnehmenden auszutauschen – oft entstehen daraus spannende Kontakte und Ideen.
- Be Open: Ich erinnere mich, dass ich früher bei Online-Konferenzen mir nur die Vorträge angehört habe, die bei mir resonierten. Mit so einem Cherry-Picking 🍒 unterliegst Du aber der **Confirmation Bias** - du bestätigst nur, was du schon weißt, statt deinen Horizont zu erweitern. **Hör Dir alles an**. 

--- 

## Fazit

Die WROBOCON 2025 ist ein **Pflichttermin**, ganz ohne Kosten oder Reiseaufwand.  
Der einzige Invest ist Deine Zeit - es lohnt sich!

📅 Datum: 23. Oktober 2025  
🌍 Ort: Online  
💰 Kosten: keine  
📋 Info und Anmeldung: https://wrobocon.eu


