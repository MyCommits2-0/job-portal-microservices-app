import { useState } from "react";
import { FiPlus, FiTrash2, FiGithub, FiLinkedin, FiGlobe, FiTwitter, FiArrowRight, FiLink } from "react-icons/fi";

import SocialLinkModal from "./SocialLinkModal";
import { addSocialLink, deleteSocialLink } from "../../../services/candidateSettingsService";

const socialPlatforms = [
  { label: "LinkedIn", value: "LINKEDIN", icon: FiLinkedin },
  { label: "GitHub", value: "GITHUB", icon: FiGithub },
  { label: "Portfolio", value: "PORTFOLIO", icon: FiGlobe },
  { label: "Twitter", value: "TWITTER", icon: FiTwitter },
];

export default function SocialLinksSettings({
  candidateProfileId,
  socialLinks = [],
  setSocialLinks,
  onNext,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [sectionError, setSectionError] = useState("");

  const getPlatformMeta = (platformValue) => {
    return socialPlatforms.find((item) => item.value === platformValue);
  };

  const handleAddSocialLink = async (form) => {
    const created = await addSocialLink(candidateProfileId, form);
    setSocialLinks?.([...socialLinks, created]);
    setSectionError("");
  };

  const handleDeleteSocialLink = async (link) => {
    if (!window.confirm("Are you sure you want to remove this social link?")) return;

    try {
      setDeletingId(link.id);
      await deleteSocialLink(candidateProfileId, link.id);
      setSocialLinks?.(socialLinks.filter((item) => item.id !== link.id));
    } catch (error) {
      console.error(error);
      setSectionError("Failed to remove social link");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="max-w-5xl rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-100 p-2 text-blue-600">
              <FiLink className="text-xl" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
          >
            <FiPlus /> Add Social Link
          </button>
        </div>

        {sectionError && (
          <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{sectionError}</p>
        )}

        {socialLinks.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {socialLinks.map((link) => {
              const meta = getPlatformMeta(link.platform);
              const Icon = meta?.icon || FiGlobe;

              return (
                <div
                  key={link.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-gray-50 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                      <Icon />
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900">{meta?.label || link.platform}</h4>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-xs text-gray-500 hover:text-blue-600"
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSocialLink(link)}
                    disabled={deletingId === link.id}
                    className="rounded p-1 text-red-500 hover:bg-red-50 disabled:opacity-50"
                    aria-label="Remove social link"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">No social links added yet.</p>
        )}
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onNext?.("account")}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Next <FiArrowRight />
        </button>
      </div>

      <SocialLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddSocialLink}
        existingLinks={socialLinks}
      />
    </div>
  );
}
