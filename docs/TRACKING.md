# Feature and bug tracker

States: planned, active, blocked, done, deferred. Done requires acceptance and relevant checks. An implemented feature awaiting detailed verification remains active; this does not mean its code is missing.

Agent key: A1 = Codex / GPT-6 (exact variant unavailable). U = user. `—` = none yet. Self-review is not independent review.

| ID | Item | State | Proposed | Implemented | Reviewed | Modified | Commits |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DEV-001 | Development workspace | done | U + A1 | A1 | A1 self-review | A1 (handoff) | `369f2a4`, `b4b3c57` |
| DEV-002 | Build and test toolchain | done | A1 | A1 | A1 self-review; last typecheck/build/13 tests passed | — | `18238e3`; later changes use Feature trailers |
| CAT-001 | Character feasibility prototype | active | U + A1 | A1; Marmalade shared SVG/JSON rig, shared rig and automatic page behavior; manual studio separate | U reports working; detailed visual/a11y acceptance open | — | `18238e3`; later changes use Feature trailers |
| EXT-001 | Trial and per-site permission lifecycle | active | A1 | A1; trial, persistent grants/registration, revocation handling | U reports working; detailed Chrome checks pending | A1 (beta scope narrowed) | `18238e3`; later changes use Feature trailers |
| CAT-002 | Quiet core character behavior | active | U + A1 | A1; automatic sleep/idle/stretch, click-to-pet, cancellable scheduling and inactivity/reduced-motion handling | A1 self-review; 24 tests pass; live cadence confirmation pending | A1 (quiet behavior) | `18238e3`; later changes use Feature trailers |
| UX-001 | Movement, saved position, site hide, global pause, accessibility | active | U + A1 | A1; core controls implemented | U reports working; edge/a11y checks pending | — | `18238e3`; later changes use Feature trailers |
| UX-002 | Discreet accessible on-page hide control | active | U | A1; hover/keyboard-focus reveal, pet hover suppression, 44 px touch target, coarse-pointer visibility | A1 self-review; browser keyboard fixture + 24 tests pass; live Chrome/touch pending | A1 | `18238e3`; later changes use Feature trailers |
| UX-003 | One-button remembered site visibility | active | U + A1 | A1; single remembered Show/Hide, safe legacy pause recovery | A1 self-review; 25 tests and browser fixture pass; live Chrome acceptance pending | A1 | `18238e3`; later changes use Feature trailers |
| QA-001 | Reliability, accessibility, privacy and performance validation | planned | A1 | —; existing automated tests are baseline | — | A1 (lean beta gates) | — |
| REL-001 | Icons, screenshots, demo, privacy/listing and release package | active | U + A1 | — | — | — | — |
| BET-001 | Small beta and one/two-week follow-ups | planned | U + A1 | — | — | — | — |
| REM-001 | Optional reminder system | deferred | U + A1 | — | — | A1 (lean beta decision) | — |
| PER-001 | Names, coats, sizes and personality settings | deferred | U + A1 | — | — | A1 (lean beta decision) | — |
| CAT-003 | Autonomous walking and elaborate behavior | deferred | U + A1 | — | — | A1 (split from CAT-002) | — |
| EXT-002 | All-sites permission shortcut | deferred | A1 | — | — | A1 (split from EXT-001) | — |

## Current priority and feedback

- U confirmed the popup, page trial, and persistent controls working. This establishes basic operation, not individual permission/restart/multi-tab/accessibility checks.
- U noted that the on-page cat mostly sleeps and that the cross looks unattractive. The later agreed scope promotes subtle blink/stretch (CAT-002) and hide-control polish (UX-002) into the next pass, superseding their earlier deferral. User subsequently approved removing popup previews entirely in favor of one remembered per-site Show/Hide button.
- Next: CAT-002 + UX-002, then UX-003, QA-001, REL-001, and BET-001. See [PRD](PRD.md) for acceptance and [current sprint](sprints/005-lean-beta-polish.md) for the immediate checklist.
- Deferred items are not beta blockers. Reopen only for repeated evidence-backed user need.

## Bugs

| ID | Severity / reproduction / expected behavior | State | Owner / review | Commits |
| --- | --- | --- | --- | --- |
| BUG-001 | P2: Try on this page is disabled without actionable explanation when hidden/paused; its wait cursor misleadingly implies loading. Explain the blocking state and recovery beside the control. Reported on Google Search; exact saved state unconfirmed. | done (guidance fix; user’s exact saved state unconfirmed) | A1 (Codex / GPT-6; exact variant unavailable); self-review; 19 tests pass | `18238e3`; later changes use Feature trailers |

Add BUG-001 onward with severity, reproduction/expected behavior, owner/model, state, and fix commit. Record scope changes in PRD and design decisions in ARCHITECTURE.

## Commit references

Implementation and later docs remain uncommitted. At the next natural checkpoint, add real commit hashes for affected IDs. Never create commits solely to reference their own hash. Use Feature trailers per [Git workflow](GIT.md).
