---
title: "REST API"
weight: 50
problem: "200 OK doesn't mean the order was created."
teaser: "A status code proves the server responds. Not that your business process works."
libraries: ["Requests"]
proof:
  contrast: "img/rest-api-contrast.png"
  alt: "On the left the Checkmk services of the API hosts, all green. On the right the Robot Framework test that checks the multi-step transaction and fails."
description: "Monitor REST APIs the way a client uses them: not a single 200 OK, but the multi-step stateful transaction — get a token, create an order, poll status, verify, clean up."
---

## Why it hurts

Checkmk can do HTTP on its own. `check_httpv2` fetches a URL and checks the status code,
response time, certificate lifetime and a string in the body. For "is the endpoint alive?"
that's exactly the right tool — and if that's what you need, you don't need this page.

But a `200 OK` on `GET /health` proves nothing about your business process. An API doesn't
create an order in a single call. First it hands out a token, then you submit the order, you
get back a transaction ID, and the order isn't *done* — it's `pending`, processed
asynchronously. Only when you poll the status until it flips to `completed`, and then fetch
the result, do you know whether it worked.

Every single one of these steps can be green while the chain as a whole breaks: the token
arrives, but the order stays `pending` forever because a background worker is stuck. The order
is accepted, but the result comes back empty. Exactly this stateful, ordered logic is what a
single HTTP check does not verify — it has no memory between calls.

## How Robot Framework solves it

The **RequestsLibrary** holds a session across multiple calls: it remembers the token, carries
the transaction ID from one step to the next and checks the actual payload at every station —
not just the status code. The test models the business process end to end: get a token, create
the order, poll the status until it flips, verify the result, and clean up at the end so the
next run starts clean.

So the test doesn't measure whether an endpoint is reachable. It measures the transaction:
*does a request turn into a completed order — yes or no?*

```robot
*** Settings ***
Library    RequestsLibrary
Library    Collections

*** Variables ***
${BASE_URL}    https://api.example.com

*** Test Cases ***
Order Completes Full Processing
    Create Session    api    ${BASE_URL}

    # 1. Get a token
    ${auth}=    Post On Session    api    /oauth/token
    ...    data={"client_id": "%{CLIENT_ID}", "client_secret": "%{CLIENT_SECRET}"}
    ${headers}=    Create Dictionary    Authorization=Bearer ${auth.json()}[access_token]

    # 2. Create the order
    ${order}=    Post On Session    api    /orders    headers=${headers}
    ...    json={"article": "A-4711", "qty": 3}
    ${order_id}=    Set Variable    ${order.json()}[id]

    # 3. Poll the status until async processing is done
    Wait Until Keyword Succeeds    2 min    5 sec
    ...    Status Should Be Completed    ${headers}    ${order_id}

    # 4. Verify the result
    ${result}=    Get On Session    api    /orders/${order_id}    headers=${headers}
    Should Be Equal    ${result.json()}[status]    completed
    Should Be True    ${result.json()}[total] > 0

    # 5. Clean up so the next run starts clean
    [Teardown]    Delete On Session    api    /orders/${order_id}    headers=${headers}

*** Keywords ***
Status Should Be Completed
    [Arguments]    ${headers}    ${order_id}
    ${resp}=    Get On Session    api    /orders/${order_id}    headers=${headers}
    Should Be Equal    ${resp.json()}[status]    completed
```
