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
  confidence: number;
};

export type GotchaInsight = {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  filePath: string;
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
