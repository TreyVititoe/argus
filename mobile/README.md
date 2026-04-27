# Argus mobile (Expo)

React Native rebuild of the web app, wrapping the same Supabase backend.
This folder is independent of the Next.js web build at the repo root —
Vercel only reads the root `package.json`, so anything under `mobile/`
is invisible to web deployments.

## Prereqs

- Node 20+
- The Expo Go app installed on the device you want to test on
  (App Store / Play Store), or a simulator on macOS

## First-time setup

```bash
cd mobile
npm install
cp .env.local.example .env.local   # see "Environment" below, then fill in
```

### Environment

`mobile/.env.local` (untracked):

```
EXPO_PUBLIC_SUPABASE_ANON_KEY=<paste anon key from Supabase dashboard>
```

The Supabase project URL is hard-coded in `app.json` under `extra.supabaseUrl`
to avoid the env-key dance for non-secret values. Update it there if the
project changes.

To enable the 6-digit OTP code in the magic-link email, the Supabase
auth template needs `{{ .Token }}` somewhere in the body. The web app
keeps using the URL link; mobile parses the code.

## Run it

```bash
npm start
```

Scan the QR code with Expo Go (Android) or the camera app (iOS).

## What works today

- Auth shell: email → 6-digit code → verified session
- Allowed-domain check (`cohesity.com`, `treyvititoe.com`) before sending the code
- Auto sign-in on subsequent launches via persisted session in AsyncStorage
- Bottom-tab nav: Dashboard / Customers / Resellers / Vendors / Analytics
- Dashboard with KPI tiles + top vendors / resellers / states lists
- Customers tab: top-100 transactions with live search filter
- Resellers and Vendors tabs: ranked share lists with bars
- Analytics tab: spend-by-year horizontal bars (real charts come next)
- Sign-out from any screen

## Data snapshot

The mobile app does *not* bundle the 14MB raw `data.json` from the web side.
Instead, `mobile/scripts/build-snapshot.js` reads it and writes a precomputed
~25KB pair of JSON files into `mobile/src/data/`:

- `dashboard-stats.json` — totals, top-N aggregates, year spend, states
- `top-transactions.json` — top 100 transactions by amount

Re-run after the web `src/lib/data.json` changes:

```bash
npm run snapshot
```

(Long-term we move data fetching to Supabase / an API and drop the snapshot.)

## What's next (rough order)

1. Charts — `victory-native` is the natural Recharts substitute (donuts +
   bars + area for Spend by Year)
2. Click-to-drill parity with web (slice / bar → narrows the screen,
   sticky Undo)
3. Filter UI (state multi-select, year/keyword multi-select)
4. Move data off the bundled snapshot to a Supabase table or API
5. App Store + Play Store submission — see [PUBLISHING.md](./PUBLISHING.md)
6. Push notifications for renewal-window alerts

## Architecture notes

- **Routing**: `expo-router` with file-based routes under `app/`
- **Auth**: `@supabase/supabase-js` with `AsyncStorage` persistence and
  `detectSessionInUrl: false` (no URL-pickup; mobile uses the OTP-code path)
- **Style**: plain `StyleSheet` for now. If the screen count grows we can
  pull in Tamagui / Restyle, but the web app is plain CSS modules + Tailwind
  classes, neither of which port cleanly to RN, so duplicating tokens
  manually is the simplest path until we extract a shared design package.

## Running the web app

The web app at the repo root is unaffected. From the repo root:

```bash
npm install   # if you haven't yet
npm run dev
```
