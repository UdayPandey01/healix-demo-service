import test from "node:test";
import assert from "node:assert/strict";
import { addItem, removeSoldOut, cartTotal, itemCount } from "../src/cart.js";

const emptyCart = () => ({ userId: 1, items: [] });

test("tags do not leak between calls that pass no options", () => {
  const first = addItem(emptyCart(), { sku: "KB-01", price: 1, qty: 1 });
  assert.deepEqual(first.tags, ["KB-01"]);

  const second = addItem(emptyCart(), { sku: "MN-02", price: 1, qty: 1 });
  assert.deepEqual(
    second.tags,
    ["MN-02"],
    "a second call with no options saw the first call's tags",
  );
});

test("an explicit options object is used as given", () => {
  const options = { tags: [] };
  const result = addItem(emptyCart(), { sku: "MS-03", price: 1, qty: 1 }, options);
  assert.deepEqual(result.tags, ["MS-03"]);
  assert.deepEqual(options.tags, ["MS-03"]);
});

test("every sold-out item is removed, including adjacent ones", () => {
  const cart = emptyCart();
  cart.items = [
    { sku: "A", price: 1, qty: 1 },
    { sku: "B", price: 1, qty: 1 },
    { sku: "C", price: 1, qty: 1 },
  ];

  removeSoldOut(cart, ["A", "B"]);

  assert.deepEqual(
    cart.items.map((i) => i.sku),
    ["C"],
  );
});

test("cart total is exact for fractional prices", () => {
  const cart = emptyCart();
  cart.items = [
    { sku: "A", price: 0.1, qty: 1 },
    { sku: "B", price: 0.2, qty: 1 },
  ];

  assert.equal(cartTotal(cart), 0.3);
});

test("item count sums quantities", () => {
  const cart = emptyCart();
  cart.items = [
    { sku: "A", price: 1, qty: 2 },
    { sku: "B", price: 1, qty: 3 },
  ];

  assert.equal(itemCount(cart), 5);
});
