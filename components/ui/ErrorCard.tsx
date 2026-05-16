// Error card component for displaying analysis failures

interface ErrorCardProps {
  title: string;
  message: string;
  suggestion?: string;
  onRetry?: () => void;
}

export default function ErrorCard({ title, message, suggestion, onRetry }: ErrorCardProps) {
  return (
    <div className="p-6 bg-surface border border-severity-high/30 rounded-card shadow-card">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-severity-high/10 border border-severity-high/30 rounded-full">
          <span className="text-2xl">⚠️</span>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-severity-high mb-2">{title}</h3>
          <p className="text-text-primary mb-3">{message}</p>
          
          {suggestion && (
            <div className="p-3 bg-background/50 border border-border rounded-lg mb-4">
              <p className="text-sm text-text-secondary">
                <span className="font-semibold text-accent">Suggestion:</span> {suggestion}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-background font-semibold rounded-button transition-colors"
              >
                Try Again
              </button>
            )}
            <a
              href="/"
              className="px-4 py-2 bg-surface border border-border hover:border-accent text-text-primary rounded-button transition-colors"
            >
              Go Back
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob