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
 * API Configuration
 */
const BOB_API_KEY = process.env.BOB_API_KEY;
const BOB_API_URL = process.env.BOB_API_URL || "https://api.bob.build/v1/chat/completions";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent";

/**
 * Gemini Fallback Engine
 * Uses Google's Gemini 1.5 Flash model as emergency fallback
 */
async function callGeminiEngine(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add your Gemini API key to .env.local"
    );
  }

  console.log("🔄 Fallback: Using Gemini 1.5 Flash engine");

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `You are StackTrace, an expert code analyst. You provide evidence-based, repo-specific analysis. Always return valid JSON without markdown fences.\n\n${prompt}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gemini API request failed (${response.status}): ${errorText}`
    );
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error("Invalid response format from Gemini API");
  }

  return data.candidates[0].content.parts[0].text;
}

/**
 * Primary Analysis Engine using Bob API with Gemini Fallback
 * Sends prompts to Bob's LLM and returns structured JSON responses
 * Automatically falls back to Gemini if Bob fails
 */
async function callAnalysisEngine(prompt: string): Promise<string> {
  // Try Bob API first
  if (BOB_API_KEY) {
    try {
      const response = await fetch(BOB_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${BOB_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4-turbo-preview",
          messages: [
            {
              role: "system",
              content: "You are StackTrace, an expert code analyst. You provide evidence-based, repo-specific analysis. Always return valid JSON without markdown fences."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.2,
          response_format: { type: "json_object" }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Bob API request failed (${response.status}): ${errorText}`
        );
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Invalid response format from Bob API");
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error("⚠️ Bob API failed, falling back to Gemini:", error instanceof Error ? error.message : "Unknown error");
      
      // Fallback to Gemini
      if (GEMINI_API_KEY) {
        return await callGeminiEngine(prompt);
      }
      
      // No fallback available
      throw new Error(
        `Bob API failed and no fallback available. Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  // No Bob API key, try Gemini directly
  if (GEMINI_API_KEY) {
    console.log("ℹ️ BOB_API_KEY not configured, using Gemini engine");
    return await callGeminiEngine(prompt);
  }

  // No API keys configured
  throw new Error(
    "No API keys configured. Add BOB_API_KEY or GEMINI_API_KEY to .env.local"
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
