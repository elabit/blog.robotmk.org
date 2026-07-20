---
title: "Web"
weight: 10
problem: "The checkout breaks — and nobody notices."
teaser: "Every component responds, the certificates are valid, the database has headroom. But nobody can pay."
libraries: ["Browser"]
proof:
  gif: "img/web.gif"
  alt: "A Robot Framework test adds an item to the cart and walks through the checkout to the order confirmation."
description: "Monitor web availability the way a customer experiences it: add an item to the cart, walk through the checkout, verify the order confirmation — not just HTTP 200."
---

## Why it hurts

Your monitoring sees the shop from the outside: the load balancer distributes traffic, the
app servers return HTTP 200, the certificate is valid, the database has headroom. Every
single value is green.

And still nobody buys. Because a status code proves that the home page is served — not that
a customer makes it through the checkout. The "add to cart" button hangs on a piece of
JavaScript that started throwing errors after the last deploy. The payment provider
responds, but its redirect lands on a blank page. A cookie banner sits on top of the order
button and nobody can click it.

The page loads flawlessly. It's just that nobody can pay.

That's the most expensive kind of outage: you don't hear about it from your monitoring, you
hear about it from the revenue report the next morning.

## How Robot Framework solves it

The test does what a customer does — every few minutes, around the clock, before the first
real customer tries.

The **Browser Library** drives a real Chromium, Firefox or WebKit — the same engine your
customers use. It opens the product page, adds an item to the cart, goes to the checkout,
fills the address fields, picks a payment method and waits for the order confirmation.
Where a human clicks, the test clicks; where a human waits for the next element, the test
waits with it — automatically, with no fixed sleeps.

So the test doesn't measure infrastructure. It measures the business: *can a customer get
through the checkout — yes or no?*

```robot
*** Settings ***
Library    Browser

*** Variables ***
${SHOP_URL}    https://shop.example.com

*** Test Cases ***
Customer Can Place An Order
    New Browser    chromium    headless=${True}
    New Page    ${SHOP_URL}
    Click      text=Headphones Pro
    Click      data-test=add-to-cart
    Click      data-test=go-to-checkout

    Fill Text    id=email       customer@example.com
    Fill Text    id=address     1 Example Street
    Fill Text    id=city        London
    Click        text=Place Order

    Wait For Elements State    data-test=order-confirmation    visible    timeout=15s
    Get Text    css=.order-number    contains    #
```
