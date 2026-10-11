# Architecture and decisions

Status: planned, not implemented. Performance numbers are targets, not measurements.

## Components
| Location | Responsibility |
| --- | --- |
| background | Event-driven MV3 worker: permissions, registration, settings mutations, reminder scheduling |
| content | Top-frame isolated-world bootstrap; Shadow DOM overlay; renderer and local behavior |
| popup/options | Quick controls/onboarding and detailed configuration |
| shared | Versioned settings, validated message contracts, pure scheduling/state logic |

Register scripts at document_idle for granted origins. Defer rendering until eligible/visible. One overlay host; pointer events only on controls/cat. No document scanning, page-content reads, perpetual frame loop, or whole-document mutation observer. Shadow DOM isolates styles, not security. Explicit teardown is needed for already injected scripts after revocation.

Worker state must survive suspension: use storage and alarms, not permanent timers/ports. Persist delivery IDs and serialize reminder decisions; check visibility before display. Prefer skipping uncertain deliveries over duplicates. No backlog after sleep/restart. Reconcile alarms on relevant startup/settings events.

## Data and permissions
- Required planned permissions: storage, scripting, activeTab, alarms.
- Optional HTTP/HTTPS host access requested through user gestures; no required broad host access.
- Local: preferences, normalized position, explicit site exclusions, reminder deadlines, recent message IDs.
- Session: temporary coordination. No visited-URL history or external requests.
- Validate messages and settings. Bundle scripts/assets; no remote code, eval, unsafe HTML, or unnecessary web-accessible resources.

## Budgets
ZIP <500 KB; unpacked <1 MB; character assets <100 KB; content JS/CSS <75 KB minified uncompressed; cat DOM ~150 nodes maximum. Target incremental renderer JS heap <2 MB, separately measured from browser overhead. No recurring hidden-tab behavior timers; no normal-operation long tasks >50 ms; smooth drag on reference hardware. Validate with 1/10/50 tabs; do not claim zero CPU.

## Decision log
| ID / date | Decision | Reason / revisit trigger |
| --- | --- | --- |
| D-001 / 2026-10-11 | MV3, strict TypeScript, vanilla UI; planned esbuild | Small surface and zero runtime dependencies; revisit only for demonstrated need. |
| D-002 / 2026-10-11 | Authored SVG poses with CSS/Web Animations; build-time SVGO | Small, recolorable artwork. Prototype complex motions; allow a measured spritesheet exception. No Lottie/Canvas engine initially. |
| D-003 / 2026-10-11 | Optional origin permissions; local-only state | Earn trust and minimize access. Never add permissions silently. |
| D-004 / 2026-10-11 | Shared event-driven reminder coordinator | Avoid multi-tab duplication and worker keepalive. |
| D-005 / 2026-10-11 | Markdown tracking plus Git, no PM service | Fast handoff with minimal duplicated context; split only when files become hard to scan. |

## Primary references (checked during product planning)
- [Permissions](https://developer.chrome.com/docs/extensions/reference/api/permissions)
- [Scripting and teardown](https://developer.chrome.com/docs/extensions/reference/api/scripting)
- [Worker lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)
- [Alarms](https://developer.chrome.com/docs/extensions/reference/api/alarms)
- [Animation performance](https://web.dev/articles/animations-guide)

Recheck current API constraints when implementing affected behavior; do not browse for routine documentation edits.
