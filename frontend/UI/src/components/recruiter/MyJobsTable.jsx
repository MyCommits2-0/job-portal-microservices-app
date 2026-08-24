import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";


import {
  FiCheckCircle,
  FiXCircle,
  FiUsers,
  FiMoreVertical,
  FiEye,
  FiTrendingUp,
} from "react-icons/fi";

export default function MyJobsTable({ jobs }) {
  const [openMenuId, setOpenMenuId] = useState(null);
    const navigate = useNavigate();
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full min-w-[850px] text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th className="text-left font-medium px-5 py-3">Jobs</th>
            <th className="text-left font-medium px-5 py-3">Status</th>
            <th className="text-left font-medium px-5 py-3">Applications</th>
            <th className="text-left font-medium px-5 py-3">Actions</th>
            <th className="text-right font-medium px-5 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.id}
              className="border-t border-gray-200 hover:bg-blue-50 transition"
            >
              <td className="px-5 py-5">
                <h3 className="font-medium text-gray-900">
                  {job.jobTitle}
                </h3>
                <p className="text-gray-500 mt-1">
                  {job.jobType} <span className="mx-2">•</span>{" "}
                  {job.expirationDate || "4 days remaining"}
                </p>
              </td>

              <td className="px-5 py-5">
                {job.status === "Active" ? (
                  <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                    <FiCheckCircle />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-500 font-medium">
                    <FiXCircle />
                    Expire
                  </span>
                )}
              </td>

              <td className="px-5 py-5 text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <FiUsers />
                  {job.applications || 0} Applications
                </span>
              </td>

              <td className="px-5 py-5">
               <button
                onClick={() => navigate(`/recruiter/applications/${job.id}`)}
                className="px-5 py-3 rounded-md font-semibold bg-gray-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                >View Applications</button>
              </td>

              <td className="px-5 py-5 text-right relative">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === job.id ? null : job.id)
                  }
                  className="text-gray-500 hover:text-blue-600"
                >
                  <FiMoreVertical />
                </button>

                {openMenuId === job.id && (
                  <div className="absolute right-8 top-12 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-20 text-left">
                    <button className="w-full px-4 py-3 text-sm flex items-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100">
                      <FiTrendingUp />
                      Promote Job
                    </button>

                    <button className="w-full px-4 py-3 text-sm flex items-center gap-2 text-gray-600 hover:bg-gray-50">
                      <FiEye />
                      View Detail
                    </button>

                    <button className="w-full px-4 py-3 text-sm flex items-center gap-2 text-gray-600 hover:bg-gray-50">
                      <FiXCircle />
                      Make it Expire
                    </button>

                    <button
                  onClick={() => navigate(`/recruiter/edit-job/${job.id}`)}
                  className="w-full px-4 py-3 text-sm flex items-center gap-2 text-blue-600 hover:bg-blue-50"
                >
                  <FiEdit2 />
                  Edit Job
                </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}