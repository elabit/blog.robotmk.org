---
title: "SaaS"
weight: 60
problem: "The status page says green. Your people say otherwise."
teaser: "You pay for it, you can't install an agent, and the vendor's status page is marketing."
libraries: ["Browser"]
proof:
  contrast: "img/saas-contrast.png"
  alt: "On the left the Checkmk services around the SaaS access, all green. On the right the Robot Framework test that walks through the login and fails."
description: "Monitor SaaS availability the way an employee experiences it: sign in, do a real task, verify the result — instead of trusting the vendor's status page."
---

## Why it hurts

With a SaaS service you control none of what you'd normally monitor. You can't install an
agent, you see no servers, no processes, no logs. The infrastructure belongs to someone else.
The only thing you have is the login — and the invoice.

What the vendor offers you is its status page. But that isn't monitoring, it's marketing: it's
often flipped by hand, frequently hours after the incident, and it knows nothing about your
tenant. "All systems operational" means: on average, for most customers, in the vendor's
judgement. Whether *your* people can sign in and work is not something that page tells you.

And that's exactly where the outages nobody sees come from: your SSO certificate has expired.
The vendor rolled out a change that hits precisely your configuration. A regional endpoint is
stalling. The service is "green" — it's just that your employees can't get in.

## How Robot Framework solves it

The test takes the only perspective you have left: the user's, in the browser. The **Browser
Library** opens the login page, signs in with a real test account — including the SSO redirect,
if your access runs through one — and then does a real task: open a ticket, look up a record,
load a report. At the end it checks that the expected result is actually there.

So your statement about availability no longer hangs on the vendor's status page, but on what
matters to you: *can your people sign in and work — yes or no?*

```robot
*** Settings ***
Library    Browser

*** Variables ***
${SAAS_URL}    https://app.example-saas.com

*** Test Cases ***
Employee Can Sign In And Open A Ticket
    New Browser    chromium    headless=${True}
    New Page    ${SAAS_URL}

    # Sign in, possibly via the vendor's SSO redirect
    Fill Text    id=email       %{SAAS_USER}
    Click        text=Continue
    Fill Text    id=password    %{SAAS_PASSWORD}
    Click        text=Sign In

    Wait For Elements State    data-test=dashboard    visible    timeout=30s

    # A real task, not just the landing page
    Click    text=New Ticket
    Fill Text    id=subject    Monitoring test case
    Click    text=Save
    Get Text    css=.ticket-status    ==    Open
```
