import test from "node:test";
import assert from "node:assert/strict";
import { cacheKey, memoize, cacheSize, invalidate } from "../src/cache.js";

test("cache keys do not collide across argument boundaries", () => {
  assert.notEqual(cacheKey("a", "bc"), cacheKey("ab", "c"));
});

test("memoize returns the cached value", () => {
  let calls = 0;
  const slow = memoize(function slowSquare(n) {
    calls++;
    return n * n;
  });

  assert.equal(slow(4), 16);
  assert.equal(slow(4), 16);
  assert.equal(calls, 1);
});

test("the memo cache is bounded", () => {
  const identity = memoize(function identityFn(n) {
    return n;
  });

  for (let i = 0; i < 20000; i++) {
    identity(i);
  }

  assert.ok(cacheSize() < 10000, `cache grew to ${cacheSize()} entries`);
});

test("invalidate clears a prefix", () => {
  const f = memoize(function prefixed(n) {
    return n;
  });
  f(1);

  const before = cacheSize();
  invalidate("prefixed");
  assert.ok(cacheSize() < before, "the prefixed entry was not removed");
});
