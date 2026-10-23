# Fat Cat

A free, quiet Chrome companion: a chubby, lazy cat with gentle humor and optional wellness reminders.

**State:** character feasibility prototype. A permission-free Chrome popup previews three original cat poses; page companionship is not implemented yet.

## Try the prototype

Requires Node.js 22 or newer and npm.

```sh
npm ci
npm test
npm run preview
```

Open [the local preview](http://127.0.0.1:4173). Choose Sleep, Stretch, or Pet; Tab and Enter/Space work with the buttons. Each cat is 88 CSS px wide. Pet has a brief animation when reduced motion is not requested. Close the popup to hide it.

To try as an extension: run `npm run build`, open Chrome's Extensions page (`chrome://extensions`), enable Developer mode, choose **Load unpacked**, and select this checkout's `dist/` folder. Open Fat Cat from the toolbar. It requests no permissions and does not appear on web pages. After rebuilding, reload it from the Extensions page.

`npm run typecheck` checks strict TypeScript. `npm test` builds then runs Node tests for local package references, permission boundaries, SVG safety/size/node budgets, and invalid pose values. Browser-preview checks passed; native Chrome installation and runtime performance remain unverified. Generated `dist/` is ignored. See [artwork provenance](assets/cat/README.md).

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
- `src/background/`: service worker, permissions, reminder coordination.
- `src/content/`: bootstrap, overlay, character state machine, interactions.
- `src/popup/`: quick controls and onboarding.
- `src/options/`: detailed preferences.
- `src/shared/`: types, schemas, strings, pure utilities.
- `assets/cat/`: original character artwork; record provenance when added.
- `tests/`: logic and extension-flow tests, once implementation starts.
- `scripts/`: build/check utilities, once needed.
- `scratch/`: ignored temporary notes; recreate freely.

Tracked `.gitkeep` files preserve future companion directories. Build output belongs in ignored `dist/`; dependency versions are pinned in the package manifest and lockfile.
