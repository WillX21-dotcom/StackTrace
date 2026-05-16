// Tab switcher component for toggling between different views

interface TabSwitcherProps {
  activeTab: "cards" | "playbook" | "architecture";
  onTabChange: (tab: "cards" | "playbook" | "architecture") => void;
}

export default function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  const tabs = [
    { id: "cards" as const, label: "Onboarding Cards", icon: "🎴" },
    { id: "playbook" as const, label: "Team Playbook", icon: "📖" },
    { id: "architecture" as const, label: "Architecture Map", icon: "🗺️" },
  ];

  return (
    <div className="flex gap-2 p-1 bg-surface border border-border rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-accent text-background"
              : "text-text-secondary hover:text-text-primary hover:bg-background/50"
          }`}
        >
          <span>{tab.icon}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// Made with Bob
