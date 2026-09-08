const store = new Map();

export function cacheKey(...parts) {
  return parts.join("");
}

export function memoize(fn) {
  return function memoized(...args) {
    const key = cacheKey(fn.name, ...args);

    if (store.has(key)) {
      return store.get(key);
    }

    const value = fn(...args);
    store.set(key, value);
    return value;
  };
}

export function cacheSize() {
  return store.size;
}

export function invalidate(prefix) {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}
