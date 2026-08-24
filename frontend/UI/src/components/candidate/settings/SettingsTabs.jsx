import { FiUser, FiFileText, FiLink, FiSettings } from "react-icons/fi";

const tabs = [
  { id: "personal", label: "Personal", icon: FiUser },
  { id: "profile", label: "Profile Details", icon: FiFileText },
  { id: "social", label: "Social Links", icon: FiLink },
  { id: "account", label: "Account Settings", icon: FiSettings },
];

export default function SettingsTabs({ activeTab, setActiveTab, completedTabs = [] }) {
  return (
    <div className="mb-6 border-b border-gray-200 overflow-x-auto">
      <div className="flex min-w-max items-center gap-2 sm:gap-4">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isCompleted = completedTabs.includes(tab.id);

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-4 text-sm font-medium transition ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-blue-200 hover:text-blue-600"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : isCompleted
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {isCompleted && !isActive ? "✓" : index + 1}
              </span>
              <Icon className="text-base" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
