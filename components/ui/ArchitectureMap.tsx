"use client";

import type { ArchitectureInsight } from "@/lib/types";
import ConfidenceBadge from "./ConfidenceBadge";

interface ArchitectureMapProps {
  data: ArchitectureInsight;
  repoName: string;
}

export default function ArchitectureMap({ data, repoName }: ArchitectureMapProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Architecture Map</h2>
          <p className="text-text-secondary">
            Visual representation of {repoName}'s codebase structure
          </p>
        </div>
        <ConfidenceBadge confidence={data.confidence} />
      </div>

      {/* Main Architecture Diagram */}
      <div className="p-8 bg-surface border border-border rounded-card shadow-card">
        {/* Framework Core */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="px-8 py-4 bg-accent text-background rounded-lg shadow-lg text-center">
              <div className="text-xs uppercase tracking-wide font-semibold mb-1">Core Framework</div>
              <div className="text-xl font-bold">{data.framework}</div>
            </div>
            {/* Connector line down */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-8 bg-border"></div>
          </div>
        </div>

        {/* Patterns Layer */}
        <div className="mb-8">
          <h3 className="text-center text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
            Architecture Patterns
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {data.patterns.map((pattern, idx) => (
              <div key={idx} className="relative">
                {/* Connector line up */}
                {idx === Math.floor(data.patterns.length / 2) && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0.5 h-8 bg-border"></div>
                )}
                <div className="px-6 py-3 bg-secondary/20 border-2 border-secondary rounded-lg text-center hover:bg-secondary/30 transition-colors">
                  <div className="text-sm font-medium text-text-primary">{pattern}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dependencies Layer */}
        <div className="relative">
          {/* Connector lines */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-8 bg-border"></div>
          
          <div className="pt-8">
            <h3 className="text-center text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
              Key Dependencies
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {data.dependencies.slice(0, 10).map((dep, idx) => {
                const [name, version] = dep.split('@');
                return (
                  <div
                    key={idx}
                    className="p-3 bg-background border border-border rounded hover:border-accent transition-colors"
                  >
                    <div className="text-xs font-mono text-text-primary truncate" title={name}>
                      {name}
                    </div>
                    {version && (
                      <div className="text-xs text-text-tertiary mt-1">v{version}</div>
                    )}
                  </div>
                );
              })}
            </div>
            {data.dependencies.length > 10 && (
              <p className="text-center text-sm text-text-tertiary mt-4">
                +{data.dependencies.length - 10} more dependencies
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Architecture Layers Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Presentation Layer */}
        <div className="p-6 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <h3 className="font-semibold text-text-primary">Presentation Layer</h3>
          </div>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>• UI Components</li>
            <li>• Page Routes</li>
            <li>• Client State</li>
            <li>• User Interactions</li>
          </ul>
        </div>

        {/* Business Logic Layer */}
        <div className="p-6 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <h3 className="font-semibold text-text-primary">Business Logic</h3>
          </div>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>• API Routes</li>
            <li>• Data Processing</li>
            <li>• Validation</li>
            <li>• Core Utilities</li>
          </ul>
        </div>

        {/* Data Layer */}
        <div className="p-6 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-border rounded-full"></div>
            <h3 className="font-semibold text-text-primary">Data Layer</h3>
          </div>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>• External APIs</li>
            <li>• Data Models</li>
            <li>• Type Definitions</li>
            <li>• Schemas</li>
          </ul>
        </div>
      </div>

      {/* Pattern Details */}
      <div className="p-6 bg-surface border border-border rounded-card">
        <h3 className="text-lg font-semibold mb-4">Pattern Implementation Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.patterns.map((pattern, idx) => (
            <div key={idx} className="p-4 bg-background rounded border border-border">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-secondary/20 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-secondary font-bold text-sm">{idx + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-text-primary mb-1">{pattern}</h4>
                  <p className="text-xs text-text-secondary">
                    {getPatternDescription(pattern)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm text-text-secondary">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-accent rounded"></div>
          <span>Core Framework</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-secondary/20 border-2 border-secondary rounded"></div>
          <span>Patterns</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-background border border-border rounded"></div>
          <span>Dependencies</span>
        </div>
      </div>
    </div>
  );
}

function getPatternDescription(pattern: string): string {
  const descriptions: Record<string, string> = {
    "Server Components": "React components that render on the server for improved performance and SEO",
    "API Routes": "Backend endpoints for handling data fetching and business logic",
    "Client-side State": "State management using React hooks for interactive UI components",
    "Static Generation": "Pre-rendered pages at build time for optimal performance",
    "Dynamic Routing": "File-based routing system with dynamic path parameters",
    "Middleware": "Request/response interceptors for authentication and data transformation",
    "Edge Functions": "Serverless functions deployed at the edge for low latency",
    "Incremental Static Regeneration": "Update static pages after deployment without rebuilding",
  };
  
  return descriptions[pattern] || "Architecture pattern detected in the codebase";
}

// Made with Bob