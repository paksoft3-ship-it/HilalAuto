# Oto Grade Marketplace

Next.js 14 App Router marketplace for damaged car listings, dealer subscriptions, admin moderation, analytics, notifications, and buyer favorites.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000/tr`.

## Required Environment

Core app:

```bash
NEXT_PUBLIC_SITE_URL=https://otograde.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Optional email/tracking:

```bash
RESEND_API_KEY=
ADMIN_EMAIL=paksoft3@gmail.com
FROM_EMAIL="Otograde <notifications@otograde.com>"
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_GA4_ID=
```

## Database Migrations

Apply migrations in order in Supabase SQL editor or via Supabase CLI:

1. `supabase/migrations/001_marketplace_schema.sql`
2. `supabase/migrations/002_admin_rls.sql`
3. `supabase/migrations/003_notifications.sql`
4. `supabase/migrations/004_payments_favorites_audit.sql`

Migration `004` adds:

- `hazaral_subscription_payments`
- `hazaral_admin_audit_logs`
- buyer favorite `updated_at`
- listing favorite-count trigger

## Dealer Subscription Payments

The dealer subscription page is `/tr/bayi-paneli/abonelik`.

If iyzico variables are not configured, payment requests are created as manual pending records and can be approved in `/tr/admin/abonelikler`.

To enable iyzico checkout:

```bash
IYZICO_API_KEY=
IYZICO_SECRET_KEY=
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
IYZICO_SUBSCRIPTION_PLAN_BASIC=
IYZICO_SUBSCRIPTION_PLAN_PROFESSIONAL=
IYZICO_SUBSCRIPTION_PLAN_PREMIUM=
IYZICO_DEFAULT_IDENTITY_NUMBER=11111111111
```

The iyzico callback route is:

```text
/api/payments/iyzico/callback
```

Use the full deployed URL in iyzico settings, for example:

```text
https://otograde.com/api/payments/iyzico/callback
```

## Smoke Tests

Install browsers once if needed:

```bash
npx playwright install
```

Run public smoke tests:

```bash
npm run test:e2e:smoke -- --project=chromium
```

Credentialed admin/dealer tests are skipped unless these env vars are set:

```bash
E2E_ADMIN_EMAIL=
E2E_ADMIN_PASSWORD=
E2E_DEALER_EMAIL=
E2E_DEALER_PASSWORD=
```

To test a deployed site instead of local dev:

```bash
PLAYWRIGHT_BASE_URL=https://otograde.com npm run test:e2e:smoke -- --project=chromium
```

## Useful Routes

- Marketplace: `/tr/ara`
- Buyer favorites: `/tr/favoriler`
- Dealer login: `/tr/bayi-paneli/giris`
- Dealer subscription: `/tr/bayi-paneli/abonelik`
- Admin login: `/tr/admin/login`
- Admin subscriptions: `/tr/admin/abonelikler`
- Admin audit logs: `/tr/admin/audit-loglari`
