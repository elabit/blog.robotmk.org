---
draft: true
title: "Browser Batteries: NodeJS Included"
# --- Italic subheading
lead: "A closer look at the batteries-included package of the Browser Library"
# -- giscus id to match comments
commentid: browser-batteries
# -- predefined URL
# slug:
# -- for posts in menubar, use this (shorter) title
# menutitle:
#description:
date: "2026-11-12T09:00:00+01:00"
categories:
  - background
tags:
  - robotmk
  - robot-framework
  - rcc
  - browser-library
  - environments
  - nodejs
  - installation
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
thumbnail: "img/title.png"
# vgwort:
translationKey: "browser-batteries"
---

While researching [RCC Environments and their Supply Chain]({{< ref "/rcc-env-supplychain/" >}}), one of the things I got stuck on was the **robotframework-browser-batteries** package.

Until then, it had flown under my radar: Why would I install NodeJS via a Python package when RCC can install it into the environment anyway?  

If you have the same question in mind, or have never heard of "Batteries" at all, read on.  

In this article, I've summarized what the Batteries package is and when you should use it.

<!--more-->

## Background: Why NodeJS at all?

Unlike many other Robot Framework libraries, the [Browser Library](https://robotframework-browser.org) is not a pure Python package.

The library's keywords (e.g. `Fill Text` or `Click`) are written in Python, but the actual browser control is handled by [Playwright](https://playwright.dev) — a NodeJS library.  

Between these two worlds runs a NodeJS process, which the library talks to via **gRPC**:

    Robot Framework → Browser Library (Python) → gRPC → NodeJS + Playwright → Browser

This has consequences for the environment: To use the Browser Library, you need a NodeJS runtime and the corresponding packages.  
Together with the browser binaries, this easily adds up to more than 700 MB.

> **Info:** gRPC (Google Remote Procedure Call) is a protocol for calls between processes. As a user, you never see it. Through this channel, a `Click` on the Python side is essentially "translated" into a Playwright call on the NodeJS side.

So a test host needs two things: 

1. a NodeJS runtime
2. Playwright's NodeJS packages

Until now, we provided both explicitly via the `conda.yaml` file, as the following example shows:


```yaml
dependencies:
  - python=3.12
  - pip=23.2.1
  - nodejs>=26.13
  - pip:
      - robotframework>=7.5
      - robotframework-browser>=21.0
rccPostInstall:
  - rfbrowser init chromium
```

## The new way: Browser Batteries

Since version 19.9, every major version of the Browser Library comes with a matching "wheel" package that ships the NodeJS runtime and the Playwright packages.

> **Info:** A "wheel" is a Python package format that simplifies installation. It already contains compiled files and dependencies, so no additional installation steps are required.

```yaml
dependencies:
  - python=3.12
  - pip=23.2.1
  - pip:
      - robotframework>=7.5  
      - robotframework-browser[bb]>=21.0
rccPostInstall:
  - rfbrowser install chromium
```

Three things have changed compared to the previous approach:

- `robotframework-browser[bb]`: The `[bb]` extra installs the Python part as before, but also pulls in the matching Batteries wheel.
- `rfbrowser install`: The post-install command is no longer `init`, but `install`. The reason: `init` installed the NodeJS dependencies *and* the browser binaries; `install` only needs to download the browsers, since the NodeJS side is already in place.
- `nodejs=`: This **has to go**. If you leave it in, you end up with two NodeJS runtimes in the environment that get in each other's way. Batteries ships the matching version.

## The comparison 

I compared both approaches in terms of installation and disk usage.

### Disk usage


|                    | conda-forge `nodejs` + `rfbrowser init` | `[bb]` wheel                |
| ------------------ | --------------------------------------- | --------------------------- |
| NodeJS runtime     | 99.9 MB                                 | 95.5 MB                     |
| npm + corepack     | 12.0 MB (1,926 files)                   | not included                |
| `node_modules`     | ~33.9 MB (~2,844 files)                 | 33.9 MB (2,844 files)       |
| **on disk**        | **~146 MB, ~4,780 files**               | **130.7 MB, 2,853 files**   |
| Download           | 34.5 MB + ~85 npm tarballs              | 45.4 MB, one wheel          |

The saving is exactly the npm footprint: **a mere 15 MB.**  
➡️ Disk space is not an argument, either way.

### Installation

The last row of the table hides the real gain, which brings several advantages at once: 

#### Fewer files, fewer downloads

- Without Batteries, the host downloads one conda package **and** around 85 packages from the npm registry.  
- With Batteries, it downloads one (1) file.

This is not only faster, it also means one less internet destination that may need to be whitelisted. 

#### Proxy settings and TLS inspection

In the article [Understanding and Applying Proxy Settings]({{< ref "/proxies-test/" >}}), I already described how much fun you can have with proxies ... 

`npm` is a discipline of its own: `.npmrc`, `strict-ssl`, `cafile`, `NODE_EXTRA_CA_CERTS` – and it shares none of this with pip or conda. 

The Batteries wheel, on the other hand, doesn't even contain `npm`, simply because it isn't needed: The browser download runs via the bundled Node, not via `npx`.

#### Guaranteed NodeJS version

Customers have often asked me which NodeJS version is the right one.  
I tell them quite openly: "I don't know", because I believe it doesn't matter.  

Still, with "Batteries" you can be sure that the right NodeJS version is used. This eliminates an entire category of errors: e.g. strange gRPC behavior after a NodeJS upgrade.


## What you should keep in mind

None of this comes for free. There are three points you should check beforehand:

- **Older platforms drop out:** The wheels are built for **glibc 2.28** (found on Debian 10, RHEL 8, Ubuntu 20.04), Windows 10 / Server 2016 and macOS 13.5. Below that, you won't get the package running.
- **Version lockstep:** The Batteries package ties `robotframework-browser` in *exactly* one version to one NodeJS version. Upgrading just one of them is not possible. (You don't really need to anyway – I just want to have mentioned it.)
- **Responsibility shifts from conda-forge to PyPI**, or rather to the package maintainer of the Browser Library.


## What this means for the supply chain

The following points are only relevant if you consider the article [RCC Environments and their Supply Chain]({{< ref "/rcc-env-supplychain/" >}}) important for you.

**Before:** Thanks to the `package-lock.json` file with exact versions and checksums, the supply chain could be verified down to the individual package at any time. 

**With Batteries**, the situation changes: 

- **On the plus side:** The NodeJS side becomes a single pip-versioned package and thus ends up in the **freeze file** and in the [grace period check]({{< ref "/rcc-env-supplychain/" >}}) – where the npm tree never showed up before. 
- **Keep in mind:** Instead of 84 checksums that npm verifies individually against the lockfile, you now only verify a single wheel hash against PyPI. (Traceability is preserved, though, since the lockfile travels inside the wheel.)

Batteries changes nothing about the **browser binaries** – they still come from a CDN without any checksum verification.

## Conclusion

So we can conclude: Browser Batteries is not a space optimization, but rather an **installation optimization**. It removes npm as the third package manager from the chain, and with it the most fragile step in building an RCC environment.

On a development machine with open internet access, you will hardly notice anything apart from a shorter build time. 

In a corporate network with a proxy, TLS inspection and virus scanners, things will certainly look different.

If you have experience or an opinion on this, I'd be happy to read your comment below the article.
