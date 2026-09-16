# DECISIONS, DECISIONS — Performance UX v6

Status: **PROPOSED / NEEDS PLAYTESTING** except the already-locked one-tap commitment behavior.

## Core loop
`PROMPT → WEIGH → COMMIT → PERFORM → CORRECT → NEXT`

The name describes the experience; active-turn UI should remain functional. Prefer **YOUR MOVE** before selection and **LOCKED IN** after commitment rather than repeating “decision” throughout the interface.

## Dedicated post-commit surfaces
- **HUM**: teal, animated audio bars, `HUM THE MELODY`, `MELODY ONLY · NO WORDS`.
- **SOUND comparison**: same audio surface, `MAKE THE SOUND`, `NO WORDS`.
- **DRAW**: yellow drawing surface, large canvas, undo, clear, `NO WORDS · LETTERS · NUMBERS`.
- **MIME**: purple kinetic surface, `ACT IT OUT`, `NO TALKING · NO MOUTHING`.

No microphone, camera, recording, recognition, or automatic judging.

## Choice/decision tension

The pre-commit surface must make the prompt and all three point values scannable at once. The objective is not to maximize hesitation; it is to make the risk/reward tradeoff legible enough that at least two routes can be plausibly attractive on healthy prompts.

Preserve choice-time telemetry and review it together with route share, displayed points, success, guess time, and qualitative feedback.

## Skip condition
The v6 test makes ordinary skip **pre-commit only** when enabled. `pass-uncommitted` remains separately logged. After commitment the selected route stays locked until Correct or timeout.

Do not promote skip behavior, HUM vs SOUND, MIME labeling/iconography, timer start, final round structure, method colors/order, or smart-card/swipe interactions to LOCKED without blind-play evidence.
