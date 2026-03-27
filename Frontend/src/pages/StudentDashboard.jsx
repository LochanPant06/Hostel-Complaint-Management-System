import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ComplaintCard from "../components/ComplaintCard";

const statusConfig = {
  all:         { label: "All",         color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
  pending:     { label: "Pending",     color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  "in-progress": { label: "In Progress", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  resolved:    { label: "Resolved",   color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  rejected:    { label: "Rejected",   color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
};

export default function StudentDashboard() {
  const { token, user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/complaints/my", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setComplaints(res.data);
      setLoading(false);
      setTimeout(() => setMounted(true), 100);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? complaints : complaints.filter(c => c.status === filter);

  const counts = {
    all: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    "in-progress": complaints.filter(c => c.status === "in-progress").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
    rejected: complaints.filter(c => c.status === "rejected").length,
  };

  return (
    <div style={styles.page}>
      <div style={styles.orb1} /><div style={styles.orb2} />
      <div style={styles.grid} />

      <div style={{ ...styles.content, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s ease" }}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Complaints</h1>
            <p style={styles.subtitle}>Track all your submitted complaints in one place</p>
          </div>
          <button
            onClick={() => navigate("/submit")}
            style={styles.newBtn}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 40px rgba(99,102,241,0.5)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 32px rgba(99,102,241,0.4)"; }}
          >
            ✍️ New Complaint
          </button>
        </div>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          {[
            { label: "Total", value: counts.all, icon: "📋", color: "#6366f1" },
            { label: "Pending", value: counts.pending, icon: "⏳", color: "#f59e0b" },
            { label: "In Progress", value: counts["in-progress"], icon: "🔧", color: "#3b82f6" },
            { label: "Resolved", value: counts.resolved, icon: "✅", color: "#22c55e" },
          ].map((stat, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ ...styles.statIcon, color: stat.color }}>{stat.icon}</div>
              <div style={{ ...styles.statValue, color: stat.color }}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={styles.filterRow}>
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                ...styles.filterBtn,
                background: filter === key ? cfg.bg : "rgba(255,255,255,0.03)",
                border: `1px solid ${filter === key ? cfg.color + "60" : "rgba(255,255,255,0.08)"}`,
                color: filter === key ? cfg.color : "rgba(255,255,255,0.4)",
              }}
            >
              {cfg.label}
              <span style={{
                ...styles.filterCount,
                background: filter === key ? cfg.color : "rgba(255,255,255,0.1)",
                color: filter === key ? "#fff" : "rgba(255,255,255,0.4)",
              }}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Complaints List */}
        {loading ? (
          <div style={styles.emptyState}>
            <div style={styles.loadingSpinner}>⟳</div>
            <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading complaints...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <h3 style={{ color: "#fff", margin: "0 0 8px" }}>No complaints found</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", margin: "0 0 24px" }}>
              {filter === "all" ? "You haven't submitted any complaints yet." : `No ${filter} complaints.`}
            </p>
            {filter === "all" && (
              <button onClick={() => navigate("/submit")} style={{ ...styles.newBtn, padding: "10px 20px", fontSize: 14 }}>
                Submit First Complaint
              </button>
            )}
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map((c, i) => (
              <div key={c._id} style={{ animationDelay: `${i * 0.05}s` }}>
                <ComplaintCard complaint={c} isAdmin={false} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)",
    position: "relative", overflow: "hidden",
    fontFamily: "'Georgia', serif",
  },
  orb1: {
    position: "fixed", top: "10%", right: "-5%",
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  orb2: {
    position: "fixed", bottom: "10%", left: "-5%",
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  grid: {
    position: "fixed", inset: 0,
    backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
    backgroundSize: "50px 50px", pointerEvents: "none",
  },
  content: { position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "40px 24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 },
  title: { color: "#fff", fontSize: 32, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" },
  subtitle: { color: "rgba(255,255,255,0.4)", fontSize: 15, margin: 0 },
  newBtn: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", border: "none", borderRadius: 12,
    padding: "12px 24px", fontSize: 15, fontWeight: 700,
    cursor: "pointer", boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
    transition: "all 0.2s", whiteSpace: "nowrap",
  },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 },
  statCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16, padding: "20px 16px",
    textAlign: "center",
    backdropFilter: "blur(10px)",
  },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: 700, marginBottom: 4 },
  statLabel: { color: "rgba(255,255,255,0.4)", fontSize: 13 },
  filterRow: { display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" },
  filterBtn: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 16px", borderRadius: 10,
    fontSize: 13, fontWeight: 600, cursor: "pointer",
    transition: "all 0.2s", fontFamily: "inherit",
  },
  filterCount: { padding: "2px 8px", borderRadius: 20, fontSize: 12, fontWeight: 700 },
  list: { display: "flex", flexDirection: "column", gap: 16 },
  emptyState: {
    textAlign: "center", padding: "80px 20px",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 20,
  },
  loadingSpinner: { fontSize: 40, color: "#6366f1", animation: "spin 1s linear infinite", marginBottom: 16 },
};
