---
title: "Citrix"
weight: 20
problem: "Die Filiale kommt morgens nicht rein."
teaser: "Die Session startet, aber die veröffentlichte Anwendung hängt im Splash-Screen. Checkmk sagt: alle Server grün."
libraries: ["Browser", "ImageHorizon"]
proof:
  gif: "img/citrix.gif"
  alt: "Ein Robot-Framework-Test meldet sich an der Citrix-StoreFront an, startet die veröffentlichte Anwendung und erkennt deren Oberfläche per Bildvergleich."
description: "Citrix-Verfügbarkeit überwachen, wie ein Anwender sie erlebt: Anmeldung an der StoreFront, Start der veröffentlichten Anwendung, Bilderkennung im Session-Fenster."
---

## Warum es weh tut

Ihr Monitoring sieht die Citrix-Infrastruktur von außen: Die Delivery Controller antworten,
die VDAs sind registriert, die Lizenzserver haben Luft, die StoreFront liefert HTTP 200.
Jeder einzelne Wert ist grün.

Trotzdem steht die Filiale. Denn was der Anwender erlebt, passiert **innerhalb** der
Session — und dort sieht kein Agent hin. Die veröffentlichte Anwendung wartet auf ein
Netzlaufwerk, das nicht mountet. Ein Profil lädt nicht. Ein Splash-Screen bleibt stehen,
weil eine Lizenzabfrage in ein Timeout läuft.

Die Session selbst ist technisch einwandfrei. Nur benutzen kann sie niemand.

Das ist die teuerste Sorte Ausfall: Sie erfahren davon nicht aus dem Monitoring, sondern
vom Telefon.

## Wie Robot Framework es löst

Der Test macht, was ein Mitarbeiter morgens macht — und zwar alle paar Minuten, bevor der
erste Mitarbeiter es versucht.

Die **Browser Library** meldet sich an der StoreFront an. Das ist normale Web-Automation:
Formularfelder, Klicks, Wartebedingungen. Ab dem Moment, in dem die `.ica`-Datei den
Citrix-Client startet, endet die Zuständigkeit des Browsers — ab hier gibt es kein DOM
mehr, nur noch Pixel.

Dort übernimmt die **ImageHorizonLibrary**. Sie erkennt Oberflächenelemente per
Bildvergleich, genau wie ein Mensch: Sie wartet, bis das Anwendungsfenster erscheint,
klickt in das richtige Feld, tippt, und prüft, ob am Ende der erwartete Bildschirm da ist.

Damit misst der Test nicht die Infrastruktur, sondern die Erfahrung: *Kommt die Filiale
rein — ja oder nein?*

```robot
*** Settings ***
Library    Browser
Library    ImageHorizonLibrary    reference_folder=${CURDIR}/img

*** Test Cases ***
Filiale kann Warenwirtschaft starten
    New Browser    chromium    headless=${False}
    New Page    ${STOREFRONT_URL}
    Fill Text    id=username    ${USER}
    Fill Text    id=password    ${PASSWORD}
    Click    text=Anmelden
    Click    text=Warenwirtschaft

    # Ab hier gibt es kein DOM mehr — nur noch Pixel.
    Wait For    app_window.png    timeout=60
    Click Image    kundensuche.png
    Type    ${KUNDENNUMMER}
    Wait For    kundendatensatz.png    timeout=20
```
