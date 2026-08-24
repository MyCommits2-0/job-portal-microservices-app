import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FiUploadCloud, FiMapPin, FiPhone, FiBriefcase } from "react-icons/fi";

import ResumeCard from "./ResumeCard";
import ResumeUploadBox from "./ResumeUploadBox";
import ResumeUploadModal from "./ResumeUploadModal";

import {
  validatePersonalInfo,
  validateProfileImage,
} from "../../../utils/candidateSettingsValidation";

import {
  updateCandidatePersonalInfo,
  uploadCandidateResume,
  deleteCandidateResume,
  setDefaultCandidateResume,
} from "../../../services/candidateSettingsService";

const experienceLevels = ["FRESHER", "ONE_TO_TWO_YEARS", "TWO_TO_FOUR_YEARS", "FIVE_PLUS_YEARS"];
const expectedSalary = ["2-3 LPA", "3-4 LPA", "5-7 LPA", "above 7 LPA"];

export default function PersonalSettings({
  candidateProfileId,
  profile = {},
  setProfile,
  resumes = [],
  setResumes,
  onNext,
}) {
  const [form, setForm] = useState(() => buildInitialForm(profile));
  const [errors, setErrors] = useState({});
  const [resumeError, setResumeError] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [previewImage, setPreviewImage] = useState(profile.profileImageUrl || "");
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  useEffect(() => {
    setForm(buildInitialForm(profile));
    setPreviewImage(profile.profileImageUrl || "");
  }, [profile]);

  const defaultResume = useMemo(
    () => resumes.find((resume) => resume.defaultResume) || resumes[0],
    [resumes]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    const validationErrors = validateProfileImage(file);

    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...validationErrors }));
      return;
    }

    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, profileImage: file }));
      setErrors((prev) => ({ ...prev, profileImage: "" }));
    }
  };

  const handleSaveAndNext = async (e) => {
    e.preventDefault();

    const validationErrors = validatePersonalInfo(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);

      const payload = new FormData();
      payload.append("phone", form.phone);
      payload.append("profileTitle", form.profileTitle);
      payload.append("location", form.location);
      payload.append("expectedSalary", form.expectedSalary || "");
      payload.append("experienceLevel", form.experienceLevel);
      payload.append("bio", form.bio || "");
      if (form.profileImage) payload.append("profileImage", form.profileImage);

      const response = await updateCandidatePersonalInfo(candidateProfileId, payload);

      const updatedProfile = {
        ...profile,
        phone: response.phone ?? form.phone,
        profileTitle: response.profileTitle ?? form.profileTitle,
        location: response.location ?? form.location,
        bio: response.bio ?? form.bio,
        expectedSalary: response.expectedSalary ?? form.expectedSalary,
        experienceLevel: response.experienceLevel ?? form.experienceLevel,
        profileImageUrl: response.profileImageUrl ?? profile.profileImageUrl,
      };

      setProfile?.(updatedProfile);
      toast.success("Personal information saved");
      onNext?.("profile");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save personal information");
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUploadFromModal = async ({ file, defaultResume }) => {
    try {
      setUploadingResume(true);
      const uploadedResume = await uploadCandidateResume(candidateProfileId, file, defaultResume);
      setResumes?.([uploadedResume, ...resumes]);
      setIsResumeModalOpen(false);
      setResumeError("");
    } catch (error) {
      console.error(error);
      setResumeError("Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      await deleteCandidateResume(resumeId);
      setResumes?.(resumes.filter((resume) => resume.id !== resumeId));
      setActiveMenuId(null);
    } catch (error) {
      console.error(error);
      setResumeError("Failed to delete resume");
    }
  };

  const handleSetDefaultResume = async (resumeId) => {
    try {
      await setDefaultCandidateResume(candidateProfileId, resumeId);
      setResumes?.(
        resumes.map((resume) => ({
          ...resume,
          defaultResume: resume.id === resumeId,
        }))
      );
    } catch (error) {
      console.error(error);
      setResumeError("Failed to set default resume");
    }
  };

  return (
    <form onSubmit={handleSaveAndNext} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Profile Image</label>
            <label className="flex h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 text-center transition hover:bg-gray-50">
              {previewImage ? (
                <img src={previewImage} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <>
                  <FiUploadCloud className="mb-3 text-4xl text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">Browse photo or drop here</p>
                  <p className="mt-2 max-w-[170px] text-xs text-gray-400">JPG, PNG, WEBP. Max 2 MB.</p>
                </>
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </label>
            {errors.profileImage && <p className="mt-2 text-xs text-red-500">{errors.profileImage}</p>}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="block text-sm font-medium text-gray-700">CV/Resume</label>
            </div>
            <ResumeUploadBox onClick={() => setIsResumeModalOpen(true)} disabled={uploadingResume} />

            {resumeError && <p className="mt-2 text-xs text-red-500">{resumeError}</p>}

            {resumes.length > 0 ? (
              <div className="mt-3 space-y-3">
                {resumes.map((resume) => (
                  <ResumeCard
                    key={resume.id}
                    resume={resume}
                    activeMenuId={activeMenuId}
                    setActiveMenuId={setActiveMenuId}
                    onDelete={handleDeleteResume}
                    onSetDefault={handleSetDefaultResume}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-3 rounded-lg border border-dashed border-gray-300 p-4 text-center text-xs text-gray-500">
                No resume uploaded yet.
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InputField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
            icon={<FiPhone />}
            placeholder="9876543210"
          />

          <InputField
            label="Profile Title"
            name="profileTitle"
            value={form.profileTitle}
            onChange={handleChange}
            error={errors.profileTitle}
            icon={<FiBriefcase />}
            placeholder="Java Full Stack Developer"
          />

          <InputField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            error={errors.location}
            icon={<FiMapPin />}
            placeholder="Pune, Maharashtra"
          />

          <SelectField
            label="Experience Level"
            name="experienceLevel"
            value={form.experienceLevel}
            onChange={handleChange}
            options={experienceLevels}
            error={errors.experienceLevel}
          />

          <SelectField
            label="Expected Salary"
            name="expectedSalary"
            value={form.expectedSalary}
            onChange={handleChange}
            options={expectedSalary}
            error={errors.expectedSalary}
          />

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={5}
              placeholder="Write a short professional summary..."
              className="w-full resize-none rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-md bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300 sm:w-auto"
            >
              {saving ? "Saving..." : "Save & Next"}
            </button>
          </div>
        </div>
      </div>

      <ResumeUploadModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onSave={handleResumeUploadFromModal}
        uploading={uploadingResume}
      />
    </form>
  );
}

function buildInitialForm(profile) {
  return {
    phone: profile.phone || "",
    profileTitle: profile.profileTitle || "",
    location: profile.location || "",
    bio: profile.bio || "",
    expectedSalary: profile.expectedSalary || "",
    experienceLevel: profile.experienceLevel || "",
    profileImage: null,
  };
}

function InputField({ label, name, value, onChange, error, icon, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600">{icon}</span>}
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-md border py-3 pr-4 text-sm outline-none focus:ring-2 ${
            icon ? "pl-11" : "pl-4"
          } ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, error }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-md border bg-white px-4 py-3 text-sm outline-none focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
        }`}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>{option.replaceAll("_", " ")}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
