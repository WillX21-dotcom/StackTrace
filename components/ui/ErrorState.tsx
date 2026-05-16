// Error state component
// TODO: Implement error display with retry option

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="p-6 bg-severity-high/10 border border-severity-high/20 rounded-card text-center">
      <p className="text-severity-high mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-accent hover:bg-accent-hover text-background rounded-button transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// Made with Bob
