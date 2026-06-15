---
name: daily-briefing
description: Daily briefing on session start. Pulls tasks, calendar, recent logs and your own reflections into one scannable briefing. Use when the user starts a session, says "update", "what's today", "morning briefing", "status", or wants to know what's happening today and upcoming.
---

# /daily-briefing

Generate the user's daily briefing so the session starts with full context. This replaces asking "what's going on?" — you have the tools, go find out yourself.

Run all data sources **in parallel** for speed. Then present one concise, actionable briefing.

> Configure your tools in `CONFIG.md` first. Placeholders below (`{{TASK_MANAGER}}`, `{{CALENDAR}}`, etc.) map to your own stack. Delete any section whose source you don't use.

## Data sources (fetch ALL in parallel)

### 1. Tasks — today, overdue, this week
Query `{{TASK_MANAGER}}` for:
- Due today or overdue
- Upcoming 7 days
- Anything stuck "in progress"

Group by: **overdue / today / this week**. Capture name, due date, status, and which list/project it's in. Flag anything overdue or due today.

### 2. Calendar — today + next 3 days
Read `{{CALENDAR}}`. If you keep separate work and personal calendars, check **both** — the important events often live on the personal one. Range: today through +3 days.

### 3. Recent logs / notes
Pull the last 2–3 session logs or daily notes from `{{NOTES}}`. Understand what was done recently and what was left open, so the briefing has continuity.

### 4. Long-term memory
Scan `{{MEMORY_DIR}}` for active priorities, imminent deadlines, or launches. Surface anything time-sensitive.

### 5. Reflections — state, not just tasks (optional but high-value)
If the user keeps a reflections source (`{{REFLECTIONS}}` — voice notes, journal), read the last ~3 days **before** writing the focus section. People often say what their real priority is — and where they're stuck — in their own words.

Scan reflections for stuck loops: absolute generalizations ("nothing works", "always", "never"), self-labels, money scarcity, "I should…", avoidance. **If the user is clearly in a spiral, address that first** — a task list dumped on a stuck person doesn't help. Name the pattern plainly; don't comfort, don't moralize.

## Output format

```
## Daily briefing — [date]

### Today (calendar)
- [time] — [event] (which calendar)

### Next few days
- [date] [time] — [event]

### To do today
- [ ] [task] ([list]) — [status]

### Overdue
- [ ] [task] ([list]) — due [date]

### This week
- [ ] [task] ([list]) — [date]

### Context from recent sessions
- [what was done / key decisions]

### From reflections (if used)
- [2–4 bullets: what they're chewing on, open decisions, their state]

### Focus today
[1–3 sentences: the single most important thing today, given ranked goals {{GOALS}}, deadlines, and momentum.]
```

## Rules

- **Parallel execution** — fetch tasks, calendar, notes simultaneously.
- **No questions** — deliver the briefing; the user will redirect if needed.
- **One focus** — always end with a single recommendation ranked against `{{GOALS}}`.
- **Flag urgent** — call out anything overdue or due today.
- **Concise** — bullets, no fluff, max one screen.
- **Timezone** — compute "today" in `{{TIMEZONE}}`.
- **State > tasks** — if reflections show a stuck loop, address it first, then the list.
