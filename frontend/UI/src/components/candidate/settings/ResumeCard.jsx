import { FiFileText, FiMoreHorizontal, FiTrash2, FiStar, FiExternalLink } from "react-icons/fi";

export default function ResumeCard({
  resume,
  activeMenuId,
  setActiveMenuId,
  onDelete,
  onSetDefault,
}) {
  const isMenuOpen = activeMenuId === resume.id;
  const fileName = resume.fileName || resume.name || "Resume";
  const fileUrl = resume.fileUrl || resume.url;

  return (
    <div className="relative rounded-lg border border-gray-200 bg-gray-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-1 rounded-md bg-blue-100 p-2 text-blue-600">
            <FiFileText className="text-xl" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-gray-900">{fileName}</h3>
              {resume.defaultResume && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                  Default
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {resume.resourceType || resume.fileType || "Document"}
              {resume.size ? ` • ${resume.size}` : ""}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveMenuId(isMenuOpen ? null : resume.id)}
          className="rounded-md p-2 text-gray-500 hover:bg-white hover:text-blue-600"
          aria-label="Open resume menu"
        >
          <FiMoreHorizontal />
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute right-4 top-14 z-20 w-44 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              onClick={() => setActiveMenuId(null)}
            >
              <FiExternalLink />
              View Resume
            </a>
          )}

          {!resume.defaultResume && (
            <button
              type="button"
              onClick={() => {
                onSetDefault?.(resume.id);
                setActiveMenuId(null);
              }}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              <FiStar />
              Set Default
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete?.(resume.id)}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50"
          >
            <FiTrash2 />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
