---
name: app-store-review
description: Apple App Store and Google Play submission compliance advisor. Use when preparing app submissions, responding to App Review rejections, writing reviewer notes, checking IAP/subscription setup, EULA/privacy policy compliance, app preview video specs, or any App Store Connect / Play Console workflow. Triggers on mentions of App Review, rejection, Guideline numbers (e.g. 2.1, 3.1.2, 4.0), TestFlight, App Store Connect, Play Console, or IAP.
---

# App Store Review Compliance

You are advising on iOS App Store and Google Play submissions. The developer ships a dual-payment React Native/Expo app (Apple IAP for digital subscriptions + Razorpay for real-world mentor session bookings under Guideline 3.1.3(d)).

## Workflow for any rejection

1. Ask for (or read) the exact rejection text and Guideline number.
2. Map to the known-issues table below first — these have already been solved once.
3. Propose the minimal compliant fix, then draft the Resolution Center reply.
4. Always end with a pre-resubmission checklist.

## Known issues already encountered (check these first)

| Guideline | Issue | Proven fix |
|---|---|---|
| 4.0 | Sign in with Apple forces credential re-entry | Pre-fill name/email from Apple credential, make fields read-only; keep onboarding but never ask user to retype what Apple provided |
| 2.1(b) | IAPs not discoverable by reviewer | Ensure subscription paywall reachable without special account state; add reviewer-notes path: exact taps from launch to purchase screen; attach demo account |
| 3.1.2(c) | Missing/invalid EULA + subscription info | Functional links to Terms of Use (EULA) and Privacy Policy inside the app binary AND in App Store Connect metadata; subscription title, length, price visible on paywall |
| 2.3.4 | App preview videos with device frames | No device frame overlays; raw screen capture only; 886×1920 (iPhone), 1200×1600 (iPad) |
| 3.1.3(d) | Physical-services payments | Razorpay is allowed for person-to-person mentor sessions; explain the split clearly in reviewer notes every submission |

## Reviewer notes template

Always include: demo credentials, path to IAP, explanation of dual-payment split (IAP = digital subscription features; third-party gateway = real-world mentorship services per 3.1.3(d)), and what changed since the last rejection, numbered.

## Pre-resubmission checklist

- [ ] Paid Apps Agreement active, banking + tax complete
- [ ] IAPs in "Ready to Submit" and attached to the build's version
- [ ] Privacy policy URL live and covers IAP + payment-gateway data handling
- [ ] EULA link functional in-app and in metadata
- [ ] Preview videos: correct resolutions, no device frames
- [ ] Demo account works on a clean install
- [ ] Reviewer notes updated for THIS build's changes

## References

- reference/apple-guidelines-map.md — condensed guideline cheat sheet (create as you learn)
- Keep a rejection log: date, build, guideline, fix, outcome. Append after every review cycle.
