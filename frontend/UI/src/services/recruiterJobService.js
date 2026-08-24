import { createApiClient } from "../utils/httpClient";

const JOBS_API_BASE_URL =
  import.meta.env.VITE_JOBS_SERVICE_URL || "http://localhost:8080/jobs";

// createApiClient (not a bare axios instance) so every call carries the signed-in
// recruiter's access token - the gateway derives X-User-Id/X-User-Role from it and
// forwards those to Jobs-service; going directly to Jobs-service with client-supplied
// identity headers (the old implementation here) is rejected as unauthenticated.
const api = createApiClient(JOBS_API_BASE_URL);

const recruiterJobStatuses = [
  "ACTIVE",
  "CLOSED",
];

const formatJobType = (jobType) => {
  if (!jobType) {
    return "Not specified";
  }

  return jobType
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};

const formatJobStatus = (status) => {
  switch (status) {
    case "ACTIVE":
      return "Active";

    case "CLOSED":
      return "Expire";

    case "DELETED":
      return "Deleted";

    default:
      return status || "Unknown";
  }
};

const mapBackendJob = (job) => ({
  id: job.id,
  jobTitle: job.title,
  jobType: formatJobType(job.jobType),
  expirationDate:
    job.expirationDate ||
    job.expiryDate ||
    "Not specified",
  status: formatJobStatus(job.status),
  applications:
    job.applicationCount ??
    job.applications ??
    0,
  createdAt: job.createdAt,
});

export const fetchRecruiterJobs = async () => {
  try {
    const requests =
      recruiterJobStatuses.map(
        (status) =>
          api.get("/recruiter/my-jobs", {
            params: {
              status,
            },
          })
      );

    const responses =
      await Promise.all(requests);

    const mergedJobs =
      responses.flatMap((response) => {
        const responseData =
          response.data;

        if (Array.isArray(responseData)) {
          return responseData;
        }

        if (
          Array.isArray(
            responseData?.content
          )
        ) {
          return responseData.content;
        }

        if (
          Array.isArray(responseData?.data)
        ) {
          return responseData.data;
        }

        return [];
      });

    const uniqueJobs = Array.from(
      new Map(
        mergedJobs.map((job) => [
          job.id,
          job,
        ])
      ).values()
    );

    return uniqueJobs
      .sort(
        (
          firstJob,
          secondJob
        ) => {
          const firstCreatedAt =
            firstJob.createdAt
              ? new Date(
                  firstJob.createdAt
                ).getTime()
              : 0;

          const secondCreatedAt =
            secondJob.createdAt
              ? new Date(
                  secondJob.createdAt
                ).getTime()
              : 0;

          return (
            secondCreatedAt -
            firstCreatedAt
          );
        }
      )
      .map(mapBackendJob);
  } catch (error) {
    console.error(
      "Failed to fetch recruiter jobs:",
      error.response?.data ||
        error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Unable to fetch recruiter jobs."
    );
  }
};