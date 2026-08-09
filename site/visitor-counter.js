const EVER_COUNTED_KEY = "ai-mindset:visitor-counted";
const MONTH_COUNTED_KEY = "ai-mindset:visitor-month";

export function currentUtcMonth(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

export function visitDecision(storage, month) {
  try {
    return {
      firstEver: storage.getItem(EVER_COUNTED_KEY) !== "1",
      shouldCount: storage.getItem(MONTH_COUNTED_KEY) !== month,
      storageAvailable: true,
    };
  } catch {
    return {
      firstEver: false,
      shouldCount: false,
      storageAvailable: false,
    };
  }
}

export function markVisitCounted(storage, month) {
  storage.setItem(EVER_COUNTED_KEY, "1");
  storage.setItem(MONTH_COUNTED_KEY, month);
}

export function counterUrl(endpoint, path) {
  const base = new URL(endpoint);
  base.pathname = `${base.pathname.replace(/\/+$/, "")}/${path}`;
  base.search = "";
  base.hash = "";
  return base.href;
}

function isCounts(value) {
  return value && typeof value === "object" &&
    Number.isSafeInteger(value.total) && value.total >= 0 &&
    value.monthly && typeof value.monthly === "object";
}

function renderCounts(root, counts, month) {
  if (!isCounts(counts)) return;

  const total = root.querySelector("[data-visitor-total]");
  const monthly = root.querySelector("[data-visitor-monthly]");
  const monthLabel = root.querySelector("[data-visitor-month-label]");
  if (!total || !monthly || !monthLabel) return;

  total.textContent = counts.total.toLocaleString("en-GB");
  monthly.textContent = (counts.monthly[month] ?? 0).toLocaleString("en-GB");
  monthLabel.textContent = new Date(`${month}-01T00:00:00Z`).toLocaleDateString(
    "en-GB",
    { month: "long", timeZone: "UTC", year: "numeric" },
  );
  root.querySelector("[data-visitor-stats]")?.removeAttribute("hidden");
}

async function readJson(response) {
  if (!response.ok) throw new Error(`Visitor counter returned ${response.status}`);
  return await response.json();
}

export async function setupVisitorCounter({
  endpoint = globalThis.AI_MINDSET_VISITOR_COUNTER_ENDPOINT ?? "",
  fetcher = globalThis.fetch,
  now = new Date(),
  root = document.getElementById("visitor-counter"),
  storage = globalThis.localStorage,
} = {}) {
  if (!root) return;

  const month = currentUtcMonth(now);

  try {
    const snapshot = await readJson(
      await fetcher("/visitors.json", { cache: "no-store" }),
    );
    if (snapshot.enabled) renderCounts(root, snapshot, month);
  } catch {
    // The disclosure remains visible even when the aggregate is unavailable.
  }

  if (!endpoint) return;

  const decision = visitDecision(storage, month);
  if (!decision.storageAvailable || !decision.shouldCount) return;

  try {
    const counts = await readJson(await fetcher(counterUrl(endpoint, "visit"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ firstEver: decision.firstEver }),
    }));
    markVisitCounted(storage, month);
    renderCounts(root, counts, month);
  } catch {
    // A failed request is retried on a later visit and never blocks the site.
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => setupVisitorCounter());
}
