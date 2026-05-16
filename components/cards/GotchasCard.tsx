// Gotchas/pitfalls card component
// TODO: Implement card UI with severity color coding

import type { GotchaInsight } from "@/lib/types";

interface GotchasCardProps {
  data: GotchaInsight[];
}

export default function GotchasCard({ data }: GotchasCardProps) {
  return (
    <div className="p-6 bg-surface border border-border rounded-card shadow-card">
      <h2 className="text-2xl font-bold mb-4">Gotchas</h2>
      <p className="text-text-secondary">TODO: Implement gotchas card UI</p>
    </div>
  );
}

// Made with Bob
