package main

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
)

var publicDirectories = map[string]bool{"counter": true, "images": true, "posts": true}
var publicFiles = map[string]bool{
	"404.html": true, "about.html": true, "aihub.html": true,
	"app.js": true, "favicon.ico": true, "index.html": true,
	"posts.json": true, "robots.txt": true, "style.css": true,
}

func publicPath(urlPath string) string {
	decoded, err := url.PathUnescape(urlPath)
	if err != nil {
		return ""
	}
	urlPath = decoded
	if urlPath == "/" {
		return "index.html"
	}
	if !strings.HasPrefix(urlPath, "/") {
		return ""
	}
	relative := strings.TrimPrefix(urlPath, "/")
	parts := strings.Split(relative, "/")
	for _, part := range parts {
		if part == "" || part == "." || part == ".." || strings.Contains(part, "\\") {
			return ""
		}
	}
	if len(parts) == 1 && publicFiles[relative] {
		return relative
	}
	if len(parts) > 1 && publicDirectories[parts[0]] {
		return relative
	}
	return ""
}

func siteHandler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			w.Header().Set("Allow", "GET, HEAD")
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("X-Content-Type-Options", "nosniff")
		file := publicPath(r.URL.Path)
		if file != "" {
			if info, err := os.Stat("_site/" + file); err == nil && info.Mode().IsRegular() {
				http.ServeFile(w, r, "_site/"+file)
				return
			}
		}
		body, err := os.ReadFile("_site/404.html")
		if err != nil {
			http.Error(w, "Not found", http.StatusNotFound)
			return
		}
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.WriteHeader(http.StatusNotFound)
		if r.Method == http.MethodGet {
			_, _ = w.Write(body)
		}
	})
}

func serveSite() error {
	port := 8000
	if len(os.Args) > 2 {
		var err error
		port, err = strconv.Atoi(os.Args[2])
		if err != nil || port < 1 || port > 65535 {
			return fmt.Errorf("invalid port %q", os.Args[2])
		}
	}
	address := fmt.Sprintf("127.0.0.1:%d", port)
	fmt.Printf("Site available at http://%s\n", address)
	return http.ListenAndServe(address, siteHandler())
}
