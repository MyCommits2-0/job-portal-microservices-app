import { createApiClient } from "../utils/httpClient";

const API_BASE_URL =
  import.meta.env.VITE_APPLICATION_SERVICE_URL ||
  "http://localhost:8080/applications";

// createApiClient (not a bare axios instance) so every call carries the signed-in
// user's access token; candidateId itself is never sent by the frontend - the gateway
// derives it from the token and injects X-User-Id before Application-service sees it.
const api = createApiClient(API_BASE_URL);

function toAppliedJob(app) {
  const salary =
    app.minSalarySnapshot != null && app.maxSalarySnapshot != null
      ? `${app.minSalarySnapshot} - ${app.maxSalarySnapshot}`
      : app.minSalarySnapshot ?? app.maxSalarySnapshot ?? "";

  return {
    id: app.id,
    applicationId: app.id,
    jobId: app.jobId,
    title: app.jobTitleSnapshot,
    company: app.companyNameSnapshot,
    location: app.jobLocationSnapshot,
    type: app.jobTypeSnapshot,
    salary,
    note: app.note,
    status: app.status,
    dateApplied: app.appliedAt,
  };
}

export async function applyToJob(jobId, { resumeId, note } = {}) {
  const response = await api.post(`/jobs/${jobId}/apply`, { resumeId, note });
  return response.data;
}

export async function getAppliedJobs() {
  const response = await api.get("/candidate/my-applications");
  return response.data.map(toAppliedJob).sort(
    (a, b) => new Date(b.dateApplied) - new Date(a.dateApplied)
  );
}

// In-memory cache of this session's applied jobIds, so components that only need a
// yes/no ("have I applied to job X") don't each trigger their own network call.
let appliedJobIdsPromise = null;

export function invalidateAppliedJobsCache() {
  appliedJobIdsPromise = null;
}

export async function hasAppliedToJob(jobId) {
  if (jobId === undefined || jobId === null) return false;

  if (!appliedJobIdsPromise) {
    appliedJobIdsPromise = getAppliedJobs()
      .then((jobs) => new Set(jobs.map((job) => job.jobId)))
      .catch((error) => {
        appliedJobIdsPromise = null;
        throw error;
      });
  }

  const appliedJobIds = await appliedJobIdsPromise;
  return appliedJobIds.has(jobId);
}

export async function getApplicationDetails(applicationId) {
  const response = await api.get(`/${applicationId}`);
  return response.data;
}

export async function getApplicationHistory(applicationId) {
  const response = await api.get(`/${applicationId}/history`);
  return response.data;
}

export async function getCandidateDashboardCounts() {
  const response = await api.get("/candidate/dashboard-counts");
  return response.data;
}

export async function withdrawApplication(applicationId) {
  const response = await api.patch(`/${applicationId}/withdraw`);
  invalidateAppliedJobsCache();
  return response.data;
}
