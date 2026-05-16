import { NextRequest, NextResponse } from "next/server";
import { IngestRequestSchema } from "@/lib/validation";

// POST /api/ingest - Fetch GitHub repository content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = IngestRequestSchema.parse(body);

    // TODO: Implement GitHub API ingestion logic
    // 1. Parse GitHub URL
    // 2. Fetch repo metadata and stats
    // 3. Fetch file tree (max 50 files)
    // 4. Fetch README
    // 5. Return structured data

    return NextResponse.json(
      {
        success: false,
        error: "Not implemented yet",
      },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}

// Made with Bob
