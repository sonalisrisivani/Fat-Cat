# Agent contract

## Start here
1. Read this file and `STATUS.md` (target: under five minutes).
2. Run `git status --short --branch` and inspect recent commits. Preserve existing work.
3. Use `README.md` to locate only the task-relevant document and source files.
4. Check the feature/bug row in `docs/TRACKING.md`. Do not reread all docs by default.

## Current boundary
This is a documentation and directory scaffold. Do not implement extension features until the user authorizes implementation. No build toolchain or runnable extension exists yet.

## Product and engineering rules
- Keep the companion quiet, local-first, accessible, and easy to hide.
- Target Manifest V3, strict TypeScript, vanilla UI, optimized SVG and native animation.
- Prefer zero runtime dependencies; justify additions in `docs/ARCHITECTURE.md`.
- No backend, telemetry, remote code, page-content collection, or extra permissions without a recorded scope decision.
- Keep business logic separate from DOM, storage, and Chrome API adapters.
- Use explicit types at boundaries, validate messages/settings, and handle API failures.
- Use descriptive camelCase identifiers, PascalCase types, and kebab-case filenames.
- Keep modules small by responsibility. Avoid speculative abstractions and unrelated refactors.
- Never commit credentials, personal data, generated output, or copied third-party assets without known licensing.
- Match the existing formatter; until tooling exists, use UTF-8, LF, two spaces, final newlines.

## Work cycle
1. Identify scope and acceptance criteria. Record an active row and next step before substantial work.
2. Inspect the affected files; do not overwrite another agent's edits. Coordinate overlapping changes.
3. Make the smallest complete change. Test relevant behavior; never claim unrun checks passed.
4. Update only affected sources of truth (see below). Record actual validation and limitations.
5. Review `git diff` and staged files. Commit a coherent change using `docs/GIT.md` when authorized.
6. Leave `STATUS.md` with a concrete next action and any uncommitted work or blockers.

## Documentation ownership
- `STATUS.md`: current snapshot, next action, blockers, verification; keep under ~60 lines.
- `docs/PRD.md`: product scope and user-visible acceptance criteria.
- `docs/ARCHITECTURE.md`: design, data boundaries, and short numbered decisions.
- `docs/ROADMAP.md`: milestone order; no duplicated task status.
- `docs/sprints/`: only current/closed sprint goals and completion criteria.
- `docs/TRACKING.md`: stable feature/bug IDs, state, attribution, commit references.
- `docs/HISTORY.md`: one short entry per meaningful change/handoff, not a transcript.
- Git: exact file history. Do not duplicate diffs or every small edit in Markdown.

After meaningful changes, update STATUS, the relevant tracking row, and a short HISTORY entry. Update PRD/architecture/sprint only if scope, design, or milestone evidence changed. Batch trivial edits into one entry.

## Attribution and resumability
- Record agent/client and model only when known; otherwise write `unknown`. Never infer identity from branding.
- Distinguish proposer, implementer, reviewer, and modifier. Self-review is not independent review.
- Put affected IDs and agent identity in commit trailers. Add concrete commit hashes to tracking at the next natural checkpoint; never create a recursive chain of commits just to record the current commit's own hash.
- For incomplete work, record affected files, last check/result, blocker, and exact next step in STATUS. Do not mark partial work complete or commit broken changes as finished.
- `scratch/` is ignored and disposable. Use it for concise working notes, experiments, and open questions, not hidden reasoning transcripts, secrets, or authoritative decisions. Promote useful conclusions before handoff; another clone will not contain scratch notes.
- Do not create model-specific copies of these rules. Point other tools to this file when needed.
- Do not spawn agents unless the user explicitly requests delegation.
