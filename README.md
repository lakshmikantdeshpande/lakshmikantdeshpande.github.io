# Lakshmikant Deshpande — personal portfolio

An editorial portfolio for apps, practical AI experiments, and writing. Warm paper,
plum accents, locally hosted type, and illustrated project cards. Built with Eleventy,
Markdown, plain CSS, and a small progressive-enhancement JavaScript module.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:8080. Changes to source files refresh the preview.

```sh
npm run check    # clean production build, link/metadata checks, URL-cleaner tests
npm run build    # static files in _site/
```

The output can be served by any static host. There is no application server,
analytics, remote font request, or browser framework. Navigation and reading work
without JavaScript; the link-cleaner demo is the only enhanced interaction.

## Edit the site

- `src/index.njk`: homepage layout and introduction.
- `src/work/*.md`: project copy, metadata, ordering, and external links.
- `src/_includes/project-card.njk`: CSS illustration markup for project cards.
- `src/about.njk`: personal background.
- `src/assets/styles.css`: colours, typography, illustrations, and responsive rules.
- `src/_data/site.js`: name, email, social links, and canonical site URL.
- `src/_includes/layouts/`: shared site, project, and article templates.

The project illustrations are conceptual artwork, not screenshots of the apps.
Public copy uses the resume and existing project descriptions; employer-specific
metrics, internal project details, phone number, and private family details are omitted.
The full resume is not included in this repository or the site.

## Publish writing

The Writing page has an intentional empty state until there is a real article.
A starter draft lives in `content-drafts/first-note.md`, outside the generated site.
Review and personalise it before using it. No invented articles are presented as
previously published work.

Add a Markdown file under `src/writing/`, for example `my-first-note.md`:

```yaml
---
title: My first note
description: A short description of what this post is about.
date: 2026-10-04
category: Building
draft: false
---
Your article goes here. Markdown headings, links, lists, code blocks, and images work.
```

Set the date to the real publication date. `draft: true` suppresses the output page,
writing list, homepage list, feed, and sitemap. Draft previews are not built; to preview,
use a local branch, temporarily set `draft: false`, and restore it before publication.
After moving a post or changing its status, `npm run build` removes stale output files.
Posts automatically appear newest-first in Writing, the homepage, and the Atom/RSS
reader feed at `/feed.xml`. Feed entries contain a summary and link to the full article.

## GitHub Pages

The included Actions workflow builds and checks the site, then deploys `_site/`
when changes reach `master`, or when manually dispatched from GitHub.

Before the first deployment, set repository **Settings → Pages → Source** to
**GitHub Actions**. Merge this branch into `master` only when ready to publish.
The build defaults to `https://lakshmikantdeshpande.github.io` for canonical URLs.

### Custom domain cutover (separate from implementation)

`ldeshpande.com` currently serves the Peerlist profile. This change does not alter
DNS, that profile, or GitHub's domain settings.

When ready to replace it:

1. Verify the custom domain in GitHub and follow GitHub Pages' DNS instructions.
2. Set the Pages custom domain to the chosen canonical hostname and enable HTTPS.
3. Set the repository Actions variable `SITE_URL` to that hostname with `https://`.
4. Redeploy and check the apex/www redirect, canonical tags, feed, sitemap, and HTTPS.

Do not point DNS at a local development server. There is intentionally no `CNAME`
file in this preview branch.

## Checks and limits

`npm run check` checks internal links/anchors, generated page metadata, unique IDs,
font assets, draft exclusion, and the link cleaner's handling of meaningful query
parameters, encodings, fragments, and invalid URLs. Browser review covers desktop,
mobile, navigation, the interactive demo, clipboard feedback, and article layouts.

The demo only removes known tracking parameters. It is not a general privacy or
anonymity tool, does not follow redirects, and never uploads or fetches a pasted URL.
Unknown query parameters and fragments are preserved.

At implementation time, `npm audit` reports an upstream `braces` denial-of-service
advisory through Eleventy's development file-watching dependencies. The stable
Eleventy release does not yet supply a supported fix; do not apply the suggested
major-version downgrade. These dependencies run only in local/CI builds and are
not shipped to the static site. Recheck upstream when upgrading Eleventy.

Fonts are DM Sans and Instrument Serif, hosted locally under their SIL Open Font
Licenses. License files are included under `src/assets/fonts/`.
