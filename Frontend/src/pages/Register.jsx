import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", roomNo: "", hostelBlock: "A" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setMsg("");
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      setMsg("Account created successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  const fields = [
    { key: "name", label: "Full Name", type: "text", placeholder: "Rahul Sharma", icon: "👤" },
    { key: "email", label: "Email Address", type: "email", placeholder: "you@college.edu", icon: "✉️" },
    { key: "password", label: "Password", type: "password", placeholder: "••••••••", icon: "🔒" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.orb1} /><div style={styles.orb2} />
      <div style={styles.grid} />

      <div style={{ ...styles.card, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(30px)" }}>
        <div style={styles.header}>
          <div style={styles.iconWrap}><span style={{ fontSize: 28 }}>🎓</span></div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join the Hostel Complaint System</p>
        </div>

        {msg && (
          <div style={{ ...styles.msgBox, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#86efac" }}>
            ✅ {msg}
          </div>
        )}
        {error && (
          <div style={{ ...styles.msgBox, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {fields.map(f => (
            <div key={f.key} style={styles.fieldWrap}>
              <label style={styles.label}>{f.label}</label>
              <div style={{ ...styles.inputWrap, borderColor: focused === f.key ? "#6366f1" : "rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: 16 }}>{f.icon}</span>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  onFocus={() => setFocused(f.key)}
                  onBlur={() => setFocused("")}
                  style={styles.input}
                  required
                />
              </div>
            </div>
          ))}

          {/* Role selector */}
          <div style={styles.fieldWrap}>
            <label style={styles.label}>I am a...</label>
            <div style={styles.roleRow}>
              {["student", "admin"].map(r => (
                <button
                  key={r} type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  style={{
                    ...styles.roleBtn,
                    background: form.role === r ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.05)",
                    border: form.role === r ? "1px solid #6366f1" : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: form.role === r ? "0 4px 20px rgba(99,102,241,0.3)" : "none",
                  }}
                >
                  {r === "student" ? "🎓 Student" : "⚙️ Admin"}
                </button>
              ))}
            </div>
          </div>

          {/* Student-only fields */}
          {form.role === "student" && (
            <div style={styles.studentFields}>
              <div style={styles.fieldWrap}>
                <label style={styles.label}>Room Number</label>
                <div style={{ ...styles.inputWrap, borderColor: focused === "roomNo" ? "#6366f1" : "rgba(255,255,255,0.1)" }}>
                  <span style={{ fontSize: 16 }}>🚪</span>
                  <input
                    type="text" placeholder="101"
                    value={form.roomNo}
                    onChange={e => setForm({ ...form, roomNo: e.target.value })}
                    onFocus={() => setFocused("roomNo")}
                    onBlur={() => setFocused("")}
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.fieldWrap}>
                <label style={styles.label}>Hostel Block</label>
                <div style={{ ...styles.inputWrap }}>
                  <span style={{ fontSize: 16 }}>🏢</span>
                  <select
                    value={form.hostelBlock}
                    onChange={e => setForm({ ...form, hostelBlock: e.target.value })}
                    style={{ ...styles.input, cursor: "pointer" }}
                  >
                    {["A", "B", "C", "D"].map(b => <option key={b} value={b}>Block {b}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit" disabled={loading}
            style={{ ...styles.btn, opacity: loading ? 0.8 : 1 }}
            onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.target.style.transform = "translateY(0)"}
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#818cf8", textDecoration: "none", fontWeight: 600 }}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", overflow: "hidden", fontFamily: "'Georgia', serif",
    padding: "40px 20px",
  },
  orb1: {
    position: "absolute", top: "-20%", right: "-10%",
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
  },
  orb2: {
    position: "absolute", bottom: "-20%", left: "-10%",
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
  },
  grid: {
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "50px 50px",
  },
  card: {
    position: "relative", zIndex: 10,
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 24, padding: "44px 40px",
    width: "100%", maxWidth: 480,
    boxShadow: "0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
    transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
  },
  header: { textAlign: "center", marginBottom: 32 },
  iconWrap: {
    width: 64, height: 64, borderRadius: 16,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 16px",
    boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
  },
  title: { color: "#fff", fontSize: 26, fontWeight: 700, margin: "0 0 8px" },
  subtitle: { color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 },
  msgBox: { borderRadius: 10, padding: "12px 16px", fontSize: 14, marginBottom: 20 },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 8 },
  label: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600, letterSpacing: "0.5px" },
  inputWrap: {
    display: "flex", alignItems: "center", gap: 10,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12, padding: "0 16px",
    transition: "border-color 0.2s",
  },
  input: {
    flex: 1, background: "transparent", border: "none",
    outline: "none", color: "#fff", fontSize: 15,
    padding: "13px 0", fontFamily: "inherit",
  },
  roleRow: { display: "flex", gap: 12 },
  roleBtn: {
    flex: 1, padding: "12px", borderRadius: 12,
    color: "#fff", fontSize: 14, fontWeight: 600,
    cursor: "pointer", transition: "all 0.2s",
  },
  studentFields: { display: "flex", flexDirection: "column", gap: 18 },
  btn: {
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "#fff", border: "none", borderRadius: 12,
    padding: "15px", fontSize: 16, fontWeight: 700,
    cursor: "pointer", letterSpacing: "0.5px",
    boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
    transition: "transform 0.2s, box-shadow 0.2s", marginTop: 4,
  },
};
