import { contentType, fileResponse, publicPath } from "../scripts/serve.js";

function assertEquals(actual, expected) {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, got ${actual}`);
  }
}

Deno.test("public paths are constrained to site assets", () => {
  assertEquals(publicPath("/"), "index.html");
  assertEquals(publicPath("/posts/deno.html"), "posts/deno.html");
  assertEquals(publicPath("/images/Deno%202.png"), "images/Deno 2.png");
  assertEquals(publicPath("/_posts/private.md"), null);
  assertEquals(publicPath("/posts/%2e%2e/README.md"), null);
});

Deno.test("responses use an appropriate content type", () => {
  assertEquals(contentType("index.html"), "text/html; charset=utf-8");
  assertEquals(contentType("script.js"), "text/javascript; charset=utf-8");
  assertEquals(contentType("images/photo.jpg"), "image/jpeg");
});

Deno.test("files can be served with GET and HEAD", async () => {
  const getResponse = await fileResponse("index.html");
  assertEquals(getResponse.status, 200);
  assertEquals((await getResponse.text()).startsWith("<!DOCTYPE html>"), true);

  const headResponse = await fileResponse("index.html", 200, "HEAD");
  assertEquals(headResponse.status, 200);
  assertEquals(await headResponse.text(), "");
  assertEquals(await fileResponse("does-not-exist"), null);
});
