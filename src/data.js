export const users = [
  { id: 1, name: "Ada", email: "ada@example.com", roles: ["admin", "staff"] },
  { id: 2, name: "Grace", email: "grace@example.com", roles: ["staff"] },
  { id: 3, name: "Alan", email: "alan@example.com", roles: ["customer"] },
  { id: 4, name: "Edsger", email: "edsger@example.com", roles: ["nonadmin"] },
];

export const orders = [
  { id: 101, userId: 1, item: "Keyboard", total: 49.99 },
  { id: 102, userId: 1, item: "Monitor", total: 199.0 },
  { id: 103, userId: 2, item: "Mouse", total: 24.5 },
  { id: 104, userId: 2, item: "Desk", total: 320.0 },
  { id: 105, userId: 3, item: "Lamp", total: 35.0 },
  { id: 106, userId: 3, item: "Chair", total: 210.0 },
  { id: 107, userId: 1, item: "Cable", total: 9.99 },
];

export const stock = [
  { sku: "KB-01", name: "Keyboard", onHand: 12, reserved: 0 },
  { sku: "MN-02", name: "Monitor", onHand: 3, reserved: 0 },
  { sku: "MS-03", name: "Mouse", onHand: 0, reserved: 0 },
  { sku: "DK-04", name: "Desk", onHand: 7, reserved: 0 },
];

export const priceTiers = [
  { minQty: 1, unitPrice: 10.0 },
  { minQty: 10, unitPrice: 9.0 },
  { minQty: 50, unitPrice: 8.0 },
];

export const taxRates = {
  "GB": 0.2,
  "IE": 0.23,
  "US-CA": 0.0725,
};

export const shippingZones = [
  { zone: "metro", from: 1000, to: 1999, days: 1 },
  { zone: "regional", from: 2000, to: 4999, days: 3 },
  { zone: "remote", from: 5000, to: 9999, days: 7 },
];

export function findUser(id) {
  return users.find((u) => u.id === id);
}

export function findStock(sku) {
  return stock.find((s) => s.sku === sku);
}
