const snapshotFile = "counter/visitors.json";

export interface VisitorSnapshot {
  total: number;
  lastUpdated: string;
}

function nonNegativeInteger(value: number, name: string): number {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }
  return value;
}

export function createVisitorSnapshot(
  assetDownloads: number,
  date: string,
): VisitorSnapshot {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Counter snapshot date must be YYYY-MM-DD");
  }

  return {
    total: nonNegativeInteger(assetDownloads, "Asset download count"),
    lastUpdated: date,
  };
}

async function main(): Promise<void> {
  const downloadValue = Deno.env.get("VISITOR_DOWNLOAD_COUNT");
  if (!downloadValue || !/^\d+$/.test(downloadValue)) {
    throw new Error("VISITOR_DOWNLOAD_COUNT must be a non-negative integer");
  }

  const date = Deno.env.get("COUNTER_SNAPSHOT_DATE") ??
    new Date().toISOString().slice(0, 10);
  const snapshot = createVisitorSnapshot(Number(downloadValue), date);

  await Deno.writeTextFile(
    snapshotFile,
    `${JSON.stringify(snapshot, null, 2)}\n`,
  );
}

if (import.meta.main) await main();
