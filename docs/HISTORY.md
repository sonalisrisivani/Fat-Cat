# Change and handoff log

Newest first. One short entry per meaningful change; archive old entries only when scanning becomes slow. Do not copy status snapshots or diffs here.

## 2026-10-23 — CAT-001 / DEV-002 — Preserve original branch
- User requested all existing commits and branch code. A1 checkpoints this previously uncommitted original six-motion json/svg standalone studio on `codex/marmalade-studio` without replacing main or inventing earlier commits.
- Strict build and 7 tests passed; generated output excluded. Self-review only.

## 2026-10-18 — UX-003 — Primary checkout single-button popup
- A1 implemented user-approved remembered per-site Show/Hide in WorkSpace checkout, removing pause/trial/preview controls. Typecheck/build and 25 tests pass; mocked browser popup flow verified. Live Chrome acceptance pending; uncommitted.

## 2026-10-18 — UX-002 — Primary checkout hide-control polish
- A1 implemented a discreet hover/focus badge and 44 px touch target in the confirmed WorkSpace extension. Build/typecheck and 24 tests pass; browser keyboard fixture verified. Live Chrome hover/touch confirmation pending; uncommitted.

## 2026-10-18 — CAT-002 — Primary checkout quiet behavior
- A1 implemented authorized sleep/idle/stretch scheduling in `primary checkout`, retaining manual walking/play and existing controls. Typecheck/build and 24 tests passed; live Chrome cadence and performance profiling pending. No commits.

## 2026-10-17 — CAT-001 / CAT-002 — Primary checkout integration
- User confirmed Chrome loads `primary checkout dist/`. A1 integrated approved Marmalade into that checkout’s popup and page companion, preserving site/drag/hide/pause behavior. This worktree remains the standalone studio source.
- Primary checkout passes strict typecheck/build and 19 regression tests, including hidden SVG rig preservation, six popup selections and native animation cleanup; 75,605 bytes unpacked. User live Chrome reload pending. Both checkouts remain uncommitted.

## 2026-10-17 — CAT-001 — Arrogant but caring
- A1 refined the original face with half-lidded eyes, one raised brow, a smirk, and a lifted idle chin; petting reveals happy eyes. Updated six captions and preview personality copy to convey quiet care under mock superiority.
- Passed strict build and all seven existing tests; idle and petting visually inspected in the browser. 54 SVG nodes, artwork/motions ~9.4 KiB. Self-review only; changes remain uncommitted.

## 2026-10-17 — DEV-002 / CAT-001 — Marmalade character prototype
- Agent: A1 (Codex / GPT-6; exact variant unavailable); implementer and self-reviewer, no independent review.
- User authorized standalone implementation: original shared orange-cat SVG, six reusable JSON motions, native animation renderer, and browser studio with pause/hide/reduced-motion/size controls.
- Selected custom JSON + SVG over Lottie for these simple transforms; zero runtime packages, TypeScript-only development dependency. Extension integration remains unimplemented.
- Passed strict build/check and seven tests; browser controls and poses checked. Artwork/motions ~9.0 KiB, 52 SVG nodes. CPU/heap, system preference switching, real background-tab and multi-tab integration validation remain pending.
- Preview: loopback port 4186. Changes uncommitted; no commit authorization. Next: user character review, then separately scope extension integration.

## 2026-10-11 — DEV-001 — Workspace foundation
- Agent: A1 (Codex / GPT-6; exact variant unavailable).
- Created source boundaries, concise planning baseline, agent rules, tracking and Git workflow.
- Scope: documentation/configuration only; no extension implementation or dependencies.
- Foundation commit: `369f2a4`. Passed relative-link, final-newline, STATUS-size, placeholder, ignore and staged-whitespace checks; clean tree verified after commit.
- Handoff: DEV-001 complete; no feature code. Next authorized task should scope DEV-002/CAT-001. This verification checkpoint uses the same Feature trailer for commit discovery. Self-review only.
