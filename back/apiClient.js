import { jest, describe, test, expect, beforeEach } from "@jest/globals";

// apiClient.js
const DEFAULT_BASE = "http://localhost:8000";

// ---- low-level utilities ----
export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function withTimeout(promise, ms, label = "request") {
  let t;
  const timeout = new Promise((_, rej) => {
    t = setTimeout(() => rej(new Error(`${label} timed out after ${ms} ms`)), ms);
  });
  try {
    const res = await Promise.race([promise, timeout]);
    return res;
  } finally {
    clearTimeout(t);
  }
}

export async function withRetry(fn, {
  retries = 3,
  backoffMs = 250,
  factor = 2,
  isRetryable = (e) => {
    // network or 5xx -> retry, 4xx -> don't
    const msg = String(e?.message ?? e);
    if (/^API .* failed \((\d{3})\)/.test(msg)) {
      const code = Number(msg.match(/\((\d{3})\)/)[1]);
      return code >= 500; // only 5xx
    }
    return true; // network/other
  }
} = {}) {
  let attempt = 0;
  let delay = backoffMs;
  while (true) {
    try {
      return await fn();
    } catch (e) {
      attempt++;
      if (attempt > retries || !isRetryable(e)) throw e;
      await sleep(delay);
      delay *= factor;
    }
  }
}

// Simple concurrency limiter (no deps)
export function createLimiter(maxConcurrent = 10) {
  let running = 0;
  const queue = [];
  const runNext = () => {
    if (running >= maxConcurrent || queue.length === 0) return;
    const { fn, resolve, reject } = queue.shift();
    running++;
    fn()
      .then((v) => resolve(v))
      .catch((e) => reject(e))
      .finally(() => {
        running--;
        runNext();
      });
  };
  return function limit(fn) {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      runNext();
    });
  };
}

// ---- HTTP core ----
export function createApiClient({ baseUrl = DEFAULT_BASE, timeoutMs = 10_000 } = {}) {
  async function apiRequest(endpoint, method = "GET", body = null) {
    const opts = { method, headers: { "Content-Type": "application/json" } };
    if (body !== null) opts.body = JSON.stringify(body);

    const doFetch = () => withTimeout(
      fetch(`${baseUrl}${endpoint}`, opts),
      timeoutMs,
      `API ${endpoint}`
    );

    const res = await withRetry(() => doFetch(), { retries: 3, backoffMs: 300 });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API ${endpoint} failed (${res.status}): ${errText}`);
    }
    return res.json();
  }

  // Public endpoints
  async function getInfo() {
    return apiRequest("/info");
  }

  async function predictOne(sample) {
    return apiRequest("/predict", "POST", sample);
  }

  async function predictBatch(samples) {
    return apiRequest("/predict", "POST", samples);
  }

  // Schema-aware coercion (optional)
  function coerceToSchema(sample, schema) {
    const out = {};
    for (const col of schema.numeric) {
      const v = sample[col];
      if (v === undefined || v === null || v === "") { out[col] = null; continue; }
      const n = Number(v);
      out[col] = Number.isFinite(n) ? n : null; // let server impute if null
    }
    for (const col of schema.categorical) {
      const v = sample[col];
      out[col] = (v === undefined || v === null) ? null : String(v);
    }
    return out;
  }

  // Bulk utilities
  async function bulkPredict(samples, {
    batchSize = 100,
    concurrency = 5,
    mapToSchema = false,
    schema = null,
  } = {}) {
    const limit = createLimiter(concurrency);
    const chunks = [];
    for (let i = 0; i < samples.length; i += batchSize) {
      chunks.push(samples.slice(i, i + batchSize));
    }

    // optional schema coercion
    const coerce = (s) => (mapToSchema && schema) ? coerceToSchema(s, schema) : s;

    const promises = chunks.map((chunk) =>
      limit(() => predictBatch(chunk.map(coerce)))
    );

    // Preserve order by chunk index, then flatten
    const results = await Promise.all(promises);
    const preds = [];
    for (const r of results) preds.push(...r.predictions);
    return preds;
  }

  return {
    getInfo,
    predictOne,
    predictBatch,
    bulkPredict,
    coerceToSchema,
  };
}


