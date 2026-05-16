// Zod validation schemas for StackTrace analysis pipeline
import { z } from "zod";

/**
 * Architecture Card Schema
 * Validates framework, patterns, and dependencies analysis
 */
export const ArchitectureSchema = z.object({
  framework: z.string().min(1, "Framework is required"),
  patterns: z
    .array(z.string())
    .min(1, "At least one pattern required")
    .max(10, "Maximum 10 patterns allowed"),
  dependencies: z
    .array(z.string())
    .min(1, "At least one dependency required")
    .max(15, "Maximum 15 dependencies allowed"),
  communicationPattern: z
    .string()
    .min(10, "Communication pattern must describe actual repo structure")
    .max(200, "Communication pattern must be at most 200 characters"),
  confidence: z
    .number()
    .min(0, "Confidence must be >= 0")
    .max(1, "Confidence must be <= 1"),
  low_confidence: z.boolean().optional(),
});

/**
 * Gotcha Card Schema
 * Validates individual gotcha insights
 */
export const GotchaSchema = z.object({
  issueId: z
    .string()
    .min(5, "Issue ID is required")
    .regex(/^[A-Z]+-[A-Z]+-[A-Z0-9-]+$/i, "Issue ID must follow pattern: CATEGORY-TYPE-FILE"),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  severity: z.enum(["high", "medium", "low"], {
    errorMap: () => ({ message: "Severity must be high, medium, or low" }),
  }),
  filePath: z.string().min(1, "File path is required"),
  lineNumber: z.number().int().positive().optional(),
  sourceEvidence: z
    .string()
    .min(10, "Source evidence is required - must cite actual code from the repository")
    .max(1000, "Source evidence must be at most 1000 characters"),
  customFix: z
    .string()
    .min(20, "Custom fix is required - must be tailored to this repo's coding style")
    .max(800, "Custom fix must be at most 800 characters"),
  confidence: z
    .number()
    .min(0, "Confidence must be >= 0")
    .max(1, "Confidence must be <= 1")
    .refine(
      (val) => val >= 0.4,
      "Confidence must be >= 0.4 when source evidence is provided"
    ),
  low_confidence: z.boolean().optional(),
});

/**
 * Gotchas Array Schema
 * Enforces minimum 3 gotchas requirement
 */
export const GotchasArraySchema = z
  .array(GotchaSchema)
  .min(3, "Minimum 3 gotchas required (judges' rubric)")
  .max(10, "Maximum 10 gotchas allowed");

/**
 * Contributor Guide Card Schema
 * Validates setup steps, testing strategy, and PR process
 */
export const ContributorGuideSchema = z.object({
  setupSteps: z
    .array(z.string().min(1))
    .min(3, "At least 3 setup steps required")
    .max(12, "Maximum 12 setup steps allowed"),
  testingStrategy: z
    .string()
    .min(10, "Testing strategy must be at least 10 characters")
    .max(500, "Testing strategy must be at most 500 characters"),
  prProcess: z
    .string()
    .min(10, "PR process must be at least 10 characters")
    .max(500, "PR process must be at most 500 characters"),
  confidence: z
    .number()
    .min(0, "Confidence must be >= 0")
    .max(1, "Confidence must be <= 1"),
  low_confidence: z.boolean().optional(),
});

/**
 * Deployment Runbook Card Schema
 * Validates build command, env vars, and deployment steps
 */
export const DeploymentRunbookSchema = z.object({
  buildCommand: z
    .string()
    .min(1, "Build command is required")
    .max(200, "Build command must be at most 200 characters"),
  envVars: z
    .array(z.string().min(1))
    .min(0, "Env vars array required (can be empty)")
    .max(30, "Maximum 30 env vars allowed"),
  deploymentSteps: z
    .array(z.string().min(1))
    .min(3, "At least 3 deployment steps required")
    .max(15, "Maximum 15 deployment steps allowed"),
  confidence: z
    .number()
    .min(0, "Confidence must be >= 0")
    .max(1, "Confidence must be <= 1"),
  low_confidence: z.boolean().optional(),
});

/**
 * Coding Standards Card Schema
 * Validates linter, formatter, and conventions
 */
export const CodingStandardsSchema = z.object({
  linter: z.string().nullable(),
  formatter: z.string().nullable(),
  conventions: z
    .array(z.string().min(1))
    .min(1, "At least 1 convention required")
    .max(10, "Maximum 10 conventions allowed"),
  sourceEvidence: z
    .string()
    .min(10, "Source evidence is required - must cite actual code patterns")
    .max(1000, "Source evidence must be at most 1000 characters"),
  confidence: z
    .number()
    .min(0, "Confidence must be >= 0")
    .max(1, "Confidence must be <= 1")
    .refine(
      (val) => val >= 0.4,
      "Confidence must be >= 0.4 when source evidence is provided"
    ),
  low_confidence: z.boolean().optional(),
});

/**
 * Playbook Summary Schema
 * Validates the final playbook assembly
 */
export const PlaybookSummarySchema = z.object({
  overallConfidence: z
    .number()
    .min(0, "Overall confidence must be >= 0")
    .max(1, "Overall confidence must be <= 1"),
  readyForOnboarding: z.boolean(),
  missingInfo: z
    .array(z.string())
    .min(0, "Missing info array required (can be empty)")
    .max(10, "Maximum 10 missing info items"),
  strengths: z
    .array(z.string())
    .min(0, "Strengths array required (can be empty)")
    .max(5, "Maximum 5 strengths"),
});

/**
 * Complete Analysis Result Schema
 * Validates the full analysis output with all cards
 */
export const AnalysisResultSchema = z.object({
  architecture: ArchitectureSchema,
  gotchas: GotchasArraySchema,
  contributorGuide: ContributorGuideSchema,
  deploymentRunbook: DeploymentRunbookSchema,
  codingStandards: CodingStandardsSchema,
  playbook: PlaybookSummarySchema,
});

/**
 * Helper function to add low_confidence flag to any card field
 */
export function flagLowConfidence<T extends { confidence: number }>(
  card: T
): T & { low_confidence?: boolean } {
  if (card.confidence < 0.6) {
    return { ...card, low_confidence: true };
  }
  return card;
}

/**
 * Helper function to parse and validate JSON response from analysis
 * Throws descriptive error if JSON is invalid or doesn't match schema
 */
export function parseAndValidate<T>(
  jsonString: string,
  schema: z.ZodSchema<T>,
  stepName: string
): T {
  try {
    // Remove markdown code fences if present (common LLM mistake)
    const cleanJson = jsonString
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(cleanJson);
    const validated = schema.parse(parsed);
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
      throw new Error(`${stepName} validation failed: ${issues}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`${stepName} returned invalid JSON: ${error.message}`);
    }
    throw error;
  }
}

// Made with Bob