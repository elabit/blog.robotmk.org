---
draft: false
title: "RoboCon 2026 - Recap (Workshop & Community day)"
# --- Italic subheading
# lead: 
# -- giscus id to match comments
commentid: robocon26-recap-1
# slug: 
# -- for posts in menubar, use this (shorter) title
# menutitle: 
description: null
date: "2026-02-14T10:04:33+02:00"
categories:
  - news
  - events
tags:
  - "robocon"
authorbox: true
sidebar: true
pager: false
thumbnail: "img/gofore-8.png"
vgwort: https://vg04.met.vgwort.de/na/33debf1e67e545deac06b4a01c008dc0
translationKey: "robocon26-recap-1"
---

While waiting for my return flight at the airport, laptop on my knees and still filled with impressions from **RoboCon 2026**, I began sorting through my notes.  
The first draft of this article was written between gate announcements and boarding calls 😉

So here is my *very personal* three-part **review** of RoboCon – shaped by my **impressions**, my **focus areas** and the **topics** that had a particular impact on me.  
Nevertheless, I naturally wanted to convey as much of the "RoboCon feeling" as possible to those who had stayed at home.

<!--more-->


---

➛ To [Part 2 (Thursday: Conference Day 1)]({{< ref "/robocon26-recap-2/" >}})  
➛ To [Part 3 (Friday: Conference Day 2)]({{< ref "/robocon26-recap-3/" >}})

---



I have just spent **four intense days** in Helsinki – full of discussions, new ideas, technical details and inspiring encounters.  
As I do every year, I tried to note down as much as possible on my mobile phone: new names, key ideas, concise statements, spontaneous ideas, open questions.  

Some aspects only become apparent in retrospect, while others seem more important at the time than they appear later.

And yet, this year my collection feels even more complete. Not necessarily exhaustive (unfortunately not with all sessions) – but more structured, clearer, closer to the action than last year.  
Perhaps because I listened more consciously. Perhaps also because I now know better how to get the most out of RoboCon.

**Enjoy reading!**


---

## Tuesday: Workshop "PlatynUI Library"

![screen](img/screen.png)

**Lisa Böttinger** + **Fabian Tsirogiannis** (Imbus AG)

RoboCon follows a proven tradition: the first day is reserved for a full-day workshop. This is a great opportunity to learn directly from professionals and get hands-on experience. For me personally, this has always been a strong reason to attend RoboCon.

This year, the Foundation used the premises of **Haaga-Helia University of Applied Sciences** to hold the workshops.

**Desktop-based test automation** had been a topic of interest to me long before Robot Framework came along.  
However, it only really took off with the integration of Robot Framework into Checkmk, which was made possible by my open source version of [Robotmk](https://robotmk.org).  
Suddenly, many Checkmk customers recognised the potential not only to automate web-based tests, but also to integrate desktop and end-to-end tests directly into monitoring.  
I have been using the [ImageHorizonLibrary](https://github.com/eficode/robotframework-imagehorizonlibrary) for a long time to test graphical user interfaces by comparing images. This is still the only viable option, especially for older UIs that do not export automation IDs, or for **Citrix connections**.

But the newly developed **PlatynUI Library** sets new standards here. Developed by **Daniel Biehl** (Imbus AG) – with significant contributions from the rest of the Imbus team – it addresses an old problem with a completely new approach.

Libraries that access UI elements via the Windows API are not new in themselves (to name just a few: [WhiteLibrary](https://github.com/Omenia/robotframework-whitelibrary), [Zoomba Libary](https://github.com/Accruent/robotframework-zoomba), [FlaUI Library](https://github.com/GDATASoftwareAG/robotframework-flaui), [AutoIT Library](https://pypi.org/project/robotframework-autoitlibrary/)).

However, PlatynUI differs fundamentally in several respects:

- A consistent **Robot Framework-first** approach – without detours via third-party tools
- Support for macOS, Linux and Windows (with a focus on Windows due to Imbus customer requirements)
- A dedicated spy editor for inspecting UI elements
- A well-thought-out philosophy for clicking on elements

The last point deserves special attention.  

Anyone who automates graphical interfaces using image comparison must keep one thing in mind: the test library has *no idea* what it is actually clicking on.  
It acts on the basis of pixel patterns.  
The [ImageHorizonLibrary](https://github.com/eficode/robotframework-imagehorizonlibrary), for example, works as follows: During the test run, the keyword `Click Image  ok_button.png` compares the current screen content (in-memory screenshot) with a previously captured reference image.  
If it is found, the library clicks on the center of the screen in exactly this hit region.  

The principle is mathematically simple, but it has a small **weakness**: the click is based on the assumption that the element will accept the click – in 99% of cases this is the case, but it is not guaranteed.

PlatynUI introduces a separate keyword here: **Activate**.  
At first, the name seemed counterintuitive to me (you don't "activate" a button, you "click" it...).  
But that's exactly the point: the library only clicks on what is actually visible and **clickable**.  
It is an elegant security measure that catches misconceptions early on.

Lisa Böttinger and Fabian Tsirogiannis confidently led the workshop – from `uv`-based environment creation to the installation of dependencies.  
Sufficient time for our own experiments and practical learning rounded off the day.

**Can PlatynUI already be used productively?**  
Daniel answers (as always) with deliberate caution: *"It's still in a very, very early stage."* (now a running joke among IMBUS people 😉)  
So, fundamental things may change again during further development.  
However, **German Air Traffic Control** is already using PlatynUI to test air traffic controller interfaces. This indicates that it is sufficiently mature. Just give the library a try!

I had a customer call just today – the customer definitely wants to implement a desktop test with PlatynUI. Let's get to work!

---

## Wednesday: The "Unconference Day"

![alt text](img/gofore-8.png)

This year, the Unconference Day took place at the offices of **GOFORE** in Helsinki (GOFORE is an international consulting firm for digital transformation).  
A big thank you to GOFORE for simply making its premises available so that working groups could organize themselves freely. That requires a great deal of trust.

**Ed Manlove** welcomed everyone in the morning in the large meeting room on the 8th floor.  
Unconference Day embodies exactly what its name promises: not a rigid, formal conference with pre-determined slots, but a lively, self-organizing event.  
The basic idea comes from Harrison Owen's concept of "[Open Space](https://de.wikipedia.org/wiki/Open_Space)": *"If you are not learning or contributing in a meeting or situation, you have the responsibility to use your own two feet (or wheels) to move to a more productive place."*  
A principle that is reflected in the structure: flexibility, personal responsibility, courage to change.

Ed summed up the concept with four pillars: **Be supportive. Build connections. Look for opportunities. Use your head and your gut. And use your heart.**

**René Rohner**, Chairman of the RF Foundation, moderated the brainstorming session in which topics were collected.  
The **diversity** was impressive: From highly strategic considerations (open sourcing of tools, AI impact on jobs, integration of business perspective into test automation) to specific technical challenges (RoboCop configuration, email testing, Robot Framework with IBM mainframe) – the spectrum clearly showed how broad the Robot Framework community is today.

![alt text](img/cd-agenda.png)

At the suggestion of **Ivo Brüssow** (who himself leads a [user group in Münsterland](https://www.meetup.com/robot-framework-usergroup-munsterland/)), I offered the session "*How to organize user group meetings*".  
Our Munich group ([RFUGM](https://rfugm.robotmk.org)) is still young and small, but I was delighted that so many people took part.  
It was valuable to see which **common challenges** arise everywhere:

- Recruiting new members
- Marketing
- Finding topics
- Time management
- etc.
- 
Ed visited us in between for a photo – but it was perfectly timed: he used the moment to spontaneously open the Slack channel **#usergroup-organizers** ([link](https://robotframework.slack.com/archives/C0AE8RR53V1)). A place where we can exchange ideas in the future.

Then I stopped by the **AppiumLibrary** session.  
Mobile test automation with iOS and Android had been on my list for a long time, but I was too busy with my Robot Framework training material last year.  
The timing is perfect now: **Gabriela Simion** and **Christoph Singer** are the new maintainers and have rolled up their sleeves – [version 3.0](https://github.com/serhatbolsu/robotframework-appiumlibrary) has just been released.  
I want to contribute with my own tests and give them feedback, because maintaining someone else's code is not trivial, and regression bugs can quickly creep in.

Before lunch, I caught the second half of the beginner's workshop on browser libraries. **Igor Czyrski** from NiceProject did this with impressive calm and structure – it was inspiring to see how others approach the topic.

After lunch, I sat in on the session by **Many Kasiriha** – the creator of Robot-MCP. The room was so full that we had to move again, and rightly so: Many has the rare gift of explaining complex things in such a way that you immediately want to learn more. And when it comes to AI, he hit the nail on the head with his [MCP server for Robot Framework](https://github.com/manykarim/rf-mcp).  
The first productive use case for AI-generated tests is probably not yet on the radar, but that shouldn't obscure the fact that Many has done pioneering work here. This is just the beginning of a major movement.

A particular highlight was the exchange with **Tatu Aalto** about a bug in the Browser Library's Assertion Engine: Barely an hour later – I was already on my way to the next location – Tatu wrote on Slack that he had released a new version.  
Fast, cooperative, pragmatic. Thank you, Tatu!  🤗

---

➛ Continue to [Part 2 (Thursday: Conference Day 1)]({{< ref "/robocon26-recap-2/" >}})  
➛ Continue to [Part 3 (Friday: Conference Day 2)]({{< ref "/robocon26-recap-3/" >}})
