# QA toolkit

All of this is read-only against your data. Run it against a **local build** (or a Vercel preview), never production.

```bash
npm run build && npx next start -p 3460          # in one terminal

npm test                                          # 80 unit tests (Vitest, no network, no DB)
PLAYWRIGHT_BASE_URL=http://localhost:3460 npx playwright test      # integration + smoke, desktop & mobile
node scripts/qa/crawl.mjs http://localhost:3460   # SEO crawler: status codes, redirects, titles, canonicals, h1, links
node scripts/qa/load.mjs  http://localhost:3460 --users=1500 --ramp=60 --concurrency=30 --db-rate=0
node scripts/qa/capacity.mjs http://localhost:3460 /ilanlar --rates=1,2,4,6,8 --seconds=15
```

Notes
- The local server uses `.env.local`, i.e. the **production Supabase**. `load.mjs --db-rate` caps requests to pages that query
  the database on every hit; `--db-rate=0` skips them. `capacity.mjs` should stay at small rates.
- Integration tests refuse to run against `otograde.com` unless `ALLOW_PROD_TESTS=1`.
- The cron endpoints are deliberately never called by any test (they run real jobs and are open when `CRON_SECRET` is unset).
- Admin/dealer login tests need `E2E_ADMIN_EMAIL/PASSWORD` and `E2E_DEALER_EMAIL/PASSWORD`; otherwise they skip.
- Load numbers measure the machine running `next start`, not Vercel's autoscaling.
- After deploying, delete `.next/cache/fetch-cache` before a local rebuild or the build reuses stale Supabase responses.
