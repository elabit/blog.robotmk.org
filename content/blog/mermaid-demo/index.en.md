---
# Internal showcase — must stay a draft (only visible with `hugo server -D`)
draft: true
title: "Mermaid Demo"
lead: "Diagram ideas for existing and future posts"
commentid: "mermaid-demo"
description: "Internal showcase of Mermaid diagrams for the Robotmk blog."
date: "2026-11-12T12:00:00+01:00"
categories:
  - background
tags:
  - internal
authorbox: false
sidebar: false
pager: false
---

Internal page: never publish. Every diagram below is a ```` ```mermaid ```` code fence and can be copied into a post as-is.

**Part 1** contains diagrams derived from existing posts. They use only names, commands and steps that appear in the respective article.
**Part 2** contains fresh ideas with diagram types the blog doesn't use yet. Numbers marked *illustrative* are made up and must be replaced with real data.

Syntax tips:
- Line break in a label: `<br/>`
- Literal `<` / `>` / `"` in a label: `#lt;` / `#gt;` / `#quot;`
- Quote any label containing special characters: `A["label (x)"]`

---

## Part 1: Diagrams for existing posts

### Robotmk v2 quick start (`getting-started`)

**Where:** "TL'DR – what is this actually about?". Shows the four Robotmk components and what flows between them.

```mermaid
flowchart LR
    subgraph CMK["Checkmk server"]
        BR["Bakery rule"]
        CK["Robotmk Check"]
        SV["Services: Scheduler Status,<br/>Plan, Test"]
    end
    subgraph TC["Test client"]
        SC["Robotmk Scheduler<br/>runs RF tests"]
        AP["Robotmk Agent Plugin"]
    end
    BR -->|"baked agent"| SC
    SC -->|"test results"| AP
    AP -->|"agent section"| CK
    CK --> SV
```

**Where:** "Discovery of services". Explains why the Plan and Test services only appear minutes after Scheduler Status.

```mermaid
sequenceDiagram
    participant CMK as Checkmk server
    participant AG as Checkmk agent
    participant SCH as Robotmk Scheduler
    CMK->>AG: Baked MSI installed on test client
    AG->>SCH: Starts scheduler as extension
    Note over CMK: Discover Scheduler Status service
    SCH->>SCH: Phase 1 - build all RCC environments sequentially
    SCH->>SCH: Phase 2 - run plans every 3 minutes (headless)
    SCH-->>AG: Test results
    AG-->>CMK: Agent section
    Note over CMK: Discover Plan service and Test service
```

### Effortless Python Environments with RCC (`rcc-ultimate-tool`)

**Where:** "How RCC works". The Docker analogy side by side: Docker needs one description file, RCC needs two.

```mermaid
flowchart LR
    subgraph Docker
        DF["Dockerfile"] -->|"docker build"| IM["Image<br/>my-workplace"] -->|"docker run"| CO["Container<br/>my-container"]
    end
    subgraph RCC
        RY["robot.yaml"] -->|"environmentConfigs"| CY["conda.yaml"] -->|"rcc task shell"| EN["Isolated Python environment"]
    end
```

### RCC in air-gapped environments (`rcc-envoffline`)

**Where:** "The Solution: ZIP Archive". Which step runs on which machine, and where the ZIP crosses the air gap.

```mermaid
flowchart LR
    subgraph REF["Reference system (internet, same OS/platform)"]
        A["set ROBOCORP_HOME=<br/>C:\robotmk\rcc_home\current_user"] --> B["rcc holotree vars"]
        B --> C["rcc holotree hash conda.yaml<br/>rcc holotree catalogs"]
        C --> D["rcc holotree export<br/>--zipfile webtest-env.zip"]
    end
    subgraph TH["Test host (no internet)"]
        E["C:\env-zip\webtest-env.zip"] --> F["Bakery: Load from ZIP file"]
        F --> G["Scheduler imports catalog,<br/>builds Space"]
    end
    D -->|"copy (manual, Ansible, Salt)"| E
```

### RCC Environments and their Supply Chain (`rcc-env-supplychain`)

**Where:** "The six-step recipe", after "The Big Picture". The recipe is a loop: step 5 can send you back to the build.

```mermaid
flowchart TD
    S1["Step 1: Reference system<br/>(internet, same OS + arch)"]
    S2["Step 2: Build environment<br/>rcc task script --space refbuild"]
    FZ["environment_#lt;os#gt;_#lt;arch#gt;_freeze.yaml<br/>listed before conda.yaml in robot.yaml"]
    S3["Step 3: Grace period<br/>depguard.py grace-check"]
    S4["Step 4: Known vulnerabilities<br/>depguard.py osv-scan"]
    S5{"Step 5: All findings rated?"}
    FIX["Enter fixed version<br/>in freeze file"]
    S6["Step 6: Export<br/>rcc holotree export --zipfile"]
    H["Robotmk hosts<br/>(manual copy, Ansible, NFS share)"]
    S1 --> S2 --> FZ --> S3 --> S4 --> S5
    S5 -->|"upgrade needed"| FIX -->|"rebuild"| S2
    S5 -->|"yes"| S6 --> H
```

**Where:** "Step 5 – Evaluate and decide". Each finding passes through a filter, and CVSS comes last.

```mermaid
flowchart TD
    F["OSV finding"] --> Q1{"Is the package<br/>even installed?"}
    Q1 -->|"no (most npm entries)"| X["Ruled out"]
    Q1 -->|"yes"| Q2{"Test time or<br/>only build time?"}
    Q2 -->|"build time (pip, setuptools)"| X
    Q2 -->|"test time"| Q3{"Does the bot use<br/>this code path?"}
    Q3 -->|"no"| X
    Q3 -->|"yes"| C["Only now: order remainder by CVSS"]
```

### RCC in the CMK Root Agent (`rcc-root-agent-werks`)

**Where:** at the top, before "Act 1". Three seemingly contradictory werks read as one progression.

```mermaid
timeline
    title Werks on root agent and RCC
    3 May 2026 : Werk 19460 : Baking aborts for root agent plus RCC plans
    11 Aug 2026 : Werk 20186 from 2.5.0p12 : Opt-out checkbox Allow agent deployment as root
    2 Sep 2026 : Werk 20190 in 3.0.0b1 : Ban and checkbox removed, inline help instead
```

**Where:** "What does this mean for you?". Turns the version list into a "which case am I?" lookup.

```mermaid
flowchart TD
    V{"Your Checkmk version?"}
    V -->|"2.4.0p33 / 2.5.0p6 to p11"| A["Bake fails with root + RCC"]
    A --> A1["Update to at least p12"]
    A --> A2["Non-root deployment"]
    A --> A3["Conda environments"]
    V -->|"from 2.5.0p12"| B["Tick 'Allow agent deployment as root'<br/>in Robotmk Scheduler (Linux)"]
    V -->|"from 2.4.0p37 / 2.5.0p13 / 3.0"| C["You decide,<br/>inline help gives context"]
```

### RCC Troubleshooting (`rcctrouble`)

**Where:** "Environment creation". Maps an error message directly to its fix.

```mermaid
flowchart TD
    E["Environment creation fails"] --> M{"Which error?"}
    M -->|"micromamba, 0xc0000135"| V["Install VC++ Redistributable (X64)<br/>provides VCRUNTIME140_1.dll"]
    M -->|"SSL error 0x80092012 / 0x80092013"| S["CURL_SSL_NO_REVOKE=1<br/>MAMBA_SSL_NO_REVOKE=true<br/>then restart host"]
    M -->|"Long path support failed"| L["Admin CMD: rcc configure longpaths --enable<br/>or GPO: Enable Win32 long paths"]
    M -->|"cmd.exe not found"| C["sfc /scannow"]
    M -->|"network errors"| P["Proxy profile / whitelist"]
```

### Understanding and Applying Proxy Settings (`proxies-test`)

**Where:** "The results", after the table. Proxy precedence of both libraries side by side.

```mermaid
flowchart TD
    R["RequestsLibrary GET"] --> R1{"proxies= passed?"}
    R1 -->|"yes"| PB["Proxy B"]
    R1 -->|"no"| R2{"HTTP_PROXY / HTTPS_PROXY set?"}
    R2 -->|"yes"| PA["Proxy A"]
    R2 -->|"no"| R3{"Windows system proxy<br/>(WinINET / registry)?"}
    R3 -->|"yes"| SP["System proxy"]
    R3 -->|"no"| D["Direct"]
    B["Browser Library New Browser"] --> B1{"proxy= passed?"}
    B1 -->|"yes"| PB
    B1 -->|"no, env vars ignored"| D
```

**Where:** "The invisible connection: gRPC and NO_PROXY". Shows the third, local connection most people never notice.

```mermaid
flowchart LR
    KW["Browser Library keywords<br/>(Python side)"] -->|"gRPC, 127.0.0.1:random port"| NODE["Node process<br/>(Playwright)"]
    NODE -->|"--proxy-server only if proxy= set"| CH["Chromium"]
    CH --> NET["Internet / proxy"]
    RQ["RequestsLibrary (requests)"] -->|"env vars or proxies="| NET
    KW -. "before 20.4.0: local gRPC sent via proxy<br/>→ Could not connect to the playwright process" .-> NET
```

### CryptoLibrary (`cryptolibrary`)

**Where:** "Generating the Key Pair and Encrypting Secrets". Key and ciphertext travel through Git, but the password that unlocks them never does.

```mermaid
flowchart LR
    subgraph DEV["Development"]
        W["CryptoLibrary CLI wizard"] --> KP["Key pair in keys/<br/>private key + password"]
        W -->|"Encrypt Password123"| CT["crypt:... in<br/>*** Variables ***"]
    end
    subgraph RUN["Runtime"]
        ENV["RMKCRYPTPW"] --> CL["Library CryptoLibrary<br/>key_path=keys<br/>variable_decryption=True"]
        CL --> FS["Fill Secret  $PASSWORD_CRYPT"]
        FS --> F["Login form, no plaintext in log"]
    end
    KP -->|"committed to Git"| CL
    CT -->|"committed to Git"| CL
```

### Game Changer: Secret Variables (`secretvars`)

**Where:** "How do I access secrets?". Three sources, a protected path, and the one place where the protection breaks.

```mermaid
flowchart LR
    CLI["robot --variable<br/>PASSWORD: Secret:..."] --> S["Secret object"]
    VS["*** Variables *** / VAR<br/>${X: Secret}"] --> S
    PY["Python varfile / keyword<br/>Secret(...)"] --> S
    S -->|"passed between keywords"| K["Keywords"]
    K --> LOG["Log: value hidden"]
    K -->|"Python library code"| V[".value used safely"]
    K -. ".value in robot code" .-> LEAK["⚠️ leaks into log"]
```

### Robotmk Starter (`rmk-starter`)

**Where:** "Three Ways to Try It Out". Readers pick a path instead of reading all three sections.

```mermaid
flowchart TD
    Q{"How do you want to try it?"}
    Q -->|"no local install"| W1["Way 1: GitHub Codespaces<br/>RCC preinstalled, env built automatically"]
    W1 --> V["Web tests: noVNC desktop<br/>http://localhost:6080"]
    Q -->|"local IDE"| W2["Way 2: git clone"] --> W2b["rcc task shell"] --> W2c["code . (RobotCode)"]
    Q -->|"terminal only"| W3["Way 3: rcc task shell"] --> W3b["robot suite.robot"]
```

### Robust selectors (`web-selectors`)

**Where:** "Accessible Name: Background". The browser takes the first source that exists.

```mermaid
flowchart TD
    A{"aria-labelledby?"} -- yes --> NA["Text of the referenced element"]
    A -- no --> B{"aria-label?"}
    B -- yes --> NB["aria-label value"]
    B -- no --> C{"Associated label element?"}
    C -- yes --> NC["Label text"]
    C -- no --> D{"Visible text content?"}
    D -- yes --> ND["Visible text"]
    D -- no --> E{"title attribute?"}
    E -- yes --> NE["title value"]
    E -- no --> NX["No Accessible Name:<br/>role= selector fails = real accessibility bug"]
```

**Where:** "In conclusion: The selector ranking". The ranking as a fallback chain.

```mermaid
flowchart TD
    Q1{"Page reasonably accessible:<br/>role + Accessible Name?"} -- yes --> R1["1. role=button[name=#quot;Save#quot;]"]
    Q1 -- no --> Q2{"Developers set data-testid?"}
    Q2 -- yes --> R2["2. data-testid=save-form"]
    Q2 -- no --> Q3{"Visible text usable?<br/>(language-dependent)"}
    Q3 -- yes --> R3["3. text=#quot;Save#quot; (quoted = exact match)"]
    Q3 -- no --> R4["4. CSS/XPath on other attributes or id<br/>(only if agreed with the developers)"]
```

### Accessible Name selectors (`web-selectors-2`)

**Where:** "What I've learnt from this case". The four-question check as a procedure.

```mermaid
flowchart TD
    N["Accessible Name candidate"] --> Q1{"Short?"}
    Q1 -- yes --> Q2{"A term, not a phrase?"}
    Q2 -- yes --> Q3{"Linked to the visible text?"}
    Q3 -- yes --> Q4{"Translated text?"}
    Q4 -- no --> OK["Exact match: role=…[name=#quot;…#quot;]"]
    Q4 -- yes --> V["Use language variables (Part 1 bonus)"]
    Q1 -- no --> CORE["Carve out the invariant core:<br/>technical terms in order"]
    Q2 -- no --> CORE
    Q3 -- no --> CORE
    CORE --> RX["name=/.*emissions.*expected.*surrounding area.*/i"]
    RX --> CH["Too many matches? Chain:<br/>imprecise container #gt;#gt; exact target"]
```

### Edge detection for the ImageHorizonLibrary (`ihl-skimage-pr`)

**Where:** "The strategy edge". The edge strategy only adds a preprocessing step, and `confidence` still applies to both paths.

```mermaid
flowchart TD
    K["Click Image  nicht_speichern"] --> H["1. Screenshot of current screen (haystack)"]
    H --> N["2. Load reference image (needle)"]
    N --> S{"Strategy"}
    S -- "default: pyautogui" --> P["Search needle in haystack"]
    S -- "Set Strategy  edge" --> E["Canny edge detection<br/>on needle and haystack"]
    E --> P2["Compare the edge images"]
    P --> M{"Match ≥ confidence?"}
    P2 --> M
    M -- yes --> C["Click the detected region"]
    M -- no --> F["Image not found: test FAILED"]
```

**Where:** "Canny edge detection in a nutshell". The five steps as a pipeline.

```mermaid
flowchart LR
    I["needle + haystack"] --> S1["1. Gaussian blur (sigma)"]
    S1 --> S2["2. Sobel: brightness along x/y"]
    S2 --> S3["3. Non-max suppression:<br/>1px edges"]
    S3 --> S4["4. Double threshold:<br/>strong / weak / low"]
    S4 --> S5["5. Hysteresis: drop or<br/>attach weak candidates"]
    S5 --> O["Edge images for comparison"]
```

### RF-MCP starter (`rf-mcp-starter`)

**Where:** "MCP: The 'USB standard' for AI tools". The feedback loop that chat mode doesn't have.

```mermaid
sequenceDiagram
    actor U as You
    participant A as AI agent (Claude Code / Copilot)
    participant M as RF-MCP server
    participant R as Robot Framework
    participant T as AUT (Checkmk in the browser)
    U->>A: Prompt from PROMPTS.md
    A->>M: List available keywords
    M-->>A: Keywords of the installed libraries
    loop execute, observe, adapt
        A->>M: Execute keyword
        M->>R: Run keyword
        R->>T: Interact
        T-->>R: Result
        R-->>M: Result
        M-->>A: Result
    end
    A-->>U: cmk.robot (runnable test)
```

### The Helsinki shortcut (`vscode-helsinki-shortcut`)

**Where:** after "The solution". The restart loop next to the loop inside one paused debug session.

```mermaid
flowchart TD
    subgraph OLD["Without the shortcut: stop-and-go"]
        O1["Write keyword"] --> O2["Run test, wait for the browser"]
        O2 --> O3{"Works?"}
        O3 -- no --> O4["Abort, correct, restart"]
        O4 --> O2
    end
    subgraph NEW["Helsinki shortcut"]
        N1["Breakpoint, e.g. on No Operation"] --> N2["Debug Test: execution pauses"]
        N2 --> N3["Write keyword in the editor"]
        N3 --> N4["Alt+D: Evaluate in Debug Console"]
        N4 --> N5["See the result in the browser immediately"]
        N5 -- "next or corrected keyword" --> N3
    end
```

### RoboCon 2026 recap, day 1 (`robocon26-recap-2`)

**Where:** "Medusa: Resource-aware parallel suite execution". Stages run sequentially, suites within a stage in parallel.

```mermaid
flowchart TD
    M["Medusa: wrapper around Robot Framework,<br/>passes on Robot options"] --> META["Each suite declares metadata:<br/>resource dependencies + stage"]
    META --> S1
    subgraph S1["Stage 1"]
        P1["Suites start in parallel<br/>without resource conflicts"]
    end
    subgraph S2["Stage 2"]
        P2["Suites start in parallel<br/>without resource conflicts"]
    end
    S1 -- "stages run sequentially" --> S2
    S2 --> R["rebot merges the results of all suites"]
```

### Browser Batteries (`browser-batteries`, German draft)

**Where:** "Was tatsächlich verschwindet: npm". Two package sources disappear, and the browser binaries still come from the CDN.

```mermaid
flowchart LR
    subgraph VORHER["Bisher: nodejs + rfbrowser init"]
        direction TB
        CF["conda-forge: nodejs"] --> E1["RCC-Environment"]
        PY1["PyPI: robotframework-browser"] --> E1
        NPM["npm-Registry: ~85 Pakete"] -- "rfbrowser init" --> E1
        CDN1["CDN: Browser-Binaries"] -- "rfbrowser init" --> E1
    end
    subgraph NACHHER["Mit Batteries: [bb]"]
        direction TB
        PY2["PyPI: robotframework-browser[bb]<br/>ein Wheel inkl. NodeJS + node_modules"] --> E2["RCC-Environment"]
        CDN2["CDN: Browser-Binaries"] -- "rfbrowser install" --> E2
    end
```

**Where:** "Spart das Platz?". A bar chart instead of two numbers in the prose (file counts taken from the draft).

```mermaid
xychart-beta
    title "Dateien im RCC-Environment"
    x-axis ["nodejs + npm", "Batteries [bb]"]
    y-axis "Dateien" 0 --> 5000
    bar [4780, 2853]
```

---

## Part 2: Fresh ideas

### The Robotmk architecture at a glance

A reusable "big picture" for every post that has to explain where things run. Uses `architecture-beta`.

```mermaid
architecture-beta
    group site(cloud)[Checkmk site]
    group host(server)[Test host]

    service bakery(server)[Agent Bakery] in site
    service check(database)[Robotmk Check] in site
    service agent(server)[Checkmk Agent] in host
    service sched(server)[Robotmk Scheduler] in host
    service rcc(disk)[RCC Holotree] in host
    service app(internet)[Application under test]

    bakery:R --> L:agent
    check:R <-- B:agent
    agent:R --> L:sched
    sched:B --> T:rcc
    sched:R --> L:app
```

### A day in the life of the Scheduler

Makes plan intervals and the environment build phase tangible, for example for a post on plan design. *Illustrative timings.*

```mermaid
gantt
    title Robotmk Scheduler (illustrative)
    dateFormat HH:mm
    axisFormat %H:%M
    section Phase 1
    Build RCC environments      :done, env, 08:00, 6m
    section Plan web-shop (3 min)
    Run 1                       :p1, after env, 1m
    Run 2                       :p2, 08:09, 1m
    Run 3                       :p3, 08:12, 1m
    Run 4                       :p4, 08:15, 1m
    section Plan SAP GUI (5 min)
    Run 1                       :s1, after env, 3m
    Run 2                       :crit, s2, 08:11, 3m
    Run 3                       :s3, 08:16, 3m
```

### From robot result to Checkmk state

A state diagram for a post on thresholds and service states (the exact rules depend on the configured thresholds).

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Scheduled
    Scheduled --> Running: interval reached
    Running --> PASS
    Running --> FAIL
    PASS --> OK: runtime below thresholds
    PASS --> WARN: runtime above WARN
    PASS --> CRIT: runtime above CRIT
    FAIL --> CRIT
    OK --> Scheduled
    WARN --> Scheduled
    CRIT --> Scheduled
```

### Selector types: robustness vs. readability

A summary chart for the selector series. *Positions are an opinion, matching the ranking in Part 1.*

```mermaid
quadrantChart
    title Web selectors
    x-axis Hard to read --> Easy to read
    y-axis Fragile --> Robust
    quadrant-1 Use these
    quadrant-2 Robust but cryptic
    quadrant-3 Avoid
    quadrant-4 Readable but brittle
    Absolute XPath: [0.10, 0.10]
    CSS class chain: [0.30, 0.30]
    text exact: [0.78, 0.38]
    data-testid: [0.55, 0.80]
    role + Accessible Name: [0.85, 0.85]
    name regex: [0.60, 0.70]
```

### The newcomer journey

Shows where it hurts on the way from the first robot to the first alert, e.g. as the intro of a "Getting started, revisited" post. *Scores illustrative (1 = painful, 5 = smooth).*

```mermaid
journey
    title From first robot to first alert
    section Develop
      Install RCC: 3: Developer
      Write first suite: 4: Developer
      rcc task shell + robot: 5: Developer
    section Deploy
      Bakery rule: 3: Checkmk admin
      Bake and install agent: 4: Checkmk admin
    section Operate
      Service discovery: 5: Checkmk admin
      First CRIT alert: 5: Developer, Checkmk admin
```

### The Robotmk ecosystem as a mind map

A navigation aid for the blog or the start page, built only from topics the blog already covers.

```mermaid
mindmap
  root((Robotmk))
    Checkmk
      Agent Bakery
      Scheduler
      Robotmk Check
    RCC
      Holotree
      Offline ZIP
      Supply chain
      Proxies
    Libraries
      Browser Library
      ImageHorizonLibrary
      CryptoLibrary
      RequestsLibrary
    Tooling
      RobotCode
      RF-MCP
      Robotmk Starter
```

### Runtime trend with thresholds

A line chart for a post on performance monitoring with Robotmk. *Illustrative data.*

```mermaid
xychart-beta
    title "Test runtime in seconds (illustrative)"
    x-axis [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
    y-axis "seconds" 0 --> 30
    line [12, 13, 12, 18, 24, 14, 12]
    line [20, 20, 20, 20, 20, 20, 20]
    line [25, 25, 25, 25, 25, 25, 25]
```

### Where the OSV findings end up

A Sankey diagram as the punchline of the supply chain post's step 5. *Illustrative numbers. Replace them with a real scan.*

```mermaid
sankey-beta
OSV findings,Not installed,60
OSV findings,Installed,40
Installed,Build time only,18
Installed,Test time,22
Test time,Code path unused,14
Test time,Rate by CVSS,8
```

### The freeze file as a Git workflow

How the supply chain recipe could look in Git, e.g. for a follow-up post. *Illustrative.*

```mermaid
gitGraph
    commit id: "conda.yaml"
    branch refbuild
    checkout refbuild
    commit id: "freeze.yaml"
    commit id: "grace-check ok"
    commit id: "osv-scan: fix pin"
    checkout main
    merge refbuild tag: "env-2026-11"
    commit id: "holotree export"
```
