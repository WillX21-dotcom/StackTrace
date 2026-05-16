// Prompt builder functions for StackTrace 6-step analysis pipeline
import { RepoContent } from "./github";
import {
  ArchitectureInsight,
  GotchaInsight,
  ContributorGuideInsight,
  DeploymentRunbookInsight,
  CodingStandardsInsight,
} from "./types";

/**
 * Step 1: Architecture Analysis Prompt
 * Analyzes framework, patterns, and dependencies
 */
export function architecturePrompt(repoContent: RepoContent): string {
  const { owner, repo, packageManifest, sourceFiles, fileTree } = repoContent;

  const sourceFilesList = sourceFiles
    .map((f) => `- ${f.path} (${f.size} bytes)`)
    .join("\n");

  const manifestContent = packageManifest.content
    ? `\n## Package Manifest (${packageManifest.type})\n\`\`\`\n${packageManifest.content}\n\`\`\``
    : "";

  const sampleSourceCode = sourceFiles
    .slice(0, 2)
    .map((f) => `\n## ${f.path}\n\`\`\`\n${f.content.slice(0, 1000)}\n\`\`\``)
    .join("\n");

  return `You are analyzing the architecture of ${owner}/${repo}.

# Repository Context
File tree depth: ${fileTree.length} files
Key source files:
${sourceFilesList}
${manifestContent}
${sampleSourceCode}

# Task
Analyze the repository architecture and provide a JSON response with:
1. framework: The primary framework/runtime (e.g., "Next.js 14", "Django", "Express")
2. patterns: Array of architectural patterns detected (e.g., ["MVC", "REST API", "Server Components"])
3. dependencies: Array of key dependencies from package manifest
4. confidence: Float 0.0-1.0 indicating analysis confidence

# Guardrails
- ONLY cite real file paths visible in the file tree above
- Never invent file paths or dependencies not in the manifest
- If confidence < 0.6, explain why in a comment field
- Keep framework name specific with version if detectable
- Limit patterns to 3-5 most significant ones
- Limit dependencies to 5-8 most critical ones

# Output Format
Return ONLY valid JSON (no markdown fences):
{
  "framework": "string",
  "patterns": ["string"],
  "dependencies": ["string"],
  "confidence": 0.0
}`;
}

/**
 * Step 2: Gotchas Analysis Prompt
 * Identifies potential pitfalls and non-obvious issues
 */
export function gotchasPrompt(
  repoContent: RepoContent,
  architecture: ArchitectureInsight
): string {
  const { owner, repo, sourceFiles, dockerfile, envExample, workflows } = repoContent;

  const workflowsList = workflows.length > 0
    ? workflows.map((w) => `- ${w.path}`).join("\n")
    : "None";

  const envVars = envExample
    ? `\n## Environment Variables (.env.example)\n\`\`\`\n${envExample}\n\`\`\``
    : "";

  const dockerContent = dockerfile
    ? `\n## Dockerfile\n\`\`\`\n${dockerfile.slice(0, 500)}\n\`\`\``
    : "";

  return `You are identifying gotchas (non-obvious pitfalls) in ${owner}/${repo}.

# Architecture Context
Framework: ${architecture.framework}
Patterns: ${architecture.patterns.join(", ")}
Dependencies: ${architecture.dependencies.join(", ")}

# Repository Context
Workflows:
${workflowsList}
${envVars}
${dockerContent}

# Task
Identify 3-5 gotchas (non-obvious issues that could trip up new developers).
For each gotcha provide:
1. title: Short descriptive title (max 8 words)
2. description: What the issue is and why it matters (max 3 sentences)
3. severity: "high" | "medium" | "low"
4. filePath: Real file path where this gotcha exists
5. confidence: Float 0.0-1.0

# Guardrails
- MINIMUM 3 gotchas required (judges' rubric requirement)
- ONLY cite real file paths from the repository
- Focus on non-obvious issues (not basic setup steps)
- Prioritize: missing env vars, deployment gotchas, dependency conflicts, framework-specific pitfalls
- Never invent file paths - if unsure, use the closest real path
- If confidence < 0.6, flag with ⚠️ in description

# Output Format
Return ONLY valid JSON (no markdown fences):
[
  {
    "title": "string",
    "description": "string",
    "severity": "high",
    "filePath": "string",
    "confidence": 0.0
  }
]`;
}

/**
 * Step 3: Contributor Guide Prompt
 * Generates setup steps, testing strategy, and PR process
 */
export function contributorGuidePrompt(
  repoContent: RepoContent,
  architecture: ArchitectureInsight,
  gotchas: GotchaInsight[]
): string {
  const { owner, repo, readme, packageManifest, workflows } = repoContent;

  const readmeSnippet = readme
    ? `\n## README.md (excerpt)\n\`\`\`\n${readme.slice(0, 1500)}\n\`\`\``
    : "";

  const testWorkflows = workflows.filter((w) =>
    w.path.toLowerCase().includes("test") || w.content.toLowerCase().includes("test")
  );

  const testingContext = testWorkflows.length > 0
    ? `\nTest workflows found: ${testWorkflows.map((w) => w.path).join(", ")}`
    : "";

  return `You are creating a contributor guide for ${owner}/${repo}.

# Architecture Context
Framework: ${architecture.framework}
Dependencies: ${architecture.dependencies.join(", ")}

# Known Gotchas
${gotchas.map((g) => `- ${g.title} (${g.severity})`).join("\n")}
${readmeSnippet}
${testingContext}

# Task
Generate a contributor guide with:
1. setupSteps: Array of setup commands/steps (5-8 steps)
2. testingStrategy: Description of how to run tests (2-3 sentences)
3. prProcess: Description of PR workflow (2-3 sentences)
4. confidence: Float 0.0-1.0

# Guardrails
- Base setup steps on package manifest type (npm/pip/go)
- Include environment setup from known gotchas
- If no test workflows found, suggest basic testing approach
- Keep each setup step actionable (command or clear instruction)
- Reference real file paths where applicable
- If confidence < 0.6, note what information is missing

# Output Format
Return ONLY valid JSON (no markdown fences):
{
  "setupSteps": ["string"],
  "testingStrategy": "string",
  "prProcess": "string",
  "confidence": 0.0
}`;
}

/**
 * Step 4: Deployment Runbook Prompt
 * Generates build commands, env vars, and deployment steps
 */
export function deploymentPrompt(
  repoContent: RepoContent,
  architecture: ArchitectureInsight,
  contributorGuide: ContributorGuideInsight
): string {
  const { owner, repo, dockerfile, envExample, workflows, packageManifest } = repoContent;

  const deployWorkflows = workflows.filter((w) =>
    w.path.toLowerCase().includes("deploy") ||
    w.path.toLowerCase().includes("release") ||
    w.content.toLowerCase().includes("deploy")
  );

  const deployContext = deployWorkflows.length > 0
    ? `\n## Deployment Workflows\n${deployWorkflows.map((w) => `- ${w.path}`).join("\n")}`
    : "";

  const dockerContext = dockerfile
    ? `\n## Dockerfile Present\nDocker-based deployment detected`
    : "";

  const envVarsList = envExample
    ? envExample.split("\n").filter((line) => line.includes("=")).map((line) => line.split("=")[0])
    : [];

  return `You are creating a deployment runbook for ${owner}/${repo}.

# Architecture Context
Framework: ${architecture.framework}
Package Manager: ${packageManifest.type || "unknown"}
${deployContext}
${dockerContext}

# Environment Variables Detected
${envVarsList.length > 0 ? envVarsList.join(", ") : "None found"}

# Task
Generate a deployment runbook with:
1. buildCommand: The command to build for production
2. envVars: Array of required environment variables
3. deploymentSteps: Array of deployment steps (4-6 steps)
4. confidence: Float 0.0-1.0

# Guardrails
- Build command must match the framework (e.g., "npm run build" for Node.js)
- Include all env vars from .env.example
- If Dockerfile exists, include Docker deployment steps
- If CI/CD workflows exist, reference them
- Keep deployment steps sequential and actionable
- If confidence < 0.6, note what deployment info is missing

# Output Format
Return ONLY valid JSON (no markdown fences):
{
  "buildCommand": "string",
  "envVars": ["string"],
  "deploymentSteps": ["string"],
  "confidence": 0.0
}`;
}

/**
 * Step 5: Coding Standards Prompt
 * Detects linter, formatter, and coding conventions
 */
export function codingStandardsPrompt(
  repoContent: RepoContent,
  architecture: ArchitectureInsight
): string {
  const { owner, repo, fileTree, packageManifest, sourceFiles } = repoContent;

  const configFiles = fileTree
    .filter((f) =>
      f.path.includes("eslint") ||
      f.path.includes("prettier") ||
      f.path.includes("tsconfig") ||
      f.path.includes(".editorconfig") ||
      f.path.includes("pylint") ||
      f.path.includes("black") ||
      f.path.includes("golangci")
    )
    .map((f) => f.path);

  const configFilesList = configFiles.length > 0
    ? configFiles.join(", ")
    : "None detected";

  const sampleCode = sourceFiles[0]
    ? `\n## Sample Code (${sourceFiles[0].path})\n\`\`\`\n${sourceFiles[0].content.slice(0, 800)}\n\`\`\``
    : "";

  return `You are detecting coding standards for ${owner}/${repo}.

# Architecture Context
Framework: ${architecture.framework}

# Config Files Detected
${configFilesList}

# Package Manifest
${packageManifest.content ? packageManifest.content.slice(0, 500) : "Not found"}
${sampleCode}

# Task
Detect coding standards with:
1. linter: Name of linter (e.g., "ESLint", "Pylint") or null
2. formatter: Name of formatter (e.g., "Prettier", "Black") or null
3. conventions: Array of detected conventions (3-5 items)
4. confidence: Float 0.0-1.0

# Guardrails
- Check package.json scripts for linter/formatter
- Check for config files (.eslintrc, .prettierrc, etc.)
- Infer conventions from sample code (indentation, quotes, semicolons)
- If no linter/formatter found, set to null (not empty string)
- Conventions should be specific (e.g., "2-space indentation", "single quotes")
- If confidence < 0.6, note what standards info is missing

# Output Format
Return ONLY valid JSON (no markdown fences):
{
  "linter": "string or null",
  "formatter": "string or null",
  "conventions": ["string"],
  "confidence": 0.0
}`;
}

/**
 * Step 6: Assemble Playbook Prompt
 * Synthesizes all previous cards into a cohesive team playbook
 */
export function assemblePlaybookPrompt(
  repoContent: RepoContent,
  architecture: ArchitectureInsight,
  gotchas: GotchaInsight[],
  contributorGuide: ContributorGuideInsight,
  deployment: DeploymentRunbookInsight,
  codingStandards: CodingStandardsInsight
): string {
  const { owner, repo } = repoContent;

  return `You are assembling a team playbook for ${owner}/${repo}.

# All Analysis Cards
## Architecture
Framework: ${architecture.framework}
Patterns: ${architecture.patterns.join(", ")}
Confidence: ${architecture.confidence}

## Gotchas (${gotchas.length} found)
${gotchas.map((g) => `- ${g.title} (${g.severity})`).join("\n")}

## Contributor Guide
Setup Steps: ${contributorGuide.setupSteps.length} steps
Testing: ${contributorGuide.testingStrategy.slice(0, 100)}...
Confidence: ${contributorGuide.confidence}

## Deployment
Build: ${deployment.buildCommand}
Env Vars: ${deployment.envVars.length} required
Confidence: ${deployment.confidence}

## Coding Standards
Linter: ${codingStandards.linter || "None"}
Formatter: ${codingStandards.formatter || "None"}
Confidence: ${codingStandards.confidence}

# Task
Review all cards and return a summary object with:
1. overallConfidence: Average confidence across all cards
2. readyForOnboarding: Boolean - are all cards confidence >= 0.6?
3. missingInfo: Array of strings describing what info is low-confidence or missing
4. strengths: Array of 2-3 strings describing what was well-documented

# Guardrails
- Calculate overallConfidence as mean of all card confidences
- Set readyForOnboarding to false if any card < 0.6 confidence
- Be specific in missingInfo (e.g., "No test documentation found")
- Strengths should highlight what makes this repo easy to onboard to

# Output Format
Return ONLY valid JSON (no markdown fences):
{
  "overallConfidence": 0.0,
  "readyForOnboarding": false,
  "missingInfo": ["string"],
  "strengths": ["string"]
}`;
}

// Made with Bob
