# Project status

Updated: 2026-10-23
Phase: core companion implemented; lean beta verification.
Current sprint: [005 — Lean beta polish](docs/sprints/005-lean-beta-polish.md)

## Implemented
- Original Marmalade SVG/JSON character with quiet automatic sleep/idle/stretch and click-to-pet.
- Site permission/registration lifecycle, saved drag/keyboard position, site hiding, reduced-motion/inactivity cleanup.
- UX-002: discreet mouse-hover/keyboard-focus hide badge, hidden during pointer petting; touch target retained. User confirms working.
- UX-003: one Show cat / Hide cat button for the current website. No pause/trial/preview UI. First Show requests site permission; Show/Hide remembered across visits.
- Legacy global pause: Show overrides only that selected site, without resuming other sites. Existing stored position retained.

## Next action
Push the prepared main branch to the user-authorized GitHub repository, verify the remote commit, then address the documented release validation before Chrome Web Store publication. Source publication is not store approval.

## Source checkpoints
- Extension checkpoint: `18238e3`, following the two original foundation commits.
- Standalone studio consolidated under `preview/`, sharing artwork/renderer; run `npm run preview`. Studio build stays separate from extension dist.

## Validation
- `npm run check`: strict typecheck/build and 32 tests pass.
- Popup tests: permission denial, saved visibility, legacy pause recovery, blocked pages/settings failure, injection failure.
- Worker tests: show requires permission and popup origin, selected-site pause override survives restart and preserves position; other paused sites remain paused.
- Browser fixture using built popup with mocked Chrome APIs: appearance and Show→Hide→Show verified. Actual Chrome prompt and multi-tab acceptance still pending.
- Built `dist/`: 60,252 bytes unpacked; no new permissions or runtime packages.
- CPU/heap/battery and real device touch/forced-colors remain unmeasured. No independent review.

## Handoff
- User confirmed integrated character, automatic behavior and hide fix work in Chrome before this popup change.
- Extension committed as `18238e3`; studio consolidated in the following checkpoint. Generated dist/build remain ignored.
- Changed for UX-003: popup HTML/CSS/controller, settings message/schema, worker show handling, popup/worker tests, and affected docs.
- GitHub source destination: https://github.com/sonalisrisivani/Fat-Cat. No force-push or history rewrite.
- Agent: A1 (Codex / GPT-6; exact variant unavailable). No delegation or remote.
