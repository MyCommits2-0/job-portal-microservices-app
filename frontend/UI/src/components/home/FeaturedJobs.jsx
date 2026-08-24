import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiBookmark } from "react-icons/fi";

import { jobs } from "../../data/jobs";
import { getCompanyInitials, getCompanyLogoStyle } from "../../utils/jobDisplay";
import { isJobFavorited, toggleFavoriteJob } from "../../services/favoriteJobService";

const featuredJobs = jobs.slice(0, 9);

export default function FeaturedJobs() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-semibold text-gray-900">
            Featured job
          </h2>

          <button
            type="button"
            onClick={() => navigate("/candidate/find-job")}
            className="text-blue-600 font-semibold text-sm hover:underline"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {featuredJobs.map((job) => (
            <FeaturedJobCard key={job.id} job={job} onOpen={() => navigate(`/candidate/job/${job.id}`)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedJobCard({ job, onOpen }) {
  const [isFavorited, setIsFavorited] = useState(() => isJobFavorited(job.id));
  const logoStyle = getCompanyLogoStyle(job.id);

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorited(toggleFavoriteJob(job.id));
  };

  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
      className="border border-gray-200 rounded-lg p-5 hover:border-blue-500 hover:shadow-md transition bg-white cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{job.title}</h3>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs font-semibold bg-green-50 text-green-600 px-2 py-1 rounded">
              {job.type}
            </span>

            <span className="text-xs text-gray-500">
              Salary: {job.salary}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={isFavorited ? "Remove from favorites" : "Save job"}
          className={isFavorited ? "text-blue-600" : "text-gray-400 hover:text-blue-600"}
        >
          <FiBookmark className={isFavorited ? "fill-current" : ""} />
        </button>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <div className={`w-10 h-10 rounded-md flex items-center justify-center font-bold ${logoStyle.bg} ${logoStyle.text}`}>
          {getCompanyInitials(job.company)}
        </div>

        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {job.company}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <FiMapPin />
            {job.location}
          </p>
        </div>
      </div>
    </div>
  );
}
