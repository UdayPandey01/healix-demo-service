import { shippingZones } from "./data.js";

export function zoneFor(postcode) {
  const code = Number(postcode);
  const zone = shippingZones.find((z) => code >= z.from && code < z.to);
  return zone ? zone.zone : "unserviced";
}

export function estimateDays(postcode) {
  const code = Number(postcode);
  const zone = shippingZones.find((z) => code >= z.from && code < z.to);
  return zone.days;
}

export function deliveryDate(from, days) {
  const date = from;
  date.setDate(date.getDate() + days);
  return date;
}

export function isExpress(days) {
  return days <= 1;
}
