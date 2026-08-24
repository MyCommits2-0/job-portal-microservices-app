import { useState } from "react";
import { FiX, FiLink, FiGithub, FiLinkedin, FiGlobe, FiTwitter } from "react-icons/fi";

import { validateSocialLink } from "../../../utils/candidateSettingsValidation";

const socialPlatforms = [
  { label: "LinkedIn", value: "LINKEDIN", icon: FiLinkedin },
  { label: "GitHub", value: "GITHUB", icon: FiGithub },
  { label: "Portfolio", value: "PORTFOLIO", icon: FiGlobe },
  { label: "Twitter", value: "TWITTER", icon: FiTwitter },
];

function emptyLink() {
  return { platform: "", url: "" };
}

export default function SocialLinkModal({ isOpen, onClose, onSave, existingLinks = [] }) {
  const [form, setForm] = useState(emptyLink());
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleClose = () => {
    if (submitting) return;
    setForm(emptyLink());
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateSocialLink(form, existingLinks);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      await onSave({ platform: form.platform, url: form.url.trim() });
      setForm(emptyLink());
      setErrors({});
      onClose();
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({ ...prev, submit: "Failed to add social link. Please try again." }));
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

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-md bg-blue-100 p-2 text-blue-600">
              <FiLink className="text-xl" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Add Social Link</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Platform</label>
              <select
                name="platform"
                value={form.platform}
                onChange={handleChange}
                className={`w-full rounded-md border bg-white px-4 py-3 text-sm outline-none focus:ring-2 ${
                  errors.platform ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              >
                <option value="">Select platform</option>
                {socialPlatforms.map((platform) => (
                  <option key={platform.value} value={platform.value}>{platform.label}</option>
                ))}
              </select>
              {errors.platform && <p className="mt-1 text-xs text-red-500">{errors.platform}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">URL</label>
              <input
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://your-profile-url"
                className={`w-full rounded-md border px-4 py-3 text-sm outline-none focus:ring-2 ${
                  errors.url ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.url && <p className="mt-1 text-xs text-red-500">{errors.url}</p>}
            </div>
          </div>

          {errors.submit && <p className="mt-3 text-xs text-red-500">{errors.submit}</p>}

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
              {submitting ? "Adding..." : "Add Social Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
