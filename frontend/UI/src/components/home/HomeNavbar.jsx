import { NavLink, useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiPhone,
  FiChevronDown,
} from "react-icons/fi";

export default function HomeNavbar() {
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Job", path: "/candidate/find-job" },
    { name: "Employers", path: "/recruiter/dashboard" },
    { name: "Candidates", path: "/candidate/dashboard" },
    { name: "Pricing Plans", path: "/recruiter/plans-billing" },
    { name: "Customer Supports", path: "/candidate/support" },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="hidden lg:block bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-10 flex items-center justify-between">
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600 h-10 flex items-center font-medium"
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

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-5 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex items-center justify-between">
          <NavLink
            to="/"
            className="flex items-center gap-2 text-xl font-semibold text-gray-900"
          >
            <FiBriefcase className="text-blue-600 text-2xl" />
            Jobpilot
          </NavLink>

          <div className="lg:hidden flex gap-2">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-md px-4 py-3 flex items-center gap-2 text-sm">
          <span>🇮🇳</span>
          <select className="outline-none text-sm bg-white">
            <option>India</option>
            <option>USA</option>
            <option>UK</option>
            <option>Canada</option>
          </select>
        </div>

        <div className="hidden lg:flex items-center gap-3 lg:ml-auto">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2.5 border border-blue-600 text-blue-600 rounded-md font-semibold hover:bg-blue-50"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/recruiter/post-job")}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
          >
            Post A Jobs
          </button>
        </div>
      </div>
    </header>
  );
}