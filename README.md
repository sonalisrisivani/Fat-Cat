# Fat Cat

A free, quiet Chrome companion: a chubby, lazy cat with gentle humor and optional wellness reminders.

**State:** workspace scaffold only. No extension features, manifest, dependencies, or build commands yet.

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

Tracked `.gitkeep` files preserve empty directories; remove each when real files arrive. Future build output belongs in ignored `dist/`. No package manifest is fabricated before choosing and validating the toolchain.
