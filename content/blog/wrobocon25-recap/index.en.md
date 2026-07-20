---
draft: false
title: "My Personal WROBOCON 2025 Recap"
# --- Italic subheading
# lead: 
# -- giscus id to match comments
commentid: wrobocon25-recap
# -- predefined URL
# slug: 
# -- for posts in menubar, use this (shorter) title
# menutitle: 
description: null
date: "2025-10-25T11:00:23+02:00"
categories:
  - news
tags:
  - "wrobocon"
authorbox: true
sidebar: true
pager: false
thumbnail: "img/wrobocon25-title.png"
# vgwort: https://vg04.met.vgwort.de/na/00db99fecd7c44269662d8d6fca0ea8a
translationKey: "wrobocon25-recap"
---

**WROBOCON** is the ‘*little sister*’ of the well-known annual [Robocon in Helsinki](www.robocon.io), but it certainly has nothing to hide.  
On the contrary: with exciting presentations, workshops and an active community, NiceProject has established a format that is entertaining, educational and human at the same time.
  
My personal conference review. 

<!--more-->

On 23 October 2025, the Robot Framework community met for WROBOCON25 – a compact, purely virtual event organised by [Niceproject](https://niceproject.eu) from Poland.
  
Although ‘only’ online, the conference felt super lively – thanks to the *WorkAdventure* format, in which all participants moved around a colourfully designed conference area with avatars.  
This led to spontaneous conversations as soon as people approached each other: the platform then connects people standing close together in a video call.
  
(It's a little unusual at first, but I had a hell of a lot of fun. I met lots of familiar faces again – and got to know some new ones too.)
I actually found the virtual space at Wrobocon even better than at Online Robocon because it wasn't so sprawling.

---

## Welcome with surprise guest

The opening was handled by **Kris** from Niceproject and **Guido** as co-host.  

But the real surprise moment was when **Miikka Solmela, Executive Director of the Robot Framework Foundation**, wasn't just connected remotely, but was standing live in the studio in Poland next to Kris.

![](img/krisguido.png)

---

## ‘Model-Based Testing’ (MBT) with Anne Kramer

**Anne Kramer** opened the series of talks with her presentation on [Model-Based Testing](https://en.wikipedia.org/wiki/Model-based_testing).
Her introduction was very vivid: a tube map as an example of abstraction.
  

Our entire world consists of abstractions – why should testing be any different?

After all, the goal of abstractions is to **model the essentials** and leave out everything else.

She showed the differences between graphical and textual models and emphasised that MBT is also possible with Robot Framework.

She explained how test procedures are described at a ‘high level’ in the YEST tool. The tool automatically generates tests in RF from this.
Although I would have liked to see more concrete RF examples (without the YEST tool), the presentation was a strong impetus to take a closer look at MBT in the context of Robot Framework.

---

## Listeners as a data source: Dirk O. Schweier

With a great deal of technical depth and clear practical relevance, **Dirk O. Schweier** then showed how RF listeners can be used to automatically record test runtimes and transfer them to external tools such as **Neoload**.
  
> A Robot Framework listener is a piece of Python code that allows users to monitor and respond to events during test execution, such as test start, test end, test passed or test failed.
> (Listeners work on the basis of the so-called ‘Observer Pattern’ – a [design pattern of the ‘Gang of 4’](https://en.wikipedia.org/wiki/Design_Patterns).)
> Listeners are used in many scenarios, e.g. to create user-defined logs and reports or to integrate with other tools during or after test execution. They can even be used to intervene in the running test. 

Dirk showed how he arrived at his current approach in two attempts – first, he manually set measurement points using custom keywords to transfer the runtimes of certain sections to Neoload. However, these are interventions in the test code that one actually wants to avoid.

And so he arrived at his second approach: Instead of setting measurement points manually, he uses the listener methods `end_keyword`, `end_test` and `log_message`, which send results to the Neoload API in real time (i.e. before the test ends).  
What I really liked about Dirk's presentation was how he managed to explain the technical background of listeners. That was great.
 
---

## Kacper Borucki: Test your test code!

This presentation was my personal highlight.

Kacper's thesis: **The quality of your software can never be better than the quality of your tests.**

> ‘Is it crazy to write tests for test code? Not at all.’

Especially with Robot Framework, with its low barrier to entry, there is a risk that inexperienced test authors will be let loose on projects that are too large. Then everything is written in Robot Framework syntax, in endlessly nested keyword hierarchies, and finally, functionalities are tinkered with that would not be necessary with a little knowledge of the built-in library.
  
Kacper showed how Pytest can be used to write very effective tests that ensure that keywords can test not only the ‘happy path’ (i.e., that something works), but also the ‘unhappy path’ (e.g., verifying that security and validation mechanisms are working correctly).

His summary in the Gherkin style was not only charming, but also a practical guide on how to design test code professionally. Fortunately, I took a screenshot of it and I hope he will allow me to publish it here – it was simply brilliant: 

![](img/gerkhin.png)


---

## Artur Ziótkowski: Ten Tips and Tricks to Master Robot Framework

**Artur Ziótkowski** provided ten practical tips for the effective use of Robot Framework – from variable management and resource imports to the page object model.

To be honest, I have a different opinion on certain pieces of advice (e.g. his aversion to embedded keyword arguments – I wouldn't leave that as it is across the board – or his strategy for importing resources).

In any case, his ideas were so diverse that I would like to further develop and present my views on this topic in a short blog series.

It was a presentation that definitely made me want to question, evaluate and, if necessary, expand my own toolbox!

![](img/artur.png)

---

## Afternoon workshops

![](img/inspector.png)

In the afternoon, there was an opportunity to experience practical developments from the Robot Framework community live. There were three workshops to choose from:

- A (semi) short history of OpenApiDriver (Robin Mackaij)
- Build Your Web Testing Framework with Browser Library (Jerzy Gtowacki)
- Cross-Platform Desktop Testing with robotframework-platynui (Daniel Biehl)

I took part in the session led by Daniel Biehl, who presented the current development status of his **[PlatynUILibrary](https://github.com/imbus/robotframework-PlatynUI)**.
  
This library enables the automation of desktop applications on Windows and Linux – with a clear focus on Robot Framework.

Daniel pursues a consistent Robot Framework-first approach: instead of building on existing GUI testing tools, he develops the library strictly according to the Robot Framework philosophy.

I was particularly impressed by the element inspector he has developed, which can be used to analyse desktop elements in order to identify suitable selectors. It also has a CLI interface that allows window elements to be ‘catalogued’ for even faster access.  
Disclaimer: a basic understanding of XPath is very helpful here. But Daniel showed that it can be used to work productively very quickly.

According to Daniel, the library is already being used productively in several companies.
The first stable version is scheduled for release at the end of the year.

I am particularly pleased that Daniel will be our guest at our Munich Robot Framework User Group Meeting (RFUGM) in November, where he will once again demonstrate PlatynUI live in action – a must-attend event for anyone who wants to take the next step in desktop automation.

By the way, here is the link to the new homepage where you can sign up for the email newsletter with the latest dates:
**https://rfugm.robotmk.org**

---

## Conclusion & outlook

WROBOCON25 has shown me once again that even a purely virtual event can offer real added value.
The presentations were all very diverse and interesting.
I took away a lot of food for thought from WROBOCON – and can only recommend taking advantage of the many opportunities to gain new input and network with the community.

Events of this calibre not only help us move forward, they bring us together.

