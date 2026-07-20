# Architecture: blog.robotmk.org

**Generated:** 2026-06-08  
**Project:** Robotmk Homepage (blog.robotmk.org)  
**Type:** Hugo Static Site Generator (SSG) — Monolith  
**Architecture Pattern:** Static Site / Template-based Component Architecture

---

## Executive Summary

`blog.robotmk.org` is a bilingual (English/German) static website built with the Hugo framework. It serves as the public homepage and blog for the Robotmk project — an open-source Checkmk extension for Robot Framework-based synthetic monitoring. The site is content-focused, using the Mainroad theme as a base with extensive custom overrides in layouts, partials, and shortcodes. Content is authored in Markdown using Obsidian and built into a static HTML/CSS/JS site by Hugo.

---

## Technology Stack

| Category | Technology | Version / Notes |
|---|---|---|
| SSG Framework | Hugo | Go-based, `hugo.yaml` config |
| Base Theme | Mainroad | GPL2, git submodule (`themes/mainroad`) |
| Markup Language | Markdown | Via Goldmark renderer (unsafe HTML enabled) |
| Primary Language | Go HTML Templates | Layouts, partials, shortcodes |
| CSS | Custom CSS + Mainroad CSS | Hugo Pipes templating (`style.css`, `home.css`) |
| JavaScript | jQuery 3.5.1 + migrate | Served via Hugo asset pipeline |
| Typography | Open Sans (Google Fonts) | Via CDN |
| Icon Library | Font Awesome 4.7.0 | Via CDN |
| Comment System | Giscus | GitHub Discussions-based, configured in `hugo.yaml` |
| Analytics | Google Tag Manager | ID: `GTM-MZR6FLQ`, skipped on localhost |
| Email Marketing | GetResponse | WebConnect analytics + newsletter form |
| Author Royalty | VGWort | German text tracking via counting pixel |
| Content Editor | Obsidian | `.obsidian/` config in `content/` |
| Languages | English, German | `defaultContentLanguage: en` |

---

## Architecture Pattern

The site follows a **layered static rendering pattern**:

```
Content Layer (Markdown + frontmatter)
        ↓
Template Layer (Go HTML Templates: baseof → single/list → partials)
        ↓
Asset Pipeline (Hugo Pipes: CSS templating, JS bundling)
        ↓
Static Output (public/ directory: HTML, CSS, JS, images)
        ↓
Hosting (static web server / CDN)
```

### Template Inheritance

Hugo uses a block/define pattern for template inheritance:

```
layouts/_default/baseof.html   ← base shell (HTML structure, head, body)
    └── layouts/index.html     ← homepage override (extends baseof)
    └── layouts/_default/single.html  ← article pages (extends baseof)
    └── (mainroad theme)       ← list pages, taxonomies (inherited from theme)
```

### Partial Composition

Hugo partials are reusable template fragments called from layouts:

```
baseof.html
├── partial: getresponse_webconnect.html  (analytics, all pages)
├── partial: gtm.html                     (Google Tag Manager, all pages)
├── partial: header.html
│   ├── partial: logo.html
│   └── partial: menu.html
├── block: main (overridden in child templates)
│   ├── single.html
│   │   ├── partial: vgwort.html          (VGWort pixel, blog posts)
│   │   ├── partial: post_meta.html       (author, date, categories)
│   │   ├── partial: post_thumbnail.html  (lead image)
│   │   ├── partial: post_toc.html        (table of contents)
│   │   ├── partial: authorbox.html       (author bio)
│   │   ├── partial: pager.html           (prev/next, from theme)
│   │   └── partial: comments.html        (Giscus GitHub comments)
└── partial: footer.html
```

---

## Content Architecture

### Content Types & Sections

| Section | Path | Description |
|---|---|---|
| Blog | `content/blog/` | Main blog posts (technical tutorials, recaps) |
| Professional Support | `content/professionalsupport/` | Service page |
| About | `content/about.{de,en}.md` | Author/project info |
| Imprint | `content/imprint.{de,en}.md` | Legal page |
| Privacy Policy | `content/privacy-policy.{de,en}.md` | GDPR page |
| Newsletter | `content/newsletter.{de,en}.md` | Newsletter signup |
| Almost Done | `content/almost-done.{de,en}.md` | Post-signup confirmation |
| Thanks | `content/thanks-for-signing-up.{de,en}.md` | Confirmation |

### Content Bundle Pattern

Blog posts use Hugo **leaf bundles** (page bundles):

```
content/blog/my-post/
├── index.en.md       ← English content + frontmatter
├── index.de.md       ← German translation
└── img/              ← Post-specific images (page resources)
    └── screenshot.png
```

### Frontmatter Schema (Blog Posts)

```yaml
draft: false
title: "Post Title"
lead: "Short italic subheading"         # Optional
commentid: unique-id                    # Giscus comment thread ID
slug: custom-url-slug                   # Optional URL override
description: "SEO description"         # Optional
date: 2026-01-01T10:00:00+02:00
categories:
  - tutorials                           # tutorials, news, etc.
tags:
  - robotframework
  - rcc
authorbox: true                         # Show author box
sidebar: true                           # Show sidebar
pager: false                            # Show prev/next pager
thumbnail: img/post-image.png          # Lead image (page resource)
vgwort: https://vg04.met.vgwort.de/... # VGWort tracking URL
```

### Content Workflow (Obsidian Integration)

The `content/` directory is configured as an Obsidian vault (`.obsidian/` config present). Authors use Obsidian for:
- Markdown editing with live preview
- Internal linking between posts
- Content database view via `content-db.md` (Obsidian DB plugin artifact)

---

## Multilingual Architecture

Hugo's built-in i18n system is used:

```
defaultContentLanguage: en
defaultContentLanguageInSubdir: true

languages:
  en: → URL prefix /en/
  de: → URL prefix /de/
```

**Translation files:**
- `i18n/en.yaml` — English UI strings (read_more, TOC title, etc.)
- `i18n/de.yaml` — German UI strings

**Content translation approach:** Side-by-side files with language suffix (`index.en.md`, `index.de.md`) or language suffix in filename (`about.en.md`, `about.de.md`).

---

## Sidebar Widgets

Configured in `hugo.yaml` under `params.sidebar.widgets`:

```
["languages", "search", "recent", "categories", "taglist", "social"]
```

- **languages** — Language switcher (EN/DE)
- **search** — Site search
- **recent** — Recent posts
- **categories** — Category list
- **taglist** — Tag cloud
- **social** — Social links (GitHub: `elabit`, Email: `mail@robotmk.org`)

---

## Third-party Integrations

| Integration | Purpose | Config Location |
|---|---|---|
| Giscus | Blog comments via GitHub Discussions | `hugo.yaml` → `params.giscus` |
| Google Tag Manager | Analytics & marketing | `hugo.yaml` → `params.gtm_id` |
| GetResponse | Email list & analytics | `layouts/partials/getresponse_webconnect.html` |
| VGWort | German author royalty tracking | `layouts/partials/vgwort.html` + frontmatter `vgwort:` |
| Font Awesome 4.7 | Icon library | Loaded in `baseof.html` via CDN |
| Google Fonts | Typography (Open Sans) | Loaded via Mainroad theme |
| Cookie Script | Cookie consent (disabled) | `cookie_consent.html` (commented out) |

---

## Asset Architecture

### CSS Pipeline

Hugo Pipes processes CSS with Go template variables:

```
assets/css/style.css
  → resources.ExecuteAsTemplate (injects Hugo params like highlightColor)
  → Fingerprinted output in public/
  
assets/css/home.css
  → Homepage-specific styles (normalize.css base)
```

**Brand color:** `#37d8ae` (Checkmk green) — injected via Hugo Params.

### JavaScript

```
assets/js/
├── jquery-3.5.1.min.js
└── jquery-migrate.js
```

Loaded via Hugo asset pipeline. Menu JS referenced from theme (`/js/menu.js`).

### Static Assets

```
static/
├── favicon.ico
├── rmk_crop_transp_w150.png    (logo)
├── portrait_simon_meggle_*.png  (author portrait)
├── rmka-rec.gif                 (animated demo)
├── images/index/               (homepage images)
└── css/                        (additional static CSS)
```

---

## Development Architecture

### Build System

Hugo compiles the entire site via CLI:

```bash
# Development server
hugo server --noHTTPCache --disableFastRender --buildDrafts

# Production build
hugo
# Output: public/ directory
```

### Content Creation Workflow

```
1. hugo new blog/my-post/index.en.md  (uses archetypes/blog/index.md template)
2. Edit in Obsidian
3. Add images to content/blog/my-post/img/
4. Set draft: false when ready
5. hugo build → deploy public/
```

### Archetypes

Pre-configured templates for new content:

- `archetypes/blog/index.md` — Blog post template with all frontmatter fields
- `archetypes/news/index.md` — News article template
- `archetypes/default.md` — Fallback default

---

## Deployment Architecture

No CI/CD pipeline is configured (no `.github/workflows/` directory). Deployment is manual:

1. Run `hugo` to build `public/` directory
2. Deploy `public/` to web hosting

**Base URL:** `https://www.robotmk.org/`  
**RSS:** Auto-generated per section and language  
**Sitemap:** Auto-generated by Hugo
