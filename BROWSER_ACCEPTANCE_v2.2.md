# DECISIONS, DECISIONS — Browser Acceptance v2.2

Status: **AUTOMATED QA SUPPORT / NOT A SUBSTITUTE FOR REAL-DEVICE ACCEPTANCE**

This layer protects the current browser prototype against regressions that can be exercised reliably in CI while Issue #11 remains the authoritative real-device acceptance gate.

## Matrix

- Chromium desktop — 1440 × 1000
- WebKit phone — 390 × 844
- WebKit short phone — 375 × 667
- Chromium coarse-pointer tablet — 820 × 1180

## Covered automatically

- current DECISIONS, DECISIONS public identity and descriptor,
- public-page horizontal overflow,
- desktop More-menu keyboard dismissal,
- mobile drawer open/close, aria state, and inert background,
- public choice demo commit/reset behavior,
- public choice-time data attribute,
- keyboard route navigation,
- current How / Playtest / FAQ / About headings,
- playtest recruitment touch target and evidence/privacy copy,
- Decision Tension feedback field presence,
- private PWA home → setup → handoff → first prompt,
- one-tap route commitment,
- visible canonical Correct fallback,
- phone choice-control geometry.

## Explicitly not proven by this suite

The CI browsers do **not** prove:

- physical iPhone Safari rendering,
- installed-iOS-PWA lifecycle,
- Netlify access-cookie behavior,
- real DRAW touch/stylus feel,
- swipe-to-score false-positive behavior on an actual device,
- VoiceOver behavior,
- real-world timer/backgrounding behavior,
- human understanding of Decision Tension,
- HUM vs SOUND or other unresolved rule decisions.

Those remain in GitHub Issue #11 and require human/device testing.

## Freeze rule

Once Issue #11 P0 passes, treat the browser prototype as a frozen blind-test candidate. During the first controlled evidence cycle, merge only blocker, accessibility, telemetry-integrity, and severe usability fixes.