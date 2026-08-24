import { createApiClient } from "../utils/httpClient";
import { resolveRecruiterProfileId } from "./recruiterSettingsService";

const API_BASE_URL =
  import.meta.env.VITE_PROFILE_SERVICE_URL || "http://localhost:8080/api/profile";

// createApiClient (not a bare axios instance) so every call carries the signed-in
// recruiter's access token - the gateway derives X-User-Id from it and Profile-Service's
// ProfileOwnershipGuard checks it against the recruiterId in the URL.
const api = createApiClient(API_BASE_URL);

// Profile-Service's SavedCandidateResponseDto doesn't carry skills/education/work-history
// (those live in separate Candidate* resources this bookmark feature doesn't join against
// today) - map what's real, leave the rest for the UI's existing empty-array/undefined guards.
function toFrontendCandidate(dto) {
  return {
    id: dto.candidateUserId,
    name: dto.fullName,
    title: dto.profileTitle,
    location: dto.location,
    email: dto.email,
    phone: dto.phone,
    biography: dto.bio,
    expectedSalary: dto.expectedSalary,
    experience: dto.experienceLevel,
    avatar: dto.profileImageUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(dto.fullName || "?"),
    savedAt: dto.savedAt,
  };
}

export const getSavedCandidates = async () => {
  const recruiterId = await resolveRecruiterProfileId();
  const response = await api.get(`/recruiters/${recruiterId}/saved-candidates`);

  return response.data.map(toFrontendCandidate);
};

// No standalone candidate-detail endpoint exists - this feature is bookmarking, not a
// directory, so "detail" means looking the candidate up within the recruiter's own saved list.
export const getCandidateById = async (candidateId) => {
  const candidates = await getSavedCandidates();

  return candidates.find((item) => item.id === Number(candidateId)) || null;
};

export const saveCandidate = async (candidateUserId) => {
  const recruiterId = await resolveRecruiterProfileId();
  await api.post(`/recruiters/${recruiterId}/saved-candidates/${candidateUserId}`);
};

export const unsaveCandidate = async (candidateUserId) => {
  const recruiterId = await resolveRecruiterProfileId();
  await api.delete(`/recruiters/${recruiterId}/saved-candidates/${candidateUserId}`);
};
