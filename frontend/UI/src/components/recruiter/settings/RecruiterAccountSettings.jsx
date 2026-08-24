import { useState } from "react";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff, FiMail, FiUsers, FiXCircle, FiCheckCircle } from "react-icons/fi";

import { validateRecruiterPassword } from "../../../utils/recruiterSettingsValidation";

import {
  updateRecruiterAccountSettings,
  updateRecruiterPassword,
  deleteRecruiterCompany,
} from "../../../services/recruiterSettingsService";

export default function RecruiterAccountSettings({
  recruiterProfileId,
  accountSettings,
  setAccountSettings,
}) {
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleToggle = (field) => {
    setAccountSettings({ ...accountSettings, [field]: !accountSettings[field] });
    setSavedMessage("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setPasswordErrors({ ...passwordErrors, [name]: "" });
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const updated = await updateRecruiterAccountSettings(recruiterProfileId, accountSettings);
      setAccountSettings({
        companyVisible: updated.companyVisible,
        applicantEmailEnabled: updated.applicantEmailEnabled,
        emailNotificationEnabled: updated.emailNotificationEnabled,
      });
      setSavedMessage("Your account settings have been saved.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update account settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const validationErrors = validateRecruiterPassword(passwordData);

    if (Object.keys(validationErrors).length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }

    const response = await updateRecruiterPassword(passwordData);
    toast.success(response.message || "Password changed successfully");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDeleteCompany = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to close your company account?"
    );

    if (!confirmDelete) return;

    await deleteRecruiterCompany(recruiterProfileId);
    toast.success("Company account closed successfully");
  };

  return (
    <div className="max-w-5xl space-y-8">
      <section className="border-b border-gray-200 pb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-5">
          Privacy & Notifications
        </h2>

        <form onSubmit={handleSaveAccount} className="space-y-4">
          <ToggleRow
            icon={accountSettings.companyVisible ? <FiEye /> : <FiEyeOff />}
            title="Company Visibility"
            description={accountSettings.companyVisible ? "Candidates can find and view your company." : "Your company is hidden from candidate search."}
            checked={accountSettings.companyVisible}
            onChange={() => handleToggle("companyVisible")}
          />

          <ToggleRow
            icon={<FiUsers />}
            title="Applicant Emails"
            description={accountSettings.applicantEmailEnabled ? "You'll be emailed whenever a candidate applies." : "Applicant email alerts are disabled."}
            checked={accountSettings.applicantEmailEnabled}
            onChange={() => handleToggle("applicantEmailEnabled")}
          />

          <ToggleRow
            icon={<FiMail />}
            title="Email Notifications"
            description={accountSettings.emailNotificationEnabled ? "General account notifications are enabled." : "Email notifications are disabled."}
            checked={accountSettings.emailNotificationEnabled}
            onChange={() => handleToggle("emailNotificationEnabled")}
          />

          <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            {savedMessage && (
              <p className="flex items-center gap-2 text-sm font-medium text-green-600">
                <FiCheckCircle /> {savedMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="ml-auto bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>

      <section className="border-b border-gray-200 pb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-2">
          Change Password
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Password changes are handled by the Auth Service, which isn't wired up yet.
        </p>

        <form onSubmit={handleChangePassword}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <PasswordField
              label="Current Password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              visible={showPassword.currentPassword}
              onToggle={() =>
                setShowPassword({
                  ...showPassword,
                  currentPassword: !showPassword.currentPassword,
                })
              }
              error={passwordErrors.currentPassword}
            />

            <PasswordField
              label="New Password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              visible={showPassword.newPassword}
              onToggle={() =>
                setShowPassword({
                  ...showPassword,
                  newPassword: !showPassword.newPassword,
                })
              }
              error={passwordErrors.newPassword}
            />

            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              visible={showPassword.confirmPassword}
              onToggle={() =>
                setShowPassword({
                  ...showPassword,
                  confirmPassword: !showPassword.confirmPassword,
                })
              }
              error={passwordErrors.confirmPassword}
            />
          </div>

          <button className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700">
            Change Password
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Delete Your Company
        </h2>

        <p className="text-sm text-gray-500 leading-6 max-w-xl mb-5">
          If you delete your Jobpilot account, you will no longer be able to get
          information about matched jobs, following employers, and job alert.
          You will be abandoned from all the services of Jobpilot.com.
        </p>

        <button
          type="button"
          onClick={handleDeleteCompany}
          className="text-red-500 text-sm font-medium flex items-center gap-2 hover:underline"
        >
          <FiXCircle />
          Close Account
        </button>
      </section>
    </div>
  );
}

function ToggleRow({ icon, title, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-md bg-blue-100 p-2 text-blue-600">{icon}</div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
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

function PasswordField({
  label,
  name,
  value,
  onChange,
  visible,
  onToggle,
  error,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="Password"
          className={`w-full border rounded-md px-4 py-3 pr-11 text-sm outline-none focus:ring-2 ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {visible ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
