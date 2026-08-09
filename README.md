# Just-in-Time Learning

Notes on AI engineering, data, tools, and ways of working.

[Visit the site](https://ai-mindset.github.io)

The site is built from Markdown with Deno and deployed to GitHub Pages.

## Development

[Install Deno 2](https://docs.deno.com/runtime/getting_started/installation/),
then run:

```sh
deno task dev
```

The local site is available at <http://127.0.0.1:8000>.

Run the project checks with:

```sh
deno task test
deno task verify
```

Posts live in `content/posts/` and use the filename format
`YYYY-MM-DD-slug.md`. The generated `_site/` directory is not committed.
