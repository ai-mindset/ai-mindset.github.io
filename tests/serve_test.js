import { expect, test } from "bun:test";

import { contentType, fileResponse, publicPath } from "../scripts/serve.js";

test("public paths are constrained to site assets", () => {
  expect(publicPath("/")).toBe("index.html");
  expect(publicPath("/posts/deno.html")).toBe("posts/deno.html");
  expect(publicPath("/images/Deno%202.png")).toBe("images/Deno 2.png");
  expect(publicPath("/counter/visitors.json")).toBe("counter/visitors.json");
  expect(publicPath("/visitor-counter.js")).toBe("visitor-counter.js");
  expect(publicPath("/_posts/private.md")).toBeNull();
  expect(publicPath("/posts/%2e%2e/README.md")).toBeNull();
});

test("responses use an appropriate content type", () => {
  expect(contentType("index.html")).toBe("text/html; charset=utf-8");
  expect(contentType("script.js")).toBe("text/javascript; charset=utf-8");
  expect(contentType("images/photo.jpg")).toBe("image/jpeg");
});

test("files can be served with GET and HEAD", async () => {
  const getResponse = await fileResponse("index.html");
  expect(getResponse?.status).toBe(200);
  expect((await getResponse?.text())?.startsWith("<!DOCTYPE html>")).toBe(true);

  const headResponse = await fileResponse("index.html", 200, "HEAD");
  expect(headResponse?.status).toBe(200);
  expect(await headResponse?.text()).toBe("");
  expect(await fileResponse("does-not-exist")).toBeNull();
});
