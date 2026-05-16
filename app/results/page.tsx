"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    if (owner && repo) {
      // Simulate analysis loading
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 3000);
    }
  }, [owner, repo]);

  if (!owner || !repo) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-severity-high">Invalid Repository</h1>
          <p className="text-text-secondary">Please provide a valid GitHub repository URL.</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-accent hover:bg-accent-hover text-background font-semibold rounded-button transition-colors"
          >
            Go Back
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {owner}/<span className="text-accent">{repo}</span>
            </h1>
            <p className="text-text-secondary mt-2">Repository Analysis</p>
          </div>
          <a
            href="/"
            className="px-4 py-2 bg-surface border border-border hover:border-accent text-text-primary rounded-button transition-colors"
          >
            ← Back
          </a>
        </div>

        {/* Analysis Loading State */}
        {isAnalyzing ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-text-secondary">Analyzing repository...</p>
                <p className="text-text-tertiary text-sm">
                  Detecting architecture, gotchas, and best practices
                </p>
              </div>
            </div>

            {/* Skeleton Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-6 bg-surface border border-border rounded-card animate-pulse-slow"
                >
                  <div className="h-6 bg-border rounded w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-border rounded w-full"></div>
                    <div className="h-4 bg-border rounded w-5/6"></div>
                    <div className="h-4 bg-border rounded w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-secondary">Analysis complete! (Cards will be implemented next)</p>
          </div>
        )}
      </div>
    </main>
  );
}

// Made with Bob
