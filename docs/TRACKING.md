# Feature and bug tracker

States: planned, active, blocked, done, deferred. A feature is done only when its acceptance criteria and relevant checks pass. Keep one row per meaningful item; Git contains file-level history.

Agent key: A1 = Codex / GPT-6 (exact variant unavailable). U = user. `—` = none yet. Never invent model IDs or reviewers.

| ID | Item | State | Proposed | Implemented | Reviewed | Modified | Commits |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DEV-001 | Development workspace | done | U + A1 | A1 | A1 self-review; no independent review | A1 (verified handoff) | `369f2a4`, `b4b3c57` |
| DEV-002 | Build and test toolchain | done | A1 | A1 | A1 self-review | A1 | preservation checkpoint; see Feature trailers |
| CAT-001 | Character feasibility prototype | done | U + A1 | A1 | A1 self-review; visual browser check | A1 | preservation checkpoint; see Feature trailers |
| EXT-001 | Permissions and injection lifecycle | planned | A1 | — | — | — | — |
| CAT-002 | Character behavior and animations | planned | U + A1 | — | — | — | — |
| UX-001 | Drag, visibility, accessibility | planned | U + A1 | — | — | — | — |
| REM-001 | Optional reminder system | planned | U + A1 | — | — | — | — |
| PER-001 | Appearance and personality | planned | U + A1 | — | — | — | — |
| QA-001 | Beta and release validation | planned | A1 | — | — | — | — |

## Bugs
None reported; this does not mean the future extension has been tested.

Add BUG-001 onward with severity, brief reproduction/expected behavior, owner/model, state, and fix commit. Link longer evidence only when necessary. Record user-visible scope changes in PRD and rationale in the decision log, referencing the affected ID.

At the next natural checkpoint replace pending commit references with hashes. For the newest commit, trailers are authoritative: `git log --all --oneline --grep='Feature: DEV-001'`. Use `Feature:` for any affected tracked ID, including bugs.
