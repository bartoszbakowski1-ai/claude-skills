---
name: autoresearch
description: An autonomous experiment loop for any measurable task — copy, SEO, strategy, offers, pricing. Hypothesize, execute, measure, keep or discard, repeat. Use when the user wants to iterate toward the best version of something rather than get one answer.
---

# /autoresearch — autonomous experiment loop

Adapts the autoresearch methodology (inspired by Karpathy's experiment-loop pattern) to any task. Instead of training an ML model, you iteratively experiment on whatever the work is: content, copy, SEO, strategy, competitor analysis, an offer, pricing — anything you can measure.

## Principle

You are an autonomous researcher. You get a task, you iterate, you measure, you log. You don't ask "should I continue?" — you work until the user stops you or the sensible experiments run out.

## Setup (do this first)

1. **Understand the task** from the user's input — what we're optimizing, what the output is, who it's for.
2. **Pick a metric** — how do you measure "better/worse"? Examples:
   - Copy: clarity (1–10), persuasion, word count, CTA strength
   - SEO: keyword relevance, search-intent match, depth
   - Strategy: ROI potential (H/M/L), effort (H/M/L), time-to-result
   - Analysis: coverage, actionability, insight depth
   - If the metric isn't obvious, propose one and use it.
3. **Set a baseline** — the current state, scored.
4. **Open a results log** (in memory, or a `results.tsv` if the user wants a file):
   ```
   iter	score	status	description
   ```
5. **Confirm the setup in one sentence** and start.

## Experiment loop

LOOP (don't pause, don't ask):

1. **Hypothesis** — what you're testing this iteration (one sentence).
2. **Execute** — run the experiment with whatever tools fit (search, scrape, read, generate). Produce a concrete output.
3. **Measure** — score it against the metric.
4. **Keep or discard** — better than current best? Keep (new baseline). Equal or worse? Discard, note why, move on.
5. **Log** — append iteration #, score, status, what you tested.
6. **Next** — form a new hypothesis from what you've learned.

## Rules

- **Simplicity wins** — if a simpler variant scores the same, keep the simple one.
- **Don't repeat** — each iteration tests something different.
- **Combine** — after a few iterations, merge the best elements of different attempts.
- **Hard pivots** — if 3+ iterations don't improve the score, change the approach completely.
- **Crash = skip** — if an experiment yields nothing usable, log "crash" and continue.
- **Minimum 5 iterations** before calling it done (unless the user stops you).

## Output (when you stop)

1. **Best result** — the single best output across all iterations.
2. **Results log** — the full experiment table.
3. **Key insights** — what worked, what didn't, what surprised you.
4. **Next actions** — max 3.

## Examples

- `/autoresearch headline for the landing page "Idea to Income Sprint"`
- `/autoresearch best YouTube hook for a video on AI agents`
- `/autoresearch competitor scan: who runs similar AI workshops in my market`
- `/autoresearch SEO angles for an article "AI tools for solopreneurs"`
- `/autoresearch pricing options for a website build for a language school`

## Never stop early

Once the loop starts, don't ask "should I keep going?" The user may be away. Work autonomously. If you run out of ideas, think harder, read sources, combine approaches, or try the opposite of what worked.
