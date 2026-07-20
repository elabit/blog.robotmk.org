---
title: "Citrix"
weight: 20
problem: "The branch office can't get in this morning."
teaser: "The session starts, but the published application hangs on its splash screen. Checkmk says every server is green."
libraries: ["Browser", "ImageHorizon"]
proof:
  gif: "img/citrix.gif"
  alt: "A Robot Framework test signs in to Citrix StoreFront, launches the published application and recognises its interface by image comparison."
description: "Monitor Citrix availability the way a user experiences it: sign in to StoreFront, launch the published application, recognise the session window by image."
---

## Why it hurts

Your monitoring sees the Citrix infrastructure from the outside: delivery controllers
respond, VDAs are registered, license servers have headroom, StoreFront returns HTTP 200.
Every single value is green.

The branch office is still stuck. Because what the user experiences happens **inside** the
session — and no agent looks there. The published application waits on a network drive
that won't mount. A profile fails to load. A splash screen sits there because a license
lookup ran into a timeout.

The session itself is technically flawless. It just can't be used.

That's the most expensive kind of outage: you don't hear about it from your monitoring,
you hear about it from the phone.

## How Robot Framework solves it

The test does what an employee does in the morning — every few minutes, before the first
employee tries.

The **Browser Library** signs in to StoreFront. That's ordinary web automation: form
fields, clicks, wait conditions. The moment the `.ica` file hands over to the Citrix
client, the browser's job ends — from here there is no DOM, only pixels.

That's where **ImageHorizonLibrary** takes over. It recognises interface elements by image
comparison, exactly like a human does: it waits for the application window to appear,
clicks the right field, types, and checks that the expected screen is there at the end.

So the test doesn't measure infrastructure. It measures the experience: *can the branch
office get in — yes or no?*

```robot
*** Settings ***
Library    Browser
Library    ImageHorizonLibrary    reference_folder=${CURDIR}/img

*** Test Cases ***
Branch Office Can Start Inventory System
    New Browser    chromium    headless=${False}
    New Page    ${STOREFRONT_URL}
    Fill Text    id=username    ${USER}
    Fill Text    id=password    ${PASSWORD}
    Click    text=Log On
    Click    text=Inventory System

    # From here there is no DOM — only pixels.
    Wait For    app_window.png    timeout=60
    Click Image    customer_search.png
    Type    ${CUSTOMER_ID}
    Wait For    customer_record.png    timeout=20
```
