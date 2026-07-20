- 
- AI Kurs 

- Use case section: 
  - Web Testing 
  - Citrix 
  - Desktop 
  - API 
- `content/use-cases/citrix/img/citrix.gif` is a placeholder (copy of an existing RCC
  recording, `content/blog/rcc-ultimate-tool/img/windows-rcc-nopython.gif`) — the
  original file named in the task brief (`windows-rcc.gif`) no longer exists in the
  repo. Simon needs to record the real Citrix StoreFront login → app launch → image
  match and replace this file.
- `content/use-cases/web/img/web.gif` is a placeholder (copy of `static/rmka-rec.gif`).
  Simon needs to record the real shop checkout run (add to cart → checkout → order
  confirmation) and replace this file.
- `content/use-cases/sap-gui/img/sap-gui.gif` is a placeholder (copy of
  `static/rmka-rec.gif`). Simon needs to record the real SAP GUI login → transaction →
  dynpro result run and replace this file.
- `content/use-cases/windows-desktop/img/windows-desktop.gif` is a placeholder (copy of
  `static/rmka-rec.gif`). Simon needs to record the real fat-client run (PlatynUI /
  ImageHorizon) and replace this file.
- `content/use-cases/rest-api/img/rest-api-contrast.png` is a placeholder (copy of
  `content/blog/robotmk-v2-is-out/title-news-small.png`). Simon needs to produce the
  real contrast view (Checkmk services all green vs. the failing multi-step Robot
  Framework transaction) and replace this file.
- `content/use-cases/saas/img/saas-contrast.png` is a placeholder (copy of
  `content/blog/robotmk-v2-is-out/title-news-small.png`). Simon needs to produce the
  real contrast view (Checkmk services all green vs. the failing SaaS login test) and
  replace this file.
- Add FAQ: 
  - https://docs.google.com/document/d/14F4ICQFZdKX3msCPhW8OI75lX0sW94PvVxkztt2OzqM/edit?tab=t.0#heading=h.2d2wrc2n8haa
  - https://docs.google.com/document/d/12JYeHwxf0jr6aDn0Qb7xjIpUqnviJIW6n066zK7OBT8/edit?tab=t.0#heading=h.j2xfxxj3653c

### Nav / dead code observation
- The old "responsive menubar crappy" concern was about `layouts/partials/menu.html`.
  The site now uses `layouts/partials/nav.html`, which has a clean hamburger + overlay —
  that concern is moot. `layouts/partials/menu.html` and `layouts/partials/header.html`
  are no longer rendered anywhere and could be deleted as dead code.

### Use Cases follow-ups
- Record the real GIFs/contrast views for web, citrix, sap-gui, windows-desktop,
  rest-api, and saas — see the placeholder-asset notes above for exactly which files
  and which real recordings/screens are needed.
- Phase 2: Mainframe/3270 use case — needs screenshots with cleared usage rights
  before it can be built.
- Simon needs to review the prose and Robot Framework API details on the six
  use-case pages — especially the `rest-api` page's `check_httpv2` reference and the
  `windows-desktop` page's PlatynUI keyword names, which were written without
  verified API knowledge.

### Code blocks (pre-existing, not Use Cases)
- Chroma has no RobotFramework lexer, so ```robot fences in the blog render as plain
  text instead of being highlighted.
- `noClasses:true` bakes Monokai (`#272822`) into every code block as inline style,
  so code blocks don't follow theme tokens.
- Decide whether to set `markup.highlight.noClasses:false` and generate Chroma CSS
  bound to the site's theme tokens.

### Nav (pre-existing, all menu items)
- `nav.html`'s `IsMenuCurrent`/`HasMenuCurrent` check does not set
  `nav__link--active` for config-defined menu entries, so "Use Cases" (and every
  other top-level nav item) never shows an active state on its own page. Broader nav
  fix if desired.
- The Use Cases overview grid (`layouts/use-cases/list.html`) auto-derives its cards
  from `.Pages` front matter, but the nav dropdown children are hand-listed in
  `hugo.yaml` (both `en` and `de` language blocks). They're in sync today, but adding,
  removing, or renaming a use case updates one surface and not the other. Either keep
  both in sync by hand when a use case changes, or generate the menu children from the
  section instead of hard-coding them in `hugo.yaml`.