// Repository statistics bar component

interface RepoStatsProps {
  filesAnalyzed: number;
  modulesFound: number;
  bobSessions: number;
  playbookSections: number;
}

export default function RepoStats({
  filesAnalyzed,
  modulesFound,
  bobSessions,
  playbookSections,
}: RepoStatsProps) {
  const stats = [
    { label: "Files Analyzed", value: filesAnalyzed, icon: "📄" },
    { label: "Modules Found", value: modulesFound, icon: "📦" },
    { label: "Bob Sessions", value: bobSessions, icon: "🤖" },
    { label: "Playbook Sections", value: playbookSections, icon: "📋" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="p-4 bg-surface border border-border rounded-card shadow-card"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{stat.icon}</span>
            <span className="text-3xl font-bold text-accent">{stat.value}</span>
          </div>
          <p className="text-sm text-text-secondary">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// Made with Bob