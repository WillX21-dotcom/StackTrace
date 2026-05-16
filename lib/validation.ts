import { z } from "zod";

// GitHub URL validation schema
export const GitHubUrlSchema = z.object({
  repoUrl: z
    .string()
    .url()
    .regex(
      /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/,
      "Invalid GitHub URL format. Expected: https://github.com/owner/repo"
    ),
});

// Ingest API request schema
export const IngestRequestSchema = z.object({
  repoUrl: z.string().url(),
});

// Ingest API response schema
export const IngestResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      owner: z.string(),
      repo: z.string(),
      defaultBranch: z.string(),
      stats: z.object({
        stars: z.number(),
        forks: z.number(),
        language: z.string(),
        size: z.number(),
      }),
      files: z.array(
        z.object({
          path: z.string(),
          content: z.string(),
          size: z.number(),
        })
      ),
      readme: z.string().nullable(),
    })
    .optional(),
  error: z.string().optional(),
});

// Analyse API request schema
export const AnalyseRequestSchema = z.object({
  repoData: z.object({
    owner: z.string(),
    repo: z.string(),
    files: z.array(
      z.object({
        path: z.string(),
        content: z.string(),
      })
    ),
    readme: z.string().nullable(),
  }),
});

// Analyse API response schema
export const AnalyseResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      architecture: z.object({
        framework: z.string(),
        patterns: z.array(z.string()),
        dependencies: z.array(z.string()),
        confidence: z.number().min(0).max(1),
      }),
      gotchas: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
            severity: z.enum(["high", "medium", "low"]),
            filePath: z.string(),
            confidence: z.number().min(0).max(1),
          })
        )
        .min(3, "Minimum 3 gotchas required"),
      contributorGuide: z.object({
        setupSteps: z.array(z.string()),
        testingStrategy: z.string(),
        prProcess: z.string(),
        confidence: z.number().min(0).max(1),
      }),
      deploymentRunbook: z.object({
        buildCommand: z.string(),
        envVars: z.array(z.string()),
        deploymentSteps: z.array(z.string()),
        confidence: z.number().min(0).max(1),
      }),
      codingStandards: z.object({
        linter: z.string().nullable(),
        formatter: z.string().nullable(),
        conventions: z.array(z.string()),
        confidence: z.number().min(0).max(1),
      }),
    })
    .optional(),
  error: z.string().optional(),
});

// Export API request schema
export const ExportRequestSchema = z.object({
  repoName: z.string(),
  analysisData: z.object({
    architecture: z.object({
      framework: z.string(),
      patterns: z.array(z.string()),
      dependencies: z.array(z.string()),
      confidence: z.number(),
    }),
    gotchas: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        severity: z.enum(["high", "medium", "low"]),
        filePath: z.string(),
        confidence: z.number(),
      })
    ),
    contributorGuide: z.object({
      setupSteps: z.array(z.string()),
      testingStrategy: z.string(),
      prProcess: z.string(),
      confidence: z.number(),
    }),
    deploymentRunbook: z.object({
      buildCommand: z.string(),
      envVars: z.array(z.string()),
      deploymentSteps: z.array(z.string()),
      confidence: z.number(),
    }),
    codingStandards: z.object({
      linter: z.string().nullable(),
      formatter: z.string().nullable(),
      conventions: z.array(z.string()),
      confidence: z.number(),
    }),
  }),
});

// Made with Bob
