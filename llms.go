package main

import (
	"bufio"
	"bytes"
	"fmt"
	"io/ioutil"
	"sort"
	"strings"
	"time"
)

const (
	postsHeader     = "## Posts (Reverse Chronological Order)"
	llmstxtFilePath = "llms.txt"
	postsDirectory  = "_posts"
)

func main() {
	// Read and parse posts
	entries, err := generatePostEntries()
	if err != nil {
		fmt.Printf("Error generating post entries: %v\n", err)
		return
	}

	// Sort entries by date (newest first)
	sortEntriesByDate(&entries)

	// Update llms.txt with new entries
	if err := updateReadmePostsSection(entries); err != nil {
		fmt.Printf("Error updating file: %v\n", err)
		return
	}

	fmt.Printf("%v updated successfully.", llmstxtFilePath)
}

func generatePostEntries() ([]string, error) {
	files, err := ioutil.ReadDir(postsDirectory)
	if err != nil {
		return nil, fmt.Errorf("reading directory: %w", err)
	}

	var entries []string
	for _, file := range files {
		if !file.IsDir() && strings.HasSuffix(file.Name(), ".md") {
			entry, err := processPostFile(file.Name())
			if err != nil {
				fmt.Printf("Warning: Skipping file %s: %v\n", file.Name(), err)
				continue
			}
			entries = append(entries, entry)
		}
	}
	return entries, nil
}

func processPostFile(filename string) (string, error) {
	parts := strings.SplitN(filename, "-", 4)
	if len(parts) < 4 {
		return "", fmt.Errorf("invalid filename format")
	}

	dateStr := strings.Join(parts[:3], "-")
	titleSegments := strings.TrimSuffix(parts[3], ".md")
	title := strings.Title(strings.ReplaceAll(titleSegments, "-", " "))
	url := fmt.Sprintf("https://ai-mindset.github.io/%s/", titleSegments)

	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return "", fmt.Errorf("parsing date: %w", err)
	}

	return fmt.Sprintf("%s - [%s](%s)", date.Format("January 2, 2006"), title, url), nil
}

func updateReadmePostsSection(entries []string) error {
	content, err := ioutil.ReadFile(llmstxtFilePath)
	if err != nil {
		return fmt.Errorf("reading llms.txt: %w", err)
	}

	var buf bytes.Buffer
	scanner := bufio.NewScanner(bytes.NewReader(content))
	inPostsSection := false
	foundPostsSection := false

	for scanner.Scan() {
		line := scanner.Text()

		if strings.HasPrefix(line, "## ") {
			if line == postsHeader {
				inPostsSection = true
				foundPostsSection = true
				buf.WriteString(line + "\n\n")
				buf.WriteString(strings.Join(entries, "\n") + "\n\n")
				continue
			} else if inPostsSection {
				inPostsSection = false
			}
		}

		if !inPostsSection {
			buf.WriteString(line + "\n")
		}
	}

	if !foundPostsSection {
		return fmt.Errorf("posts section not found in %v", llmstxtFilePath)
	}

	return ioutil.WriteFile(llmstxtFilePath, buf.Bytes(), 0644)
}

func sortEntriesByDate(entries *[]string) {
	type datedEntry struct {
		date  time.Time
		entry string
	}
	var datedEntries []datedEntry

	for _, entry := range *entries {
		parts := strings.SplitN(entry, " - ", 2)
		if len(parts) < 2 {
			continue
		}
		date, err := time.Parse("January 2, 2006", parts[0])
		if err != nil {
			continue
		}
		datedEntries = append(datedEntries, datedEntry{date: date, entry: entry})
	}

	sort.Slice(datedEntries, func(i, j int) bool {
		return datedEntries[i].date.After(datedEntries[j].date)
	})

	sortedEntries := make([]string, len(datedEntries))
	for i, de := range datedEntries {
		sortedEntries[i] = de.entry
	}
	*entries = sortedEntries
}
