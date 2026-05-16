// Deployment runbook card component with pipeline visualization

import type { DeploymentRunbookInsight } from "@/lib/types";
import ConfidenceBadge from "@/components/ui/ConfidenceBadge";

interface DeploymentCardProps {
  data: DeploymentRunbookInsight;
}

export default function DeploymentCard({ data }: DeploymentCardProps) {
  return (
    <div className="p-6 bg-surface border border-border rounded-card shadow-card hover:shadow-card-hover transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold font-sans">Deployment</h2>
          <span className="inline-block mt-2 px-2 py-1 bg-secondary/10 border border-secondary/30 rounded text-secondary text-xs font-medium uppercase tracking-wide">
            Runbook
          </span>
        </div>
        <ConfidenceBadge confidence={data.confidence} />
      </div>

      {/* Build Command */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">
          Build Command
        </h3>
        <code className="block px-3 py-2 bg-background/50 border border-border rounded text-accent text-sm font-mono">
          {data.buildCommand}
        </code>
      </div>

      {/* Pipeline Stages */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
          Deployment Pipeline
        </h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {data.deploymentSteps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2 flex-shrink-0">
              <div className="px-3 py-2 bg-accent/10 border border-accent/30 rounded-lg text-accent text-sm font-medium whitespace-nowrap">
                {step}
              </div>
              {idx < data.deploymentSteps.length - 1 && (
                <svg
                  className="w-4 h-4 text-text-tertiary flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Environment Variables */}
      <div>
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">
          Required Secrets
        </h3>
        {data.envVars.length > 0 ? (
          <div className="space-y-1">
            {data.envVars.map((envVar, idx) => (
              <code
                key={idx}
                className="block px-2 py-1 bg-severity-medium/10 border border-severity-medium/30 rounded text-severity-medium text-sm font-mono"
              >
                {envVar}
              </code>
            ))}
          </div>
        ) : (
          <p className="text-text-tertiary text-sm">No environment variables required</p>
        )}
      </div>
    </div>
  );
}

// Made with Bob
