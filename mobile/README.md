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
- Sign-out from the placeholder dashboard

## What's next (rough order)

1. Tenant home / "Dashboard" screen with KPI tiles
2. Customers, Resellers, Vendors list screens (read from `data.json` shipped
   with the bundle, or move to a Supabase table for both web+mobile)
3. Charts — `victory-native` is the natural Recharts substitute
4. Filters (state multi-select, year/keyword multi-select) — share state shape
   with the web `useClearFilters` event-bus pattern
5. EAS Build + App Store Connect + Play Console setup
6. Push notifications (renewal-window alerts) once the web data is moved server-side

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
