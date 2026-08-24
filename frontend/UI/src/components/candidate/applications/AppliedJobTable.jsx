import { useNavigate } from "react-router-dom";
import { FiMapPin, FiArrowRight, FiInbox } from "react-icons/fi";

import ApplicationStatusBadge from "./ApplicationStatusBadge";
import { getCompanyInitials, getCompanyLogoStyle } from "../../../utils/jobDisplay";

function formatDateApplied(dateApplied) {
  const date = new Date(dateApplied);
  if (Number.isNaN(date.getTime())) return dateApplied;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const WITHDRAWABLE_STATUSES = new Set(["APPLIED", "SHORTLISTED", "INTERVIEW"]);

export default function AppliedJobTable({ jobs, showViewAll = false, onViewAll, onWithdraw }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">
          {showViewAll ? "Recently Applied" : "Applied Jobs"}
        </h2>

        {showViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
          >
            View all
            <FiArrowRight />
          </button>
        )}
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <FiInbox className="text-3xl text-gray-300" />
          <p className="text-sm text-gray-500">No applications yet. Jobs you apply to will show up here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left font-medium px-5 py-3">Job</th>
                <th className="text-left font-medium px-5 py-3">Date Applied</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
                <th className="text-right font-medium px-5 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => {
                const logoStyle = getCompanyLogoStyle(job.jobId ?? job.id);

                return (
                  <tr
                    key={job.id}
                    className="border-t border-gray-200 hover:bg-blue-50 transition"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-md ${logoStyle.bg} ${logoStyle.text} flex items-center justify-center font-semibold`}
                        >
                          {getCompanyInitials(job.company)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">
                              {job.title}
                            </h3>

                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                              {job.type}
                            </span>
                          </div>

                          <p className="text-gray-500 flex items-center gap-2">
                            <FiMapPin />
                            {job.location}
                            <span>•</span>
                            <span>{job.salary}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatDateApplied(job.dateApplied)}
                    </td>

                    <td className="px-5 py-4">
                      <ApplicationStatusBadge status={job.status} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onWithdraw && WITHDRAWABLE_STATUSES.has(job.status) && (
                          <button
                            type="button"
                            onClick={() => onWithdraw(job.applicationId ?? job.id)}
                            className="bg-red-50 text-red-500 px-4 py-2 rounded-md font-medium hover:bg-red-500 hover:text-white transition"
                          >
                            Withdraw
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={!Number.isFinite(job.jobId)}
                          onClick={() => navigate(`/candidate/job/${job.jobId}`)}
                          className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-600 hover:text-white transition disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-50 disabled:hover:text-blue-600"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
