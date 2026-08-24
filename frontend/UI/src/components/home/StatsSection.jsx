import { FiBriefcase, FiUsers, FiHome, FiPlus } from "react-icons/fi";
import { statsData } from "../../data/homeData";

export default function StatsSection() {
  const icons = [FiBriefcase, FiHome, FiUsers, FiPlus];

  return (
    <section className="bg-gray-50 pt-6 pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsData.map((stat, index) => {
          const Icon = icons[index];

          return (
            <div
              key={stat.id}
              className="bg-white rounded-lg border border-gray-100 p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition"
            >
              <div className="w-14 h-14 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                <Icon />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}