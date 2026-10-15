# Just-in-Time Learning

Notes on AI engineering, data, tools, and ways of working.

[Visit the site](https://ai-mindset.github.io)

The site is built from Markdown with Bun and deployed to GitHub Pages.

## Development

[Install Bun](https://bun.sh/docs/installation), install the locked dependencies,
then run:

```sh
bun install --frozen-lockfile
bun run dev
```

The local site is available at <http://127.0.0.1:8000>.

Run the project checks with:

```sh
bun run check
bun run test
bun run verify
```

Posts live in `content/posts/` and use the filename format
`YYYY-MM-DD-slug.md`. The generated `_site/` directory is not committed.
