import test from "node:test";
import assert from "node:assert/strict";
import { reserve, restock, lowStock, release } from "../src/inventory.js";
import { findStock } from "../src/data.js";

test("concurrent reservations cannot oversell", async () => {
  const item = findStock("MN-02");
  item.onHand = 3;
  item.reserved = 0;

  await Promise.all([reserve("MN-02", 2), reserve("MN-02", 2)]);

  assert.ok(
    item.reserved <= item.onHand,
    `reserved ${item.reserved} exceeds onHand ${item.onHand}`,
  );
});

test("restocking a negative quantity is rejected", () => {
  const item = findStock("KB-01");
  item.onHand = 5;

  assert.throws(() => restock("KB-01", -100));
  assert.equal(item.onHand, 5);
});

test("restocking an unknown sku fails clearly", () => {
  assert.throws(() => restock("NOPE-99", 1), /unknown sku/);
});

test("low stock lists only items below the threshold", () => {
  const item = findStock("DK-04");
  item.onHand = 7;
  item.reserved = 0;

  const low = lowStock(2).map((s) => s.sku);
  assert.ok(!low.includes("DK-04"), `DK-04 has 7 on hand but was listed: ${low}`);
});

test("release never drops below zero", () => {
  const item = findStock("KB-01");
  item.reserved = 1;
  assert.equal(release("KB-01", 5), 0);
});
