// Architecture overview card component

import type { ArchitectureInsight } from "@/lib/types";
import ConfidenceBadge from "@/components/ui/ConfidenceBadge";

interface ArchitectureCardProps {
  data: ArchitectureInsight;
}

export default function ArchitectureCard({ data }: ArchitectureCardProps) {
  return (
    <div className="p-6 bg-surface border border-border rounded-card shadow-card hover:shadow-card-hover transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold font-sans">Architecture</h2>
          <span className="inline-block mt-2 px-2 py-1 bg-accent/10 border border-accent/30 rounded text-accent text-xs font-medium uppercase tracking-wide">
            Overview
          </span>
        </div>
        <ConfidenceBadge confidence={data.confidence} />
      </div>

      {/* Framework */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">
          Framework
        </h3>
        <p className="text-lg font-medium text-text-primary">{data.framework}</p>
      </div>

      {/* Communication Pattern */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">
          Communication Pattern
        </h3>
        <p className="text-sm text-text-primary bg-accent/5 border border-accent/20 rounded p-3">
          {data.communicationPattern}
        </p>
      </div>

      {/* Patterns */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">
          Patterns Detected
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.patterns.map((pattern, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-secondary/10 border border-secondary/30 rounded-full text-secondary text-sm"
            >
              {pattern}
            </span>
          ))}
        </div>
      </div>

      {/* Dependencies */}
      <div>
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">
          Key Dependencies
        </h3>
        <div className="space-y-1">
          {data.dependencies.slice(0, 5).map((dep, idx) => (
            <code
              key={idx}
              className="block px-2 py-1 bg-border/50 rounded text-text-primary text-sm font-mono"
            >
              {dep}
            </code>
          ))}
          {data.dependencies.length > 5 && (
            <p className="text-xs text-text-tertiary mt-2">
              +{data.dependencies.length - 5} more dependencies
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Made with Bob
