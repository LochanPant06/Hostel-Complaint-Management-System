import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ComplaintCard from "../components/ComplaintCard";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchAll = () => {
    axios.get("http://localhost:5000/api/complaints/all", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setComplaints(res.data);
      setLoading(false);
      setTimeout(() => setMounted(true), 100);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleUpdate = async (id, status, adminRemark) => {
    await axios.put(`http://localhost:5000/api/complaints/${id}`, { status, adminRemark }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAll();
  };

  const counts = {
    all: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    "in-progress": complaints.filter(c => c.status === "in-progress").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
    rejected: complaints.filter(c => c.status === "rejected").length,
  };

  const filtered = complaints.filter(c => {
    const matchStatus   = filter === "all" || c.status === filter;
    const matchCategory = categoryFilter === "all" || c.category === categoryFilter;
    const matchSearch   = search === "" ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.student?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchCategory && matchSearch;
  });

  const statCards = [
    { label: "Total",       value: counts.all,            icon: "📋", color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
    { label: "Pending",     value: counts.pending,         icon: "⏳", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
    { label: "In Progress", value: counts["in-progress"],  icon: "🔧", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
    { label: "Resolved",    value: counts.resolved,        icon: "✅", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
    { label: "Rejected",    value: counts.rejected,        icon: "❌", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  ];

  const statusFilters = [
    { key: "all",         label: "All",         color: "#6366f1" },
    { key: "pending",     label: "Pending",     color: "#f59e0b" },
    { key: "in-progress", label: "In Progress", color: "#3b82f6" },
    { key: "resolved",    label: "Resolved",    color: "#22c55e" },
    { key: "rejected",    label: "Rejected",    color: "#ef4444" },
  ];

  const categories = ["all", "plumbing", "electricity", "cleaning", "furniture", "internet", "security", "other"];

  return (
    <div style={styles.page}>
      <div style={styles.orb1} /><div style={styles.orb2} /><div style={styles.grid} />

      <div style={{ ...styles.content, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s ease" }}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.subtitle}>Manage and resolve all hostel complaints</p>
          </div>
          <button onClick={fetchAll} style={styles.refreshBtn}>🔄 Refresh</button>
        </div>

        {/* Stat Cards */}
        <div style={styles.statsRow}>
          {statCards.map((s, i) => (
            <div key={i} style={{ ...styles.statCard, borderColor: s.color + "30" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ ...styles.statIconWrap, background: s.bg }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
              </div>
              <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters bar */}
        <div style={styles.filtersBar}>

          {/* Search */}
          <div style={styles.searchWrap}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>🔍</span>
            <input
              placeholder="Search by title or student name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={styles.selectFilter}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === "all" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Status tabs */}
        <div style={styles.tabRow}>
          {statusFilters.map(s => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              style={{
                ...styles.tab,
                color: filter === s.key ? s.color : "rgba(255,255,255,0.4)",
                borderBottom: filter === s.key ? `2px solid ${s.color}` : "2px solid transparent",
              }}
            >
              {s.label}
              <span style={{
                ...styles.tabCount,
                background: filter === s.key ? s.color : "rgba(255,255,255,0.08)",
                color: filter === s.key ? "#fff" : "rgba(255,255,255,0.4)",
              }}>
                {counts[s.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Results info */}
        <div style={styles.resultsInfo}>
          Showing <strong style={{ color: "#818cf8" }}>{filtered.length}</strong> of {complaints.length} complaints
        </div>

        {/* Complaints List */}
        {loading ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 40, color: "#6366f1", marginBottom: 16 }}>⟳</div>
            <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading complaints...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <h3 style={{ color: "#fff", margin: "0 0 8px" }}>No complaints found</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", margin: 0 }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.map(c => (
              <ComplaintCard key={c._id} complaint={c} isAdmin={true} onUpdate={handleUpdate} />
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
    position: "relative", overflow: "hidden", fontFamily: "'Georgia', serif",
  },
  orb1: { position: "fixed", top: "5%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" },
  orb2: { position: "fixed", bottom: "5%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", pointerEvents: "none" },
  grid: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "50px 50px", pointerEvents: "none" },
  content: { position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "40px 24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 },
  title: { color: "#fff", fontSize: 32, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" },
  subtitle: { color: "rgba(255,255,255,0.4)", fontSize: 15, margin: 0 },
  refreshBtn: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: 10, padding: "10px 18px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 28 },
  statCard: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "18px 14px", textAlign: "center", backdropFilter: "blur(10px)", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" },
  statIconWrap: { width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" },
  statValue: { fontSize: 26, fontWeight: 700, marginBottom: 4 },
  statLabel: { color: "rgba(255,255,255,0.4)", fontSize: 12 },
  filtersBar: { display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" },
  searchWrap: { flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "0 16px" },
  searchInput: { flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 14, padding: "12px 0", fontFamily: "inherit" },
  selectFilter: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, cursor: "pointer", outline: "none", fontFamily: "inherit" },
  tabRow: { display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 20 },
  tab: { display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600, transition: "all 0.2s" },
  tabCount: { padding: "2px 8px", borderRadius: 20, fontSize: 12, fontWeight: 700, transition: "all 0.2s" },
  resultsInfo: { color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 20 },
  emptyState: { textAlign: "center", padding: "80px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20 },
};
