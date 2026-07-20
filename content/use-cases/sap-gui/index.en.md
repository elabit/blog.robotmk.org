---
title: "SAP GUI"
weight: 30
problem: "The transaction hangs. Every server is green."
teaser: "The application server responds, the work processes are running, the database is healthy. The clerk is waiting anyway."
libraries: ["SapGui"]
proof:
  gif: "img/sap-gui.gif"
  alt: "A Robot Framework test signs in to SAP GUI, calls a transaction and checks the result in the dynpro."
description: "Monitor SAP availability the way a clerk experiences it: sign in to SAP GUI, call a transaction, verify the result in the dynpro."
---

## Why it hurts

Your monitoring sees the SAP system from the inside — technically: the application servers
are up, the work processes aren't clogged, the enqueue locks are clean, the database
responds in milliseconds. CCMS reports green, every instance metric is well within range.

And still the clerk in accounting is waiting. Because what he experiences is the one
transaction he needs every morning — and it hangs. A batch job from overnight is holding a
lock on a table. A customizing entry was transported and now runs into a dump. An RFC call
to a connected system runs into a timeout, and the dynpro just spins.

The system is technically healthy. It's just that nobody can work with it.

That's the most expensive kind of outage: you don't hear about it from your monitoring, you
hear about it from the ticket the business opens at 8:15 in the morning.

## How Robot Framework solves it

The test does what a clerk does — every few minutes, before the first clerk tries.

The **SapGuiLibrary** drives SAP GUI through the official scripting interface — the same
interface SAP users automate with themselves. The test signs in to the client, types a
transaction into the command field, fills the dynpro fields, submits it and reads the result
exactly where a human sees it: in the status bar, in a result table, on the next screen. If
the response doesn't come or an error message appears, the test fails.

So the test doesn't measure the instance. It measures the business process: *does the
transaction go through — yes or no?*

```robot
*** Settings ***
Library    SapGuiLibrary

*** Variables ***
${CONNECTION}    Production System PRD
${TCODE}         VA03

*** Test Cases ***
Sales Order Can Be Displayed
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
