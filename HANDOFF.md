# Argus — Handoff & Next-Step Setup

This file is the canonical list of things that need a real account or human
decision before they can ship. Everything here is wired in code or stubbed
behind an env var; the action is on you to provision the account and paste
the value into Vercel.

## 1. Supabase Auth (integrated, needs env vars)

**Status:** Argus uses Supabase Auth via magic-link sign-in. The integration
is in code; the project needs a Supabase backend behind it.

**Setup (one-time):**
1. Create a project at https://supabase.com (free tier).
2. **Settings → API**: copy the Project URL and `anon` public key.
3. **Authentication → URL Configuration**:
   - **Site URL**: `https://www.argus.bz`
   - **Redirect URLs**: add `https://www.argus.bz/auth/callback` and
     `http://localhost:3000/auth/callback`. Add Vercel preview wildcards if you
     want preview deployments to log in too.
4. **Authentication → Email Templates → Magic Link**: tweak subject/body to
   match Argus voice (optional).
5. Add to Vercel env vars (Production + Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Drop the same two into local `.env.local` for dev.

The old `AUTH_SECRET` env var is now unused — safe to delete from Vercel.

**Onboarding a new tenant (e.g., CrowdStrike):**
- Add `"crowdstrike.com": "crowdstrike"` to `DOMAIN_TO_TENANT` in
  `src/lib/auth.ts`. That alone gates the login. Tenant data lookup is in
  `src/lib/tenants.ts`.

## 2. Counsel review of legal pages

**Status:** Drafts marked "intended to be reviewed by counsel" at the bottom.

Pages to review: `/privacy`, `/terms`, `/dpa`, `/sla`, `/aup`.

**Cheapest path:** Run them through TermsFeed or GetTerms.io ($30-100 each
generates a real lawyer-vetted template you can swap our copy for).

**Right path:** Have a SaaS-experienced attorney review. Plan on $1K-$3K
across all five docs. Once you have signed-off versions, paste the body
content into the existing pages and the styling stays consistent.

## 3. Multi-tenant data

**Status:** Tenant config lives in `src/lib/tenants.ts`. Cohesity is the only
tenant with `hasData: true`. New tenants currently land on a "your dataset is
being indexed" onboarding page.

**To onboard a new tenant (e.g., CrowdStrike):**
1. Add `"crowdstrike.com": "crowdstrike"` to `DOMAIN_TO_TENANT` in
   `src/lib/auth.ts`.
2. Add a CrowdStrike entry to `TENANTS` in `src/lib/tenants.ts` with
   `hasData: true` only after step 3.
3. Add the dataset to `TENANT_TRANSACTIONS` in `tenants.ts`. Today this means
   bundling another JSON file. When we build the real ingestion pipeline,
   it'll be a database lookup.
4. (Optional) Drop a logo at `/public/crowdstrike.png` and add an entry in
   `src/components/TenantLogo.tsx`.

## 4. Sentry (error monitoring)

**Status:** Not installed. The dependency hasn't been added to keep the
bundle lean until you've decided.

**To enable:**
1. Create a Sentry project at https://sentry.io
2. Install the SDK locally:
   ```
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```
3. The wizard generates a `sentry.config.ts` and sets up Vercel env vars
   automatically. Push the resulting changes.
4. Tell me if you want me to add custom error boundaries on top.

## 5. Analytics (Plausible)

**Status:** Wired in `src/app/layout.tsx` behind the
`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env var. If unset, no script is loaded.

**To enable:**
1. Create a Plausible site at https://plausible.io for `argus.bz`
2. Add `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=argus.bz` to Vercel env vars (Production
   + Preview).
3. Redeploy. Pageviews start showing in the Plausible dashboard immediately.

Plausible is cookieless and privacy-friendly, so no consent banner is
required. If you go GA4 instead, we'll need to add a consent prompt.

## 6. Demo video / GIF

**Status:** Can't be done from a coding agent. You record this locally.

**Easiest path (Mac):**
1. `Cmd + Shift + 5` → Record Selected Portion → record the dashboard.
2. Aim for ~15 seconds: hover state pills → click FL → click 2024 → done.
3. Save the .mov.
4. Convert to MP4 with HandBrake or Gifski (App Store) for a smaller embed.
5. Drop into `/public/demo.mp4` and tell me; I'll embed it on the landing page
   instead of the static preview.

**Alternative:** Record on Loom (free), get the embed URL, tell me, I'll
swap the static preview for the Loom embed.

## 7. Custom OG image (optional improvement)

**Status:** Generated dynamically by `src/app/opengraph-image.tsx` (Next.js
`ImageResponse` API). Fine for v1 but a designed PNG would convert better.

Drop a 1200x630 PNG at `/public/og.png` and tell me; I'll switch the OG
metadata to point at it instead of the dynamic version.
