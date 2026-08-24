import { FiPlusCircle } from "react-icons/fi";

export default function ResumeUploadBox({ onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <FiPlusCircle className="text-xl text-blue-600" />
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Add CV/Resume</h3>
        <p className="text-xs text-gray-500">PDF, DOC, or DOCX. Max 5 MB.</p>
      </div>
    </button>
  );
}
