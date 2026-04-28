# App Store Connect listing copy

Drop these straight into the App Store Connect form when you create the app.
Char counts are noted; Apple enforces them.

---

## App name (max 30 chars)
```
Argus
```

## Subtitle (max 30 chars) — pick one
- `Public sector sales radar` (25 chars) ← recommended
- `Procurement intel for sales` (27)
- `Public sector deal radar` (24)

## Promotional text (max 170 chars, editable any time)
```
See every dollar agencies spend with your competitors. Argus turns five
years of public procurement records into a renewal-window radar.
```
*(146 chars)*

## Keywords (max 100 chars, comma-separated, no spaces after commas)
```
procurement,sales,government,public sector,contracts,intelligence,renewals,vendor,reseller,SaaS
```
*(99 chars)*

## Description (max 4000 chars)

```
Argus is a procurement-intelligence dashboard for sellers into government and
education. We surface every contract a public-sector agency has signed in the
last five years — what they bought, who from, when, and for how much — so you
can spend the morning calling the right accounts instead of the wrong ones.

WHAT YOU GET

- Renewal-window radar: agencies whose backup, storage, or cloud contracts
  are 3-5 years old and over $10K of historical spend. These are your
  highest-probability conversations this quarter.
- Top vendors and resellers: see the full competitive landscape across all
  data — NetApp, Cohesity, Veeam, Dell PowerProtect, AWS, Azure, Accenture,
  Deloitte, KPMG and the rest. Filter to a single state, a Florida sub-region,
  a price range, a year, or any combination.
- Drill-down on click: tap any chart slice or bar to filter the entire
  dashboard to that vendor, reseller, or agency. One-tap undo to back out.
- Two competitive landscapes side by side: the Original dataset (backup
  and data protection) and the Cloud + SI dataset (hyperscalers and
  systems integrators) live in parallel. Switch between them from the
  sidebar without losing your place.

WHO IT'S FOR

- Field reps and account executives covering federal, state, county,
  K-12, and higher-ed accounts
- Sales leaders building territory plans against actual public-sector spend
  rather than industry estimates
- Channel and partnerships teams sizing reseller relationships across
  9 states and growing

PRIVACY

Argus only collects your work email, used to send a one-time sign-in code.
We don't track you across apps and don't sell or share data with third
parties. See https://argus.bz/privacy for details.

REQUIRES INVITATION

Argus is currently invite-only. If your domain isn't recognized at sign-in,
email me@treyvititoe.com to be added.
```
*(~1670 chars, well under the 4000 limit. Trim or expand any section to taste.)*

## URLs

| Field | Value |
| --- | --- |
| Marketing URL (optional) | `https://argus.bz` |
| Support URL (required) | `https://argus.bz` |
| Privacy Policy URL (required) | `https://argus.bz/privacy` |

## Categories

- Primary: **Business**
- Secondary (optional): **Productivity**

## Age rating

Answer the questionnaire honestly — Argus has no objectionable content.
The result will be **4+**.

## Demo account / App Review information

Apple needs a way to sign in without an email round-trip. Argus uses
one-time codes via Supabase, so put this in the **App Review Information →
Notes** field:

```
Argus is invite-only and uses email-based one-time codes for sign-in.

To review:
1. Tap "Send code" with email: appreview@argus.bz
2. Email me@treyvititoe.com requesting the active OTP
3. We will relay the 6-digit code within 5 minutes during business hours

If you would prefer a different demo flow, please email
me@treyvititoe.com and we can provide a temporary password-based
account.
```

You'll need to do two setup steps before submitting:
1. Add `argus.bz` (or just `appreview@argus.bz`) to `ALLOWED_DOMAINS` in
   `src/lib/auth.ts` so the email passes the domain gate
2. Set up forwarding from `appreview@argus.bz` to `me@treyvititoe.com` in
   your domain registrar so the OTP lands somewhere you can read it

If Apple pushes back ("we need a way to sign in without contacting you"),
the next step is adding a fixed test account in Supabase with
`signInWithPassword` and a separate password-based mobile sign-in form
behind a build-time flag. Let me know if it comes to that and I'll wire
it up.

## Screenshots

Required screen sizes for an iPhone-only app:
- **6.7"** (iPhone 15/14/13 Pro Max) — 1290 × 2796
- **6.5"** (iPhone XS Max / 11 Pro Max) — 1242 × 2688

Optional but nice:
- **5.5"** (older iPhones) — 1242 × 2208
- **iPad** — 2048 × 2732

How to take them on a Mac:
```
xcrun simctl boot "iPhone 15 Pro Max"
open -a Simulator
# Run the app via: cd mobile && npx expo start --ios
# Cmd-S in Simulator to capture each screen
```

Recommended captures (in order, makes the best App Store carousel):
1. Dashboard with KPI tiles + donut + bars
2. Customers tab with the search filter populated
3. Resellers ranked list with bars
4. Analytics with the spend-by-year area chart
5. The Cloud + SI dataset showing the same Dashboard so reviewers see
   the multi-dataset switcher

## Pricing & Availability

- Price: **Free**
- Availability: **United States** only for the first launch (we can expand
  later if usage warrants)

## Encryption export compliance

When prompted: **Does your app use encryption?** → **Yes**, but only
"standard encryption built into iOS / from a third-party (Supabase, HTTPS)".
This is the **exempt** path. You will not need to file an annual report
with the U.S. Bureau of Industry and Security.

## "What's New in This Version"

For the **first release**, leave this blank or write:
```
Initial release — your renewal-window radar in your pocket.
```

For subsequent releases, write 1-3 user-visible changes in plain language:
```
- Switch between Original and Cloud + SI datasets from anywhere
- Filter the Customers list by year and keyword
- Drill into any donut slice to see only that vendor's deals
```

## Final pre-submission checklist

- [ ] App icons and splash screen exist (`mobile/assets/`)
- [ ] `eas.json` checked in (already is)
- [ ] `app.json` has the right bundle ID `com.treyvititoe.argus`
- [ ] Production build via `eas build --profile production --platform ios`
      succeeded and produced an archive
- [ ] Bundle ID matches App Store Connect listing
- [ ] Privacy URL resolves: https://argus.bz/privacy
- [ ] Support URL resolves: https://argus.bz
- [ ] App Review notes include the demo account instructions above
- [ ] Screenshots uploaded for at least 6.7" and 6.5"
- [ ] Encryption export compliance answered (Yes, standard, exempt)
- [ ] Submit for review
