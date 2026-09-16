# DECISIONS, DECISIONS — Production Acceptance v2.2

Status: **AUTOMATED DEPLOYMENT CONTRACT / SUPPORTING GATE**

This layer verifies the live Netlify deployment after changes reach `main`. It complements the local/browser acceptance suite and GitHub Issue #11.

## Verified against live production

- public root serves the current DECISIONS, DECISIONS identity,
- `ONE PROMPT. THREE WAYS TO PLAY.` is present,
- former lead identity does not leak onto the public homepage,
- How / Playtest / FAQ / About routes resolve with current v2.2 copy,
- the playtest-interest form declaration is present,
- root security headers include no-sniff, same-origin framing, and disabled camera/microphone/geolocation,
- `/play`, `/diagnostics`, `/analysis`, and `/feedback` reject unauthorized access and redirect to `/demo-access`,
- protected redirects remain no-store and noindex/nofollow,
- the access page carries the current identity, CSP, no-cache/no-store behavior, noindex/nofollow, and disabled device permissions,
- the manifest uses `DECISIONS, DECISIONS — Private Playtest`, short name `Decisions`, and `/play` start URL,
- the service worker remains no-cache/no-store with root scope.

## CI behavior

The production smoke runs only after a push to `main`, and only after the static release verifier and synthetic browser matrix pass. It retries briefly so Netlify has time to publish the Git-triggered deployment.

The test intentionally does **not** submit forms, mutate production state, or attempt to guess/use a private-demo passcode.

## Boundary

A green production smoke does not prove physical iPhone Safari behavior, installed-PWA lifecycle, real DRAW touch behavior, VoiceOver, real background/timer behavior, or human Decision Tension. Those remain in GitHub Issue #11.

Exact GitHub ↔ Netlify commit alignment is still checked from Netlify deployment metadata; the public site does not expose a commit SHA.
