#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const marked = require('marked');
const matter = require('gray-matter');

const POSTS_DIR = './_posts';
const POSTS_OUTPUT_DIR = './posts';
const JSON_OUTPUT = './posts.json';

// Make sure output directory exists
if (!fs.existsSync(POSTS_OUTPUT_DIR)) {
  fs.mkdirSync(POSTS_OUTPUT_DIR, { recursive: true });
}

// Get post template
const postTemplate = fs.readFileSync('./post-template.html', 'utf8');

// Process markdown files
function processMarkdownFiles() {
  const postFiles = fs.readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.md'));
  
  const posts = [];
  
  postFiles.forEach(file => {
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdown } = matter(content);
    
    // Skip drafts
    if (data.draft) return;
    
    // Extract date and slug from filename (YYYY-MM-DD-slug.md)
    const fileNameParts = file.split('-');
    const dateStr = `${fileNameParts[0]}-${fileNameParts[1]}-${fileNameParts[2]}`;
    const slug = file.slice(11, -3); // Remove date and .md extension
    
    // Generate HTML from markdown
    const htmlContent = marked.parse(markdown);
    
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
    generatePostHTML(post, slug);
  });
  
  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Save posts to JSON
  fs.writeFileSync(JSON_OUTPUT, JSON.stringify(posts, null, 2));
  
  console.log(`Processed ${posts.length} posts`);
  return posts;
}

// Generate HTML file for a post
function generatePostHTML(post, slug) {
  let html = postTemplate;
  
  // Replace placeholders
  html = html.replace(/POST_TITLE/g, post.title);
  html = html.replace(/POST_DATE/g, new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));
  
  // Generate tags HTML
  const tagsHTML = post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('');
  html = html.replace(/<!-- POST_TAGS will be inserted here -->/, tagsHTML);
  
  // Insert content
  html = html.replace(/<!-- POST_CONTENT will be inserted here -->/, post.content);
  
  // Write to file
  const outputPath = path.join(POSTS_OUTPUT_DIR, `${slug}.html`);
  fs.writeFileSync(outputPath, html);
  console.log(`Generated ${outputPath}`);
}

// Process standalone markdown files
function processStandaloneMarkdown() {
  const standaloneFiles = ['about.md', 'aihub.md'];
  
  standaloneFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const { data, content: markdown } = matter(content);
      
      // Remove the first heading (# Title) from the markdown content
      let cleanedMarkdown = markdown;
      const titleMatch = markdown.match(/^\s*#\s+(.+)$/m);
      
      if (titleMatch) {
        // Use the heading text as the title and remove it from content
        const title = titleMatch[1];
        cleanedMarkdown = markdown.replace(/^\s*#\s+(.+)$/m, '').trim();
        
        // Generate HTML from markdown without the title
        const htmlContent = marked.parse(cleanedMarkdown);
        
        // Create page object
        const page = {
          title: data.title || title,
          content: htmlContent
        };
        
        // Generate HTML file
        const slug = file.replace('.md', '');
        generateStandaloneHTML(page, slug);
      } else {
        // If no title found, use the default approach
        const htmlContent = marked.parse(markdown);
        
        // Create page object
        const page = {
          title: data.title || file.replace('.md', ''),
          content: htmlContent
        };
        
        // Generate HTML file
        const slug = file.replace('.md', '');
        generateStandaloneHTML(page, slug);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  });
}

// Generate HTML file for a standalone page
function generateStandaloneHTML(page, slug) {
  let html = postTemplate;
  
  // Replace placeholders
  html = html.replace(/POST_TITLE/g, page.title);
  html = html.replace(/POST_DATE/g, ''); // No date for standalone pages
  
  // Remove tags section
  html = html.replace(/<div class="post-tags">[\s\S]*?<\/div>/, '');
  
  // Insert content
  html = html.replace(/<!-- POST_CONTENT will be inserted here -->/, page.content);
  
  // Write to file
  const outputPath = `./${slug}.html`;
  fs.writeFileSync(outputPath, html);
  console.log(`Generated ${outputPath}`);
}

// Main build process
function build() {
  console.log('Building blog...');
  const posts = processMarkdownFiles();
  processStandaloneMarkdown();
  console.log('Build complete!');
}

build();