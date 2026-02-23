# Just-in-Time Learning

A minimalist, lightweight static blog generator built with Elixir, designed to be:

- Simple to maintain
- Fast to load
- Easy to build locally
- Aesthetic and clean

[![pages-build-deployment](https://github.com/ai-mindset/ai-mindset.github.io/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/ai-mindset/ai-mindset.github.io/actions/workflows/pages/pages-build-deployment)  [![Build Content](https://github.com/ai-mindset/ai-mindset.github.io/actions/workflows/build-on-push.yml/badge.svg)](https://github.com/ai-mindset/ai-mindset.github.io/actions/workflows/build-on-push.yml)

## Features

- Markdown-based posts with YAML front matter
- Tag filtering system
- Dark/light theme toggle
- Responsive design
- Zero external dependencies at runtime
- No tracking or analytics
- Built entirely with Elixir

## Prerequisites

- [Elixir](https://elixir-lang.org/) 1.19+
- [Erlang/OTP](https://www.erlang.org/) 28+

## Quick Start

### Install Dependencies

```bash
mix deps.get
```

### Development

Build and serve locally:

```bash
mix dev
```

Visit `http://localhost:8000`

### Build Only

Generate HTML files without starting server:

```bash
mix build_site
```

### Serve Only

Start HTTP server without rebuilding:

```bash
mix serve [port]  # default port: 8000
```

## Adding New Posts

1. Create markdown file in `_posts/` directory:

**Format:** `YYYY-MM-DD-slug.md`

2. Add YAML front matter:

```markdown
---
layout: post
title: "Your Post Title"
date: 2025-01-01
tags: [tag1, tag2, tag3]
---

Your post content here...
```

3. Run `mix build_site` to generate HTML

## Project Structure

```
├── _posts/              # Markdown source files
├── posts/               # Generated HTML posts
├── lib/
│   ├── blog_builder.ex  # Main build logic
│   ├── blog_server.ex   # HTTP server
│   └── mix/tasks/       # Mix tasks (build_site, serve, dev)
├── mix.exs              # Project configuration
├── post-template.html   # HTML template for posts
├── index.html           # Main blog listing page
├── style.css            # All styling
├── script.js            # Client-side JavaScript
└── posts.json           # Generated posts index
```

## Deployment

GitHub Actions automatically builds and deploys to GitHub Pages on push to `main`.

## Architecture

- **Static Generation:** Converts markdown → HTML at build time
- **YAML Front Matter:** Parses post metadata (title, date, tags)
- **Template System:** Applies HTML templates with string replacement
- **JSON Index:** Generates searchable posts.json for frontend
- **HTTP Server:** Elixir Plug/Cowboy for local development
