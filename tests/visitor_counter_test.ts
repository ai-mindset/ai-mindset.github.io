import {
  claimBrowser,
  isVisitorSnapshot,
  recordUniqueBrowser,
  renderVisitorCount,
  type StorageLike,
  visitorBeaconUrl,
} from "../site/visitor-counter.ts";
import { createVisitorSnapshot } from "../scripts/update-visitor-counter.ts";

function assertEquals(actual: unknown, expected: unknown): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

class MemoryStorage implements StorageLike {
  #values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.#values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.#values.set(key, value);
  }
}

Deno.test("a browser can claim the counter only once", () => {
  const storage = new MemoryStorage();
  assertEquals(claimBrowser(storage), true);
  assertEquals(claimBrowser(storage), false);
});

Deno.test("reloads send only one anonymous beacon", async () => {
  const storage = new MemoryStorage();
  const requests: Array<{ input: string; init?: RequestInit }> = [];
  const fetcher = (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    requests.push({ input: String(input), init });
    return Promise.resolve(new Response(null, { status: 204 }));
  };

  const first = await recordUniqueBrowser({ fetcher, now: 123, storage });
  const reload = await recordUniqueBrowser({ fetcher, now: 456, storage });

  assertEquals(first, true);
  assertEquals(reload, false);
  assertEquals(requests, [{
    input: visitorBeaconUrl(123),
    init: {
      cache: "no-store",
      credentials: "omit",
      keepalive: true,
      mode: "no-cors",
      referrerPolicy: "no-referrer",
    },
  }]);
});

Deno.test("storage failures do not create unbounded counts", async () => {
  let requests = 0;
  const storage: StorageLike = {
    getItem() {
      throw new Error("storage disabled");
    },
    setItem() {
      throw new Error("storage disabled");
    },
  };

  const counted = await recordUniqueBrowser({
    storage,
    fetcher() {
      requests++;
      return Promise.resolve(new Response(null, { status: 204 }));
    },
  });

  assertEquals(counted, false);
  assertEquals(requests, 0);
});

Deno.test("a failed beacon is not retried and double-counted", async () => {
  const storage = new MemoryStorage();
  let requests = 0;
  const fetcher = (): Promise<Response> => {
    requests++;
    return Promise.reject(new Error("connection closed"));
  };

  assertEquals(await recordUniqueBrowser({ fetcher, storage }), false);
  assertEquals(await recordUniqueBrowser({ fetcher, storage }), false);
  assertEquals(requests, 1);
});

Deno.test("the snapshot mirrors the clean release total", () => {
  const snapshot = createVisitorSnapshot(12, "2026-10-04");
  assertEquals(snapshot, { total: 12, lastUpdated: "2026-10-04" });
  assertEquals(isVisitorSnapshot(snapshot), true);
});

Deno.test("the homepage renders the latest visitor snapshot", async () => {
  const total = { textContent: "0" };
  const root = {
    querySelector(selector: string) {
      return selector === "[data-visitor-total]" ? total : null;
    },
  };
  const rendered = await renderVisitorCount({
    root,
    fetcher() {
      return Promise.resolve(
        new Response(JSON.stringify({
          total: 1234,
          lastUpdated: "2026-10-04",
        })),
      );
    },
  });

  assertEquals(rendered, true);
  assertEquals(total.textContent, "1,234");
});
