---
name: end-session
description: Close the work session cleanly. Writes a structured log, updates long-term memory, closes/creates tasks, and optionally drafts content from what was learned. Use when the user says "end session", "wrap up", "log this", or is done for the day.
---

# /end-session

The user is closing the session. Do these steps **in order** — don't skip, don't over-do.

> Configure your tools in `CONFIG.md`. Placeholders below map to your stack. This skill writes to your notes and memory only — it never sends anything externally without explicit confirmation.

## Step 0 — Persist a session summary (if you run a shared agent memory)

If you keep a shared state store (a DB, a synced file) so other agents/sessions see what happened, write a short summary there first:
- `date`, `agent`, 1–3 sentence `summary`, `key_decisions[]`, `open_tasks[]`

Skip this step entirely if you don't run multi-agent / cross-session memory.

## Step 1 — Session log (always)

1. Review the whole session.
2. Write a summary (≤300 words, focus on deliverables):
   - **Title:** `Session [date] — [≤5 words on the main theme]`
   - **What we did** — ✅ list of concrete outcomes
   - **Blockers / open threads** — what's unfinished
   - **Decisions** — important calls made this session
   - **Next actions** — max 3 concrete next steps
3. Save it to `{{NOTES}}` (your session-log location).
4. Update `{{MEMORY_DIR}}` if anything durable emerged (new fact, preference, status change).
5. Update `{{TASK_MANAGER}}`: close finished tasks, create new ones from "Next actions". Check a similar task doesn't already exist before creating.

## Step 1.5 — Auto-learn (long-term memory upkeep)

Walk these questions and update the matching memory files:
1. New technical pattern? → a skills/patterns note
2. Stack change (new tool, new credential location)? → your stack note
3. Client/project status change? → that client's note
4. Did the user correct your behavior? → your rules/preferences note
5. Priorities/goals shifted? → your goals note
6. New durable fact? → memory
7. Project closed? → archive it

After any change, append one line to your memory changelog: `## [date] auto-learn | what changed`.

**Monthly consolidate (1st–3rd of the month):** archive closed clients/projects, compress old archives (keep key facts), refresh your memory index.

## Step 2 — Knowledge base (conditional)

Does the session contain something reusable later — a framework, a process, research results, a strategic decision with rationale, or a technical solution?

- **No** → skip to Step 3.
- **Yes** → save it to your knowledge base and tell the user what you saved.

## Step 3 — Content (optional)

**Only if Step 2 produced something worth sharing**, ask:

> "Want to turn this into content? (LinkedIn / IG / skip)"

If yes, draft the post per the user's pick and **show it for review**. Do not publish or send anything until the user explicitly approves. Publishing is always the user's click.

## Notes

- Quality > quantity on any content. Show the result, not "I used AI to…". 1–2 hashtags.
- Never trigger an external send (email, post, message, webhook-to-third-party) without explicit, in-context approval naming the recipient/audience.
