import { FiBriefcase } from "react-icons/fi";

export default function DashboardStatCard({ stat }) {
  const Icon = stat.icon || FiBriefcase;

  return (
    <div
      className={`${stat.bgColor} rounded-lg p-6 flex items-center justify-between`}
    >
      <div>
        <h3 className="text-2xl font-semibold text-gray-900">
          {stat.value}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
      </div>

      <div className="w-12 h-12 rounded-md bg-white flex items-center justify-center">
        <Icon className={`text-2xl ${stat.iconColor}`} />
      </div>
    </div>
  );
}