#!/usr/bin/env -S deno run --allow-net=127.0.0.1 --allow-read=_site

const hostname = "127.0.0.1";
const siteDirectory = "_site";
const portArgument = Deno.args.find((argument) => argument !== "--");
const port = Number(portArgument || 8000);
const publicDirectories = new Set(["images", "posts"]);
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

  const relativePath = decodedPath === "/"
    ? "index.html"
    : decodedPath.slice(1);
  const segments = relativePath.split("/");

  if (
    segments.some((segment) =>
      segment === "" || segment === "." || segment === ".."
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
  try {
    const file = await Deno.open(`${siteDirectory}/${path}`, { read: true });
    const headers = new Headers({
      "content-type": contentType(path),
      "x-content-type-options": "nosniff",
    });

    if (method === "HEAD") {
      file.close();
      return new Response(null, { headers, status });
    }

    return new Response(file.readable, { headers, status });
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) return null;
    throw error;
  }
}

export function startServer() {
  Deno.serve({
    hostname,
    onListen: ({ hostname, port }) => {
      console.log(`Site available at http://${hostname}:${port}`);
    },
    port,
  }, async (request) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        headers: { allow: "GET, HEAD" },
        status: 405,
      });
    }

    const path = publicPath(new URL(request.url).pathname);
    const response = path && await fileResponse(path, 200, request.method);

    return response || await fileResponse("404.html", 404, request.method) ||
      new Response("Not found", { status: 404 });
  });
}

if (import.meta.main) startServer();
