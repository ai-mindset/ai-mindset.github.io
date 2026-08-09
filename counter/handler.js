function jsonResponse(value, status = 200, origin = null) {
  const headers = new Headers({
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
    "referrer-policy": "no-referrer",
    "vary": "Origin",
  });
  if (origin) headers.set("access-control-allow-origin", origin);

  return new Response(`${JSON.stringify(value)}\n`, { headers, status });
}

export function utcMonth(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

export function createHandler(
  store,
  { allowedOrigins, now = () => new Date() },
) {
  const origins = new Set(allowedOrigins);

  return async function handler(request) {
    const { pathname } = new URL(request.url);
    const requestOrigin = request.headers.get("origin");
    const responseOrigin = requestOrigin && origins.has(requestOrigin)
      ? requestOrigin
      : null;

    if (request.method === "OPTIONS" && pathname === "/visit") {
      if (!responseOrigin) {
        return jsonResponse({ error: "Origin is not allowed" }, 403);
      }

      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-headers": "content-type",
          "access-control-allow-methods": "POST, OPTIONS",
          "access-control-allow-origin": responseOrigin,
          "access-control-max-age": "86400",
          "vary": "Origin",
        },
      });
    }

    if (request.method === "GET" && pathname === "/counts") {
      return jsonResponse(await store.read(), 200, responseOrigin);
    }

    if (request.method === "POST" && pathname === "/visit") {
      if (!responseOrigin) {
        return jsonResponse({ error: "Origin is not allowed" }, 403);
      }

      let payload;
      try {
        payload = await request.json();
      } catch {
        return jsonResponse({ error: "Expected a JSON request body" }, 400);
      }

      if (
        !payload || typeof payload !== "object" ||
        Array.isArray(payload) ||
        Object.keys(payload).length !== 1 ||
        typeof payload.firstEver !== "boolean"
      ) {
        return jsonResponse(
          { error: "Expected only a boolean firstEver field" },
          400,
          responseOrigin,
        );
      }

      await store.increment({
        firstEver: payload.firstEver,
        month: utcMonth(now()),
      });
      return jsonResponse(await store.read(), 200, responseOrigin);
    }

    if (request.method === "GET" && pathname === "/") {
      return jsonResponse({ status: "ok" });
    }

    return jsonResponse({ error: "Not found" }, 404, responseOrigin);
  };
}
