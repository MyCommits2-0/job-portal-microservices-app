import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiSend, FiMapPin, FiDollarSign, FiAlertCircle } from "react-icons/fi";

import { applyToJob, invalidateAppliedJobsCache } from "../../services/jobApplicationService";
import { extractAuthErrorMessage } from "../../services/authService";
import {
  getCandidateSettings,
  resolveCandidateProfileId,
} from "../../services/candidateSettingsService";

export default function ApplyJobModal({ isOpen, job, onClose, onApplied }) {
  const navigate = useNavigate();

  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // null = still checking, true/false = known. Re-checked every time the modal opens
  // so a candidate who completes their profile in another tab isn't stuck seeing a
  // stale "incomplete" gate.
  const [profileCompleted, setProfileCompleted] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    setProfileCompleted(null);

    const checkProfile = async () => {
      try {
        const candidateProfileId = await resolveCandidateProfileId();
        const settings = await getCandidateSettings(candidateProfileId);

        if (!cancelled) {
          setProfileCompleted(Boolean(settings.profileCompleted));
        }
      } catch (err) {
        console.error("Failed to check profile completion", err);
        if (!cancelled) setProfileCompleted(false);
      }
    };

    checkProfile();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen || !job) return null;

  const handleClose = () => {
    if (submitting) return;
    setNote("");
    setError("");
    onClose();
  };

  const handleGoToSettings = () => {
    handleClose();
    navigate("/candidate/settings");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      // resumeId is intentionally omitted - Application-service resolves the
      // candidate's default resume via Profile-Service when it's not provided.
      const application = await applyToJob(job.id, { note });

      invalidateAppliedJobsCache();
      onApplied?.(application);
    } catch (err) {
      setError(extractAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-lg rounded-xl bg-white shadow-xl">
        <button
          type="button"
          onClick={handleClose}
          disabled={submitting}
          className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-60"
          aria-label="Close modal"
        >
          <FiX className="text-xl" />
        </button>

        {profileCompleted === null && (
          <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        )}

        {profileCompleted === false && (
          <div className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-md bg-yellow-100 p-2 text-yellow-600">
                <FiAlertCircle className="text-xl" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Complete your profile to apply</h2>
            </div>

            <p className="text-sm text-gray-600">
              Recruiters need your personal details and a resume to consider your
              application for <span className="font-medium text-gray-900">{job.title}</span>.
              Finish setting up your profile first, then come back to apply.
            </p>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md bg-blue-50 px-5 py-3 font-medium text-blue-600 hover:bg-blue-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleGoToSettings}
                className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Complete Profile
              </button>
            </div>
          </div>
        )}

        {profileCompleted === true && (
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-md bg-blue-100 p-2 text-blue-600">
              <FiSend className="text-xl" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Apply for this job</h2>
          </div>

          {error && (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-900">{job.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{job.company}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              {job.location && (
                <span className="flex items-center gap-1">
                  <FiMapPin /> {job.location}
                </span>
              )}
              {job.salary && (
                <span className="flex items-center gap-1">
                  <FiDollarSign /> {job.salary}
                </span>
              )}
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Note to recruiter <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Briefly mention why you're a good fit for this role..."
              className="w-full resize-none rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Your default resume from Settings will be shared with the recruiter along with this application.
          </p>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-md bg-blue-50 px-5 py-3 font-medium text-blue-600 hover:bg-blue-100 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
