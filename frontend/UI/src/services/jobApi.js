import axios from "axios";

const JOBS_API_BASE_URL =
  import.meta.env.VITE_JOBS_SERVICE_URL || "http://localhost:8080/jobs";

const API = axios.create({
  baseURL: JOBS_API_BASE_URL,
});

export const searchJobs = async (params = {}) => {
  const response = await API.get("/search", {
    params,
  });

  return response.data;
};

// Most-recently-posted active jobs, capped server-side (see Jobs-service's
// HOME_JOBS_LIMIT) - also what powers the candidate Job Alerts feed.
export const getHomeJobs = async () => {
  const response = await API.get("/home");
  return response.data;
};

export const getJobDetails = async (jobId) => {
  const response = await API.get(`/${jobId}`);

  return response.data;
};
