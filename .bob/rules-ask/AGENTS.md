# Project Documentation Rules (Non-Obvious Only)

## StackTrace Ask Mode Context

### Project Structure (Counterintuitive)
- /app/api/ingest - GitHub fetching (not /api/github)
- /app/api/analyse - British spelling (not analyze)
- /components/cards - card UI (not /components/ui/cards)
- /components/export - PDF/Markdown (not /lib/export)
- /bob_sessions - IBM Bob exports (NEVER review or modify)

### Analysis Output Format (Critical)
- JSON responses must be raw (no markdown fences)
- Every insight requires confidence score (0.0-1.0)
- Minimum 3 gotchas per analysis (judges' requirement)
- Card insights max 3 sentences (developers stop reading after)

### Git Workflow (Non-Standard)
- Primary branch: `develop` (not main)
- Feature branches: `feat/[description]` off develop
- Must run `/review` before merging
- Main branch is releases only

### Custom Mode Available
- `repomind-analyst` mode for GitHub repo analysis
- Generates onboarding cards + team playbooks
- Uses 6-step analysis pipeline
- See .bob/custom_modes.yaml for details

### Security Context
- GitHub token: GITHUB_TOKEN (not GITHUB_API_KEY)
- Never commit .env files or credentials
- Fail fast if env vars missing (no fallbacks)