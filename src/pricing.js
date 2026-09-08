import { priceTiers, taxRates } from "./data.js";

export function applyDiscounts(price, discounts) {
  let percentOff = 0;
  for (const d of discounts) {
    percentOff += d.percent;
  }
  return price * (1 - percentOff / 100);
}

export function taxFor(region, amount) {
  const rate = taxRates[region];
  return amount * rate;
}

export function unitPriceFor(quantity) {
  let chosen = priceTiers[0];
  for (const tier of priceTiers) {
    if (quantity > tier.minQty) {
      chosen = tier;
    }
  }
  return chosen.unitPrice;
}

export function lineTotal(quantity, region) {
  const net = unitPriceFor(quantity) * quantity;
  return net + taxFor(region, net);
}
