# StackTrace

AI-powered GitHub repository analysis and onboarding documentation generator.

**Built for IBM Bob Hackathon 2026** by StackTrace Team

## Features

- 🏗️ **Architecture Analysis** - Detect frameworks, patterns, dependencies, and communication patterns
- ⚠️ **Gotcha Detection** - Identify non-obvious pitfalls with evidence-based analysis
- 👥 **Contributor Guide** - Generate setup steps, testing strategy, and PR process
- 🚀 **Deployment Runbook** - Build commands, environment variables, and deployment steps
- 📝 **Coding Standards** - Detect linters, formatters, and conventions with code evidence
- 📊 **Team Playbook** - Export comprehensive onboarding documentation as PDF or Markdown
- 🗺️ **Architecture Map** - Interactive visual diagram of codebase structure

## Production-Grade Analysis Engine

StackTrace uses an evidence-based analysis pipeline that ensures **100% unique, repo-specific insights**:

- ✅ **Unique Issue IDs** - Format: `CATEGORY-TYPE-FILE` (e.g., `AUTH-BYPASS-MIDDLEWARE-TS`)
- ✅ **Mandatory Source Evidence** - Every gotcha cites actual code from the repository
- ✅ **Custom Fixes** - Tailored to the repo's coding style and conventions
- ✅ **Communication Pattern Detection** - Identifies actual patterns (Pub/Sub, REST, GraphQL, etc.)
- ✅ **Line Number Tracking** - Precise issue location (e.g., `file.ts:45`)
- ✅ **Confidence Scoring** - Minimum 0.4 threshold when evidence is provided

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **PDF Export:** jspdf
- **Markdown Parsing:** marked
- **APIs:** GitHub REST API, Bob API (primary), Gemini 1.5 Flash (fallback)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- GitHub Personal Access Token (for API access)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/WillX21-dotcom/StackTrace.git
cd StackTrace
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```
# Primary: Bob API Key for analysis
BOB_API_KEY=bob_prod_bob-apikey_...

# Fallback: Gemini API Key (automatic failover)
GEMINI_API_KEY=AIza...

# Optional: GitHub token for higher rate limits
GITHUB_TOKEN=your_github_personal_access_token
```

**Getting API Keys:**

**Bob API Key (Primary):**
- Visit the IBM Bob dashboard
- Create a new API key for production use
- Copy the key (format: `bob_prod_bob-apikey_...`)
- Add it to your `.env.local` file

**Gemini API Key (Fallback):**
- Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create a new API key
- Copy the key (format: `AIza...`)
- Add it to your `.env.local` file
- The system automatically uses Gemini if Bob API fails (rate limits, timeouts, errors)

4. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a public GitHub repository URL (e.g., `https://github.com/vercel/next.js`)
2. Click "Analyze Repository"
3. Wait for the analysis to complete (progress updates shown in real-time)
4. View the analysis cards, architecture map, or export the team playbook

## Project Structure

```
StackTrace/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page with repo URL input
│   ├── results/           # Analysis results page
│   └── api/               # API routes
│       ├── ingest/        # GitHub repo content fetching
│       └── analyse/       # 6-step analysis pipeline
├── components/            # React components
│   ├── cards/            # Analysis card components
│   └── ui/               # Reusable UI components
├── lib/                   # Core utilities
│   ├── github.ts         # GitHub API client
│   ├── analysis.ts       # Analysis pipeline
│   ├── prompts.ts        # LLM prompt templates
│   ├── schemas.ts        # Zod validation schemas
│   ├── types.ts          # TypeScript type definitions
│   └── export.ts         # PDF and Markdown export
└── .bob/                  # Bob AI configuration
    ├── rules/            # Project-specific rules
    └── skills/           # Reusable analysis skills
```

## Analysis Pipeline

StackTrace uses a 6-step analysis pipeline:

1. **Architecture Analysis** - Framework, patterns, dependencies, communication patterns
2. **Gotcha Detection** - Evidence-based pitfalls with unique IDs and custom fixes
3. **Contributor Guide** - Setup steps, testing strategy, PR process
4. **Deployment Runbook** - Build commands, env vars, deployment steps
5. **Coding Standards** - Linters, formatters, conventions with code evidence
6. **Playbook Assembly** - Synthesize all insights into a cohesive summary

## Validation Rules

- **Gotchas:** Minimum 3 required, each with source evidence (10-1000 chars) and custom fix (20-800 chars)
- **Architecture:** Communication pattern must describe actual repo structure (10-200 chars)
- **Coding Standards:** Source evidence required (10-1000 chars)
- **Confidence:** Minimum 0.4 when evidence is provided
- **Issue IDs:** Must follow pattern `CATEGORY-TYPE-FILE` (e.g., `AUTH-BYPASS-MIDDLEWARE-TS`)

## Git Workflow

- **develop:** Main working branch - push all commits here
- **feat/*:** Feature branches - merge to develop via PR
- **main:** Releases only - merge from develop via PR

Commit message format: Conventional Commits (`feat|fix|chore|docs|refactor|test|style`)

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Run `/review` in Bob chat before merging
4. Open a PR to `develop`
5. After approval, merge to `develop`

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built with [IBM Bob](https://www.ibm.com/bob) for the IBM Bob Hackathon 2026.

---

**StackTrace** - Making repository onboarding effortless with AI-powered analysis.