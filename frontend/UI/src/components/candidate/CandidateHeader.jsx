import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiBriefcase,
  FiPhone,
  FiChevronDown,
} from "react-icons/fi";

import NotificationsPanel from "./notifications/NotificationsPanel";
import { getCandidateSettings, resolveCandidateProfileId } from "../../services/candidateSettingsService";
import { getAuthUser } from "../../utils/authStorage";

export default function CandidateHeader() {
  const navLinks = [
    { name: "Home", path: "/candidate/home" },
    { name: "Find Job", path: "/candidate/find-job" },
    { name: "Dashboard", path: "/candidate/dashboard" },
    { name: "Job Alerts", path: "/candidate/job-alerts" },
    { name: "Customer Supports", path: "/candidate/support" },
  ];

  const authUser = getAuthUser();
  const [candidate, setCandidate] = useState({
    fullName: authUser?.name || "Candidate",
    profileImageUrl: "",
  });

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const candidateProfileId = await resolveCandidateProfileId();
        const profile = await getCandidateSettings(candidateProfileId);

        if (!cancelled) {
          setCandidate({
            fullName: authUser?.name || "Candidate",
            profileImageUrl: profile.profileImageUrl || "",
          });
        }
      } catch (error) {
        console.error("Failed to load candidate profile", error);
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top Nav */}
      <div className="hidden md:block bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-10 flex items-center justify-between">
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-medium border-b-2 border-blue-600 h-10 flex items-center"
                    : "text-gray-500 hover:text-blue-600 h-10 flex items-center"
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-5 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FiPhone />
              <span>+91-7558268202</span>
            </div>

            <div className="flex items-center gap-2">
              <span>US</span>
              <span>English</span>
              <FiChevronDown />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-5 flex flex-col lg:flex-row lg:items-center gap-5">
        <div className="flex items-center justify-between">
          <NavLink
            to="/candidate/home"
            className="flex items-center gap-2 text-xl font-semibold text-gray-900"
          >
            <FiBriefcase className="text-blue-600 text-2xl" />
            Jobpilot
          </NavLink>

          <div className="lg:hidden flex items-center gap-4">
            <NotificationsPanel />
            <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center text-sm font-semibold text-white">
              {candidate.profileImageUrl ? (
                <img
                  src={candidate.profileImageUrl}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                candidate.fullName.charAt(0)
              )}
            </div>
          </div>
        </div>

        <div className="sm:w-40 border border-gray-200 rounded-md px-3 py-3 flex items-center gap-2 text-sm">
          <span>🇮🇳</span>
          <span>India</span>
          <FiChevronDown className="ml-auto text-gray-400" />
        </div>

        <div className="hidden lg:flex items-center gap-5 lg:ml-auto">
          <NotificationsPanel />
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center text-sm font-semibold text-white">
            {candidate.profileImageUrl ? (
              <img
                src={candidate.profileImageUrl}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              candidate.fullName.charAt(0)
            )}
          </div>
        </div>
      </div>
    </header>
  );
}