import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrendingUp } from "react-icons/fi";

import RecentlyPostedJobsTable from "../../components/recruiter/RecentlyPostedJobsTable";
import RecruiterStatCard from "../../components/recruiter/RecruiterStatCard";

import {
  getRecruiterStats,
} from "../../data/recruiterDashboardData";

import {
  getRecruiterDashboardCounts,
} from "../../services/recruiterDashboardService";

const initialDashboardData = {
  activeJobs: 0,
  applications: 0,
  shortlisted: 0,
  hired: 0,
  recentlyPostedJobs: [],
};

export default function RecruiterDashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] =
    useState(initialDashboardData);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError("");

        const response =
          await getRecruiterDashboardCounts();

        setDashboardData({
          activeJobs: response.activeJobs ?? 0,
          applications: response.applications ?? 0,
          shortlisted: response.shortlisted ?? 0,
          hired: response.hired ?? 0,
          recentlyPostedJobs:
            response.recentlyPostedJobs ?? [],
        });
      } catch (requestError) {
        const errorMessage =
          requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load recruiter dashboard.";

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const recruiterStats =
    getRecruiterStats(dashboardData);

  return (
    <div>
      <section className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white sm:px-8">
        <p className="text-sm font-medium text-blue-100">
          Welcome back
        </p>

        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
          Recruiter Dashboard
        </h1>

        <p className="mt-2 text-blue-100">
          Here is your daily recruitment activity and
          application summary.
        </p>
      </section>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {recruiterStats.map((stat) => (
          <RecruiterStatCard
            key={stat.id}
            title={stat.title}
            value={isLoading ? "..." : stat.value}
            icon={stat.icon}
            bg={stat.bg}
            iconBg={stat.iconBg}
          />
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recently Posted Jobs
            </h2>

            <p className="text-sm text-gray-500">
              Track your latest job postings and
              applications.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/recruiter/my-jobs")
            }
            className="hidden items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 sm:inline-flex"
          >
            View all
            <FiTrendingUp />
          </button>
        </div>

        {isLoading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            Loading recently posted jobs...
          </div>
        ) : (
          <RecentlyPostedJobsTable
            jobs={dashboardData.recentlyPostedJobs}
          />
        )}
      </section>
    </div>
  );
}