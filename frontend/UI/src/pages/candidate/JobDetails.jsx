import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getJobDetails } from "../../services/jobApi";

import {
  FiMapPin,
  FiDollarSign,
  FiBriefcase,
  FiBookmark,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";

import ApplyJobModal from "../../components/candidate/ApplyJobModal";
import {
  getCompanyInitials,
  getCompanyLogoStyle,
  formatJobType,
} from "../../utils/jobDisplay.js";
import { isJobFavorited, toggleFavoriteJob } from "../../services/favoriteJobService.js";
import { hasAppliedToJob } from "../../services/jobApplicationService.js";

export default function JobDetails() {
  const { jobId } = useParams();

const [job, setJob] = useState(null);

  const [isFavorited, setIsFavorited] = useState(() => (job ? isJobFavorited(job.id) : false));
  const [applied, setApplied] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
  loadJob();
}, [jobId]);

  useEffect(() => {
    if (!job) return;
    let cancelled = false;
    hasAppliedToJob(job.id).then((result) => {
      if (!cancelled) setApplied(result);
    });
    return () => {
      cancelled = true;
    };
  }, [job]);

const loadJob = async () => {
  try {
    const data = await getJobDetails(jobId);

    setJob({
      ...data,
      company: data.companyName,
      location: data.remote
        ? "Remote"
        : [data.city, data.state, data.country].filter(Boolean).join(", "),
      salary: `₹${data.minSalary ?? "-"} - ₹${data.maxSalary ?? "-"}`,
      type: data.jobType,
    });
  } catch (e) {
    console.error(e);
  }
};

  if (job === null) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Job not found</h1>
        <p className="mt-2 text-sm text-gray-500">
          This job may have been removed or the link is incorrect.
        </p>
        <Link
          to="/candidate/find-job"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <FiArrowLeft /> Back to Find Job
        </Link>
      </div>
    );
  }

  const logoStyle = getCompanyLogoStyle(job.id);

  const handleToggleFavorite = () => {
    setIsFavorited(toggleFavoriteJob(job.id));
  };

  const handleApplied = () => {
    setApplied(true);
    setIsApplyModalOpen(false);
  };

  return (
    <div className="bg-white">
      <section className="bg-gray-100 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <Link
            to="/candidate/find-job"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-3"
          >
            <FiArrowLeft /> Back to Find Job
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div
              className={`w-14 h-14 rounded-md flex items-center justify-center overflow-hidden font-semibold text-lg ${logoStyle.bg} ${logoStyle.text}`}
            >
              {job.companyLogoUrl ? (
                <img
                  src={job.companyLogoUrl}
                  alt={job.company}
                  className="w-full h-full object-cover"
                />
              ) : (
                getCompanyInitials(job.company)
              )}
            </div>

            <div>
              <h1 className="text-xl font-semibold text-gray-900">{job.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {job.company} • {job.location}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h2>
            <p className="text-sm leading-6 text-gray-600 whitespace-pre-line">
              {job.description || "No description provided for this job."}
            </p>
          </div>

          {job.benefits?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h2>
              <ul className="space-y-2">
                {job.benefits.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <FiCheckCircle className="mt-0.5 shrink-0 text-blue-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Job Overview</h3>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-blue-50 p-2 text-blue-600"><FiBriefcase /></span>
                <div>
                  <p className="text-xs text-gray-400">Job Type</p>
                  <p className="font-medium text-gray-900">{formatJobType(job.type)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-md bg-blue-50 p-2 text-blue-600"><FiDollarSign /></span>
                <div>
                  <p className="text-xs text-gray-400">Salary</p>
                  <p className="font-medium text-gray-900">{job.salary}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-md bg-blue-50 p-2 text-blue-600"><FiMapPin /></span>
                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="font-medium text-gray-900">{job.location}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              {applied ? (
                <button
                  disabled
                  className="flex-1 flex items-center justify-center gap-2 rounded-md bg-green-50 px-5 py-3 font-semibold text-green-600"
                >
                  <FiCheckCircle /> Applied
                </button>
              ) : (
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="flex-1 rounded-md bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Apply Now
                </button>
              )}

              <button
                onClick={handleToggleFavorite}
                aria-label="Save job"
                className={`flex h-12 w-12 items-center justify-center rounded-md border transition ${
                  isFavorited
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-400 hover:text-blue-600"
                }`}
              >
                <FiBookmark className={isFavorited ? "fill-current" : ""} />
              </button>
            </div>
          </div>
        </aside>
      </section>

      <ApplyJobModal
        isOpen={isApplyModalOpen}
        job={job}
        onClose={() => setIsApplyModalOpen(false)}
        onApplied={handleApplied}
      />
    </div>
  );
}
