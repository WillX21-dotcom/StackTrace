// Skeleton loading cards component

export default function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="p-6 bg-surface border border-border rounded-card shadow-card animate-pulse"
        >
          {/* Header skeleton */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="h-8 bg-border rounded w-2/3 mb-3"></div>
              <div className="h-5 bg-border rounded w-24"></div>
            </div>
            <div className="h-6 bg-border rounded w-16"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-3">
            <div className="h-4 bg-border rounded w-full"></div>
            <div className="h-4 bg-border rounded w-5/6"></div>
            <div className="h-4 bg-border rounded w-4/6"></div>
          </div>

          {/* Tags skeleton */}
          <div className="flex gap-2 mt-4">
            <div className="h-6 bg-border rounded-full w-20"></div>
            <div className="h-6 bg-border rounded-full w-24"></div>
            <div className="h-6 bg-border rounded-full w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Made with Bob