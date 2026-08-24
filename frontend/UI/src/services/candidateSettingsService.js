import { getAuthUser } from "../utils/authStorage";
import { createApiClient } from "../utils/httpClient";

const API_BASE_URL =
  import.meta.env.VITE_PROFILE_SERVICE_URL ||
  "http://localhost:8080/api/profile";

// createApiClient (not a bare axios instance) so every call carries the
// signed-in user's access token, and a stale token gets silently refreshed.
const api = createApiClient(API_BASE_URL);


/* ===============================
   BOOTSTRAP: resolve this browser's candidateProfileId
================================
   There is no Auth Service session yet to hand back "your" candidate profile
   id, so the frontend has to resolve it itself: call the idempotent internal
   create-or-get endpoint once with a stable pseudo userId (see authStorage.js),
   then cache the resulting id per-user so this only round-trips once.
*/

const CANDIDATE_PROFILE_ID_KEY = "candidateProfileId";

// CandidateDashboard and Settings both call resolveCandidateProfileId() independently
// on mount (and React.StrictMode double-invokes effects in dev on top of that), so
// without this, several near-simultaneous calls would all miss the localStorage cache
// at once and all POST /internal/candidates concurrently for a brand-new user - a race
// that can trip the profile service's own create-or-get logic. This makes every caller
// share the one in-flight request instead of firing their own.
let inFlightResolve = null;

export const resolveCandidateProfileId = async () => {
  const authUser = getAuthUser();
  if (!authUser?.userId) {
    throw new Error("No authenticated user found");
  }

  const cacheKey = `${CANDIDATE_PROFILE_ID_KEY}:${authUser.userId}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    return Number(cached);
  }

  if (inFlightResolve) {
    return inFlightResolve;
  }

  inFlightResolve = api
    .post("/internal/candidates", { userId: authUser.userId })
    .then((response) => {
      const candidateProfileId = response.data.candidateProfileId;
      localStorage.setItem(cacheKey, String(candidateProfileId));
      return candidateProfileId;
    })
    .finally(() => {
      inFlightResolve = null;
    });

  return inFlightResolve;
};


/* ===============================
   GET COMPLETE PROFILE
================================ */

export const getCandidateSettings = async (candidateProfileId) => {

  const response = await api.get(
    `/candidates/${candidateProfileId}`
  );

  return response.data;
};


/* ===============================
   PERSONAL INFORMATION
================================ */

export const updateCandidatePersonalInfo = async (
  candidateProfileId,
  formData
) => {

  const response = await api.put(
    `/candidates/${candidateProfileId}/personal-info`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


/* ===============================
   RESUME
================================ */

export const uploadCandidateResume = async (
  candidateProfileId,
  file,
  defaultResume = true
) => {

 

  const formData = new FormData();
  formData.append("file", file);
  formData.append("defaultResume", defaultResume);

  const response = await api.post(
    `/candidates/${candidateProfileId}/resumes`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const getCandidateResumes = async (
  candidateProfileId
) => {

  const response = await api.get(
    `/candidates/${candidateProfileId}/resumes`
  );

  return response.data;
};


// Note: resume deletion is scoped by resumeId alone on the backend
// (DELETE /api/profile/resumes/{resumeId}), not nested under a candidate.
export const deleteCandidateResume = async (
  resumeId
) => {

  const response = await api.delete(
    `/resumes/${resumeId}`
  );

  return response.data;
};


export const setDefaultCandidateResume = async (
  candidateProfileId,
  resumeId
) => {

  const response = await api.patch(
    `/candidates/${candidateProfileId}/resumes/${resumeId}/default`
  );

  return response.data;
};


/* ===============================
   EDUCATION
================================ */

export const addEducation = async (
  candidateProfileId,
  educationData
) => {

  const response = await api.post(
    `/candidates/${candidateProfileId}/education`,
    educationData
  );

  return response.data;
};


export const deleteEducation = async (
  candidateProfileId,
  educationId
) => {

  const response = await api.delete(
    `/candidates/${candidateProfileId}/education/${educationId}`
  );

  return response.data;
};


/* ===============================
   EXPERIENCE
================================ */

export const addExperience = async (
  candidateProfileId,
  experienceData
) => {

  const response = await api.post(
    `/candidates/${candidateProfileId}/experience`,
    experienceData
  );

  return response.data;
};


export const deleteExperience = async (
  candidateProfileId,
  experienceId
) => {

  const response = await api.delete(
    `/candidates/${candidateProfileId}/experience/${experienceId}`
  );

  return response.data;
};


/* ===============================
   SKILLS
================================ */

export const addSkill = async (
  candidateProfileId,
  skillData
) => {

  const response = await api.post(
    `/candidates/${candidateProfileId}/skills`,
    skillData
  );

  return response.data;
};


export const deleteSkill = async (
  candidateProfileId,
  skillId
) => {

  const response = await api.delete(
    `/candidates/${candidateProfileId}/skills/${skillId}`
  );

  return response.data;
};


/* ===============================
   SOCIAL LINKS
================================ */

export const addSocialLink = async (
  candidateProfileId,
  socialLinkData
) => {

  const response = await api.post(
    `/candidates/${candidateProfileId}/social-links`,
    socialLinkData
  );

  return response.data;
};


export const getSocialLinks = async (
  candidateProfileId
) => {

  const response = await api.get(
    `/candidates/${candidateProfileId}/social-links`
  );

  return response.data;
};


export const deleteSocialLink = async (
  candidateProfileId,
  socialLinkId
) => {

  const response = await api.delete(
    `/candidates/${candidateProfileId}/social-links/${socialLinkId}`
  );

  return response.data;
};


/* ===============================
   ACCOUNT SETTINGS
================================ */

export const updateCandidateAccountSettings = async (
  candidateProfileId,
  accountData
) => {

  const response = await api.put(
    `/candidates/${candidateProfileId}/account-settings`,
    accountData
  );

  return response.data;
};