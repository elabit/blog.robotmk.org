# Component Inventory: blog.robotmk.org

**Generated:** 2026-06-08

Hugo uses Go HTML Templates rather than component frameworks. "Components" exist as **partials** (reusable template fragments) and **shortcodes** (in-content snippets).

---

## Partials (Layout Components)

Partials are called from layouts with `{{ partial "name.html" . }}`.

### Core Structure

| Partial | File | Description | Used In |
|---|---|---|---|
| Header | `partials/header.html` | Sticky site header; includes GTM, logo, menu | All pages (baseof) |
| Footer | `partials/footer.html` | Site footer with copyright | All pages (baseof) |
| Logo | `partials/logo.html` | Site logo (image + title) | header.html |
| Menu | `partials/menu.html` | Main navigation menu | header.html |

### Post Components

| Partial | File | Description | Condition |
|---|---|---|---|
| Author Box | `partials/authorbox.html` | Author bio with portrait and link | Frontmatter `authorbox: true` |
| Comments | `partials/comments.html` | Giscus GitHub Discussions embed | Giscus configured in hugo.yaml |
| Post Meta | `partials/post_meta.html` | Author, date, category metadata | Blog/news posts |
| Post Thumbnail | `partials/post_thumbnail.html` | Lead image above content | Frontmatter `thumbnail:` set |
| Table of Contents | `partials/post_toc.html` | Auto-generated TOC | Frontmatter `toc: true` + content > 32 chars |

### Tracking & Analytics

| Partial | File | Description | Condition |
|---|---|---|---|
| Google Tag Manager | `partials/gtm.html` | GTM head snippet + noscript | `params.gtm_id` set, skips localhost |
| GetResponse | `partials/getresponse_webconnect.html` | Email marketing analytics | All pages |
| VGWort | `partials/vgwort.html` | German author royalty tracking pixel | Frontmatter `vgwort:` URL set |
| Cookie Consent | `partials/cookie_consent.html` | Cookie consent banner | Currently commented out |

### Development / Debug

| Partial | File | Description | Condition |
|---|---|---|---|
| VS Code Link | `partials/open-with-vscode.html` | "Open in VS Code" link for dev | Non-production mode only |
| Debug Site | `partials/debug.html` | Dumps full site JSON to console | Dev use |
| Debug Dot | `partials/dotdebug.html` | Dumps current page context to console | Dev use |

---

## Shortcodes (In-Content Components)

Shortcodes are used inside Markdown content with `{{< shortcode-name param="value" >}}`.

### Media

| Shortcode | File | Description | Parameters |
|---|---|---|---|
| Figure | `shortcodes/figure.html` | Enhanced image with caption, link, attributes | `src`, `alt`, `caption`, `title`, `link`, `target`, `rel`, `width`, `height`, `loading`, `class` |
| Portrait | `shortcodes/portrait.html` | Speaker/person portrait (square, rounded) | `src` (page resource path), `alt` (name) |

### GitHub Integration

| Shortcode | File | Description | Parameters |
|---|---|---|---|
| GitHub Button | `shortcodes/github_button.html` | GitHub badge buttons (star, fork, watch, etc.) | `button` (follow/star/fork/watch/sponsor/issue/view/download/template), `user`, `repo`, `text`, `icon`, `count`, `large`, `dark` |

### Forms & Booking

| Shortcode | File | Description | Parameters |
|---|---|---|---|
| Newsletter Form | `shortcodes/newsletter_form.html` | GetResponse newsletter signup embed | None (hardcoded form ID) |
| Meeting / Pro Support | `shortcodes/meeting_prosupport.html` | Thinkific booking iframe | None (URL from i18n) |

### Address Blocks

| Shortcode | File | Description | Parameters |
|---|---|---|---|
| Elabit Address | `shortcodes/address_elabit.html` | Elabit GmbH contact/legal address | None |
| Thinkific Address | `shortcodes/address_thinkific.html` | Thinkific platform address | None |

---

## Theme Components (Mainroad)

The Mainroad theme provides additional components inherited by the project. Key theme components:

| Component | Description |
|---|---|
| Sidebar | Right sidebar with configurable widgets |
| Widget: Languages | Language switcher (EN/DE) |
| Widget: Search | Site search |
| Widget: Recent | Recent posts list |
| Widget: Categories | Category navigation |
| Widget: Taglist | Tag cloud |
| Widget: Social | Social media links |
| List Layout | Blog post list with thumbnails |
| Pager | Prev/next post navigation |
| Post Tags | Tag display in post footer |

---

## CSS Custom Properties

The CSS uses Hugo template variables for theming:

```css
/* Injected from hugo.yaml params */
--highlight-color: #37d8ae;   /* Checkmk green - selection highlight */
--font-primary: "Open Sans", Helvetica, Arial, sans-serif;
--font-mono: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
```

---

## Reuse Patterns

- **Shortcodes for repeated content:** Address blocks, GitHub buttons, newsletter forms prevent copy-paste across posts
- **Partials for cross-page fragments:** Tracking pixels (GTM, VGWort, GetResponse) injected consistently via partials
- **Archetypes for consistency:** New posts created via `hugo new` automatically include all required frontmatter fields
- **i18n for UI strings:** All UI text (buttons, labels, sidebar titles) managed centrally in `i18n/*.yaml`
