---
draft: false
title: "RoboCon 2025 Helsinki Recap"
# --- Italic subheading
# lead: 
# -- giscus id to match comments
commentid: robocon25-recap
# -- predefined URL
# slug: 
# -- for posts in menubar, use this (shorter) title
# menutitle: 
description: null
date: "2025-02-15T11:00:23+02:00"
categories:
  - news
tags:
  - "robocon"
authorbox: true
sidebar: true
pager: false
thumbnail: "img/robocon.png"
vgwort: https://vg04.met.vgwort.de/na/e03f65e0f8354a68a2c6740ec26916a6
translationKey: "robocon25-recap"
---

**RoboCon 2025** is behind me - four days full of **exciting presentations, inspiring talks and new ideas**.  

Now, back home, I'm sorting through my impressions - and there are plenty of them!  

This conference is something special for me every year: nowhere else do I experience a community that **shares** so openly, **discusses** together and  drives new **ideas forward**.  

In this article, I'd like to share my personal **highlights** with you - the talks that had a particular impact on me and the topics that I will definitely be following up on. 

<!--more-->


(So please don't hold it against me if I leave out some sessions or cover them in different detail. There are simply too many impressions for one article!)  

And now: my **RoboCon highlights**! 


## Make Automation Green Again - Experiments with AI supported self-healing

*(Many Kasihira)*

Using a simple to-do app, Many showed a web test that he "sabotaged" after the first successful run by changing selectors - the test failed.  
This set the  stage for the presentation: 

**How can Robot Framework use AI to find a solution on its own?**  

Of course, this is preceded by the question of why this effort should be made at all.  
Many worked this out well: Even solving "simple" problems can take a lot of time:  

- Executing and debugging the test locally  
- Find out why a selector no longer matches  
- Determine a new selector  
- Commit and push changes  
- Redeploy the test  

Such repetitive work is tedious. **So why not get help from an AI?**


{{< figure src="img/many.jpeg" title="Many Kasihira: 'Make Automation Green Again - Experiments with AI supported self-healing'" >}}

He refered to a talk by Pekka Klärck from 2024 in the Open Space, in which Pekka presented the changes in the Robot Framework Listener.  

**Info**: In simple terms, a **listener** is a piece of Python code that "accompanies" the execution of Robot Framework tests and can be attached to certain "hooks".  
Whenever such a "hook" occurs (e.g. `start_test`, `end_keyword`, `end_suite`), the listener may "interpose" and execute the Python code written for this hook.  

**Many's idea**: To use the `end_keyword` hook for failing keywords to:  

- Read the source code of the current page,  
- use an AI to repair the broken selector,  
- re-execute the keyword with the repaired selector.  

Sounds simple at first - and according to Many's own description, he quickly had a first prototype. 

But further challenges soon arose:  

- ⚡️ **Shadow DOM elements:** These are not included in the original page source code.  
Many wrote a JavaScript handler that reloads these elements and reconstructs the complete DOM.  
- ⚡️ **Relevant context for the AI:** The AI gets stuck if the page source code passed as context is too extensive.  
Many developed a filter function to filter out irrelevant components such as graphics, JavaScript code, headers/footers, etc. (His anecdote about "Edgar with the Scissor Hands" made me laugh!)  
- ⚡️ **Quality of the generated selectors:** Initially, the AI generated functioning but extremely complex and fragile selectors. The added value of self-healing would be lost if stable selectors such as `div.summary > a#contact` were replaced by long, error-prone constructs.  

In the revised approach, Many supplemented the selectors determined by the AI with additional suggestions, which he generated locally with `BeautifulSoup` (a Python package for parsing HTML).  
It enriches these alternative selectors with helpful context information such as parent tags or the text of the next sibling element.  

The **context passed to the AI  is thus more precisely tailored to the problem**:  

- Name of the failed keyword  
- Error message of the keyword  
- Faulty selector  
- List of alternative selectors determined by AI and BeautifulSoup  

The task of the AI is then "only" to weigh these suggestions against each other and return the best selector with which the keyword is executed again.  

Although Many's `robotframework-heal` library is still at an early stage, it already looks promising.  

Important to mention: Self-healing is currently **not persistent**.  
This means that although the faulty selector is corrected at runtime, it is not saved in the test case. 
The keyword would therefore fail again with each test run and be repaired by the AI.  

Nevertheless, I am sure that Many has ignited a spark with this proof of concept that will trigger further innovations in the field of "self-healing with AI".  

Many's presentations are practical and extremely instructive. At the end of the article you will find a list of links to more of his talks.  

**Links:**

- [robotframework-heal](https://github.com/manykarim/robotframework-heal)
- Master Thesis: [Enabling Self-healing Locators for Robot Framework with Large Language Models](https://helda.helsinki.fi/server/api/core/bitstreams/631b961a-8642-42ed-9826-3e196eac9cf7/content)

---


## Appium Self-healing for RobotFramework AppiumLibrary

*Eslam Elmishtawy/Mohamed Sedky*

Directly following Many's talk, **Eslam Elmishtawy and Mohamed Sedky** presented a similar approach to implementing AI-powered self-healing in the field of mobile testing.  

In contrast to Many's solution, this is not a separate library, but an extension of the **AppiumLibrary**.  
(The role of the database in which the selectors repaired by the AI are stored remained unclear to me. If anyone has more information on this, please let me know in the comments, thanks).

{{< figure src="img/appium.jpeg" title="Eslam Elmishtawy/Mohamed Sedky: 'Appium Self-healing for RobotFramework AppiumLibrary'" >}}

At the end of their presentation, the two emphasized that their implementation is not yet officially available. 
It currently exists as a **Pull Request (PR)** for the **AppiumLibrary**.  

I hope that their PR can be integrated into the **AppiumLibrary**.  

---


## Optimizing Mobile Testing using AppiumLibrary

*Gabriela Simion / Felix Doppel*

Felix Doppel and Gabriela Simion presented their path to the successful implementation of a test pipeline for the **"Telematics App" of HUK-Coburg**.  
They gave an exciting insight into the **challenges and solutions** from their practice.  

These included:  

- The ever-increasing number of different mobile devices:  
  - ❓ How does the test infrastructure remain scalable to cover Android and iOS devices equally?  
  - ❓ How do you prevent regression tests from growing uncontrollably?  
- The combination of **functional and technical tests** in a uniform pipeline.  
- Integrating complex test requirements into an agile development process.  

{{< figure src="img/appium.jpeg" title="Gabriela Simion / Felix Doppel: 'Optimizing Mobile Testing using AppiumLibrary'" >}}

Initially, the two relied on **Cucumber and Gherkin**, as these tools were already in use at HUK. 
However, it quickly became apparent that this approach did not meet their specific requirements.  

Through their "*successful failure*", they learned to define and prioritize their own expectations more clearly.  
This experience ultimately led to the decision to use **Robot Framework**, which clearly outperformed the other tools tested.  

**HUK chose Robot Framework** because:  

- The **keyword-driven approach** enables a clean separation between platform-specific functions and test logic.  
- The **flexible API** allows easy integration into other tools. Specifically, the test results at HUK-Coburg are transmitted to the cloud-based test reporting tool **Sauce Labs**.  

The following findings from the project were particularly valuable:  

- **Involve stakeholders early on:** Broad coordination from the outset facilitates smooth implementation.  
- **Know the limits of test automation:** Manual tests remain important if the effort required for automation would be disproportionately high.  
- **Test automation is a marathon, not a sprint:** Successful test automation requires long-term maintenance and continuous development.  
- **Maintenance is crucial:** The success of test automation stands and falls with the consistent maintenance and adaptation of the test cases over the entire runtime.  

---

## Dear AI, Which Tests Should Robot Framework Execute Now?

(*Elmar Jürgens*)

In his presentation,**Elmar Jürgens** presented an exciting approach to shortening test times and finding new bugs more quickly. 

**The problem**: Too many redundant tests lead to long runtimes without making troubleshooting more efficient.  
Especially in large test suites, the number of test cases often grows faster than their actual added value for quality assurance.  

{{< figure src="img/elmar.jpeg" title="Elmar Jürgens: 'Dear AI, Which Tests Should Robot Framework Execute Now?'" >}}

His approach is based on the **dissimilarity principle**, a method for the targeted selection of tests that cover as many different areas of the code as possible.  
Instead of always executing *all* tests, only those that provide the **greatest potential gain in knowledge** are executed.  

Specifically, the tests are arranged in a **vector space** that represents their test coverage.  
Each test is represented by a vector that describes which code areas it covers.   
After each executed test, the next test is selected based on the **maximum distance** to the previously tested vector. This creates a **broad coverage pattern** that systematically expands from run to run - without having to execute all tests.  

The process has several advantages:  

- **Reduced run times:** The total number of tests executed decreases without compromising troubleshooting.  
- **Efficiency gain:** Test coverage increases as tests target different areas of the code.  
- **Faster feedback:** Especially in continuous integration pipelines, the process delivers faster results.  

Elmar emphasized that this approach particularly comes into its own when test suites become very large and long runtimes slow down development cycles.  
His conclusion: by cleverly selecting tests according to the dissimilarity principle, **test times can be noticeably shortened** without losing **quality in the search for errors**.  



---

## Utilizing RF Swarm to Execute Performance Testing on PostgreSQL Database Upgrade

*(Omoghomion Oredia)*

Omoghomion's presentation was about how to achieve a smooth database migration to **PostgreSQL 15.4** without performance degradation or unexpected problems.  

The **central question** was: How do you ensure that a PostgreSQL database performs at least as well as before after the update from version 11 to 14?  

Omoghomion had to tackle this challenge when Amazon announced that it would discontinue support for PostgreSQL 11 from February 29, 2024.  
Continued operation would have meant high security risks and potential compliance issues.  

{{< figure src="img/omo.jpeg" title="Omoghomion Oredia: 'Utilizing RF Swarm to Execute Performance Testing on PostgreSQL Database Upgrade'" >}}

**RFSwarm** was used to carry out the performance tests.  
This tool is used for the **parallel execution of robot framework suites** and is therefore ideal for applying a defined load - the actions specified in the suite file - **x times simultaneously** to the system.  

First, the baseline values were determined under version 11 with a realistic load:  

- CPU utilization  
- Read latency  
- Free working memory  

After upgrading to version 14, the tests were carried out again - with **enjoyable results**:  

- Improved query efficiency for complex queries  
- Slight decrease in CPU utilization  
- Stable read latency ("consistency is key")  
- No significant memory issues  

Despite the "happy ending", this success story shows how important this approach was: without the **baselining** carried out beforehand, it would have been impossible to evaluate the performance after the update.  

The role of **Robot Framework**: Thanks to RFSwarm, the entire application spectrum of Robot Framework could be used to achieve a realistic load simulation through parallel test execution. It was precisely this combination of **load tests** and **baseline analysis** that made the migration measurable - and therefore assessable.  

---

## Robot Framework to the Rescue: Replacing EggPlant with a Custom UI-Test Library

*(Rico Feist / Lisa Böttinger)*

In this talk, Rico Feist (Test Automation Team Lead at Deutsche Bahn) and Lisa Böttinger (imbus AG) presented the brand new - not yet officially released - **PlatynUI library** for the **automation of desktop applications**.  

Previously, the team relied on a library for desktop tests that integrated the commercial (and extremely expensive!) tool **EggPlant** into Robot Framework via a wrapper solution.  

{{< figure src="img/platyn.jpeg" title="Lisa Böttinger, Rico Feist: PlatynUI Library" >}}

### Advantages and disadvantages of image pattern-based testing  

Rico first emphasized the **advantages** of image pattern-based testing. Here, the areas to be clicked are determined by comparing previously captured screenshots with the desktop:  

- Non-invasive: the application does not need to be modified.  
- Technology-independent: Also works with legacy software (according to Rico, he has not yet had a case where this approach was not possible).  
- Cross-platform: Windows, Mac, Linux - everything is possible.  

However, there are also serious **disadvantages**:  

- Agnostic behavior: Since the library does not know the application state, this results in "zombie clicks" on inactive components.  
- Focus problems: Windows become inactive, inputs go to nirvana, overlaid windows remain unrecognized.  
- Difficulties with RDP and Citrix connections: Image artifacts can massively interfere with recognition.  
- Complex error handling: Long waiting times require sleeps, loops and manual assertions.  

### Features: Robot Framework First  

Thanks to **Daniel Biehl** (imbus AG), the team was able to develop a completely new library: **PlatynUI**.  
In contrast to solutions like **Sikuli, EggPlant or Ranorex**, PlatynUI was written with a "*Robot Framework First*" approach right from the start.  
A great move!  

The main goals and features of PlatynUI summarized:  

- **Cross-Platform**: Support for Windows, Mac and Linux.  
- No "zombie clicks": clicks only occur if the element is actually clickable - similar to the precondition checks of the BrowserLibrary.  
- **State Awareness**: PlatynUI uses internal assertions to check whether, for example, a click action on a component is even possible.  
- **Universal**: Keywords that can be used as universally as possible, without being tied to specific component types.  
- **Targeted component approach**: Use of the Windows UI Automation API - independent of the visual appearance of the application.  
- **Spy tool**: PlatynUI brings its own tool to create XPath selectors quickly and easily.  
- **Open Source**: The library will be freely available.  

### Object Orientation First  

I would like to emphasize a special feature: PlatynUI makes it possible to describe application windows and their contents with Python classes.  
This offers two advantages:  

- Better **readability**: Access becomes more intuitive ("Ciao, XPath!").  
- Better **performance**: Windows only has to search through a subtree of the window handles. This speeds up window switching in particular.  

### Extensibility  

The architecture of PlatynUI is designed in such a way that it can be expanded in the future to include further recognition mechanisms - for example:  

- Image recognition (similar to Sikuli or ImageHorizonLibrary) as a fallback if the UI Automation API fails.  
- (Maybe?) Edge detection: A technology that I presented myself at RoboCon in 2023 in connection with ImageHorizonLibrary.  

**Why is this important?** Because pure API-based approaches have their limitations:  

- Legacy applications often don't provide full coverage with automation IDs.  
- Some legacy systems do *not support discovery via UIA at all.  
- Citrix or RDP sessions: Here, image pattern recognition remains the only reliable solution.  

### My conclusion: PlatynUI has enormous potential 🧨

PlatynUI takes exactly the right approach: "**Robot Framework First**", extensible and open for different test methods.  
I particularly like the **open architecture** that leaves room for future extensions such as image recognition - a real unique selling point compared to existing solutions.  

I will follow the development of PlatynUI closely and share my experiences and test results with you here.  

{{< figure src="img/platyn.gif" title="Live demo: PlatynUI controlling KeePass" >}}

---

## Deep Dive into Robot Framework Core: Updates and Future Directions

*(Pekka Klärck)*

**Pekka Klärck** (inventor and main developer of Robot Framework) presented the latest developments in version 7.2 and gave an outlook on future plans.  

An important milestone is the introduction of **JSON output**, which is available from version 7.2 in addition to the previous XML format.  
(Contrary to expectations, JSON is generally not really more compact. But it can offer advantages for integrations that prefer or require this format).  

Also new is the `GROUP` syntax, which allows keywords to be - well - grouped together.  
Groups behave in a similar way to user keywords and are particularly interesting for the program-controlled creation of test cases.  
Groups can be named and can therefore be given semantic meanings, which makes them useful for special use cases.  

{{< figure src="img/pekka.jpeg" title="Pekka Klärck: 'Robot Framework Core: Updates and Future Directions'" >}}

Pekka is already in the planning phase for the upcoming **version 7.3**. Some points were already discussed during the **Community Day** on Tuesday.  

A central project is the complete revision of the **User Guide**.  
In future, this will be published in a newly structured form as the **"Robot Framework Manual "**. A glossary and the integration of the API documentation will round off the manual.  


Pekka traditionally concludes his talk with a presentation of developments relating to the Robot Framework ecosystem - here are just a few of them:  

- **RobotCode** has now received the accolade of official robot framework extension for **VS Code** - and has recently become available for **PyCharm**.  
- **Construct**, a development by Franz Haas, makes it easier to work with binary data.  
- **RobotDashboard**, written by Tim de Groot, makes it possible to display test results clearly in dashboards.  
- and many more. 

**My takeaway:** This shows once again how strongly the community works together, what creative ideas are generated and how projects are promoted through the support of the **Foundation**.  

Even though my contribution as a member of the Foundation is only a small component, I am pleased to see that the membership fees provide projects like this with **boost funding** and thus drive innovation in the **robot framework ecosystem**.  

---

## Redefining Automation with Robot F/W: Harnessing AI, LLMs, and Custom Libraries for Next-Gen Testing

*(Siddhant Sunil Wadhwani)*

**Siddhant Sunil Wadhwani** celebrated his **100th stage and lecture anniversary** with his lecture. He specializes in **AI topics** and dedicated his lecture to the diverse **possibilities and approaches to the application of AI in Robot Framework**.  

{{< figure src="img/siddhant.jpeg" title="Siddhant Sunil Wadhwani: 'Harnessing AI, LLMs, and Custom Libraries for Next-Gen Testing'" >}}

In his **live demo**, Siddhant showed a selection of important tools and technologies that make the use of AI in Robot Framework tangible:  

- **Healenium:** A project to implement self-healing test cases  
- **GitHub Copilot:** Support for scripting through AI-supported suggestions  
- **Gemini Code Assist:** Optimization and improvement of existing tests  
- **OpenAI API / LLMs:** Dynamic generation of test cases and test data  
- **Own AI libraries:** Extension of Robot Framework with AI functionalities  

Finally, Siddhant addressed the challenges that arise when integrating AI into test automation processes - from the complexity of implementation to the quality and stability of the generated tests.  

His presentation provided a comprehensive insight into the potential of AI for test automation with Robot Framework and showed in a practical way how these technologies can increase the efficiency and quality of automated tests.  


---

## Infrastructure as code - Yet another super power for your test automation


*(Nils Balkow-Tychsen)*
In his presentation, Nils Balkow-Tychsen showed how **Infrastructure as Code** (IaC) can be used to manage test environments directly from test automation scripts. 

The focus was on his new **Robot Framework Terraform Library** (Lnk see below), which integrates both **Terraform** and its **open source fork OpenTofu** into Robot Framework.
Background: Terraform is **no longer open source** since its acquisition by IBM. This led to the creation of the open source fork **OpenTofu**. 

**What is it good for**?  

Its library opens up **new possibilities** for test management: A common problem with test infrastructures is that they are  set up **once** and then gradually move away from the target state.
With an infrastructure-as-code approach, the same test environment can **always be  set up identically** - without any manual effort.  

This increases the reliability of the test results enormously and at the same time saves considerable costs, as no long-running, unused environments remain.  

(Of course, it must be mentioned that creating a complex infrastructure, such as a Kubernetes cluster, is not done in a minute - rather in 10 to 15 minutes. But if the resulting test results are more meaningful, reproducible and resilient, this effort is more than justified).

Link: [robotframework-terraformlibrary](https://github.com/Nilsty/robotframework-terraformlibrary)


---


## Perfbot - Integrated performance analysis of robot tests


*(Lennart Potthoff)*
In his presentation, Lennart Potthoff presented the results of his bachelor thesis, in which he dealt with the comparability of past test runs with regard to runtimes and performance regressions.   
While the focus in the test environment is usually on the test result, gradual changes in test run times or outliers can also provide important indications of problems.
Its solution, **Perfbot**, extends Robot Framework with the option of archiving and statistically evaluating test runtimes.  
Perfbot works as a so-called `prerebotmodifier` and stores the execution times of tests and keywords in a local **SQLite database**.   

Info: The audience also asked why Lennart had not used a listener: Listeners work in parallel to the test execution and can theoretically also have a negative influence on the performance of the test. In contrast,**prerebot modifiers** have the charnme that they only work after the test execution (when output.xml is written), but still before the logs/reports are generated. 

{{< figure src="img/lennart.jpeg" title="Lennart Pothoff: 'Perfbot - Integrated performance analysis of robot tests'" >}}

For the visualization of the results, Perfbot uses the **Boxplot-Library** and integrates the created diagrams directly into the log.html and report.html. I found the diagrams shown very appealing!  

{{< figure src="img/boxplot.png" title="log.html /boxplot (Source: https://github.com/perfroboter/robotframework-perfbot)" >}}

The "**Testbreaker**" feature is particularly interesting: It sets a test case to "**FAIL**" if the deviation of the current runtime from the median of past test runs exceeds a defined threshold value. This makes potential performance problems immediately visible. Great idea!  

In future, Perfbot will not only evaluate the runtimes of test cases, but also the **runtimes of individual keywords**, which will enable more in-depth analyses.  
For this purpose, Lennart has developed a supplementary tool called **Perfmetrics**. (This is currently still in the prototype stage and has not yet been published).

My conclusion: With Perfbot, Lennart offers a practical solution for systematically recognizing performance regressions in existing UI tests and integrating them directly into the Robot Framework reports.  

Link: [robotframework-perfbot](https://github.com/perfroboter/robotframework-perfbot)


---




## Behavior-Tree-Based Test-Case Specification


*(Noubar Akopian)*
Noubar Akopian presented **RobotBT**, a Behavior-Tree-Library for Robot Framework.  

**Info**: Behavior trees are a structured method for representing complex processes and decisions.  
They break down automation logic into small, reusable tasks (nodes) that are organized in a tree-like structure.  
Each node describes an action, condition or decision - and the tree controls which steps are executed in which order.  

Noubar's aim was to demonstrate the feasibility and benefits of such behavior trees for the specification of test cases.  
The talk was based on his paper "*RobotBT: Behavior-Tree-Based Test-Case Specification for the Robot Framework*", which was published at the 2023 ISSTA conference (link below).

{{< figure src="img/noubar.jpeg" title="Noubar Akopian: 'Behavior-Tree-Based Test-Case Specification'" >}}

**Why is this relevant for Robot Framework?**

Test case specifications in Robot Framework can quickly become **unmanageable** with increasing size and complexity.  
This is where the **BehaviorTreeLibrary** developed by Noubar comes in, which provides behavior tree nodes as robot keywords.  

In a case study with a test suite from **G DATA CyberDefense AG**, Noubar examined the practical applicability of Behavior Trees.  
The developers who worked with RobotBT confirmed improved readability and maintainability of the test cases.  

My conclusion: Behavior trees were not yet in my scope. The presentation was comprehensible and very practical.  
I particularly liked the **before and after comparisons**!  

Links: 

- [RobotBT: Behavior-Tree-Based Test-Case Specification for the Robot Framework](https://dl.acm.org/doi/pdf/10.1145/3597926.3604924)
- BehaviorTreeLibrary](https://github.com/noubar/RobotFramework-BehaviorTreeLibrary)
  
---



## Conclusion

**The RoboCon week in Helsinki flies by every year!** 

I had many interesting discussions, got to know new people and use cases and was able to take away valuable impulses.  

What makes this event so special: the **unique community**. This is where **passion, expertise and helpfulness** 🤝 come together - an atmosphere that simply inspires.  

The varied mix of community day, workshop day and two conference days ensures that there is never a dull moment - plenty of input, exchange and new perspectives are guaranteed.


**Now I'm curious**: Did you also attend RoboCon? What were your personal highlights? Let me know in the comments! 👇



