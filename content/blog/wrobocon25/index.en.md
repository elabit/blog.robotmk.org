---
draft: false
title: "Save the date: WROBOCON 2025"
# --- Italic subheading
lead: "Why you should not miss this event"
# -- giscus id to match comments
commentid: "wrobocon25"
# -- predefined URL
# slug: 
# -- for posts in menubar, use this (shorter) title
# menutitle: 
description: 
date: "2025-09-22T07:35:47+02:00"
categories:
  - "events"
tags:
  - "wrobocon"
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
thumbnail: "wrobocon25.png"
translationKey: "wrobocon25"
---

On 23 October 2025, **WROBOCON** will take place again – online and free of charge!  
You should not miss this conference, as the agenda looks very promising.  
👉 My opinion and recommendations regarding the presentations.

<!--more-->

For anyone who works with Robot Framework or is interested in it, [WROBOCON](https://wrobocon.eu) is the perfect opportunity to learn about new developments, tools and best practices – conveniently and without having to travel.  
It can be called the "little sister" of [ROBOCON](https://robocon.io), which takes place annually in Helsinki (there is a separate post about this). 

The event is organised by [Nice Project](https://niceproject.eu), a member of the Robot Framework Foundation.

---
 
## Why attend??

Robot Framework has grown significantly in recent years.  
I probably don't need to mention that artificial intelligence has also provided an enormous boost to innovation in this area...   
One thing is clear: not everything that has sprung up overnight will survive in the long term, but it is already becoming apparent what will survive.  

A lot has also happened outside of AI, and WROBOCON offers an ideal overview of these developments.

--- 

## Agenda

### Anne Kramer: Model-Based Testing

![alt text](kramer.png)

Model-based testing is about automating not only the execution of tests, but also their creation as much as possible. This involves using models that describe this process in a systematic and structured way.  
The **benefit**: uniform and accelerated creation of test cases.  

I am extremely excited about this presentation by Anne Kramer.  
Standardisation is particularly important for larger test environments, but everything starts small.  
The trick is to keep *growing* test environments clear and scalable!

### Dirk O. Schweier: Robot Framework Listener as a Mediator of Metrics

![alt text](schweier.png)

In his presentation, **Dirk O. Schweier** shows how **Robot Framework Listeners** can be used to collect and pass on metrics from test runs. 

> **Listener**  
The Listener API is an often underestimated feature in RF.  
It allows you to "hook in" any Python code during test execution and react to specific events. For example, when a test starts, ends or fails.  
(In other areas, this is also called a "hook").   
This allows additional actions to be performed, such as collecting metrics, creating individual logs or sending notifications.

For me, as an old monitoring fan, this is of course a godsend. 😃   
Collecting metrics from test runs is one of the core functions of [Synthetic Monitoring / Robotmk](https://checkmk.com), for which I work as a product manager at [Checkmk](https://checkmk.com), among other things.  

I am very excited to see what Dirk has built!

### Robot Framework + PyTest, or Why You Should Test Your Tests

![alt text](borucki.png)

What!? *Testing tests*? 🫨

**Yes, absolutely**! Who says your test is doing the right thing?

In his presentation, **Kacper Borucki** shows how **Robot Framework** and **PyTest** can be combined to systematically check test quality.

### Artur Ziółkowski: Ten Tips & Tricks to Master Robot Framework

![alt text](artur.png)

If you are looking for practical tips, don't miss Artur Ziółkowski's presentation.  
He provides concise advice that can be implemented immediately in your everyday work.


**My tip**: be sure to watch it. You can learn so much from talks like this – **it's always exciting to see how others work**!

### Sebastian Kupis: Lessons Learned

![alt text](kupis.png)

The agenda did not reveal any more than "*Details to be announced*". 😄  
However, this talk will probably be similar in nature to Artur's.


### Andrii Khaliavkin: RF-DependencyResolver

![alt text](andrii.png)

Andrii's presentation is sure to be a technical highlight: he will be introducing the **RF-DependencyResolver** – a tool for managing and resolving dependencies in Robot Framework projects.   

**Clean dependency management** is a major challenge, especially in larger projects!

### Robin Mackaij: A (semi)short history of OpenApiDriver

![alt text](robin.png)

Robin is well known in the community, not least because of his recently released [rf-openapitools](https://marketsquare.github.io/robotframework-openapitools/).  
This is a whole set of tools related to the topic of "OpenAPI": 

- **OpenAPILibGen**: A command line tool that allows you to generate Robot Framework libraries from OpenAPI documentation!  😎
- **OpenAPILibCore**: A utility library that facilitates the creation of other libraries for API-based testing. 
- **OpenAPIDriver** (this talk): An extension for the [DataDriver](https://github.com/Snooz82/robotframework-datadriver) library that allows test cases to be generated and executed based on information from an OpenAPI document.

### Jerzy Głowacki: Build Your Web Testing Framework with Browser Library

![alt text](jerzy.png)

**Wow, that sounds promising!**  
Do you use the [Browser Library](https://marketsquare.github.io/robotframework-browser/Browser.html) for web-based testing?  

Then you may be familiar with the problem: your tests work, but the code is more of the "*not pretty, but rare*" kind. 😉  

I know this from my own early days with Robot Framework: often you work exclusively in a results-oriented manner and don't pay any attention to clean structuring of the test code.  
The result: test code that is difficult to read and that no one can or wants to maintain later on. (This is the point where people often say that Robot Framework is complicated 🤪)  

Jerzy will provide some good ideas on how to write test cases in a way that makes them sustainable and scalable.

### Daniel Biehl: Cross-Platform Desktop Testing with robotframework-platynui

![alt text](daniel.png)

I still remember this year's Robocon 2025 well, when Daniel showed us the PlatynUI library on Community Day (see also my [blog entry](https://www.robotmk.org/en/blog/robocon25-unconference/#platynui---promising-approach-to-ui-testing)).

Finally, a library for desktop-based testing – with a "Robot Framework-first approach"!

✅ Cross-platform: Runs on Windows, Mac & Linux.  
✅ Robot Framework First: Uses the native UI Automation API on Windows, without third-party dependencies, completely tailored to Robot Framework.  
✅ No more "zombie clicking": Image pattern-based approaches such as ImageHorizonLibrary often have the problem that they "see" inactive buttons and click on them incorrectly, even though the elements are not active.  
I know this all too well from my many years of experience with ImageHorizonLibrary.  
✅ State-aware: The library recognises whether the UI has actually changed after an action – or whether it is still in a loading state and therefore not yet ready for the next click.

I am particularly pleased that Daniel will also be presenting his library live at the [Munich User Group Meeting (RFUGM)](https://www.linkedin.com/events/7363114016849747969/) in November!

---

## Tips

Even though the conference is online and free of charge, it is still worth being well prepared.  
Here are a few tips that have worked well for me:

- Go through the **agenda**: Don't go into the talks completely unprepared; at least have a rough idea of what they are about. 
- Prepare **questions**: If you have specific challenges, you can ask targeted questions in the chat or Q&A.
- **Network**: Take the opportunity to exchange ideas with other participants – this often leads to exciting contacts and ideas.
- **Be open**: I remember that I used to only listen to the presentations that resonated with me at online conferences. But with this kind of cherry-picking 🍒 , you fall victim to **confirmation bias** – you only confirm what you already know instead of broadening your horizons. **Listen to all the talks**!

--- 

## Conclusion

WROBOCON 2025 is a **must-attend** event, with no costs or travel expenses.  
The only investment is your time – it's worth it!

📅 Date: 23 October 2025  
🌍 Location: Online  
💰 Cost: None  
📋 Information and registration: https://wrobocon.eu


