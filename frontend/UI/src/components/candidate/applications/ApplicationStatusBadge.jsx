import { FiCheck, FiStar, FiCalendar, FiAward, FiX, FiRotateCcw } from "react-icons/fi";

// Keys match Application-service's ApplicationStatus enum values exactly.
const statusStyles = {
  APPLIED: { icon: FiCheck, className: "text-blue-600 bg-blue-50", label: "Applied" },
  SHORTLISTED: { icon: FiStar, className: "text-purple-600 bg-purple-50", label: "Shortlisted" },
  INTERVIEW: { icon: FiCalendar, className: "text-green-600 bg-green-50", label: "Interview" },
  HIRED: { icon: FiAward, className: "text-emerald-600 bg-emerald-50", label: "Hired" },
  REJECTED: { icon: FiX, className: "text-red-600 bg-red-50", label: "Rejected" },
  WITHDRAWN: { icon: FiRotateCcw, className: "text-gray-600 bg-gray-100", label: "Withdrawn" },
};

export default function ApplicationStatusBadge({ status }) {
  const style = statusStyles[status] || statusStyles.APPLIED;
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${style.className}`}
    >
      <Icon />
      {style.label}
    </span>
  );
}
