# Just-in-Time Learning

A small static blog whose executable code is JavaScript from end to end. Deno
builds Markdown into a disposable static site, serves it during development, and
runs the project checks. The browser uses plain JavaScript for search, filters,
and theme selection.

[![Deploy site](https://github.com/ai-mindset/ai-mindset.github.io/actions/workflows/pages.yml/badge.svg)](https://github.com/ai-mindset/ai-mindset.github.io/actions/workflows/pages.yml)

## Features

- Markdown posts with simple YAML front matter
- Static HTML generation for fast, dependency-free page loads
- Full-text search, tag and timeline filters
- Responsive light and dark themes
- One runtime and one programming language
- Privacy-minimal aggregate visitor counting without an analytics engine

## Development

[Install Deno 2](https://docs.deno.com/runtime/getting_started/installation/),
then build and serve the site:

```sh
deno task dev
```

The site is available at <http://127.0.0.1:8000>. The individual tasks are:

```sh
deno task build                 # generate _site/
deno task serve -- 8080         # serve _site/ on an optional port
deno task audit                 # check content metadata, typography, and Markdown
deno task check                 # audit content, then format, lint, and type-check
deno task check-links           # make an optional live check of external URLs
deno task snapshot-visitors     # refresh aggregate counts when configured
deno task test                  # rebuild and run the tooling tests
deno task verify                # validate every generated page
```

## Adding a post

Create `content/posts/YYYY-MM-DD-slug.md` with front matter followed by
Markdown:

```markdown
---
layout: post
title: "Your post title"
date: 2026-08-09
tags: [learning, ai]
---

Your post goes here.
```

Run `deno task test` and `deno task verify`. Commit the Markdown source only;
`_site/` is generated and deliberately ignored.

## Structure

```text
content/
  pages/             Standalone Markdown pages
  posts/             Markdown post sources
counter/             Anonymous Deno KV counter service
scripts/             Deno build, server, and verification tools
site/                Browser assets and shared HTML templates
tests/               Deno tests for build and server behaviour
_site/               Generated deployment artifact (ignored)
deno.json            Tasks and pinned imports
deno.lock            Reproducible dependency lock
```

On pushes to `main`, GitHub Actions checks, builds, tests, verifies, and deploys
`_site/` to GitHub Pages. Pull requests run the same validation without
deploying.

## Anonymous visitor count

The homepage can count approximate unique browser profiles without Google
Analytics or another analytics engine. The browser stores only two local flags:
whether it has ever been counted and the last month in which it was counted.
Those flags are not sent as identifiers. The Deno service accepts only a boolean
`firstEver` event and stores aggregate total and monthly counters in Deno KV.

To enable it:

1. Create a dynamic Deno Deploy application from this repository, using
   `counter/` as its application directory. Its `deno.json` selects `main.js` as
   the entrypoint.
2. Provision a Deno KV database and attach it to the application.
3. If the site uses another domain, set the Deno Deploy environment variable
   `VISITOR_COUNTER_ALLOWED_ORIGINS` to a comma-separated list of allowed
   origins. The default already allows `https://ai-mindset.github.io` and the
   local development server.
4. Add the public deployment URL as the GitHub repository variable
   `VISITOR_COUNTER_ENDPOINT`.
5. Run the Pages workflow manually after the variable is available.

The Pages workflow refreshes `visitors.json` in the deployment artifact once a
day. It does not commit counter updates, so automated traffic data does not
pollute the repository history. Counts are approximate: clearing local storage,
using another browser or device, and automated browsers can affect them. The
public endpoint deliberately stores no visitor ID, IP address, user-agent,
referrer or browsing history in its KV records.
