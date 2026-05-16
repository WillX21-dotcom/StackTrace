// Contributor guide card component with setup steps

import type { ContributorGuideInsight } from "@/lib/types";
import ConfidenceBadge from "@/components/ui/ConfidenceBadge";

interface ContributorGuideCardProps {
  data: ContributorGuideInsight;
}

export default function ContributorGuideCard({ data }: ContributorGuideCardProps) {
  return (
    <div className="p-6 bg-surface border border-border rounded-card shadow-card hover:shadow-card-hover transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold font-sans">Contributor Guide</h2>
          <span className="inline-block mt-2 px-2 py-1 bg-accent/10 border border-accent/30 rounded text-accent text-xs font-medium uppercase tracking-wide">
            Onboarding
          </span>
        </div>
        <ConfidenceBadge confidence={data.confidence} />
      </div>

      {/* Setup Steps */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
          Setup Steps
        </h3>
        <ol className="space-y-3">
          {data.setupSteps.map((step, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-accent/20 border border-accent/40 rounded-full text-accent text-xs font-bold">
                {idx + 1}
              </span>
              <span className="text-text-primary pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Testing Strategy */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">
          Testing Strategy
        </h3>
        <p className="text-text-primary bg-background/50 border border-border rounded-lg p-3">
          {data.testingStrategy}
        </p>
      </div>

      {/* PR Process */}
      <div>
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">
          Pull Request Process
        </h3>
        <p className="text-text-primary bg-background/50 border border-border rounded-lg p-3">
          {data.prProcess}
        </p>
      </div>
    </div>
  );
}

// Made with Bob