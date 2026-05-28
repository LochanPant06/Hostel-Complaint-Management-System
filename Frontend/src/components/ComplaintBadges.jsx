import { getPriorityStyle, getStatusStyle } from "../utils/helpers.js";

const baseBadgeClass =
  "inline-flex items-center rounded-sm border px-2 py-1 text-[11px] font-medium leading-none";

export function StatusBadge({ status }) {
  return (
    <span className={`${baseBadgeClass} ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`${baseBadgeClass} ${getPriorityStyle(priority)}`}>
      {priority}
    </span>
  );
}
