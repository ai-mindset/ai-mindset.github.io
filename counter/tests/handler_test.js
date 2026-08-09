import { createHandler, utcMonth } from "../handler.js";
import { configuredOrigins } from "../main.js";

function assertEquals(actual, expected) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

class MemoryStore {
  total = 0;
  monthly = {};

  increment({ firstEver, month }) {
    if (firstEver) this.total++;
    this.monthly[month] = (this.monthly[month] ?? 0) + 1;
  }

  read() {
    return { total: this.total, monthly: this.monthly };
  }
}

Deno.test("visitor events update only aggregate counts", async () => {
  const store = new MemoryStore();
  const handler = createHandler(store, {
    allowedOrigins: ["https://ai-mindset.github.io"],
    now: () => new Date("2026-08-09T12:00:00Z"),
  });
  const response = await handler(
    new Request("https://counter.test/visit", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "origin": "https://ai-mindset.github.io",
      },
      body: JSON.stringify({ firstEver: true }),
    }),
  );

  assertEquals(response.status, 200);
  assertEquals(await response.json(), {
    total: 1,
    monthly: { "2026-08": 1 },
  });
  assertEquals(
    response.headers.get("access-control-allow-origin"),
    "https://ai-mindset.github.io",
  );
});

Deno.test("visitor events reject other origins and identifying fields", async () => {
  const handler = createHandler(new MemoryStore(), {
    allowedOrigins: ["https://ai-mindset.github.io"],
  });
  const wrongOrigin = await handler(
    new Request("https://counter.test/visit", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "origin": "https://example.com",
      },
      body: JSON.stringify({ firstEver: true }),
    }),
  );
  const extraField = await handler(
    new Request("https://counter.test/visit", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "origin": "https://ai-mindset.github.io",
      },
      body: JSON.stringify({ firstEver: true, visitorId: "not-accepted" }),
    }),
  );

  assertEquals(wrongOrigin.status, 403);
  assertEquals(extraField.status, 400);
});

Deno.test("counter configuration has production and local origins", () => {
  assertEquals(utcMonth(new Date("2026-08-31T23:59:59Z")), "2026-08");
  assertEquals(configuredOrigins("https://one.test, https://two.test"), [
    "https://one.test",
    "https://two.test",
  ]);
  assertEquals(
    configuredOrigins().includes("https://ai-mindset.github.io"),
    true,
  );
});
