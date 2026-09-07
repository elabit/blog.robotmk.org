---
draft: true
title: "RCC in the Root Agent - the Details"
# --- Italic subheading
lead: "What you need to watch out for when you build RCC environments with a root agent on Linux."
# -- giscus id to match comments
commentid: rcc-root-agent-werks
# -- predefined URL
# slug:
# -- for posts in menubar, use this (shorter) title
# menutitle:
#description:
date: "2026-09-07T10:00:00+02:00"
categories:
  - background
tags:
  - robotmk
  - rcc
  - checkmk
  - agent
  - linux
  - environments
authorbox: true
sidebar: true
pager: false
#menu: main
#weight: 10
# --- must be in the leaf bundle folder or static
#thumbnail: "img/title.png"
vgwort:
translationKey: "rcc-root-agent-werks"
---

If you have been following the Checkmk werks on **Synthetic Monitoring** over the past few months, you may well have done a double take.  
Within four months, three werks appeared that at first glance seem to contradict one another.

So do you have to move your Linux agents to non-root now? This article explains the background, the chronology of the werks, and where things stand today.

<!--more-->

---

## Act 1: Permissions under /opt

*(Werk [#19460](https://checkmk.com/werk/19460), 3 May 2026, Bug Fix, incompatible)*

At the beginning there was a very concrete, very unpleasant problem - and it had nothing to do with Robotmk itself, but with **RCC**, the tool that builds the Python environments for your Robot Framework tests.

RCC keeps its environments, caches and other data in a **base directory** of its own.

> **Info:** RCC determines its base directory (`ROBOCORP_HOME`) depending on the user executing it. For regular users this is always inside the home directory.  
> When RCC runs **as root**, however, the default on Linux is `/opt/robocorp`.

And this is exactly where some odd behavior was observed on SLES: if that directory did **not yet exist** and RCC created it as root, it modified the permissions of the *parent directory* `/opt` along the way.

On many systems, `/opt` is the place where software gets installed.  
On a Checkmk server, for example, the entire site structure lives under `/opt/omd`. If the permissions there get mangled, the site user can no longer reach their own site.  
And if the Robotmk host is used for other things as well (which we generally advise against), the problem can hit other software too.

The reaction back in May was the obvious one: if a combination can cause damage, better not to allow it in the first place.  
Since werk 19460, baking the agent aborts with an error message as soon as a Linux agent package for root deployment is combined with RCC-based plans.  
As a migration path, the werk named two options: move the host to **non-root deployment** (rule *"Customize agent package (Linux)"*) or replace RCC with **Conda environments**.

---

## Act 2: Bypass - the way out?

*(Werk [#20186](https://checkmk.com/werk/20186), 11 August 2026, from 2.5.0p12)*

In practice it soon turned out that for customers with custom plugins, automations and test scripts that rely on **hard-coded paths** or need a root context for other reasons, the recommendation to switch the agent to non-root was a dead end.

That is why an **"Allow agent deployment as root"** option showed up in August in the *"Robotmk Scheduler (Linux)"* rule, right next to the RCC settings.  
It is disabled by default, and anyone who enables it implicitly confirms: *I have read werk 19460 and I know what I am getting into.*

That was certainly more honest than a blanket ban.  
A checkbox whose only job is to override another restriction is still questionable from a design point of view.

On top of that, the option only appears in the *"Robotmk Scheduler (Linux)"* rule. If you do not use the bakery at all and deploy Robotmk via Ansible, for instance, you never pass that point.

---

## Act 3: Guidance instead of prohibition

*(Werk [#20190](https://checkmk.com/werk/20190), 2 September 2026, currently 3.0.0b1)*

The third step turns the perspective around.

Both the original restriction **and** the bypass checkbox are gone.  
Baking a Linux agent now always works - no matter which user context the agent runs in, and no matter whether RCC is involved.

The ban has been replaced by **inline help**: wherever RCC can be picked as the *Environment Creation Mode*, the note sits right next to it.

In the werk's own words:

> *"...so you can make an informed choice instead of being blocked or having to opt out via a checkbox."*

After all, the actual problem was never "*root plus RCC*" as such, but a very specific side effect when a directory below `/opt` is **created for the first time** **on SLES 16**.  
A ban covering the whole combination would have addressed a fraction of the cases and blocked the rest for no reason.

---

## What does this mean for you?

The most important message first, because it easily gets lost in the chronology of the werks:

**You can stay with the root agent.**

The non-root agent is a good thing... and from a security point of view the better way to go in many environments.  
But it is not a prerequisite for running Robotmk with RCC on Linux.  
Depending on your version, the situation looks like this:

- **2.4.0p33 / 2.5.0p6 to p11:** Baking aborts on root + RCC. Here you either update to p12 or take one of the two routes named in the werk (non-root or Conda).
- **From 2.5.0p12:** The *"Allow agent deployment as root"* option in the *"Robotmk Scheduler (Linux)"* rule lifts the restriction. One checkbox, done.
- **From 3.0:** You make the call, and the inline help gives you the context for it.

---

## My take

At first glance the whole story may look a little like flip-flopping.

The first reflex (**block it**) was absolutely right for a bug that can wreck a production system in the worst case.

That the block turned out to be too coarse is something that, as a rule, only shows up in the field.  
And the fact that it was replaced by something more precise after four months speaks for the process rather than against it.

The new solution does put a certain amount of trust in the admin, of course. Reading the docs (or at least the inline help) has always been a good idea. 😉

How do you handle this?

Are you still running a root agent on your monitored Linux hosts, or did you take the opportunity to move to non-root?

Let me know in the comments.
