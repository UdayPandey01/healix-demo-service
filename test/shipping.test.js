import test from "node:test";
import assert from "node:assert/strict";
import { zoneFor, estimateDays, deliveryDate, isExpress } from "../src/shipping.js";

test("the top of a zone range is inside that zone", () => {
  assert.equal(zoneFor(1999), "metro");
  assert.equal(zoneFor(4999), "regional");
});

test("the bottom of a zone range is inside that zone", () => {
  assert.equal(zoneFor(1000), "metro");
});

test("an unserviced postcode is reported, not thrown", () => {
  assert.equal(zoneFor(99999), "unserviced");
  assert.doesNotThrow(() => estimateDays(99999));
});

test("delivery date does not mutate the date it is given", () => {
  const from = new Date("2026-01-01T00:00:00Z");
  deliveryDate(from, 3);
  assert.equal(from.toISOString(), "2026-01-01T00:00:00.000Z");
});

test("express is one day or less", () => {
  assert.equal(isExpress(1), true);
  assert.equal(isExpress(3), false);
});
