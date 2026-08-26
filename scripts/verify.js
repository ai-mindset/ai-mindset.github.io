#!/usr/bin/env -S deno run --allow-read=.

const siteDirectory = "_site";
const posts = JSON.parse(
  await Deno.readTextFile(`${siteDirectory}/posts.json`),
);
const unresolvedTemplate =
  /\bPOST_(?:TITLE|DATE|CONTENT|TAGS)\b|\{\{\s*site\.baseurl\s*\}\}|\{%\s*link\b/;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function assertInternalLinks(html, filename) {
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (/^(?:https?:|mailto:|data:)/.test(reference) || reference === "#") {
      continue;
    }

    const pageUrl = new URL(filename, "https://site.invalid/");
    const targetUrl = new URL(reference, pageUrl);
    let targetPath = `${siteDirectory}${
      decodeURIComponent(targetUrl.pathname)
    }`;

    try {
      const target = await Deno.stat(targetPath);
      if (target.isDirectory) targetPath = `${targetPath}/index.html`;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        throw new Error(`${filename} links to missing ${reference}`);
      }
      throw error;
    }

    if (targetUrl.hash) {
      const fragment = decodeURIComponent(targetUrl.hash.slice(1));
      const targetHtml = targetPath === `${siteDirectory}/${filename}`
        ? html
        : await Deno.readTextFile(targetPath);
      if (!targetHtml.includes(`id="${fragment}"`)) {
        throw new Error(`${filename} links to missing fragment ${reference}`);
      }
    }
  }
}

assert(Array.isArray(posts), "posts.json must contain an array");
assert(posts.length > 0, "posts.json must contain at least one post");

const seenUrls = new Set();

for (const [index, post] of posts.entries()) {
  assert(
    typeof post.title === "string" && post.title,
    `Post ${index} has no title`,
  );
  assert(
    /^\d{4}-\d{2}-\d{2}$/.test(post.date),
    `${post.title} has an invalid date`,
  );
  assert(Array.isArray(post.tags), `${post.title} has invalid tags`);
  assert(
    /^\/posts\/[^/]+\.html$/.test(post.url),
    `${post.title} has an invalid URL`,
  );
  assert(!seenUrls.has(post.url), `Duplicate post URL: ${post.url}`);
  assert(
    index === 0 || posts[index - 1].date >= post.date,
    `Posts are not newest-first at ${post.url}`,
  );

  const html = await Deno.readTextFile(`${siteDirectory}${post.url}`);
  assert(
    html.startsWith("<!DOCTYPE html>"),
    `${post.url} is not an HTML document`,
  );
  assert(
    html.includes('<article class="post">'),
    `${post.url} has no post article`,
  );
  assert(
    !unresolvedTemplate.test(html),
    `${post.url} contains an unresolved template`,
  );
  await assertInternalLinks(html, post.url);
  seenUrls.add(post.url);
}

for (const filename of ["about.html", "aihub.html"]) {
  const html = await Deno.readTextFile(`${siteDirectory}/${filename}`);
  assert(
    html.startsWith("<!DOCTYPE html>"),
    `${filename} is not an HTML document`,
  );
  assert(
    !unresolvedTemplate.test(html),
    `${filename} contains an unresolved template`,
  );
  await assertInternalLinks(html, filename);
}

for (const filename of ["404.html", "index.html"]) {
  const html = await Deno.readTextFile(`${siteDirectory}/${filename}`);
  await assertInternalLinks(html, filename);
}

const pageLoadSnapshot = JSON.parse(
  await Deno.readTextFile(`${siteDirectory}/counter/visitors.json`),
);
assert(
  Number.isSafeInteger(pageLoadSnapshot.total) && pageLoadSnapshot.total >= 0,
  "counter/visitors.json must contain a non-negative total",
);
assert(
  Number.isSafeInteger(pageLoadSnapshot.assetDownloads) &&
    pageLoadSnapshot.assetDownloads >= 0,
  "counter/visitors.json must contain the release asset download count",
);
assert(
  pageLoadSnapshot.daily && typeof pageLoadSnapshot.daily === "object" &&
    !Array.isArray(pageLoadSnapshot.daily) &&
    Object.values(pageLoadSnapshot.daily).every((count) =>
      Number.isSafeInteger(count) && count >= 0
    ),
  "counter/visitors.json must contain daily aggregates",
);
assert(
  pageLoadSnapshot.lastUpdated === null ||
    /^\d{4}-\d{2}-\d{2}$/.test(pageLoadSnapshot.lastUpdated),
  "counter/visitors.json must contain a valid last-updated date",
);

console.log(`Verified ${posts.length} posts and 2 standalone pages.`);
