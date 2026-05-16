// Analysis prompt templates for AI-powered insights
// TODO: Refine prompts based on testing

export const ARCHITECTURE_PROMPT = `
Analyze the repository structure and identify:
1. Primary framework/technology stack
2. Architecture patterns (MVC, microservices, monolith, etc.)
3. Key dependencies and their purposes

Provide confidence score (0.0-1.0) based on evidence found.
Cite specific file paths as evidence.
`;

export const GOTCHAS_PROMPT = `
Identify potential pitfalls, gotchas, and common issues in this codebase.
Focus on:
1. Configuration complexity
2. Deprecated dependencies
3. Non-obvious setup requirements
4. Performance bottlenecks
5. Security concerns

MUST provide minimum 3 gotchas.
Each gotcha must include:
- Title (concise)
- Description (max 3 sentences)
- Severity (high/medium/low)
- File path (real path from repo)
- Confidence score (0.0-1.0)
`;

export const CONTRIBUTOR_PROMPT = `
Generate a contributor guide based on repository analysis:
1. Setup steps (installation, dependencies, environment)
2. Testing strategy (how to run tests, coverage expectations)
3. PR process (branch naming, commit conventions, review process)

Provide confidence score based on evidence found in CONTRIBUTING.md, README.md, or inferred from code.
`;

export const DEPLOYMENT_PROMPT = `
Generate a deployment runbook:
1. Build command (npm run build, etc.)
2. Required environment variables
3. Deployment steps (platform-specific if detected)

Provide confidence score based on evidence found in deployment configs, CI/CD files, or package.json scripts.
`;

export const STANDARDS_PROMPT = `
Detect coding standards and conventions:
1. Linter configuration (ESLint, Prettier, etc.)
2. Formatter configuration
3. Code conventions (naming, structure, patterns)

Provide confidence score based on config files found (.eslintrc, .prettierrc, etc.).
`;

// Made with Bob
