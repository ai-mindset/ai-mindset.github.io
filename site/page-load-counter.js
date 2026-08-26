const RELEASE_ASSET_URL =
  "https://github.com/ai-mindset/ai-mindset.github.io/releases/download/page-load-counter-v1/visit.txt";
const SNAPSHOT_URL = "/counter/visitors.json";

export function pageLoadBeaconUrl(now = Date.now()) {
  const url = new URL(RELEASE_ASSET_URL);
  url.searchParams.set("page-load", String(now));
  return url.href;
}

export async function recordPageLoad({
  fetcher = globalThis.fetch,
  now = Date.now(),
} = {}) {
  try {
    await fetcher(pageLoadBeaconUrl(now), {
      cache: "no-store",
      credentials: "omit",
      keepalive: true,
      mode: "no-cors",
      referrerPolicy: "no-referrer",
    });
    return true;
  } catch {
    return false;
  }
}

export function isPageLoadSnapshot(value) {
  return value && typeof value === "object" && !Array.isArray(value) &&
    Number.isSafeInteger(value.total) && value.total >= 0 &&
    value.daily && typeof value.daily === "object" &&
    !Array.isArray(value.daily) &&
    (value.lastUpdated === null ||
      /^\d{4}-\d{2}-\d{2}$/.test(value.lastUpdated));
}

export async function renderPageLoadCount({
  fetcher = globalThis.fetch,
  root = document.querySelector("[data-page-load-counter]"),
} = {}) {
  if (!root) return false;

  try {
    const response = await fetcher(SNAPSHOT_URL, { cache: "no-store" });
    if (!response.ok) return false;

    const snapshot = await response.json();
    if (!isPageLoadSnapshot(snapshot)) return false;

    const total = root.querySelector("[data-page-load-total]");
    if (!total) return false;
    total.textContent = snapshot.total.toLocaleString("en-GB");
    return true;
  } catch {
    return false;
  }
}

export function setupPageLoadCounter() {
  void recordPageLoad();
  void renderPageLoadCount();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupPageLoadCounter, {
      once: true,
    });
  } else {
    setupPageLoadCounter();
  }
}
