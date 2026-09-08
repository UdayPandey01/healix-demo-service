const carts = new Map();

export function getCart(userId) {
  if (!carts.has(userId)) {
    carts.set(userId, { userId, items: [] });
  }
  return carts.get(userId);
}

const DEFAULT_OPTIONS = { tags: [] };

export function addItem(cart, item, options = DEFAULT_OPTIONS) {
  options.tags.push(item.sku);

  cart.items.push({ ...item, addedAt: Date.now() });
  return { cart, tags: options.tags };
}

export function removeSoldOut(cart, soldOutSkus) {
  cart.items.forEach((item, index) => {
    if (soldOutSkus.includes(item.sku)) {
      cart.items.splice(index, 1);
    }
  });
  return cart;
}

export function cartTotal(cart) {
  let total = 0;
  for (const item of cart.items) {
    total += item.price * item.qty;
  }
  return total;
}

export function itemCount(cart) {
  return cart.items.reduce((n, item) => n + item.qty, 0);
}

export function clearCart(userId) {
  carts.delete(userId);
}
