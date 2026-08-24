import { useEffect, useMemo, useState } from "react";
import { FiInfo, FiArrowLeft, FiArrowRight } from "react-icons/fi";

import SavedCandidateRow from "../../components/recruiter/SavedCandidateRow";
import { getSavedCandidates } from "../../services/recruiterCandidateService";

export default function SavedCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const candidatesPerPage = 10;

  const fetchCandidates = async () => {
    try {
      const data = await getSavedCandidates();
      setCandidates(data);
    } catch (error) {
      console.error("Failed to fetch saved candidates:", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const totalPages = Math.ceil(candidates.length / candidatesPerPage);

  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * candidatesPerPage;
    return candidates.slice(startIndex, startIndex + candidatesPerPage);
  }, [candidates, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Saved Candidates
        </h1>

        <p className="text-sm text-gray-500 flex items-center gap-2">
          <FiInfo />
          All of the candidates are visible until 24 March, 2025
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-lg overflow-visible">
        {paginatedCandidates.map((candidate) => (
          <SavedCandidateRow
            key={candidate.id}
            candidate={candidate}
            onUnsaved={fetchCandidates}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 disabled:text-gray-300"
          >
            <FiArrowLeft />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-full text-sm font-medium ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {String(page).padStart(2, "0")}
              </button>
            )
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:text-gray-300"
          >
            <FiArrowRight />
          </button>
        </div>
      )}
    </>
  );
}