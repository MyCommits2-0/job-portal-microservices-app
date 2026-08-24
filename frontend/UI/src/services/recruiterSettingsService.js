import { getAuthUser } from "../utils/authStorage";
import { createApiClient } from "../utils/httpClient";

const API_BASE_URL =
  import.meta.env.VITE_PROFILE_SERVICE_URL ||
  "http://localhost:8080/api/profile";

// createApiClient (not a bare axios instance) so every call carries the
// signed-in user's access token, and a stale token gets silently refreshed.
const api = createApiClient(API_BASE_URL);


/* ===============================
   BOOTSTRAP: resolve this browser's recruiterProfileId
================================
   Same reasoning as candidateSettingsService.resolveCandidateProfileId -
   there is no Auth Service session yet to hand back "your" recruiter profile
   id, so it's resolved via the idempotent internal create-or-get endpoint
   and cached per-user.
*/

const RECRUITER_PROFILE_ID_KEY = "recruiterProfileId";

// See candidateSettingsService.resolveCandidateProfileId for why this guard exists:
// multiple callers resolving this on mount (plus React.StrictMode's double-invoke in
// dev) can all miss the localStorage cache at once and race on the create-or-get call.
let inFlightResolve = null;

export const resolveRecruiterProfileId = async () => {
  const authUser = getAuthUser();

  if (!authUser?.userId) {
    throw new Error("No authenticated user found");
  }

  const cacheKey = `${RECRUITER_PROFILE_ID_KEY}:${authUser.userId}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    return Number(cached);
  }

  if (inFlightResolve) {
    return inFlightResolve;
  }

  inFlightResolve = api
    .post("/internal/recruiters", { userId: authUser.userId })
    .then((response) => {
      const recruiterProfileId = response.data.recruiterProfileId;
      localStorage.setItem(cacheKey, String(recruiterProfileId));
      return recruiterProfileId;
    })
    .finally(() => {
      inFlightResolve = null;
    });

  return inFlightResolve;
};


/* ===============================
   GET COMPLETE PROFILE
================================ */

export const getRecruiterSettings = async (recruiterProfileId) => {
  const response = await api.get(`/recruiters/${recruiterProfileId}`);
  return response.data;
};


/* ===============================
   PERSONAL INFO
================================ */

export const updateRecruiterPersonalInfo = async (recruiterProfileId, personalInfo) => {
  const response = await api.put(
    `/recruiters/${recruiterProfileId}/personal-info`,
    personalInfo
  );
  return response.data;
};


/* ===============================
   COMPANY INFO
================================
   Maps to Company.companyName/about/logo/banner. logo/banner are only sent
   when the user picked a new file (see CompanyInfoSettings.jsx - existing
   images are represented as a plain url string, new picks as {file,...}).
*/

export const updateRecruiterCompanyInfo = async (recruiterProfileId, companyInfo) => {
  const formData = new FormData();
  formData.append("companyName", companyInfo.companyName || "");
  formData.append("about", companyInfo.aboutUs || "");

  if (companyInfo.logo?.file) formData.append("logo", companyInfo.logo.file);
  if (companyInfo.banner?.file) formData.append("banner", companyInfo.banner.file);

  const response = await api.put(
    `/recruiters/${recruiterProfileId}/company/info`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};


/* ===============================
   FOUNDING INFO
================================
   Company has no "companyVision" field and yearOfEstablishment is an
   Integer, not a date - the founding info form still collects a date
   picker value, so it's converted here rather than reshaping that UI.
*/

export const updateRecruiterFoundingInfo = async (recruiterProfileId, foundingInfo) => {
  const yearOfEstablishment = foundingInfo.yearOfEstablishment
    ? new Date(foundingInfo.yearOfEstablishment).getFullYear()
    : null;

  const payload = {
    organizationType: foundingInfo.organizationType,
    industryType: foundingInfo.industryType,
    teamSize: foundingInfo.teamSize,
    yearOfEstablishment,
    website: foundingInfo.companyWebsite,
  };

  const response = await api.put(
    `/recruiters/${recruiterProfileId}/company/founding-info`,
    payload
  );
  return response.data;
};


/* ===============================
   SOCIAL LINKS
================================
   Company models these as 4 fixed columns (facebook/twitter/linkedin/
   instagram), not a list - this is a single PUT with all 4, not add/delete.
*/

export const updateRecruiterSocialLinks = async (recruiterProfileId, socialLinks) => {
  const response = await api.put(
    `/recruiters/${recruiterProfileId}/company/social-links`,
    socialLinks
  );
  return response.data;
};


/* ===============================
   ACCOUNT SETTINGS
================================ */

export const updateRecruiterAccountSettings = async (recruiterProfileId, accountSettings) => {
  const response = await api.put(
    `/recruiters/${recruiterProfileId}/account-settings`,
    accountSettings
  );
  return response.data;
};


/* ===============================
   COMPANY DELETE
================================ */

export const deleteRecruiterCompany = async (recruiterProfileId) => {
  const response = await api.delete(`/recruiters/${recruiterProfileId}/company`);
  return response.data;
};


/* ===============================
   PASSWORD
================================
   Not a Profile-Service concern - this belongs to Auth Service, which
   doesn't exist yet. Left as a stub so the UI flow doesn't break.
*/

export const updateRecruiterPassword = async () => {
  console.warn("updateRecruiterPassword: Auth Service is not implemented yet");
  return { success: false, message: "Password changes are not available yet" };
};
