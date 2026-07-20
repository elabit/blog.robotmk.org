---
title: "Windows Desktop"
weight: 40
problem: "Der Client von 2009, den keiner ablöst."
teaser: "Kein Agent sieht hinein, kein Hersteller supportet ihn, und das halbe Haus arbeitet damit."
libraries: ["ImageHorizon", "PlatynUI"]
proof:
  gif: "img/windows-desktop.gif"
  alt: "Ein Robot-Framework-Test bedient eine Windows-Fat-Client-Anwendung — einmal per Bildvergleich, einmal über den UI-Baum."
description: "Windows-Fat-Clients überwachen, wie ein Anwender sie bedient: zwei Ansätze im Vergleich — ImageHorizon per Bildvergleich, PlatynUI über den UI-Baum."
---

## Warum es weh tut

In fast jedem Haus steht sie noch: die Fat-Client-Anwendung von 2009. Der Warenwirtschafts-
Client, das Branchentool, die Verwaltungssoftware, die nie in den Browser migriert wurde.
Kein moderner Agent sieht hinein, eine API gibt es nicht, und der Hersteller supportet die
Version schon lange nicht mehr. Trotzdem arbeitet das halbe Haus jeden Tag damit.

Und wenn sie morgens nicht startet — weil ein Update die .NET-Runtime getauscht hat, weil
ein Lizenzserver nicht antwortet, weil ein Dialog auf einen Netzwerkpfad wartet — dann sieht
Ihr Monitoring: nichts. Der Prozess läuft, der Rechner ist online, die CPU ist ruhig. Nur
bedienen kann die Anwendung niemand.

Um so eine Anwendung von außen zu prüfen, gibt es zwei Wege. Sie unterscheiden sich
grundlegend — und die richtige Wahl hängt davon ab, was die Anwendung preisgibt.

## Wie Robot Framework es löst

**ImageHorizon** sieht die Anwendung wie ein Mensch: als Bild. Die Library sucht auf dem
Bildschirm nach Referenz-Screenshots — ein Button, ein Feld, ein Icon — und klickt dorthin,
wo sie das Muster findet. Der große Vorteil: Es funktioniert *immer*, auch bei einer uralten
Eigenentwicklung, die keinerlei Automatisierungs-Schnittstelle anbietet. Der Preis: Es ist
pixelabhängig. Ändern sich Auflösung, Theme, Skalierung oder Schriftglättung, muss der
Referenz-Screenshot nachgezogen werden.

**PlatynUI** geht den anderen Weg: Es greift auf den UI-Baum zu — die Struktur aus Fenstern,
Buttons und Feldern, die Windows unter der Oberfläche führt. Statt Pixel zu vergleichen,
spricht der Test Elemente über ihre Eigenschaften an: „der Button mit dem Namen Speichern".
Das ist robust gegen Auflösung und Theme und liest Werte direkt aus. Voraussetzung ist, dass
die Anwendung ihren UI-Baum überhaupt offenlegt — die meisten nativen Windows-Controls tun
das. PlatynUI ist Robot-Framework-first entwickelt und die erste Wahl, wo es greift.

Die Faustregel: **PlatynUI, wo der UI-Baum es hergibt — ImageHorizon, wo nur noch Pixel
bleiben.** Beide Wege beantworten dieselbe Frage: *Lässt sich der Client bedienen — ja oder
nein?*

```robot
*** Settings ***
Library    PlatynUI
Library    ImageHorizonLibrary    reference_folder=${CURDIR}/img

*** Test Cases ***
Client startet und nimmt eine Eingabe an
    # Robust: PlatynUI spricht Elemente über den UI-Baum an.
    Start    warenwirtschaft.exe
    Type Into    name:Benutzer      ${USER}
    Type Into    name:Kennwort      ${PASSWORD}
    Click       name:Anmelden
    Wait For Element    name:Hauptmenue    timeout=30

    # Fallback fuer den Legacy-Dialog ohne UI-Baum: nur noch Pixel.
    Wait For    kundenmaske.png    timeout=20
    Click Image    feld_kundennummer.png
    Type    100815
    Wait For    kundendatensatz.png    timeout=15
```
