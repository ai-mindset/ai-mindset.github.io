package main

import (
	"fmt"
	"html"
	"net/http"
	"sort"
	"strings"
	"sync"
	"time"
)

func checkExternalLinks() error {
	references := map[string][]string{}
	for _, directory := range []string{"content/pages", "content/posts"} {
		files, err := markdownFiles(directory)
		if err != nil {
			return err
		}
		for _, file := range files {
			doc, err := readDocument(file)
			if err != nil {
				return err
			}
			rendered, err := renderMarkdown(doc.Body)
			if err != nil {
				return fmt.Errorf("%s: %w", file, err)
			}
			for _, match := range htmlReference.FindAllStringSubmatch(string(rendered), -1) {
				address := html.UnescapeString(match[1])
				if strings.HasPrefix(address, "http://") || strings.HasPrefix(address, "https://") {
					references[address] = append(references[address], file)
				}
			}
		}
	}
	addresses := make([]string, 0, len(references))
	for address := range references {
		addresses = append(addresses, address)
	}
	sort.Strings(addresses)
	jobs := make(chan string)
	var failures []string
	var lock sync.Mutex
	client := &http.Client{Timeout: 15 * time.Second}
	var workers sync.WaitGroup
	for range 8 {
		workers.Add(1)
		go func() {
			defer workers.Done()
			for address := range jobs {
				if err := checkLink(client, address); err != nil {
					lock.Lock()
					failures = append(failures, fmt.Sprintf("%s: %v (%s)", address, err, strings.Join(references[address], ", ")))
					lock.Unlock()
				}
			}
		}()
	}
	for _, address := range addresses {
		jobs <- address
	}
	close(jobs)
	workers.Wait()
	if len(failures) > 0 {
		sort.Strings(failures)
		failed := len(failures)
		if len(failures) > 50 {
			failures = failures[:50]
		}
		return fmt.Errorf("%d of %d external links failed:\n%s", failed, len(addresses), strings.Join(failures, "\n"))
	}
	fmt.Printf("Checked %d external links.\n", len(addresses))
	return nil
}

func checkLink(client *http.Client, address string) error {
	request, err := http.NewRequest(http.MethodGet, address, nil)
	if err != nil {
		return err
	}
	request.Header.Set("Accept", "text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.1")
	request.Header.Set("Range", "bytes=0-0")
	request.Header.Set("User-Agent", "ai-mindset-content-link-checker/1.0")
	response, err := client.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()
	if response.StatusCode < 400 || response.StatusCode == 401 || response.StatusCode == 403 || response.StatusCode == 405 || response.StatusCode == 429 {
		return nil
	}
	return fmt.Errorf("HTTP %d", response.StatusCode)
}
