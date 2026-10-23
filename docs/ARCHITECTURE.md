# Architecture and decisions

Status: popup, page trial, persistent site permissions, worker-managed settings and controls implemented; reminders are deferred beyond beta. Performance numbers are targets unless explicitly measured.

## Components
| Location | Responsibility |
| --- | --- |
| background | Event-driven MV3 worker: permissions, registration, serialized settings mutations |
| content | Top-frame isolated-world bootstrap; Shadow DOM overlay; renderer and local behavior |
| popup/options | Popup controls/setup; options directory reserved, not a beta feature |
| shared | Validated settings/messages, site scope and position logic; minimal behavior logic next |

Register scripts at document_idle for granted origins. Defer rendering until eligible/visible. One overlay host; pointer events only on controls/cat. No document scanning, page-content reads, perpetual frame loop, or whole-document mutation observer. Shadow DOM isolates styles, not security. Explicit teardown is needed for already injected scripts after revocation.

Worker state must survive suspension: use stored preferences and browser-managed registration, not permanent timers/ports. Reminder scheduling, delivery IDs and alarms are deferred; do not implement them for beta. Subtle cat behavior should stay in the content layer and stop work when ineligible, without polling or catch-up bursts.

## Data and permissions
- Current required permissions: storage, scripting, activeTab. No alarms permission or new permission for the polish pass.
- Optional HTTP/HTTPS host access requested through user gestures; no required broad host access.
- Local: global pause, normalized position and explicit site-hide preferences. Reminder deadlines and recent-message data are deferred.
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
| D-004 / 2026-10-11 | Deferred concept: shared event-driven reminder coordinator | Revisit only if reminders are re-scoped after beta; do not implement now (D-009). |
| D-005 / 2026-10-11 | Markdown tracking plus Git, no PM service | Fast handoff with minimal duplicated context; split only when files become hard to scan. |
| D-006 / 2026-10-11 | M1 is a permission-free MV3 popup, Chrome 120+; Node 22.6+, pinned TypeScript/esbuild/SVGO and Node built-in tests | Validate original poses before injection. All dependencies are development-only; lockfile records exact versions. Add permissions only with the affected feature. |

## Primary references (checked during product planning)
- [Permissions](https://developer.chrome.com/docs/extensions/reference/api/permissions)
- [Scripting and teardown](https://developer.chrome.com/docs/extensions/reference/api/scripting)
- [Worker lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)
- [Alarms](https://developer.chrome.com/docs/extensions/reference/api/alarms)
- [Animation performance](https://web.dev/articles/animations-guide)

Recheck current API constraints when implementing affected behavior; do not browse for routine documentation edits.

## M1 implementation evidence
- `src/shared/character.ts` owns the pose contract; `src/popup/` renders it with native buttons and external local scripts/styles. No settings/messages yet.
- Authored asset provenance is in `assets/cat/README.md`. SVGO retains the viewBox. CSS animates only transforms; reduced motion disables animation and document visibility pauses it. No JavaScript timers.
- `npm ci --offline` and `npm run check` passed on Node 26.8.1 / npm 11.19.0: strict typecheck, production build, four tests. Measured artifact: 8,264 bytes unpacked, 2,625 bytes SVG; compressed ZIP: 4733 bytes.
- Browser tool blocked local `file:` navigation; Chrome loading, visual expressiveness, keyboard flow, and motion behavior remain unverified. No CPU/heap or multi-tab performance claim.
- MV3 popup declaration checked against [Chrome manifest documentation](https://developer.chrome.com/docs/extensions/reference/manifest) on 2026-10-11.

## Page trial scope decision (D-007 / 2026-10-11)
User approved “Try on this page” and a draggable cat. Add only `activeTab` and `scripting` for user-initiated top-frame injection. No host permissions, worker, storage, or remote requests in this slice. The popup calls the scripting API directly. A singleton in the isolated content world owns teardown and a document-lifetime position; full navigation resets the trial. Hide is document-local, not yet a saved site preference. Original SVGs and CSS are bundled into the content script, with no web-accessible resources. Chrome restrictions/errors are reported in the popup. Persistent permissions and settings require the next slice.

API basis: [Chrome activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab) and [scripting](https://developer.chrome.com/docs/extensions/reference/api/scripting), checked 2026-10-11.

## Page trial evidence
- Content bundle: 7,604 bytes including styles and optimized sleep/pet SVGs; total unpacked: 17,090 bytes; in-memory ZIP: 8,500 bytes.
- `npm run check` passes strict typecheck, production build, and eight tests. DOM simulation covers injection idempotency, drag/click distinction, keyboard movement, resize, hide/restore, hidden/fullscreen inactivity, and listener teardown. Chrome calls are mocked in adapter tests; actual injection and accessibility still need manual Chrome checks.
- `@types/chrome`, `jsdom`, and `@types/jsdom` are development-only. jsdom provides lifecycle regression tests without a browser; zero runtime dependencies remain. Its Node requirements are reflected in package.json and README.
- User reported M1 popup working; no detailed assistive technology, reduced-motion, or performance validation was asserted.

## Persistent controls scope decision (D-008 / 2026-10-11)
User authorized persistent site access and saved controls. Add storage plus optional HTTP/HTTPS host permissions (no required hosts or alarms). Only the selected scheme/hostname is requested by a direct popup gesture; Chrome host access and site settings cover that hostname's ports, not subdomains. A service worker serializes mutations, validates sender/message boundaries, and reconciles persistent content-script registration from actual grants. Storage holds global pause and per-site hidden/normalized position only after a user changes them, never browsing history. Content requests its own site state, tears down when disallowed/paused/hidden, and listens for event-driven updates. Temporary trials remain available without a grant; access revocation stops trials too. No recurring polling or worker keepalive.

## Persistent controls evidence
- Worker requests/replies validate sender, site, booleans, and finite normalized positions. Content can mutate only its own site; only the popup can pause globally or reconcile registrations. No external-message listener.
- Position writes occur at drag completion or keyboard movement, not every pointer move. A serialized worker queue preserves concurrent hidden/position updates and continues after a failed write. Registration reconciliation runs on install/startup, permission changes, and popup open.
- Permission revocation broadcasts affected origins, ending existing overlays/trials only where relevant. No response is awaited from content listeners that themselves request worker state, avoiding a broadcast/request deadlock.
- All 13 tests, strict typecheck and production build pass. Artifact: 37,515 bytes unpacked; each content bundle approximately 9,947 bytes including artwork/CSS; ZIP 16,727 bytes. Zero runtime dependencies.
- Chrome permission prompts, restart, multi-tab behavior and performance are still unverified in a real browser; tests mock APIs and simulate DOM. D-007 describes the earlier trial; D-008 supersedes its document-local hiding/position limitations.
- Chrome [optional permissions](https://developer.chrome.com/docs/extensions/reference/api/permissions) and [match patterns](https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns) were checked for this slice on 2026-10-11.

## Lean beta scope decision (D-009 / 2026-10-11)
The user chose a small, polished beta over more features. Finish subtle blink/stretch, a discreet accessible hide control, simple setup, reliability/accessibility and measured performance checks, then prepare beta materials. No new permissions, services, runtime dependencies, or telemetry are justified by this scope. Defer reminders (including alarms/scheduling), names/coats/sizes, autonomous walking/elaborate behavior, all-sites shortcut and extra settings until repeated feedback supports them. This supersedes earlier feature-expansion and polish-deferral plans.

The user subsequently confirmed persistent controls working. Detailed browser test cases and runtime measurements remain unconfirmed; a small package does not establish low CPU, memory, or battery cost. Historical milestone evidence above records what was known at each handoff, not the current roadmap.

## Approved character integration — 2026-10-17
CAT-001/CAT-002 now share the approved Marmalade SVG/JSON rig and native Web Animations renderer between popup and overlay. A narrow mount adapter owns reduced-motion listeners and teardown; the host owns visibility and interactions. No new permissions or runtime packages. Popup contains six manual previews; page keeps sleeping defaults and click-to-pet. Autonomous walking remains deferred. SVG optimization must preserve initially invisible animated parts; the original rig is bundled unchanged. This avoids a general Lottie runtime for transform/opacity-only motion.

## Quiet behavior — 2026-10-18
CAT-002 uses a DOM-independent QuietBehavior state machine with an injected clock/random source and one cancellable timeout. First nap: 20–35 seconds; later naps: 45–75 seconds; idle: 12–20 seconds; every third wake ends with a 3-second stretch. Pet: 1.8 seconds then sleep. Native renderer owns interpolation; the scheduler owns completion for on-page pet/stretch. Hidden/fullscreen/pagehide/drag cancel pending work, resume starts a fresh nap, and reduced motion disables autonomous deadlines. No backlog, walking/play scheduling, permissions, or dependencies added. Cadence remains a beta tuning choice; CPU/heap not yet measured.

## One-button visibility — 2026-10-18
UX-003 uses existing optional host permissions: Show requests the selected site in the direct click gesture, reconciles registration, sends a popup-only validated `show` message, then injects. Hide persists the existing hidden preference and broadcasts. Show verifies the grant again in the worker and preserves saved position. An optional validated `resumeWhilePaused` flag on that site lets legacy paused installations recover without globally resuming other sites. No permissions or runtime dependencies added. Old pause/trial APIs remain internal compatibility code; their popup controls and animation previews are removed.
