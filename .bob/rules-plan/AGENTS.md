# Project Architecture Rules (Non-Obvious Only)

## RepoMind Plan Mode Specifics

### Architecture Constraints (Hidden)
- API routes must be stateless (no in-memory caching)
- /app/api/ingest and /app/api/analyse are separate concerns
- Analysis pipeline is strictly sequential (6 steps, no parallelization)
- Cards generated independently but assembled in fixed order

### Directory Structure (When Initialized)
- /app/api/ingest - GitHub content fetching only
- /app/api/analyse - 6-step analysis pipeline only
- /components/cards - UI components (not logic)
- /components/export - PDF/Markdown generation (not API routes)
- /lib - shared utilities (GitHub client, prompts, export helpers)

### Data Flow (Non-Standard)
- User submits GitHub URL → /app/api/ingest fetches content
- Ingested content → /app/api/analyse runs 6-step pipeline
- Analysis results → cards rendered in UI
- Export triggered → /components/export generates PDF/Markdown
- No database - all analysis is ephemeral (hackathon constraint)

### Analysis Pipeline Order (Strict)
1. Architecture detection
2. Gotchas identification (minimum 3)
3. Contributor guide generation
4. Deployment runbook creation
5. Coding standards detection
6. Playbook assembly

### Performance Constraints
- GitHub API rate limits apply (60 req/hour unauthenticated)
- Must use GITHUB_TOKEN for higher limits (5000 req/hour)
- Analysis must complete in <30 seconds (user expectation)
- Large repos (>1000 files) may need sampling strategy

### Git Workflow Architecture
- develop branch is source of truth (not main)
- Feature branches merge to develop only
- Main branch updated only for releases
- Must run `/review` before any merge (quality gate)