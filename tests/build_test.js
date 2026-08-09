import {
  applyTemplate,
  normaliseCounterEndpoint,
  normaliseLegacyLinks,
  parseFrontMatter,
  renderMarkdown,
} from "../scripts/build.js";

function assertEquals(actual, expected) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

Deno.test("front matter parses the fields used by posts", () => {
  const source = `---
title: "A useful: post"
date: 2026-08-09
tags: [deno, javascript]
draft: false
---
Body`;

  assertEquals(parseFrontMatter(source, "post.md"), {
    attributes: {
      title: "A useful: post",
      date: "2026-08-09",
      tags: ["deno", "javascript"],
      draft: false,
    },
    body: "Body",
  });
});

Deno.test("visitor counter endpoints require HTTPS except during local development", () => {
  assertEquals(
    normaliseCounterEndpoint("https://counter.example/"),
    "https://counter.example",
  );
  assertEquals(
    normaliseCounterEndpoint("http://127.0.0.1:8001/"),
    "http://127.0.0.1:8001",
  );

  let rejected = false;
  try {
    normaliseCounterEndpoint("http://counter.example");
  } catch {
    rejected = true;
  }
  assertEquals(rejected, true);
});

Deno.test("front matter accepts multiline flow lists", () => {
  const source = `---
layout: post
tags: [
  python,
  data-validation,
]
---
Body`;

  assertEquals(parseFrontMatter(source, "post.md"), {
    attributes: {
      layout: "post",
      tags: ["python", "data-validation"],
    },
    body: "Body",
  });
});

Deno.test("template content is inserted literally", () => {
  const template =
    "<title>POST_TITLE</title><!-- POST_CONTENT will be inserted here -->";
  const html = applyTemplate(template, {
    content: "A value like $j's remains intact.",
    title: "Example & test",
  });

  assertEquals(
    html,
    "<title>Example &amp; test</title>A value like $j's remains intact.",
  );
});

Deno.test("legacy Jekyll post links become static URLs", () => {
  const markdown =
    "[Read]({{ site.baseurl }} {% link _posts/2024-09-05-deno.md %})";
  assertEquals(normaliseLegacyLinks(markdown), "[Read](/posts/deno.html)");
});

Deno.test("Markdown headings receive stable unique IDs", () => {
  const html = renderMarkdown(
    "# Hello, World!\n\n## Repeated\n\n## Repeated\n",
  );

  for (
    const heading of [
      '<h1 id="hello-world">Hello, World!</h1>',
      '<h2 id="repeated">Repeated</h2>',
      '<h2 id="repeated-2">Repeated</h2>',
    ]
  ) {
    if (!html.includes(heading)) throw new Error(`Missing ${heading}`);
  }
});

Deno.test("Markdown source wrapping does not create visible line breaks", () => {
  const html = renderMarkdown(
    "A paragraph wrapped\nacross source lines.\n\nAn intentional break.  \nNext line.",
  );

  if (html.includes("wrapped<br>")) {
    throw new Error("A soft source wrap rendered as a visible line break");
  }
  if (!html.includes("intentional break.<br>")) {
    throw new Error("An intentional Markdown line break was not rendered");
  }
});
