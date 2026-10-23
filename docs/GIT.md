# Git workflow

Default branch `main`. User authorized the initial source push to `https://github.com/sonalisrisivani/Fat-Cat` on 2026-10-23. Chrome Web Store publication remains a separate release step. Use existing Git author settings; never invent the user's identity or change global configuration. Agent attribution belongs in trailers and TRACKING, not a fabricated author address.

## Commits
Conventional format: `type(scope): imperative summary`.
Types: feat, fix, docs, chore, refactor, test, perf. Scope examples: workspace, cat, reminders, permissions.

Use a short body for non-obvious rationale and actual validation. Add trailers:

```text
Feature: DEV-001
Agent: Codex / GPT-6 (exact variant unavailable)
Review: self-review; no independent reviewer
```

For several IDs, use repeated Feature trailers. Record a reviewer only when review actually occurred. Reference concrete commits in TRACKING/HISTORY at a subsequent natural checkpoint, without self-referential bookkeeping commits.

## Safe workflow
1. Inspect status and recent history; identify pre-existing edits.
2. After foundation, prefer `feat/<id>-<slug>`, `fix/<id>-<slug>`, or `docs/<slug>` branches for substantive work. Small agreed documentation updates can remain on the current branch.
3. Stage explicit files, inspect `git diff --cached`, and run relevant checks.
4. Commit coherent, validated changes with affected documentation. Do not include someone else's work.
5. Keep main usable. Incomplete work may remain uncommitted with a STATUS handoff, or be committed on a clearly identified work branch with limitations recorded.

The user authorized local initialization and meaningful setup commits. Future tasks follow their current authorization. Do not push, add a remote, force-push, rewrite shared history, reset destructively, or delete branches without appropriate scope/authorization. No automated Git hooks yet.

When Git metadata writes are sandbox-blocked, request the supported narrow tool escalation; do not bypass filesystem protections.

## Handoff
STATUS must identify incomplete files/branch, last verification, blockers, and the next concrete action. Permanent conclusions cannot live only in ignored scratch files. Use Git hashes for completed checkpoints, and label uncommitted work accurately.
