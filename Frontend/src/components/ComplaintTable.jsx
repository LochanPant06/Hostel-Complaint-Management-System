import ComplaintCard from "./ComplaintCard.jsx";
import { PriorityBadge, StatusBadge } from "./ComplaintBadges.jsx";
import { formatDate, truncateText } from "../utils/helpers.js";

export default function ComplaintTable({
  complaints,
  showReporter = false,
  onViewComplaint,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  return (
    <div className="space-y-4">
      <div className="card hidden overflow-hidden lg:block">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-line">
              <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
                Complaint
              </th>
              {showReporter ? (
                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
                  Student
                </th>
              ) : null}
              <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
                Created
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr
                key={complaint._id}
                className="border-b border-line transition-colors duration-150 hover:bg-section"
              >
                <td className="px-4 py-3 align-top">
                  <button
                    type="button"
                    onClick={() => onViewComplaint(complaint)}
                    className="text-left"
                  >
                    <p className="font-medium text-ink">{complaint.title}</p>
                    <p className="mt-1 text-sm text-body">
                      {truncateText(complaint.description, 88)}
                    </p>
                    <p className="mt-2 text-xs text-muted">{complaint.category}</p>
                  </button>
                </td>
                {showReporter ? (
                  <td className="px-4 py-3 align-top text-sm text-body">
                    <p className="font-medium text-ink">
                      {complaint.createdBy?.name || "Unknown"}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Room {complaint.createdBy?.roomNumber || "—"} · Block{" "}
                      {complaint.createdBy?.hostelBlock || "—"}
                    </p>
                  </td>
                ) : null}
                <td className="px-4 py-3 align-top">
                  <StatusBadge status={complaint.status} />
                </td>
                <td className="px-4 py-3 align-top">
                  <PriorityBadge priority={complaint.priority} />
                </td>
                <td className="px-4 py-3 align-top text-sm text-body">
                  {formatDate(complaint.createdAt)}
                </td>
                <td className="px-4 py-3 align-top">
                  <button
                    type="button"
                    onClick={() => onViewComplaint(complaint)}
                    className="text-sm text-accent transition-colors duration-150 hover:text-accent/80"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {complaints.map((complaint) => (
          <ComplaintCard
            key={complaint._id}
            complaint={complaint}
            showReporter={showReporter}
            onView={() => onViewComplaint(complaint)}
          />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="button-secondary"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`inline-flex h-9 min-w-9 items-center justify-center rounded-sm border px-3 text-sm transition-colors duration-150 ${
                    page === currentPage
                      ? "border-primary bg-primary text-white"
                      : "border-line bg-canvas text-body hover:bg-section hover:text-ink"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="button-secondary"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
