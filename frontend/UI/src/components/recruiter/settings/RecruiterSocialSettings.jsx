import { useState } from "react";
import { toast } from "react-toastify";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

import { validateRecruiterSocialLinks } from "../../../utils/recruiterSettingsValidation";
import { updateRecruiterSocialLinks } from "../../../services/recruiterSettingsService";

const socialFields = [
  { name: "facebook", label: "Facebook", icon: FiFacebook, placeholder: "https://facebook.com/your-company" },
  { name: "twitter", label: "Twitter", icon: FiTwitter, placeholder: "https://twitter.com/your-company" },
  { name: "linkedin", label: "LinkedIn", icon: FiLinkedin, placeholder: "https://linkedin.com/company/your-company" },
  { name: "instagram", label: "Instagram", icon: FiInstagram, placeholder: "https://instagram.com/your-company" },
];

export default function RecruiterSocialSettings({
  recruiterProfileId,
  socialLinks,
  setSocialLinks,
}) {
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (name, value) => {
    setSocialLinks({ ...socialLinks, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const validationErrors = validateRecruiterSocialLinks(socialLinks);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);
      const updated = await updateRecruiterSocialLinks(recruiterProfileId, socialLinks);
      setSocialLinks({
        facebook: updated.facebook || "",
        twitter: updated.twitter || "",
        linkedin: updated.linkedin || "",
        instagram: updated.instagram || "",
      });
      toast.success("Social media profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update social media profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="max-w-5xl">
      <div className="space-y-5">
        {socialFields.map((field) => {
          const Icon = field.icon;

          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>

              <div className="flex flex-col md:flex-row gap-3">
                <div className="md:w-14 h-12 border border-gray-300 rounded-md flex items-center justify-center text-blue-600">
                  <Icon />
                </div>

                <input
                  value={socialLinks[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className={`flex-1 border rounded-md px-4 py-3 text-sm outline-none focus:ring-2 ${
                    errors[field.name]
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
              </div>

              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
