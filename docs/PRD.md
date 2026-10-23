# Product requirements

Goal: users voluntarily keep and enjoy a quiet virtual companion. Monetization and engagement pressure are out of scope.

## Character
Original chubby cat: lazy and arrogantly self-assured, but quietly caring. Half-lidded eyes, one raised brow, and an asymmetric smirk convey superiority without anger; petting reveals a happy, affectionate expression. Caring comes through companionship and gentle invitations to rest, never scolding. Humor targets its laziness, never the user's health, productivity, or absence. No care obligations or punishment.

## Launch scope and acceptance
| ID | Requirement / acceptance |
| --- | --- |
| CAT-001 | Original orange SVG/JSON prototype: idle breathing/blink/tail, curled sleep, tiny waddling walk, wool play, click-to-pet, and stretch; recognizable at 88 CSS px. Standalone browser preview includes pause/hide and reduced motion before integration. |
| EXT-001 | User can try on one page, grant one origin, or opt into HTTP/HTTPS access; denial is graceful. |
| CAT-002 | Sleep, blink/idle, local walk, stretch, pet, and drag states; hidden tabs stop behavior work. |
| UX-001 | Drag/clamp/restore position; hide per site; pause globally; keyboard controls and reduced motion. |
| REM-001 | Optional configurable reminders; one focused eligible tab; no duplicates or catch-up backlog. |
| PER-001 | Name, three coat palettes, three sizes; recent-message avoidance; speech off by default. |
| QA-001 | Permission, privacy, accessibility, compatibility and performance release checks pass. |

## Defaults
- Roughly 88 px wide, bottom corner with 16 px margin; most time asleep/still.
- Rare local shuffle, approximately every 6–12 eligible minutes within 120 px of anchor.
- No sound; spontaneous speech and reminders off until enabled.
- Hide during fullscreen; stop behavior timers/animations in background tabs.
- Optional reminder presets: water 60 min, movement 60 min, screen break 30 min. Product defaults, not medical advice.
- Global 20-minute minimum gap between unsolicited bubbles; combine/reschedule simultaneous reminders.
- Quiet mode suppresses autonomous movement/remarks; pause also suppresses reminders.

## Non-goals
Backend, accounts, AI chat, telemetry SDK, notifications, page analysis, cloud sync, streaks, hunger meters, multiple pets, incognito and local-file support.

## Validation
Start with 20–40 consenting beta testers. Assess activation, voluntary 7/28-day continued use, annoyance, and reliability through interviews/surveys and available store aggregates. No precise population retention claims without measurement. Prioritize unobtrusiveness over click counts.

Baseline approved for planning. On 2026-10-17 the user authorized DEV-002/CAT-001 standalone tooling and six-motion character preview. Extension integration remains separately scoped.
