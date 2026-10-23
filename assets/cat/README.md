# Marmalade

Original vector artwork authored for Fat Cat on 2026-10-17 by A1 (Codex / GPT-6; exact variant unavailable), from the user's character brief. No stock assets, external fonts, copied character designs, tracing, or third-party artwork. No separate third-party license applies; repository owner controls distribution decisions.

Personality refinement: smug half-lidded eyes, a raised brow, an asymmetric smile, and a slight lifted-chin tilt. Petting reveals happy eyes and affection; captions offer company and gentle care with mock superiority. Same rig and six motions; no new runtime dependency.

## Files and editing
- `marmalade.svg`: one shared 360 × 300 rig, 14 named parts, 54 SVG nodes. Keep each `data-part` unique. SVG is developer-authored bundled input, not an upload format.
- `motions.json`: version 1, all six clips plus shared breathing/blink/tail tracks. JSON is compact on disk; use a formatter temporarily when editing.
- Renderer: `src/character/renderer.ts`; JSON validation/types: `src/character/motion.ts`.

Each clip contains a label, caption, static `pose`, and `tracks`. Tracks reference a shared name or contain `part`, `frames`, `duration` in milliseconds, `loop`, and `delay`. Frames allow only transform, opacity, and optional ordered offsets. Transform origins live in the renderer. Use only translate/rotate/scale; no path morphing, filters, raster assets, expressions, or arbitrary CSS.

Idle, sleeping, walking, and playing loop. Petting (1.8 seconds) and stretching (3 seconds) return to idle. Reduced motion holds a representative pose without animation; pet/stretch remain selected for inspection. Sleep takes 650 ms to curl into the pose. The same tail moves to the front of the rig during sleep.

`CatRenderer` exposes `setState`, `setSuspended`, `setReducedMotion`, and `destroy`. Its host owns visibility and user preferences. The preview demonstrates those adapters; extension wiring is intentionally separate. State changes cancel prior handles; completed/cancelled clips cannot overwrite a newer selection. No setInterval or requestAnimationFrame loop.

## Run
From the repository root, use `npm ci`, then `npm run preview`. Open http://127.0.0.1:4186. `CAT_PREVIEW_PORT` can override the port. Node 22+ recommended; validated with Node 26.8.1. `npm test` builds and runs seven Node tests; `npm run check` only checks strict TypeScript. Output in ignored `dist/`; no external runtime assets.

## Why custom JSON + SVG
| Consideration | Lottie JSON + player | Chosen SVG + JSON + Web Animations |
| --- | --- | --- |
| Artwork workflow | Useful for exported timeline compositions and complex authored paths | One hand-authored rig; shared parts and small transform tracks |
| Runtime | Requires a bundled player and renderer | Browser-native animation handles; zero runtime packages |
| Reuse | Composition/export conventions govern reuse | Shared breathe/blink/tail definitions; same SVG in every state |
| Control | Player-specific playback API | Explicit pause/cancel/finish and teardown, static reduced-motion poses |
| Maintenance | Broad feature set; standard tooling ecosystem | Small deliberately limited schema to maintain locally |
| Tradeoff | Better if artists need a rich export pipeline | No general Lottie import, arbitrary path morphs, or visual timeline editor |

This is a project-specific choice, not a benchmark claiming SVG always beats Lottie. These six motions only need transforms and opacity, so a general player provides little benefit. Revisit if a designer requires complex morphing or an After Effects export workflow; compare the actual bundled candidates then.

Primary references checked 2026-10-17: [Lottie renderer options](https://github.com/airbnb/lottie-web/wiki/loadAnimation-options), [supported features](https://github.com/airbnb/lottie-web/wiki/Features), and [native Web Animations controls](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API).

## Verification and limits
- Strict TypeScript build and seven tests pass: schema validation, rig references, lifecycle cancellation, one-shot completion, static reduced motion, suspension policy, and asset/node budgets.
- Browser checks: all six selectable states, pointer and keyboard petting, pause/resume, hide/show, reduced-motion control, and 88 px display. Inspected idle, sleep, play, and small-size poses visually. No browser error/warning logs observed.
- Lifecycle tests use an animation boundary double; they do not benchmark native rendering. System-level reduced-motion switching and real background-tab suspension still need Chrome integration testing.
- Asset and module byte counts are printed by `npm test`; compressed totals use gzip on concatenated files, not a network transfer measurement. SVG + JSON ~9.4 KiB; complete character asset/parser/renderer payload ~18.1 KiB unminified, ~5.2 KiB concatenated gzip; 54 nodes. Preview HTML/CSS/UI code are separate.
- No CPU, heap, frame-time, battery, 1/10/50-tab, or extension integration performance claim. Those release checks remain pending. Native transform animations can still incur paint work; no claim of zero CPU or guaranteed compositor execution.
