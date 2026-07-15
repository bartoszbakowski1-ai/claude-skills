# Claude Skills for Solopreneurs & Creators

A small, opinionated pack of **Claude Code** slash-commands and skills that run your day as an operator, not a chatbot. Built for solopreneurs, creators and one-person businesses who use Claude Code (or any agent that reads Markdown skills) as their daily driver.

Nothing here is locked to a specific stack. Every skill is **bring-your-own-tools**: you wire in your task manager, calendar, notes and CRM through a single [`CONFIG.md`](CONFIG.md), and the skills do the rest.

> These are templates, not magic. They tell the agent *how* to think about a recurring job (start the day, close the day, research a topic). The quality comes from the structure plus your tools.

## What's inside

| Skill | Trigger | What it does |
|---|---|---|
| [`daily-briefing`](commands/daily-briefing.md) | "update", "what's today", session start | Pulls tasks, calendar, recent logs and your own reflections into one scannable briefing. Ends with a single focus recommendation. Reads your state, not just your todo list. |
| [`end-session`](commands/end-session.md) | "end session", "wrap up" | Closes the work session: writes a structured log, updates long-term memory, closes/creates tasks, and (optionally) drafts content from what you learned. |
| [`weekly-review`](commands/weekly-review.md) | "weekly review", end of week | Reviews the week against your North-Star goals and produces a report + top-3 priorities for next week. |
| [`deep-research`](skills/deep-research/SKILL.md) | "research X deeply", competitor/market research | Multi-agent research harness: recon → parallel topic agents → adversarial critic → cited synthesis. Scales depth to the brief. |
| [`autoresearch`](skills/autoresearch/SKILL.md) | "iterate on X", "find the best Y" | An autonomous experiment loop (inspired by Karpathy's autoresearch): hypothesize → execute → measure → keep/discard → repeat. Works on copy, SEO, strategy, pricing, anything measurable. |
| [`audyt-anti-ai`](skills/audyt-anti-ai/SKILL.md) | "does this look AI-generated?", a URL, a local project | Audits a page for the "AI-slop" look across 6 areas (typography, layout, color, images, copy, motion). Reads the live render via a browser or greps local code, counts flags, returns a plain-language verdict (0-1 clean / 2-3 light / 4+ heavy) with quoted evidence and prioritized fixes. Read-only; prompts and output in Polish. |

## Install

These work with [Claude Code](https://claude.com/claude-code). Other agents that load Markdown skills/commands can use them too — adapt the tool names.

1. Clone the repo:
   ```bash
   git clone https://github.com/bartoszbakowski1-ai/claude-skills.git
   ```
2. Copy what you want into your Claude config:
   ```bash
   # Slash commands
   cp claude-skills/commands/*.md ~/.claude/commands/

   # Skills (each in its own folder)
   cp -r claude-skills/skills/* ~/.claude/skills/
   ```
3. Open [`CONFIG.md`](CONFIG.md), fill in your own tools and IDs, and keep it somewhere the agent can read (e.g. your `CLAUDE.md` or a memory file). **Never commit real tokens.**
4. Restart Claude Code. Trigger a skill, e.g. type `/daily-briefing`.

## Configure (read this before first run)

Every skill references **placeholders**, never real credentials. Before you run anything, set your own values in [`CONFIG.md`](CONFIG.md):

- `{{TASK_MANAGER}}` — ClickUp / Todoist / Linear / Notion / etc., plus its API token
- `{{CALENDAR}}` — Google Calendar / Outlook / etc.
- `{{NOTES}}` — Notion / Obsidian / a plain folder of Markdown
- `{{MEMORY_DIR}}` — where the agent keeps long-term memory files
- `{{REFLECTIONS}}` — optional voice-note / journaling source for "state > tasks"

If you don't have one of these, delete that section from the skill. The skills degrade gracefully.

## Design principles

- **Operator, not assistant.** The agent gathers context itself instead of asking you 5 questions.
- **State before tasks.** A good day starts by reading how you actually are, not just what's due.
- **Deliverables, not plans.** Every skill ends with something concrete: a briefing, a log, a report.
- **Bring your own tools.** No vendor lock-in. Placeholders everywhere.
- **No secrets in the repo.** Tokens live in your local config, never here.

## License

MIT — see [LICENSE](LICENSE). Use it, fork it, sell what you build with it.

---

Made by [Bartosz Bąkowski](https://www.bartbakowski.com). If these help, tell me what you'd add.
