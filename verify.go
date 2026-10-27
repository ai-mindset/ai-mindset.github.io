package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html"
	"net/url"
	"os"
	"path/filepath"
	"reflect"
	"regexp"
	"strings"
)

type searchPost struct {
	Title string   `json:"title"`
	Date  string   `json:"date"`
	Tags  []string `json:"tags"`
	URL   string   `json:"url"`
	Text  string   `json:"text"`
}

var htmlReference = regexp.MustCompile(`(?:href|src)="([^"]+)"`)
var htmlID = regexp.MustCompile(`[[:space:]]id="([^"]+)"`)

func verifySite() error {
	index, err := os.ReadFile("_site/posts.json")
	if err != nil {
		return err
	}
	var posts []searchPost
	if err := json.Unmarshal(index, &posts); err != nil {
		return err
	}
	if len(posts) == 0 {
		return fmt.Errorf("posts.json is empty")
	}
	seen := map[string]bool{}
	for i, post := range posts {
		if post.Title == "" || post.Text == "" || len(post.Tags) == 0 || !strings.HasPrefix(post.URL, "/posts/") || !strings.HasSuffix(post.URL, ".html") {
			return fmt.Errorf("invalid post index entry %d", i)
		}
		if seen[post.URL] || (i > 0 && posts[i-1].Date < post.Date) {
			return fmt.Errorf("duplicate or unsorted post %s", post.URL)
		}
		seen[post.URL] = true
		if err := verifyHTML(strings.TrimPrefix(post.URL, "/")); err != nil {
			return err
		}
	}
	for _, file := range []string{"index.html", "about.html", "aihub.html", "404.html"} {
		if err := verifyHTML(file); err != nil {
			return err
		}
	}
	for file := range publicFiles {
		if _, err := os.Stat(filepath.Join("_site", file)); err != nil {
			return err
		}
	}
	snapshot, err := readVisitorSnapshot()
	if err != nil {
		return err
	}
	generated, err := os.ReadFile("_site/counter/visitors.json")
	if err != nil {
		return err
	}
	copy, err := decodeVisitorSnapshot(generated)
	if err != nil {
		return err
	}
	if !reflect.DeepEqual(copy, snapshot) {
		return fmt.Errorf("generated visitor snapshot differs from source")
	}
	fmt.Printf("Verified %d posts and 2 standalone pages.\n", len(posts))
	return nil
}

func verifyHTML(file string) error {
	content, err := os.ReadFile(filepath.Join("_site", file))
	if err != nil {
		return err
	}
	if !bytes.HasPrefix(content, []byte("<!DOCTYPE html>")) {
		return fmt.Errorf("%s is not an HTML document", file)
	}
	if bytes.Contains(content, []byte("POST_TITLE")) || bytes.Contains(content, []byte("{{")) {
		return fmt.Errorf("%s contains an unresolved template", file)
	}
	ids := map[string]bool{}
	for _, match := range htmlID.FindAllSubmatch(content, -1) {
		id := string(match[1])
		if ids[id] {
			return fmt.Errorf("%s contains duplicate id %s", file, id)
		}
		ids[id] = true
	}
	base, _ := url.Parse("https://site.invalid/" + file)
	for _, match := range htmlReference.FindAllSubmatch(content, -1) {
		reference := html.UnescapeString(string(match[1]))
		if strings.HasPrefix(reference, "mailto:") || strings.HasPrefix(reference, "data:") || reference == "#" {
			continue
		}
		target, err := base.Parse(reference)
		if err != nil {
			return fmt.Errorf("%s: invalid link %s: %w", file, reference, err)
		}
		if target.Scheme != "http" && target.Scheme != "https" {
			return fmt.Errorf("%s: unsupported link scheme %s", file, reference)
		}
		if target.Host != "site.invalid" {
			continue
		}
		path := publicPath(target.Path)
		if path == "" {
			return fmt.Errorf("%s links to non-public path %s", file, reference)
		}
		targetHTML, err := os.ReadFile(filepath.Join("_site", path))
		if err != nil {
			return fmt.Errorf("%s links to missing %s", file, reference)
		}
		if target.Fragment != "" {
			found := false
			for _, id := range htmlID.FindAllSubmatch(targetHTML, -1) {
				if string(id[1]) == target.Fragment {
					found = true
					break
				}
			}
			if !found {
				return fmt.Errorf("%s links to missing fragment %s", file, reference)
			}
		}
	}
	return nil
}
