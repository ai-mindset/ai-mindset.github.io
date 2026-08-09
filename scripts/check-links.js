#!/usr/bin/env -S deno run --allow-read=content --allow-net

import { parseFrontMatter, renderMarkdown } from "./build.js";

const contentDirectories = ["content/pages", "content/posts"];
const concurrency = 8;
const timeoutMilliseconds = 15_000;

async function markdownFiles(directory) {
  const files = [];
  for await (const entry of Deno.readDir(directory)) {
    if (entry.isFile && entry.name.endsWith(".md")) {
      files.push(`${directory}/${entry.name}`);
    }
  }
  return files;
}

const references = new Map();
for (const directory of contentDirectories) {
  for (const file of await markdownFiles(directory)) {
    const source = await Deno.readTextFile(file);
    const { body } = parseFrontMatter(source, file);
    const html = renderMarkdown(body);

    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = match[1].replaceAll("&amp;", "&");
      if (!/^https?:\/\//.test(url)) continue;

      const files = references.get(url) ?? new Set();
      files.add(file);
      references.set(url, files);
    }
  }
}

const queue = [...references.keys()].sort();
const failures = [];
let nextIndex = 0;

async function check(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMilliseconds);
  try {
    const response = await fetch(url, {
      headers: {
        "Accept":
          "text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.1",
        "Range": "bytes=0-0",
        "User-Agent": "ai-mindset-content-link-checker/1.0",
      },
      redirect: "follow",
      signal: controller.signal,
    });
    await response.body?.cancel();

    const allowed = response.ok || response.status < 400 ||
      [401, 403, 405, 429].includes(response.status);
    if (!allowed) {
      failures.push({ message: `returned HTTP ${response.status}`, url });
    }
  } catch (error) {
    failures.push({
      message: `failed: ${error instanceof Error ? error.message : error}`,
      url,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function worker() {
  while (nextIndex < queue.length) {
    const url = queue[nextIndex++];
    await check(url);
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));

if (failures.length > 0) {
  if (
    failures.length === queue.length &&
    failures.every((failure) => failure.message === "failed: fetch failed")
  ) {
    console.error(
      `Could not reach any of ${queue.length} external URLs. Check DNS and network access, then run the task again.`,
    );
    Deno.exit(1);
  }

  console.error(
    `Checked ${queue.length} external URLs; ${failures.length} failed:`,
  );
  for (const failure of failures.slice(0, 50)) {
    const files = [...(references.get(failure.url) ?? [])].join(", ");
    console.error(
      `- ${failure.url} ${failure.message}${files ? ` (${files})` : ""}`,
    );
  }
  if (failures.length > 50) {
    console.error(`- ...and ${failures.length - 50} more failures`);
  }
  Deno.exit(1);
}

console.log(`Checked ${queue.length} external URLs successfully.`);
