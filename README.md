# Fat Cat

A free, quiet Chrome companion: a small, charming cat that keeps you company without getting in your way.

**State:** page companion with optional automatic site access, saved position, per-site hiding, and global pause. The user reports the core working. Next is a focused polish and validation pass for a small beta; reminders and personalization are deferred.

## What remains

1. Validate the automatic sleep/idle/stretch cadence and make the hide control discreet and accessible.
2. Confirm the one-button popup and remembered site choices in Chrome.
3. Complete reliability/accessibility checks and measure performance with multiple tabs.
4. Prepare icons, screenshots, a short demo, privacy/listing materials, and the beta package.
5. Recruit 20–30 consenting testers and collect one/two-week feedback before expanding scope.

Names, coats, sizes, reminders, walking/elaborate animations, all-sites access, and extra settings are deferred. See [STATUS](STATUS.md) for the current snapshot and [TRACKING](docs/TRACKING.md) for implementation versus acceptance state.

## Build and try

Use Node.js 22.22.2+, 24.15.0+, or 26+ (supported even-numbered lines) and npm. Validated with Node 26.8.1 / npm 11.19.0.

```sh
npm ci
npm run check
```

In Chrome 120+, open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked**, and select `dist/`. If already installed, reload Fat Cat and refresh your test webpages to remove old injected code. Chrome may ask you to re-enable the extension after the new storage permission.

On a normal website, open Fat Cat and use the single button:

- **Show cat:** Chrome may ask for access to this website the first time. Once allowed, the cat appears and returns on future visits.
- **Hide cat:** hides the cat on this website until you choose Show again. Your saved position and permission remain.

Choices apply to the current scheme and hostname (all ports), not other websites or subdomains. The on-page × and Escape also save Hide. You can revoke permission in Chrome’s extension settings.

Marmalade handles sleep, idle, blinking and occasional stretching automatically. Click to pet; drag or arrow keys move him. Pause, temporary trial, and animation preview controls have been removed from the popup. The standalone character studio remains separate. Existing global pause settings are recovered only for a website where you explicitly click Show; other paused sites stay paused.

No new permissions or runtime dependencies. Local settings only; no page text collection, telemetry or backend. Chrome pages, Web Store pages, files and incognito are unsupported.

`npm run check` passes strict typecheck, build and 32 tests. Tests cover Show/Hide persistence, direct permission requests and denial, legacy pause recovery without resuming other sites, injection failures, restricted pages, worker restarts, animation scheduling and existing overlay controls. Chrome APIs are mocked; a browser fixture checked the simplified popup's appearance and both button states. Live Chrome permission/persistence testing and CPU/heap profiling remain pending.

After reloading, manually confirm Show, permission denial/approval, refresh persistence, Hide across tabs, and ×/Escape followed by Show. The generated `dist/` is the folder Chrome loads.

## Standalone character studio

Run `npm run preview` and open [the local studio](http://127.0.0.1:4186). It includes all six motions, click-to-pet, pause/hide, reduced motion and size testing. Set `CAT_PREVIEW_PORT` to use another port if one is occupied. The studio shares the extension’s artwork and renderer; its output is kept in ignored `build/preview/` and is not shipped in the extension. See [design and format notes](docs/CHARACTER-STUDIO.md).

## Resume
Read [AGENTS.md](AGENTS.md), then [STATUS.md](STATUS.md). Inspect Git status before editing.

| Need | Read |
| --- | --- |
| Scope and acceptance | [PRD](docs/PRD.md) |
| Design and decisions | [Architecture](docs/ARCHITECTURE.md) |
| Milestones | [Roadmap](docs/ROADMAP.md) |
| Feature/bug state and attribution | [Tracking](docs/TRACKING.md) |
| Current sprint | Linked from STATUS |
| Previous handoffs | [History](docs/HISTORY.md) |
| Commits and branches | [Git workflow](docs/GIT.md) |

## Directory map
- `src/background/`: service worker, permissions, registration, settings coordination.
- `src/content/`: bootstrap, overlay, character state machine, interactions.
- `src/popup/`: quick controls and onboarding.
- `src/options/`: reserved placeholder; additional settings are deferred.
- `src/shared/`: types, schemas, strings, pure utilities.
- `assets/cat/`: original character artwork; record provenance when added.
- `tests/`: pure logic, Chrome adapter, DOM lifecycle, and built-artifact checks.
- `scripts/`: production build and SVG optimization.
- `scratch/`: ignored temporary notes; recreate freely.

Tracked `.gitkeep` files preserve directories reserved for later milestones. The build bundles local scripts with esbuild and optimizes original SVGs with SVGO. There are no runtime dependencies.
