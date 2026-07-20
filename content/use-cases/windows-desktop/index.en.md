---
title: "Windows Desktop"
weight: 40
problem: "The client from 2009 that nobody replaces."
teaser: "No agent looks inside it, no vendor supports it, and half the company works with it."
libraries: ["ImageHorizon", "PlatynUI"]
proof:
  gif: "img/windows-desktop.gif"
  alt: "A Robot Framework test operates a Windows fat-client application — once by image comparison, once through the UI tree."
description: "Monitor Windows fat clients the way a user operates them: two approaches compared — ImageHorizon by image comparison, PlatynUI through the UI tree."
---

## Why it hurts

Almost every company still has one: the fat-client application from 2009. The inventory
client, the industry-specific tool, the administrative software that never made it to the
browser. No modern agent looks inside it, there is no API, and the vendor stopped supporting
this version long ago. And still half the company works with it every day.

And when it won't start in the morning — because an update swapped the .NET runtime, because
a license server won't answer, because a dialog is waiting on a network path — your
monitoring sees: nothing. The process is running, the machine is online, the CPU is quiet.
It's just that nobody can operate the application.

There are two ways to check an application like this from the outside. They differ
fundamentally — and the right choice depends on what the application exposes.

## How Robot Framework solves it

**ImageHorizon** sees the application the way a human does: as an image. The library searches
the screen for reference screenshots — a button, a field, an icon — and clicks where it finds
the pattern. The big advantage: it *always* works, even for an ancient in-house build that
offers no automation interface whatsoever. The price: it's pixel-dependent. Change the
resolution, theme, scaling or font smoothing, and the reference screenshot has to be redone.

**PlatynUI** takes the other route: it accesses the UI tree — the structure of windows,
buttons and fields that Windows maintains underneath the surface. Instead of comparing
pixels, the test addresses elements by their properties: "the button named Save". That's
robust against resolution and theme, and it reads values directly. The prerequisite is that
the application exposes its UI tree at all — most native Windows controls do. PlatynUI is
built Robot-Framework-first and is the first choice wherever it applies.

The rule of thumb: **PlatynUI where the UI tree allows it — ImageHorizon where only pixels
remain.** Both routes answer the same question: *can the client be operated — yes or no?*

```robot
*** Settings ***
Library    PlatynUI
Library    ImageHorizonLibrary    reference_folder=${CURDIR}/img

*** Test Cases ***
Client Starts And Accepts Input
    # Robust: PlatynUI addresses elements through the UI tree.
    Start    inventory.exe
    Type Into    name:User        ${USER}
    Type Into    name:Password    ${PASSWORD}
    Click       name:Log On
    Wait For Element    name:MainMenu    timeout=30

    # Fallback for the legacy dialog with no UI tree: only pixels remain.
    Wait For    customer_form.png    timeout=20
    Click Image    field_customer_id.png
    Type    100815
    Wait For    customer_record.png    timeout=15
```
