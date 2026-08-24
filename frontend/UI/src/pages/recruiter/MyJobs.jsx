import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

import MyJobsTable from "../../components/recruiter/MyJobsTable";

import {
  fetchRecruiterJobs,
} from "../../services/recruiterJobService";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);

  const [statusFilter, setStatusFilter] =
    useState("All Jobs");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const jobsPerPage = 10;

  useEffect(() => {
    const loadRecruiterJobs = async () => {
      try {
        setError("");

        const recruiterJobs =
          await fetchRecruiterJobs();

        setJobs(recruiterJobs);
      } catch (requestError) {
        const errorMessage =
          requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load recruiter jobs.";

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecruiterJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    if (statusFilter === "All Jobs") {
      return jobs;
    }

    return jobs.filter(
      (job) => job.status === statusFilter
    );
  }, [jobs, statusFilter]);

  const totalPages = Math.ceil(
    filteredJobs.length / jobsPerPage
  );

  const paginatedJobs = useMemo(() => {
    const startIndex =
      (currentPage - 1) * jobsPerPage;

    return filteredJobs.slice(
      startIndex,
      startIndex + jobsPerPage
    );
  }, [filteredJobs, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            My Jobs{" "}
            <span className="font-normal text-gray-400">
              ({filteredJobs.length})
            </span>
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all your posted jobs and track
            applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            Job status
          </span>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Jobs</option>
            <option>Active</option>
            <option>Expire</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            Loading recruiter jobs...
          </div>
        ) : paginatedJobs.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-gray-700">
              No jobs found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              No recruiter jobs match the selected
              status.
            </p>
          </div>
        ) : (
          <MyJobsTable jobs={paginatedJobs} />
        )}
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() =>
              handlePageChange(currentPage - 1)
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-blue-600 hover:bg-blue-50 disabled:text-gray-300"
          >
            <FiArrowLeft />
          </button>

          {Array.from(
            {
              length: totalPages,
            },
            (_, index) => index + 1
          ).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() =>
                handlePageChange(page)
              }
              className={`h-10 w-10 rounded-full text-sm font-medium ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {String(page).padStart(2, "0")}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() =>
              handlePageChange(currentPage + 1)
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:text-gray-300"
          >
            <FiArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}