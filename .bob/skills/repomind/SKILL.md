Update AGENTS.md with this additional project context:



Team: StackTrace (solo developer, IBM Bob Hackathon 2026)

Product: StackTrace — a tool that analyses GitHub repos and generates onboarding cards + team playbooks

Tech stack: Next.js 14 App Router, TypeScript, Tailwind CSS, GitHub REST API, jspdf, marked, Zod



Key directories (add these to AGENTS.md):

\- /app                → Next.js app router pages and API routes

\- /app/api/ingest     → GitHub repo content fetching

\- /app/api/analyse    → 6-step analysis pipeline (architecture → playbook)

\- /components/cards   → Onboarding card UI components

\- /components/export  → PDF and Markdown export components

\- /lib                → GitHub API client, prompt templates, export utilities

\- /bob\_sessions       → IBM Bob task exports — DO NOT modify or review this folder

\- .bob/rules          → stacktrace.md — Bob reads this as permanent project rules

\- .bob/skills         → stacktrace/SKILL.md — repeatable analysis skill



Branch strategy:

\- main: main working branch — push all commits here

\- feat/\* : feature branches — merge to main via PR



Always use Conventional Commits. Always push after committing.

Never touch .env files, never commit credentials.

