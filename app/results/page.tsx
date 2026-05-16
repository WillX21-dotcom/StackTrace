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
import ArchitectureMap from "@/components/ui/ArchitectureMap";

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
      const repoUrl = `https://github.com/${owner}/${repo}`;
      
      // Call the actual /api/analyse endpoint
      const analyzeRepo = async () => {
        try {
          const response = await fetch("/api/analyse", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ repoUrl }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Analysis failed");
          }

          // Handle Server-Sent Events stream
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            throw new Error("No response stream available");
          }

          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.trim()) continue;

              const eventMatch = line.match(/^event: (.+)$/m);
              const dataMatch = line.match(/^data: (.+)$/m);

              if (eventMatch && dataMatch) {
                const event = eventMatch[1];
                const data = JSON.parse(dataMatch[1]);

                if (event === "progress") {
                  setProgressMessages((prev) => [...prev, data.step]);
                } else if (event === "complete") {
                  setAnalysisResult(data.data);
                  setIsAnalyzing(false);
                } else if (event === "error") {
                  setError(data.error);
                  setIsAnalyzing(false);
                }
              }
            }
          }
        } catch (err) {
          console.error("Analysis error:", err);
          setError(err instanceof Error ? err.message : "An error occurred during analysis");
          setIsAnalyzing(false);
        }
      };

      analyzeRepo();
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
          suggestion="Check that the repository is public and accessible, or try again later."
          onRetry={() => {
            setError(null);
            setIsAnalyzing(true);
            setProgressMessages([]);
            window.location.reload();
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
              <ArchitectureMap 
                data={analysisResult.architecture}
                repoName={`${owner}/${repo}`}
              />
            )}
          </>
        ) : null}
      </div>
    </main>
  );
}

// Made with Bob
