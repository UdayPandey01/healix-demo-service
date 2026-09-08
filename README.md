# healix-demo-service

A deliberately broken Express service. It exists to be diagnosed and fixed by
[Healix](https://github.com/UdayPandey01/Healix), an autonomous Tier-1 SRE agent.

**Do not fix the bugs in this repository by hand.** They are the evaluation corpus.
Twenty-two defects are seeded across eight modules, spanning ten classes:

| Class | Example |
|---|---|
| Unhandled null | `userOrderSummary` dereferences a user that may not exist |
| Off-by-one | pagination skips the first page; a bulk-price tier boundary is exclusive |
| Race condition | `reserve` checks stock, awaits, then mutates — two callers oversell |
| Memory leak | `memoize` never evicts |
| Auth bypass | a malformed token authenticates; `nonadmin` matches `admin` by substring |
| Unit mismatch | a session TTL in seconds compared against milliseconds |
| Float precision | money accumulated without rounding |
| Input mutation | `deliveryDate` mutates the caller's `Date` |
| Missing validation | `restock` accepts a negative quantity |
| Missing timeout | `fetchWithRetry` retries forever |

There are **no `BUG:` comments** anywhere, deliberately — a marker would turn code
retrieval into a grep for the word "bug" and invalidate every recall measurement.

## Running it

```sh
npm install
npm start          # :3001, with /metrics for Prometheus
npm test           # 39 tests, 23 failing by design — one per seeded bug
```

A failing test suite is the expected state. Each failure corresponds to one seeded
bug, and Healix's job is to find the cause in the source, propose a patch, and open
a pull request for a human to review.

## How Healix uses this repo

1. Prometheus scrapes `/metrics` and fires an alert on an elevated 5xx rate.
2. Healix ingests the alert, retrieves candidate code, reads it, and runs the tests
   in an isolated Rust sandbox.
3. It proposes a patch — which is stored, not applied.
4. **A human approves it.** Only then does a pull request appear here.

Healix never merges its own pull requests.
