import {
  isPageLoadSnapshot,
  pageLoadBeaconUrl,
  recordPageLoad,
  renderPageLoadCount,
} from "../site/page-load-counter.js";
import { updatePageLoadSnapshot } from "../scripts/update-page-load-counter.js";

function assertEquals(actual, expected) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

Deno.test("page-load beacon is cache-busted and anonymous", async () => {
  let request;
  const counted = await recordPageLoad({
    now: 123,
    fetcher(url, options) {
      request = { url, options };
      return Promise.resolve(new Response(null, { status: 204 }));
    },
  });

  assertEquals(counted, true);
  assertEquals(
    pageLoadBeaconUrl(123),
    "https://github.com/ai-mindset/ai-mindset.github.io/releases/download/page-load-counter-v1/visit.txt?page-load=123",
  );
  assertEquals(request, {
    url: pageLoadBeaconUrl(123),
    options: {
      cache: "no-store",
      credentials: "omit",
      keepalive: true,
      mode: "no-cors",
      referrerPolicy: "no-referrer",
    },
  });
});

Deno.test("daily snapshots accumulate downloads and survive asset resets", () => {
  const initial = {
    total: 0,
    assetDownloads: 0,
    daily: {},
    lastUpdated: null,
  };
  const first = updatePageLoadSnapshot(initial, 7, "2026-08-25");
  const second = updatePageLoadSnapshot(first, 9, "2026-08-25");
  const third = updatePageLoadSnapshot(second, 12, "2026-08-26");
  const reset = updatePageLoadSnapshot(third, 2, "2026-08-27");

  assertEquals(reset, {
    total: 14,
    assetDownloads: 2,
    daily: {
      "2026-08-25": 9,
      "2026-08-26": 3,
      "2026-08-27": 2,
    },
    lastUpdated: "2026-08-27",
  });
  assertEquals(isPageLoadSnapshot(reset), true);
});

Deno.test("an unchanged download count leaves the snapshot untouched", () => {
  const snapshot = {
    total: 4,
    assetDownloads: 4,
    daily: { "2026-08-25": 4 },
    lastUpdated: "2026-08-25",
  };
  assertEquals(
    updatePageLoadSnapshot(snapshot, 4, "2026-08-26"),
    snapshot,
  );
});

Deno.test("the homepage renders the latest aggregate snapshot", async () => {
  const total = { textContent: "0" };
  const root = {
    querySelector(selector) {
      return selector === "[data-page-load-total]" ? total : null;
    },
  };
  const rendered = await renderPageLoadCount({
    root,
    fetcher() {
      return Promise.resolve(
        new Response(JSON.stringify({
          total: 1234,
          daily: { "2026-08-25": 12 },
          lastUpdated: "2026-08-25",
        })),
      );
    },
  });

  assertEquals(rendered, true);
  assertEquals(total.textContent, "1,234");
});
