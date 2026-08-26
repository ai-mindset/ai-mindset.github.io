const snapshotFile = "counter/visitors.json";

function nonNegativeInteger(value, name) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }
  return value;
}

export function updatePageLoadSnapshot(snapshot, assetDownloads, date) {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    throw new Error("Counter snapshot must be an object");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Counter snapshot date must be YYYY-MM-DD");
  }

  const previousTotal = nonNegativeInteger(snapshot.total, "Snapshot total");
  const previousAssetDownloads = nonNegativeInteger(
    snapshot.assetDownloads,
    "Previous asset download count",
  );
  nonNegativeInteger(assetDownloads, "Asset download count");

  if (
    !snapshot.daily || typeof snapshot.daily !== "object" ||
    Array.isArray(snapshot.daily)
  ) {
    throw new Error("Counter snapshot daily counts must be an object");
  }

  const increment = assetDownloads >= previousAssetDownloads
    ? assetDownloads - previousAssetDownloads
    : assetDownloads;
  if (increment === 0) return snapshot;

  const daily = { ...snapshot.daily };
  daily[date] = nonNegativeInteger(
    daily[date] ?? 0,
    `Daily count for ${date}`,
  ) + increment;

  return {
    total: previousTotal + increment,
    assetDownloads,
    daily: Object.fromEntries(Object.entries(daily).sort()),
    lastUpdated: date,
  };
}

async function main() {
  const downloadValue = Deno.env.get("VISITOR_DOWNLOAD_COUNT");
  if (!downloadValue || !/^\d+$/.test(downloadValue)) {
    throw new Error("VISITOR_DOWNLOAD_COUNT must be a non-negative integer");
  }

  const date = Deno.env.get("COUNTER_SNAPSHOT_DATE") ??
    new Date().toISOString().slice(0, 10);
  const snapshot = JSON.parse(await Deno.readTextFile(snapshotFile));
  const updated = updatePageLoadSnapshot(
    snapshot,
    Number(downloadValue),
    date,
  );

  await Deno.writeTextFile(
    snapshotFile,
    `${JSON.stringify(updated, null, 2)}\n`,
  );
}

if (import.meta.main) await main();
