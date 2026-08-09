import {
  counterUrl,
  currentUtcMonth,
  markVisitCounted,
  visitDecision,
} from "../site/visitor-counter.js";
import { visitorSnapshot } from "../scripts/snapshot-visitors.js";

function assertEquals(actual, expected) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

class MemoryStorage {
  values = new Map();

  getItem(key) {
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.values.set(key, value);
  }
}

Deno.test("visitor decision suppresses reloads without sharing an identifier", () => {
  const storage = new MemoryStorage();

  assertEquals(visitDecision(storage, "2026-08"), {
    firstEver: true,
    shouldCount: true,
    storageAvailable: true,
  });

  markVisitCounted(storage, "2026-08");
  assertEquals(visitDecision(storage, "2026-08"), {
    firstEver: false,
    shouldCount: false,
    storageAvailable: true,
  });
  assertEquals(visitDecision(storage, "2026-09"), {
    firstEver: false,
    shouldCount: true,
    storageAvailable: true,
  });
});

Deno.test("visitor counter URLs and snapshots are normalised", () => {
  assertEquals(
    counterUrl("https://counter.example/api/", "counts"),
    "https://counter.example/api/counts",
  );
  assertEquals(
    currentUtcMonth(new Date("2026-09-01T00:00:00Z")),
    "2026-09",
  );
  assertEquals(
    visitorSnapshot({
      total: 7,
      monthly: { "2026-09": 2, "2026-08": 5 },
    }),
    {
      enabled: true,
      total: 7,
      monthly: { "2026-08": 5, "2026-09": 2 },
    },
  );
});
