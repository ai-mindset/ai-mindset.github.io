import { expect, test } from "bun:test";

import {
  applyTemplate,
  normaliseLegacyLinks,
  parseFrontMatter,
  renderMarkdown,
} from "../scripts/build.js";

test("front matter parses the fields used by posts", () => {
  const source = `---
title: "A useful: post"
date: 2026-08-09
tags: [deno, javascript]
draft: false
---
Body`;

  expect(parseFrontMatter(source, "post.md")).toEqual({
    attributes: {
      title: "A useful: post",
      date: "2026-08-09",
      tags: ["deno", "javascript"],
      draft: false,
    },
    body: "Body",
  });
});

test("front matter accepts multiline flow lists", () => {
  const source = `---
layout: post
tags: [
  python,
  data-validation,
]
---
Body`;

  expect(parseFrontMatter(source, "post.md")).toEqual({
    attributes: {
      layout: "post",
      tags: ["python", "data-validation"],
    },
    body: "Body",
  });
});

test("template content is inserted literally", () => {
  const template =
    "<title>POST_TITLE</title><!-- POST_CONTENT will be inserted here -->";
  const html = applyTemplate(template, {
    content: "A value like $j's remains intact.",
    title: "Example & test",
  });

  expect(html).toBe(
    "<title>Example &amp; test</title>A value like $j's remains intact.",
  );
});

test("legacy Jekyll post links become static URLs", () => {
  const markdown =
    "[Read]({{ site.baseurl }} {% link _posts/2024-09-05-deno.md %})";
  expect(normaliseLegacyLinks(markdown)).toBe("[Read](/posts/deno.html)");
});

test("Markdown headings receive stable unique IDs", () => {
  const html = renderMarkdown(
    "# Hello, World!\n\n## Repeated\n\n## Repeated\n",
  );

  for (const heading of [
    '<h1 id="hello-world">Hello, World!</h1>',
    '<h2 id="repeated">Repeated</h2>',
    '<h2 id="repeated-2">Repeated</h2>',
  ]) {
    expect(html).toContain(heading);
  }
});

test("Markdown source wrapping does not create visible line breaks", () => {
  const html = renderMarkdown(
    "A paragraph wrapped\nacross source lines.\n\nAn intentional break.  \nNext line.",
  );

  expect(html).not.toContain("wrapped<br>");
  expect(html).toContain("intentional break.<br>");
});
