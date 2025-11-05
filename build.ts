#!/usr/bin/env -S deno run --allow-read --allow-write

import * as path from "https://deno.land/std/path/mod.ts";
import { extract } from "https://deno.land/std/front_matter/yaml.ts";
import { marked } from "https://deno.land/x/marked@1.0.2/mod.ts";

const POSTS_DIR = "./_posts";
const POSTS_OUTPUT_DIR = "./posts";
const JSON_OUTPUT = "./posts.json";

// Configure markdown parser
marked.setOptions({
  gfm: true,
  breaks: true,
  silent: false
});

// Make sure output directory exists
try {
  const postsDirInfo = await Deno.stat(POSTS_OUTPUT_DIR);
  if (!postsDirInfo.isDirectory) {
    await Deno.mkdir(POSTS_OUTPUT_DIR, { recursive: true });
  }
} catch (err) {
  if (err instanceof Deno.errors.NotFound) {
    await Deno.mkdir(POSTS_OUTPUT_DIR, { recursive: true });
  } else {
    throw err;
  }
}

// Get post template
const postTemplate = await Deno.readTextFile("./post-template.html");

// Process markdown files
async function processMarkdownFiles(): Promise<any[]> {
  const posts = [];

  // Read all files in the posts directory
  const postFiles = [];
  for await (const entry of Deno.readDir(POSTS_DIR)) {
    if (entry.isFile && entry.name.endsWith(".md")) {
      postFiles.push(entry.name);
    }
  }

  for (const file of postFiles) {
    const filePath = path.join(POSTS_DIR, file);
    const content = await Deno.readTextFile(filePath);

    // Parse front matter
    const { attrs, body } = extract(content);
    const data = attrs as Record<string, any>;

    // Skip drafts
    if (data.draft) continue;

    // Extract date and slug from filename (YYYY-MM-DD-slug.md)
    const fileNameParts = file.split("-");
    const dateStr = `${fileNameParts[0]}-${fileNameParts[1]}-${fileNameParts[2]}`;
    const slug = file.slice(11, -3); // Remove date and .md extension

    // Generate HTML from markdown
    const htmlContent = marked.parse(body);

    // Create post object
    const post = {
      title: data.title,
      date: data.date || dateStr,
      tags: data.tags || [],
      url: `/posts/${slug}.html`,
      content: htmlContent
    };

    posts.push(post);

    // Generate HTML file for this post
    await generatePostHTML(post, slug);
  }

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Save posts to JSON
  await Deno.writeTextFile(JSON_OUTPUT, JSON.stringify(posts, null, 2));

  console.log(`Processed ${posts.length} posts`);
  return posts;
}

// Generate HTML file for a post
async function generatePostHTML(post: any, slug: string) {
  let html = postTemplate;

  // Replace placeholders
  html = html.replace(/POST_TITLE/g, post.title);
  html = html.replace(/POST_DATE/g, new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }));

  // Generate tags HTML
  const tagsHTML = post.tags.map((tag: string) => `<span class="post-tag">${tag}</span>`).join("");
  html = html.replace(/<!-- POST_TAGS will be inserted here -->/, tagsHTML);

  // Insert content
  html = html.replace(/<!-- POST_CONTENT will be inserted here -->/, post.content);

  // Write to file
  const outputPath = path.join(POSTS_OUTPUT_DIR, `${slug}.html`);
  await Deno.writeTextFile(outputPath, html);
  console.log(`Generated ${outputPath}`);
}

// Process standalone markdown files
async function processStandaloneMarkdown() {
  const standaloneFiles = ["about.md", "aihub.md"];

  for (const file of standaloneFiles) {
    try {
      const content = await Deno.readTextFile(file);
      let data: Record<string, any> = {};
      let body = content;

      try {
        // Try to extract front matter
        const extracted = extract(content);
        data = extracted.attrs as Record<string, any>;
        body = extracted.body;
      } catch (err) {
        // If front matter extraction fails, use the entire content as body
        console.log(`No front matter found in ${file}, using entire content as body`);
        body = content;
      }

      // Remove the first heading (# Title) from the markdown content
      let cleanedMarkdown = body;
      const titleMatch = body.match(/^\s*#\s+(.+)$/m);

      if (titleMatch) {
        // Use the heading text as the title and remove it from content
        const title = titleMatch[1];
        cleanedMarkdown = body.replace(/^\s*#\s+(.+)$/m, "").trim();

        // Generate HTML from markdown without the title
        const htmlContent = marked.parse(cleanedMarkdown);

        // Create page object
        const page = {
          title: data.title || title,
          content: htmlContent
        };

        // Generate HTML file
        const slug = file.replace(".md", "");
        await generateStandaloneHTML(page, slug);
      } else {
        // If no title found, use the default approach
        const htmlContent = marked.parse(body);

        // Create page object
        const page = {
          title: data.title || file.replace(".md", ""),
          content: htmlContent
        };

        // Generate HTML file
        const slug = file.replace(".md", "");
        await generateStandaloneHTML(page, slug);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
}

// Generate HTML file for a standalone page
async function generateStandaloneHTML(page: any, slug: string) {
  let html = postTemplate;

  // Replace placeholders
  html = html.replace(/POST_TITLE/g, page.title);
  html = html.replace(/POST_DATE/g, ""); // No date for standalone pages

  // Remove tags section
  html = html.replace(/<div class="post-tags">[\s\S]*?<\/div>/, "");

  // Insert content
  html = html.replace(/<!-- POST_CONTENT will be inserted here -->/, page.content);

  // Write to file
  const outputPath = `./${slug}.html`;
  await Deno.writeTextFile(outputPath, html);
  console.log(`Generated ${outputPath}`);
}

// Main build process
async function build() {
  console.log("Building blog...");
  await processMarkdownFiles();
  await processStandaloneMarkdown();
  console.log("Build complete!");
}

// Execute the build
await build();