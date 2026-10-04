#!/usr/bin/env -S deno run --allow-read=content,site,counter --allow-write=_site

import { Marked } from "marked";
import markedFootnote from "marked-footnote";

const postsDirectory = "content/posts";
const siteDirectory = "site";
const outputDirectory = "_site";
const postsOutputDirectory = `${outputDirectory}/posts`;
const postsIndexFile = `${outputDirectory}/posts.json`;
const standalonePages = [
  { source: "content/pages/about.md", output: "about.html" },
  { source: "content/pages/aihub.md", output: "aihub.html" },
];
const staticFiles = [
  "404.html",
  "favicon.ico",
  "index.html",
  "robots.txt",
  "script.js",
  "style.css",
];

function parseScalar(value) {
  const trimmed = value.trim();

  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null" || trimmed === "~") return null;

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => parseScalar(item))
      .filter((item) => item !== "");
  }

  const isDoubleQuoted = trimmed.startsWith('"') && trimmed.endsWith('"');
  const isSingleQuoted = trimmed.startsWith("'") && trimmed.endsWith("'");

  if (isDoubleQuoted) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed.slice(1, -1);
    }
  }

  if (isSingleQuoted) {
    return trimmed.slice(1, -1).replaceAll("''", "'");
  }

  return trimmed;
}

export function parseFrontMatter(source, filename) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return { attributes: {}, body: source };
  }

  const attributes = {};

  const lines = match[1].split(/\r?\n/);

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (line.trim() === "" || line.trimStart().startsWith("#")) continue;

    const separator = line.indexOf(":");
    if (separator === -1) {
      throw new Error(`${filename}:${index + 2}: invalid front matter`);
    }

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1);

    if (value.trimStart().startsWith("[") && !value.trimEnd().endsWith("]")) {
      const firstLine = index;

      while (++index < lines.length) {
        value += `\n${lines[index]}`;
        if (lines[index].trimEnd().endsWith("]")) break;
      }

      if (!value.trimEnd().endsWith("]")) {
        throw new Error(
          `${filename}:${firstLine + 2}: unterminated front-matter list`,
        );
      }
    }

    attributes[key] = parseScalar(value);
  }

  return { attributes, body: match[2] };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function normaliseLegacyLinks(markdown) {
  return markdown.replace(
    /\{\{\s*site\.baseurl\s*\}\}\s*\{%\s*link\s+_posts\/\d{4}-\d{2}-\d{2}-(.+?)\.md\s*%\}/gs,
    (_, slug) => `/posts/${slug.replaceAll("\n", "").trim()}.html`,
  );
}

function headingSlug(text) {
  return text
    .replace(/!?\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .normalize("NFKD")
    .replace(/\p{Mark}/gu, "")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function renderMarkdown(markdown) {
  const slugCounts = new Map();
  const markdownParser = new Marked({
    breaks: false,
    gfm: true,
  }).use(markedFootnote()).use({
    renderer: {
      heading({ depth, text, tokens }) {
        const content = this.parser.parseInline(tokens);
        const baseSlug = headingSlug(text) || "section";
        const count = (slugCounts.get(baseSlug) ?? 0) + 1;
        slugCounts.set(baseSlug, count);
        const slug = count === 1 ? baseSlug : `${baseSlug}-${count}`;
        return `<h${depth} id="${slug}">${content}</h${depth}>\n`;
      },
    },
  });

  return markdownParser.parse(normaliseLegacyLinks(markdown));
}

function formatDate(date) {
  const parsed = new Date(`${date}T00:00:00Z`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid post date: ${date}`);
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(parsed);
}

export function applyTemplate(
  template,
  { content, date = "", tags = [], title },
) {
  const tagsHtml = tags
    .map((tag) => `<span class="post-tag">${escapeHtml(tag)}</span>`)
    .join("");

  return template
    .replaceAll("POST_TITLE", () => escapeHtml(title))
    .replaceAll("POST_DATE", () => date ? formatDate(date) : "")
    .replace("<!-- POST_TAGS will be inserted here -->", () => tagsHtml)
    .replace("<!-- POST_CONTENT will be inserted here -->", () => content);
}

async function markdownFiles(directory) {
  const filenames = [];

  for await (const entry of Deno.readDir(directory)) {
    if (entry.isFile && entry.name.endsWith(".md")) filenames.push(entry.name);
  }

  return filenames.sort();
}

async function copyDirectory(source, destination) {
  await Deno.mkdir(destination, { recursive: true });

  for await (const entry of Deno.readDir(source)) {
    const sourcePath = `${source}/${entry.name}`;
    const destinationPath = `${destination}/${entry.name}`;

    if (entry.isDirectory) {
      await copyDirectory(sourcePath, destinationPath);
    } else if (entry.isFile) {
      await Deno.copyFile(sourcePath, destinationPath);
    }
  }
}

async function copyStaticSite() {
  for (const filename of staticFiles) {
    await Deno.copyFile(
      `${siteDirectory}/${filename}`,
      `${outputDirectory}/${filename}`,
    );
  }

  await copyDirectory(
    `${siteDirectory}/images`,
    `${outputDirectory}/images`,
  );

  await Deno.mkdir(`${outputDirectory}/counter`, { recursive: true });
  await Deno.copyFile(
    "counter/visitors.json",
    `${outputDirectory}/counter/visitors.json`,
  );
}

async function buildPosts(template) {
  const posts = [];

  for (const filename of await markdownFiles(postsDirectory)) {
    const filenameMatch = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
    if (!filenameMatch) {
      throw new Error(`${filename}: expected YYYY-MM-DD-slug.md`);
    }

    const source = await Deno.readTextFile(`${postsDirectory}/${filename}`);
    const { attributes, body } = parseFrontMatter(source, filename);
    if (attributes.draft) continue;

    const [, filenameDate, slug] = filenameMatch;
    const title = attributes.title;
    const date = attributes.date || filenameDate;
    const tags = attributes.tags || [];

    if (!title || typeof title !== "string") {
      throw new Error(`${filename}: title must be a non-empty string`);
    }
    if (!Array.isArray(tags)) {
      throw new Error(`${filename}: tags must be a YAML list`);
    }

    const post = {
      title,
      date,
      tags,
      url: `/posts/${slug}.html`,
      content: renderMarkdown(body),
    };
    const outputFilename = `${slug}.html`;

    await Deno.writeTextFile(
      `${postsOutputDirectory}/${outputFilename}`,
      applyTemplate(template, post),
    );
    posts.push(post);
  }

  posts.sort((left, right) =>
    right.date.localeCompare(left.date) || left.title.localeCompare(right.title)
  );

  await Deno.writeTextFile(
    postsIndexFile,
    `${JSON.stringify(posts, null, 2)}\n`,
  );
  console.log(`Generated ${posts.length} posts and ${postsIndexFile}`);
}

async function buildStandalonePages(template) {
  for (const page of standalonePages) {
    const source = await Deno.readTextFile(page.source);
    const { attributes, body } = parseFrontMatter(source, page.source);
    const titleMatch = body.match(/^\s*#\s+(.+)$/m);
    const title = attributes.title || titleMatch?.[1] ||
      page.output.replace(".html", "");
    const markdown = titleMatch ? body.replace(titleMatch[0], "").trim() : body;
    const html = applyTemplate(template, {
      content: renderMarkdown(markdown),
      title,
    }).replace(/\s*<div class="post-tags">[\s\S]*?<\/div>/, "");
    const outputFilename = `${outputDirectory}/${page.output}`;

    await Deno.writeTextFile(outputFilename, html);
    console.log(`Generated ${outputFilename}`);
  }
}

async function build() {
  console.log("Building site...");
  try {
    await Deno.remove(outputDirectory, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) throw error;
  }

  await Deno.mkdir(outputDirectory, { recursive: true });
  await Deno.mkdir(postsOutputDirectory, { recursive: true });
  await copyStaticSite();
  const template = await Deno.readTextFile(
    `${siteDirectory}/post-template.html`,
  );

  await buildPosts(template);
  await buildStandalonePages(template);
  console.log("Build complete.");
}

if (import.meta.main) await build();
