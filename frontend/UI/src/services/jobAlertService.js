import { getHomeJobs } from "./jobApi.js";
import { getCompanyInitials, getCompanyLogoStyle, formatJobType } from "../utils/jobDisplay.js";

const SAVED_KEY = "savedJobAlertIds";

function readSavedIds() {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeSavedIds(ids) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
}

function toRowShape(job, savedIds) {
  const logoStyle = getCompanyLogoStyle(job.id);

  return {
    id: job.id,
    title: job.title,
    company: job.companyName,
    type: formatJobType(job.jobType || ""),
    location: [job.city, job.country].filter(Boolean).join(", "),
    salary: `₹${job.minSalary ?? "-"} - ₹${job.maxSalary ?? "-"}`,
    remaining: "Recently posted",
    logoText: getCompanyInitials(job.companyName || ""),
    logoBg: logoStyle.bg,
    logoColor: logoStyle.text,
    saved: savedIds.includes(job.id),
  };
}

// The feed itself (which jobs show up, newest-first, capped) is entirely server-driven -
// see Jobs-service's /jobs/home. "Saved" is still local-only since there's no backend
// endpoint for it, same reasoning as favoriteJobService.
export const getJobAlerts = async () => {
  const jobs = await getHomeJobs();
  const savedIds = readSavedIds();

  return jobs.map((job) => toRowShape(job, savedIds));
};

export const getJobAlertCount = async () => {
  const jobs = await getHomeJobs();
  return jobs.length;
};

export const getSavedJobAlertCount = () => {
  return readSavedIds().length;
};

export function toggleJobAlertSaved(jobId) {
  const ids = readSavedIds();
  const isSaved = ids.includes(jobId);

  const updated = isSaved
    ? ids.filter((id) => id !== jobId)
    : [...ids, jobId];

  writeSavedIds(updated);
  return !isSaved;
}
