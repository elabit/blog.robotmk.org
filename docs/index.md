# Project Documentation Index: blog.robotmk.org

**Generated:** 2026-06-08  
**Scan Mode:** initial_scan | **Scan Level:** deep

---

## Project Overview

- **Type:** Monolith — Hugo Static Site Generator (SSG)
- **Primary Language:** Go HTML Templates + Markdown
- **Architecture:** Static Site / Template-based Component Architecture
- **Repo:** github.com/elabit/blog.robotmk.org
- **Live URL:** https://www.robotmk.org/

---

## Quick Reference

- **Tech Stack:** Hugo + Mainroad theme + jQuery + Giscus + GTM + GetResponse + VGWort
- **Entry Point:** `hugo.yaml` (config), `layouts/_default/baseof.html` (template root)
- **Architecture Pattern:** Static Site with Partial/Shortcode composition
- **Languages:** English (default at `/en/`), German (`/de/`)
- **Content Location:** `content/blog/` (24 posts, leaf bundles)
- **Build Command:** `hugo`
- **Dev Command:** `hugo server --noHTTPCache --disableFastRender --buildDrafts`

---

## Generated Documentation

- [Project Overview](./project-overview.md) — Purpose, tech stack summary, getting started
- [Architecture](./architecture.md) — Full technical architecture, template hierarchy, integrations, content schema
- [Source Tree Analysis](./source-tree-analysis.md) — Annotated directory tree with all critical paths
- [Component Inventory](./component-inventory.md) — All partials (16), shortcodes (7), theme components
- [Development Guide](./development-guide.md) — Setup, content creation workflow, shortcode usage, customization

---

## Existing Documentation

- [DOCUMENTATION.md](../DOCUMENTATION.md) — Minimal dev notes (Hugo CLI commands, Giscus link)

---

## Getting Started

### For Developers

```bash
# Clone with theme submodule
git clone --recurse-submodules git@github.com:elabit/blog.robotmk.org.git
cd blog.robotmk.org

# Start dev server (includes draft posts)
hugo server --noHTTPCache --disableFastRender --buildDrafts
```

### For Content Authors

```bash
# Create a new blog post
hugo new blog/my-post-slug/index.en.md
hugo new blog/my-post-slug/index.de.md

# Edit in Obsidian (open content/ as vault)
# or edit .md files directly

# Build and check
hugo server --buildDrafts
```

### Key Files to Know

| File | What It Does |
|---|---|
| `hugo.yaml` | All site config: baseURL, theme, languages, GTM, Giscus, sidebar |
| `layouts/_default/baseof.html` | Base HTML template — every page starts here |
| `layouts/index.html` | Homepage template |
| `layouts/_default/single.html` | Blog post template |
| `archetypes/blog/index.md` | Template for new blog posts (frontmatter) |
| `i18n/en.yaml` + `i18n/de.yaml` | UI strings |

---

## Content Structure at a Glance

```
content/
├── blog/              ← 24 blog posts (leaf bundles: folder + index.en.md + index.de.md)
├── professionalsupport/
├── about.{en,de}.md
├── imprint.{en,de}.md
├── privacy-policy.{en,de}.md
├── newsletter.{en,de}.md
└── inbox/             ← Draft/WIP area
```

---

## For AI-Assisted Development

When using this documentation as context for AI tools:

1. Start with **[Architecture](./architecture.md)** for full system understanding
2. Consult **[Component Inventory](./component-inventory.md)** when adding/modifying templates or shortcodes
3. Consult **[Development Guide](./development-guide.md)** for content creation workflows and conventions
4. Use **[Source Tree Analysis](./source-tree-analysis.md)** to locate specific files

**Key constraints to remember:**
- This is a static site — no backend, no API, no database
- All tracking (GTM, VGWort, GetResponse) is injected via Hugo partials
- Multilingual: every content file needs both `.en.md` and `.de.md` versions
- Blog posts use leaf bundles (folder per post), not flat .md files
- Theme customizations go in `layouts/` (not in `themes/mainroad/`)
