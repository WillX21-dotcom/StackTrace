// Tab switcher component for card navigation
// TODO: Implement tab switching logic

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function TabSwitcher({ tabs, activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <div className="flex gap-2 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === tab.id
              ? "text-accent border-b-2 border-accent"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  );
}

// Made with Bob
