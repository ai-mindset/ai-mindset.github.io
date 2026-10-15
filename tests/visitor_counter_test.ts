import { expect, test } from "bun:test";

import {
  claimBrowser,
  isVisitorSnapshot,
  recordUniqueBrowser,
  renderVisitorCount,
  type StorageLike,
  visitorBeaconUrl,
} from "../site/visitor-counter.ts";
import { createVisitorSnapshot } from "../scripts/update-visitor-counter.ts";

class MemoryStorage implements StorageLike {
  #values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.#values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.#values.set(key, value);
  }
}

test("a browser can claim the counter only once", () => {
  const storage = new MemoryStorage();
  expect(claimBrowser(storage)).toBe(true);
  expect(claimBrowser(storage)).toBe(false);
});

test("reloads send only one anonymous beacon", async () => {
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

  expect(first).toBe(true);
  expect(reload).toBe(false);
  expect(requests).toEqual([
    {
      input: visitorBeaconUrl(123),
      init: {
        cache: "no-store",
        credentials: "omit",
        keepalive: true,
        mode: "no-cors",
        referrerPolicy: "no-referrer",
      },
    },
  ]);
});

test("storage failures do not create unbounded counts", async () => {
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

  expect(counted).toBe(false);
  expect(requests).toBe(0);
});

test("a failed beacon is not retried and double-counted", async () => {
  const storage = new MemoryStorage();
  let requests = 0;
  const fetcher = (): Promise<Response> => {
    requests++;
    return Promise.reject(new Error("connection closed"));
  };

  expect(await recordUniqueBrowser({ fetcher, storage })).toBe(false);
  expect(await recordUniqueBrowser({ fetcher, storage })).toBe(false);
  expect(requests).toBe(1);
});

test("the snapshot mirrors the clean release total", () => {
  const snapshot = createVisitorSnapshot(12, "2026-10-04");
  expect(snapshot).toEqual({ total: 12, lastUpdated: "2026-10-04" });
  expect(isVisitorSnapshot(snapshot)).toBe(true);
});

test("the homepage renders the latest visitor snapshot", async () => {
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
        new Response(
          JSON.stringify({
            total: 1234,
            lastUpdated: "2026-10-04",
          }),
        ),
      );
    },
  });

  expect(rendered).toBe(true);
  expect(total.textContent).toBe("1,234");
});
