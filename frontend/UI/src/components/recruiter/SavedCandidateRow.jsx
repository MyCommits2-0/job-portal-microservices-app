import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBookmark,
  FiArrowRight,
  FiMoreVertical,
  FiMail,
  FiDownload,
} from "react-icons/fi";

import { unsaveCandidate } from "../../services/recruiterCandidateService";

export default function SavedCandidateRow({ candidate, highlighted, onUnsaved }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [unsavePending, setUnsavePending] = useState(false);

  const handleViewProfile = () => {
    navigate(`/recruiter/candidate-profile/${candidate.id}`);
  };

  const handleUnsave = async () => {
    if (unsavePending) return;

    setUnsavePending(true);
    try {
      await unsaveCandidate(candidate.id);
      onUnsaved?.();
    } catch (error) {
      console.error("Failed to remove saved candidate:", error);
    } finally {
      setUnsavePending(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 sm:px-5 py-4 border-b border-gray-200 transition ${
        highlighted
          ? "border border-blue-500 rounded-md shadow-sm"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-4">
        <img
          src={candidate.avatar}
          alt={candidate.name}
          className="w-12 h-12 rounded-md object-cover"
        />

        <div>
          <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
          <p className="text-sm text-gray-500">{candidate.title}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={handleUnsave}
          disabled={unsavePending}
          title="Remove from saved candidates"
          className="text-blue-600 hover:text-blue-700"
        >
          <FiBookmark className="fill-current text-lg" />
        </button>

        <button
          onClick={handleViewProfile}
          className={`px-5 py-3 rounded-md font-semibold flex items-center gap-2 transition ${
            highlighted
              ? "bg-blue-600 text-white"
              : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
          }`}
        >
          View Profile
          <FiArrowRight />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-500 hover:text-blue-600"
          >
            <FiMoreVertical />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-44 bg-white border border-gray-200 shadow-lg rounded-md z-30 overflow-hidden">
              <button className="w-full px-4 py-3 text-sm flex items-center gap-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600">
                <FiMail />
                Send Email
              </button>

              <button className="w-full px-4 py-3 text-sm flex items-center gap-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600">
                <FiDownload />
                Download CV
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}