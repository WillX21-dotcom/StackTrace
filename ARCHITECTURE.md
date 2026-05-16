# RepoMind — Complete Architecture Plan

## Project Overview
RepoMind is a Next.js 14 web application that analyzes public GitHub repositories and generates structured onboarding documentation. Users paste a GitHub URL, receive 5 analysis cards (architecture, gotchas, contributor guide, deployment runbook, coding standards), and can export a complete team playbook as PDF or Markdown.

---

## Directory Structure

```
StackTrace/
├── .bob/                          # Bob AI configuration (existing)
│   ├── rules/                     # Project-wide rules
│   │   └── stacktrace.md
│   ├── rules-plan/                # Plan mode rules
│   │   └── AGENTS.md
│   └── skills/                    # Reusable Bob skills
│       └── repomind/
│           └── SKILL.md
├── .next/                         # Next.js build output (gitignored)
├── bob_sessions/                  # Bob task exports (gitignored)
├── node_modules/                  # Dependencies (gitignored)
├── public/                        # Static assets
│   ├── fonts/                     # JetBrains Mono font files
│   └── favicon.ico
├── app/                           # Next.js 14 App Router
│   ├── layout.tsx                 # Root layout with Tailwind + font
│   ├── page.tsx                   # Home page (URL input form)
│   ├── results/
│   │   └── page.tsx               # Results dashboard with tabs
│   ├── api/
│   │   ├── ingest/
│   │   │   └── route.ts           # POST: fetch GitHub repo content
│   │   ├── analyse/
│   │   │   └── route.ts           # POST: run 6-step analysis pipeline
│   │   └── export/
│   │       ├── pdf/
│   │       │   └── route.ts       # POST: generate PDF playbook
│   │       └── markdown/
│   │           └── route.ts       # POST: generate Markdown playbook
│   └── globals.css                # Tailwind directives + custom styles
├── components/                    # React components
│   ├── cards/                     # Analysis card components
│   │   ├── ArchitectureCard.tsx   # Architecture overview card
│   │   ├── GotchasCard.tsx        # Gotchas/pitfalls card
│   │   ├── ContributorCard.tsx    # Contributor guide card
│   │   ├── DeploymentCard.tsx     # Deployment runbook card
│   │   └── StandardsCard.tsx      # Coding standards card
│   ├── ui/                        # Reusable UI components
│   │   ├── StatsBar.tsx           # Repo stats (stars, forks, language)
│   │   ├── TabSwitcher.tsx        # Card navigation tabs
│   │   ├── ConfidenceBadge.tsx    # Confidence score indicator
│   │   ├── LoadingSkeleton.tsx    # Loading state placeholder
│   │   ├── ErrorState.tsx         # Error message display
│   │   └── ExportButtons.tsx      # PDF/Markdown export buttons
│   └── forms/
│       └── RepoUrlForm.tsx        # GitHub URL input form
├── lib/                           # Utilities and business logic
│   ├── github.ts                  # GitHub REST API client
│   ├── analysis.ts                # 6-step analysis pipeline orchestrator
│   ├── export.ts                  # PDF/Markdown generation utilities
│   ├── prompts.ts                 # Analysis prompt templates
│   ├── validation.ts              # Zod schemas for API validation
│   └── types.ts                   # TypeScript type definitions
├── .env.local                     # Environment variables (gitignored)
├── .env.example                   # Environment variable template
├── .gitignore                     # Git ignore rules (existing)
├── AGENTS.md                      # Agent guidance (existing)
├── ARCHITECTURE.md                # This file
├── next.config.js                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # Project documentation
```

---

## Rationale for Directory Decisions

### `/app` Structure
- **App Router over Pages Router**: Next.js 14 App Router provides server components by default, reducing client-side JavaScript and improving performance for analysis-heavy operations.
- **Colocation of API routes**: `/app/api/*` keeps API logic close to page components, making data flow easier to trace.
- **Separate `/results` page**: Analysis results need their own route for shareable URLs and browser history support.

### `/components` Organization
- **`/cards`**: Each card type is isolated for independent development and testing. Cards share no state, making them pure presentation components.
- **`/ui`**: Reusable primitives used across multiple cards (badges, tabs, loading states). These are stateless and highly composable.
- **`/forms`**: Form components separated for validation logic isolation and potential reuse (e.g., future "analyze multiple repos" feature).

### `/lib` Utilities
- **`github.ts`**: Encapsulates all GitHub API interactions. Handles rate limiting, authentication, and error normalization.
- **`analysis.ts`**: Orchestrates the 6-step pipeline. Each step is a pure function that takes repo data and returns structured insights.
- **`export.ts`**: Centralizes PDF (jspdf) and Markdown (marked) generation. Keeps export logic out of API routes.
- **`prompts.ts`**: Stores analysis prompt templates. Separating prompts from logic allows easy iteration without touching business logic.
- **`validation.ts`**: Zod schemas for all external data (GitHub API responses, user input). Single source of truth for data shapes.
- **`types.ts`**: Shared TypeScript types. Prevents circular dependencies and provides IDE autocomplete across the codebase.

---

## API Routes

### 1. `/app/api/ingest/route.ts`
**Purpose**: Fetch GitHub repository content via REST API.

**Method**: `POST`

**Request Body** (Zod validated):
```typescript
{
  repoUrl: string;  // e.g., "https://github.com/vercel/next.js"
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    owner: string;
    repo: string;
    defaultBranch: string;
    stats: {
      stars: number;
      forks: number;
      language: string;
      size: number;  // KB
    };
    files: Array<{
      path: string;
      content: string;  // base64 decoded
      size: number;
    }>;
    readme: string | null;
  };
}
```

**Error Response** (400/404/500):
```typescript
{
  success: false;
  error: string;  // "Invalid GitHub URL" | "Repository not found" | "Rate limit exceeded"
}
```

**Rationale**:
- Stateless design: no caching, no database. Each request fetches fresh data.
- Returns only essential files (max 50 files, prioritize root-level configs, src/, docs/).
- Base64 decoding happens here to keep analysis logic clean.

---

### 2. `/app/api/analyse/route.ts`
**Purpose**: Run 6-step analysis pipeline on ingested repo data.

**Method**: `POST`

**Request Body** (Zod validated):
```typescript
{
  repoData: {
    owner: string;
    repo: string;
    files: Array<{ path: string; content: string; }>;
    readme: string | null;
  };
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    architecture: {
      framework: string;
      patterns: string[];
      dependencies: string[];
      confidence: number;  // 0.0-1.0
    };
    gotchas: Array<{
      title: string;
      description: string;  // max 3 sentences
      severity: "high" | "medium" | "low";
      filePath: string;  // real path from repo
      confidence: number;
    }>;
    contributorGuide: {
      setupSteps: string[];
      testingStrategy: string;
      prProcess: string;
      confidence: number;
    };
    deploymentRunbook: {
      buildCommand: string;
      envVars: string[];
      deploymentSteps: string[];
      confidence: number;
    };
    codingStandards: {
      linter: string | null;
      formatter: string | null;
      conventions: string[];
      confidence: number;
    };
  };
}
```

**Error Response** (400/500):
```typescript
{
  success: false;
  error: string;
}
```

**Rationale**:
- Sequential pipeline: architecture → gotchas → contributor → deployment → standards → playbook assembly.
- Each step outputs structured JSON with confidence scores.
- Minimum 3 gotchas enforced (most valuable for judges).
- All file paths cited must exist in `repoData.files`.

---

### 3. `/app/api/export/pdf/route.ts`
**Purpose**: Generate PDF playbook from analysis results.

**Method**: `POST`

**Request Body**:
```typescript
{
  repoName: string;
  analysisData: {
    architecture: { ... };
    gotchas: [ ... ];
    contributorGuide: { ... };
    deploymentRunbook: { ... };
    codingStandards: { ... };
  };
}
```

**Response** (200 OK):
```typescript
Content-Type: application/pdf
Content-Disposition: attachment; filename="repomind-[repoName].pdf"

[Binary PDF data]
```

**Rationale**:
- Uses jspdf for client-side PDF generation.
- Dark theme with teal accents (#1aad7e) matching UI.
- JetBrains Mono font embedded for code snippets.

---

### 4. `/app/api/export/markdown/route.ts`
**Purpose**: Generate Markdown playbook from analysis results.

**Method**: `POST`

**Request Body**: Same as PDF route.

**Response** (200 OK):
```typescript
Content-Type: text/markdown
Content-Disposition: attachment; filename="repomind-[repoName].md"

[Markdown content]
```

**Rationale**:
- Uses marked library for Markdown rendering.
- Includes frontmatter with metadata (repo URL, analysis date).
- GitHub-flavored Markdown for compatibility.

---

## Page Architecture

### 1. `/app/page.tsx` (Home Page)
**Route**: `/`

**Purpose**: Landing page with GitHub URL input form.

**Components Used**:
- [`RepoUrlForm`](components/forms/RepoUrlForm.tsx) — URL input with validation
- [`ErrorState`](components/ui/ErrorState.tsx) — Display ingestion errors

**State Management**:
- `useState` for form input and loading state
- `useRouter` to navigate to `/results` on success

**Flow**:
1. User pastes GitHub URL
2. Client-side validation (Zod schema)
3. POST to [`/api/ingest`](app/api/ingest/route.ts)
4. On success: navigate to `/results?repo=owner/name` with analysis data in URL state
5. On error: display error message below form

**Rationale**:
- Server component for initial render (no JS needed for static content).
- Client component for form interactivity.
- URL state passed to results page avoids prop drilling.

---

### 2. `/app/results/page.tsx` (Results Dashboard)
**Route**: `/results?repo=owner/name`

**Purpose**: Display 5 analysis cards with tab navigation and export options.

**Components Used**:
- [`StatsBar`](components/ui/StatsBar.tsx) — Repo metadata
- [`TabSwitcher`](components/ui/TabSwitcher.tsx) — Card navigation
- [`ArchitectureCard`](components/cards/ArchitectureCard.tsx)
- [`GotchasCard`](components/cards/GotchasCard.tsx)
- [`ContributorCard`](components/cards/ContributorCard.tsx)
- [`DeploymentCard`](components/cards/DeploymentCard.tsx)
- [`StandardsCard`](components/cards/StandardsCard.tsx)
- [`ExportButtons`](components/ui/ExportButtons.tsx) — PDF/Markdown download
- [`LoadingSkeleton`](components/ui/LoadingSkeleton.tsx) — Analysis loading state
- [`ErrorState`](components/ui/ErrorState.tsx) — Analysis errors

**State Management**:
- `useState` for active tab (default: "architecture")
- `useState` for analysis data (fetched on mount)
- `useSearchParams` to read repo from URL

**Flow**:
1. Page loads with repo query param
2. Fetch ingested data from URL state or re-fetch via [`/api/ingest`](app/api/ingest/route.ts)
3. POST to [`/api/analyse`](app/api/analyse/route.ts) with repo data
4. Display loading skeleton during analysis
5. Render cards when analysis completes
6. User switches tabs to view different cards
7. User clicks export button → POST to [`/api/export/pdf`](app/api/export/pdf/route.ts) or [`/api/export/markdown`](app/api/export/markdown/route.ts)

**Rationale**:
- Tab-based navigation keeps UI clean (5 cards would overwhelm as vertical scroll).
- Analysis happens on results page (not home) to show progress feedback.
- Export buttons always visible for quick access.

---

## Component Hierarchy

### Card Components (`/components/cards`)

#### 1. `ArchitectureCard.tsx`
**Props**:
```typescript
{
  framework: string;
  patterns: string[];
  dependencies: string[];
  confidence: number;
}
```
**Displays**:
- Framework badge (e.g., "Next.js 14")
- Architecture patterns as bullet list
- Top 5 dependencies with version badges
- Confidence badge at bottom

---

#### 2. `GotchasCard.tsx`
**Props**:
```typescript
{
  gotchas: Array<{
    title: string;
    description: string;
    severity: "high" | "medium" | "low";
    filePath: string;
    confidence: number;
  }>;
}
```
**Displays**:
- Minimum 3 gotchas (enforced by API)
- Severity color coding (red/yellow/blue)
- File path as clickable link (opens GitHub file)
- Confidence badge per gotcha

**Rationale**:
- Most valuable card for judges — prioritize visual hierarchy.
- High-severity gotchas appear first.

---

#### 3. `ContributorCard.tsx`
**Props**:
```typescript
{
  setupSteps: string[];
  testingStrategy: string;
  prProcess: string;
  confidence: number;
}
```
**Displays**:
- Numbered setup steps
- Testing strategy as prose
- PR process as prose
- Confidence badge

---

#### 4. `DeploymentCard.tsx`
**Props**:
```typescript
{
  buildCommand: string;
  envVars: string[];
  deploymentSteps: string[];
  confidence: number;
}
```
**Displays**:
- Build command in code block
- Environment variables as list
- Deployment steps as numbered list
- Confidence badge

---

#### 5. `StandardsCard.tsx`
**Props**:
```typescript
{
  linter: string | null;
  formatter: string | null;
  conventions: string[];
  confidence: number;
}
```
**Displays**:
- Linter/formatter badges (if detected)
- Conventions as bullet list
- Confidence badge

---

### UI Components (`/components/ui`)

#### 1. `StatsBar.tsx`
**Props**:
```typescript
{
  stars: number;
  forks: number;
  language: string;
  size: number;  // KB
}
```
**Displays**: Horizontal bar with icons and counts.

---

#### 2. `TabSwitcher.tsx`
**Props**:
```typescript
{
  tabs: Array<{ id: string; label: string; icon: string; }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}
```
**Displays**: Horizontal tab navigation with active state.

---

#### 3. `ConfidenceBadge.tsx`
**Props**:
```typescript
{
  score: number;  // 0.0-1.0
}
```
**Displays**:
- Green badge for ≥0.8
- Yellow badge for 0.6-0.79
- Red badge with ⚠️ for <0.6

---

#### 4. `LoadingSkeleton.tsx`
**Props**: None (stateless)

**Displays**: Animated skeleton matching card layout.

---

#### 5. `ErrorState.tsx`
**Props**:
```typescript
{
  message: string;
  onRetry?: () => void;
}
```
**Displays**: Error icon, message, optional retry button.

---

#### 6. `ExportButtons.tsx`
**Props**:
```typescript
{
  repoName: string;
  analysisData: AnalysisResult;
  onExport: (format: "pdf" | "markdown") => void;
}
```
**Displays**: Two buttons (PDF, Markdown) with download icons.

---

### Form Components (`/components/forms`)

#### 1. `RepoUrlForm.tsx`
**Props**:
```typescript
{
  onSubmit: (url: string) => void;
  isLoading: boolean;
}
```
**Displays**: Input field, submit button, validation errors.

**Validation** (Zod):
- Must be valid GitHub URL
- Must match pattern: `https://github.com/[owner]/[repo]`

---

## Lib Utilities

### 1. `lib/github.ts`
**Exports**:
```typescript
export async function fetchRepoContent(
  owner: string,
  repo: string,
  token?: string
): Promise<RepoData>;

export async function fetchRepoStats(
  owner: string,
  repo: string,
  token?: string
): Promise<RepoStats>;

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null;
```

**Responsibilities**:
- GitHub REST API client with Octokit
- Rate limit handling (60/hour unauthenticated, 5000/hour with token)
- Error normalization (404 → "Repository not found")
- File prioritization (fetch root configs, src/, docs/ first)
- Base64 decoding for file content

**Rationale**:
- Centralized API logic prevents duplication across routes.
- Token support allows higher rate limits for production.

---

### 2. `lib/analysis.ts`
**Exports**:
```typescript
export async function analyzeArchitecture(
  files: RepoFile[],
  readme: string | null
): Promise<ArchitectureInsight>;

export async function detectGotchas(
  files: RepoFile[],
  architecture: ArchitectureInsight
): Promise<GotchaInsight[]>;

export async function generateContributorGuide(
  files: RepoFile[],
  readme: string | null
): Promise<ContributorGuideInsight>;

export async function generateDeploymentRunbook(
  files: RepoFile[],
  architecture: ArchitectureInsight
): Promise<DeploymentRunbookInsight>;

export async function detectCodingStandards(
  files: RepoFile[]
): Promise<CodingStandardsInsight>;

export async function assemblePlaybook(
  insights: AllInsights
): Promise<Playbook>;
```

**Responsibilities**:
- Orchestrate 6-step analysis pipeline
- Each function is pure (no side effects)
- Confidence scoring for every insight
- Minimum 3 gotchas enforcement
- File path validation (never invent paths)

**Rationale**:
- Sequential pipeline ensures each step builds on previous results.
- Pure functions enable easy testing and debugging.

---

### 3. `lib/export.ts`
**Exports**:
```typescript
export async function generatePDF(
  repoName: string,
  analysisData: AnalysisResult
): Promise<Blob>;

export function generateMarkdown(
  repoName: string,
  analysisData: AnalysisResult
): string;
```

**Responsibilities**:
- PDF generation with jspdf
- Markdown generation with marked
- Dark theme styling for PDF
- JetBrains Mono font embedding

**Rationale**:
- Keeps export logic out of API routes.
- Reusable for future export formats (e.g., HTML).

---

### 4. `lib/prompts.ts`
**Exports**:
```typescript
export const ARCHITECTURE_PROMPT = `...`;
export const GOTCHAS_PROMPT = `...`;
export const CONTRIBUTOR_PROMPT = `...`;
export const DEPLOYMENT_PROMPT = `...`;
export const STANDARDS_PROMPT = `...`;
```

**Responsibilities**:
- Store analysis prompt templates
- Provide context for each analysis step
- Include examples of expected output format

**Rationale**:
- Separating prompts from logic allows easy iteration.
- Prompts can be versioned independently.

---

### 5. `lib/validation.ts`
**Exports**:
```typescript
export const GitHubUrlSchema = z.object({ ... });
export const IngestRequestSchema = z.object({ ... });
export const AnalyseRequestSchema = z.object({ ... });
export const ExportRequestSchema = z.object({ ... });
```

**Responsibilities**:
- Zod schemas for all API request/response validation
- Type inference for TypeScript
- Error message customization

**Rationale**:
- Single source of truth for data shapes.
- Prevents invalid data from reaching business logic.

---

### 6. `lib/types.ts`
**Exports**:
```typescript
export type RepoData = { ... };
export type RepoStats = { ... };
export type ArchitectureInsight = { ... };
export type GotchaInsight = { ... };
export type ContributorGuideInsight = { ... };
export type DeploymentRunbookInsight = { ... };
export type CodingStandardsInsight = { ... };
export type AnalysisResult = { ... };
export type Playbook = { ... };
```

**Responsibilities**:
- Shared TypeScript types across codebase
- Prevent circular dependencies
- Provide IDE autocomplete

**Rationale**:
- Centralized types improve maintainability.
- Easier to refactor when types change.

---

## Environment Variables

### `.env.local` (gitignored)
```bash
# GitHub API Authentication (optional but recommended)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Analysis Configuration
MAX_FILES_TO_ANALYZE=50
ANALYSIS_TIMEOUT_MS=30000
```

### `.env.example` (committed to repo)
```bash
# GitHub API Authentication (optional but recommended)
# Get token from: https://github.com/settings/tokens
# Required scopes: public_repo (read-only)
GITHUB_TOKEN=

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Analysis Configuration
MAX_FILES_TO_ANALYZE=50
ANALYSIS_TIMEOUT_MS=30000
```

**Rationale**:
- `GITHUB_TOKEN`: Increases rate limit from 60 to 5000 requests/hour. Optional for development, required for production.
- `NEXT_PUBLIC_APP_URL`: Used for generating shareable result URLs.
- `MAX_FILES_TO_ANALYZE`: Prevents analysis from hanging on massive repos (>1000 files).
- `ANALYSIS_TIMEOUT_MS`: Ensures analysis completes within 30 seconds (user expectation).

---

## Tailwind Configuration

### `tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark developer-focused theme
        background: "#0a0a0a",      // Near-black background
        surface: "#1a1a1a",         // Card/panel background
        border: "#2a2a2a",          // Subtle borders
        accent: "#1aad7e",          // Teal accent (primary CTA)
        "accent-hover": "#15926a",  // Darker teal for hover
        text: {
          primary: "#e5e5e5",       // High-contrast text
          secondary: "#a3a3a3",     // Muted text
          tertiary: "#737373",      // Disabled/placeholder text
        },
        severity: {
          high: "#ef4444",          // Red for high-severity gotchas
          medium: "#f59e0b",        // Yellow for medium-severity
          low: "#3b82f6",           // Blue for low-severity
        },
        confidence: {
          high: "#10b981",          // Green for ≥0.8
          medium: "#f59e0b",        // Yellow for 0.6-0.79
          low: "#ef4444",           // Red for <0.6
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "code-sm": ["0.875rem", { lineHeight: "1.5" }],
        "code-base": ["1rem", { lineHeight: "1.5" }],
      },
      borderRadius: {
        card: "0.75rem",
        button: "0.5rem",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
```

**Rationale**:
- **Dark theme**: Developer-focused aesthetic, reduces eye strain during long analysis sessions.
- **Teal accent (#1aad7e)**: High contrast against dark background, stands out for CTAs.
- **JetBrains Mono**: Monospace font optimized for code readability, used for file paths and code snippets.
- **Semantic color naming**: `severity.*` and `confidence.*` make intent clear in components.
- **Custom shadows**: Subtle depth for cards without overwhelming dark theme.

---

## Implementation Sequence for Code Mode

When switching to Code mode, implement in this order:

### Phase 1: Foundation (Core Setup)
1. Initialize Next.js 14 project with TypeScript
2. Configure Tailwind CSS with custom theme
3. Set up project structure (create all directories)
4. Create `.env.example` and update `.gitignore`
5. Install dependencies: `octokit`, `zod`, `jspdf`, `marked`

### Phase 2: Type System & Validation
6. Create [`lib/types.ts`](lib/types.ts) with all TypeScript types
7. Create [`lib/validation.ts`](lib/validation.ts) with Zod schemas
8. Create [`lib/prompts.ts`](lib/prompts.ts) with analysis prompt templates

### Phase 3: GitHub Integration
9. Create [`lib/github.ts`](lib/github.ts) with API client
10. Create [`app/api/ingest/route.ts`](app/api/ingest/route.ts)
11. Test ingestion with sample repo (e.g., `vercel/next.js`)

### Phase 4: Analysis Pipeline
12. Create [`lib/analysis.ts`](lib/analysis.ts) with 6-step pipeline
13. Create [`app/api/analyse/route.ts`](app/api/analyse/route.ts)
14. Test analysis with ingested data

### Phase 5: UI Components (Bottom-Up)
15. Create [`components/ui/ConfidenceBadge.tsx`](components/ui/ConfidenceBadge.tsx)
16. Create [`components/ui/LoadingSkeleton.tsx`](components/ui/LoadingSkeleton.tsx)
17. Create [`components/ui/ErrorState.tsx`](components/ui/ErrorState.tsx)
18. Create [`components/ui/StatsBar.tsx`](components/ui/StatsBar.tsx)
19. Create [`components/ui/TabSwitcher.tsx`](components/ui/TabSwitcher.tsx)
20. Create [`components/ui/ExportButtons.tsx`](components/ui/ExportButtons.tsx)

### Phase 6: Card Components
21. Create [`components/cards/ArchitectureCard.tsx`](components/cards/ArchitectureCard.tsx)
22. Create [`components/cards/GotchasCard.tsx`](components/cards/GotchasCard.tsx)
23. Create [`components/cards/ContributorCard.tsx`](components/cards/ContributorCard.tsx)
24. Create [`components/cards/DeploymentCard.tsx`](components/cards/DeploymentCard.tsx)
25. Create [`components/cards/StandardsCard.tsx`](components/cards/StandardsCard.tsx)

### Phase 7: Pages
26. Create [`components/forms/RepoUrlForm.tsx`](components/forms/RepoUrlForm.tsx)
27. Create [`app/page.tsx`](app/page.tsx) (home page)
28. Create [`app/results/page.tsx`](app/results/page.tsx) (results dashboard)
29. Create [`app/layout.tsx`](app/layout.tsx) (root layout)
30. Create [`app/globals.css`](app/globals.css) (Tailwind directives)

### Phase 8: Export Functionality
31. Create [`lib/export.ts`](lib/export.ts) with PDF/Markdown generators
32. Create [`app/api/export/pdf/route.ts`](app/api/export/pdf/route.ts)
33. Create [`app/api/export/markdown/route.ts`](app/api/export/markdown/route.ts)

### Phase 9: Polish & Testing
34. Add JetBrains Mono font to [`public/fonts/`](public/fonts/)
35. Create [`README.md`](README.md) with setup instructions
36. Test full flow: URL input → ingestion → analysis → card display → export
37. Fix any TypeScript errors or linting issues
38. Commit to `develop` branch with conventional commit message

---

## Key Design Decisions

### 1. No Database
**Decision**: All analysis is ephemeral (no persistence).
**Rationale**: Hackathon constraint. Simplifies architecture and deployment. Users can export results as PDF/Markdown for persistence.

### 2. Sequential Analysis Pipeline
**Decision**: 6 steps run sequentially, not in parallel.
**Rationale**: Each step depends on previous results (e.g., gotchas need architecture context). Parallelization would complicate error handling.

### 3. Tab-Based Card Navigation
**Decision**: Show one card at a time with tab switcher.
**Rationale**: 5 cards as vertical scroll would overwhelm users. Tabs keep focus on one analysis aspect at a time.

### 4. Confidence Scoring
**Decision**: Every insight includes confidence score (0.0-1.0).
**Rationale**: Judges value transparency. Low-confidence insights flagged with ⚠️ encourage manual verification.

### 5. Minimum 3 Gotchas
**Decision**: Analysis must produce at least 3 gotchas.
**Rationale**: Gotchas are most valuable for judges. Enforcing minimum ensures quality output.

### 6. Dark Developer Theme
**Decision**: Dark background (#0a0a0a) with teal accent (#1aad7e).
**Rationale**: Developer-focused aesthetic. Reduces eye strain. Teal provides high contrast for CTAs.

### 7. JetBrains Mono Font
**Decision**: Monospace font for all code/file paths.
**Rationale**: Optimized for code readability. Familiar to developers. Improves visual hierarchy.

### 8. Stateless API Routes
**Decision**: No in-memory caching, no session state.
**Rationale**: Simplifies deployment. Each request is independent. Easier to debug.

### 9. GitHub Token Optional
**Decision**: App works without token (60 req/hour), but token recommended (5000 req/hour).
**Rationale**: Lowers barrier to entry for judges. Production deployment requires token.

### 10. 30-Second Analysis Timeout
**Decision**: Analysis must complete in 30 seconds or fail.
**Rationale**: User expectation for "instant" results. Prevents hanging on massive repos.

---

## Mermaid Diagrams

### Data Flow Architecture
```mermaid
graph TD
    A[User pastes GitHub URL] --> B[Home Page]
    B --> C[POST /api/ingest]
    C --> D[GitHub REST API]
    D --> E[Repo Content + Stats]
    E --> F[Results Page]
    F --> G[POST /api/analyse]
    G --> H[6-Step Analysis Pipeline]
    H --> I[Architecture Detection]
    I --> J[Gotchas Identification]
    J --> K[Contributor Guide]
    K --> L[Deployment Runbook]
    L --> M[Coding Standards]
    M --> N[Playbook Assembly]
    N --> O[Analysis Results]
    O --> P[Card Display]
    P --> Q[User clicks Export]
    Q --> R[POST /api/export/pdf or /markdown]
    R --> S[Download Playbook]
```

### Component Hierarchy
```mermaid
graph TD
    A[app/layout.tsx] --> B[app/page.tsx Home]
    A --> C[app/results/page.tsx Results]
    B --> D[components/forms/RepoUrlForm.tsx]
    B --> E[components/ui/ErrorState.tsx]
    C --> F[components/ui/StatsBar.tsx]
    C --> G[components/ui/TabSwitcher.tsx]
    C --> H[components/ui/LoadingSkeleton.tsx]
    C --> I[components/ui/ExportButtons.tsx]
    C --> J[Card Components]
    J --> K[components/cards/ArchitectureCard.tsx]
    J --> L[components/cards/GotchasCard.tsx]
    J --> M[components/cards/ContributorCard.tsx]
    J --> N[components/cards/DeploymentCard.tsx]
    J --> O[components/cards/StandardsCard.tsx]
    K --> P[components/ui/ConfidenceBadge.tsx]
    L --> P
    M --> P
    N --> P
    O --> P
```

### Analysis Pipeline Flow
```mermaid
sequenceDiagram
    participant User
    participant Results Page
    participant API Analyse
    participant Analysis Pipeline
    participant GitHub Data

    User->>Results Page: View analysis
    Results Page->>API Analyse: POST repo data
    API Analyse->>Analysis Pipeline: Start 6-step pipeline
    Analysis Pipeline->>GitHub Data: Read files + README
    Analysis Pipeline->>Analysis Pipeline: Step 1 Architecture
    Analysis Pipeline->>Analysis Pipeline: Step 2 Gotchas min 3
    Analysis Pipeline->>Analysis Pipeline: Step 3 Contributor Guide
    Analysis Pipeline->>Analysis Pipeline: Step 4 Deployment Runbook
    Analysis Pipeline->>Analysis Pipeline: Step 5 Coding Standards
    Analysis Pipeline->>Analysis Pipeline: Step 6 Assemble Playbook
    Analysis Pipeline->>API Analyse: Return structured insights
    API Analyse->>Results Page: JSON response
    Results Page->>User: Display cards with confidence scores
```

---

## Next Steps

This plan is complete and ready for implementation. Once approved:

1. Switch to Code mode
2. Follow implementation sequence (Phase 1-9)
3. Test each phase before proceeding
4. Commit to `develop` branch after each working feature
5. Run `/review` before final merge to `main`

All architectural decisions are documented with rationale. All components have clear responsibilities. All API routes have defined schemas. Ready to build.