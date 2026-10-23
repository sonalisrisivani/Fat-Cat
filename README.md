# Fat Cat

A free, quiet Chrome companion: a chubby, lazy cat with gentle humor and optional wellness reminders.

**State:** standalone original cat prototype ready for review. Extension integration has not started.

## Try Marmalade
```sh
npm ci
npm run preview
```
Open [the local preview](http://127.0.0.1:4186). Choose idle, sleeping, walking, playing, petting, or stretching; click the cat to pet it. Includes pause/hide, reduced motion, and an 88 px size check. Node 22+ recommended.

`npm test` builds and checks the character; `npm run check` runs strict TypeScript validation. TypeScript is the only development dependency; there are no runtime dependencies. See [character format, provenance, tradeoffs, and verification](assets/cat/README.md).

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
- `src/character/`: reusable SVG renderer and validated JSON motion types.
- `preview/`: standalone browser UI; no Chrome APIs.
- `src/background/`: service worker, permissions, reminder coordination.
- `src/content/`: bootstrap, overlay, character state machine, interactions.
- `src/popup/`: quick controls and onboarding.
- `src/options/`: detailed preferences.
- `src/shared/`: types, schemas, strings, pure utilities.
- `assets/cat/`: original character artwork; record provenance when added.
- `tests/`: logic and extension-flow tests, once implementation starts.
- `scripts/`: build/check utilities, once needed.
- `scratch/`: ignored temporary notes; recreate freely.

Tracked `.gitkeep` files preserve empty extension directories. Generated preview output belongs in ignored `dist/`; do not commit it.
