# Publishing Argus to the App Store + Play Store

This is the runbook to take the Expo app from `mobile/` to a public listing on
both stores. Roughly **2-4 hours of your time** spread across a couple of days
(most waiting is App Store review, ~24-48h).

## 0. One-time accounts (do these first)

### Apple Developer Program — $99/yr
1. Go to [developer.apple.com](https://developer.apple.com/programs/) → Enroll
2. Use your existing Apple ID (or create one)
3. Choose **Individual** unless Argus is an LLC/Corp (then Organization, which
   needs a D-U-N-S number — slower)
4. Pay the $99, wait for the activation email (usually under a day)

### Google Play Console — $25 one-time
1. Go to [play.google.com/console](https://play.google.com/console/signup)
2. Sign in with the Google account you want to own the app
3. Pay the $25 registration fee
4. Verify your identity (Google may ask for ID + a billing-name match)

### Expo / EAS — free
1. Sign up at [expo.dev](https://expo.dev) if you don't have an account
2. Locally: `npm install -g eas-cli` then `eas login`

## 1. Hook the project up to EAS

From `mobile/`:

```bash
eas init                  # creates an EAS project, writes the project ID into app.json
eas build:configure       # confirms the eas.json that already ships with the repo
```

`eas init` will edit `mobile/app.json` to add an `extra.eas.projectId` field —
commit that change.

## 2. App icons + splash screen

Required before anything submits cleanly. Drop these into `mobile/assets/`:

- `icon.png` — 1024×1024, no transparency, no rounded corners (Apple rejects them)
- `splash.png` — 1284×2778 is safest, simple centered logo on `#F2EBDD`
- `adaptive-icon.png` — 1024×1024, foreground only (Android applies the shape mask)

Then re-add the `icon`, `splash`, and `android.adaptiveIcon` keys to `app.json`
that I removed during scaffolding to keep the bundle building without art.
Reference: [Expo: App icons](https://docs.expo.dev/develop/user-interface/app-icons/).

## 3. First test build (internal)

```bash
eas build --profile preview --platform ios       # .ipa, simulator-installable
eas build --profile preview --platform android   # .apk, sideload-installable
```

Each takes ~15-25 min on EAS's servers. Both produce a download link.
Sideload to your own device first; click around every tab.

## 4. Production builds

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

Now we have real `.ipa` / `.aab` files signed for the stores.

## 5. App Store Connect listing

1. [appstoreconnect.apple.com](https://appstoreconnect.apple.com) → **My Apps** → **+**
2. New iOS app with bundle ID `com.argus.mobile` (must match `app.json`)
3. Fill in:
   - **App information**: name "Argus", subtitle, primary category "Business"
   - **Privacy policy URL**: `https://argus.bz/privacy` (already shipped)
   - **App Privacy**: declare that the app collects email address (for auth) but
     doesn't track users across other apps. Use Apple's questionnaire.
   - **Pricing**: Free
   - **Screenshots**: required for 6.7" iPhone, 6.5" iPhone, optionally iPad
     and 5.5" iPhone. Take from the Expo build via simulator screenshots.
   - **Description**: <= 4000 chars, similar to the marketing copy on the web
     landing page
   - **Keywords**: 100 chars, comma-separated. e.g. "procurement, sales,
     intelligence, government, contracts"
   - **Support URL**, **Marketing URL**: both can be `https://argus.bz`
4. **TestFlight**: optional internal beta tab — drop a tester email or two
5. Click **Add for review** → submit the production build → **Submit for review**

Apple review is typically 24-48h. Common rejection reasons here:
- "This is just a webview" — unlikely since we have native auth + native
  navigation, but if they push back, point to the Supabase OTP login as a
  native flow
- Missing demo credentials — provide a test email/password under "App
  Review Information" so reviewers can sign in. (Or whitelist
  `appreview@apple.com` in `ALLOWED_DOMAINS` server-side.)

## 6. Google Play Console listing

1. [play.google.com/console](https://play.google.com/console) → **Create app**
2. Package name `com.argus.mobile` (must match `app.json`)
3. **Closed testing** track first: upload the production `.aab`, add a few
   testers' email addresses, submit. Google takes ~2-4 hours for review on the
   first submission.
4. Once closed testing is live, fill out:
   - Store listing: title, short + full description, screenshots (phone +
     7" tablet + 10" tablet)
   - Content rating (questionnaire — Argus is "everyone")
   - Target audience: 18+ business users
   - Privacy policy URL
   - Data safety form: same answers as App Privacy on iOS — we collect email
     for auth, no advertising/tracking
5. Promote to **Production**: takes another ~24h on first launch

## 7. Submitting via EAS (alternative to manual upload)

After everything's set up:

```bash
eas submit --platform ios --latest        # uploads to App Store Connect
eas submit --platform android --latest    # uploads to Play Console
```

You'll be prompted for App Store Connect API key (one-time) and Play service
account JSON. Both are in their respective consoles under Users / API Keys.

## 8. Updates

Most JS changes ship via **EAS Update** (over-the-air, no review):

```bash
eas update --branch production --message "fix Customers filter"
```

Anything that touches native code (new package with native deps, app.json
plugin changes, etc.) requires a fresh `eas build` + store submission.

## What to expect on cost / time

| Item | Cost | Time |
| --- | --- | --- |
| Apple Developer | $99/yr | 1-24h enrollment |
| Google Play Console | $25 one-time | minutes |
| Expo / EAS | free for now | — |
| First iOS build | $0 (free tier covers ~30/mo) | 15-25 min |
| First Android build | $0 | 15-25 min |
| App Store review | $0 | 24-48h |
| Play closed test review | $0 | 2-4h |
| Play production review | $0 | 24h+ |

## Checklist

- [ ] Apple Developer account active
- [ ] Play Console account active
- [ ] `eas login` working
- [ ] `eas init` ran and projectId committed
- [ ] Icons + splash created and added to `app.json`
- [ ] `eas build --profile preview` runs clean for both platforms
- [ ] App Store Connect entry created with screenshots + description
- [ ] Play Console entry created with screenshots + description
- [ ] First production builds submitted for review
- [ ] Approved + live in both stores
