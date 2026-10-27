package main

import (
	"bytes"
	"html"
	"html/template"
	"regexp"
	"strconv"
	"strings"
	"unicode"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	goldmarkHTML "github.com/yuin/goldmark/renderer/html"
)

var markdown = goldmark.New(
	goldmark.WithExtensions(extension.GFM, extension.Footnote),
	goldmark.WithRendererOptions(goldmarkHTML.WithUnsafe()),
)

var headingHTML = regexp.MustCompile(`(?s)<h([1-6])>(.*?)</h[1-6]>`)
var footnoteID = regexp.MustCompile(`(?:id|href)="#?fn(ref[0-9]*)?:[0-9]+"`)
var footnotesStart = regexp.MustCompile(`<(section|div) class="footnotes"[^>]*>`)

func renderMarkdown(source string) (template.HTML, error) {
	var output bytes.Buffer
	if err := markdown.Convert([]byte(source), &output); err != nil {
		return "", err
	}
	return template.HTML(normalizeMarkdownHTML(output.String(), sourceFootnoteNumbers(source))), nil
}

// normalizeMarkdownHTML preserves fragment IDs from the published site.
func normalizeMarkdownHTML(result string, numbers []string) string {
	counts := map[string]int{}
	result = headingHTML.ReplaceAllStringFunc(result, func(heading string) string {
		parts := headingHTML.FindStringSubmatch(heading)
		plain := html.UnescapeString(tagPattern.ReplaceAllString(parts[2], ""))
		slug := headingSlug(plain)
		counts[slug]++
		if counts[slug] > 1 {
			slug += "-" + strconv.Itoa(counts[slug])
		}
		return "<h" + parts[1] + ` id="` + slug + `">` + parts[2] + "</h" + parts[1] + ">"
	})
	result = footnoteID.ReplaceAllStringFunc(result, func(id string) string {
		at := strings.Index(id, "fn")
		label := id[at+2 : len(id)-1]
		if strings.HasPrefix(label, "ref") {
			ref, number, _ := strings.Cut(strings.TrimPrefix(label, "ref"), ":")
			number = sourceFootnoteNumber(number, numbers)
			if ref == "" {
				return id[:at] + "footnote-ref-" + number + `"`
			}
			extra, _ := strconv.Atoi(ref)
			return id[:at] + "footnote-ref-" + number + "-" + strconv.Itoa(extra+1) + `"`
		}
		return id[:at] + "footnote-" + sourceFootnoteNumber(strings.TrimPrefix(label, ":"), numbers) + `"`
	})
	if !strings.Contains(result, `id="footnote-label"`) {
		result = footnotesStart.ReplaceAllStringFunc(result, func(start string) string {
			return start + `<h2 id="footnote-label" class="sr-only">Footnotes</h2>`
		})
	}
	return result
}

func sourceFootnoteNumbers(source string) []string {
	prose := withoutFencedCode(source)
	var numbers []string
	seen := map[string]bool{}
	for _, match := range footnoteReference.FindAllStringSubmatchIndex(prose, -1) {
		if match[1] < len(prose) && prose[match[1]] == ':' {
			continue
		}
		name := prose[match[2]:match[3]]
		if !seen[name] {
			seen[name] = true
			if _, err := strconv.Atoi(name); err != nil {
				name = strconv.Itoa(len(numbers) + 1)
			}
			numbers = append(numbers, name)
		}
	}
	return numbers
}

func sourceFootnoteNumber(number string, numbers []string) string {
	index, err := strconv.Atoi(number)
	if err == nil && index > 0 && index <= len(numbers) {
		return numbers[index-1]
	}
	return number
}

func headingSlug(value string) string {
	var slug strings.Builder
	space := false
	for _, char := range strings.ToLower(value) {
		switch {
		case unicode.IsLetter(char), unicode.IsNumber(char), char == '-':
			if space && slug.Len() > 0 {
				slug.WriteByte('-')
			}
			space = false
			slug.WriteRune(char)
		case unicode.IsSpace(char):
			space = true
		}
	}
	if slug.Len() == 0 {
		return "section"
	}
	return slug.String()
}
