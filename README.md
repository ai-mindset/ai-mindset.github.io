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

## Approximate Page-Load Counter

Each rendered page requests the tiny `visit.txt` asset from the
`page-load-counter-v1` GitHub release. GitHub's aggregate release download count
acts as a deliberately approximate page-load total. The scheduled Pages
workflow reads that total, updates `counter/visitors.json`, and deploys the
snapshot with the site.

The counter uses no cookies, browser identifiers, external analytics service or
credential in client-side code. It counts reloads rather than unique people and
can be affected by browser caching, bots and GitHub's release infrastructure.
