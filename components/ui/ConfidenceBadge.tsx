// Confidence indicator badge with tooltip for low confidence fields

interface ConfidenceBadgeProps {
  confidence: number;
  showWarning?: boolean;
}

export default function ConfidenceBadge({ confidence, showWarning = true }: ConfidenceBadgeProps) {
  const isLowConfidence = confidence < 0.6;
  
  if (!showWarning || !isLowConfidence) {
    return null;
  }

  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-0.5 bg-severity-medium/10 border border-severity-medium/30 rounded text-severity-medium text-xs font-medium"
      title="Low confidence — verify manually"
    >
      ⚠️ Verify
    </span>
  );
}

// Made with Bob
