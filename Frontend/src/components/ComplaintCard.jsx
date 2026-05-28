import { PriorityBadge, StatusBadge } from "./ComplaintBadges.jsx";
import { formatDate, truncateText } from "../utils/helpers.js";

export default function ComplaintCard({
  complaint,
  showReporter = false,
  onView,
}) {
  return (
    <article className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.06em] text-muted">
            {complaint.category}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-ink">
            {complaint.title}
          </h3>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <p className="mt-3 text-sm text-body">
        {truncateText(complaint.description, 120)}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <PriorityBadge priority={complaint.priority} />
        <span className="text-xs text-muted">{formatDate(complaint.createdAt)}</span>
      </div>

      {showReporter && complaint.createdBy ? (
        <p className="mt-3 text-xs text-muted">
          {complaint.createdBy.name} · Room {complaint.createdBy.roomNumber || "—"}
        </p>
      ) : null}

      <div className="mt-4 flex items-center gap-4">
        <button type="button" onClick={onView} className="text-sm text-accent">
          View
        </button>
      </div>
    </article>
  );
}
