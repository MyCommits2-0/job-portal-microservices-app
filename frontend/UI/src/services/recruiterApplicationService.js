import { createApiClient } from "../utils/httpClient";

const API_BASE_URL =
  import.meta.env.VITE_APPLICATION_SERVICE_URL ||
  "http://localhost:8080/applications";

// createApiClient (not a bare axios instance) so every call carries the signed-in
// recruiter's access token; recruiterId itself is never sent by the frontend - the
// gateway derives it from the token and injects X-User-Id before Application-service
// sees it.
const api = createApiClient(API_BASE_URL);

export const getColumns = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}/columns`);
  return response.data;
};

export const getApplicationsForJob = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data;
};

// Combined fetch used by the Applications board page.
export const getRecruiterApplications = async (jobId) => {
  const [columns, applications] = await Promise.all([
    getColumns(jobId),
    getApplicationsForJob(jobId),
  ]);

  return { columns, applications };
};

export const createColumn = async (jobId, columnName) => {
  const response = await api.post(`/jobs/${jobId}/columns`, { columnName });
  return response.data;
};

export const updateColumn = async (columnId, updates) => {
  const response = await api.patch(`/columns/${columnId}`, updates);
  return response.data;
};

export const deleteColumn = async (columnId) => {
  await api.delete(`/columns/${columnId}`);
};

export const moveApplicationToColumn = async (applicationId, columnId) => {
  await api.patch(`/${applicationId}/column`, { columnId });
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.patch(`/${applicationId}/status`, { status });
  return response.data;
};

export const getApplicationDetails = async (applicationId) => {
  const response = await api.get(`/${applicationId}`);
  return response.data;
};
