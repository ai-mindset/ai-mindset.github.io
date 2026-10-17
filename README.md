# Just-in-Time Learning

Notes on AI engineering, data, tools, and ways of working.

[Visit the site](https://ai-mindset.github.io)

The site is built from Markdown with Go and Goldmark, then deployed to GitHub Pages.

## Development

Install Go 1.26 or newer, then run:

```sh
go mod download
go run . dev
```

The local site is available at <http://127.0.0.1:8000>.

Run the project checks with:

```sh
test -z "$(gofmt -l *.go)"
go vet ./...
go run . check
go test ./...
go run . build
go run . verify
```

Posts live in `content/posts/` and use the filename format
`YYYY-MM-DD-slug.md`. The generated `_site/` directory is not committed.
The home page and posts are generated as HTML. A small browser script adds
search, filters, theme selection, and the approximate visitor beacon.

Run `go run . links` to check external content links when network access is
available. The daily workflow snapshots the visitor count with
`go run . snapshot`; that command requires `VISITOR_DOWNLOAD_COUNT`.

## License

Original writing by ai-mindset in posts and pages is
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Credit ai-mindset
with source and license links, and note changes. Images and third-party
material are excluded; site code is [MIT licensed](LICENSE).
