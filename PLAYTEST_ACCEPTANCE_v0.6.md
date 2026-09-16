# DECISIONS, DECISIONS — v0.6 Blind-Test Candidate Acceptance

Status: **PROPOSED / NEEDS PLAYTESTING**

This checklist exists to stabilize the browser prototype long enough to collect comparable playtest evidence. Passing it does **not** lock unresolved game rules or complete legal validation of the working title.

## P0 access and launch

- [ ] `/play` redirects unauthorized users to `/demo-access`.
- [ ] Correct passcode opens `/play`.
- [ ] Incorrect passcode gives a clear retry state.
- [ ] Access survives an ordinary reload.
- [ ] `Lock demo on this device` clears access.
- [ ] Private/incognito flow works from a clean session.
- [ ] Navigation is usable on iPhone and desktop.
- [ ] Powered-by-Netlify development chrome does not obstruct product UI.
- [ ] Current public/PWA identity reads **DECISIONS, DECISIONS**; historical GET THE POINT material remains isolated to archive/provenance surfaces.

## P0 gameplay loop

Run every case on iPhone Safari first.

- [ ] New game → setup.
- [ ] 2-team setup.
- [ ] 3-team setup.
- [ ] 4-team setup.
- [ ] Team rename persists.
- [ ] Handoff screen is understandable without coaching.
- [ ] Prompt reveal is readable.
- [ ] HUM commits in one tap.
- [ ] DRAW commits in one tap.
- [ ] MIME commits in one tap.
- [ ] Other routes disappear/recede after commitment.
- [ ] Functional state language uses clear copy such as **YOUR MOVE** and **LOCKED IN** without requiring the title to explain state.
- [ ] Correct scores selected points.
- [ ] Correct advances while timer continues.
- [ ] DRAW canvas accepts touch input.
- [ ] DRAW Undo works.
- [ ] DRAW Clear works.
- [ ] Timeout ends turn cleanly.
- [ ] Team rotates.
- [ ] Round rotates.
- [ ] Game finishes and scores render.
- [ ] Restart works.
- [ ] Resume works after refresh.

## P0 unresolved test controls

These remain **NEEDS PLAYTESTING**.

- [ ] HUM condition works.
- [ ] SOUND condition works.
- [ ] Timer-on-commit works.
- [ ] Timer-on-reveal works.
- [ ] One pre-commit skip works.
- [ ] No-skip condition works.
- [ ] No ordinary post-commit pass exists.
- [ ] 60 → 30 → 15 baseline behaves consistently.

## P1 evidence pipeline

- [ ] Game telemetry exports as valid JSON.
- [ ] Every committed attempt preserves route, displayed points, outcome, and choice/decision time when available.
- [ ] `/analysis` accepts a current telemetry export without uploading the file.
- [ ] `/analysis` surfaces median choice time as first-class evidence.
- [ ] `/analysis` separates HUM vs SOUND when the condition is identifiable.
- [ ] `/analysis` warns when incompatible experimental conditions are mixed.
- [ ] `/analysis` can export normalized CSV.
- [ ] Game-over surface offers structured session feedback.
- [ ] `/feedback` submits to the `playtest-session-feedback` Netlify form.
- [ ] Feedback records session validity, replay interest, point-value influence, **decision tension**, rule questions, and facilitator rescues.
- [ ] `/analysis` and `/feedback` are inaccessible without private-demo authorization.
- [ ] Candidate prompt pool contains 150 unique IDs/prompts with only 1–3 point hypotheses.
- [ ] No candidate is labeled `VALIDATED_CORE` from desk review alone.

## P1 device matrix

- [ ] Current iPhone / Safari.
- [ ] Short-height iPhone / Safari.
- [ ] Installed iOS PWA.
- [ ] Android / Chrome.
- [ ] macOS / Safari.
- [ ] Desktop Chrome.

Use `/diagnostics` when a device fails. Copy the report into the defect record.

## P1 visual acceptance

- [ ] No clipped prompt text in normal prompt set.
- [ ] Stacked **DECISIONS, / DECISIONS** identity reads cleanly at mobile and desktop sizes.
- [ ] Permanent brand identity remains black/cream-led; unresolved method colors are not embedded into the wordmark/icon.
- [ ] Method controls are comfortably tappable.
- [ ] Timer remains legible at 15 seconds.
- [ ] HUM / DRAW / MIME surfaces are visually distinct but clearly part of one game.
- [ ] MIME mask challenger is understandable enough to enter formal icon testing.
- [ ] Site navigation never overlays an active timed turn.
- [ ] Reduced-motion mode removes nonessential animation.
- [ ] The public homepage proves the mechanic visually: prompt + three routes + different point values + commitment state.

## P1 content/decision-tension acceptance

For measured prompt review:

- [ ] Representability is recorded across active routes.
- [ ] Choice time is retained and reviewable.
- [ ] Route dominance is visible by prompt.
- [ ] Prompt review asks whether at least two routes were plausibly attractive once points were considered.
- [ ] “Obvious choice” failures are captured separately from “impossible route” failures.
- [ ] Weak prompts are revised/cut rather than preserved merely to hit deck size.

## Automated checks

Run:

```bash
node scripts/verify-release.mjs
```

GitHub Actions also syntax-checks browser JavaScript and validates repository/release invariants. Automated checks reduce regression risk but do not substitute for the device and blind-play gates above.

## Exit gate

v0.6 is acceptable for structured blind testing when:

1. No P0 item is failing.
2. A complete game can be finished on iPhone Safari without creator intervention.
3. Unresolved mechanics remain configurable and explicitly labeled as test variables.
4. Device problems can be captured using the diagnostics page.
5. Telemetry and qualitative feedback can be captured without silently mixing incompatible experimental conditions.
6. The site/PWA presents the current DECISIONS, DECISIONS identity consistently while preserving historical naming evidence only in archive surfaces.
