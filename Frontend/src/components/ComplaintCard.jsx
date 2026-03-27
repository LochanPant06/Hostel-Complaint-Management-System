import { useState } from "react";

const statusConfig = {
  pending:       { bg: "rgba(245,158,11,0.15)",  color: "#f59e0b", border: "rgba(245,158,11,0.3)",  label: "⏳ Pending" },
  "in-progress": { bg: "rgba(59,130,246,0.15)",  color: "#3b82f6", border: "rgba(59,130,246,0.3)",  label: "🔧 In Progress" },
  resolved:      { bg: "rgba(34,197,94,0.15)",   color: "#22c55e", border: "rgba(34,197,94,0.3)",   label: "✅ Resolved" },
  rejected:      { bg: "rgba(239,68,68,0.15)",   color: "#ef4444", border: "rgba(239,68,68,0.3)",   label: "❌ Rejected" },
};

const priorityConfig = {
  low:    { color: "#22c55e", label: "🟢 Low" },
  medium: { color: "#f59e0b", label: "🟡 Medium" },
  high:   { color: "#ef4444", label: "🔴 High" },
};

const categoryIcons = {
  plumbing: "🚿", electricity: "⚡", cleaning: "🧹",
  furniture: "🪑", internet: "📶", security: "🔐", other: "📌",
};

export default function ComplaintCard({ complaint, isAdmin = false, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover] = useState(false);

  const status   = statusConfig[complaint.status]   || statusConfig.pending;
  const priority = priorityConfig[complaint.priority] || priorityConfig.medium;
  const catIcon  = categoryIcons[complaint.category] || "📌";

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  });

  return (
    <div
      style={{
        ...styles.card,
        borderColor: hover ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.08)",
        boxShadow: hover ? "0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,102,241,0.1)" : "0 4px 20px rgba(0,0,0,0.2)",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Top row */}
      <div style={styles.topRow}>
        <div style={styles.categoryBadge}>
          <span>{catIcon}</span>
          <span style={styles.categoryText}>{complaint.category}</span>
        </div>
        <div style={styles.badges}>
          <span style={{ ...styles.priorityBadge, color: priority.color }}>{priority.label}</span>
          <span style={{ ...styles.statusBadge, background: status.bg, color: status.color, borderColor: status.border }}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 style={styles.title}>{complaint.title}</h3>

      {/* Description */}
      <p style={styles.description}>{complaint.description}</p>

      {/* Student info (admin only) */}
      {isAdmin && complaint.student && (
        <div style={styles.studentRow}>
          <div style={styles.studentAvatar}>{complaint.student.name?.charAt(0).toUpperCase()}</div>
          <div>
            <span style={styles.studentName}>{complaint.student.name}</span>
            <span style={styles.studentMeta}> · {complaint.student.email} · Room {complaint.student.roomNo || "N/A"} · Block {complaint.student.hostelBlock || "N/A"}</span>
          </div>
        </div>
      )}

      {/* Admin remark */}
      {complaint.adminRemark && (
        <div style={styles.remarkBox}>
          <span style={styles.remarkIcon}>💬</span>
          <div>
            <div style={styles.remarkLabel}>Admin Remark</div>
            <div style={styles.remarkText}>{complaint.adminRemark}</div>
          </div>
        </div>
      )}

      {/* Footer row */}
      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          <span style={styles.dateText}>📅 {formatDate(complaint.createdAt)}</span>
          {complaint.resolvedAt && (
            <span style={styles.dateText}>🏁 Resolved {formatDate(complaint.resolvedAt)}</span>
          )}
        </div>

        {/* History toggle */}
        {complaint.statusHistory?.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={styles.historyToggle}
          >
            {expanded ? "▲ Hide History" : `▼ History (${complaint.statusHistory.length})`}
          </button>
        )}
      </div>

      {/* Status history */}
      {expanded && complaint.statusHistory?.length > 0 && (
        <div style={styles.historySection}>
          <div style={styles.historyTitle}>Status History</div>
          <div style={styles.timeline}>
            {complaint.statusHistory.map((entry, i) => {
              const s = statusConfig[entry.status] || statusConfig.pending;
              return (
                <div key={i} style={styles.timelineItem}>
                  <div style={{ ...styles.timelineDot, background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                  {i < complaint.statusHistory.length - 1 && <div style={styles.timelineLine} />}
                  <div style={styles.timelineContent}>
                    <span style={{ ...styles.timelineStatus, color: s.color }}>{s.label}</span>
                    <span style={styles.timelineDate}>{formatDate(entry.changedAt)}</span>
                    {entry.remark && <span style={styles.timelineRemark}>"{entry.remark}"</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Admin update form */}
      {isAdmin && onUpdate && (
        <AdminUpdateForm complaint={complaint} onUpdate={onUpdate} />
      )}
    </div>
  );
}

function AdminUpdateForm({ complaint, onUpdate }) {
  const [status, setStatus] = useState(complaint.status);
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleUpdate = async () => {
    if (!remark.trim()) return alert("Please add a remark.");
    setLoading(true);
    await onUpdate(complaint._id, status, remark);
    setRemark("");
    setDone(true);
    setTimeout(() => setDone(false), 2000);
    setLoading(false);
  };

  return (
    <div style={styles.updateForm}>
      <div style={styles.updateLabel}>⚙️ Update Complaint</div>
      <div style={styles.updateRow}>
        <select value={status} onChange={e => setStatus(e.target.value)} style={styles.select}>
          <option value="pending">⏳ Pending</option>
          <option value="in-progress">🔧 In Progress</option>
          <option value="resolved">✅ Resolved</option>
          <option value="rejected">❌ Rejected</option>
        </select>
        <input
          placeholder="Add a remark for the student..."
          value={remark}
          onChange={e => setRemark(e.target.value)}
          style={styles.remarkInput}
          onKeyDown={e => e.key === "Enter" && handleUpdate()}
        />
        <button
          onClick={handleUpdate}
          disabled={loading}
          style={{
            ...styles.updateBtn,
            background: done ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? "..." : done ? "✅ Done!" : "Update"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20, padding: 24,
    fontFamily: "'Georgia', serif",
    transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
    cursor: "default",
  },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 },
  categoryBadge: { display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "4px 10px" },
  categoryText: { color: "rgba(255,255,255,0.6)", fontSize: 13, textTransform: "capitalize", fontWeight: 600 },
  badges: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
  priorityBadge: { fontSize: 13, fontWeight: 600 },
  statusBadge: { padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700, border: "1px solid" },
  title: { color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.3 },
  description: { color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.7, margin: "0 0 16px" },
  studentRow: { display: "flex", alignItems: "center", gap: 10, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 10, padding: "10px 14px", marginBottom: 14 },
  studentAvatar: { width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0 },
  studentName: { color: "#818cf8", fontWeight: 700, fontSize: 14 },
  studentMeta: { color: "rgba(255,255,255,0.4)", fontSize: 13 },
  remarkBox: { display: "flex", gap: 10, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, padding: "12px 14px", marginBottom: 14, alignItems: "flex-start" },
  remarkIcon: { fontSize: 18, flexShrink: 0 },
  remarkLabel: { color: "#fbbf24", fontSize: 12, fontWeight: 700, marginBottom: 2 },
  remarkText: { color: "rgba(255,255,255,0.7)", fontSize: 14 },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" },
  footerLeft: { display: "flex", gap: 16, flexWrap: "wrap" },
  dateText: { color: "rgba(255,255,255,0.35)", fontSize: 13 },
  historyToggle: { background: "transparent", border: "none", color: "#6366f1", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, padding: 0 },
  historySection: { marginTop: 16, background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: 16 },
  historyTitle: { color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 14 },
  timeline: { display: "flex", flexDirection: "column", gap: 0 },
  timelineItem: { display: "flex", gap: 12, alignItems: "flex-start", position: "relative", paddingBottom: 16 },
  timelineDot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0, marginTop: 4 },
  timelineLine: { position: "absolute", left: 4, top: 14, bottom: 0, width: 2, background: "rgba(255,255,255,0.08)" },
  timelineContent: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" },
  timelineStatus: { fontWeight: 700, fontSize: 13 },
  timelineDate: { color: "rgba(255,255,255,0.35)", fontSize: 12 },
  timelineRemark: { color: "rgba(255,255,255,0.5)", fontSize: 13, fontStyle: "italic", width: "100%" },
  updateForm: { marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" },
  updateLabel: { color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 700, letterSpacing: "0.5px", marginBottom: 10 },
  updateRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  select: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, cursor: "pointer", outline: "none", fontFamily: "inherit" },
  remarkInput: { flex: 1, minWidth: 160, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" },
  updateBtn: { padding: "10px 20px", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.3s", whiteSpace: "nowrap", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(99,102,241,0.3)" },
};
