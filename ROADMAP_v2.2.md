# DECISIONS, DECISIONS — v2.2 Execution Roadmap

## Current milestone

**Freeze a trustworthy playtest build → validate it on real devices → run blind sessions → use evidence to resolve mechanics and content.**

## P0 — production acceptance

1. Merge the v2.2 browser acceptance layer once CI is green.
2. Complete GitHub Issue #11 on real iPhone Safari and installed iOS PWA.
3. Verify end-to-end telemetry export → local analysis → structured Netlify feedback.
4. Fix only blockers, accessibility defects, telemetry-integrity defects, or severe usability issues.
5. Freeze the browser build for controlled blind testing.

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