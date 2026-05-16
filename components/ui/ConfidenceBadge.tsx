// Confidence score badge component
// TODO: Implement badge with color coding

interface ConfidenceBadgeProps {
  score: number; // 0.0-1.0
}

export default function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  const getColor = () => {
    if (score >= 0.8) return "bg-confidence-high";
    if (score >= 0.6) return "bg-confidence-medium";
    return "bg-confidence-low";
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${getColor()}`}>
      {Math.round(score * 100)}% {score < 0.6 && "⚠️"}
    </span>
  );
}

// Made with Bob
