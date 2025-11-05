#!/usr/bin/env -S deno run --allow-net --allow-read

import { serveDir } from "https://deno.land/std/http/file_server.ts";

const PORT = 8000;

console.log(`HTTP server running at http://localhost:${PORT}`);

Deno.serve({ port: PORT }, (req) => {
  return serveDir(req, {
    fsRoot: ".",
    showDirListing: true,
    enableCors: true,
  });
});