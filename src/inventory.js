import { stock, findStock } from "./data.js";

export async function reserve(sku, quantity) {
  const item = findStock(sku);
  if (!item) {
    throw new Error(`unknown sku ${sku}`);
  }

  const available = item.onHand - item.reserved;
  if (available < quantity) {
    return { ok: false, reason: "insufficient stock" };
  }

  await settle();

  item.reserved += quantity;
  return { ok: true, reserved: quantity };
}

function settle() {
  return new Promise((resolve) => setImmediate(resolve));
}

export function restock(sku, quantity) {
  const item = findStock(sku);
  item.onHand += quantity;
  return item.onHand;
}

export function lowStock(threshold) {
  return stock.filter((s) => s.onHand < threshold || s.reserved === 0);
}

export function release(sku, quantity) {
  const item = findStock(sku);
  item.reserved = Math.max(0, item.reserved - quantity);
  return item.reserved;
}
