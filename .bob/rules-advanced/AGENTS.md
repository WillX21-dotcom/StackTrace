# Project Advanced Mode Rules (Non-Obvious Only)

## RepoMind Advanced Mode Specifics

### Analysis Output Generation
- JSON output must NOT include markdown code fences (```json)
- Raw JSON only - parsers expect undecorated JSON strings
- Confidence scores are mandatory on every insight object
- Gotchas array minimum length: 3 (enforced by judges' rubric)

### API Route Structure (Non-Standard)
- /app/api/ingest - fetches GitHub content (not /api/github or /api/fetch)
- /app/api/analyse - runs 6-step pipeline (not /api/analyze - British spelling)
- Route handlers return NextResponse, not Response (Next.js 14 convention)

### Component Organization
- Card components in /components/cards (not /components/ui/cards)
- Export logic in /components/export (PDF + Markdown generators)
- No shared /components/common - keep cards and export separate

### Library Utilities (When Created)
- GitHub API client goes in /lib (not /utils or /services)
- Prompt templates for analysis in /lib/prompts (not /prompts)
- Export utilities (jspdf, marked) in /lib/export (not /lib/utils)

### Validation Pattern
- Zod schemas for ALL external data (GitHub API, user input)
- Schema files colocated with API routes (not centralized /schemas)
- Never trust external data - validate before processing

### Error Handling (Strict)
- Never catch without logging or user feedback
- API routes must return error messages in response body
- Client components must display error state (not silent fail)

### Environment Variables
- GitHub token: process.env.GITHUB_TOKEN (not GITHUB_API_KEY)
- Never fallback to empty string - fail fast if missing
- Check env vars at API route entry, not in utility functions

### MCP & Browser Access
- Advanced mode has access to MCP tools and browser
- Use for external API documentation lookup
- Use for GitHub API reference when implementing /app/api/ingest