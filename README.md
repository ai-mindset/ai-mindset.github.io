# Just-in-Time Learning

A minimalist, lightweight blog implementation, designed to be:

- Simple to maintain
- Fast to load
- Easy to build locally
- Aesthetic and clean

[![pages-build-deployment](https://github.com/ai-mindset/ai-mindset.github.io/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/ai-mindset/ai-mindset.github.io/actions/workflows/pages/pages-build-deployment)

## Features

- Markdown-based posts
- Tag filtering
- Dark/light mode
- Responsive design
- No external dependencies at runtime
- Zero tracking or analytics

## How to Use

### Prerequisites

- Node.js (v14+)

### Installation

```bash
npm install
```

### Development

To build the blog and serve it locally:

```bash
npm run dev
```

This will:

1. Convert all markdown posts to HTML
2. Generate a posts.json file
3. Start a local server

### Building

To just build the blog without serving:

```bash
npm run build
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

3. Run `npm run build` to generate the HTML files

## Structure

- `_posts/`: Markdown content files
- `posts/`: Generated HTML posts
- `build.js`: Build script to convert markdown to HTML
- `style.css`: All styles for the blog
- `script.js`: JavaScript for tag filtering and theme toggle
- `index.html`: Main page listing all posts
- `post-template.html`: Template for individual post pages

## Deployment

Simply push the repository to GitHub Pages or any static hosting service.
