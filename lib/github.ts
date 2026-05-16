// GitHub REST API client utilities
// TODO: Implement GitHub API integration with Octokit

import type { RepoData, RepoStats } from "./types";

export async function fetchRepoContent(
  owner: string,
  repo: string,
  token?: string
): Promise<RepoData> {
  // TODO: Implement GitHub API fetch logic
  throw new Error("Not implemented");
}

export async function fetchRepoStats(
  owner: string,
  repo: string,
  token?: string
): Promise<RepoStats> {
  // TODO: Implement GitHub stats fetch logic
  throw new Error("Not implemented");
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([\w-]+)\/([\w.-]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

// Made with Bob
