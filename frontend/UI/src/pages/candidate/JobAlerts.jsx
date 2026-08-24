import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiEdit2 } from "react-icons/fi";

import CandidateSidebar from "../../components/candidate/CandidateSidebar";
import JobAlertRow from "../../components/candidate/JobAlertRow";
import Loader from "../../components/common/Loader";
import { getJobAlerts } from "../../services/jobAlertService.js";

export default function JobAlerts() {
  const [jobAlerts, setJobAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);


  const jobsPerPage = 10;

  useEffect(() => {
    const fetchJobAlerts = async () => {
      try {
        setLoading(true);
        const data = await getJobAlerts();
        setJobAlerts(data);
      } finally {
        setLoading(false);
      }
    };

    fetchJobAlerts();
  }, []);

  const totalPages = Math.ceil(jobAlerts.length / jobsPerPage);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    return jobAlerts.slice(startIndex, startIndex + jobsPerPage);
  }, [jobAlerts, currentPage]);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row border-x border-gray-200">
        <CandidateSidebar />

        <section className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-5 flex justify-between items-center">
            <h1 className="text-lg font-semibold">
              Job Alerts ({jobAlerts.length})
            </h1>

            <button className="flex items-center gap-2 text-sm">
              <FiEdit2 />
              Edit Job Alerts
            </button>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                {paginatedJobs.map((job) => (
                  <JobAlertRow key={job.id} job={job} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                  >
                    <FiArrowLeft />
                  </button>

                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FiArrowRight />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}