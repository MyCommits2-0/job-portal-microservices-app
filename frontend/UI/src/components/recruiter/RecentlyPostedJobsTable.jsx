import { useState } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiUsers,
  FiMoreVertical,
  FiEye,
  FiTrendingUp,
} from "react-icons/fi";

const formatJobType = (jobType) => {
  if (!jobType) {
    return "Not specified";
  }

  return jobType
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

const formatRemainingTime = (expirationDate) => {
  if (!expirationDate) {
    return "No expiration date";
  }

  const today = new Date();
  const expiry = new Date(`${expirationDate}T00:00:00`);

  today.setHours(0, 0, 0, 0);

  const differenceInMilliseconds =
    expiry.getTime() - today.getTime();

  const remainingDays = Math.ceil(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );

  if (remainingDays < 0) {
    return "Expired";
  }

  if (remainingDays === 0) {
    return "Expires today";
  }

  if (remainingDays === 1) {
    return "1 day remaining";
  }

  return `${remainingDays} days remaining`;
};

const getStatusDetails = (status) => {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Active",
        className: "text-green-600",
        icon: FiCheckCircle,
      };

    case "CLOSED":
      return {
        label: "Closed",
        className: "text-red-500",
        icon: FiXCircle,
      };

    case "DELETED":
      return {
        label: "Deleted",
        className: "text-gray-500",
        icon: FiXCircle,
      };

    default:
      return {
        label: status || "Unknown",
        className: "text-gray-500",
        icon: FiXCircle,
      };
  }
};

export default function RecentlyPostedJobsTable({
  jobs = [],
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleRowClick = (jobId) => {
    setOpenMenuId(
      openMenuId === jobId ? null : jobId
    );
  };

  if (jobs.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="font-medium text-gray-700">
          No jobs posted yet
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Your most recently posted jobs will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-5 py-3 text-left font-medium">
              Jobs
            </th>

            <th className="px-5 py-3 text-left font-medium">
              Status
            </th>

            <th className="px-5 py-3 text-left font-medium">
              Applications
            </th>

            <th className="px-5 py-3 text-left font-medium">
              Actions
            </th>

            <th className="px-5 py-3 text-right font-medium">
            </th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => {
            const isMenuOpen = openMenuId === job.id;

            const statusDetails =
              getStatusDetails(job.status);

            const StatusIcon = statusDetails.icon;

            return (
              <tr
                key={job.id}
                onClick={() => handleRowClick(job.id)}
                className={`cursor-pointer border-t border-gray-200 transition hover:bg-blue-50 ${
                  isMenuOpen
                    ? "bg-blue-50 outline outline-1 outline-blue-500"
                    : ""
                }`}
              >
                <td className="px-5 py-5">
                  <h3 className="font-medium text-gray-900">
                    {job.title}
                  </h3>

                  <p className="mt-1 text-gray-500">
                    {formatJobType(job.jobType)}

                    <span className="mx-2">•</span>

                    {formatRemainingTime(
                      job.expirationDate
                    )}
                  </p>
                </td>

                <td className="px-5 py-5">
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${statusDetails.className}`}
                  >
                    <StatusIcon />
                    {statusDetails.label}
                  </span>
                </td>

                <td className="px-5 py-5 text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <FiUsers />

                    {job.applicationCount ?? 0} Applications
                  </span>
                </td>

                <td className="px-5 py-5">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      console.log(
                        "View applications:",
                        job.id
                      );
                    }}
                    className={`rounded-md px-5 py-3 font-semibold transition ${
                      isMenuOpen
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-blue-600 hover:bg-blue-600 hover:text-white"
                    }`}
                  >
                    View Applications
                  </button>
                </td>

                <td className="relative px-5 py-5 text-right">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRowClick(job.id);
                    }}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <FiMoreVertical />
                  </button>

                  {isMenuOpen && (
                    <div
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                      className="absolute right-8 top-12 z-20 w-48 rounded-md border border-gray-200 bg-white text-left shadow-lg"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          console.log(
                            "Promote Job:",
                            job.id
                          )
                        }
                        className="flex w-full items-center gap-2 bg-blue-50 px-4 py-3 text-sm text-blue-600 hover:bg-blue-100"
                      >
                        <FiTrendingUp />
                        Promote Job
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          console.log(
                            "View Detail:",
                            job.id
                          )
                        }
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
                      >
                        <FiEye />
                        View Detail
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          console.log(
                            "Mark as expired:",
                            job.id
                          )
                        }
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
                      >
                        <FiXCircle />
                        Mark as expired
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}