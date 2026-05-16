# RepoMind

AI-powered GitHub repository analysis and onboarding documentation generator.

**Team:** StackTrace (IBM Bob Hackathon 2026)

## Features

- 🏗️ **Architecture Analysis** - Detect frameworks, patterns, and dependencies
- ⚠️ **Gotchas Detection** - Identify pitfalls and common issues (minimum 3 per analysis)
- 👥 **Contributor Guide** - Generate setup steps, testing strategy, and PR process
- 🚀 **Deployment Runbook** - Build commands, environment variables, and deployment steps
- 📋 **Coding Standards** - Detect linters, formatters, and conventions
- 📄 **Export Playbooks** - Download as PDF or Markdown

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (dark developer theme)
- **Validation:** Zod
- **GitHub API:** Octokit
- **Export:** jspdf, marked

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- GitHub personal access token (optional but recommended for higher rate limits)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/StackTrace/RepoMind.git
cd RepoMind
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` from template:
```bash
cp .env.example .env.local
```

4. Add your GitHub token to `.env.local` (optional):
```
GITHUB_TOKEN=ghp_your_token_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
StackTrace/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── ingest/        # GitHub content fetching
│   │   ├── analyse/       # 6-step analysis pipeline
│   │   └── export/        # PDF and Markdown generation
│   ├── results/           # Analysis results page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Tailwind styles
├── components/            # React components
│   ├── cards/            # Analysis card components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and business logic
│   ├── github.ts         # GitHub API client
│   ├── analysis.ts       # Analysis pipeline
│   ├── export.ts         # Export utilities
│   ├── prompts.ts        # Analysis prompts
│   ├── validation.ts     # Zod schemas
│   └── types.ts          # TypeScript types
└── public/               # Static assets
```

## Development Workflow

### Git Branches

- `main` - Production releases only
- `develop` - Main working branch (push all commits here)
- `feat/*` - Feature branches (merge to develop via PR)

### Commit Convention

Use Conventional Commits format:
```
feat(cards): add architecture card with confidence scoring
fix(api): handle GitHub rate limit errors
chore(deps): update Next.js to 14.2.3
```

### Before Merging

Run `/review` in Bob chat to check code quality.

## Environment Variables

See `.env.example` for all available configuration options.

## License

MIT License - StackTrace Team

## Hackathon Submission

**IBM Bob Hackathon 2026**  
**Team:** StackTrace  
**Product:** RepoMind  
**Dates:** May 15-17, 2026