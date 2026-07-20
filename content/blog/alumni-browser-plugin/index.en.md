---
draft: true
title: "Two worlds, one test: BrowserLibrary and Alumnium.ai"
# --- Italic subheading
# lead: 
# -- giscus id to match comments
commentid: alumnium-plugin
# -- predefined URL
# slug: 
# -- for posts in menubar, use this (shorter) title
# menutitle: 
description: 
date: "2025-05-25T16:00:26+02:00"
categories:
  - "news"
  - "libraries"
tags:
  - "web-testing"
  - "browserlibrary"
  - "alumnium"
  - "ai"
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
thumbnail: "img/alumnititle.png"
vgwort: https://vg04.met.vgwort.de/na/b585b4ab358b4e68a5c5a7f7b592f804
translationKey: "alumni-browser-plugin"
---

**What happens when you combine the precision of the browser library with the power of AI?**

That's exactly what I tried out - and built a plugin that combines two worlds: the established **Robot Framework** [BrowserLibrary](https://robotframework-browser.org) and [Alumnium.ai](https://alumnium.ai).

*Very exciting!*
A test case, controlled only by instructions to an LLM?  
I had to try it out - ***and it worked right away...***



<!--more-->
## Background

Since several years I am working now with the [Browser Library](https://github.com/MarketSquare/robotframework-browser) in all customer projects. 

A true **all-purpose weapon**. 🏹

Last week, I became curious about a Medium article entitled ["From boring scripts to AI-powered magic"](https://medium.com/@scorpian.ameya/from-boring-scripts-to-ai-powered-magic-meet-alumnirobotlibrary-your-robot-frameworks-new-best-9ea25f8311c5) thanks to a reference in the Robot Framework Slack channel.  

The author **Ameya Natu** announced a new library for Robot Framework - the [AlumniRobotLibrary](https://github.com/ameyanatu/alumnirobot).

**What is Alumnium?**

{{< figure src="img/alumnium_icon.png" >}}

> **[Alumnium.ai](https://alumnium.ai)** is a (still experimental) project.  
> It can translate human-readable commands with the help of LLMs (e.g. OpenAI, Anthropic, Google Gemini) into concrete instructions for **Playwright** and **Selenium**.  
> Alumnium is therefore "not another testing framework", but sits on top of these frameworks.



### A first test

It was a weekend.  
The work in the garden was done and the evening was rainy. 🌧️  
So I put the kids to bed and sat down at the Mac to test Ameya's AlumniumLibrary...

The [minimal example](https://github.com/ameyanatu/alumnirobot?tab=readme-ov-file#quick-start) on the library page worked straight away. 👍

Here the Alumnium library is imported and initialized with the settings for the backend used (Playwright) and the AI provider (OpenAI):

```
*** Settings ***
Library    alumnirobot.alumni_robot_library.AlumniRobotLibrary     
...  backend=playwright    browser=chromium     headless=True 
...  ai_provider=openai    ai_model=gpt-4o    api_key=YOUR_OPENAI_API_KEY
```


The test opens a browser window and then passes the directive and the current page context (based on the accessibility tree) to the AI; the library can then use the responses to create actions for the backend (Playwright): 

```
    Open Browser And Init Alumni ${LOGIN_URL}
    Alumni Do enter ${user['username']} into username field
    Alumni Do enter ${user['password']} into password field
    Alumni Do click the login button
    Alumni Check page contains error message
    Alumni Quit
```

### Two libraries, two architectures - two worlds

My naive attempt to use BrowserLibrary in combination with the AlumniumLibrary failed. :-(

The Browser Library communicates with Playwright via an **asynchronous gRPC channel**.  
Each instruction is sent separately to the driver (Playwright/Selenium).

Alumnium, on the other hand, uses the **synchronous** Python interface of Playwright: `sync_playwright.start()` - obviously absolutely sufficient here for AI-controlled sequences.

> **For this technical reason, the two libraries are unfortunately mutually exclusive**; their keywords cannot be used together in a test case.

I wanted to create a solution for that.

---

## Solution


### The best of both worlds: Alumnium as a plugin for the BrowserLibrary

First, I tried to modify the code of the Alumnium library so that it can use the browser launched by the BrowserLibrary.  
However, Alumnium has to be instantiated with the Page object that you get from Playwright.  
An integration in this direction would therefore have required far too much intervention in the browser library.

**Then I remembered something:** with the keyword [Connect To Browser](https://marketsquare.github.io/robotframework-browser/Browser.html#Connect%20To%20Browser) the BrowserLibrary can also automate another "foreign" browser when it was started with the option `--remote-debugging-port=<port>`.  
The library connects to this port (`http://127.0.0.1:<port>`) and can then control the browser via **Chrome DevTools Protocol**. 

So I tried the other direction: I extended the BrowserLibrary via the [Python-Plugin-API](https://marketsquare.github.io/robotframework-browser/Browser.html#Plugins) with the following **Alumnium keywords**: 

- `New AI Browser`: creates a browser instance with an open CDP port to which the BrowserLibrary connects automatically
- `New AI Page`: creates a new page with which Alumnium is instantiated
- AI keywords: 
  - `AI Do`: Execute action
  - `AI Check`: Execute assertion
  - `AI Get`: Read value from the page (to save in a variable)

**And it worked!** 🎉  

Using a Borwserlib plugin, there is only one browser instance.  
Inside the same test, I can control the broweser **simultaneously** by Alumnium (for AI actions) **and** by the browser library (for classic keywords).


### The solution in detail

{{< figure src="img/rf-tests.png" title="The same calculator test with AI (top) and Browserlib (bottom)" >}}

1. with the instruction ***"Calculate the sum of 2 + 2. Then Multiply the result by 12 and then divide it by 6"*** I pass the AI a whole series of instructions.  
After my experiments, I can already tell you that the more individual steps are included, the more precise the instruction must be. (In some cases the test also calculated "*2+2*12/6*" and it failed then).  
2. In the BrowserLib test, each input must be entered accurately, line by line.  
This is longer. But more **precise** and also **faster**. 


{{< figure src="img/alumnium-calc.gif" title="The calculator tests from above in action. Clearly visible: AI takes time..." >}}





---

## Outlook


### Installation and use

In addition to Python and NodeJS, Robot Framework and BrowserLibrary are basic requirements.  
The second line shows the installation of the plugin:

```
pip install robotframework==7.2 robotframework-browser==19.3
pip install robotframework-alumniumbrowserplugin==0.1.4
```

> Replace the version number 0.1.4 with a (probably) more recent one, which you can find at [this link](https://pypi.org/project/robotframework-alumniumbrowserplugin/).

The line `rfbrowser init` known from the BrowserLibrary installation would also load the binaries of the three supported browsers in addition to Playwright.  
Here it works differently: brings its "own" Playwright; its browser (Chromium) is useed by the the BrowserLibrary via the CDP port. Therefore, both commands must be executed:

```
# Initialization of the BrowserLibrary (without loading the browser binaries)
rfbrowser init --skip-browsers
# Initialization of Playwright for Alumnium, installation of Chromium
playwright install chromium
```

**Load the plugin** together with the Browser Library in a .robot file:

```
*** Settings ***
Library Browser plugins=AlumniumBrowserPlugin
```

Start the browser instance:

```
    New AI Browser browser=chromium headless=False
    ...    ai_model=${AI_MODEL}
    ...    api_key=${AI_API_KEY}
```

It is best not to store the three variables in the .robot file, but to pass them to Robot Framrowrk on the command line with `--variable`.  

✨ **Bonus tip**: 

- Store`${AI_MODEL}` in **robot.toml**, e.g. `openai/gpt-4o`
- `${AI_API_KEY}` in **.robot.toml** (this is included in **.gitignore** and not committed to Git)

### Large variety of LLMs

Alumnium supports a wide range of [cloud-based LLM models](https://alumnium.ai/docs/getting-started/configuration/):

{{< figure src="img/aimodels.png" title="AI models supported by Alumnium" >}}

<!-- In addition, it is also possible to specify the URL to a **local, self-hosted LLM**.  -->


### What this really means

To be honest: **I have yet to get an exact opinion on this.**  

Accurate CSS/XPath selectors are unbeatable and guarantee robust tests.  
That's why I've even dedicated a separate module to this topic in my training for Synthetic Monitoring.  

Having the AI translate all test steps from now on is certainly not the solution.

Just start the example project: [https://github.com/simonmeggle/rf-alumniumbrowserplugin-example](https://github.com/simonmeggle/rf-alumniumbrowserplugin-example) and observe the two test cases:

- The **native test** with the browser library whizzes through the same UI 🏎️ in record time
- The **AI test** seems almost meditative 🧘‍♀️ - the AI analyzes the page, thinks about it, generates the appropriate Playwright commands... 💤

👉 However, wisely and selectively used, Alumnium can offer real **added value** for BrowserLibrary. 

A practical **example**:  

➡️ A **product owner** describes a test in natural language.  
➡️ The AI converts this into **executable code** - executable, but not yet optimal.  
➡️ The test automation engineer later translates the test with **precise, high-performance keywords** and **specific selectors**.

**More ideas:** 

- **Early prototyping**: Imagine you have a rough requirement and need to quickly generate executable tests from it
- Help with **complicated DOM structures**: Alumnium can certainly help if certain selectors are very cumbersome to determine (or with workarounds).
- Exploratory test automation**: You describe the goal and let the AI build the click path. (I imagine this would be exciting!)
- **Validation after UI changes**: To quickly check whether the core functions are still available. (⚠️ Be warned though: As a rule, selectors should - and can - be built in such a way that they are update-proof).

Etc... 

---

## Conclusion: is it a gimmick or future?

My [AlumniumBrowserPlugin](https://github.com/elabit/robotframework-alumniumbrowserplugin) is currently still at an early stage - but it works.  

The combination of:

- 🎯 targeted test automation with the browser library
- 💬 Declarative scenario description via AI prompt
- 🧠 and a small architecture hack

...could become a small **gamechanger** for web testing.

I'll be working on it - and look forward to your feedback.  

Thanks to **Ameya Natu** for the inspiration!

🔗 You can find the plugin here: [`robotframework-alumniumbrowserplugin`](https://github.com/elabit/robotframework-alumniumbrowserplugin)  
🔗 And the corresponding demo project here: [`rf-alumniumbrowserplugin-example`](https://github.com/simonmeggle/rf-alumniumbrowserplugin-example)



