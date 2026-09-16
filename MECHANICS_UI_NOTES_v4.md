# DECISIONS, DECISIONS — Mobile Mechanics/UI v4

Status: prototype implementation. This does **not** lock unresolved commercial rules or complete legal validation of the working title.

## Goals

- Keep the core differentiator visible at all times: prompt-specific route choice under time pressure.
- Fit the full gameplay decision/action surface inside an iPhone Safari viewport without controls falling behind browser chrome.
- Make the route decision fast: prompt dominates, three route buttons remain large, and one tap commits.
- Make the tradeoff legible enough that players can weigh points before acting.
- Keep the timed turn continuous across prompts.
- Make PASS testable without forcing a route commitment first.
- Make scoring feedback immediate without adding confirmation steps.
- Use the title as identity, not as repetitive UI copy.

## Functional language

Preferred gameplay language for the v2.2 brand direction:

- **YOUR MOVE** — choice state.
- **LOCKED IN** — commitment feedback.
- **CORRECT** — successful guess/scoring action.
- **NEXT** — advance where an explicit next action is needed.

Avoid repeating “decision” on every control. DECISIONS, DECISIONS names the experience; the interface should remain concise and operational.

## Gameplay presentation

1. HUD: team + round, timer, total score where the active UX condition allows it.
2. Thin timer rail gives peripheral time pressure without dominating the prompt.
3. Card meta communicates phase with functional state language such as YOUR MOVE before commitment and LOCKED IN after commitment.
4. Prompt stays visually dominant.
5. Pre-commit: three large route controls with prompt-specific points.
6. One tap commits; selected route becomes visually dominant or a compact committed banner while alternatives recede.
7. Correct is the primary post-commit action; PASS remains secondary only when that test condition is enabled.
8. DRAW expands a compact in-card canvas with Undo/Clear.
9. Correct immediately advances to the next prompt while the same turn timer keeps running.
10. End of turn hands off to the next team; one timed turn per team per round remains a prototype structure, not a locked final rule.

## Brand/visual constraints

- Permanent identity is black/cream-led.
- Teal / yellow / purple remain method-signal challengers, not permanent wordmark colors.
- The stacked `DECISIONS, / DECISIONS` identity and restrained three-way branch motif may appear on home/handoff/interstitial surfaces, but should not compete with the prompt during a timed turn.
- Avoid literal decision clichés such as giant question marks, checkboxes, flowcharts, or yes/no controls as decorative identity.

## Test variables preserved

- HUM vs SOUND
- timer start on reveal vs commit
- one pass per turn vs no pass
- 60 / 30 / 15 round timing
- final team/round structure
- smart-card/swipe-to-score challenger
- live-score visibility during timed turns

## Telemetry

Continue collecting prompt, route, point value, outcome, decision/choice time, elapsed guess time, timer condition, team, and round. Uncommitted passes are recorded distinctly so pass behavior can be evaluated rather than hidden.

Choice time must remain first-class evidence. Review it with route share, displayed points, success/guess time, and qualitative feedback to evaluate **decision tension**; fast choice alone is not automatically good or bad.
