# Change and handoff log

Newest first. One short entry per meaningful change; archive old entries only when scanning becomes slow. Do not copy status snapshots or diffs here.

## 2026-10-23 — CAT-001 / DEV-002 — Preserve original branch
- User requested all existing commits and branch code. A1 checkpoints this previously uncommitted original three-pose, permission-free mv3 popup on `codex/character-prototype` without replacing main or inventing earlier commits.
- Strict build and 3 tests passed; generated output excluded. Self-review only.

## 2026-10-12 — DEV-002 / CAT-001 — Character feasibility
- Agent: A1 (Codex / GPT-6; exact variant unavailable), implementer and self-reviewer.
- User authorized the next feature; implemented strict build/test tooling and a permission-free popup with three original SVG poses and artwork provenance.
- Passed lockfile reinstall, typecheck/build, 3 automated artifact/validation checks, and browser pose/keyboard checks. Fixed the preview server's root asset-path failure found during verification.
- Optimized artwork 2,648 bytes; unpacked output 6,197 bytes. Reduced-motion handling source-reviewed; native Chrome loading and runtime performance unverified.
- Uncommitted on `codex/character-prototype`; next checkpoint is Chrome Load unpacked, then scope EXT-001. No independent review.

## 2026-10-11 — DEV-001 — Workspace foundation
- Agent: A1 (Codex / GPT-6; exact variant unavailable).
- Created source boundaries, concise planning baseline, agent rules, tracking and Git workflow.
- Scope: documentation/configuration only; no extension implementation or dependencies.
- Foundation commit: `369f2a4`. Passed relative-link, final-newline, STATUS-size, placeholder, ignore and staged-whitespace checks; clean tree verified after commit.
- Handoff: DEV-001 complete; no feature code. Next authorized task should scope DEV-002/CAT-001. This verification checkpoint uses the same Feature trailer for commit discovery. Self-review only.
