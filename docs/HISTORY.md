# Change and handoff log

Newest first. One short entry per meaningful change; archive old entries only when scanning becomes slow. Do not copy status snapshots or diffs here.

## 2026-10-23 — REL-001 — Source publication checkpoint
- User authorized committing and pushing the current project to sonalisrisivani/Fat-Cat. A1 preserves foundation history and checkpoints the integrated extension before adding the standalone studio. No history rewriting or generated output. Release profiling and Chrome acceptance limitations remain explicit.

## 2026-10-18 — UX-003 — One remembered Show/Hide action
- User requested and approved simplifying to per-site Show/Hide. A1 removed popup pause/trial/access/preview controls, retained the existing permission and visibility lifecycle, and added popup-only Show recovery for a legacy paused site without resuming others.
- Strict typecheck/build and 25 tests pass; built popup fixture visually checked and both states exercised. Live Chrome prompt/persistence/multi-tab checks remain pending. Artifact 60,252 bytes; no new permissions/dependencies, no commits, self-review only.

## 2026-10-18 — UX-002 — Hide badge after petting
- A1 replaced focus-within reveal with focus-visible on the cat/hide button, and suppressed mouse hover reveal during petting. Pointer focus no longer leaves the badge pinned; keyboard and coarse-pointer access remain available.
- Typecheck/build and 24 tests passed; live Chrome double-click visual confirmation pending. Artifact: 80,786 bytes; uncommitted, self-review only.

## 2026-10-18 — UX-002 — Discreet hide control
- A1 (Codex / GPT-6; exact variant unavailable) replaced the prominent hide circle with a small badge revealed on mouse hover/keyboard focus. A 44 px target remains visible on touch/hybrid devices; forced colors and reduced motion have explicit overrides. Existing handlers and permissions unchanged.
- Strict typecheck/build and 24 regressions pass. Local browser fixture verifies rest/focus appearance, Tab reachability and Enter activation; touch and real Chrome overlay checks remain pending. Artifact: 80,700 bytes. Self-review only, uncommitted.

## 2026-10-18 — CAT-002 — Gentle automatic behavior
- A1 (Codex / GPT-6; exact variant unavailable) implemented mostly-sleeping idle/blink/tail and occasional stretch behavior in the user-confirmed WorkSpace checkout. Petting interrupts; walking and wool play remain manual popup previews.
- One cancellable timer; hidden/fullscreen/drag/pagehide and reduced motion suppress autonomous work, teardown cancels it, and resume never catches up. Existing site/drag/hide/pause controls preserved.
- Strict typecheck/build and 24 tests pass, including five deterministic cadence/interruption/lifecycle tests. Built dist: 78,692 bytes. Live Chrome cadence, OS preference and CPU/heap checks remain pending. Self-review only; uncommitted.

## 2026-10-17 — CAT-001 / CAT-002 — Integrate approved Marmalade
- A1 (Codex / GPT-6; exact variant unavailable) integrated the user's approved arrogant-but-caring SVG/JSON character from worktree 06d6 into the confirmed loaded WorkSpace checkout. Preserved existing site controls, saved position, drag/hide/pause, and sleeping defaults; six states available in popup preview.
- Build preserves initially invisible rig parts; native handles suspend for hidden/fullscreen/drag and are cancelled on teardown. No permission or runtime dependency additions.
- Strict typecheck/build and 19 regression tests passed, including all rig parts, six popup states and animation suspension/cleanup. Live Chrome reload remains a user smoke check. Uncommitted; self-review only.

## 2026-10-12 — BUG-001 / EXT-001 — Disabled trial guidance
- A1 (Codex / GPT-6; exact variant unavailable) investigated a disabled trial button reported on Google Search in the newer main checkout; this chat’s worktree contained an older prototype.
- Google HTTPS URLs pass eligibility. Existing hidden/paused settings intentionally disable trials; added a persistent accessible explanation and recovery steps for each disabled state and corrected the wait cursor. No saved preferences, permissions, or suppression semantics changed.
- Typecheck/build and 19 tests passed, including hidden, paused, combined-state recovery on a synthetic Google URL, restricted/missing URL, and settings failure. The user’s exact saved state and live Chrome recovery remain unconfirmed; native inspection was unavailable. Self-review only; uncommitted.

## 2026-10-11 — CAT-002 / UX-002 / UX-003 / QA-001 / REL-001 / BET-001 — Lean beta replan
- U confirmed persistent controls working and approved a smaller beta plan. A1 (Codex / GPT-6; exact variant unavailable) updated status, PRD, roadmap, tracker, architecture, README and sprint handoff; no runtime changes.
- Next: subtle blink/stretch, discreet accessible hide control, simple popup/setup, then reliability/accessibility/performance verification, release materials and 20–30-tester beta with one/two-week voluntary follow-ups.
- Deferred REM-001/PER-001; split walking/elaborate behavior into CAT-003 and all-sites shortcut into EXT-002. These are not beta blockers. No telemetry or new permissions; expansion requires repeated feedback.
- Passed: local links/newlines across 14 Markdown files, STATUS length, feature-ID presence, and git diff --check. Basic user testing remains separate from unverified edge cases; previous 13-test result retained, not rerun for docs. Source implementation remains uncommitted; no beta outreach or store submission performed.

## 2026-10-11 — EXT-001 / UX-001 — Persistent site controls
- A1 (Codex / GPT-6; exact variant unavailable) implemented optional per-site host access, persistent script registration, saved normalized position, site hide/show, and global pause/resume after user authorization. Cross-button and pose polish remain deferred.
- Added a validating, serializing MV3 worker with startup/permission reconciliation and targeted revocation cleanup. Storage is local; no alarms, required hosts, or runtime dependencies.
- Passed strict typecheck, build, 13 tests, and budget checks (37,515 bytes unpacked). Tests simulate DOM and Chrome APIs; current real-Chrome acceptance remains pending. Self-review only; all changes uncommitted.
- Next: reload extension and test denial, automatic return, saved position, multi-tab controls, restart, and revocation via README.

## 2026-10-11 — CAT-002 / UX-002 — Page-trial feedback
- User confirms page trial working; notes only sleeping cat appears on page and dislikes the cross-button appearance. Both suggestions deferred at user request; core functionality remains the priority.
- A1 (Codex / GPT-6; exact variant unavailable) recorded feedback and updated acceptance evidence without claiming individual edge/accessibility checks. Next functional slice is persistent site access. Documentation only; no runtime changes or new runtime tests.

## 2026-10-11 — EXT-001 / CAT-002 / UX-001 — Temporary page trial
- User reported the original popup working and approved “Try on this page” with a draggable cat.
- A1 (Codex / GPT-6; exact variant unavailable) implemented temporary activeTab/scripting injection, singleton Shadow DOM overlay, pointer/keyboard movement with viewport clamping, pet reaction, hide/restore, and visibility/fullscreen cleanup. No persistent host access or storage.
- Passed strict typecheck/build and eight tests, including mocked Chrome failures and DOM lifecycle checks; artifact 17,090 bytes unpacked, content 7,604 bytes. Chrome trial verification remains pending. Self-review only; all changes uncommitted.
- Next: reload extension/webpage and execute README checks, then add persistent site permissions/settings in a separately recorded slice.

## 2026-10-11 — DEV-002 / CAT-001 — First implementation
- User authorized implementation; A1 (Codex / GPT-6; exact variant unavailable) implemented the M1 toolchain and permission-free MV3 popup with three original SVG poses.
- Added strict TypeScript, esbuild/SVGO build, pinned development dependencies, Node tests, accessible pose controls, reduced-motion styles, and visibility-based animation suspension.
- Passed offline clean install, typecheck/build, four tests, and artifact budgets (8,264 bytes unpacked; 2,625 bytes SVG). Self-review only; work uncommitted.
- CAT-001 remains active: browser tool denied local file navigation, so Chrome load and visual/accessibility acceptance remain pending. README contains manual steps. Page injection belongs to M2.

## 2026-10-11 — DEV-001 — Workspace foundation
- Agent: A1 (Codex / GPT-6; exact variant unavailable).
- Created source boundaries, concise planning baseline, agent rules, tracking and Git workflow.
- Scope: documentation/configuration only; no extension implementation or dependencies.
- Foundation commit: `369f2a4`. Passed relative-link, final-newline, STATUS-size, placeholder, ignore and staged-whitespace checks; clean tree verified after commit.
- Handoff: DEV-001 complete; no feature code. Next authorized task should scope DEV-002/CAT-001. This verification checkpoint uses the same Feature trailer for commit discovery. Self-review only.
