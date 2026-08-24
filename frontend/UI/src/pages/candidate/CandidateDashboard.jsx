import { useEffect, useState } from "react";
import { FiArrowRight, FiBriefcase, FiBookmark, FiBell } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import CandidateSidebar from "../../components/candidate/CandidateSidebar";
import DashboardStatCard from "../../components/candidate/DashboardStatCard";
import AppliedJobTable from "../../components/candidate/applications/AppliedJobTable";
import Loader from "../../components/common/Loader";

import { getAppliedJobs } from "../../services/jobApplicationService";
import { getFavoriteJobs } from "../../services/favoriteJobService";
import { getJobAlerts } from "../../services/jobAlertService";
import { getCandidateSettings, resolveCandidateProfileId } from "../../services/candidateSettingsService";
import { getAuthUser } from "../../utils/authStorage";

export default function CandidateDashboard() {
  const navigate = useNavigate();

  const authUser = getAuthUser();

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [favoriteJobsCount, setFavoriteJobsCount] = useState(0);
  const [jobAlertsCount, setJobAlertsCount] = useState(0);

  const [candidate, setCandidate] = useState({
    fullName: authUser?.name || "Candidate",
    profileImageUrl: "",
    profileCompleted: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const candidateProfileId = await resolveCandidateProfileId();

        const [applied, favorites, alerts, profile] = await Promise.all([
          getAppliedJobs(),
          getFavoriteJobs(),
          getJobAlerts(),
          getCandidateSettings(candidateProfileId),
        ]);
        setAppliedJobs(applied);
        setFavoriteJobsCount(favorites.length);
        setJobAlertsCount(alerts.length);

        setCandidate({
          fullName: authUser?.name || "Candidate",
          profileImageUrl: profile.profileImageUrl || "",
          profileCompleted: profile.profileCompleted || false,
        });
      } catch (error) {
        console.error("Dashboard loading failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardStats = [
    {
      id: "applied",
      title: "Applied jobs",
      value: appliedJobs.length,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      icon: FiBriefcase,
    },
    {
      id: "favorites",
      title: "Favorite jobs",
      value: favoriteJobsCount,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      icon: FiBookmark,
    },
    {
      id: "alerts",
      title: "Job Alerts",
      value: jobAlertsCount,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      icon: FiBell,
    },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row border-x border-gray-200">
        <CandidateSidebar />

        <section className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-gray-900">
              Hello, {candidate.fullName}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Here is your daily activities and job alerts
            </p>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                {dashboardStats.map((stat) => (
                  <DashboardStatCard key={stat.id} stat={stat} />
                ))}
              </div>

              {!candidate.profileCompleted && (
              <div className="bg-red-500 rounded-lg px-6 py-5 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="flex items-center gap-4">
                  {candidate.profileImageUrl ? (
                    <img
                      src={candidate.profileImageUrl}
                      alt="candidate"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-red-300 flex items-center justify-center text-white font-semibold">
                      {candidate.fullName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h2 className="text-white font-semibold">
                      Your profile editing is not completed.
                    </h2>

                    <p className="text-red-100 text-sm mt-1">
                      Complete your profile editing & build your custom Resume
                    </p>
                  </div>
                </div>

                  <NavLink
                    to="/candidate/settings"
                    className="bg-white text-red-500 px-5 py-3 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-red-50"
                  >
                    Edit Profile
                    <FiArrowRight />
                  </NavLink>
              </div>
              )}

              <AppliedJobTable
                jobs={appliedJobs.slice(0, 5)}
                showViewAll={true}
                onViewAll={() => navigate("/candidate/applied-jobs")}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}