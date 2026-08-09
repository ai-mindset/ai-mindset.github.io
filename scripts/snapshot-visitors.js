import { counterUrl } from "../site/visitor-counter.js";

function validCount(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

export function visitorSnapshot(value) {
  if (!value || typeof value !== "object" || !validCount(value.total)) {
    throw new Error("Visitor endpoint returned an invalid total");
  }
  if (!value.monthly || typeof value.monthly !== "object") {
    throw new Error("Visitor endpoint returned invalid monthly counts");
  }

  const monthly = {};
  for (const [month, count] of Object.entries(value.monthly).sort()) {
    if (!/^\d{4}-\d{2}$/.test(month) || !validCount(count)) {
      throw new Error(
        `Visitor endpoint returned an invalid count for ${month}`,
      );
    }
    monthly[month] = count;
  }

  return { enabled: true, total: value.total, monthly };
}

async function main() {
  const endpoint = Deno.env.get("VISITOR_COUNTER_ENDPOINT")?.trim();
  if (!endpoint) {
    console.log(
      "VISITOR_COUNTER_ENDPOINT is not configured; using the disabled snapshot.",
    );
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  let response;
  try {
    response = await fetch(counterUrl(endpoint, "counts"), {
      headers: { "accept": "application/json" },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Visitor endpoint returned HTTP ${response.status}`);
  }

  const snapshot = visitorSnapshot(await response.json());
  await Deno.writeTextFile(
    "_site/visitors.json",
    `${JSON.stringify(snapshot, null, 2)}\n`,
  );
  console.log("Refreshed the anonymous visitor snapshot.");
}

if (import.meta.main) await main();
