// bulkRunner.js
import { createApiClient } from "./apiClient.js";

async function main() {
  const api = createApiClient({ baseUrl: "http://localhost:8000", timeoutMs: 15_000 });

  // Pull schema to build synthetic records
  const info = await api.getInfo();
  const { numeric, categorical } = info.features;

  // Create N synthetic records (customize as you like)
  const N = 2000;             // total predictions
  const BATCH = 200;          // batch size per POST
  const CONCURRENCY = 8;      // parallel POSTs

  const samples = Array.from({ length: N }, (_, i) => {
    const s = {};
    // simple synthetic values:
    for (const n of numeric) s[n] = Math.round(50 + 15 * Math.sin(i / 17 + n.length));
    for (const c of categorical) {
      // pick a few plausible strings; server OHE can handle unknown
      const pool = ["LOW", "MEDIUM", "HIGH", "NEVER", "FORMER", "CURRENT", "NORMAL", "OVERWEIGHT"];
      s[c] = pool[(i + c.length) % pool.length];
    }
    return s;
  });

  console.time("bulkPredict");
  const preds = await api.bulkPredict(samples, {
    batchSize: BATCH,
    concurrency: CONCURRENCY,
    mapToSchema: true,
    schema: { numeric, categorical }
  });
  console.timeEnd("bulkPredict");

  console.log(`Got ${preds.length} predictions. Example:`, preds.slice(0, 5));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


