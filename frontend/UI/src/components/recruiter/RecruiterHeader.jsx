import { NavLink, useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiBell,
  FiPhone,
  FiChevronDown,
} from "react-icons/fi";

export default function RecruiterHeader() {
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Candidate", path: "/recruiter/find-candidate" },
    { name: "Dashboard", path: "/recruiter/dashboard" },
    { name: "My Jobs", path: "/recruiter/my-jobs" },
    { name: "Customer Supports", path: "/recruiter/support" },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
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
              <span>+1-202-555-0178</span>
            </div>

            <div className="flex items-center gap-2">
              <span>🇺🇸</span>
              <span>English</span>
              <FiChevronDown />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-5 flex items-center justify-between">
        <NavLink
          to="/recruiter/dashboard"
          className="flex items-center gap-2 text-xl font-semibold text-gray-900"
        >
          <FiBriefcase className="text-blue-600 text-2xl" />
          Jobpilot
        </NavLink>

        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate("/recruiter/post-job")}
            className="hidden sm:block border border-blue-600 text-blue-600 px-5 py-2.5 rounded-md font-semibold hover:bg-blue-50"
          >
            Post A Jobs
          </button>

          <div className="relative">
            <FiBell className="text-gray-500 text-xl" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
        </div>
      </div>
    </header>
  );
}