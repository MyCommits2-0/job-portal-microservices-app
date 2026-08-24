import { useState } from "react";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff, FiBell, FiBellOff, FiMail, FiShield, FiCheckCircle } from "react-icons/fi";

import { validateAccountSettings } from "../../../utils/candidateSettingsValidation";
import { updateCandidateAccountSettings } from "../../../services/candidateSettingsService";

export default function AccountSettings({
  candidateProfileId,
  accountSettings = {},
  setAccountSettings,
  onFinish,
}) {
  const [settings, setSettings] = useState({
    profileVisible: accountSettings.profileVisible ?? true,
    jobAlertEnabled: accountSettings.jobAlertEnabled ?? true,
    emailNotificationEnabled: accountSettings.emailNotificationEnabled ?? true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSavedMessage("");
  };

  const handleFinish = async (e) => {
    e.preventDefault();

    const validationErrors = validateAccountSettings(settings);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);
      const response = await updateCandidateAccountSettings(candidateProfileId, settings);
      setAccountSettings?.(response.accountSettings || settings);
      setSavedMessage("Your account settings have been saved.");
      onFinish?.(response);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update account settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleFinish} className="max-w-5xl space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-md bg-blue-100 p-2 text-blue-600">
            <FiShield className="text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Privacy</h2>
            <p className="mt-1 text-sm text-gray-500">Control who can see your profile on the platform.</p>
          </div>
        </div>

        <SettingRow
          icon={settings.profileVisible ? <FiEye /> : <FiEyeOff />}
          title="Profile Visibility"
          description={settings.profileVisible ? "Recruiters can find and view your profile." : "Your profile is hidden from recruiter search."}
          checked={settings.profileVisible}
          onChange={() => handleToggle("profileVisible")}
          error={errors.profileVisible}
        />
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-md bg-blue-100 p-2 text-blue-600">
            <FiBell className="text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <p className="mt-1 text-sm text-gray-500">Choose how you want to hear about new opportunities.</p>
          </div>
        </div>

        <div className="space-y-4">
          <SettingRow
            icon={settings.jobAlertEnabled ? <FiBell /> : <FiBellOff />}
            title="Job Alerts"
            description={settings.jobAlertEnabled ? "You will receive job alerts matched to your profile." : "Job alerts are disabled."}
            checked={settings.jobAlertEnabled}
            onChange={() => handleToggle("jobAlertEnabled")}
            error={errors.jobAlertEnabled}
          />

          <SettingRow
            icon={<FiMail />}
            title="Email Notifications"
            description={settings.emailNotificationEnabled ? "Application updates will be emailed to you." : "Email notifications are disabled."}
            checked={settings.emailNotificationEnabled}
            onChange={() => handleToggle("emailNotificationEnabled")}
            error={errors.emailNotificationEnabled}
          />
        </div>
      </section>

      <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
        <div className="flex items-start gap-3">
          <FiCheckCircle className="mt-0.5 flex-shrink-0" />
          <p>
            Password, email change, and account deletion are managed from your account security settings, not here.
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        {savedMessage && (
          <p className="flex items-center gap-2 text-sm font-medium text-green-600">
            <FiCheckCircle /> {savedMessage}
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="ml-auto w-full rounded-md bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300 sm:w-auto"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

function SettingRow({ icon, title, description, checked, onChange, error }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-md bg-blue-100 p-2 text-blue-600">{icon}</div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </div>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`flex h-6 w-11 flex-shrink-0 items-center rounded-full px-0.5 transition ${checked ? "justify-end bg-blue-600" : "justify-start bg-gray-300"}`}
        aria-pressed={checked}
        aria-label={title}
      >
        <span className="h-5 w-5 rounded-full bg-white shadow" />
      </button>
    </div>
  );
}
