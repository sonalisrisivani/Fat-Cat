# Product requirements

Goal: users voluntarily keep and enjoy a quiet companion. Core promise: a small, charming cat that keeps you company without getting in your way. Monetization and engagement pressure are out of scope.

Scope revised with the user on 2026-10-11: finish a small, polished beta, then learn from use before adding more features. This supersedes the earlier feature-heavy launch plan.

## Character

Original chubby cat: sleepy, slightly sarcastic, secretly affectionate. Humor targets its laziness, never the user's health, productivity, or absence. No care obligations or punishment. Character appeal should come from artwork and subtle behavior, not unsolicited messages.

## Beta scope and acceptance

| ID | Requirement / acceptance |
| --- | --- |
| CAT-001 | Original sleep, stretch, and pet artwork remains expressive around 88 CSS px. |
| EXT-001 | Try on one page or grant a selected site; automatic return, graceful denial, and removal after revocation. Permission scope is disclosed. |
| CAT-002 | Mostly asleep; occasional subtle blink/stretch and a click-to-pet reaction. No autonomous walking. Stop behavior work in hidden tabs and respect reduced motion. |
| UX-001 | Drag/keyboard move, clamp/restore position, saved site hiding, global pause, fullscreen hiding, and accessible controls. |
| UX-002 | Discreet hide control that is discoverable, keyboard-accessible, and does not obstruct the cat or page. |
| UX-003 | Simple popup centered on site access, hide, and pause; first-time setup explains how to show the cat and recover from denied access. |
| QA-001 | Reliability, privacy, accessibility, compatibility, and measured performance checks pass; results and remaining limitations recorded. |
| REL-001 | Original extension icons, screenshots, short demo, accurate listing/privacy statement, release package, and applicable store submission requirements prepared. Publication/submission is a separate action. |
| BET-001 | Recruit 20–30 consenting relevant testers and run voluntary one- and two-week follow-ups; record findings before expanding scope. |

## Defaults and data boundaries

- Roughly 88 px wide, bottom corner with 16 px margin; most time asleep/still.
- Occasional blink/stretch must be infrequent and quiet. Exact cadence is an implementation choice to validate during beta, not a promise of constant activity.
- No sound, spontaneous speech, reminders, or autonomous walking in beta.
- Hide during fullscreen; stop behavior timers/animations in background tabs. Reduced motion disables motion; pause suppresses the companion globally.
- Site permission/settings apply to the selected scheme/hostname across its ports, not subdomains. The on-page hide control saves site hiding until Show is selected.
- Keep current controls and local-only settings. No extra permissions or telemetry for beta measurement.

## Deferred until evidence warrants expansion

- REM-001: water, movement, screen-break reminders and their scheduler.
- PER-001: names, coat colors, extra sizes, personality settings, speech, and recent-message logic.
- CAT-003: autonomous walking, elaborate animations, and additional behavior controls.
- EXT-002: an all-sites access shortcut.
- Additional settings/options screens beyond those needed for the core experience.

These are not beta blockers or promised next features. Revisit only when repeated user feedback establishes a need that supports the core purpose.

## Non-goals

Backend, accounts, AI chat, telemetry SDK, notifications, page analysis, cloud sync, streaks, hunger meters, multiple pets, incognito and local-file support.

## Beta learning plan

Recruit 20–30 people interested in virtual pets or cozy desktop companions. Explain the product with a short demo and seek consent for follow-up; do not add automatic usage collection.

At setup, learn whether they got the cat onto a page. After one and two weeks, ask whether it is still enabled, why they hid/removed it, what interrupted their work, and whether they would miss it. Record recruitment and response counts alongside findings; self-reports from a small convenience sample are directional, not population retention statistics. Daily clicks are not the success measure: voluntary continued use, low annoyance, and reliability matter.

Prioritize recurring friction or reliability issues. Add a feature only when repeated feedback supports it; no feature count or retention outcome is guaranteed. Actual recruitment, messaging, and store submission are not performed by this planning update.

## Simplified popup scope — 2026-10-18
User approved one Show cat / Hide cat action for the current website, remembering that choice across visits. First Show requests optional permission for that site; denial leaves the cat off and allows retry. Hide saves the choice without revoking permission. Remove global pause, separate trial/access controls, and animation previews from the popup. Automatic behavior remains. Legacy pause recovery must affect only the explicitly shown site, never silently resume other paused sites. Unsupported pages disable the action with a short explanation.
