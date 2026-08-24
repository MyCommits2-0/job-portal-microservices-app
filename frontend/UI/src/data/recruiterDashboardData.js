import {
  FiBriefcase,
  FiCheckCircle,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

export const getRecruiterStats = (
  dashboardCounts
) => [
  {
    id: 1,
    title: "Active Jobs",
    value: dashboardCounts.activeJobs,
    icon: FiBriefcase,
    bg: "bg-blue-50",
    iconBg: "bg-blue-600",
  },
  {
    id: 2,
    title: "Applications",
    value: dashboardCounts.applications,
    icon: FiUsers,
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-500",
  },
  {
    id: 3,
    title: "Shortlisted",
    value: dashboardCounts.shortlisted,
    icon: FiCheckCircle,
    bg: "bg-green-50",
    iconBg: "bg-green-600",
  },
  {
    id: 4,
    title: "Hired",
    value: dashboardCounts.hired,
    icon: FiUserCheck,
    bg: "bg-purple-50",
    iconBg: "bg-purple-600",
  },
];