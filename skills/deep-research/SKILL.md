---
name: deep-research
description: Deep, multi-source research with adversarial verification and a cited report. Use when the user wants a thorough investigation of a competitor, market, tool, niche, or topic for content or strategy. Pipeline — recon, parallel topic agents, critic, synthesis.
---

# Deep Research

A multi-agent harness for deep research. Pattern: **recon (map) → parallel topic agents (modal sweep) → critic (adversarial) → synthesis (cited report)**.

The point is not to dump search results. It's to map a question, attack it from several angles in parallel, then have an adversarial pass kill the weak claims before you synthesize.

## Tooling (configure to what you have)

| Stage | Tool | Notes |
|---|---|---|
| Discovery (find URLs) | Web search | Always free; use for finding sources. |
| Deep content (JS/SPA/long pages) | A scraper (Firecrawl, Playwright, your own) | Default source of real content — don't rely on snippets. |
| Quick fallback | A plain fetch | Simple static pages. |
| Social / reviews / maps | Paid scrapers (optional) | These usually cost money. **Gate them behind explicit user approval.** |

If a stage's tool isn't available to you, fall back to web search + fetch and **mark the gaps** in the report rather than guessing.

## Procedure

### 0. Sharpen the brief
If the question is underspecified ("research market X" with no goal/scope/region), ask 2–3 clarifying questions first. If it's clear, go.

### 1. Set up the session
- Make a slug from the topic, e.g. `competitor-ai-workshops`.
- Working dir: `outputs/deep-research/{slug}/` (with `raw/` and `reports/`).
- Track phases as todos: recon → topic-agents → critic → synthesis.

### 2. Recon
Run **one** recon agent. Output `recon-notes.md`: sub-questions, candidate sources, and flags for anything that needs deep scraping or paid scraping.

### 3. Paid-source gate (if recon flagged any)
If recon wants paid scrapers (social, reviews, maps), **stop and ask the user once, in bulk**: "Recon wants N paid sources: [list + why]. Run them? (free search + scrape run either way.)" Without a yes, skip them and mark the gaps.

### 4. Topic agents (parallel)
For each sub-question, run a separate agent in parallel. Each uses real scraped content, not snippets. Output `topic-{N}-report.md` per agent. Every material claim needs a source.

### 5. Critic (adversarial)
One critic agent reads all topic reports and does an adversarial pass: which claims are weak, unsourced, or contradicted? Output `critic-notes.md`. No new research — just judgment.

### 6. Synthesis
One agent assembles `REPORT.md` with citations, honoring the critic's verdicts. Add a "what this means for you" section, a completeness check (what modality/source got skipped), and max 3 next actions.

### 7. Close
Show the user a TL;DR + path to `REPORT.md`. Ask whether to save it to your knowledge base — don't save automatically.

## Rules

- Every material fact gets a source. No source → mark it `[UNVERIFIED]`. Never fabricate numbers or case studies.
- Paid scrapers = always ask. Free search + scrape = default.
- **Scale depth to the brief.** Quick research = 3–4 topic agents, one critic pass. "Be exhaustive" = more agents, 3–5 adversarial votes per claim, plus a completeness critic.
- Prefer pipelining (each topic verifies as it finishes) over a hard barrier, unless you genuinely need all results before the critic runs.
