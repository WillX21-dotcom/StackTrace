// Gotchas card component with severity indicators

import type { GotchaInsight } from "@/lib/types";
import ConfidenceBadge from "@/components/ui/ConfidenceBadge";

interface GotchasCardProps {
  data: GotchaInsight[];
}

export default function GotchasCard({ data }: GotchasCardProps) {
  const getSeverityColor = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return "bg-severity-high/10 border-severity-high/30 text-severity-high";
      case "medium":
        return "bg-severity-medium/10 border-severity-medium/30 text-severity-medium";
      case "low":
        return "bg-severity-low/10 border-severity-low/30 text-severity-low";
    }
  };

  return (
    <div className="p-6 bg-surface border border-border rounded-card shadow-card hover:shadow-card-hover transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold font-sans">Gotchas</h2>
          <span className="inline-block mt-2 px-2 py-1 bg-severity-high/10 border border-severity-high/30 rounded text-severity-high text-xs font-medium uppercase tracking-wide">
            {data.length} Issues
          </span>
        </div>
      </div>

      {/* Gotchas List */}
      <div className="space-y-4">
        {data.map((gotcha, idx) => (
          <div
            key={idx}
            className="p-4 bg-background/50 border border-border rounded-lg"
          >
            {/* Title and Severity */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-lg font-semibold text-text-primary flex-1">
                {gotcha.title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`px-2 py-1 border rounded text-xs font-medium uppercase tracking-wide ${getSeverityColor(
                    gotcha.severity
                  )}`}
                >
                  {gotcha.severity}
                </span>
                <ConfidenceBadge confidence={gotcha.confidence} />
              </div>
            </div>

            {/* Description */}
            <p className="text-text-secondary text-sm mb-3">
              {gotcha.description}
            </p>

            {/* File Path */}
            <code className="block px-2 py-1 bg-border/50 rounded text-text-primary text-xs font-mono">
              {gotcha.filePath}
            </code>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <p className="text-text-tertiary text-center py-8">
          No gotchas detected — this is a well-structured codebase!
        </p>
      )}
    </div>
  );
}

// Made with Bob
