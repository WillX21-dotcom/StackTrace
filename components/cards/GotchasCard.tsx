// Gotchas card component with severity indicators and evidence-based details

import type { GotchaInsight } from "@/lib/types";
import ConfidenceBadge from "@/components/ui/ConfidenceBadge";
import { useState } from "react";

interface GotchasCardProps {
  data: GotchaInsight[];
}

export default function GotchasCard({ data }: GotchasCardProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
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
            className="p-4 bg-background/50 border border-border rounded-lg hover:border-accent/50 transition-colors"
          >
            {/* Issue ID Badge */}
            <div className="mb-2">
              <code className="px-2 py-1 bg-accent/10 border border-accent/30 rounded text-accent text-xs font-mono font-semibold">
                {gotcha.issueId}
              </code>
            </div>

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

            {/* File Path with Line Number */}
            <div className="flex items-center gap-2 mb-3">
              <code className="px-2 py-1 bg-border/50 rounded text-text-primary text-xs font-mono">
                {gotcha.filePath}
                {gotcha.lineNumber && `:${gotcha.lineNumber}`}
              </code>
            </div>

            {/* Expand/Collapse Button */}
            <button
              onClick={() => toggleExpand(idx)}
              className="text-accent text-sm font-medium hover:underline mb-2"
            >
              {expandedIndex === idx ? "▼ Hide Details" : "▶ Show Evidence & Fix"}
            </button>

            {/* Expanded Details */}
            {expandedIndex === idx && (
              <div className="mt-3 space-y-3 pt-3 border-t border-border">
                {/* Source Evidence */}
                <div>
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                    Source Evidence
                  </h4>
                  <pre className="p-3 bg-background border border-border rounded text-xs font-mono text-text-primary overflow-x-auto">
                    {gotcha.sourceEvidence}
                  </pre>
                </div>

                {/* Custom Fix */}
                <div>
                  <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                    Recommended Fix
                  </h4>
                  <div className="p-3 bg-accent/5 border border-accent/20 rounded text-sm text-text-primary">
                    {gotcha.customFix}
                  </div>
                </div>
              </div>
            )}
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
