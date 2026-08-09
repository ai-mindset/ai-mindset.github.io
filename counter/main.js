import { createHandler } from "./handler.js";
import { KvCounterStore } from "./store.js";

const defaultOrigins = [
  "https://ai-mindset.github.io",
  "http://127.0.0.1:8000",
  "http://localhost:8000",
];

export function configuredOrigins(value) {
  if (!value) return defaultOrigins;
  return value.split(",").map((origin) => origin.trim()).filter(Boolean);
}

if (import.meta.main) {
  const kv = await Deno.openKv();
  const store = new KvCounterStore(kv);
  const allowedOrigins = configuredOrigins(
    Deno.env.get("VISITOR_COUNTER_ALLOWED_ORIGINS"),
  );

  Deno.serve(createHandler(store, { allowedOrigins }));
}
