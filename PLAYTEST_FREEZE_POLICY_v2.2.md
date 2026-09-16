# DECISIONS, DECISIONS — Playtest Freeze Policy v2.2

Status: **PROPOSED / becomes active after Issue #11 P0 passes**

## Purpose

Protect the first controlled evidence cycle from product drift. Once the v2.2 browser prototype passes the real-device gate, comparable blind-test sessions require a stable build.

## Allowed during the freeze

Only changes in these categories should merge during the first evidence cycle:

- blocker defects,
- accessibility defects,
- telemetry or evidence-integrity defects,
- security/privacy defects,
- severe usability problems that prevent completing a valid session.

## Not allowed during the freeze

Do not merge broad visual refreshes, new mechanics, copy experiments that alter player understanding, new scoring logic, new timer structures, or prompt rebalancing between comparable sessions.

If a material rules or scoring change is required, increment the build cohort and do not silently mix pre-change and post-change evidence.

## Evidence cohort rule

Every valid session should preserve enough context to identify:

- build/app version,
- HUM vs SOUND condition,
- timer-start condition,
- skip/pass condition,
- timer structure,
- prompt/route/points,
- choice time,
- outcome and guess time,
- session validity.

Decision Tension is a multi-signal review, not a single metric. Choice time alone is not proof of a meaningful tradeoff.
