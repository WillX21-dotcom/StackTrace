import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchRepoContent, GitHubError, RepoContent } from "@/lib/github";
import { runFullAnalysis } from "@/lib/analysis";

// Request validation schema
const AnalyseRequestSchema = z.object({
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

/**
 * POST /api/analyse - Analyze GitHub repository with streaming progress
 * 
 * Accepts: { repoUrl: string }
 * Returns: Server-Sent Events stream with progress updates, then final JSON result
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = AnalyseRequestSchema.safeParse(body);
    
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
    
    // Create a ReadableStream for Server-Sent Events
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Helper to send SSE message
          const sendEvent = (event: string, data: any) => {
            const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(encoder.encode(message));
          };
          
          // Step 1: Fetch repository content
          sendEvent("progress", {
            step: "Fetching repository content...",
            progress: 0,
          });
          
          let repoContent: RepoContent;
          try {
            repoContent = await fetchRepoContent(repoUrl);
          } catch (error) {
            if (error instanceof GitHubError) {
              sendEvent("error", {
                error: error.message,
                code: error.code,
                suggestion: error.suggestion,
              });
            } else {
              sendEvent("error", {
                error: error instanceof Error ? error.message : "Failed to fetch repository",
                code: "FETCH_ERROR",
                suggestion: "Check the repository URL and try again",
              });
            }
            controller.close();
            return;
          }
          
          // Step 2: Run analysis pipeline with progress callbacks
          sendEvent("progress", {
            step: "Starting analysis pipeline...",
            progress: 5,
          });
          
          try {
            const result = await runFullAnalysis(
              repoContent,
              (step: string, progress: number) => {
                sendEvent("progress", { step, progress });
              }
            );
            
            // Send final result
            sendEvent("complete", {
              success: true,
              data: result,
            });
          } catch (error) {
            sendEvent("error", {
              error: error instanceof Error ? error.message : "Analysis failed",
              code: "ANALYSIS_ERROR",
              suggestion: "The analysis pipeline encountered an error. Please try again or contact support.",
            });
          }
          
          controller.close();
        } catch (error) {
          // Unexpected error in stream
          console.error("Unexpected error in /api/analyse stream:", error);
          
          const errorMessage = `event: error\ndata: ${JSON.stringify({
            error: error instanceof Error ? error.message : "An unexpected error occurred",
            code: "INTERNAL_ERROR",
            suggestion: "Please try again later or contact support if the issue persists",
          })}\n\n`;
          
          controller.enqueue(encoder.encode(errorMessage));
          controller.close();
        }
      },
    });
    
    // Return streaming response with SSE headers
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    // Handle errors in request parsing
    console.error("Error parsing request in /api/analyse:", error);
    
    return NextResponse.json<ErrorResponse>(
      {
        error: error instanceof Error ? error.message : "Failed to parse request",
        code: "REQUEST_ERROR",
        suggestion: "Check your request format and try again",
      },
      { status: 400 }
    );
  }
}

// Made with Bob
