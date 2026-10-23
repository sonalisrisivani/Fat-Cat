# Product requirements

Goal: users voluntarily keep and enjoy a quiet virtual companion. Monetization and engagement pressure are out of scope.

## Character
Original chubby cat: sleepy, slightly sarcastic, secretly affectionate. Humor targets its laziness, never the user's health, productivity, or absence. No care obligations or punishment.

## Launch scope and acceptance
| ID | Requirement / acceptance |
| --- | --- |
| CAT-001 | Original SVG prototype: sleep, stretch, pet reaction remain expressive around 88 CSS px. |
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

Baseline approved for planning by the user. DEV-002 / CAT-001 implementation authorized on 2026-10-12; the current deliverable is a permission-free popup feasibility prototype, not the page companion.
