import { useState } from "react";
import { FiX, FiBriefcase } from "react-icons/fi";

import { validateExperience } from "../../../utils/candidateSettingsValidation";

function emptyExperience() {
  return { companyName: "", jobTitle: "", startDate: "", endDate: "", description: "" };
}

export default function ExperienceModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState(emptyExperience());
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
    setForm(emptyExperience());
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateExperience(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      await onSave(form);
      setForm(emptyExperience());
      setErrors({});
      onClose();
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({ ...prev, submit: "Failed to add experience. Please try again." }));
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

        <form onSubmit={handleSubmit} className="max-h-[85vh] overflow-y-auto p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-md bg-blue-100 p-2 text-blue-600">
              <FiBriefcase className="text-xl" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Add Experience</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} error={errors.companyName} placeholder="Google" />
            <Field label="Job Title" name="jobTitle" value={form.jobTitle} onChange={handleChange} error={errors.jobTitle} placeholder="Software Engineer" />
            <Field type="date" label="Start Date" name="startDate" value={form.startDate} onChange={handleChange} error={errors.startDate} />
            <Field type="date" label="End Date" name="endDate" value={form.endDate} onChange={handleChange} placeholder="Leave blank if current" />
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Briefly describe your role and achievements..."
                className="w-full resize-none rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
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
              {submitting ? "Adding..." : "Add Experience"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, error, placeholder, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-md border px-4 py-3 text-sm outline-none focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
