import { useState } from "react";
import { toast } from "react-toastify";
import {
  FiUploadCloud,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiImage,
} from "react-icons/fi";

import { validateCompanyInfo } from "../../../utils/recruiterSettingsValidation";
import { updateRecruiterCompanyInfo } from "../../../services/recruiterSettingsService";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
];

export default function CompanyInfoSettings({
  recruiterProfileId,
  companyInfo,
  setCompanyInfo,
}) {
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCompanyInfo((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setMessage({
      type: "",
      text: "",
    });
  };

  const handleImageChange = (field, file) => {
    if (!file) {
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Please upload a PNG or JPG image.",
      });

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage({
        type: "error",
        text: "Image size must be less than 5 MB.",
      });

      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setCompanyInfo((previous) => ({
      ...previous,
      [field]: {
        file,
        previewUrl,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      },
    }));

    setMessage({
      type: "",
      text: "",
    });
  };

  const handleRemoveImage = (field) => {
    setCompanyInfo((previous) => {
      const currentValue = previous[field];

      if (
        currentValue &&
        typeof currentValue === "object" &&
        currentValue.previewUrl
      ) {
        URL.revokeObjectURL(currentValue.previewUrl);
      }

      return {
        ...previous,
        [field]: "",
      };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    if (!recruiterProfileId) {
      setMessage({
        type: "error",
        text: "Recruiter profile could not be identified.",
      });

      return;
    }

    const validationErrors = validateCompanyInfo(companyInfo);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      setMessage({
        type: "error",
        text: "Please fix the highlighted fields before saving.",
      });

      return;
    }

    try {
      setSaving(true);

      const updated = await updateRecruiterCompanyInfo(
        recruiterProfileId,
        companyInfo
      );

      setCompanyInfo({
        logo: updated.logo || "",
        banner: updated.banner || "",
        companyName: updated.companyName || "",
        aboutUs: updated.about || "",
      });
      toast.success("Company info updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update company info");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-10">

      {/* =====================================================
          STATUS MESSAGE
      ====================================================== */}

      {message.text && (
        <div
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <FiCheckCircle className="shrink-0 text-lg" />
          ) : (
            <FiAlertCircle className="shrink-0 text-lg" />
          )}

          <span>{message.text}</span>
        </div>
      )}

      {/* =====================================================
          COMPANY BRANDING SECTION
      ====================================================== */}

      <section>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Company Branding
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add your company logo and banner image to create a professional
            company profile.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          {/* LOGO */}

          <ImageUploadPreview
            label="Company Logo"
            description="Your company logo"
            value={companyInfo.logo}
            onChange={(file) => handleImageChange("logo", file)}
            onRemove={() => handleRemoveImage("logo")}
            boxClassName="h-44"
            imageClassName="object-contain p-6"
          />

          {/* BANNER */}

          <ImageUploadPreview
            label="Banner Image"
            description="Displayed on your company profile"
            value={companyInfo.banner}
            onChange={(file) => handleImageChange("banner", file)}
            onRemove={() => handleRemoveImage("banner")}
            boxClassName="h-44"
            imageClassName="object-cover"
          />
        </div>
      </section>

      {/* =====================================================
          BASIC INFORMATION SECTION
      ====================================================== */}

      <section className="border-t border-gray-200 pt-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Provide candidates with information about your company.
          </p>
        </div>

        {/* COMPANY NAME */}

        <div className="mb-6">
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Company Name
          </label>

          <input
            id="companyName"
            type="text"
            name="companyName"
            value={companyInfo.companyName}
            onChange={handleChange}
            placeholder="Enter your company name"
            className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 outline-none transition ${
              errors.companyName
                ? "border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            }`}
          />

          {errors.companyName && (
            <p className="mt-2 text-xs text-red-500">
              {errors.companyName}
            </p>
          )}
        </div>

        {/* ABOUT COMPANY */}

        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="aboutUs"
              className="block text-sm font-medium text-gray-700"
            >
              About Company
            </label>

            <span className="text-xs text-gray-400">
              {companyInfo.aboutUs?.length || 0} characters
            </span>
          </div>

          <textarea
            id="aboutUs"
            name="aboutUs"
            value={companyInfo.aboutUs}
            onChange={handleChange}
            placeholder="Tell candidates about your company, culture, mission, and what makes your organization unique..."
            rows={7}
            className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 outline-none resize-none transition ${
              errors.aboutUs
                ? "border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            }`}
          />

          {errors.aboutUs && (
            <p className="mt-2 text-xs text-red-500">
              {errors.aboutUs}
            </p>
          )}
        </div>
      </section>

      {/* =====================================================
          ACTIONS
      ====================================================== */}

      <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

/* ============================================================
   IMAGE UPLOAD COMPONENT
============================================================ */

function ImageUploadPreview({
  label,
  description,
  value,
  onChange,
  onRemove,
  boxClassName = "",
  imageClassName = "",
}) {
  const [isDragging, setIsDragging] = useState(false);

  const previewSrc =
    typeof value === "string"
      ? value
      : value?.previewUrl || "";

  const handleFile = (file) => {
    if (!file) {
      return;
    }

    onChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    handleFile(file);
  };

  return (
    <div>
      {/* LABEL */}

      <div className="mb-2">
        <p className="text-sm font-medium text-gray-700">
          {label}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {description}
        </p>
      </div>

      {/* UPLOAD BOX */}

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={`relative flex cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
        } ${boxClassName}`}
      >
        {previewSrc ? (
          <>
            <img
              src={previewSrc}
              alt={label}
              className={`h-full w-full ${imageClassName}`}
            />

            {/* IMAGE OVERLAY */}

            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition hover:opacity-100">
              <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700">
                <FiUploadCloud />
                Replace Image
              </div>
            </div>
          </>
        ) : (
          <div className="text-center px-5">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <FiImage className="text-xl" />
            </div>

            <p className="text-sm font-semibold text-gray-700">
              Upload Image
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Drag & drop or click to browse
            </p>

            <p className="mt-2 text-xs text-gray-400">
              PNG or JPG · Maximum 5 MB
            </p>
          </div>
        )}

        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);

            // Allows selecting the same file again
            e.target.value = "";
          }}
          className="hidden"
        />
      </label>

      {/* IMAGE ACTIONS */}

      {previewSrc && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiCheckCircle className="text-green-500" />

            <span>
              {value?.size || "Uploaded image"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700">
              Replace

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={(e) => {
                  handleFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600"
            >
              <FiX />
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}