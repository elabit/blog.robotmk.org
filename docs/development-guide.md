# Development Guide: blog.robotmk.org

**Generated:** 2026-06-08

---

## Prerequisites

| Tool | Purpose | Notes |
|---|---|---|
| Hugo | Static site generator | Install via Homebrew: `brew install hugo` |
| Git | Version control + submodule management | Required for theme submodule |
| Obsidian | Content authoring (optional) | `content/` directory as vault |

---

## Initial Setup

```bash
# Clone the repository
git clone git@github.com:elabit/blog.robotmk.org.git
cd blog.robotmk.org

# Initialize the Mainroad theme submodule
git submodule update --init --recursive
```

---

## Development Server

```bash
# Start local dev server with all options
hugo server --noHTTPCache --disableFastRender --buildDrafts

# Access at:
# http://localhost:1313/en/   (English)
# http://localhost:1313/de/   (German)
```

**Flags explained:**
- `--noHTTPCache` — Disables browser caching for instant style updates
- `--disableFastRender` — Forces full re-render on each change (prevents stale content)
- `--buildDrafts` — Includes posts with `draft: true` in development

---

## Creating New Blog Posts

### Using Hugo Archetypes

```bash
# Create a new blog post (leaf bundle)
hugo new blog/my-post-slug/index.en.md
hugo new blog/my-post-slug/index.de.md
```

This uses `archetypes/blog/index.md` and pre-populates all frontmatter fields.

### Required Frontmatter Fields

```yaml
draft: false          # Set to false when ready to publish
title: "Post Title"
date: 2026-01-01T10:00:00+02:00
categories:
  - tutorials         # tutorials, news, etc.
tags:
  - robotframework
authorbox: true
sidebar: true
pager: false
```

### Optional Frontmatter Fields

```yaml
lead: "Short italic subheading shown below title"
commentid: unique-slug    # Must be unique; enables Giscus comments thread
thumbnail: img/image.png  # Relative to post bundle (stored in img/ subfolder)
vgwort: https://vg04.met.vgwort.de/na/...  # VGWort tracking URL from vgwort.de
slug: custom-url          # Override auto-generated URL from folder name
description: "SEO description"
```

### Adding Post Images

```
content/blog/my-post/
├── index.en.md
├── index.de.md
└── img/
    └── screenshot.png    ← Referenced in frontmatter as: thumbnail: img/screenshot.png
```

In Markdown content, use the `figure` shortcode for images:

```
{{< figure src="img/screenshot.png" alt="Description" title="Optional title" >}}
```

---

## Using Shortcodes in Content

### GitHub Buttons

```
{{< github_button button="star" user="elabit" repo="robotmk" count="true" large="true" >}}
{{< github_button button="view" user="elabit" repo="robotmk" >}}
```

Available button types: `follow`, `star`, `watch`, `fork`, `sponsor`, `issue`, `download`, `template`, `view`

### Newsletter Form

```
{{< newsletter_form >}}
```

Embeds a GetResponse signup form (form ID hardcoded in shortcode).

### Professional Support Booking

```
{{< meeting_prosupport >}}
```

Embeds a Thinkific booking iframe. The iframe URL is pulled from `i18n/*.yaml` key `brevo_meeting_iframe_src_professional_support`.

### Portrait (for event/conference posts)

```
{{< portrait src="img/speaker.jpg" alt="Speaker Name" >}}
```

Note: `src` path is relative to the English content directory of the post.

### Address Blocks (for legal pages)

```
{{< address_elabit >}}
{{< address_thinkific >}}
```

---

## Customizing the Theme

### Overriding Theme Templates

Place override files in `layouts/` following the same directory structure as `themes/mainroad/layouts/`. Hugo gives project-level files priority over theme files.

Example:
```
themes/mainroad/layouts/partials/header.html  ← theme default
layouts/partials/header.html                  ← project override (takes priority)
```

### CSS Customization

The main CSS (`assets/css/style.css`) is a Go template that injects Hugo params:

```css
/* Access site params in CSS */
{{- $highlightColor := .Site.Params.highlightColor | default "#e22d30" -}}
.selection { background: {{ $highlightColor }}; }
```

Change `params.highlightColor` in `hugo.yaml` to update the brand color.

---

## Localization

### Adding UI Strings

Add new strings to both `i18n/en.yaml` and `i18n/de.yaml`:

```yaml
- id: my_new_string
  translation: "My translated text"
```

Use in templates: `{{ T "my_new_string" }}`

### Content Translation

For each new content file in English, create a corresponding German file:
- `content/blog/my-post/index.en.md`
- `content/blog/my-post/index.de.md`

---

## Analytics & Tracking

### VGWort Setup

1. Register an article at vgwort.de
2. Copy the tracking URL
3. Add to frontmatter: `vgwort: https://vg04.met.vgwort.de/na/...`

The `vgwort.html` partial automatically inserts the counting pixel.

### Giscus Comments

Comments are enabled per-post via the `commentid` frontmatter field. The value must be unique across all posts as it maps to a GitHub Discussion thread (using `og:title` mapping).

Configure Giscus settings in `hugo.yaml` under `params.giscus`.

---

## Production Build

```bash
# Build static site
hugo

# Output directory: public/
# Deploy contents of public/ to web server
```

**Note:** GTM and VGWort tracking are automatically disabled when running `hugo server` (localhost detection).

---

## Project-specific Conventions

- Blog posts use leaf bundles: each post is a folder with `index.en.md` + `index.de.md`
- Post images live in `img/` inside the post bundle
- Both EN and DE versions should be created for every blog post
- The `commentid` value in frontmatter must be globally unique (used as Giscus thread ID)
- Draft posts (`draft: true`) are not included in production builds
- The `content/inbox/` folder is used for work-in-progress content
