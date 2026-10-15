#!/usr/bin/env bun

const hostname = "127.0.0.1";
const siteDirectory = "_site";
const portArgument = Bun.argv.slice(2).find((argument) => argument !== "--");
const port = Number(portArgument || 8000);
const publicDirectories = new Set(["counter", "images", "posts"]);
const publicFiles = new Set([
  "404.html",
  "about.html",
  "aihub.html",
  "favicon.ico",
  "index.html",
  "posts.json",
  "robots.txt",
  "script.js",
  "style.css",
  "visitor-counter.js",
]);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error(`Invalid port: ${portArgument}`);
}

export function publicPath(pathname) {
  let decodedPath;

  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const relativePath =
    decodedPath === "/" ? "index.html" : decodedPath.slice(1);
  const segments = relativePath.split("/");

  if (
    segments.some(
      (segment) => segment === "" || segment === "." || segment === "..",
    )
  ) {
    return null;
  }

  if (segments.length === 1 && publicFiles.has(relativePath)) {
    return relativePath;
  }
  if (segments.length > 1 && publicDirectories.has(segments[0])) {
    return relativePath;
  }
  return null;
}

export function contentType(path) {
  const extension = path.match(/\.[^.]+$/)?.[0].toLowerCase();
  return contentTypes[extension] || "application/octet-stream";
}

export async function fileResponse(path, status = 200, method = "GET") {
  const file = Bun.file(`${siteDirectory}/${path}`);
  if (!(await file.exists())) return null;

  const headers = new Headers({
    "content-type": contentType(path),
    "x-content-type-options": "nosniff",
  });
  const body = method === "HEAD" ? null : file;
  return new Response(body, { headers, status });
}

export function startServer() {
  const server = Bun.serve({
    hostname,
    port,
    async fetch(request) {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method not allowed", {
          headers: { allow: "GET, HEAD" },
          status: 405,
        });
      }

      const path = publicPath(new URL(request.url).pathname);
      const response = path && (await fileResponse(path, 200, request.method));

      return (
        response ||
        (await fileResponse("404.html", 404, request.method)) ||
        new Response("Not found", { status: 404 })
      );
    },
  });

  console.log(`Site available at ${server.url}`);
  return server;
}

if (import.meta.main) startServer();
