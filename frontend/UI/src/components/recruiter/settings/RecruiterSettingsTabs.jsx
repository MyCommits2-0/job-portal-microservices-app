import {
  FiBriefcase,
  FiGlobe,
  FiLink,
  FiSettings,
} from "react-icons/fi";

export default function RecruiterSettingsTabs({
  activeTab,
  setActiveTab,
}) {
  const tabs = [
    {
      id: "company",
      label: "Company Info",
      icon: <FiBriefcase />,
    },
    {
      id: "founding",
      label: "Founding Info",
      icon: <FiGlobe />,
    },
    {
      id: "social",
      label: "Social Media Profile",
      icon: <FiLink />,
    },
    {
      id: "account",
      label: "Account Setting",
      icon: <FiSettings />,
    },
  ];

  return (
    <div className="border-b border-gray-200">
      <div className="flex flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}