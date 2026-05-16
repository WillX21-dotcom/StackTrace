// TypeScript type definitions for StackTrace

export type RepoData = {
  owner: string;
  repo: string;
  defaultBranch: string;
  stats: RepoStats;
  files: RepoFile[];
  readme: string | null;
};

export type RepoStats = {
  stars: number;
  forks: number;
  language: string;
  size: number; // KB
};

export type RepoFile = {
  path: string;
  content: string;
  size: number;
};

export type ArchitectureInsight = {
  framework: string;
  patterns: string[];
  dependencies: string[];
  communicationPattern: string; // e.g., "Pub/Sub via /events", "REST API", "GraphQL"
  confidence: number;
};

export type GotchaInsight = {
  issueId: string; // Unique ID: e.g., "AUTH-BYPASS-MIDDLEWARE-TS"
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  filePath: string;
  lineNumber?: number; // Specific line where issue exists
  sourceEvidence: string; // Code snippet or specific evidence from the repo
  customFix: string; // Tailored fix for this repo's coding style
  confidence: number;
};

export type ContributorGuideInsight = {
  setupSteps: string[];
  testingStrategy: string;
  prProcess: string;
  confidence: number;
};

export type DeploymentRunbookInsight = {
  buildCommand: string;
  envVars: string[];
  deploymentSteps: string[];
  confidence: number;
};

export type CodingStandardsInsight = {
  linter: string | null;
  formatter: string | null;
  conventions: string[];
  sourceEvidence: string; // Evidence of conventions from actual code
  confidence: number;
};

export type PlaybookSummary = {
  overallConfidence: number;
  readyForOnboarding: boolean;
  missingInfo: string[];
  strengths: string[];
};

export type AnalysisResult = {
  architecture: ArchitectureInsight;
  gotchas: GotchaInsight[];
  contributorGuide: ContributorGuideInsight;
  deploymentRunbook: DeploymentRunbookInsight;
  codingStandards: CodingStandardsInsight;
  playbook: PlaybookSummary;
};

export type Playbook = {
  repoName: string;
  analysisDate: string;
  content: AnalysisResult;
};

// Made with Bob
