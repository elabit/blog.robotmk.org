---
title: "REST API"
weight: 50
problem: "200 OK heißt nicht, dass der Auftrag angelegt wurde."
teaser: "Ein Statuscode beweist, dass der Server antwortet. Nicht, dass Ihr Geschäftsprozess funktioniert."
libraries: ["Requests"]
proof:
  contrast: "img/rest-api-contrast.png"
  alt: "Links die Checkmk-Services der API-Hosts, alle grün. Rechts der Robot-Framework-Test, der die mehrstufige Transaktion prüft und fehlschlägt."
description: "REST-APIs überwachen, wie ein Client sie nutzt: nicht ein einzelnes 200 OK, sondern die mehrstufige Transaktion mit Zustand — Token holen, Auftrag anlegen, Status pollen, verifizieren, aufräumen."
---

## Warum es weh tut

Checkmk kann HTTP längst selbst. Der `check_httpv2` holt eine URL, prüft Statuscode,
Antwortzeit, Zertifikatslaufzeit und einen String im Body. Für „lebt der Endpunkt?" ist das
genau das richtige Werkzeug — und wenn es das ist, was Sie brauchen, brauchen Sie diese Seite
nicht.

Nur beweist ein `200 OK` auf `GET /health` nichts über Ihren Geschäftsprozess. Eine API legt
keinen Auftrag mit einem einzigen Aufruf an. Sie holt erst ein Token, schickt dann den Auftrag,
bekommt eine Vorgangs-ID zurück, und der Auftrag ist nicht *fertig*, sondern `pending` — die
Verarbeitung läuft asynchron. Erst wenn Sie den Status pollen, bis er auf `completed` springt,
und dann das Ergebnis abrufen, wissen Sie, ob es funktioniert hat.

Jeder einzelne dieser Schritte kann grün sein, während die Kette als Ganzes bricht: Das Token
kommt, aber der Auftrag bleibt ewig `pending`, weil ein Worker im Hintergrund steht. Der Auftrag
wird angenommen, aber das Ergebnis ist leer. Genau diese Zustands- und Reihenfolge-Logik prüft
ein einzelner HTTP-Check nicht — dafür fehlt ihm das Gedächtnis zwischen den Aufrufen.

## Wie Robot Framework es löst

Die **RequestsLibrary** hält eine Session über mehrere Aufrufe hinweg: Sie merkt sich das Token,
reicht die Vorgangs-ID von einem Schritt zum nächsten weiter und prüft an jeder Station den
tatsächlichen Payload — nicht nur den Statuscode. Der Test bildet den Geschäftsvorfall
vollständig ab: Token holen, Auftrag anlegen, Status pollen, bis er umschlägt, Ergebnis
verifizieren und am Ende aufräumen, damit der nächste Durchlauf sauber startet.

Damit misst der Test nicht die Erreichbarkeit eines Endpunkts, sondern die Transaktion:
*Wird aus einer Anfrage ein fertiger Auftrag — ja oder nein?*

```robot
*** Settings ***
Library    RequestsLibrary
Library    Collections

*** Variables ***
${BASE_URL}    https://api.example.com

*** Test Cases ***
Auftrag durchlaeuft die vollstaendige Verarbeitung
    Create Session    api    ${BASE_URL}

    # 1. Token holen
    ${auth}=    Post On Session    api    /oauth/token
    ...    data={"client_id": "%{CLIENT_ID}", "client_secret": "%{CLIENT_SECRET}"}
    ${headers}=    Create Dictionary    Authorization=Bearer ${auth.json()}[access_token]

    # 2. Auftrag anlegen
    ${order}=    Post On Session    api    /orders    headers=${headers}
    ...    json={"article": "A-4711", "qty": 3}
    ${order_id}=    Set Variable    ${order.json()}[id]

    # 3. Status pollen, bis die asynchrone Verarbeitung durch ist
    Wait Until Keyword Succeeds    2 min    5 sec
    ...    Status Should Be Completed    ${headers}    ${order_id}

    # 4. Ergebnis verifizieren
    ${result}=    Get On Session    api    /orders/${order_id}    headers=${headers}
    Should Be Equal    ${result.json()}[status]    completed
    Should Be True    ${result.json()}[total] > 0

    # 5. Aufraeumen, damit der naechste Lauf sauber startet
    [Teardown]    Delete On Session    api    /orders/${order_id}    headers=${headers}

*** Keywords ***
Status Should Be Completed
    [Arguments]    ${headers}    ${order_id}
    ${resp}=    Get On Session    api    /orders/${order_id}    headers=${headers}
    Should Be Equal    ${resp.json()}[status]    completed
```
