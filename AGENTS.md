# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project: StackTrace (IBM Bob Hackathon 2026)
**Team:** StackTrace (solo developer)
**Product:** StackTrace — a tool that analyses GitHub repos and generates onboarding cards + team playbooks
**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, GitHub REST API, jspdf, marked, Zod

## PERMANENT NAMING RULE
**Product name is StackTrace, NOT RepoMind.**
If the user accidentally says "RepoMind" in conversation or code, automatically correct it to "StackTrace" without needing a reminder. This is a permanent rule for all future interactions.

## Non-Obvious Project Rules

### Analysis Output Format
- Analysis cards MUST be valid JSON without markdown fences
- Every insight requires confidence score (0.0-1.0); flag <0.6 with ⚠️
- Minimum 3 gotchas per analysis - never skip gotchas (most valuable for judges)
- Card insights limited to 3 sentences max (developers stop reading after that)
- Never invent file paths - cite only real paths from the analyzed repo

### Git Workflow (Non-Standard)
- **develop:** main working branch — push all commits here
- **feat/*:** feature branches — merge to develop via PR
- **main:** releases only — merge from develop via PR with Bob-generated description
- Conventional Commits required: feat|fix|chore|docs|refactor|test|style
- Must run `/review` in Bob chat before merging any branch
- **Always push after committing:** `git push origin [branch-name]`

### Code Standards (Strict)
- TypeScript everywhere - zero .js files in /src or /app
- Next.js 14 App Router - server components by default
- API routes in /app/api/ using Route Handlers (not pages/api/)
- Tailwind CSS only - no inline styles, no CSS modules
- Zod for all external data validation (API responses, forms)
- React hooks only for state (useState, useReducer, useContext)
- Never swallow errors silently - always surface with message

### Directory Structure
- `/app` → Next.js app router pages and API routes
- `/app/api/ingest` → GitHub repo content fetching
- `/app/api/analyse` → 6-step analysis pipeline (architecture → playbook)
- `/components/cards` → Onboarding card UI components
- `/components/export` → PDF and Markdown export components
- `/lib` → GitHub API client, prompt templates, export utilities
- `/bob_sessions` → IBM Bob task exports — **DO NOT modify or review this folder**
- `.bob/rules` → stacktrace.md — Bob reads this as permanent project rules
- `.bob/skills` → repomind/SKILL.md — repeatable analysis skill

### Security
- **Never touch .env files** — never commit credentials
- Never commit: API keys, tokens, passwords, IBM credentials
- Access env vars via process.env only - never hardcode secrets