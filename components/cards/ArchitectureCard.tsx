// Architecture overview card component
// TODO: Implement card UI

import type { ArchitectureInsight } from "@/lib/types";

interface ArchitectureCardProps {
  data: ArchitectureInsight;
}

export default function ArchitectureCard({ data }: ArchitectureCardProps) {
  return (
    <div className="p-6 bg-surface border border-border rounded-card shadow-card">
      <h2 className="text-2xl font-bold mb-4">Architecture</h2>
      <p className="text-text-secondary">TODO: Implement architecture card UI</p>
    </div>
  );
}

// Made with Bob
