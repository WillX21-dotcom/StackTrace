// Loading skeleton component
// TODO: Implement animated skeleton

export default function LoadingSkeleton() {
  return (
    <div className="p-6 bg-surface border border-border rounded-card animate-pulse-slow">
      <div className="h-6 bg-border rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-border rounded w-full"></div>
        <div className="h-4 bg-border rounded w-5/6"></div>
        <div className="h-4 bg-border rounded w-4/6"></div>
      </div>
    </div>
  );
}

// Made with Bob
