import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const categories = [
  { value: "plumbing",     label: "Plumbing",     icon: "🚿", desc: "Leaks, taps, drainage" },
  { value: "electricity",  label: "Electricity",  icon: "⚡", desc: "Wiring, fans, lights" },
  { value: "cleaning",     label: "Cleaning",     icon: "🧹", desc: "Sanitation, hygiene" },
  { value: "furniture",    label: "Furniture",    icon: "🪑", desc: "Beds, tables, chairs" },
  { value: "internet",     label: "Internet",     icon: "📶", desc: "WiFi, connectivity" },
  { value: "security",     label: "Security",     icon: "🔐", desc: "Locks, safety issues" },
  { value: "other",        label: "Other",        icon: "📌", desc: "Any other issue" },
];

const priorities = [
  { value: "low",    label: "Low",    icon: "🟢", desc: "Can wait a few days", color: "#22c55e" },
  { value: "medium", label: "Medium", icon: "🟡", desc: "Needs attention soon", color: "#f59e0b" },
  { value: "high",   label: "High",   icon: "🔴", desc: "Urgent, fix ASAP",    color: "#ef4444" },
];

export default function SubmitComplaint() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", category: "", priority: "medium" });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState("");

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return setError("Please select a category");
    setLoading(true); setError("");
    try {
      await axios.post("http://localhost:5000/api/complaints", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit");
      setLoading(false);
    }
  };

  if (success) return (
    <div style={styles.page}>
      <div style={styles.orb1} /><div style={styles.orb2} /><div style={styles.grid} />
      <div style={styles.successCard}>
        <div style={styles.successIcon}>✅</div>
        <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: "0 0 12px" }}>Complaint Submitted!</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 32 }}>We've received your complaint and will get back to you soon.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => { setSuccess(false); setForm({ title: "", description: "", category: "", priority: "medium" }); }}
            style={styles.outlineBtn}>
            Submit Another
          </button>
          <button onClick={() => navigate("/student")} style={styles.primaryBtn}>
            View Dashboard →
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.orb1} /><div style={styles.orb2} /><div style={styles.grid} />

      <div style={{ ...styles.content, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s ease" }}>

        {/* Back button */}
        <button onClick={() => navigate("/student")} style={styles.backBtn}>
          ← Back to Dashboard
        </button>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIcon}>✍️</div>
            <div>
              <h1 style={styles.title}>Submit a Complaint</h1>
              <p style={styles.subtitle}>Describe your issue and we'll get it resolved</p>
            </div>
          </div>

          {error && (
            <div style={styles.errorBox}>⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>

            {/* Title */}
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Complaint Title <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={{ ...styles.inputWrap, borderColor: focused === "title" ? "#6366f1" : "rgba(255,255,255,0.1)" }}>
                <span>📝</span>
                <input
                  placeholder="e.g. Water leaking from ceiling"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  onFocus={() => setFocused("title")}
                  onBlur={() => setFocused("")}
                  style={styles.input}
                  maxLength={100}
                  required
                />
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{form.title.length}/100</span>
              </div>
            </div>

            {/* Category */}
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Category <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={styles.categoryGrid}>
                {categories.map(cat => (
                  <button
                    key={cat.value} type="button"
                    onClick={() => setForm({ ...form, category: cat.value })}
                    style={{
                      ...styles.categoryBtn,
                      background: form.category === cat.value ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${form.category === cat.value ? "#6366f1" : "rgba(255,255,255,0.08)"}`,
                      transform: form.category === cat.value ? "scale(1.02)" : "scale(1)",
                      boxShadow: form.category === cat.value ? "0 4px 20px rgba(99,102,241,0.2)" : "none",
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{cat.icon}</span>
                    <span style={{ color: form.category === cat.value ? "#818cf8" : "#fff", fontWeight: 600, fontSize: 13 }}>{cat.label}</span>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{cat.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Priority Level</label>
              <div style={{ display: "flex", gap: 12 }}>
                {priorities.map(p => (
                  <button
                    key={p.value} type="button"
                    onClick={() => setForm({ ...form, priority: p.value })}
                    style={{
                      ...styles.priorityBtn,
                      background: form.priority === p.value ? `rgba(${p.color === "#22c55e" ? "34,197,94" : p.color === "#f59e0b" ? "245,158,11" : "239,68,68"},0.15)` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${form.priority === p.value ? p.color + "60" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{p.icon}</span>
                    <span style={{ color: form.priority === p.value ? p.color : "#fff", fontWeight: 600 }}>{p.label}</span>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Description <span style={{ color: "#ef4444" }}>*</span></label>
              <textarea
                placeholder="Describe your issue in detail... (location, when it started, how severe it is)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                onFocus={() => setFocused("desc")}
                onBlur={() => setFocused("")}
                rows={5}
                maxLength={1000}
                required
                style={{
                  ...styles.textarea,
                  borderColor: focused === "desc" ? "#6366f1" : "rgba(255,255,255,0.1)",
                }}
              />
              <div style={{ textAlign: "right", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
                {form.description.length}/1000
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{ ...styles.submitBtn, opacity: loading ? 0.8 : 1 }}
              onMouseEnter={e => { if (!loading) e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}
            >
              {loading ? "⟳ Submitting..." : "Submit Complaint →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)",
    position: "relative", overflow: "hidden",
    fontFamily: "'Georgia', serif", padding: "40px 24px",
  },
  orb1: { position: "fixed", top: "10%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" },
  orb2: { position: "fixed", bottom: "10%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", pointerEvents: "none" },
  grid: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "50px 50px", pointerEvents: "none" },
  content: { position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" },
  backBtn: { background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer", marginBottom: 24, padding: 0, fontFamily: "inherit", transition: "color 0.2s" },
  card: { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 40 },
  cardHeader: { display: "flex", gap: 16, alignItems: "center", marginBottom: 32 },
  cardIcon: { width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, boxShadow: "0 8px 24px rgba(99,102,241,0.4)" },
  title: { color: "#fff", fontSize: 24, fontWeight: 700, margin: "0 0 4px" },
  subtitle: { color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 },
  errorBox: { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 16px", color: "#fca5a5", fontSize: 14, marginBottom: 24 },
  form: { display: "flex", flexDirection: "column", gap: 28 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 10 },
  label: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600, letterSpacing: "0.5px" },
  inputWrap: { display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "0 16px", transition: "border-color 0.2s" },
  input: { flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 15, padding: "14px 0", fontFamily: "inherit" },
  categoryGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 },
  categoryBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "14px 8px", borderRadius: 12, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" },
  priorityBtn: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "14px", borderRadius: 12, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" },
  textarea: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 15, fontFamily: "inherit", resize: "vertical", outline: "none", lineHeight: 1.6, transition: "border-color 0.2s" },
  submitBtn: { background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(99,102,241,0.4)", transition: "all 0.2s" },
  successCard: { position: "relative", zIndex: 10, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "60px 40px", maxWidth: 480, margin: "100px auto", textAlign: "center" },
  successIcon: { fontSize: 64, marginBottom: 20 },
  primaryBtn: { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(99,102,241,0.4)" },
  outlineBtn: { background: "transparent", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "12px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer" },
};
