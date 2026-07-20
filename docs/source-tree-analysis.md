# Source Tree Analysis: blog.robotmk.org

**Generated:** 2026-06-08

---

## Annotated Directory Tree

```
blog.robotmk.org/                      ← Project root / Hugo project root
│
├── hugo.yaml                           ← Main Hugo config (baseURL, theme, languages, params)
├── DOCUMENTATION.md                    ← Minimal dev notes (Hugo CLI, Giscus link)
├── .gitmodules                         ← Git submodule: themes/mainroad
├── .gitignore                          ← Ignores: public/, resources/, .env, .obsidian
│
├── content/                            ★ All site content (Markdown)
│   ├── .obsidian/                      ← Obsidian vault config (not published)
│   ├── content-db.md                   ← Obsidian DB plugin artifact (not a Hugo page)
│   │
│   ├── _index.{en,de}.md              ← Homepage content (section list root)
│   ├── about.{en,de}.md               ← About page
│   ├── imprint.{en,de}.md             ← Legal imprint (DE: Impressum)
│   ├── privacy-policy.{en,de}.md      ← GDPR privacy policy
│   ├── newsletter.{en,de}.md          ← Newsletter signup page
│   ├── almost-done.{en,de}.md         ← Post-signup intermediate page
│   ├── thanks-for-signing-up.{en,de}.md ← Signup confirmation
│   │
│   ├── blog/                           ★ Blog section (main content)
│   │   ├── _index.{en,de}.md          ← Blog list page title/description
│   │   ├── alumni-browser-plugin/      ← Blog post (leaf bundle)
│   │   ├── checkmk-youtube-recording/
│   │   ├── cryptolibrary/
│   │   ├── getting-started/
│   │   ├── gh-codespace-claude/
│   │   ├── ihl-skimage-pr/
│   │   ├── rcc-envoffline/
│   │   ├── rcc-ultimate-tool/
│   │   ├── rcctrouble/
│   │   ├── rmk-starter/               ← Example: leaf bundle with img/ subdir
│   │   │   ├── index.en.md
│   │   │   ├── index.de.md
│   │   │   └── img/
│   │   ├── robocon25-agenda/
│   │   ├── robocon25-recap/
│   │   ├── robocon25-unconference/
│   │   ├── robocon26-recap-1/
│   │   ├── robocon26-recap-2/
│   │   ├── robocon26-recap-3/
│   │   ├── robotcode-introduction/
│   │   ├── robotmk-faq/
│   │   ├── robotmk-migration-guide/
│   │   ├── robotmk-v2-is-out/
│   │   ├── secretvars/
│   │   ├── vscode-helsinki-shortcut/
│   │   ├── wrobocon25/
│   │   └── wrobocon25-recap/
│   │
│   ├── inbox/                          ← Draft/work-in-progress area
│   └── professionalsupport/            ← Service page (leaf bundle)
│       ├── index.{en,de}.md
│       └── img/
│
├── layouts/                            ★ Custom Hugo template overrides
│   ├── index.html                      ← Homepage template (overrides theme)
│   ├── _default/
│   │   ├── baseof.html                 ← Base HTML shell (head, body wrapper)
│   │   ├── single.html                 ← Single post/page template
│   │   └── tbd-old-home.html           ← Deprecated homepage template
│   ├── partials/                       ★ Reusable template fragments
│   │   ├── header.html                 ← Site header (includes GTM, logo, menu)
│   │   ├── footer.html                 ← Site footer
│   │   ├── logo.html                   ← Logo display
│   │   ├── menu.html                   ← Navigation menu
│   │   ├── authorbox.html              ← Author bio box (conditional on frontmatter)
│   │   ├── comments.html               ← Giscus comments integration
│   │   ├── post_meta.html              ← Post metadata (author, date, categories)
│   │   ├── post_thumbnail.html         ← Lead image display
│   │   ├── post_toc.html               ← Table of contents (from Hugo)
│   │   ├── vgwort.html                 ← VGWort tracking pixel
│   │   ├── gtm.html                    ← Google Tag Manager snippet
│   │   ├── getresponse_webconnect.html ← GetResponse analytics
│   │   ├── open-with-vscode.html       ← Dev helper: VS Code deep link
│   │   ├── cookie_consent.html         ← Cookie consent (currently disabled)
│   │   ├── debug.html                  ← Dev: dumps site JSON to console
│   │   └── dotdebug.html               ← Dev: dumps current context to console
│   └── shortcodes/                     ★ In-content reusable snippets
│       ├── figure.html                 ← Enhanced image/figure with caption
│       ├── github_button.html          ← GitHub badge buttons (star, fork, etc.)
│       ├── newsletter_form.html        ← GetResponse newsletter signup form
│       ├── meeting_prosupport.html     ← Booking iframe (Thinkific/professional support)
│       ├── portrait.html               ← Speaker/person portrait with name
│       ├── address_elabit.html         ← Elabit GmbH address block
│       └── address_thinkific.html      ← Thinkific address block
│
├── assets/                             ★ Hugo Pipes processed assets
│   ├── css/
│   │   ├── style.css                   ← Main CSS (Go template, injects Hugo params)
│   │   └── home.css                    ← Homepage-specific CSS (normalize.css base)
│   ├── img/                            ← Asset images (processed by Hugo Pipes)
│   └── js/
│       ├── jquery-3.5.1.min.js
│       └── jquery-migrate.js
│
├── static/                             ★ Static files (copied as-is to public/)
│   ├── favicon.ico
│   ├── rmk_crop_transp_w150.png        ← Site logo
│   ├── portrait_simon_meggle_*.png     ← Author portrait
│   ├── rmka-rec.gif                    ← Animated demo GIF
│   ├── robotmk*.png                    ← Brand images
│   ├── css/                            ← Additional static CSS
│   └── images/
│       └── index/                      ← Homepage-specific images
│
├── archetypes/                         ← Content templates for `hugo new`
│   ├── default.md                      ← Generic default
│   ├── blog/index.md                   ← Blog post template (full frontmatter)
│   └── news/index.md                   ← News template
│
├── i18n/                               ← UI translation strings
│   ├── en.yaml                         ← English UI strings
│   └── de.yaml                         ← German UI strings
│
├── themes/                             ← Git submodules
│   └── mainroad/                       ← Base theme (Vimux/Mainroad)
│       ├── layouts/                    ← Theme default templates (overridden by project)
│       ├── assets/                     ← Theme assets
│       ├── i18n/                       ← Theme i18n strings
│       └── static/                     ← Theme static files
│
├── data/                               ← Hugo data files (currently empty)
├── docs/                               ← Project documentation (this directory)
├── public/                             ← Build output (gitignored)
│
├── .github/
│   ├── INSTRUCTIONS.md                 ← Empty/placeholder
│   └── skills/                         ← Custom Claude skills (gitignored)
│       ├── blog_tone/
│       └── event_summary/
│
└── _bmad/                              ← BMAD AI workflow tooling
    ├── bmm/config.yaml                 ← BMAD config (user name, language, etc.)
    └── scripts/                        ← BMAD helper scripts
```

---

## Critical Directories

| Directory | Purpose | Notes |
|---|---|---|
| `content/blog/` | Main blog content | 24 posts, leaf bundle pattern |
| `layouts/` | Template overrides | Overrides mainroad theme defaults |
| `layouts/partials/` | Reusable fragments | 16 custom partials |
| `layouts/shortcodes/` | In-content components | 7 custom shortcodes |
| `assets/css/` | Processed stylesheets | Go template CSS for param injection |
| `static/` | Static assets | Copied verbatim to public/ |
| `i18n/` | UI translations | EN + DE |
| `themes/mainroad/` | Base theme | Git submodule, extend via overrides |

---

## Entry Points

| Entry Point | File | Description |
|---|---|---|
| Homepage | `layouts/index.html` | Custom homepage template |
| Base template | `layouts/_default/baseof.html` | HTML shell for all pages |
| Main config | `hugo.yaml` | Site-wide configuration |
| Blog archetype | `archetypes/blog/index.md` | Template for new blog posts |
