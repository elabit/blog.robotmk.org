# Project Overview: blog.robotmk.org

**Generated:** 2026-06-08

---

## Purpose

`blog.robotmk.org` is the public-facing website and blog for the **Robotmk** project — an open-source Checkmk extension (MKP plugin) that enables Robot Framework-based synthetic monitoring. The site serves as:

- Primary information hub about Robotmk
- Technical blog with tutorials, migration guides, and conference recaps
- Professional support landing page (elabit GmbH)
- Newsletter signup

**Base URL:** https://www.robotmk.org/  
**Repository:** github.com/elabit/blog.robotmk.org  
**Author / Owner:** Simon Meggle (ELABIT GmbH)

---

## Tech Stack Summary

| Category | Technology |
|---|---|
| Framework | Hugo (Go SSG) |
| Theme | Mainroad (GPL2, git submodule) |
| Languages | English (default), German |
| CSS | Custom CSS via Hugo Pipes |
| JS | jQuery 3.5.1 |
| Comments | Giscus (GitHub Discussions) |
| Analytics | Google Tag Manager |
| Email | GetResponse |
| Author tracking | VGWort |
| Content editor | Obsidian |

---

## Architecture Type

**Static Site Generator (SSG)** — Monolith

- Single Hugo project
- No backend, no database, no API
- Content authored in Markdown (Obsidian)
- Hugo builds to static HTML/CSS/JS
- Deployed as static files to web server

---

## Repository Structure

```
blog.robotmk.org/
├── content/      ← Blog posts and pages (Markdown + Obsidian)
├── layouts/      ← Custom Hugo templates (overrides theme)
├── assets/       ← CSS/JS processed by Hugo Pipes
├── static/       ← Static assets (images, favicon)
├── i18n/         ← UI translation strings (EN, DE)
├── archetypes/   ← Content creation templates
├── themes/       ← Mainroad theme (git submodule)
├── hugo.yaml     ← Site configuration
└── docs/         ← Project documentation (this directory)
```

---

## Content Overview

**24 blog posts** covering:
- Robotmk tutorials and getting-started guides
- RCC (Robot Console) configuration
- RoboCon conference recaps (2025, 2026)
- Robot Framework tooling (VS Code, GitHub)
- Checkmk integration topics

**Content pages:**
- About, Imprint, Privacy Policy, Newsletter, Professional Support

---

## Getting Started

```bash
# Clone with theme submodule
git clone --recurse-submodules git@github.com:elabit/blog.robotmk.org.git

# Start dev server
hugo server --noHTTPCache --disableFastRender --buildDrafts

# Build for production
hugo
```

See [Development Guide](./development-guide.md) for detailed instructions.

---

## Documentation Index

| Document | Description |
|---|---|
| [Architecture](./architecture.md) | Full technical architecture, template hierarchy, integrations |
| [Source Tree Analysis](./source-tree-analysis.md) | Annotated directory tree |
| [Component Inventory](./component-inventory.md) | All partials, shortcodes, and UI components |
| [Development Guide](./development-guide.md) | Setup, content creation, customization |
