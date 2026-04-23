---
name: refine-issue
description: Use when given a vague GitHub issue, loose requirement, or ambiguous feature request that needs to become implementation-ready before any code is written.
---

# Refine Issue

Turn a vague requirement into an actionable brief. Stop before you write any implementation plan.

## The Rule

**Ask before you assume. Surface before you spec.**

If the requirement is ambiguous — even slightly — you MUST ask targeted follow-up questions before producing a brief. Only lock in requirements after the user has answered.

## Red Flags — STOP and Ask

You are rationalizing if you think:
- "I can infer this from context" → Ask anyway. Inference = hidden assumption.
- "I'll put it in Out of Scope and move on" → Out of Scope is not a substitute for asking.
- "The technical implementation makes this obvious" → Business rules are not obvious.
- "It's probably just X" → Probably is not a requirement.

## Step 1 — Identify ambiguity

Before writing anything, scan the requirement for:

| Category | Examples |
|---|---|
| Missing actor | Who is doing this? Admin, end user, system? |
| Missing state | What statuses exist? What transitions are valid? |
| Missing rules | Can you do X twice? What happens on conflict? |
| Missing scope | Does this replace or extend existing behaviour? |
| Missing definition | What does "available", "reserved", "confirmed" mean here? |

If you find ANY of these: go to Step 2. Do not skip to Step 3.

## Step 2 — Ask targeted questions (if ambiguous)

Ask 3–6 focused questions. Each question must be specific, not open-ended.

Good: "Should cancelling a reservation delete it permanently, or change its status to 'cancelled'?"
Bad: "What should happen when a reservation is cancelled?"

Wait for answers before producing the brief.

## Step 3 — Write the brief

Produce a concise brief with these sections:

**Problem statement** — one sentence: what is broken or missing, and for whom.

**User story** — `As a [role], I want [action] so that [outcome].`

**Acceptance criteria** — numbered list of observable, testable conditions. Each criterion must be falsifiable (no "should work well").

**Business rules** — constraints the system must enforce, separate from acceptance criteria. Examples: overlap detection, status transitions, validation limits.

**Non-goals** — what this change explicitly does NOT include. Prevents scope creep.

**Assumptions** — things you assumed are true but were not stated. These are risks if wrong.

**Open questions** — anything still unclear that should be resolved before implementation starts. Do not hide these.

**Impacted parts of the system** — which of `api/`, `web/`, Prisma schema, generated client, or tests need to change.

## What the brief is NOT

- Not a technical implementation plan
- Not a list of files to edit
- Not an architecture decision

The brief defines the problem. A separate planning step defines the solution.
