---
title: "SaaS"
weight: 60
problem: "Die Statuspage sagt grün. Deine Leute sagen was anderes."
teaser: "Sie zahlen dafür, Sie können keinen Agenten installieren, und die Statusseite des Anbieters ist Marketing."
libraries: ["Browser"]
proof:
  contrast: "img/saas-contrast.png"
  alt: "Links die Checkmk-Services rund um den SaaS-Zugang, alle grün. Rechts der Robot-Framework-Test, der die Anmeldung durchspielt und scheitert."
description: "SaaS-Verfügbarkeit überwachen, wie ein Mitarbeiter sie erlebt: Anmeldung, ein echter Arbeitsschritt, Prüfung des Ergebnisses — statt sich auf die Statuspage des Anbieters zu verlassen."
---

## Warum es weh tut

Bei einem SaaS-Dienst kontrollieren Sie nichts von dem, was Sie sonst überwachen. Sie können
keinen Agenten installieren, Sie sehen keine Server, keine Prozesse, keine Logs. Die
Infrastruktur gehört jemand anderem. Das Einzige, was Sie haben, ist der Login — und die
Rechnung.

Was der Anbieter Ihnen anbietet, ist seine Statuspage. Nur ist die kein Monitoring, sondern
Marketing: Sie wird oft manuell geschaltet, häufig erst Stunden nach dem Vorfall, und sie kennt
Ihren Tenant nicht. „Alle Systeme betriebsbereit" heißt: im Durchschnitt, für die meisten
Kunden, nach Einschätzung des Anbieters. Ob *Ihre* Leute sich anmelden und arbeiten können, sagt
diese Seite nicht.

Und genau da entstehen die Ausfälle, die niemand sieht: Ihr SSO-Zertifikat ist abgelaufen. Der
Anbieter hat eine Änderung ausgerollt, die genau Ihre Konfiguration trifft. Ein regionaler
Endpunkt hakt. Der Dienst ist „grün" — nur Ihre Mitarbeiter kommen nicht rein.

## Wie Robot Framework es löst

Der Test übernimmt die einzige Perspektive, die Ihnen bleibt: die des Anwenders im Browser. Die
**Browser Library** ruft die Login-Seite auf, meldet sich mit einem echten Testkonto an —
inklusive SSO-Weiterleitung, wenn Ihr Zugang darüber läuft — und macht dann einen echten
Arbeitsschritt: ein Ticket öffnen, einen Datensatz suchen, einen Bericht laden. Am Ende prüft
er, ob das erwartete Ergebnis wirklich da ist.

Damit hängt Ihre Aussage über die Verfügbarkeit nicht mehr an der Statuspage des Anbieters,
sondern an dem, was für Sie zählt: *Können Ihre Leute sich anmelden und arbeiten — ja oder
nein?*

```robot
*** Settings ***
Library    Browser

*** Variables ***
${SAAS_URL}    https://app.example-saas.com

*** Test Cases ***
Mitarbeiter kann sich anmelden und ein Ticket oeffnen
    New Browser    chromium    headless=${True}
    New Page    ${SAAS_URL}

    # Anmeldung, ggf. ueber die SSO-Weiterleitung des Anbieters
    Fill Text    id=email       %{SAAS_USER}
    Click        text=Weiter
    Fill Text    id=password    %{SAAS_PASSWORD}
    Click        text=Anmelden

    Wait For Elements State    data-test=dashboard    visible    timeout=30s

    # Ein echter Arbeitsschritt, nicht nur die Startseite
    Click    text=Neues Ticket
    Fill Text    id=subject    Monitoring-Testfall
    Click    text=Speichern
    Get Text    css=.ticket-status    ==    Offen
```
