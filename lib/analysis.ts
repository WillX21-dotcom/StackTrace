// Analysis pipeline for StackTrace - 6-step repo analysis
import { RepoContent } from "./github";
import {
  ArchitectureInsight,
  GotchaInsight,
  ContributorGuideInsight,
  DeploymentRunbookInsight,
  CodingStandardsInsight,
  AnalysisResult,
} from "./types";
import {
  architecturePrompt,
  gotchasPrompt,
  contributorGuidePrompt,
  deploymentPrompt,
  codingStandardsPrompt,
  assemblePlaybookPrompt,
} from "./prompts";
import {
  ArchitectureSchema,
  GotchasArraySchema,
  ContributorGuideSchema,
  DeploymentRunbookSchema,
  CodingStandardsSchema,
  PlaybookSummarySchema,
  parseAndValidate,
  flagLowConfidence,
} from "./schemas";

/**
 * Analysis engine interface
 * This is a placeholder - in production, this would call an LLM API
 *
 * PRODUCTION INTEGRATION NOTES:
 * - Replace with OpenAI, Anthropic Claude, or other LLM API
 * - Ensure prompts enforce evidence-based analysis
 * - Validate that responses include required fields (issueId, sourceEvidence, etc.)
 * - Set temperature low (0.2-0.3) for consistent, factual output
 * - Use structured output mode if available (e.g., OpenAI JSON mode)
 */
async function callAnalysisEngine(prompt: string): Promise<string> {
  // TODO: Replace with actual LLM API call
  console.log("StackTrace Analysis Engine - Prompt length:", prompt.length);
  
  // Example integration (uncomment and configure):
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4-turbo-preview",
  //   messages: [{ role: "user", content: prompt }],
  //   temperature: 0.2,
  //   response_format: { type: "json_object" }
  // });
  // return response.choices[0].message.content;
  
  throw new Error(
    "StackTrace Analysis Engine not configured. Set up LLM API integration in lib/analysis.ts"
  );
}

/**
 * Step 1: Analyze Architecture
 * Identifies framework, patterns, and dependencies
 */
export async function analyzeArchitecture(
  repoContent: RepoContent
): Promise<ArchitectureInsight> {
  const prompt = architecturePrompt(repoContent);
  const response = await callAnalysisEngine(prompt);
  
  const architecture = parseAndValidate(
    response,
    ArchitectureSchema,
    "Architecture analysis"
  );
  
  return flagLowConfidence(architecture);
}

/**
 * Step 2: Identify Gotchas
 * Finds non-obvious pitfalls and issues
 */
export async function identifyGotchas(
  repoContent: RepoContent,
  architecture: ArchitectureInsight
): Promise<GotchaInsight[]> {
  const prompt = gotchasPrompt(repoContent, architecture);
  const response = await callAnalysisEngine(prompt);
  
  const gotchas = parseAndValidate(
    response,
    GotchasArraySchema,
    "Gotchas analysis"
  );
  
  return gotchas.map(flagLowConfidence);
}

/**
 * Step 3: Generate Contributor Guide
 * Creates setup steps, testing strategy, and PR process
 */
export async function generateContributorGuide(
  repoContent: RepoContent,
  architecture: ArchitectureInsight,
  gotchas: GotchaInsight[]
): Promise<ContributorGuideInsight> {
  const prompt = contributorGuidePrompt(repoContent, architecture, gotchas);
  const response = await callAnalysisEngine(prompt);
  
  const guide = parseAndValidate(
    response,
    ContributorGuideSchema,
    "Contributor guide analysis"
  );
  
  return flagLowConfidence(guide);
}

/**
 * Step 4: Generate Deployment Runbook
 * Creates build commands, env vars, and deployment steps
 */
export async function generateDeploymentRunbook(
  repoContent: RepoContent,
  architecture: ArchitectureInsight,
  contributorGuide: ContributorGuideInsight
): Promise<DeploymentRunbookInsight> {
  const prompt = deploymentPrompt(repoContent, architecture, contributorGuide);
  const response = await callAnalysisEngine(prompt);
  
  const runbook = parseAndValidate(
    response,
    DeploymentRunbookSchema,
    "Deployment runbook analysis"
  );
  
  return flagLowConfidence(runbook);
}

/**
 * Step 5: Detect Coding Standards
 * Identifies linter, formatter, and conventions
 */
export async function detectCodingStandards(
  repoContent: RepoContent,
  architecture: ArchitectureInsight
): Promise<CodingStandardsInsight> {
  const prompt = codingStandardsPrompt(repoContent, architecture);
  const response = await callAnalysisEngine(prompt);
  
  const standards = parseAndValidate(
    response,
    CodingStandardsSchema,
    "Coding standards analysis"
  );
  
  return flagLowConfidence(standards);
}

/**
 * Step 6: Assemble Playbook
 * Synthesizes all cards into a cohesive summary
 */
export async function assemblePlaybook(
  repoContent: RepoContent,
  architecture: ArchitectureInsight,
  gotchas: GotchaInsight[],
  contributorGuide: ContributorGuideInsight,
  deployment: DeploymentRunbookInsight,
  codingStandards: CodingStandardsInsight
): Promise<{
  overallConfidence: number;
  readyForOnboarding: boolean;
  missingInfo: string[];
  strengths: string[];
}> {
  const prompt = assemblePlaybookPrompt(
    repoContent,
    architecture,
    gotchas,
    contributorGuide,
    deployment,
    codingStandards
  );
  const response = await callAnalysisEngine(prompt);
  
  const playbook = parseAndValidate(
    response,
    PlaybookSummarySchema,
    "Playbook assembly"
  );
  
  return playbook;
}

/**
 * Progress callback type for streaming updates
 */
export type ProgressCallback = (step: string, progress: number) => void;

/**
 * Run Full Analysis Pipeline
 * Executes all 6 steps in sequence with optional progress callbacks
 */
export async function runFullAnalysis(
  repoContent: RepoContent,
  onProgress?: ProgressCallback
): Promise<AnalysisResult & { playbook: any }> {
  try {
    // Step 1: Architecture (16.7% progress)
    onProgress?.("Analyzing architecture...", 16.7);
    const architecture = await analyzeArchitecture(repoContent);
    
    // Step 2: Gotchas (33.3% progress)
    onProgress?.("Finding gotchas...", 33.3);
    const gotchas = await identifyGotchas(repoContent, architecture);
    
    // Step 3: Contributor Guide (50% progress)
    onProgress?.("Generating contributor guide...", 50);
    const contributorGuide = await generateContributorGuide(
      repoContent,
      architecture,
      gotchas
    );
    
    // Step 4: Deployment Runbook (66.7% progress)
    onProgress?.("Creating deployment runbook...", 66.7);
    const deploymentRunbook = await generateDeploymentRunbook(
      repoContent,
      architecture,
      contributorGuide
    );
    
    // Step 5: Coding Standards (83.3% progress)
    onProgress?.("Detecting coding standards...", 83.3);
    const codingStandards = await detectCodingStandards(
      repoContent,
      architecture
    );
    
    // Step 6: Assemble Playbook (100% progress)
    onProgress?.("Assembling playbook...", 100);
    const playbook = await assemblePlaybook(
      repoContent,
      architecture,
      gotchas,
      contributorGuide,
      deploymentRunbook,
      codingStandards
    );
    
    return {
      architecture,
      gotchas,
      contributorGuide,
      deploymentRunbook,
      codingStandards,
      playbook,
    };
  } catch (error) {
    // Re-throw with context about which step failed
    if (error instanceof Error) {
      throw new Error(`Analysis pipeline failed: ${error.message}`);
    }
    throw error;
  }
}

// Made with Bob
