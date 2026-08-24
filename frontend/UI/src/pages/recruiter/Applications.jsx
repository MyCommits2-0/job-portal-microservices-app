import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { FiPlusCircle, FiChevronDown } from "react-icons/fi";

import ApplicationColumn from "../../components/recruiter/ApplicationColumn";
import AddColumnModal from "../../components/recruiter/AddColumnModal";
import {
  getRecruiterApplications,
  createColumn,
  moveApplicationToColumn,
  updateApplicationStatus,
} from "../../services/recruiterApplicationService";
import { extractAuthErrorMessage } from "../../services/authService";

export default function Applications() {
  const { jobId } = useParams();

  const [columns, setColumns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [sortBy, setSortBy] = useState("Newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRecruiterApplications(jobId);

      setColumns(data?.columns || []);
      setApplications(data?.applications || []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setError("Couldn't load applications for this job.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchApplications();
  }, [jobId]);

  const handleAddColumn = async (columnName) => {
    try {
      const newColumn = await createColumn(jobId, columnName);
      setColumns((prev) => [...prev, newColumn]);
    } catch (err) {
      console.error("Failed to create column:", err);
      alert("Failed to create column");
    }
  };

  const handleMoveApplication = async (applicationId, columnId) => {
    // Optimistic update so the board feels immediate; refetch on failure to
    // reconcile with the server's actual state.
    setApplications((prev) =>
      prev.map((app) =>
        app.applicationId === applicationId ? { ...app, columnId } : app
      )
    );

    try {
      await moveApplicationToColumn(applicationId, columnId);
    } catch (err) {
      console.error("Failed to move application:", err);
      alert("Failed to move application");
      fetchApplications();
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    const previous = applications;

    setApplications((prev) =>
      prev.map((app) =>
        app.applicationId === applicationId ? { ...app, status } : app
      )
    );

    try {
      await updateApplicationStatus(applicationId, status);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(extractAuthErrorMessage(err));
      setApplications(previous);
    }
  };

  const sortedApplications = useMemo(() => {
    const copiedApplications = [...applications];

    if (sortBy === "Newest") {
      return copiedApplications.sort(
        (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
      );
    }

    return copiedApplications.sort(
      (a, b) => new Date(a.appliedAt) - new Date(b.appliedAt)
    );
  }, [applications, sortBy]);

  const getColumnApplications = (columnId) => {
    return sortedApplications.filter((item) => item.columnId === columnId);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Job Applications
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage candidates by application status.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-md text-sm font-semibold flex items-center gap-2"
              >
                Sort
                <FiChevronDown />
              </button>

              {showSortMenu && (
                <div className="absolute right-0 top-12 w-44 bg-white border border-gray-200 shadow-lg rounded-md p-4 z-20">
                  <p className="text-xs text-gray-400 font-semibold mb-3">
                    SORT APPLICATION
                  </p>

                  <label className="flex items-center gap-2 text-sm text-gray-700 mb-3 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === "Newest"}
                      onChange={() => {
                        setSortBy("Newest");
                        setShowSortMenu(false);
                      }}
                      className="accent-blue-600"
                    />
                    Newest
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === "Oldest"}
                      onChange={() => {
                        setSortBy("Oldest");
                        setShowSortMenu(false);
                      }}
                      className="accent-blue-600"
                    />
                    Oldest
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500">
          Loading applications...
        </div>
      ) : error ? (
        <div className="py-20 text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max">
            {columns.map((column) => (
              <ApplicationColumn
                key={column.id}
                column={{ id: column.id, title: column.columnName }}
                columns={columns.map((c) => ({ id: c.id, title: c.columnName }))}
                applications={getColumnApplications(column.id)}
                onMoveApplication={handleMoveApplication}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}

            <button
              type="button"
              onClick={() => setShowAddColumnModal(true)}
              className="min-w-[260px] h-[56px] border border-gray-200 rounded-lg bg-gray-50 text-gray-700 flex items-center justify-center gap-2 hover:bg-blue-50 hover:text-blue-600"
            >
              <FiPlusCircle />
              Create New Column
            </button>
          </div>
        </div>
      )}

      <AddColumnModal
        isOpen={showAddColumnModal}
        onClose={() => setShowAddColumnModal(false)}
        onAddColumn={handleAddColumn}
      />
    </div>
  );
}
