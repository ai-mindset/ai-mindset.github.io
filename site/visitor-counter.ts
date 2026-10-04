const RELEASE_ASSET_URL =
  "https://github.com/ai-mindset/ai-mindset.github.io/releases/download/visitor-counter-v2/visit.txt";
const SNAPSHOT_URL = "/counter/visitors.json";
const COUNTED_KEY = "ai-mindset:unique-browser:v2";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface VisitorSnapshot {
  total: number;
  lastUpdated: string | null;
}

interface CounterRoot {
  querySelector(selector: string): { textContent: string | null } | null;
}

type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export function visitorBeaconUrl(now = Date.now()): string {
  const url = new URL(RELEASE_ASSET_URL);
  url.searchParams.set("visit", String(now));
  return url.href;
}

export function claimBrowser(storage: StorageLike): boolean {
  try {
    if (storage.getItem(COUNTED_KEY) === "1") return false;
    storage.setItem(COUNTED_KEY, "1");
    return true;
  } catch {
    // Without durable storage, this browser cannot be counted safely.
    return false;
  }
}

function browserStorage(): StorageLike | null {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export async function recordUniqueBrowser({
  fetcher = globalThis.fetch,
  now = Date.now(),
  storage,
}: {
  fetcher?: Fetcher;
  now?: number;
  storage?: StorageLike;
} = {}): Promise<boolean> {
  const durableStorage = storage ?? browserStorage();
  if (!durableStorage || !claimBrowser(durableStorage)) return false;

  try {
    await fetcher(visitorBeaconUrl(now), {
      cache: "no-store",
      credentials: "omit",
      keepalive: true,
      mode: "no-cors",
      referrerPolicy: "no-referrer",
    });
    return true;
  } catch {
    // Keep the claim: the request may have reached GitHub before failing.
    return false;
  }
}

export function isVisitorSnapshot(value: unknown): value is VisitorSnapshot {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const snapshot = value as Record<string, unknown>;
  return typeof snapshot.total === "number" &&
    Number.isSafeInteger(snapshot.total) && snapshot.total >= 0 &&
    (snapshot.lastUpdated === null ||
      (typeof snapshot.lastUpdated === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(snapshot.lastUpdated)));
}

export async function renderVisitorCount({
  fetcher = globalThis.fetch,
  root = document.querySelector("[data-visitor-counter]"),
}: {
  fetcher?: Fetcher;
  root?: CounterRoot | null;
} = {}): Promise<boolean> {
  if (!root) return false;

  try {
    const response = await fetcher(SNAPSHOT_URL, { cache: "no-store" });
    if (!response.ok) return false;

    const snapshot: unknown = await response.json();
    if (!isVisitorSnapshot(snapshot)) return false;

    const total = root.querySelector("[data-visitor-total]");
    if (!total) return false;
    total.textContent = snapshot.total.toLocaleString("en-GB");
    return true;
  } catch {
    return false;
  }
}

export function setupVisitorCounter(): void {
  void recordUniqueBrowser();
  void renderVisitorCount();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupVisitorCounter, {
      once: true,
    });
  } else {
    setupVisitorCounter();
  }
}
