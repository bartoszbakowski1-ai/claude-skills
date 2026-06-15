# CONFIG — wire your own tools in here

The skills in this repo use **placeholders** instead of hardcoded credentials. Fill these in with your own values and make sure your agent can read this file (put it next to your `CLAUDE.md`, or paste the relevant lines into it).

> ⚠️ **Never commit real tokens to a public repo.** Keep your filled-in copy local, or store secrets in a `.env` / secrets manager the agent reads at runtime.

## Tools

| Placeholder | What it is | Example |
|---|---|---|
| `{{TASK_MANAGER}}` | Your task manager + how to query it | ClickUp REST API, Todoist API, Linear MCP, Notion DB |
| `{{TASK_MANAGER_TOKEN}}` | API token for the above | `<your-token>` (store locally, not here) |
| `{{TASK_MANAGER_LIST_IDS}}` | The list/project IDs you actually use | `inbox=...`, `cashflow=...` |
| `{{CALENDAR}}` | Calendar source(s) to read | Google Calendar (work + personal), Outlook |
| `{{NOTES}}` | Where session logs / notes live | Notion page ID, Obsidian vault, `~/notes` |
| `{{MEMORY_DIR}}` | Long-term memory directory the agent maintains | `~/.claude/memory/` |
| `{{REFLECTIONS}}` | Optional: voice-notes / journal source | Letterly, Day One export, a `reflections/` folder |
| `{{TIMEZONE}}` | Your timezone (for "today" math) | `Europe/Warsaw` (UTC+2) |
| `{{GOALS}}` | Your North-Star goals, ranked | `1. Cashflow  2. Reputation  3. Assets` |

## Notes on "state > tasks"

`daily-briefing` and `end-session` can read a **reflections** source (voice notes, journal). This is optional but powerful: it lets the agent notice when you're in a stuck loop and address that *before* dumping a task list on you. If you don't journal, just remove the reflections section from those skills.

## Minimal setup

You can run everything with just a task manager + calendar. Everything else (memory, reflections, CRM sync) is additive. Start small, add sources as you go.
