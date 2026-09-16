# DECISIONS, DECISIONS — Real-Device QA Handoff v2.2

Use GitHub Issue #11 as the live checklist.

## Automated prerequisites

Before real-device sign-off, confirm all three automated layers are green on `main`:

1. static release verifier,
2. synthetic browser acceptance,
3. live-Netlify production contract smoke.

These reduce avoidable device-test noise but do not replace physical acceptance.

## Required first device

**Physical iPhone running Safari** against the production deployment at `https://get-the-point.netlify.app`.

Run the P0 checklist in order rather than spot-checking only the homepage. Record any failure with:

- device/model,
- iOS version,
- browser/display mode,
- production commit/deploy,
- exact step,
- expected behavior,
- actual behavior,
- screenshot or screen recording when useful,
- whether the defect invalidates the session.

## Then test installed PWA

Verify install/launch, unauthorized access behavior, authorized reload persistence, background/resume behavior, active-turn layout, timer continuity, DRAW touch, scoring, and feedback/telemetry flow.

## Freeze trigger

When every Issue #11 P0 item passes, activate `PLAYTEST_FREEZE_POLICY_v2.2.md` and begin the first controlled blind-test evidence cycle.
