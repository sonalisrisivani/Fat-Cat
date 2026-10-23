# Original character artwork

`sleep.svg`, `stretch.svg`, and `pet.svg` were authored directly as SVG paths for Fat Cat on 2026-10-11 by A1 (Codex / GPT-6; exact variant unavailable). No third-party artwork, tracing, fonts, or remote assets were used. They are project-owned source assets, not a third-party asset pack; no separate license grant is implied.

All three share a 110 × 100 viewBox, displayed at 88 × 80 CSS px. Ginger coat, dark outlines, and cream belly use explicit colors for this feasibility prototype. Recoloring is deferred to PER-001. The build optimizes with SVGO and preserves viewBox dimensions. Animation is applied by the renderer, never embedded in the SVG.

## Marmalade integration (2026-10-17)
`marmalade.svg` and `motions.json` are original project artwork/motion data authored by A1 (Codex / GPT-6; exact variant unavailable) from the user's brief in worktree 06d6, then approved for this extension. Half-lidded eyes, raised brow, smug smile, and affectionate petting express an arrogant but caring personality. No third-party assets.

`src/character/` validates the JSON and drives one shared SVG through native Web Animations, with no runtime packages. The popup exposes all six states; the page uses sleep and pet while retaining its quiet behavior. Preserve hidden rig parts during optimization. Original sleep/stretch/pet SVG files remain as legacy reference assets; live popup/page rendering uses Marmalade. CPU/heap performance remains unmeasured.
