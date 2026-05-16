// Coding standards card component with conventions

import type { CodingStandardsInsight } from "@/lib/types";
import ConfidenceBadge from "@/components/ui/ConfidenceBadge";

interface CodingStandardsCardProps {
  data: CodingStandardsInsight;
}

export default function CodingStandardsCard({ data }: CodingStandardsCardProps) {
  return (
    <div className="p-6 bg-surface border border-border rounded-card shadow-card hover:shadow-card-hover transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold font-sans">Coding Standards</h2>
          <span className="inline-block mt-2 px-2 py-1 bg-secondary/10 border border-secondary/30 rounded text-secondary text-xs font-medium uppercase tracking-wide">
            Conventions
          </span>
        </div>
        <ConfidenceBadge confidence={data.confidence} />
      </div>

      {/* Tools */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">
            Linter
          </h3>
          {data.linter ? (
            <code className="block px-2 py-1 bg-accent/10 border border-accent/30 rounded text-accent text-sm font-mono">
              {data.linter}
            </code>
          ) : (
            <p className="text-text-tertiary text-sm">Not detected</p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">
            Formatter
          </h3>
          {data.formatter ? (
            <code className="block px-2 py-1 bg-accent/10 border border-accent/30 rounded text-accent text-sm font-mono">
              {data.formatter}
            </code>
          ) : (
            <p className="text-text-tertiary text-sm">Not detected</p>
          )}
        </div>
      </div>

      {/* Conventions */}
      <div>
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
          Detected Patterns
        </h3>
        <ul className="space-y-2">
          {data.conventions.map((convention, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-text-primary"
            >
              <span className="text-accent mt-0.5 flex-shrink-0">✓</span>
              <span>{convention}</span>
            </li>
          ))}
        </ul>
        {data.conventions.length === 0 && (
          <p className="text-text-tertiary text-sm">
            No specific conventions detected — review codebase manually
          </p>
        )}
      </div>
    </div>
  );
}

// Made with Bob