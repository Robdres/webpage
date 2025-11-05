import { jest, describe, test, expect, beforeEach } from "@jest/globals";

// apiClient.test.js
import { createApiClient, withRetry, withTimeout, createLimiter } from "./apiClient.js";

function mockFetchOnce(status = 200, json = {}, delayMs = 0) {
  global.fetch = jest.fn().mockImplementationOnce(() =>
    new Promise((resolve) => {
      setTimeout(() => resolve({
        ok: status >= 200 && status < 300,
        status,
        json: async () => json,
        text: async () => JSON.stringify(json),
      }), delayMs);
    })
  );
}

beforeEach(() => {
  jest.useRealTimers();
  global.fetch = undefined;
});

test("withTimeout resolves before timeout", async () => {
  const res = await withTimeout(Promise.resolve(42), 50);
  expect(res).toBe(42);
});

test("withTimeout rejects on timeout", async () => {
  await expect(withTimeout(new Promise(() => {}), 5))
    .rejects.toThrow(/timed out/);
});

test("withRetry retries on error then succeeds", async () => {
  let tries = 0;
  const fn = jest.fn().mockImplementation(async () => {
    tries++;
    if (tries < 3) throw new Error("net fail");
    return "ok";
  });
  const out = await withRetry(fn, { retries: 5, backoffMs: 1, factor: 1.1 });
  expect(out).toBe("ok");
  expect(tries).toBe(3);
});

test("createLimiter caps concurrency", async () => {
  const limit = createLimiter(2);
  let running = 0, maxSeen = 0;

  const task = (ms) => limit(async () => {
    running++; maxSeen = Math.max(maxSeen, running);
    await new Promise((r) => setTimeout(r, ms));
    running--;
    return ms;
  });

  const results = await Promise.all([
    task(30), task(30), task(30), task(30)
  ]);

  expect(maxSeen).toBeLessThanOrEqual(2);
  expect(results).toHaveLength(4);
});

test("getInfo calls /info and returns JSON", async () => {
  mockFetchOnce(200, { model: "XGB", features: { numeric: [], categorical: [] } });
  const api = createApiClient({ baseUrl: "http://x" });
  const data = await api.getInfo();
  expect(data.model).toBe("XGB");
});

test("predictOne POSTs payload", async () => {
  mockFetchOnce(200, { predictions: [0.7] });
  const api = createApiClient({ baseUrl: "http://x" });
  const data = await api.predictOne({ a: 1 });
  expect(data.predictions[0]).toBe(0.7);
});

test("predictBatch handles arrays", async () => {
  mockFetchOnce(200, { predictions: [0.1, 0.2, 0.3] });
  const api = createApiClient({ baseUrl: "http://x" });
  const data = await api.predictBatch([{},{},{}]);
  expect(data.predictions.length).toBe(3);
});

test("bulkPredict chunks, limits, and flattens", async () => {
  // three chunks -> mock three responses
  global.fetch = jest.fn()
    .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ predictions: [1,2] }), text: async () => "" })
    .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ predictions: [3,4] }), text: async () => "" })
    .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ predictions: [5] }), text: async () => "" });

  const api = createApiClient({ baseUrl: "http://x" });
  const samples = Array.from({ length: 5 }, (_, i) => ({ i }));
  const preds = await api.bulkPredict(samples, { batchSize: 2, concurrency: 2 });
  expect(preds).toEqual([1,2,3,4,5]);
});

test("error surfaces on 5xx", async () => {
  mockFetchOnce(500, { error: "server sad" });
  const api = createApiClient({ baseUrl: "http://x", timeoutMs: 100 });
  await expect(api.getInfo()).rejects.toThrow(/failed \(500\)/);
});

