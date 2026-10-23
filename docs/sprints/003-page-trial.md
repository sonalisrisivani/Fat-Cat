# Sprint 003 — Page trial

Goal: try a quiet, draggable cat on the current HTTP/HTTPS page.
Scope: first slices of EXT-001, CAT-002, and UX-001, authorized by the user after the popup test.
Persistent origin permissions, saved settings, autonomous walking, and reminders follow later.

## Acceptance
- [ ] Popup can inject into the top frame using activeTab + scripting only, with graceful failure on restricted pages.
- [ ] Repeated activation leaves one cat; close/Escape removes it; retry restores it at the current document position.
- [ ] Pointer drag and keyboard arrows clamp to the visible viewport; resize reclamps.
- [ ] Cat sleeps by default; clicking pets it; reduced motion disables animation.
- [ ] Hidden tabs stop animation/reaction work; fullscreen hides the overlay; cleanup removes listeners/timers.
- [ ] Relevant type/build/unit checks pass; actual Chrome verification recorded separately.

Implemented all listed behaviors. Eight automated checks pass (including a DOM lifecycle simulation); checkbox acceptance remains pending actual Chrome verification. No persistent-permission or global-settings feature is claimed complete.

User follow-up: page trial reported working. On-page pose variety and the cross-button appearance were noted and explicitly deferred in favor of functionality (CAT-002/UX-002). Individual edge/accessibility checks remain unconfirmed; this report is not blanket completion of all acceptance items.
