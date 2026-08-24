import { useState } from "react";
import { FiX, FiBookOpen } from "react-icons/fi";

import { validateEducation } from "../../../utils/candidateSettingsValidation";

function emptyEducation() {
  return { degree: "", institute: "", passingYear: "", grade: "" };
}

export default function EducationModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState(emptyEducation());
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
    setForm(emptyEducation());
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateEducation(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      await onSave(form);
      setForm(emptyEducation());
      setErrors({});
      onClose();
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({ ...prev, submit: "Failed to add education. Please try again." }));
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
              <FiBookOpen className="text-xl" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Add Education</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Degree" name="degree" value={form.degree} onChange={handleChange} error={errors.degree} placeholder="B.Tech in Computer Science" />
            <Field label="Institute" name="institute" value={form.institute} onChange={handleChange} error={errors.institute} placeholder="XYZ University" />
            <Field label="Passing Year" name="passingYear" value={form.passingYear} onChange={handleChange} error={errors.passingYear} placeholder="2024" />
            <Field label="Grade" name="grade" value={form.grade} onChange={handleChange} placeholder="8.5 CGPA (optional)" />
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
              {submitting ? "Adding..." : "Add Education"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, error, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <input
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
