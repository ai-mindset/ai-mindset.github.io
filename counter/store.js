function countValue(value) {
  if (typeof value === "bigint") return Number(value);
  if (value && typeof value.value === "bigint") return Number(value.value);
  return 0;
}

export class KvCounterStore {
  constructor(kv) {
    this.kv = kv;
  }

  async increment({ firstEver, month }) {
    let operation = this.kv.atomic()
      .sum(["visitors", "monthly", month], 1n);

    if (firstEver) {
      operation = operation.sum(["visitors", "total"], 1n);
    }

    const result = await operation.commit();
    if (!result.ok) throw new Error("Could not increment visitor totals");
  }

  async read() {
    const totalEntry = await this.kv.get(["visitors", "total"]);
    const monthly = {};

    for await (
      const entry of this.kv.list({ prefix: ["visitors", "monthly"] })
    ) {
      const month = entry.key[2];
      if (typeof month === "string") monthly[month] = countValue(entry.value);
    }

    return {
      total: countValue(totalEntry.value),
      monthly: Object.fromEntries(Object.entries(monthly).sort()),
    };
  }
}
