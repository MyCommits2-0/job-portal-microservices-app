import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiUser,
  FiPlusCircle,
  FiBriefcase,
  FiBookmark,
  FiCreditCard,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const sidebarLinks = [
  {
    label: "Overview",
    path: "/recruiter/dashboard",
    icon: FiGrid,
  },
  {
    label: "Employers Profile",
    path: "/recruiter/profile",
    icon: FiUser,
  },
  {
    label: "Post a Job",
    path: "/recruiter/post-job",
    icon: FiPlusCircle,
  },
  {
    label: "My Jobs",
    path: "/recruiter/my-jobs",
    icon: FiBriefcase,
  },
  {
    label: "Saved Candidate",
    path: "/recruiter/saved-candidates",
    icon: FiBookmark,
  },
  {
    label: "Settings",
    path: "/recruiter/settings",
    icon: FiSettings,
  },
];

export default function RecruiterSidebar() {
  return (
    <aside className="w-full lg:w-72 border-r border-gray-200 bg-white">
      <div className="p-5">
        <p className="text-xs font-medium text-gray-400 uppercase mb-4">
          Employers Dashboard
        </p>

        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/recruiter/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-md text-sm transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                <Icon className="text-lg" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="hidden lg:flex min-h-[400px] items-end p-5">
        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500">
          <FiLogOut />
          Log-out
        </button>
      </div>
    </aside>
  );
}