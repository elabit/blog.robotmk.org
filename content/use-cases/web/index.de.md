---
title: "Web"
weight: 10
problem: "Der Checkout bricht ab — und keiner merkt es."
teaser: "Alle Komponenten antworten, die Zertifikate sind gültig, die Datenbank hat Luft. Nur bezahlen kann niemand."
libraries: ["Browser"]
proof:
  gif: "img/web.gif"
  alt: "Ein Robot-Framework-Test legt einen Artikel in den Warenkorb und durchläuft den Checkout bis zur Bestellbestätigung."
description: "Web-Verfügbarkeit überwachen, wie ein Kunde sie erlebt: Artikel in den Warenkorb, Checkout durchlaufen, Bestellbestätigung prüfen — nicht nur HTTP 200."
---

## Warum es weh tut

Ihr Monitoring sieht den Webshop von außen: Der Loadbalancer verteilt, die App-Server
antworten mit HTTP 200, das Zertifikat ist gültig, die Datenbank hat Luft. Jeder einzelne
Wert ist grün.

Trotzdem kauft niemand. Denn ein Statuscode beweist, dass die Startseite ausgeliefert
wird — nicht, dass ein Kunde durch den Checkout kommt. Der „In den Warenkorb"-Button
hängt an einem JavaScript, das nach dem letzten Deploy einen Fehler wirft. Der
Zahlungsdienstleister antwortet, aber sein Redirect landet in einer leeren Seite. Ein
Cookie-Banner legt sich über den Bestell-Button und niemand kann ihn klicken.

Die Seite lädt technisch einwandfrei. Nur bezahlen kann niemand.

Das ist die teuerste Sorte Ausfall: Sie erfahren davon nicht aus dem Monitoring, sondern
aus dem Umsatzbericht am nächsten Morgen.

## Wie Robot Framework es löst

Der Test macht, was ein Kunde macht — und zwar alle paar Minuten, rund um die Uhr, bevor
der erste echte Kunde es versucht.

Die **Browser Library** steuert einen echten Chromium, Firefox oder WebKit — dieselbe
Engine, die Ihre Kunden benutzen. Sie öffnet die Produktseite, legt einen Artikel in den
Warenkorb, geht in den Checkout, füllt die Adressfelder, wählt eine Zahlart und wartet auf
die Bestellbestätigung. Wo ein Mensch klickt, klickt der Test; wo ein Mensch auf das
nächste Element wartet, wartet der Test mit — automatisch, ohne feste Wartezeiten.

Damit misst der Test nicht die Infrastruktur, sondern das Geschäft: *Kommt ein Kunde durch
die Kasse — ja oder nein?*

```robot
*** Settings ***
Library    Browser

*** Variables ***
${SHOP_URL}    https://shop.example.com

*** Test Cases ***
Kunde kann einen Artikel bestellen
    New Browser    chromium    headless=${True}
    New Page    ${SHOP_URL}
    Click      text=Kopfhörer Pro
    Click      data-test=add-to-cart
    Click      data-test=go-to-checkout

    Fill Text    id=email       kunde@example.com
    Fill Text    id=address     Musterstraße 1
    Fill Text    id=city        Nürnberg
    Click        text=Zahlungspflichtig bestellen

    Wait For Elements State    data-test=order-confirmation    visible    timeout=15s
    Get Text    css=.order-number    contains    #
```
