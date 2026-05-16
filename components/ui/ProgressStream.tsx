// Progress stream component showing live analysis updates

interface ProgressStreamProps {
  messages: string[];
}

export default function ProgressStream({ messages }: ProgressStreamProps) {
  return (
    <div className="p-6 bg-surface border border-border rounded-card shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <h3 className="text-lg font-semibold text-text-primary">Analyzing Repository...</h3>
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 text-text-secondary text-sm animate-fade-in"
          >
            <span className="text-accent mt-0.5">→</span>
            <span>{message}</span>
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <p className="text-text-tertiary text-sm">Initializing analysis...</p>
      )}
    </div>
  );
}

// Made with Bob