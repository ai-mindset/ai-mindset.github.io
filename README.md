# Just-in-Time Learning

A minimalist, lightweight blog implementation, designed to be:

- Simple to maintain
- Fast to load
- Easy to build locally
- Aesthetic and clean

[![pages-build-deployment](https://github.com/ai-mindset/ai-mindset.github.io/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/ai-mindset/ai-mindset.github.io/actions/workflows/pages/pages-build-deployment)  [![Build Content](https://github.com/ai-mindset/ai-mindset.github.io/actions/workflows/build-on-push.yml/badge.svg)](https://github.com/ai-mindset/ai-mindset.github.io/actions/workflows/build-on-push.yml)

## Features

- Markdown-based posts
- Tag filtering
- Dark/light mode
- Responsive design
- No external dependencies at runtime
- Zero tracking or analytics

## How to Use

### Prerequisites

- [Deno](https://deno.land/) (v2.0+)

### Development

To build the blog and serve it locally:

```bash
deno task dev
```

This will:

1. Convert all markdown posts to HTML
2. Generate a posts.json file
3. Start a local server

### Building

To just build the blog without serving:

```bash
deno task build
```

### Serving

To just serve the blog without rebuilding:

```bash
deno task serve
```

### Adding New Posts

1. Create a new markdown file in the `_posts` directory with the naming format:
2. Add front matter at the top of your file:
   `YYYY-MM-DD-slug.md`

```markdown
---
layout: post
title: "Your Post Title"
date: YYYY-MM-DD
tags: [tag1, tag2, tag3]
---

Your post content here...
```

3. Run `deno task build` to generate the HTML files

## Structure

- `_posts/`: Markdown content files
- `posts/`: Generated HTML posts
- `build.ts`: Deno build script to convert markdown to HTML
- `serve.ts`: Deno server script for local development
- `deno.json`: Deno configuration and task definitions
- `style.css`: All styles for the blog
- `script.js`: JavaScript for tag filtering and theme toggle
- `index.html`: Main page listing all posts
- `post-template.html`: Template for individual post pages

## Deployment

Simply push the repository to GitHub Pages or any static hosting service.

