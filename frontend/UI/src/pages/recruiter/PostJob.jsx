import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";

import JobPostedSuccessModal from "../../components/recruiter/JobPostedSuccessModal";

import {
  jobRoles,
  salaryTypes,
  educationOptions,
  experienceOptions,
  jobTypes,
  vacanciesOptions,
  jobLevels,
  countryOptions,
  cityOptions,
  jobBenefits,
} from "../../data/postJobOptions";

import { validatePostJobForm } from "../../utils/postJobValidation";

import {
  resolveRecruiterProfileId,
  getRecruiterSettings,
} from "../../services/recruiterSettingsService";
import { createApiClient } from "../../utils/httpClient";

const JOBS_API_BASE_URL =
  import.meta.env.VITE_JOBS_SERVICE_URL || "http://localhost:8080/jobs";

// createApiClient (not a bare axios instance) so every call carries the signed-in
// recruiter's access token - the gateway's JwtAuthenticationFilter strips any
// client-supplied X-User-Id/X-User-Role and only re-derives trusted ones from a
// valid Bearer token, so posting a job without going through this client is
// rejected as unauthenticated before it ever reaches Jobs-service.
const api = createApiClient(JOBS_API_BASE_URL);

export default function PostJob() {
  const navigate = useNavigate();

  const { jobId } = useParams();
  const isEditMode = Boolean(jobId);
  const [errors, setErrors] = useState({});
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [postedJob, setPostedJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  const [formData, setFormData] = useState({
    jobTitle: "",
    tags: "",
    jobRole: "",
    minSalary: "",
    maxSalary: "",
    salaryType: "",
    education: "",
    experience: "",
    jobType: "",
    vacancies: "",
    expirationDate: "",
    jobLevel: "",
    country: "",
    city: "",
    isRemote: true,
    description: "",
  });

  useEffect(() => {
    const loadCompanyId = async () => {
      try {
        const recruiterProfileId = await resolveRecruiterProfileId();
        const settings = await getRecruiterSettings(recruiterProfileId);
        setCompanyId(settings.company?.id ?? null);
      } catch (error) {
        console.error("Failed to resolve recruiter's company", error);
      }
    };

    loadCompanyId();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleBenefitToggle = (benefit) => {
    if (selectedBenefits.includes(benefit)) {
      setSelectedBenefits(selectedBenefits.filter((item) => item !== benefit));
    } else {
      setSelectedBenefits([...selectedBenefits, benefit]);
    }
  };

  const resetForm = () => {
    setFormData({
      jobTitle: "",
      tags: "",
      jobRole: "",
      minSalary: "",
      maxSalary: "",
      salaryType: "",
      education: "",
      experience: "",
      jobType: "",
      vacancies: "",
      expirationDate: "",
      jobLevel: "",
      country: "",
      city: "",
      isRemote: true,
      description: "",
    });

    setSelectedBenefits([]);
  };

  const convertToEnumValue = (value) => {
    return value
      .trim()
      .toUpperCase()
      .replaceAll(" ", "_")
      .replaceAll("-", "_");
  };

  const buildBackendPayload = () => {
    return {
      companyId,

      title: formData.jobTitle,
      tags: formData.tags,
      jobRole: formData.jobRole,

      minSalary: Number(formData.minSalary),
      maxSalary: Number(formData.maxSalary),
      salaryType: convertToEnumValue(formData.salaryType),

      education: formData.education,
      experience: formData.experience,

      jobType: convertToEnumValue(formData.jobType),
      vacancies: Number(formData.vacancies),
      expirationDate: formData.expirationDate,
      jobLevel: convertToEnumValue(formData.jobLevel),

      description: formData.description,

      country: formData.isRemote ? "Worldwide" : formData.country,
      state: "",
      city: formData.isRemote ? "Remote" : formData.city,
      remote: formData.isRemote,

      benefits: selectedBenefits,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validatePostJobForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!companyId) {
      toast.error(
        "Your company profile could not be found. Please complete your company info in Settings first."
      );
      return;
    }

    const payload = buildBackendPayload();

    try {
      setIsSubmitting(true);

      // EDIT JOB MODE
      if (isEditMode) {
        await api.put(`/recruiter/${jobId}`, payload);

        toast.success("Job updated successfully");
        navigate("/recruiter/my-jobs");
        return;
      }

      // CREATE JOB MODE
      const response = await api.post("/recruiter", payload);

      setPostedJob(response.data);
      setShowSuccessModal(true);

      resetForm();
    } catch (error) {
      console.error("Job save failed:", error);

      if (error.response) {
        toast.error(error.response.data.message || "Failed to save job");
      } else {
        toast.error("Backend is not reachable. Please check if Jobs-service is running.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInputError = (fieldName) => {
    if (!errors[fieldName]) {
      return null;
    }

    return (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <FiAlertCircle />
        {errors[fieldName]}
      </p>
    );
  };

  return (
    <div>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {isEditMode ? "Edit Job" : "Post a Job"}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>

            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Add job title, role, vacancies etc"
              className={`w-full border rounded-md px-4 py-3 text-sm outline-none focus:ring-2 ${errors.jobTitle
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
                }`}
            />

            {renderInputError("jobTitle")}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>

              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Job keyword, tags etc..."
                className={`w-full border rounded-md px-4 py-3 text-sm outline-none focus:ring-2 ${errors.tags
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
                  }`}
              />

              {renderInputError("tags")}
            </div>

            <SelectField
              label="Job Role"
              name="jobRole"
              value={formData.jobRole}
              onChange={handleChange}
              options={jobRoles}
              error={errors.jobRole}
            />
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-4">Salary</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
            <SalaryInput
              label="Min Salary"
              name="minSalary"
              value={formData.minSalary}
              onChange={handleChange}
              placeholder="Minimum salary..."
              error={errors.minSalary}
            />

            <SalaryInput
              label="Max Salary"
              name="maxSalary"
              value={formData.maxSalary}
              onChange={handleChange}
              placeholder="Maximum salary..."
              error={errors.maxSalary}
            />

            <SelectField
              label="Salary Type"
              name="salaryType"
              value={formData.salaryType}
              onChange={handleChange}
              options={salaryTypes}
              error={errors.salaryType}
            />
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Advance Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
            <SelectField
              label="Education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              options={educationOptions}
              error={errors.education}
            />

            <SelectField
              label="Experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              options={experienceOptions}
              error={errors.experience}
            />

            <SelectField
              label="Job Type"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              options={jobTypes}
              error={errors.jobType}
            />

            <SelectField
              label="Vacancies"
              name="vacancies"
              value={formData.vacancies}
              onChange={handleChange}
              options={vacanciesOptions}
              error={errors.vacancies}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date
              </label>

              <input
                type="date"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
                className={`w-full border rounded-md px-4 py-3 text-sm outline-none focus:ring-2 ${errors.expirationDate
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
                  }`}
              />

              {renderInputError("expirationDate")}
            </div>

            <SelectField
              label="Job Level"
              name="jobLevel"
              value={formData.jobLevel}
              onChange={handleChange}
              options={jobLevels}
              error={errors.jobLevel}
            />
          </div>

          <div className="bg-gray-100 rounded-lg p-5 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Location
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
              <SelectField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                options={countryOptions}
                error={errors.country}
                disabled={formData.isRemote}
              />

              <SelectField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                options={cityOptions}
                error={errors.city}
                disabled={formData.isRemote}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="isRemote"
                checked={formData.isRemote}
                onChange={handleChange}
                className="w-4 h-4 accent-blue-600"
              />
              Fully Remote Position - <span className="font-semibold">Worldwide</span>
            </label>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Job Benefits
            </h2>

            <div className="flex flex-wrap gap-3">
              {jobBenefits.map((benefit) => (
                <button
                  type="button"
                  key={benefit}
                  onClick={() => handleBenefitToggle(benefit)}
                  className={`px-4 py-2 rounded-md border text-sm transition ${selectedBenefits.includes(benefit)
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600"
                    }`}
                >
                  {benefit}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Job Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add your job description..."
              rows={12}
              className={`w-full border rounded-md px-4 py-3 text-sm outline-none resize-none focus:ring-2 ${errors.description
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
                }`}
            />

            <div className="border border-t-0 border-gray-300 rounded-b-md px-4 py-3 flex gap-5 text-gray-400 text-sm">
              <span>B</span>
              <span>I</span>
              <span>U</span>
              <span>S</span>
              <span>🔗</span>
              <span>☷</span>
              <span>☰</span>
            </div>

            {renderInputError("description")}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold flex items-center gap-2 hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Posting..."
              : isEditMode
                ? "Update Job"
                : "Post Job"}

            <FiArrowRight />
          </button>
        </form>
      </div>

      <JobPostedSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        job={postedJob}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  disabled = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border rounded-md px-4 py-3 text-sm bg-white outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${error
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500"
          }`}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function SalaryInput({ label, name, value, onChange, placeholder, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="flex">
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border rounded-l-md px-4 py-3 text-sm outline-none focus:ring-2 ${error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
            }`}
        />

        <span className="border border-l-0 border-gray-300 rounded-r-md px-4 py-3 bg-gray-50 text-sm text-gray-600">
          USD
        </span>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}