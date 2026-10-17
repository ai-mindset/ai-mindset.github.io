package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

type metadata struct {
	Layout string
	Title  string
	Date   string
	Tags   []string
	Draft  bool
}

type document struct {
	Path string
	Meta metadata
	Body string
}

var postFilename = regexp.MustCompile(`^(\d{4}-\d{2}-\d{2})-(.+)\.md$`)
var footnoteDefinition = regexp.MustCompile(`(?m)^\[\^([^]]+)\]:`)
var footnoteReference = regexp.MustCompile(`\[\^([^]]+)\]`)
var tldrPattern = regexp.MustCompile(`(?m)^\*\*TL;DR:\*\*`)

func markdownFiles(directory string) ([]string, error) {
	entries, err := os.ReadDir(directory)
	if err != nil {
		return nil, err
	}
	var paths []string
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".md") {
			paths = append(paths, filepath.Join(directory, entry.Name()))
		}
	}
	return paths, nil
}

func readDocument(path string) (document, error) {
	source, err := os.ReadFile(path)
	if err != nil {
		return document{}, err
	}
	meta, body, err := parseDocument(string(source))
	if err != nil {
		return document{}, fmt.Errorf("%s: %w", path, err)
	}
	return document{Path: path, Meta: meta, Body: body}, nil
}

func parseDocument(source string) (metadata, string, error) {
	source = strings.ReplaceAll(source, "\r\n", "\n")
	if !strings.HasPrefix(source, "---\n") {
		return metadata{}, source, nil
	}
	end := strings.Index(source[4:], "\n---\n")
	if end < 0 {
		return metadata{}, "", fmt.Errorf("unterminated front matter")
	}
	front := strings.Split(source[4:4+end], "\n")
	body := source[4+end+5:]
	var meta metadata
	for index := 0; index < len(front); index++ {
		line := strings.TrimSpace(front[index])
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		key, value, ok := strings.Cut(line, ":")
		if !ok {
			return metadata{}, "", fmt.Errorf("front matter line %d has no colon", index+2)
		}
		value = strings.TrimSpace(value)
		if strings.TrimSpace(key) == "tags" && value == "" && index+1 < len(front) {
			next := strings.TrimSpace(front[index+1])
			if strings.HasPrefix(next, "[") {
				index++
				value = next
			}
		}
		if strings.HasPrefix(value, "[") && !strings.HasSuffix(value, "]") {
			for !strings.HasSuffix(strings.TrimSpace(value), "]") {
				index++
				if index >= len(front) {
					return metadata{}, "", fmt.Errorf("unterminated front matter list")
				}
				value += "\n" + front[index]
			}
		}
		switch strings.TrimSpace(key) {
		case "layout":
			meta.Layout = parseScalar(value)
		case "title":
			meta.Title = parseScalar(value)
		case "date":
			meta.Date = parseScalar(value)
		case "draft":
			meta.Draft = value == "true"
		case "tags":
			value = strings.TrimSpace(value)
			if !strings.HasPrefix(value, "[") || !strings.HasSuffix(value, "]") {
				return metadata{}, "", fmt.Errorf("tags must be a flow list")
			}
			for _, tag := range strings.Split(value[1:len(value)-1], ",") {
				if tag = parseScalar(tag); tag != "" {
					meta.Tags = append(meta.Tags, tag)
				}
			}
		}
	}
	return meta, body, nil
}

func parseScalar(value string) string {
	value = strings.TrimSpace(value)
	if len(value) >= 2 && value[0] == '"' && value[len(value)-1] == '"' {
		if decoded, err := strconv.Unquote(value); err == nil {
			return decoded
		}
		return value[1 : len(value)-1]
	}
	if len(value) >= 2 && value[0] == '\'' && value[len(value)-1] == '\'' {
		return strings.ReplaceAll(value[1:len(value)-1], "''", "'")
	}
	return value
}

func auditContent() error {
	var problems []string
	for _, directory := range []string{"content/pages", "content/posts"} {
		paths, err := markdownFiles(directory)
		if err != nil {
			return err
		}
		for _, path := range paths {
			doc, err := readDocument(path)
			if err != nil {
				problems = append(problems, err.Error())
				continue
			}
			for _, issue := range auditDocument(doc) {
				problems = append(problems, path+": "+issue)
			}
		}
	}
	if len(problems) > 0 {
		return fmt.Errorf("content audit failed:\n%s", strings.Join(problems, "\n"))
	}
	fmt.Println("Content audit passed.")
	return nil
}

func auditDocument(doc document) []string {
	var issues []string
	prose := withoutFencedCode(doc.Body)
	for _, check := range []struct {
		pattern string
		message string
	}{
		{`[—–]`, "contains an em dash or en dash"},
		{`\\ `, "contains a literal backslash-space"},
		{`(?m)^>[^\n]*[ \t]>[ \t]`, "contains a collapsed blockquote"},
		{`\{\{\s*site\.baseurl|\{%\s*link\b`, "contains a legacy Jekyll link"},
		{`https://ai-mindset\.github\.io/`, "uses an absolute URL for an internal link"},
		{`raw\.githubusercontent\.com/ai-mindset/ai-mindset\.github\.io`, "loads a site image through raw.githubusercontent.com"},
	} {
		if regexp.MustCompile(check.pattern).MatchString(prose) {
			issues = append(issues, check.message)
		}
	}
	definitions := map[string]bool{}
	for _, match := range footnoteDefinition.FindAllStringSubmatch(prose, -1) {
		if definitions[match[1]] {
			issues = append(issues, "duplicate footnote "+match[1])
		}
		definitions[match[1]] = true
	}
	references := map[string]bool{}
	for _, match := range footnoteReference.FindAllStringSubmatchIndex(prose, -1) {
		if match[1] < len(prose) && prose[match[1]] == ':' {
			continue
		}
		name := prose[match[2]:match[3]]
		references[name] = true
		if !definitions[name] {
			issues = append(issues, "undefined footnote "+name)
		}
	}
	for name := range definitions {
		if !references[name] {
			issues = append(issues, "unused footnote "+name)
		}
	}
	if strings.HasPrefix(doc.Path, "content/posts/") {
		match := postFilename.FindStringSubmatch(filepath.Base(doc.Path))
		if match == nil {
			issues = append(issues, "filename must be YYYY-MM-DD-slug.md")
		} else if doc.Meta.Date != match[1] {
			issues = append(issues, "front matter date does not match filename")
		}
		if doc.Meta.Layout != "post" {
			issues = append(issues, "layout must be post")
		}
		if doc.Meta.Title == "" || len(doc.Meta.Tags) == 0 {
			issues = append(issues, "title and tags must be non-empty")
		}
		if _, err := time.Parse("2006-01-02", doc.Meta.Date); err != nil {
			issues = append(issues, "invalid post date")
		}
		if !tldrPattern.MatchString(doc.Body) {
			issues = append(issues, "has no TL;DR")
		}
		if !strings.Contains(doc.Body, "<!--more-->") {
			issues = append(issues, "has no excerpt marker")
		}
	}
	sort.Strings(issues)
	return issues
}

func withoutFencedCode(source string) string {
	var lines []string
	inFence := false
	for _, line := range strings.Split(source, "\n") {
		if strings.HasPrefix(strings.TrimSpace(line), "```") {
			inFence = !inFence
			continue
		}
		if !inFence {
			lines = append(lines, line)
		}
	}
	return strings.Join(lines, "\n")
}
