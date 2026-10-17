package main

import (
	"html/template"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestFrontMatterAndAudit(t *testing.T) {
	meta, body, err := parseDocument("---\nlayout: post\ntitle: \"A useful: post\"\ndate: 2026-08-09\ntags: [\n  deno,\n  javascript,\n]\ndraft: false\n---\n**TL;DR:** Summary.\n<!--more-->\n")
	if err != nil || meta.Title != "A useful: post" || meta.Date != "2026-08-09" || len(meta.Tags) != 2 || body == "" {
		t.Fatalf("unexpected parsed document: %+v %q %v", meta, body, err)
	}
	doc := document{Path: "content/posts/2026-08-09-example.md", Meta: meta, Body: body}
	if issues := auditDocument(doc); len(issues) != 0 {
		t.Fatalf("valid post failed audit: %v", issues)
	}
	doc.Meta.Date = "2026-08-10"
	if issues := auditDocument(doc); !strings.Contains(strings.Join(issues, " "), "does not match") {
		t.Fatalf("date mismatch went unnoticed: %v", issues)
	}
}

func TestFrontMatterTagsWithBracketOnNextLine(t *testing.T) {
	meta, body, err := parseDocument("---\ntags:\n  [\n    go,\n    ai,\n  ]\ndraft: true\n---\nBody.\n")
	if err != nil || len(meta.Tags) != 2 || meta.Tags[0] != "go" || meta.Tags[1] != "ai" || !meta.Draft || body != "Body.\n" {
		t.Fatalf("unexpected parsed document: %+v %q %v", meta, body, err)
	}
	if _, _, err := parseDocument("---\ntags:\n  - go\n---\nBody.\n"); err == nil {
		t.Fatal("accepted a block list")
	}
}

func TestRepositoryContentAudit(t *testing.T) {
	if err := auditContent(); err != nil {
		t.Fatal(err)
	}
}

func TestVisitorSnapshot(t *testing.T) {
	date := "2026-10-17"
	if err := validateVisitorSnapshot(visitorSnapshot{Total: 1234, LastUpdated: &date}); err != nil {
		t.Fatal(err)
	}
	if got := formatCount(1234); got != "1,234" {
		t.Fatalf("formatted count = %q", got)
	}
	badDate := "2026-02-30"
	for _, snapshot := range []visitorSnapshot{
		{Total: -1}, {Total: maxSafeInteger + 1}, {Total: 1, LastUpdated: &badDate},
	} {
		if validateVisitorSnapshot(snapshot) == nil {
			t.Fatalf("accepted invalid snapshot: %+v", snapshot)
		}
	}
	if _, err := decodeVisitorSnapshot([]byte(`{"lastUpdated":null}`)); err == nil {
		t.Fatal("accepted a snapshot without a total")
	}
	if _, err := decodeVisitorSnapshot([]byte(`{"total":null,"lastUpdated":null}`)); err == nil {
		t.Fatal("accepted a null total")
	}
}

func TestMarkdownHTMLCompatibility(t *testing.T) {
	got := normalizeMarkdownHTML(`<h2>ML/AI &amp; More</h2>
<h2>ML/AI &amp; More</h2>
<p><sup id="fnref:1"><a href="#fn:1">1</a></sup><sup id="fnref1:1"><a href="#fn:1">1</a></sup></p>
<section class="footnotes" role="doc-endnotes"><li id="fn:1"><a href="#fnref:1">↩</a><a href="#fnref1:1">↩</a></li></section>`, []string{"1"})
	for _, want := range []string{
		`id="mlai-more"`, `id="mlai-more-2"`,
		`id="footnote-ref-1"`, `id="footnote-ref-1-2"`, `href="#footnote-1"`,
		`id="footnote-label"`, `id="footnote-1"`, `href="#footnote-ref-1"`, `href="#footnote-ref-1-2"`,
	} {
		if !strings.Contains(got, want) {
			t.Errorf("normalized HTML lacks %q: %s", want, got)
		}
	}
}

func TestGoldmarkPreservesNumberedFootnoteLinks(t *testing.T) {
	content, err := renderMarkdown("A[^2] and B[^3].\n\n[^2]: First.\n[^3]: Second.\n")
	if err != nil {
		t.Fatal(err)
	}
	for _, want := range []string{`id="footnote-ref-2"`, `href="#footnote-2"`, `id="footnote-ref-3"`, `href="#footnote-3"`, `id="footnote-2"`, `id="footnote-3"`} {
		if !strings.Contains(string(content), want) {
			t.Errorf("rendered HTML lacks %q: %s", want, content)
		}
	}
}

func TestArticleOutline(t *testing.T) {
	content := template.HTML(`<h2 id="one">One <code>thing</code></h2><h3 id="two">Two &amp; more</h3><h2 id="three">Three</h2><h2 id="four">Four</h2><h2 id="five">Five</h2>`)
	if got := articleOutline(content); got != nil {
		t.Fatalf("short article has an outline: %+v", got)
	}
	got := articleOutline(content + `<h2 id="six">Six</h2>`)
	if len(got) != 6 || got[0].Title != "One thing" || got[1].Title != "Two & more" || got[1].Level != "3" || got[5].ID != "six" {
		t.Fatalf("unexpected outline: %+v", got)
	}
}

func TestTLDRAfterEditNote(t *testing.T) {
	content := `<p><strong>Edit:</strong> Later context.</p><p><strong>TL;DR:</strong> The summary.</p>`
	if got := tldrParagraph.FindString(content); got != `<p><strong>TL;DR:</strong> The summary.</p>` {
		t.Fatalf("TL;DR paragraph = %q", got)
	}
}

func TestGoldmarkContent(t *testing.T) {
	content, err := renderMarkdown("## ML/AI & More\n\nA soft\nline and a hard  \nbreak.[^1] Again.[^1]\n\n[^1]: A note.\n\n| A | B |\n| - | - |\n| 1 | 2 |\n")
	if err != nil {
		t.Fatal(err)
	}
	for _, want := range []string{`id="mlai-more"`, `id="footnote-ref-1"`, `id="footnote-ref-1-2"`, `id="footnote-1"`, `id="footnote-label"`, "<table>", "<br"} {
		if !strings.Contains(string(content), want) {
			t.Errorf("rendered HTML lacks %q: %s", want, content)
		}
	}
}

func TestPublicPathsAndResponses(t *testing.T) {
	t.Chdir(t.TempDir())
	if err := os.MkdirAll("_site", 0755); err != nil {
		t.Fatal(err)
	}
	for _, name := range []string{"index.html", "404.html", "style.css"} {
		if err := os.WriteFile(filepath.Join("_site", name), []byte("<!DOCTYPE html>"+name), 0644); err != nil {
			t.Fatal(err)
		}
	}
	for _, path := range []string{"/_posts/private.md", "/posts/../README.md", "/posts//x.html", "/posts/%2e%2e/README.md"} {
		if publicPath(path) != "" {
			t.Errorf("accepted private path %q", path)
		}
	}
	for _, test := range []struct {
		method string
		path   string
		status int
		body   bool
	}{
		{"GET", "/", 200, true},
		{"HEAD", "/", 200, false},
		{"GET", "/style.css", 200, true},
		{"GET", "/missing", 404, true},
		{"HEAD", "/missing", 404, false},
		{"POST", "/", 405, true},
	} {
		request := httptest.NewRequest(test.method, test.path, nil)
		response := httptest.NewRecorder()
		siteHandler().ServeHTTP(response, request)
		if response.Code != test.status || (response.Body.Len() > 0) != test.body {
			t.Errorf("%s %s: status %d, body %q", test.method, test.path, response.Code, response.Body.String())
		}
		if test.status == http.StatusMethodNotAllowed && response.Header().Get("Allow") != "GET, HEAD" {
			t.Error("method response has no Allow header")
		}
		if test.path == "/style.css" && !strings.HasPrefix(response.Header().Get("Content-Type"), "text/css") {
			t.Errorf("style response has wrong content type: %q", response.Header().Get("Content-Type"))
		}
	}
}
