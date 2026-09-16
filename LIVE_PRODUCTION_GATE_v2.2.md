# Live production gate — v2.2

A `main` release is not considered deployment-verified until:

1. static release invariants pass,
2. synthetic browser acceptance passes,
3. Netlify reports a ready production deploy for the same `main` commit,
4. the read-only live production smoke passes.

This gate is still subordinate to GitHub Issue #11 for physical iPhone Safari and installed-PWA acceptance.
