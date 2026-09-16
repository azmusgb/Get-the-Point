# Production acceptance runbook — v2.2

Use the live production smoke only as a read-only release contract. It must not submit forms, attempt private authentication, or mutate playtest data.

After a `main` merge:

- wait for the Netlify Git deploy,
- confirm Netlify `commit_ref` equals the GitHub `main` SHA,
- require static release verification and synthetic browser acceptance to be green,
- require the live production smoke to pass,
- then continue with physical iPhone Safari / installed-PWA acceptance in GitHub Issue #11.

If the live smoke fails because Netlify has not published yet, the verifier retries briefly. Persistent failure is treated as a deployment blocker.
