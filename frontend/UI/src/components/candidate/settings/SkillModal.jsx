import { useState } from "react";
import { FiX, FiAward } from "react-icons/fi";

export default function SkillModal({ isOpen, onClose, onSave }) {
  const [skillName, setSkillName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (submitting) return;
    setSkillName("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!skillName.trim()) {
      setError("Skill name is required");
      return;
    }

    try {
      setSubmitting(true);
      await onSave({ name: skillName.trim() });
      setSkillName("");
      setError("");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to add skill. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl">
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
              <FiAward className="text-xl" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Add Skill</h2>
          </div>

          <label className="mb-2 block text-sm font-medium text-gray-700">Skill Name</label>
          <input
            value={skillName}
            onChange={(e) => {
              setSkillName(e.target.value);
              setError("");
            }}
            placeholder="Example: Java"
            className={`w-full rounded-md border px-4 py-3 text-sm outline-none focus:ring-2 ${
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

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
              {submitting ? "Adding..." : "Add Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
