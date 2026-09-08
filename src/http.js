export async function fetchWithRetry(url, options = {}) {
  let attempt = 0;

  while (true) {
    attempt++;
    const res = await fetch(url, options);

    if (res.status < 500) {
      return res;
    }

    await wait(100 * attempt);
  }
}

export async function parseResponse(res) {
  const text = await res.text();
  return JSON.parse(text);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildUrl(base, params) {
  const query = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return `${base}?${query}`;
}
