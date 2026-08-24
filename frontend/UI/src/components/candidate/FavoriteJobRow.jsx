import { useEffect, useState } from "react";
import {
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiBookmark,
  FiArrowRight,
  FiXCircle,
  FiCheckCircle,
} from "react-icons/fi";

import ApplyJobModal from "./ApplyJobModal";
import { toggleFavoriteJob } from "../../services/favoriteJobService";
import { hasAppliedToJob } from "../../services/jobApplicationService";

export default function FavoriteJobRow({ job, onRemove }) {
  const [applied, setApplied] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    hasAppliedToJob(job.id).then((result) => {
      if (!cancelled) setApplied(result);
    });
    return () => {
      cancelled = true;
    };
  }, [job.id]);

  const handleRemoveFavorite = () => {
    toggleFavoriteJob(job.id);
    onRemove?.(job.id);
  };

  return (
    <div
      className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-4 sm:px-5 py-4 border-b border-gray-200 transition ${
        job.highlighted
          ? "border border-blue-500 rounded-md shadow-sm"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-md flex items-center justify-center font-semibold ${job.logoBg} ${job.logoColor}`}
        >
          {job.logoText}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              {job.title}
            </h3>

            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
              {job.type}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FiMapPin />
              {job.location}
            </span>

            <span className="flex items-center gap-1">
              <FiDollarSign />
              {job.salary}
            </span>

            <span
              className={`flex items-center gap-1 ${
                job.expired ? "text-red-500" : "text-gray-500"
              }`}
            >
              {job.expired ? <FiXCircle /> : <FiCalendar />}
              {job.remaining}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={handleRemoveFavorite}
          aria-label="Remove from favorites"
          className="text-gray-900 hover:text-red-500"
        >
          <FiBookmark className="text-lg fill-current" />
        </button>

        {job.expired ? (
          <button
            disabled
            className="px-5 py-3 rounded-md bg-gray-100 text-gray-400 font-medium cursor-not-allowed"
          >
            Deadline Expired
          </button>
        ) : applied ? (
          <span className="flex items-center gap-2 px-5 py-3 rounded-md bg-green-50 font-semibold text-green-600">
            <FiCheckCircle /> Applied
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setIsApplyModalOpen(true)}
            className={`px-5 py-3 rounded-md font-semibold flex items-center gap-2 transition ${
              job.highlighted
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
            }`}
          >
            Apply Now
            <FiArrowRight />
          </button>
        )}
      </div>

      <ApplyJobModal
        isOpen={isApplyModalOpen}
        job={job}
        onClose={() => setIsApplyModalOpen(false)}
        onApplied={() => {
          setApplied(true);
          setIsApplyModalOpen(false);
        }}
      />
    </div>
  );
}
