import { createApiClient } from "../utils/httpClient";

const JOBS_API_BASE_URL =
  import.meta.env.VITE_JOBS_SERVICE_URL || "http://localhost:8080/jobs";

// createApiClient (not a bare axios instance) so every call carries the signed-in
// recruiter's access token - the gateway derives X-User-Id/X-User-Role from it and
// forwards those to Jobs-service; going directly to Jobs-service with client-supplied
// identity headers (the old implementation here) is rejected as unauthenticated.
const api = createApiClient(JOBS_API_BASE_URL);

export const getRecruiterDashboardCounts = async () => {
  const response = await api.get("/recruiter/dashboard");
  return response.data;
};