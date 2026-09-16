# DECISIONS, DECISIONS — v2.2 Execution Roadmap

## Current milestone

**Freeze a trustworthy playtest build → validate it on real devices → run blind sessions → use evidence to resolve mechanics and content.**

## P0 — production acceptance

1. Keep the static release verifier green.
2. Keep the synthetic browser matrix green across Chromium desktop, WebKit phone, WebKit short phone, and coarse-pointer tablet.
3. Keep the live-Netlify production contract smoke green on every `main` push.
4. Complete GitHub Issue #11 on a physical iPhone Safari session and installed iOS PWA.
5. Verify end-to-end telemetry export → local analysis → structured Netlify feedback.
6. Fix only blockers, accessibility defects, telemetry-integrity defects, security/privacy defects, or severe usability issues.
7. Freeze the browser build for controlled blind testing.

## P0 — first controlled evidence cycle

Run staged comparisons without changing multiple variables at once:

- HUM vs SOUND,
- timer start on reveal vs commit,
- one pre-commit skip vs no skip.

Keep 60 → 30 → 15 fixed during these blocks unless a blocker makes the structure unusable.

Capture:

- route selected,
- displayed points,
- choice time,
- success/failure,
- guess time,
- pass/timeout behavior,
- route dominance,
- rule questions and facilitator rescues,
- Decision Tension report,
- replay interest.

## P1 — rule/content decisions

After repeated valid sessions across more than one group type:

- decide HUM vs SOUND,
- decide skip/pass,
- decide timer start,
- decide MIME label/icon,
- review 60/30/15,
- decide swipe-to-score and live-score visibility,
- calibrate prompt-specific points,
- cut dead cards and dominant-route failures,
- define the next physical rules candidate.

No prompt becomes `VALIDATED_CORE` from desk review alone.

## P1 — parallel commercial work

- Continue legal/common-law/App Store/domain clearance for **DECISIONS, DECISIONS**.
- Do not rename GitHub/Netlify infrastructure until the title clears the legal gate.
- Validate BOM, MOQ, materials, package dimensions, freight, fulfillment, fees, and margin with suppliers.

## P2 — after blind-play evidence

- Print the next physical prototype.
- Expand only validated content patterns.
- Build the smallest native iPhone SwiftUI vertical slice from the validated state machine.
- Prepare real-play footage and prelaunch demand tests.

## P3 — commercialization gate

Do not move to Kickstarter/preorder until the mechanic, blind-play behavior, identity/legal position, manufacturing economics, fulfillment assumptions, and schedule contingency are credible.
