import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCheck, FiArrowRight } from "react-icons/fi";

export default function AppliedJobTable({ jobs, showViewAll = false, onViewAll }) {
  const navigate = useNavigate();

  console.log("Jobs received:", jobs);
  console.log("appliedJobs state:", appliedJobs);

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">
          {showViewAll ? "Recently Applied" : "Applied Jobs"}
        </h2>

        {showViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
          >
            View all
            <FiArrowRight />
          </button>
        )}
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-5 py-3">Job</th>
              <th className="text-left px-5 py-3">Date Applied</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
  {jobs.map((job) => (
    <tr key={job.id}>
      <td>{job.title}</td>
      <td>{job.company}</td>
      <td>{job.status}</td>
      <td>{job.dateApplied}</td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
}