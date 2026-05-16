import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchRepoContent, GitHubError } from "@/lib/github";

// Request validation schema
const IngestRequestSchema = z.object({
  repoUrl: z
    .string()
    .url("Must be a valid URL")
    .regex(
      /^https?:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/,
      "Must be a valid GitHub repository URL (https://github.com/owner/repo)"
    ),
});

// Error response type
type ErrorResponse = {
  error: string;
  code: string;
  suggestion: string;
};

// POST /api/ingest - Fetch GitHub repository content
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = IngestRequestSchema.safeParse(body);
    
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      return NextResponse.json<ErrorResponse>(
        {
          error: firstError.message,
          code: "VALIDATION_ERROR",
          suggestion: "Provide a valid GitHub repository URL in the format: https://github.com/owner/repo",
        },
        { status: 400 }
      );
    }
    
    const { repoUrl } = validation.data;
    
    // Fetch repository content
    const repoContent = await fetchRepoContent(repoUrl);
    
    // Return successful response
    return NextResponse.json(
      {
        success: true,
        data: repoContent,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle GitHubError with structured error response
    if (error instanceof GitHubError) {
      const statusCode = 
        error.code === "REPO_NOT_FOUND" ? 404 :
        error.code === "RATE_LIMIT" ? 429 :
        error.code === "INVALID_TOKEN" ? 401 :
        error.code === "INVALID_URL" ? 400 :
        500;
      
      return NextResponse.json<ErrorResponse>(
        {
          error: error.message,
          code: error.code,
          suggestion: error.suggestion,
        },
        { status: statusCode }
      );
    }
    
    // Handle unexpected errors
    console.error("Unexpected error in /api/ingest:", error);
    
    return NextResponse.json<ErrorResponse>(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        code: "INTERNAL_ERROR",
        suggestion: "Please try again later or contact support if the issue persists",
      },
      { status: 500 }
    );
  }
}

// Made with Bob
