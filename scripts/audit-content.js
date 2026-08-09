#!/usr/bin/env -S deno run --allow-read=content

import { parseFrontMatter } from "./build.js";

const contentDirectories = ["content/pages", "content/posts"];
const errors = [];

async function markdownFiles(directory) {
  const files = [];
  for await (const entry of Deno.readDir(directory)) {
    if (entry.isFile && entry.name.endsWith(".md")) {
      files.push(`${directory}/${entry.name}`);
    }
  }
  return files.sort();
}

function withoutFencedCode(markdown) {
  let inFence = false;
  return markdown.split(/\r?\n/).map((line) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      return "";
    }
    return inFence ? "" : line;
  }).join("\n");
}

function report(file, message) {
  errors.push(`${file}: ${message}`);
}

for (const directory of contentDirectories) {
  for (const file of await markdownFiles(directory)) {
    const source = await Deno.readTextFile(file);
    const { attributes, body } = parseFrontMatter(source, file);
    const prose = withoutFencedCode(body);

    if (/[—–]/.test(prose)) report(file, "contains an em dash or en dash");
    if (/\\ /.test(prose)) report(file, "contains a literal backslash-space");
    if (/^>[^\n]*[ \t]>[ \t]/m.test(prose)) {
      report(file, "contains a collapsed blockquote");
    }
    if (/\{\{\s*site\.baseurl|\{%\s*link\b/.test(prose)) {
      report(file, "contains a legacy Jekyll link");
    }
    if (/https:\/\/ai-mindset\.github\.io\//.test(prose)) {
      report(file, "uses an absolute URL for an internal link");
    }
    if (
      /raw\.githubusercontent\.com\/ai-mindset\/ai-mindset\.github\.io/.test(
        prose,
      )
    ) {
      report(file, "loads a site image through raw.githubusercontent.com");
    }

    const footnotes = [...prose.matchAll(/^\[\^([^\]]+)\]:/gm)].map((match) =>
      match[1]
    );
    const duplicateFootnotes = footnotes.filter((name, index) =>
      footnotes.indexOf(name) !== index
    );
    if (duplicateFootnotes.length > 0) {
      report(
        file,
        `defines duplicate footnote(s): ${
          [...new Set(duplicateFootnotes)].join(", ")
        }`,
      );
    }
    const footnoteReferences = [
      ...prose.matchAll(/\[\^([^\]]+)\](?!:)/g),
    ].map((match) => match[1]);
    const undefinedFootnotes = [...new Set(footnoteReferences)].filter(
      (name) => !footnotes.includes(name),
    );
    const unusedFootnotes = [...new Set(footnotes)].filter(
      (name) => !footnoteReferences.includes(name),
    );
    if (undefinedFootnotes.length > 0) {
      report(
        file,
        `references undefined footnote(s): ${undefinedFootnotes.join(", ")}`,
      );
    }
    if (unusedFootnotes.length > 0) {
      report(file, `defines unused footnote(s): ${unusedFootnotes.join(", ")}`);
    }

    if (file.startsWith("content/posts/")) {
      const filename = file.slice(file.lastIndexOf("/") + 1);
      const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
      if (!match) {
        report(file, "filename must be YYYY-MM-DD-slug.md");
        continue;
      }

      if (attributes.layout !== "post") report(file, "layout must be post");
      if (typeof attributes.title !== "string" || attributes.title === "") {
        report(file, "title must be a non-empty string");
      }
      if (attributes.date !== match[1]) {
        report(
          file,
          `front-matter date ${
            attributes.date ?? "is missing"
          } does not match filename ${match[1]}`,
        );
      }
      if (!Array.isArray(attributes.tags) || attributes.tags.length === 0) {
        report(file, "tags must be a non-empty list");
      }
      if (!/^\*\*TL;DR:\*\*/m.test(body)) report(file, "has no TL;DR");
      if (!body.includes("<!--more-->")) report(file, "has no excerpt marker");
    }
  }
}

if (errors.length > 0) {
  console.error(`Content audit failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  Deno.exit(1);
}

console.log("Content typography, metadata, and Markdown structure passed.");
