import test from "node:test";
import assert from "node:assert/strict";
import { fetchWithRetry, parseResponse, buildUrl } from "../src/http.js";

// Bounded with Promise.race so an unbounded retry loop fails this test in two
// seconds instead of hanging the whole suite until the sandbox timeout kills it.
test("retries give up instead of looping forever", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return new Response("", { status: 503 });
  };

  const gaveUp = Symbol("gave-up");
  const timedOut = Symbol("timed-out");

  try {
    const outcome = await Promise.race([
      fetchWithRetry("http://example.invalid").then(
        () => gaveUp,
        () => gaveUp,
      ),
      new Promise((resolve) => setTimeout(() => resolve(timedOut), 2000).unref()),
    ]);

    assert.equal(
      outcome,
      gaveUp,
      `still retrying after 2s and ${calls} attempts — no attempt cap or timeout`,
    );
  } finally {
    globalThis.fetch = original;
  }
});

test("an empty body does not throw a raw SyntaxError", async () => {
  const res = new Response("", { status: 204 });
  await assert.doesNotReject(() => parseResponse(res));
});

test("a JSON body parses", async () => {
  const res = new Response(JSON.stringify({ ok: true }));
  assert.deepEqual(await parseResponse(res), { ok: true });
});

test("query parameters are encoded", () => {
  const url = buildUrl("http://x.test/search", { q: "a b&c=d" });
  assert.ok(!url.includes("a b"), `unencoded space in ${url}`);
  assert.ok(url.includes("a%20b") || url.includes("a+b"), url);
});
