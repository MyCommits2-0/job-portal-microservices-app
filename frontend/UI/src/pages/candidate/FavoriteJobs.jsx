import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import CandidateSidebar from "../../components/candidate/CandidateSidebar";
import FavoriteJobRow from "../../components/candidate/FavoriteJobRow";
import Loader from "../../components/common/Loader";
import { getFavoriteJobs } from "../../services/favoriteJobService.js";

export default function FavoriteJobs() {
  const [favoriteJobs, setFavoriteJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 10;

  useEffect(() => {
    const fetchFavoriteJobs = async () => {
      try {
        setLoading(true);

        const data = await getFavoriteJobs();

        setFavoriteJobs(data);
      } catch (error) {
        console.error("Failed to fetch favorite jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteJobs();
  }, []);

  const totalPages = Math.ceil(favoriteJobs.length / jobsPerPage);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    return favoriteJobs.slice(startIndex, startIndex + jobsPerPage);
  }, [favoriteJobs, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row border-x border-gray-200">
        <CandidateSidebar />

        <section className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-5">
            <h1 className="text-lg font-semibold text-gray-900">
              Favorite Jobs{" "}
              <span className="text-gray-400 font-normal">
                ({favoriteJobs.length})
              </span>
            </h1>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                {paginatedJobs.map((job) => (
                  <FavoriteJobRow
                    key={job.id}
                    job={job}
                    onRemove={(id) =>
                      setFavoriteJobs((prev) => prev.filter((favorite) => favorite.id !== id))
                    }
                  />
                ))}
              </div>

              {favoriteJobs.length === 0 && (
                <div className="text-center py-16">
                  <h2 className="text-xl font-semibold text-gray-900">
                    No favorite jobs found
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Jobs you save will appear here.
                  </p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-10 flex justify-center items-center gap-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 disabled:text-gray-300"
                  >
                    <FiArrowLeft />
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
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
                  ))}

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
          )}
        </section>
      </div>
    </div>
  );
}