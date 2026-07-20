---
draft: false
title: "Der 'Helsinki-Shortcut' für VS Code"
# --- Italic subheading
lead: Wie du Robot Framework Tests plötzlich in Record-Zeit schreibst
# -- giscus id to match comments
commentid: helsinki-shortcut-for-vs-code
# slug: 
# -- for posts in menubar, use this (shorter) title
# menutitle: 
description: null
date: "2026-02-26T10:04:33+02:00"
categories:
  - knowhow
tags:
  - vscode
authorbox: true
sidebar: true
pager: false
thumbnail: "img/video-thumbnail.png"
vgwort: https://vg04.met.vgwort.de/na/32c4c8f232454fa9bc601454edbc46f2
translationKey: "vscode-helsinki-shortcut"
---

**Hand aufs Herz**: Wie oft drückst du am Tag auf den ⏵ -Button in VS Code? Wie viel Zeit hast Du schon mit Warten verbracht, bis der Browser endlich startet?  
Wenn Dein Workflow eine Try/Error-Endlosschleife aus Keyword schreiben, Test starten, Nächstes Keyword schreiben, Test wieder starten...  ist, dann ist dieser Hack für Dich. 

<!--more-->

---

Ich selbst wende diesen Shortcut schon seit Jahren an.  
Er beendet dieses frustrierende Stop-and-Go und lässt dich deine Keywords quasi "live" im laufenden Test entwickeln – ohne jemals den Browser neu starten zu müssen.  
Wenn du diesen Kniff einmal kennst, wirst du dich fragen, wie du jemals ohne ihn arbeiten konntest.

**Warum "Helsinki-Shortcut"?**

Ganz einfach: Auf der RoboCon in Helsinki ([hier]({{< ref "/robocon26-recap-1/" >}})  gehts zu meiner ausführlichen Review) habe ich spontan einen Lightning Talk darüber gehalten, wie man diesen Teufelskreis durchbricht.  

![alt text](img/robocon-ich.png)

Das Feedback war großartig - kaum jemand kannte diese Funktion!  
Deshalb nenne ich ihn einfach den "Helsinki Shortcut". 😅


**Das Problem**: Blindflug beim Coding

Viele arbeiten so: sie schreiben ein Keyword, lassen den Test laufen und hoffen, dass das Hinzugefügte funktioniert wie erwartet. Wenn nicht? Abbruch, Korrektur, Neustart.  
Das ist nicht nur langsam, sondern nervt auch gewaltig.

**Die Lösung**: Der Debugger (und ein magischer Shortcut)

Manche nutzen den Debugger in der RobotCode-Extension - aber nur, um akute Fehler zu finden.  
Aber das wahre Potenzial, das niemand kennt: die Live-Interaktion mit der Debug Console.

---

## Anwendung

### 1. Shortcut einrichten 

Am schnellsten erreichst Du die Shortcut-Konfiguration in VS Code mit der Kombination `Strg+K + Strg+S` (Auf Mac verwendest Du statt Strg die ⌘-Taste)

Suche nach dem Stichwort `evaluate`. Im gefundenen Eintrag *Evaluate in Debug Console* klickst Du doppelt in die Spalte "Keybinding".

![alt text](img/shortc.png)

Weise diesem Befehl den Shortcut **Alt+D** zu.

![alt text](img/assign2.png)

(Sollte Alt+D bei dir schon belegt sein, lösche die alte Zuweisung einfach vorher.)

### 2. Breakpoint setzen

Setz an der Stelle, an der Du das nächste Keyword (nein: *die* nächsten Keywords, das ist ja der Witz!) entwickeln willst, einen Breakpoint: klicke dazu in den schmalen Rand links von der Zeilennummer, sodass ein **runder roter Punkt** erscheint.

**Tipp:** Ich benutze gern dazu das Dummy-Keyword `No Operation` - das macht nämlich genau: nichts. Das ist besonders dann praktisch, wenn Du ein neues User-Keyword erstellen willst und darin noch keine Keywörter enthalten sind. Ein "leeres" Keyword ergibt einen Syntax-Error - `No Operation` löst das Problem. 

![alt text](img/breakpoint.png)

> Der Breakpoint sagt dem Debugger, an welcher Stelle er die Ausführung pausieren soll. 

### 3. Debugger starten

Starte jetzt den Debugger, indem Du mit der rechten Maustaste auf den "Start"-Pfeil neben dem Testcase klickst und **Debug Test** auswählst: 

![alt text](img/debugtest.png)

Die Ausführung hält an genau dieser Stelle an. Das siehst Du u.a. daran, dass der Breakpoint gelb umrandet ist und die Zeile gelblich unterlegt ist: 

![alt text](img/brekapoint_reached.png)

### 4. Evaluieren direkt im Editor 

Und jetzt kommen wir zum Clou: Die Profis wissen, dass sie bei angehaltenem Debugger in der Debug Console die Keywords von Robot Framework ausführen können: 

![alt text](img/debugconsole-execute.gif)

Nachteilig daran ist, dass Du ein Keyword, sobald es funktioniert wie erwartet, nach oben in den Editor kopiert werden muss. Auch das ist Copy-Paste-Arbeit, die Du Dir ab heute sparen kannst. 

**Du schreibst ab heute deinen Code direkt im Editor.**

Mit **Alt+D** feuerst du das Keyword der aktiven Zeile (oder der markierten Zeilen - auch sehr praktisch) direkt in die Debug Console, ohne diese vorher aktivieren zu müssen.  

Du siehst sofort im Browser, ob es funktioniert – ohne den Fokus zu verlieren, ohne Copy-Paste, ohne Neustart.

## Das Video

Im Video zeige ich dir Schritt für Schritt am Beispiel eines **Webshop-Tests**, wie Du die weit verbreitete Art zu "debuggen" (was es eigentlich gar nicht ist) durch die effiziente Evaluierung in der Debug Console mittels Alt+D ersetzt:

<script src="https://fast.wistia.com/player.js" async></script><script src="https://fast.wistia.com/embed/kwbpu1kea3.js" async type="module"></script><style>wistia-player[media-id='kwbpu1kea3']:not(:defined) { background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/kwbpu1kea3/swatch'); display: block; filter: blur(5px); padding-top:56.25%; }</style> <wistia-player media-id="kwbpu1kea3" aspect="1.7777777777777777"></wistia-player>

<br>
<br>

---

## Der Robot Framework Accelerator - Werde zum Profi 🚀

Der **Helsinki Shortcut** ist nur die Spitze des Eisbergs.  

Aus einer spontanen Idee in Helsinki wurde etwas Großes - ich bin kurz vor dem Launch des  

**Robot Framework Accelerator** 

![alt text](img/ACCELERATOR.png)

Ein Intensivtraining, das es so noch nicht gibt.  
Das Tricks wie diese zu einem großen Ganzen zusammenfügt. 

**Der Launch ist demnächst und die Plätze sind knapp.**

👉 Melde dich am besten jetzt gleich für meinen [Robotmk Newsletter](https://www.robotmk.org/en/newsletter/) an, um am Ball zu bleiben.

Wie gefällt dir der Shortcut? Schreib es unten in die Kommentare! 👇

PS: Der Webshop-Test ist übrigens hier im [Robotmk Examples Repo](https://github.com/Checkmk/robotmk-examples/tree/main/examples/web/web-webshop) zu finden.