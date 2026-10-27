package main

import (
	"encoding/json"
	"fmt"
	"html"
	"html/template"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"time"
)

type postPage struct {
	Title       string
	Date        string
	DisplayDate string
	Year        string
	Month       string
	Tags        []string
	URL         string
	Content     template.HTML
	Summary     template.HTML
	Text        string
}

type timelineMonth struct {
	Number string
	Name   string
}

type timelineYear struct {
	Year   string
	Months []timelineMonth
}

type outlineEntry struct {
	ID    string
	Title string
	Level string
}

type pageData struct {
	Title        string
	Date         string
	DisplayDate  string
	Tags         []string
	Content      template.HTML
	Outline      []outlineEntry
	Posts        []postPage
	Years        []timelineYear
	VisitorTotal string
}

var tagPattern = regexp.MustCompile(`<[^>]*>`)
var firstHeading = regexp.MustCompile(`(?m)^# (.+)$`)
var tldrParagraph = regexp.MustCompile(`(?s)<p>\s*<strong>TL;DR:</strong>.*?</p>`)
var outlineHeading = regexp.MustCompile(`(?s)<h([23]) id="([^"]+)">(.*?)</h[23]>`)

func buildSite() error {
	if err := auditContent(); err != nil {
		return err
	}
	snapshot, err := readVisitorSnapshot()
	if err != nil {
		return err
	}
	if err := os.RemoveAll("_site"); err != nil {
		return err
	}
	for _, directory := range []string{"_site", "_site/posts", "_site/counter"} {
		if err := os.MkdirAll(directory, 0755); err != nil {
			return err
		}
	}
	for _, file := range []string{"app.js", "favicon.ico", "robots.txt", "style.css"} {
		if err := copyFile(filepath.Join("site", file), filepath.Join("_site", file)); err != nil {
			return err
		}
	}
	if err := os.CopyFS("_site/images", os.DirFS("site/images")); err != nil {
		return err
	}
	if err := copyFile("counter/visitors.json", "_site/counter/visitors.json"); err != nil {
		return err
	}

	posts, err := buildPosts()
	if err != nil {
		return err
	}
	for _, page := range []struct{ source, output string }{
		{"content/pages/about.md", "about.html"},
		{"content/pages/aihub.md", "aihub.html"},
	} {
		if err := buildStandalone(page.source, page.output); err != nil {
			return err
		}
	}
	index := pageData{Posts: posts, VisitorTotal: formatCount(snapshot.Total)}
	index.Tags, index.Years = indexControls(posts)
	if err := writePage("index", "_site/index.html", index); err != nil {
		return err
	}
	if err := writePage("404", "_site/404.html", pageData{Title: "404 - Page Not Found"}); err != nil {
		return err
	}
	fmt.Printf("Generated %d posts and 2 standalone pages.\n", len(posts))
	return nil
}

func buildPosts() ([]postPage, error) {
	paths, err := markdownFiles("content/posts")
	if err != nil {
		return nil, err
	}
	var posts []postPage
	for _, path := range paths {
		doc, err := readDocument(path)
		if err != nil {
			return nil, err
		}
		if doc.Meta.Draft {
			continue
		}
		match := postFilename.FindStringSubmatch(filepath.Base(path))
		date, err := time.Parse("2006-01-02", doc.Meta.Date)
		if err != nil {
			return nil, err
		}
		content, err := renderMarkdown(doc.Body)
		if err != nil {
			return nil, fmt.Errorf("%s: %w", path, err)
		}
		summary := template.HTML(tldrParagraph.FindString(string(content)))
		if summary == "" {
			return nil, fmt.Errorf("%s: missing TL;DR paragraph", path)
		}
		post := postPage{
			Title:       doc.Meta.Title,
			Date:        doc.Meta.Date,
			DisplayDate: date.Format("January 2, 2006"),
			Year:        date.Format("2006"),
			Month:       date.Format("01"),
			Tags:        doc.Meta.Tags,
			URL:         "/posts/" + match[2] + ".html",
			Content:     content,
			Summary:     summary,
			Text:        html.UnescapeString(tagPattern.ReplaceAllString(string(content), " ")),
		}
		if err := writePage("article", "_site"+post.URL, pageData{
			Title: post.Title, Date: post.Date, DisplayDate: post.DisplayDate,
			Tags: post.Tags, Content: post.Content, Outline: articleOutline(post.Content),
		}); err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}
	sort.Slice(posts, func(i, j int) bool {
		if posts[i].Date != posts[j].Date {
			return posts[i].Date > posts[j].Date
		}
		return posts[i].Title < posts[j].Title
	})
	index := make([]searchPost, 0, len(posts))
	for _, post := range posts {
		index = append(index, searchPost{post.Title, post.Date, post.Tags, post.URL, post.Text})
	}
	data, err := json.MarshalIndent(index, "", "  ")
	if err != nil {
		return nil, err
	}
	if err := os.WriteFile("_site/posts.json", append(data, '\n'), 0644); err != nil {
		return nil, err
	}
	return posts, nil
}

func buildStandalone(source, output string) error {
	doc, err := readDocument(source)
	if err != nil {
		return err
	}
	title := doc.Meta.Title
	body := doc.Body
	if match := firstHeading.FindStringSubmatchIndex(body); match != nil {
		if title == "" {
			title = strings.TrimSpace(body[match[2]:match[3]])
		}
		body = strings.TrimSpace(body[:match[0]] + body[match[1]:])
	}
	if title == "" {
		title = strings.TrimSuffix(output, ".html")
	}
	content, err := renderMarkdown(body)
	if err != nil {
		return fmt.Errorf("%s: %w", source, err)
	}
	return writePage("article", filepath.Join("_site", output), pageData{
		Title: title, Content: content,
	})
}

func indexControls(posts []postPage) ([]string, []timelineYear) {
	tagSet := map[string]bool{}
	monthSet := map[string]map[string]bool{}
	for _, post := range posts {
		for _, tag := range post.Tags {
			tagSet[tag] = true
		}
		if monthSet[post.Year] == nil {
			monthSet[post.Year] = map[string]bool{}
		}
		monthSet[post.Year][post.Month] = true
	}
	var tags []string
	for tag := range tagSet {
		tags = append(tags, tag)
	}
	sort.Strings(tags)
	var years []timelineYear
	for year, months := range monthSet {
		entry := timelineYear{Year: year}
		for month := range months {
			date, _ := time.Parse("2006-01", year+"-"+month)
			name := date.Format("January")
			entry.Months = append(entry.Months, timelineMonth{month, name})
		}
		sort.Slice(entry.Months, func(i, j int) bool {
			return entry.Months[i].Number < entry.Months[j].Number
		})
		years = append(years, entry)
	}
	sort.Slice(years, func(i, j int) bool { return years[i].Year > years[j].Year })
	return tags, years
}

func articleOutline(content template.HTML) []outlineEntry {
	var entries []outlineEntry
	for _, match := range outlineHeading.FindAllStringSubmatch(string(content), -1) {
		entries = append(entries, outlineEntry{
			ID: match[2], Title: html.UnescapeString(tagPattern.ReplaceAllString(match[3], "")), Level: match[1],
		})
	}
	if len(entries) < 6 {
		return nil
	}
	return entries
}

func writePage(kind, output string, data pageData) error {
	template, err := template.New("base.tmpl").Funcs(template.FuncMap{
		"join": strings.Join,
	}).ParseFiles("site/base.tmpl", "site/"+kind+".tmpl")
	if err != nil {
		return err
	}
	file, err := os.Create(output)
	if err != nil {
		return err
	}
	defer file.Close()
	return template.ExecuteTemplate(file, "base", data)
}

func copyFile(source, destination string) error {
	data, err := os.ReadFile(source)
	if err != nil {
		return err
	}
	return os.WriteFile(destination, data, 0644)
}
