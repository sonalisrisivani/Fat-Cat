# Sprint 004 — Persistent controls

User authorized continuing functional features on 2026-10-11.
Scope: EXT-001 and UX-001; optional per-site permission, automatic return, saved position, site hiding, global pause.

## Acceptance
- Site access is requested only by a popup click; denial leaves temporary trial available.
- Granted sites register top-frame document_idle content scripts across browser restarts.
- Revocation removes registration and tears down existing overlays; failures are handled.
- Position is normalized and saved after user moves; hiding and pause apply across open tabs.
- Stored data and messages are validated; mutations serialize in the worker.
- Automated checks pass; Chrome permission/restart/multi-tab checks recorded separately.

Original exclusions: all-sites shortcut, autonomous poses, cross-button polish, reminders. The later lean-beta decision brings subtle blink/stretch and hide-control polish into Sprint 005; other exclusions remain deferred.

Implementation and all 13 automated checks complete. User subsequently reports persistent controls working; detailed case-by-case Chrome acceptance remains pending; README contains denial, restart, multi-tab and revocation steps. No claim of independent review or measured runtime performance.

Implementation handoff to [Sprint 005](005-lean-beta-polish.md). Carry remaining browser/restart/multi-tab verification into QA-001; this handoff does not mark those checks passed.
