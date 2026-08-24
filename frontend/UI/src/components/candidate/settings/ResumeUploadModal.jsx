import { useEffect, useState } from "react";
import { FiX, FiUploadCloud } from "react-icons/fi";
import { validateResumeFile } from "../../../utils/candidateSettingsValidation";

export default function ResumeUploadModal({ isOpen, onClose, onSave, uploading = false }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [defaultResume, setDefaultResume] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setResumeFile(null);
      setDefaultResume(true);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    const validationErrors = validateResumeFile(file);

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors.resume);
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
    setError("");
  };

  const handleSubmit = () => {
    if (!resumeFile) {
      setError("Please upload your CV/Resume");
      return;
    }

    onSave({ file: resumeFile, defaultResume });
  };
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          disabled={uploading}
          className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-60"
          aria-label="Close modal"
        >
          <FiX className="text-xl" />
        </button>

        <div className="p-6">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">Upload CV/Resume</h2>

          <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 text-center transition hover:bg-gray-50">
            <FiUploadCloud className="mb-2 text-4xl text-gray-400" />
            <p className="text-sm text-gray-700">
              <span className="font-medium">Browse File</span> or drop here
            </p>
            <p className="mt-1 text-xs text-gray-400">PDF, DOC, DOCX. Max file size 5 MB.</p>
            {resumeFile && (
              <p className="mt-2 max-w-full truncate text-xs font-medium text-blue-600">
                Selected: {resumeFile.name}
              </p>
            )}
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

          <label className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={defaultResume}
              onChange={(e) => setDefaultResume(e.target.checked)}
              className="h-4 w-4 accent-blue-600"
            />
            Set as default resume
          </label>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="rounded-md bg-blue-50 px-5 py-3 font-medium text-blue-600 hover:bg-blue-100 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading}
              className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              {uploading ? "Uploading..." : "Upload Resume"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
