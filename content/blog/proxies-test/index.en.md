---
draft: false
title: "Understanding and Applying Proxy Settings"
# --- Italic subheading
lead: "How Python and Chromium handle proxy variables differently - and what that means for Robot Framework."
# -- giscus id to match comments
commentid: proxy-settings
# -- predefined URL
# slug:
# -- for posts in menubar, use this (shorter) title
# menutitle:
#description:
date: "2026-10-20T09:00:00+02:00"
categories:
  - how-to
tags:
  - robotmk
  - robot-framework
  - rcc
  - browser-library
  - requests-library
  - proxy
  - troubleshooting
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
thumbnail: "img/title.png"
# TODO: eigene VG-Wort-Zählmarke eintragen
vgwort:
translationKey: "proxy-settings"
---

"*It's always DNS*." – I'd like to add: "*or the proxy*."
Proxy problems are one of those things that make me sigh quietly to myself...  
They are often why environments fail to install, or why tests simply don't run and nobody knows why. (And the proxy admin is off for the day.)

I wanted to reproduce the behaviour of the **Browser Library** and the **RequestsLibrary** in a "quick" test.  
What came out of it is a rather nice little test project with two Docker proxies, five test scenarios and an interesting realisation that I'd like to share with you in this article.

<!--more-->

## The question

I wanted to know: How do these two libraries behave when a proxy is involved – and how do you set one correctly in each case?

## The test setup

### Test case

The demonstration uses a very simple test case that first checks via a **REST call** whether a backend responds, and then opens a web interface in the **browser**:

```robotframework
Python Request
    Scenario GET    http://example.com/?via=python-requests

Open HTTP And HTTPS Page
    Open Scenario Browser
    New Page    http://example.com
    Get Title    ==    Example Domain
    Go To    https://example.org
    Get Title    ==    Example Domain
```

`Scenario GET` and `Open Scenario Browser` come from a resource file that changes depending on the scenario.  
In one of them they call `GET` and `New Browser` without a proxy, in the other with an explicitly specified proxy.  
The test itself is identical across all runs; only the proxy configuration varies.

### The two spoilsports: the proxies

I set up **two instances** of [mitmproxy](https://www.mitmproxy.org) – on macOS as Docker containers, on Windows as local Python processes.

- **Proxy A** is to be set via the **environment variables** of the operating system.  
- **Proxy B** is specified explicitly in the test case itself: 
  - for the **RequestsLibrary** via `proxies=` in `GET`, 
  - for the **Browser Library** via `proxy=` in `New Browser`. This makes it possible to see whether the explicit proxy overrides the variables.

### Proxy environment variables

These three exist on all operating systems:

- `HTTP_PROXY` = proxy server for **HTTP** targets  
- `HTTPS_PROXY` = proxy server for **HTTPS** targets     
- `NO_PROXY` = needed as soon as a proxy is set: it excludes targets that should not or cannot go through the proxy, typically `localhost,127.0.0.1` and internal hosts. Without a proxy, the variable has nothing to do.

> Many programmes use these variables for proxy configuration. 
> However, this is not a standard: every programme decides for itself whether and how it reads them.

### How the test runs


I wanted to test five combinations:

| #   | Proxy env variables (A) | `NO_PROXY`                   | Proxy explicit in the test (B) | What I wanted to know  |
| --- | ----------------------- | ------------------- | ------------------- | ------- |
| 1   | ☑️       | `localhost,127.0.0.1`        | –           | Do the libraries use **Proxy A** from the environment variables?  |
| 2   | ☑️       | `localhost,127.0.0.1`        | ☑️          | Does the explicit **Proxy B** win against the environment variables? |
| 3   | –        | – (meaningless without a proxy) | –           | Control run: does everything go directly without a proxy?            |
| 4   | –        | – (meaningless without a proxy) | ☑️          | Does the explicit **Proxy B** work on its own as well?          |
| 5   | ☑️       | **deliberately not set**    | –           | What happens if `NO_PROXY` is forgotten?        |

"Explicit in the test" means: I set the proxy directly for the library, that is

- `proxies=` for the **RequestsLibrary** 
- `proxy=` for the **Browser Library** 

So that I didn't have to run everything by hand, I wrote myself a small script for macOS (Bash) and Windows (PowerShell).  

For each scenario it

- starts both proxies (on macOS as Docker containers, on Windows as local `mitmdump` processes),
- sets the variables for **Proxy A** in the environment, depending on the scenario,
- picks the resource file with or without an explicit **Proxy B**
- and runs the test.

Afterwards it collects the logs of both proxies and records in a summary which traffic went through which proxy.

> So the interesting part wasn't *whether* the test passes, but *which route* it takes along the way.

---

## The results

So what did the two libraries make of it? 

| #   | Proxy env variables (A) | Proxy explicit in the test (B) | RequestsLibrary | Browser Library |
| --- | ----------------------- | -------------------------- | --------------- | --------------- |
| 1   | ☑️       | –           | → **Proxy A**         | –        |
| 2   | ☑️       | ☑️          | → **Proxy B**         | → **Proxy B**         |
| 3   | –        | –           | –           | –           |
| 4   | –        | ☑️          | → **Proxy B**         | → **Proxy B**         |
| 5   | ☑️ (without `NO_PROXY`)    | –           | → **Proxy A**         | –        |

The result was the same on macOS and Windows.  

### Python plays by the rules

Let's start with the native Python part: it concerns the **RequestsLibrary**.  
Internally it uses the Python library `requests`, and that one follows very clear rules:

- As soon as `HTTP_PROXY` and `HTTPS_PROXY` were set, the `RequestsLibrary` directed every call to **Proxy A**.  
- If the variables were missing, the call went directly – with one exception on Windows, more on that in a moment.  
- If `GET` was explicitly given `proxies=`, however, the request went via **Proxy B**, even when the variables pointed to **Proxy A** (scenario 2). The explicitly set proxy wins.

For the `RequestsLibrary` this means: if you already set the variables in the environment, you don't have to do anything else in the test.

```robotframework
*** Settings ***
Library    RequestsLibrary

*** Test Cases ***
Backend Responds
    ${resp}=    GET    https://example.org    expected_status=200
```

If you'd rather specify the proxy explicitly in the test – for instance because the test is meant to run on different machines – you pass it with `proxies=`:

```robotframework
*** Settings ***
Library    RequestsLibrary

*** Test Cases ***
Backend Responds Via Proxy
    &{proxies}=    Create Dictionary    http=http://proxy.example:3128    https=http://proxy.example:3128
    ${resp}=    GET    https://example.org    proxies=${proxies}    expected_status=200
```

`Create Session` accepts the same argument; the proxy then applies to all requests of that session.

One peculiarity showed up on **Windows**:  
In the run with a system proxy configured (Internet Options, i.e. WinINET), the Python request in scenario 3 – that is, entirely **without** proxy variables and without `proxies=` – still went via **Proxy A**.  
**The reason**: if `getproxies()` finds no variables on Windows, it reads the user's proxy settings from the registry. That is handy, but it can be pretty confusing 😵‍💫

**Conclusion for Python:** 

- An explicit proxy takes precedence. Without one, requests follows the environment variables and, on Windows, the system proxy as a fallback. 
- The behaviour is documented and predictable. 
- You only need to know which environment the test actually sees.

### The browser goes its own way

This is where it got really interesting... 

In the runs with environment variables set for **Proxy A**, but without an explicit **Proxy B**, **the Chromium browser still went straight out to the internet** (scenarios 1 and 5). 

**That comes as a surprise. Why is that?** 

👉 **Playwright only starts Chromium with a proxy if you explicitly hand it one.**  

Without `proxy` it starts the browser without the `--proxy-server` flag; Chromium does not evaluate the proxy variables on macOS and Windows.  

I suspect this is deliberate: after all, the browser should behave identically in every test, completely independently of the environment it happens to be started in.


```robotframework
*** Settings ***
Library    Browser

*** Test Cases ***
Home Page Behind The Proxy
    &{proxy}=    Create Dictionary    server=http://proxy.example:3128    bypass=localhost,127.0.0.1
    New Browser    chromium    proxy=${proxy}
    New Page    https://example.org
```

- `server` names the proxy
- `bypass` the hosts the browser should reach directly. This is the equivalent of `NO_PROXY`, just for the browser. 

`proxy=` worked in all runs, regardless of what was in the variables or in the registry.

**My conclusion for the Browser Library:** the only thing that matters is what is passed to `New Browser`. 

## The invisible connection: gRPC and `NO_PROXY`

There is a third network connection that is easy to overlook, because it has nothing to do with the internet at all.   
The **Browser Library** connects via **gRPC** to its Node process on `127.0.0.1` and a random port.

> **Info:** gRPC is a protocol for calls between processes. The Browser Library uses it so that the Python side (the keywords) and the Node side (Playwright) can talk to each other.

This gave rise to a nasty pitfall that many newcomers have got caught in:  
with a proxy configured, the **gRPC** library sends these local connections through the proxy as well.  

Many in the community will know this message:  

`Could not connect to the playwright process`.

As of **Browser Library 20.4.0** this is fixed (GitHub issue: [robotframework-browser#1037](https://github.com/MarketSquare/robotframework-browser/issues/1037)).  
The library now switches the proxy off for its internal channel itself (`grpc.enable_http_proxy=0`).  
In the experiment with Browser Library v20.4.0, the scenario without `NO_PROXY` therefore passed in all runs, on both platforms.

Even so, I'd advise setting `NO_PROXY` to at least `localhost,127.0.0.1`.  
It costs nothing, protects older environments – and keeps other local connections away from the proxy too.  

And if you're still running a version before 20.4.0, that's a good reason for an update. 😊

## The checklist for your next proxy case

The measurements turned into a short list that I now go through on every new project behind a proxy:

- **Browser Library**:
  - always parametrise `New Browser` with `proxy=` / `server` and `bypass`, even if variables or a system proxy are set.
  - at least version 20.4.0 (because of the gRPC proxy problem)
- **RequestsLibrary**:
  - evaluates the environment variables; use `proxies=` if the test is meant to run independently of the environment.
- Set `NO_PROXY` to at least `localhost,127.0.0.1` in every case.
- On Windows, know the system proxy of the executing user, because Python follows it when no variables are set.
- Let the test log its proxy variables. Then, in case of doubt, you can see what was actually used. 

## Special case Robotmk: RCC profiles

If you run Robot Framework with **Robotmk**, you know yet another place for proxy settings: the RCC profile.  
RCC builds the Python/NodeJS environments for the tests and can be configured for corporate networks via profiles:

```yaml
name: companyproxy
description: RCC proxy profile for the corporate proxy
settings:
  certificates:
    verify-ssl: true
  network:
    no-proxy: 'localhost,127.0.0.1'
    https-proxy: 'http://proxyuser:s3cr3t@proxy.example:3128'
    http-proxy: 'http://proxyuser:s3cr3t@proxy.example:3128'
  meta:
    name: companyproxy
    description: RCC proxy profile for the corporate proxy
    source: Robotmk
```

The obvious assumption is that this also configures the proxy for the test.

In reality, the proxy settings in the RCC profile only ensure 

- that RCC fetches its **installation files** through this proxy,
- that processes started within the RCC profile see the **variables** `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY`. 

As shown above, however, the environment variables only have an effect if the libraries actually evaluate them (= only the case for the RequestsLibrary).

Two details are nevertheless important for Robotmk users:

- **`rcc task script` inherits the environment of the caller.** Without a profile, RCC sets no proxy variables, but it doesn't remove any existing ones either. Variables from the scheduler or from the system therefore do arrive in the test.
- **`rcc ht vars` only shows what the profile sets.** Inherited variables don't appear there. If you use it to check which proxy takes effect in the test, you may well be seeing only half the truth. Logging the variables in the test is the more reliable route here too.

## Reference: proxy with authentication

Many corporate proxies require a username and password. This doesn't change the route the requests take, but every place expects the credentials in a different form. All variants worked in the experiment.

**Environment variable** (and therefore RequestsLibrary without `proxies=`): credentials in the URL.

```text
HTTPS_PROXY=http://proxyuser:s3cr3t@proxy.example:3128
```

**RequestsLibrary with `proxies=`:** in the URL as well.

```robotframework
*** Settings ***
Library    RequestsLibrary

*** Test Cases ***
Backend Via Authenticated Proxy
    ${proxy}=    Set Variable    http://%{PROXY_USER}:%{PROXY_PASS}@proxy.example:3128
    &{proxies}=    Create Dictionary    http=${proxy}    https=${proxy}
    ${resp}=    GET    https://example.org    proxies=${proxies}    expected_status=200
```

**Browser Library:** dedicated `username` and `password` fields in the `proxy` dictionary.

```robotframework
*** Settings ***
Library    Browser

*** Test Cases ***
Home Page With Proxy Authentication
    &{proxy}=    Create Dictionary    server=http://proxy.example:3128    bypass=localhost,127.0.0.1
    ...    username=%{PROXY_USER}    password=%{PROXY_PASS}
    New Browser    chromium    proxy=${proxy}
    New Page    https://example.org
```

**RCC profile:** like the environment variable, the URL with credentials in `http-proxy` and `https-proxy`. RCC passes them on to Python unchanged.

## Conclusion

These settings are really only awkward as long as you don't know them properly.  

And as of today I can once again say with full conviction: "*It's always DNS*."  😄
