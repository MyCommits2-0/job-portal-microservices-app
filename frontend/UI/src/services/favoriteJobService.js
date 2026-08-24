import { getJobDetails } from "./jobApi.js";
import { getCompanyInitials, getCompanyLogoStyle, formatJobType } from "../utils/jobDisplay.js";

const STORAGE_KEY = "favoriteJobIds";

function readIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function computeRemaining(expirationDate) {
  if (!expirationDate) return "No deadline";

  const diffDays = Math.ceil(
    (new Date(expirationDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "Deadline expired";
  if (diffDays === 0) return "Expires today";
  return `${diffDays} day${diffDays === 1 ? "" : "s"} left`;
}

function toRowShape(job) {
  const logoStyle = getCompanyLogoStyle(job.id);
  const expired = Boolean(
    job.expirationDate && new Date(job.expirationDate) < new Date()
  );

  return {
    id: job.id,
    title: job.title,
    company: job.companyName,
    type: formatJobType(job.jobType || ""),
    location: [job.city, job.country].filter(Boolean).join(", "),
    salary: `₹${job.minSalary ?? "-"} - ₹${job.maxSalary ?? "-"}`,
    remaining: computeRemaining(job.expirationDate),
    expired,
    logoText: getCompanyInitials(job.companyName || ""),
    logoBg: logoStyle.bg,
    logoColor: logoStyle.text,
  };
}

// There is no backend "favorite job" endpoint yet, so which job ids are
// favorited is still tracked locally. The job details behind each id are no
// longer a hardcoded catalog though - they're fetched live from the real
// Jobs-service so favorited jobs always show accurate, up-to-date info.
export const getFavoriteJobs = async () => {
  const ids = readIds();

  const results = await Promise.allSettled(ids.map((id) => getJobDetails(id)));

  return results
    .filter((result) => result.status === "fulfilled")
    .map((result) => toRowShape(result.value));
};

export function isJobFavorited(jobId) {
  return readIds().includes(jobId);
}

export function toggleFavoriteJob(jobId) {
  const ids = readIds();
  const isFavorited = ids.includes(jobId);

  const updated = isFavorited
    ? ids.filter((id) => id !== jobId)
    : [...ids, jobId];

  writeIds(updated);
  return !isFavorited;
}

export function removeFavoriteJob(jobId) {
  writeIds(readIds().filter((id) => id !== jobId));
}

export function getFavoriteJobCount() {
  return readIds().length;
}
