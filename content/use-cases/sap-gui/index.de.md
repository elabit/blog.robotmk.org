---
title: "SAP GUI"
weight: 30
problem: "Die Transaktion hängt. Alle Server sind grün."
teaser: "Der Applikationsserver antwortet, die Arbeitsprozesse laufen, die Datenbank ist gesund. Der Sachbearbeiter wartet trotzdem."
libraries: ["SapGui"]
proof:
  gif: "img/sap-gui.gif"
  alt: "Ein Robot-Framework-Test meldet sich am SAP GUI an, ruft eine Transaktion auf und prüft das Ergebnis im Dynpro."
description: "SAP-Verfügbarkeit überwachen, wie ein Sachbearbeiter sie erlebt: Anmeldung am SAP GUI, Aufruf einer Transaktion, Prüfung des Ergebnisses im Dynpro."
---

## Warum es weh tut

Ihr Monitoring sieht das SAP-System von innen — technisch: Die Applikationsserver stehen,
die Work-Prozesse sind nicht verstopft, die Enqueue-Sperren sind sauber, die Datenbank
antwortet in Millisekunden. CCMS meldet grün, jeder Instanz-Wert ist im grünen Bereich.

Trotzdem wartet der Sachbearbeiter in der Buchhaltung. Denn was er erlebt, ist die eine
Transaktion, die er jeden Morgen braucht — und die hängt. Ein Batch-Job aus der Nacht
hält eine Sperre auf einer Tabelle. Ein Customizing-Eintrag wurde transportiert und läuft
jetzt in einen Dump. Ein RFC-Baustein zu einem angebundenen System läuft in ein Timeout,
und das Dynpro dreht sich.

Das System ist technisch gesund. Nur arbeiten kann damit niemand.

Das ist die teuerste Sorte Ausfall: Sie erfahren davon nicht aus dem Monitoring, sondern
aus dem Ticket, das der Fachbereich um 8:15 Uhr aufmacht.

## Wie Robot Framework es löst

Der Test macht, was ein Sachbearbeiter macht — und zwar alle paar Minuten, bevor der erste
Sachbearbeiter es versucht.

Die **SapGuiLibrary** steuert das SAP GUI über das offizielle Scripting-Interface — dieselbe
Schnittstelle, mit der SAP-Anwender selbst automatisieren. Der Test meldet sich am Mandanten
an, setzt eine Transaktion ins Kommandofeld, füllt die Felder des Dynpros, schickt es ab und
liest das Ergebnis genau da aus, wo der Mensch es sieht: in der Statusleiste, in einer
Ergebnistabelle, im nächsten Screen. Bleibt die Antwort aus oder erscheint eine Fehlermeldung,
schlägt der Test fehl.

Damit misst der Test nicht die Instanz, sondern den Geschäftsvorfall: *Kommt die Transaktion
durch — ja oder nein?*

```robot
*** Settings ***
Library    SapGuiLibrary

*** Variables ***
${CONNECTION}    Produktivsystem PRD
${TCODE}         VA03

*** Test Cases ***
Kundenauftrag laesst sich anzeigen
    Connect To Session
    Open Connection    ${CONNECTION}
    Input Text    wnd[0]/usr/txtRSYST-BNAME    ${USER}
    Input Text    wnd[0]/usr/pwdRSYST-BCODE    ${PASSWORD}
    Send Vkey    0

    Input Text    wnd[0]/tbar[0]/okcd    /n${TCODE}
    Send Vkey    0
    Input Text    wnd[0]/usr/ctxtVBAK-VBELN    12345678
    Send Vkey    0

    Element Value Should Be    wnd[0]/usr/subSUBSCREEN_HEADER:SAPMV45A:4021/txtVBAK-AUART    TA
    Element Should Be Present    wnd[0]/sbar
```
