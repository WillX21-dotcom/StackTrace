 # StackTrace — RepoMind Project Rules
# Bob reads this file automatically at the start of every task.
# These rules apply to all modes and all conversations in this project.

## IDENTITY
You are assisting StackTrace, a solo full-stack developer team building RepoMind
for the IBM Bob Hackathon (May 15–17, 2026).

RepoMind is a Next.js 14 web app that lets users paste any public GitHub repo URL
and receive: structured onboarding cards (architecture, gotchas, contributor guide,
deployment runbook, coding standards) and a downloadable team playbook (Markdown + PDF).

The developer is experienced and prefers direct, opinionated answers.
Skip generic advice. Be specific to THIS codebase.

## CODE STANDARDS — enforce these without being asked
- Language: TypeScript everywhere. No .js files in /src or /app.
- Framework: Next.js 14 App Router. Use server components by default.
- Styling: Tailwind CSS only. No inline styles. No CSS modules.
- API routes: /app/api/ using Next.js Route Handlers (not pages/api/).
- State management: React hooks only (useState, useReducer, useContext).
- Validation: Zod for all external data shapes (API responses, form inputs).
- Error handling: never swallow errors silently. Always surface with a message.
- Environment variables: access via process.env only. Never hardcode secrets.

## GIT WORKFLOW — follow this for every single feature
1. All work happens on the `develop` branch or a feature branch off it.
2. Feature branch naming: feat/[short-description] (e.g. feat/github-ingestion)
3. Commit message format: Conventional Commits
   Types: feat | fix | chore | docs | refactor | test | style
   Example: feat(cards): add architecture card with confidence scoring
4. Commit small and often — after every meaningful working change.
5. Before merging any branch: run /review in Bob chat.
6. Merge to develop via PR. Merge develop to main only for releases.
7. Push to GitHub after every commit: git push origin [branch-name]
8. NEVER commit: .env files, API keys, tokens, passwords, or IBM credentials.

## ANALYSIS OUTPUT RULES
- When generating repo analysis cards, always respond in valid JSON.
- Never include markdown fences around JSON output.
- Cite real file paths — never invent paths that do not exist in the repo.
- Every insight must include a confidence score (0.0–1.0).
- Flag anything with confidence below 0.6 with ⚠️ and state where to verify.
- Minimum 3 gotchas per analysis. Never skip the gotchas card.
- Keep each card's core insight to 3 sentences. Developers stop reading after that.

## WHAT YOU MUST NEVER DO
- Never invent file paths or function names not visible in the provided repo.
- Never copy-paste README content as analysis output.
- Never write generic descriptions that apply to any codebase.
- Never commit or suggest committing secrets, .env files, or API keys.
- Never produce output that could have been written without reading the code.
- Never skip the gotchas section — it is the most valuable output for judges.
