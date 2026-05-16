// Repository stats bar component
// TODO: Implement stats display with icons

interface StatsBarProps {
  stars: number;
  forks: number;
  language: string;
  size: number; // KB
}

export default function StatsBar({ stars, forks, language, size }: StatsBarProps) {
  return (
    <div className="flex items-center gap-6 p-4 bg-surface border border-border rounded-card">
      <div className="flex items-center gap-2">
        <span className="text-text-secondary">⭐</span>
        <span className="text-text-primary">{stars.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-text-secondary">🔀</span>
        <span className="text-text-primary">{forks.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-text-secondary">💻</span>
        <span className="text-text-primary">{language}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-text-secondary">📦</span>
        <span className="text-text-primary">{(size / 1024).toFixed(1)} MB</span>
      </div>
    </div>
  );
}

// Made with Bob
