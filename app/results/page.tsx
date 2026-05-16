"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { AnalysisResult } from "@/lib/types";

// Component imports
import ArchitectureCard from "@/components/cards/ArchitectureCard";
import GotchasCard from "@/components/cards/GotchasCard";
import ContributorGuideCard from "@/components/cards/ContributorGuideCard";
import DeploymentCard from "@/components/cards/DeploymentCard";
import CodingStandardsCard from "@/components/cards/CodingStandardsCard";
import RepoStats from "@/components/ui/RepoStats";
import TabSwitcher from "@/components/ui/TabSwitcher";
import ProgressStream from "@/components/ui/ProgressStream";
import SkeletonCards from "@/components/ui/SkeletonCards";
import ErrorCard from "@/components/ui/ErrorCard";
import ExportButtons from "@/components/ui/ExportButtons";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressMessages, setProgressMessages] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"cards" | "playbook" | "architecture">("cards");

  useEffect(() => {
    if (owner && repo) {
      // Simulate progressive analysis with messages
      const messages = [
        "Fetching repository contents...",
        "Analyzing architecture patterns...",
        "Detecting potential gotchas...",
        "Extracting contributor guidelines...",
        "Mapping deployment pipeline...",
        "Identifying coding standards...",
        "Generating playbook summary...",
      ];

      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        if (messageIndex < messages.length) {
          setProgressMessages((prev) => [...prev, messages[messageIndex]]);
          messageIndex++;
        } else {
          clearInterval(messageInterval);
        }
      }, 500);

      // Simulate analysis completion with mock data
      setTimeout(() => {
        setAnalysisResult({
          architecture: {
            framework: "Next.js 14 (App Router)",
            patterns: ["Server Components", "API Routes", "Client-side State"],
            dependencies: [
              "next@14.0.0",
              "react@18.2.0",
              "typescript@5.0.0",
              "tailwindcss@3.3.0",
              "zod@3.22.0",
            ],
            confidence: 0.92,
          },
          gotchas: [
            {
              title: "Missing Error Boundaries",
              description: "No error boundaries detected in the component tree. Unhandled errors will crash the entire app.",
              severity: "high",
              filePath: "app/layout.tsx",
              confidence: 0.85,
            },
            {
              title: "Unvalidated API Responses",
              description: "External API responses are not validated with Zod schemas before use.",
              severity: "medium",
              filePath: "lib/github.ts",
              confidence: 0.78,
            },
            {
              title: "Hardcoded API Endpoints",
              description: "API endpoints are hardcoded instead of using environment variables.",
              severity: "low",
              filePath: "lib/api.ts",
              confidence: 0.65,
            },
          ],
          contributorGuide: {
            setupSteps: [
              "Clone the repository and install dependencies with npm install",
              "Copy .env.example to .env.local and add your GitHub token",
              "Run npm run dev to start the development server on port 3000",
              "Open http://localhost:3000 in your browser",
            ],
            testingStrategy: "No automated tests detected. Consider adding Jest and React Testing Library for component tests.",
            prProcess: "Create feature branches from develop, commit with conventional commits (feat/fix/chore), and open PRs for review before merging.",
            confidence: 0.71,
          },
          deploymentRunbook: {
            buildCommand: "npm run build",
            envVars: ["GITHUB_TOKEN", "NEXT_PUBLIC_API_URL"],
            deploymentSteps: ["Install", "Build", "Test", "Deploy"],
            confidence: 0.88,
          },
          codingStandards: {
            linter: "eslint",
            formatter: "prettier",
            conventions: [
              "TypeScript strict mode enabled",
              "Functional components with hooks",
              "Tailwind CSS for styling",
              "Conventional commit messages",
            ],
            confidence: 0.82,
          },
          playbook: {
            overallConfidence: 0.81,
            readyForOnboarding: true,
            missingInfo: ["Test coverage", "CI/CD pipeline"],
            strengths: ["Clear architecture", "Type safety", "Modern stack"],
          },
        });
        setIsAnalyzing(false);
      }, 4000);

      return () => clearInterval(messageInterval);
    }
  }, [owner, repo]);

  if (!owner || !repo) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <ErrorCard
          title="Invalid Repository"
          message="Please provide a valid GitHub repository URL."
          suggestion="Make sure the URL follows the format: github.com/owner/repo"
        />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <ErrorCard
          title="Analysis Failed"
          message={error}
          suggestion="Check that the repository is public and accessible."
          onRetry={() => {
            setError(null);
            setIsAnalyzing(true);
            setProgressMessages([]);
          }}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-sans">
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
            <ProgressStream messages={progressMessages} />
            <SkeletonCards />
          </div>
        ) : analysisResult ? (
          <>
            {/* Stats Bar */}
            <RepoStats
              filesAnalyzed={42}
              modulesFound={18}
              bobSessions={1}
              playbookSections={5}
            />

            {/* Tab Switcher */}
            <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Cards View */}
            {activeTab === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ArchitectureCard data={analysisResult.architecture} />
                <GotchasCard data={analysisResult.gotchas} />
                <ContributorGuideCard data={analysisResult.contributorGuide} />
                <DeploymentCard data={analysisResult.deploymentRunbook} />
                <CodingStandardsCard data={analysisResult.codingStandards} />
              </div>
            )}

            {/* Playbook View */}
            {activeTab === "playbook" && (
              <div className="p-8 bg-surface border border-border rounded-card shadow-card">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-4">Team Playbook</h2>
                  <p className="text-text-secondary mb-6">
                    Download a comprehensive onboarding playbook with all analysis insights
                  </p>
                </div>
                
                <ExportButtons
                  repoName={`${owner}-${repo}`}
                  analysisData={analysisResult}
                />
                
                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="text-lg font-semibold mb-4">Playbook Contents</h3>
                  <ul className="text-text-secondary space-y-2">
                    <li>✅ Architecture Overview</li>
                    <li>✅ Critical Gotchas ({analysisResult.gotchas.length} detected)</li>
                    <li>✅ Contributor Guide</li>
                    <li>✅ Deployment Runbook</li>
                    <li>✅ Coding Standards</li>
                    <li>✅ Playbook Summary</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Architecture Map View */}
            {activeTab === "architecture" && (
              <div className="p-8 bg-surface border border-border rounded-card shadow-card text-center">
                <h2 className="text-2xl font-bold mb-4">Architecture Map</h2>
                <p className="text-text-secondary">
                  Visual architecture diagram coming soon
                </p>
              </div>
            )}
          </>
        ) : null}
      </div>
    </main>
  );
}

// Made with Bob
