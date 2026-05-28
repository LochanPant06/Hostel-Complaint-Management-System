export const statusStyles = {
  Pending: "border-transparent bg-[#fef3c7] text-[#92400e]",
  Assigned: "border-transparent bg-[#dbeafe] text-[#1e40af]",
  "In Progress": "border-transparent bg-[#dbeafe] text-[#1e40af]",
  Resolved: "border-transparent bg-[#dcfce7] text-[#15803d]",
  Rejected: "border-transparent bg-[#fee2e2] text-[#b91c1c]",
};

export const priorityStyles = {
  High: "border-transparent bg-[#fee2e2] text-[#b91c1c]",
  Medium: "border-transparent bg-[#fef3c7] text-[#92400e]",
  Low: "border-transparent bg-[#f0fdf4] text-[#15803d]",
};

export const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const truncateText = (text, length = 140) => {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length)}…` : text;
};

export const getStatusStyle = (status) =>
  statusStyles[status] || "border-line bg-section text-body";

export const getPriorityStyle = (priority) =>
  priorityStyles[priority] || "border-line bg-section text-body";
