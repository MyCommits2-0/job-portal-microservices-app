import { useState } from "react";
import { FiMoreHorizontal, FiEdit2, FiTrash2 } from "react-icons/fi";
import ApplicantCard from "./ApplicantCard";

export default function ApplicationColumn({
  column,
  columns,
  applications,
  onMoveApplication,
  onUpdateStatus,
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg min-w-[280px]">
      <div className="px-4 py-4 flex items-center justify-between border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">
          {column.title}{" "}
          <span className="text-gray-400 font-normal">
            ({applications.length})
          </span>
        </h2>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-500 hover:text-blue-600"
          >
            <FiMoreHorizontal />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden">
              <button className="w-full px-4 py-3 text-sm flex items-center gap-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600">
                <FiEdit2 />
                Edit Column
              </button>

              <button className="w-full px-4 py-3 text-sm flex items-center gap-2 text-red-500 hover:bg-red-50">
                <FiTrash2 />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[620px] overflow-y-auto">
        {applications.length > 0 ? (
          applications.map((application) => (
            <ApplicantCard
              key={application.applicationId}
              application={application}
              columns={columns}
              onMoveApplication={onMoveApplication}
              onUpdateStatus={onUpdateStatus}
            />
          ))
        ) : (
          <div className="text-center py-10 text-sm text-gray-500">
            No applications
          </div>
        )}
      </div>
    </div>
  );
}