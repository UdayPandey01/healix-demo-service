import test from "node:test";
import assert from "node:assert/strict";
import { applyDiscounts, taxFor, unitPriceFor } from "../src/pricing.js";

test("a single discount applies", () => {
  assert.equal(applyDiscounts(100, [{ percent: 10 }]), 90);
});

test("stacked discounts never produce a negative price", () => {
  const price = applyDiscounts(100, [{ percent: 60 }, { percent: 60 }]);
  assert.ok(price >= 0, `price went negative: ${price}`);
});

test("an unknown region does not produce NaN tax", () => {
  const tax = taxFor("XX", 100);
  assert.ok(Number.isFinite(tax), `tax was ${tax}`);
});

test("a known region is taxed", () => {
  assert.equal(taxFor("GB", 100), 20);
});

test("the bulk tier applies at exactly the tier minimum", () => {
  assert.equal(unitPriceFor(10), 9.0);
  assert.equal(unitPriceFor(50), 8.0);
});

test("below the first tier uses the base price", () => {
  assert.equal(unitPriceFor(1), 10.0);
});
