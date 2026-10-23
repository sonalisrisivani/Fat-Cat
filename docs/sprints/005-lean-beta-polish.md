# Sprint 005 — Lean beta polish

Scope selected with the user on 2026-10-11. Planning recorded; no new behavior or visual changes implemented by this documentation update.

Goal: make the existing companion feel alive and unobtrusive, without adding a feature suite.
Scope: CAT-002, UX-002, UX-003. Keep the existing site-access, position, hide and pause behavior.

## Work order and completion criteria

1. CAT-002: subtle behavior
   - [x] Add occasional blink and stretch to the page cat; sleeping remains the dominant state. Implemented 2026-10-18; live cadence review pending.
   - [ ] Retain click-to-pet; avoid competing drag/pet/autonomous transitions.
   - [ ] Stop autonomous work in hidden tabs and while paused/hidden/fullscreen; respect reduced motion without catch-up bursts.
2. UX-002: hide affordance
   - [ ] Replace/refine the prominent cross with a discreet control that remains discoverable.
   - [ ] Preserve a clear accessible name, visible keyboard focus, and existing site-hide behavior.
3. UX-003: setup and popup
   - [ ] Center the popup on site access, hide/show, and pause/resume; review preview controls for clutter.
   - [ ] Make showing the cat, temporary versus persistent access, and permission denial recovery clear.
4. Verification and handoff
   - [ ] Run relevant type/build/tests and check behavior in Chrome; record actual results and limits.
   - [ ] Carry remaining reliability/accessibility and measured performance work into QA-001 before beta distribution.

## Out of scope

Reminders, names/coats/sizes, autonomous walking, elaborate animations, an all-sites shortcut, new settings screens, telemetry, and remote services. Do not add permissions for this polish pass.

Next concrete action: confirm quiet cadence and reduced motion in Chrome, then scope hide-control polish. No sub-agents unless the user explicitly requests them.

UX-002 implementation checkpoint (2026-10-18): CSS-only hover/focus reveal and 44 px touch target built; browser keyboard fixture and all 24 regressions pass. Live Chrome hover/touch and forced-color confirmation remain open.

UX-003 superseding scope (2026-10-18): user approved a single remembered Show/Hide button per website. Implemented and rebuilt; 25 tests and mocked browser popup flow pass. Prior pause/trial/preview popup design is superseded; live Chrome acceptance pending.
