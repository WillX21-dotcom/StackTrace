"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Basic URL validation
      const urlPattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/;
      if (!urlPattern.test(repoUrl.trim())) {
        throw new Error("Invalid GitHub URL. Format: https://github.com/owner/repo");
      }

      // Extract owner and repo from URL
      const match = repoUrl.match(/github\.com\/([\w-]+)\/([\w.-]+)/);
      if (!match) {
        throw new Error("Could not parse repository URL");
      }

      const [, owner, repo] = match;

      // Navigate to results page with repo info
      router.push(`/results?owner=${owner}&repo=${repo}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* Branding */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Repo<span className="text-accent">Mind</span>
          </h1>
          <p className="text-text-secondary text-lg">
            AI-powered GitHub repository analysis and onboarding documentation
          </p>
          <p className="text-text-tertiary text-sm">
            by <span className="text-accent font-semibold">StackTrace</span>
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="repoUrl" className="block text-sm font-medium text-text-secondary">
              GitHub Repository URL
            </label>
            <input
              id="repoUrl"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/vercel/next.js"
              className="w-full px-4 py-3 bg-surface border border-border rounded-button text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-severity-high/10 border border-severity-high/20 rounded-button">
              <p className="text-severity-high text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !repoUrl.trim()}
            className="w-full px-6 py-3 bg-accent hover:bg-accent-hover text-background font-semibold rounded-button transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Analyzing..." : "Analyze Repository"}
          </button>
        </form>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
          <div className="p-4 bg-surface border border-border rounded-card">
            <h3 className="font-semibold text-accent mb-2">Architecture</h3>
            <p className="text-sm text-text-secondary">
              Detect frameworks, patterns, and dependencies
            </p>
          </div>
          <div className="p-4 bg-surface border border-border rounded-card">
            <h3 className="font-semibold text-accent mb-2">Gotchas</h3>
            <p className="text-sm text-text-secondary">
              Identify pitfalls and common issues
            </p>
          </div>
          <div className="p-4 bg-surface border border-border rounded-card">
            <h3 className="font-semibold text-accent mb-2">Playbook</h3>
            <p className="text-sm text-text-secondary">
              Export as PDF or Markdown
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

// Made with Bob
