---
draft: false
title: "RoboCon 2026 - Recap (Thu, Conference day 1)"
# --- Italic subheading
# lead: 
# -- giscus id to match comments
commentid: robocon26-recap-2
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
thumbnail: "img/robocon.png"
vgwort: https://vg04.met.vgwort.de/na/c01978edca3a4e5b8ef7fa7757eb717e
translationKey: "robocon26-recap-2"
---

This is **Part 2** of the three-part review of RoboCon 2026 in Helsinki.


<!--more-->

---

➛ Back to **[Part 1 (Tuesday/Wednesday, Workshop & Community Day)]({{< ref "/robocon26-recap-1/" >}})**  
➛ Continue to **[Part 3 (Friday: Conference Day 2)]({{< ref "/robocon26-recap-3/" >}})**

---

![alt text](img/welcome.png)


## Thursday: Conference Day 1

### Keynote: Community in the age of AI


{{< portrait src="img/miikka.png" alt="Miikka Solmela" >}}

**Miikka Solmela**, Executive Director of the Robot Framework Foundation, opened the conference and his keynote with a question: **What impact does artificial intelligence have on the development of the community?**

The graph Miikka presented was worrying: traffic to the Robot Framework homepage is declining.  
Although no specific data from Slack is available, it seems reasonable to assume that a similar trend is continuing there. 

The reason: before AI existed, we searched for solutions differently – today, the "solution" is just a prompt away. 
There is a danger that people will no longer discuss problems with each other, but will turn directly to AI. 

But working on a challenge is part of the learning process.  
Dialogue with others, the joint struggle to find solutions – this shapes understanding in a way that an immediate AI response cannot.

Miikka made it clear that he did not want to demonize AI.  

But he urged caution. If we do not use AI wisely, we risk the community as we know it today ceasing to exist. 
**The community is our greatest treasure** – and it could suffer greatly from the unthinking use of AI.

His **message** was a call for conscious use:

- Understand AI as a tool, not a substitute for interaction.
- Convenience must not lead us to avoid contact with the community.
- It is the togetherness, mutual learning, challenging and supporting each other that makes the Robot Framework ecosystem strong.

👉 **Conclusion:**  
An opening that gave pause for thought and set the tone for the conference: technology is powerful – but it is up to us to use it in a way that connects rather than isolates.

---

### The RoboCon Effect And The Power Of Contributing

**Gabriela Simion** and **Christoph Singer** (both Imbus AG)

{{< portrait src="img/christoph.png" alt="Christoph Singer" >}}

{{< portrait src="img/gabriela.png" alt="Gabriela Simion" >}}

The presentation told a story that is likely to resonate with the Robot Framework community: **two users become maintainers**.

**Gabriela Simion** and **Christoph Singer** described their personal journey, how attending RoboCon inspired them to not only remain users of Robot Framework, but to become active contributors and ultimately maintainers of the [AppiumLibrary](https://github.com/serhatbolsu/robotframework-appiumlibrary) (see Community Day).  

![alt text](img/talk-robocon-effect.png)

Last year, they took the helm and just released **version 3.0** of the **AppiumLibrary**.


The central message was not new. But it is still urgently needed: RoboCon is more than a series of presentations.  
It is a space where people come together, exchange ideas, discover new perspectives, and **encourage each other to think bigger**.  
That is also my experience: I see RoboCon as a **catalyst** for personal and professional development, which in turn contributes to the Robot Framework ecosystem.

A core idea of the presentation was the **importance of individual participation** – the idea that everyone, regardless of experience or background, can contribute something valuable to the ecosystem.  
This reminded me of Ed Manlove's **"Law of 2 Feet"**: simply move to the places where you can learn and contribute.  
Gabriela and Christoph embody this principle perfectly.

**Gabriela recounted** how she asked a library developer at the beginning: *"How much experience as a Python developer do you need to become a library maintainer?"*  
His answer was concise and encouraging: *"Just start. Start small and learn by doing it."* 

**Christoph's journey** went back further: In 2019, he gained his first experience in library development at the Robocon Community Day with the **WhiteLibrary**.  
When he was later faced with the task of getting the AppiumLibrary maintained with its many open issues, he was unsure whether he was up to the job.  
But Ed Manlove encouraged him and gave him new courage.  
A subtle but important moment: **the community supports itself.**
 
Through their story, Gabriela and Christoph demonstrated the **tangible benefits of community engagement**: an expanded network, consolidation of technical understanding, public recognition, and, last but not least, the deep feeling of being part of something bigger than oneself.

In a question from the audience, when asked how it felt to build the first release, they simply replied: 
> *"Nervous, but indescribable... You're proud to see your name here now."*   

This answer hit the nail on the head of what this talk was all about: **Contributing means belonging.**

👉 **My conclusion:** The talk was a powerful reminder: the real strength of the Robot Framework ecosystem does not lie in any company backing or corporate sponsorship – it lies in **collaboration**, mutual **trust** and the collective effort of the community members.

---

### Let's play a game!

{{< portrait src="img/yuri.png" alt="Yuri Verweij" >}}

Yuri's presentation introduced the interactive elements of the conference, which were organized via the **Gridaly Conference Companion App**.  
The aim was to motivate conference participants to actively participate and network via a gamified system with badges, tasks and robot stickers.  
Participants complete various tasks (e.g. visiting sponsor stands) to collect rewards. The main prize: a free ticket to RoboCon 2027.  

As I was able to represent **Checkmk** as a **gold sponsor** this year, I can confirm that gamification really should not be underestimated.  
It brings people together and gets them talking. I had many very good technical discussions at the Checkmk stand.

![alt text](img/booth.png)

---

### RF-MCP: Say It, Test It, Ship It

{{< portrait src="img/many.png" alt="Many Kasiriha" >}}

In his session, **Many Kasiriha** presented his project ([RF-MCP](https://github.com/manykarim/rf-mcp)) – a solution to a fundamental problem in the use of large language models (LLMs) in test automation: their tendency to "hallucinate", i.e. to invent non-existent keywords/libraries or generate logically incorrect test steps.

**RF-MCP** allows users to write a test scenario in prose and receive executable Robot Framework tests in return.  
Something magical happens in between: each generated test step is actually executed and verified by the MCP server using Robot Framework before the final code is created.  
This ensures that the AI only uses **validated keywords** that actually exist in the project's available libraries and resources –  and that the end result is automation code that actually runs.  

RF-MCP now supports keywords from

- Browser Library + SeleniumLibrary
- AppiumLibrary
- RequestsLibrary
- DatabaseLibrary
- Django-based web frontends

👉 **Conclusion:**  
I have not yet encountered anyone who is already using the MCP server productively for test creation.  
But that should not obscure one thing: **Many has done some real pioneering work here**, and this is just the beginning of a major development that cannot be stopped.   

Anyone who believes that AI will "never" be able to write tests as well as a human being may be proven wrong in a few years' time.

Of course, I too wonder where all this will lead.  
But the best answers to such questions can be found by approaching the subject with an open mind.  

In the words of Wayne Dyer:

> *"If you change the way you look at things, the things you look at change."*

**Stay open-minded and curious!** 😉

---

### Can AI help us find bugs in Robot Framework faster?

{{< portrait src="img/fabian.png" alt="Fabian Streitel" >}}

**Fabian Streitel** has been advising his clients on test automation for over ten years. He presented a fascinating approach to a problem familiar to many teams with large test suites: How can you provide **feedback as quickly as possible** when the complete **test execution takes hours or even days**?

The core idea of his presentation: instead of running through the entire test suite, tests are clustered and those that are furthest apart in a vector-based space are selected for execution – a kind of "intelligent smoke test" 😉  

![alt text](img/talk-3d.gif)

This prevents the test routines from repeatedly running through redundant paths in the code while other areas remain untested.

Fabian showed how he had used **mutation testing** to deliberately introduce hundreds of bugs into the Robot Framework source code (as a test rabbit) – a controllable test scenario to prove the effectiveness of his approach.  


---

### Traceable Automation in Space Projects

{{< portrait src="img/bruno.png" alt="Bruno Néstor Calvo Chevillat" >}}

{{< portrait src="img/jose.png" alt="José María Martín Blázquez" >}}

The title alone caught my attention! 🪝 😅  

In a highly regulated environment where every mistake can have catastrophic consequences, test automation requirements go far beyond typical web or app scenarios.

![alt text](img/talk-gmv.png)

Bruno and José showed how they established Robot Framework as a central element of their test automation, closely integrated with requirements management tools such as **IBM DOORS**.  

The challenge was to create **bidirectional synchronization** between requirement definitions, test procedures and their implementation. This allows each individual automated test case to be traced back directly to a specific requirement – a **consistent chain of traceability** that is absolutely essential in safety-critical systems such as space travel.

The presentation highlighted not only the technical integration, but also the organizational conventions that are naturally indispensable in such an environment.  
Fortunately, Robot Framework meets the regulatory standards and strict requirements of the aerospace industry for documentation, tagging and reporting.  

The speakers also openly shared their **lessons learned** – from pitfalls to specific recommendations for others who want to introduce automation in regulated or safety-critical industries. It was clear that both speakers were drawing on years of experience. 

👉 **Conclusion**: The presentation made it clear that the simplicity and extensibility of Robot Framework is by no means limited to simple scenarios – quite the contrary.  
With the right discipline and a well-thought-out framework, Robot Framework can be used to build robust, traceable automation even in the most demanding technical environments. It is rare to gain insight into such sensitive, highly secure areas. 

---

### Keyword-Driven Performance Testing Without Manual Scripting

{{< portrait src="img/rakan.png" alt="Rakan Alrasheed" >}}

{{< portrait src="img/abdulelah.png" alt="Abdulelah Alharabi" >}}

The two speakers presented an innovative architecture that addresses an often overlooked problem: the separation between functional tests and performance tests. Their approach eliminates this gap by establishing Robot Framework as the **"source of truth"** for both test scenarios.

The core idea: functional test scenarios that are already defined in Robot Framework are automatically translated into [Locust](https://locust.io) scripts – a powerful, Python-based load testing tool.  
What normally requires manual scripting and specialized knowledge is replaced here by a keyword-based, intent-driven system.

The presentation made it clear that the reusability of test definitions is an often underestimated lever.  
When teams can use their functional tests as the basis for performance tests, it not only creates efficiency – it also creates a closer integration between quality assurance and performance engineering, which is indispensable in modern development cycles.

---

### Automated Accessibility for "Very Busy" Teams


{{< portrait src="img/lalit.png" alt="Lalitkumar Bhamare" >}}

{{< portrait src="img/affaf.png" alt="Affaf Malik" >}}

**Over 90%** (!) of the million most visited websites have **accessibility issues**.  
This is not only a technical problem, but also a business, legal and ethical one: users who rely on assistive technologies encounter barriers on a daily basis.   

This is not because teams necessarily want to ignore the issue of accessibility. Rather, it is because they simply do not have the capacity, budget or, in some cases, the specialized knowledge to carry out comprehensive manual testing.

Affaf and Lalitkumar presented a **"shift left" strategy** (where "left" = "earlier") that anchors accessibility testing **at the very beginning** of the development cycle.  
In their approach, this is divided into three levels:

- At the **development level**, problems can be identified before automated tests are even written. Developers can identify and correct violations such as missing "alt" texts or incorrect ARIA attributes directly during coding. 
- At the **testing level**, Robot Framework seamlessly integrates tools such as [axe-core](https://github.com/dequelabs/axe-core) and  into functional and regression tests. Accessibility checks should thus become part of daily testing – without additional manual effort.
- At the **process level**, the tests are integrated into CI/CD pipelines. Detected issues can be automatically tracked and linked to development tasks, enabling continuous validation and preventing regressions before deployment.

The central message of the session was clear: accessibility automation is not just a tool for detecting violations – it deserves a **sustainable system** in which technology actively supports diversity and usability.  

But the two also highlighted the downside: "*accessibility can backfire*" if it is implemented incorrectly or if automated checks convey a false sense of security without taking the actual user experience into account.  
All too easily, the issue is simply ticked off the list – and years later, hardly anyone can remember the framework conditions. 

---

### Automation with Image Recognition Libraries

{{< portrait src="img/Helio2.png" alt="Hélio Guilherme" >}}

**Hélio Guilherme** is an expert in the field of image-based test automation. He has been working with Robot Framework since 2008 – initially at Nokia Networks in Lisbon – and is now Lead Developer and Maintainer of the Robot Framework IDE [RIDE](https://github.com/robotframework/RIDE/) as well as Maintainer of the [SikuliLibrary](https://marketsquare.github.io/robotframework-SikuliLibrary/).  
With a wink, he describes himself as someone who doesn't know whether he is "*a software tester who likes to do software development, or a software developer who likes to do software testing*". 😉

His session offered an in-depth **comparative analysis** of two prominent image recognition libraries for Robot Framework: **SikuliLibrary** and **ImageHorizonLibrary**.  
These libraries are indispensable for desktop testing when API-based technologies are not available – for example, with legacy UIs or RDP/Citrix connections.

![alt text](img/talk-helio.png)

#### Sikuli

[SikuliLibrary](https://github.com/MarketSquare/robotframework-SikuliLibrary) is based on the Java framework SikuliX and uses [Robot Framework Remote](https://github.com/robotframework/RemoteInterface) to connect Python functions with the Java libraries.  
A key advantage: it offers **Optical Character Recognition (OCR)** – text recognition directly from images.  

The workflow: import library, *start server*, define path to reference images, start Application Under Test (AUT), perform interactions (mouse, keyboard, image comparison, OCR), *stop server*.  
It is generously equipped with **78 keywords**. The catch: you need a Java Runtime Environment in your system. 

#### ImageHorizonLibrary

The [ImageHorizonLibrary](https://github.com/eficode/robotframework-imagehorizonlibrary), on the other hand, relies on native Python modules such as `pyautogui` and optionally `opencv-python` for more precise image recognition (which also allows a percentage "similarity" value).  
It is leaner – **34 keywords** – and does not include OCR functionality.  
The big advantage: no Java overhead, direct use possible. The workflow is similar to that of the SikuliLibrary, only without the server component.

#### Comparison

Both libraries are **operating system independent**, but require consistent screen resolutions for reproducible tests.

> *Note from my experience: the primary problem with image recognition is not **resolution**. An 80x30 pixel button has these dimensions on an 800x600px display as well as on a 4K display – it remains 80x30 pixels.  
What has a much greater influence on test stability is how the application changes its **layout under different resolutions**, or rather, space conditions.  
This is because certain navigation elements may be hidden for space reasons, for example.*

Hélio emphasized that the choice of library depends on the specific use case: Do you need text recognition from screenshots? Then SikuliLibrary. Are you looking for lean, purely Python-based image comparisons? Then ImageHorizonLibrary.

One critical point Hélio addressed: The **future of SikuliLibrary** depends on the underlying SikuliX project, whose maintainer has paused development.  
Unfortunately, the fully Python-integrated version **sikulix4python**, which author Raimund Hocke wanted to develop, has also come to nothing. 

👉 **Conclusion**  
What made me particularly happy: On Tuesday, I had the pleasure of meeting **Jhoiss Baloi**, who **forked** the no longer maintained ImageHorizonLibrary and has since **further developed** it.  
He even integrated my [pull request for edge detection](https://www.robotmk.org/en/blog/imagehorizon-edgedetection/) and announced that he would release the library under a new name.  
This is great news for everyone who relies on this lean, Python-based solution!  
Personally, I find the Java foundation of the SikuliLibrary too extensive, so I am very happy about this development.


---

### Integrating Robot Framework into your business strategy

{{< portrait src="img/markus.png" alt="Markus Stahl" >}}

Markus Stahl's presentation addressed challenges that many companies are familiar with:

- How can an open-source tool like Robot Framework be integrated into traditional evaluation processes in companies?
- Especially when there is no company behind it that offers enterprise support?
- How can you mitigate the risks of adopting a free tool whose ecosystem is based on a multitude of other free projects?

Markus presented a **five-step plan** that shows companies how they can not only use Robot Framework, but also strategically integrate it into their business model – while contributing to the ecosystem for their own direct benefit.

**Step 1: Fund the project (Fund it)**  

The question often arises very early on: *Who actually pays for the maintenance and further development of Robot Framework?*  
Markus explained how the [Robot Framework Foundation](https://robotframework.org/foundation/) works and where the money is invested – about two-thirds of the conference costs are covered by the Foundation, with the rest coming from ticket sales.  
The challenge: convincing companies to become members is no easy task. Traditional added value such as SLAs or premium support is lacking. In addition, the roadmap is defined by the community and the project's purpose, not by paying members. Not all "decision-makers" understand this.

**Step 2: Contribute a tool/extension (Contribute a Tool/Extension)**  

At some point, you will find yourself programming an extension.  
Companies can publish useful tools they have developed for themselves as open source – prominent examples are [PlatynUI](https://github.com/imbus/platynui-sut), [RoboSAPiens](https://github.com/imbus/robotframework-robosapiens) and [KeyTA](https://pypi.org/project/robotframework-keyta/1.0.10/).  
The risk: if no external contributors are found in the medium to long term, the company will have to permanently commit resources to a non-core business project. Consulting firms tend to have a greater incentive here.

**Step 3: Contribute a feature**  

Instead of developing an entire tool, you can also implement specific missing functions in the RF core and submit them as a pull request.  
An example: **German Air Traffic Control** paid for and had the RobotFramework feature [custom test metadata](https://github.com/robotframework/robotframework/issues/4409) implemented.  
Such projects are also ideal for promoting young talent – junior developers gain valuable experience with open source.

**Step 4: Offer support**  

Companies can offer professional support for open source tools that they or their customers depend on.  
Services can include tool mirroring and the provision of emergency fixes within the framework of SLAs.  
These fixes should then be fed back into the original project as a contribution.  
Markus emphasized that new regulations such as **DORA** and **CRA** should be taken into account here.

**Step 5: Be open about it**  

The final, often underestimated step: **communicate openly** that you use and support open source.  
Being proud of your own involvement inspires others and strengthens the ecosystem.

Markus used the attention at the end of his presentation to promote a **new open source governance working group**, which aims to gather the expertise of the community and establish recommendations for Robot Framework and ecosystem projects.

👉 **Conclusion**  
The presentation was an **inspiring encouragement** for anyone who wants to convince their employer to invest more in open source. It offered concrete, practical ways to do so.  
The message was clear: there are more options than just "sponsorship" or "sacrificing free time".

---

### Medusa: Resource-aware parallel suite execution made easy

**Edin Tarić**

Edin's session addressed a problem familiar to many teams with extensive test suites: **How can tests be parallelized effectively when there is a risk of resource conflicts?**

**INSYS** is a manufacturer of industrial routers whose software is tested on the devices every day – **1500 tests** that would take **up to 60 hours** to run sequentially!  
This is an untenable situation with daily build increments.  
Of course, parallelization with [pabot](https://pabot.org/) immediately comes to mind. But the team quickly reached its limits here.

![alt text](img/talk-medusa.png)

The **problem**: Many of the test suites require exclusive access to specific resources – such as a particular device in the network, a specific port or physical resources such as DSL connections, which cannot be used multiple times in parallel.  
Pabot with manually written ordering files quickly became confusing and inefficient with over 1,000 tests.  
Attempts to automate the ordering file failed: dynamically avoiding resource conflicts is simply not what pabot was designed for.

**Medusa** was explicitly developed around the idea of **resource dependencies**.  

Each suite declares its resource dependencies as **metadata**, and Medusa automatically determines at runtime which suites can start in parallel – this maximizes time efficiency and avoids conflicts.

In addition to the dependencies, each suite is assigned to a **stage**: Stages are **sequentially executed groups** within which the suites run in parallel as described.  
This allows you to maintain the necessary control over the order where it matters.

Suites can also be executed multiple times with **different variables** – even with different dependencies or stages.  
This significantly reduces code duplication when you want to use a suite for multiple targets or variants.

Technically, Medusa functions as a **wrapper** around Robot Framework: Almost all Robot options are accepted and passed on to the processes that execute the individual suites.  
This means that **listeners, pre-run modifiers** and other extensions all remain usable.  
In the end, Medusa uses `rebot` to seamlessly merge the results of all suites – even with massive parallelization.

👉 **Conclusion**:  

Perfect timing, Medusa was released as open source just in time for RoboCon 2026.  
For anyone struggling with large test suites and resource conflicts, Medusa could be just the solution they've been waiting for.  
A pragmatic approach that addresses a real problem with a well-thought-out solution. I found the system immediately intuitive. 

---

### From Batter to Better: Pancakes as Testing

{{< portrait src="img/kelby.png" alt="Kelby Stine" >}}

{{< portrait src="img/elout.png" alt="Elout van Leeuwen" >}}

**Kelby Stine** and **Elout van Leeuwen** presented one of the most entertaining sessions at RoboCon 2026.  **Pancake baking as a metaphor for test automation** – making abstract concepts tangible in a refreshing way.

The stage was set accordingly: a table with a hotplate, frying pan, ingredients – and both speakers wearing aprons.  

Murmurs from the audience. 

*What's about to happen here?*

![alt text](img/talk-pancakes.png)

The presentation began with a simple confession: 

Both of them love **pancakes**.  

And then they set about preparing the batter using **two different recipes** – each in their own way.  
The different preparation methods were displayed in parallel as **Robot Framework pseudocode** on the screen.  
A brilliant visual idea that clearly highlighted the parallels.

> *Netherlands 🇳🇱 meets the US 🇺🇸 ... Personally, I was more of a fan of Elout's simple recipe – except for the handful of salt he theatrically threw into the dough under the spotlight 😅.  
But that was part of the show, of course, because for safety reasons, no actual cooking was allowed on stage; the dough was purely for demonstration purposes.*

The **core idea** of the session: there are structural **analogies** between cooking recipes and the keyword-driven approach of Robot Framework. The keywords describe abstractly what needs to be done and encapsulate all the details that a tester/pancake cook does not explicitly care about.  

In both cooking and testing, **ingredients**, **environment**, **setup** and **cooking steps** are central.  

Both emphasized: *"Make sure variables are OK. Otherwise, it will break."* – a statement that naturally applies equally to dough and code.  
(Just today, I baked bread myself again and had to think about this while kneading the dough 😉).

Another nice detail: **pancakes are available all over the world** – representing the international community.  
There is no pancake recipe that is better than another – just as there is no automation solution that is best for all scenarios.  

The **tool set** also varies: some rely on parallelisation – visualized by a large hotplate with many pans.  
Others prefer sequential processes.  
Both are legitimate, both have their place.

Finally, the topic of **reporting** was addressed:  
*"HOW WOULD YOU LIKE YOUR TEST RESULTS SERVED?"*  
Various ways of serving pancakes appeared on the screen: with icing sugar, with syrup, with fruit, stacked or individually.  
The message was clear: test results can be prepared and presented in many different ways – depending on the target group and purpose.

It got particularly funny at the end when questions came from the audience – you could tell how the questions were trying to outdo each other:  

*"...When are you taking it to production?"*  
*"...Do you need acceptance testers?"*  

And then **René Rohner** went one better: he critically examined the table and then said dryly:  

*"But it does not seem to be open source – there is no **fork**."*  😅


**Conclusion:**  
The whole thing was entertaining, enjoyable and educational at the same time.  
The session highlighted the **added value of Robot Framework**: namely, that it abstracts the complexity of Python and translates it into a **human-readable language**.  

A wonderful way to convey serious concepts with ease.


---

➛ Back to [Part 1 (Tuesday/Wednesday, Workshop & Community Day)]({{< ref "/robocon26-recap-1/" >}})  
➛ Continue to [Part 3 (Friday: Conference Day 2)]({{< ref "/robocon26-recap-3/" >}})

