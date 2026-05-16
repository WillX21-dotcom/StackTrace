// GitHub REST API client utilities
import { Octokit } from "@octokit/rest";

// Error types for better error handling
export class GitHubError extends Error {
  constructor(
    message: string,
    public code: string,
    public suggestion: string
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

// RepoContent type definition
export type RepoContent = {
  owner: string;
  repo: string;
  fileTree: Array<{
    path: string;
    type: "blob" | "tree";
    size?: number;
    sha: string;
  }>;
  readme: string | null;
  packageManifest: {
    type: "package.json" | "requirements.txt" | "go.mod" | null;
    content: string | null;
  };
  workflows: Array<{
    path: string;
    content: string;
  }>;
  dockerfile: string | null;
  envExample: string | null;
  sourceFiles: Array<{
    path: string;
    content: string;
    size: number;
  }>;
  fetchedAt: string;
};

// Parse GitHub URL to extract owner and repo
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const urlPattern = /^https?:\/\/github\.com\/([\w-]+)\/([\w.-]+)\/?$/;
    const match = url.trim().match(urlPattern);
    
    if (!match) {
      return null;
    }
    
    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/, ""), // Remove .git suffix if present
    };
  } catch {
    return null;
  }
}

// Retry helper for rate limit errors
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Only retry on rate limit errors (429)
      if (error.status === 429 && attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
}

// Fetch file content from GitHub (base64 decoded)
async function fetchFileContent(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string
): Promise<string | null> {
  try {
    const response = await retryWithBackoff(() =>
      octokit.repos.getContent({
        owner,
        repo,
        path,
      })
    );
    
    if ("content" in response.data && response.data.content) {
      return Buffer.from(response.data.content, "base64").toString("utf-8");
    }
    
    return null;
  } catch (error: any) {
    // File doesn't exist - return null instead of throwing
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

// Fetch multiple workflow files from .github/workflows/
async function fetchWorkflows(
  octokit: Octokit,
  owner: string,
  repo: string,
  fileTree: Array<{ path: string; type: string }>
): Promise<Array<{ path: string; content: string }>> {
  const workflowFiles = fileTree.filter(
    (file) =>
      file.type === "blob" &&
      file.path.startsWith(".github/workflows/") &&
      (file.path.endsWith(".yml") || file.path.endsWith(".yaml"))
  );
  
  const workflows: Array<{ path: string; content: string }> = [];
  
  for (const file of workflowFiles) {
    const content = await fetchFileContent(octokit, owner, repo, file.path);
    if (content) {
      workflows.push({ path: file.path, content });
    }
  }
  
  return workflows;
}

// Heuristic to find 3-5 key source files
function findKeySourceFiles(
  fileTree: Array<{ path: string; type: string; size?: number }>
): Array<{ path: string; size: number }> {
  const sourceFiles = fileTree
    .filter((file) => {
      if (file.type !== "blob" || !file.size) return false;
      
      // Look for files in common source directories
      const isInSourceDir =
        file.path.startsWith("src/") ||
        file.path.startsWith("lib/") ||
        file.path.startsWith("app/");
      
      // Exclude test files
      const isTestFile =
        file.path.includes(".test.") ||
        file.path.includes(".spec.") ||
        file.path.includes("__tests__/");
      
      // Include common source file extensions
      const isSourceFile =
        file.path.endsWith(".ts") ||
        file.path.endsWith(".tsx") ||
        file.path.endsWith(".js") ||
        file.path.endsWith(".jsx") ||
        file.path.endsWith(".py") ||
        file.path.endsWith(".go") ||
        file.path.endsWith(".rs") ||
        file.path.endsWith(".java");
      
      return isInSourceDir && !isTestFile && isSourceFile;
    })
    .sort((a, b) => (b.size || 0) - (a.size || 0)) // Sort by size descending
    .slice(0, 5) // Take top 5
    .map((file) => ({ path: file.path, size: file.size || 0 }));
  
  return sourceFiles;
}

// Main function to fetch repository content
export async function fetchRepoContent(repoUrl: string): Promise<RepoContent> {
  // Parse and validate GitHub URL
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    throw new GitHubError(
      "Invalid GitHub URL format",
      "INVALID_URL",
      "Expected format: https://github.com/owner/repo"
    );
  }
  
  const { owner, repo } = parsed;
  
  // Initialize Octokit with optional token
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
  
  try {
    // 1. Fetch file tree (recursive, max depth 3)
    const treeResponse = await retryWithBackoff(() =>
      octokit.git.getTree({
        owner,
        repo,
        tree_sha: "HEAD",
        recursive: "1",
      })
    );
    
    // Validate tree response
    if (!treeResponse.data || !treeResponse.data.tree || !Array.isArray(treeResponse.data.tree)) {
      throw new GitHubError(
        `Invalid response from GitHub API for ${owner}/${repo}`,
        "INVALID_RESPONSE",
        "The repository may be empty or the API response format has changed"
      );
    }
    
    const fileTree = treeResponse.data.tree
      .filter((item) => item.path && item.path.split("/").length <= 3) // Max depth 3
      .map((item) => ({
        path: item.path!,
        type: item.type as "blob" | "tree",
        size: item.size,
        sha: item.sha!,
      }));
    
    // 2. Fetch README.md
    const readme = await fetchFileContent(octokit, owner, repo, "README.md");
    
    // 3. Fetch package manifest (try in order: package.json, requirements.txt, go.mod)
    let packageManifest: RepoContent["packageManifest"] = {
      type: null,
      content: null,
    };
    
    const manifestFiles = ["package.json", "requirements.txt", "go.mod"] as const;
    for (const manifestFile of manifestFiles) {
      const content = await fetchFileContent(octokit, owner, repo, manifestFile);
      if (content) {
        packageManifest = {
          type: manifestFile,
          content,
        };
        break;
      }
    }
    
    // 4. Fetch all workflow files
    const workflows = await fetchWorkflows(octokit, owner, repo, fileTree);
    
    // 5. Fetch Dockerfile
    const dockerfile = await fetchFileContent(octokit, owner, repo, "Dockerfile");
    
    // 6. Fetch .env.example
    const envExample = await fetchFileContent(octokit, owner, repo, ".env.example");
    
    // 7. Fetch 3-5 key source files
    const keyFiles = findKeySourceFiles(fileTree);
    const sourceFiles: RepoContent["sourceFiles"] = [];
    
    for (const file of keyFiles) {
      const content = await fetchFileContent(octokit, owner, repo, file.path);
      if (content) {
        sourceFiles.push({
          path: file.path,
          content,
          size: file.size,
        });
      }
    }
    
    return {
      owner,
      repo,
      fileTree,
      readme,
      packageManifest,
      workflows,
      dockerfile,
      envExample,
      sourceFiles,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    // Handle specific GitHub API errors
    if (error.status === 404) {
      throw new GitHubError(
        `Repository ${owner}/${repo} not found`,
        "REPO_NOT_FOUND",
        "Check that the repository exists and is public"
      );
    }
    
    if (error.status === 403) {
      throw new GitHubError(
        "GitHub API rate limit exceeded",
        "RATE_LIMIT",
        "Add GITHUB_TOKEN environment variable for higher rate limits"
      );
    }
    
    if (error.status === 401) {
      throw new GitHubError(
        "Invalid GitHub token",
        "INVALID_TOKEN",
        "Check that GITHUB_TOKEN is valid"
      );
    }
    
    // Network or other errors
    throw new GitHubError(
      error.message || "Failed to fetch repository content",
      "NETWORK_ERROR",
      "Check your internet connection and try again"
    );
  }
}

// Made with Bob
