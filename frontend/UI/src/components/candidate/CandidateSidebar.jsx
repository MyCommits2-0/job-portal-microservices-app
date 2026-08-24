import { NavLink, useNavigate } from "react-router-dom";
import { getJobAlertCount } from "../../services/jobAlertService";
import { useEffect, useState } from "react";
import {
  FiGrid,
  FiBriefcase,
  FiBookmark,
  FiBell,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import { logoutUser } from "../../services/authService";

const sidebarLinks = [
  {
    label: "Overview",
    path: "/candidate/dashboard",
    icon: FiGrid,
  },
  {
    label: "Applied Jobs",
    path: "/candidate/applied-jobs",
    icon: FiBriefcase,
  },
  {
    label: "Favorite Jobs",
    path: "/candidate/favorite-jobs",
    icon: FiBookmark,
  },
    {
  label: "Job Alert",
  path: "/candidate/job-alerts",
  icon: FiBell,
  },
  {
    label: "Settings",
    path: "/candidate/settings",
    icon: FiSettings,
  },
];

export default function CandidateSidebar() {
  const navigate =useNavigate()
   const [jobAlertCount, setJobAlertCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getJobAlertCount().then((count) => {
      if (!cancelled) setJobAlertCount(count);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <aside className="w-full lg:w-64 border-r border-gray-200 bg-white">
      <div className="p-5">
        <p className="text-xs font-medium text-gray-400 uppercase mb-4">
          Candidate Dashboard
        </p>

        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/candidate/dashboard"}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-md text-sm transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                <span className="flex items-center gap-3">
                  <Icon className="text-lg" />
                  {link.label}
                </span>

                {link.label === "Job Alert" && (
  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
    {jobAlertCount}
  </span>
)}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="hidden lg:flex min-h-[420px] items-end p-5">
        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 " onClick={()=>{
          logoutUser();
          navigate("/login");
        }}>
          <FiLogOut />
          Log-out
        </button>
      </div>
    </aside>
  );
}