import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === "admin" ? "/admin" : "/student");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Animated background orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.orb3} />

      {/* Grid overlay */}
      <div style={styles.grid} />

      <div style={{ ...styles.card, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(30px)" }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrap}>
            <span style={styles.icon}>🏛️</span>
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Hostel Complaint Management System</p>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldWrap}>
            <label style={styles.label}>Email Address</label>
            <div style={{ ...styles.inputWrap, borderColor: focused === "email" ? "#6366f1" : "rgba(255,255,255,0.1)" }}>
              <span style={styles.inputIcon}>✉️</span>
              <input
                type="email"
                placeholder="you@college.edu"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.fieldWrap}>
            <label style={styles.label}>Password</label>
            <div style={{ ...styles.inputWrap, borderColor: focused === "password" ? "#6366f1" : "rgba(255,255,255,0.1)" }}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                style={styles.input}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.btn, opacity: loading ? 0.8 : 1 }}
            onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.target.style.transform = "translateY(0)"}
          >
            {loading ? (
              <span style={styles.spinner}>⟳ Signing in...</span>
            ) : (
              "Sign In →"
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{" "}
            <a href="/register" style={styles.link}>Register here</a>
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Georgia', serif",
  },
  orb1: {
    position: "absolute", top: "-20%", left: "-10%",
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
    animation: "float 8s ease-in-out infinite",
  },
  orb2: {
    position: "absolute", bottom: "-20%", right: "-10%",
    width: 600, height: 600, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
    animation: "float 10s ease-in-out infinite reverse",
  },
  orb3: {
    position: "absolute", top: "50%", left: "50%",
    width: 300, height: 300, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
    animation: "float 6s ease-in-out infinite",
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
    borderRadius: 24,
    padding: "48px 40px",
    width: "100%",
    maxWidth: 440,
    boxShadow: "0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  header: { textAlign: "center", marginBottom: 36 },
  iconWrap: {
    width: 64, height: 64, borderRadius: 16,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 16px",
    boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
  },
  icon: { fontSize: 28 },
  title: {
    color: "#fff", fontSize: 28, fontWeight: 700,
    margin: "0 0 8px", letterSpacing: "-0.5px",
  },
  subtitle: { color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 },
  errorBox: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 10, padding: "12px 16px",
    color: "#fca5a5", fontSize: 14, marginBottom: 20,
    display: "flex", gap: 8, alignItems: "center",
  },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 8 },
  label: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600, letterSpacing: "0.5px" },
  inputWrap: {
    display: "flex", alignItems: "center", gap: 10,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12, padding: "0 16px",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputIcon: { fontSize: 16 },
  input: {
    flex: 1, background: "transparent", border: "none",
    outline: "none", color: "#fff", fontSize: 15,
    padding: "14px 0", fontFamily: "inherit",
  },
  btn: {
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "#fff", border: "none", borderRadius: 12,
    padding: "16px", fontSize: 16, fontWeight: 700,
    cursor: "pointer", letterSpacing: "0.5px",
    boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
    transition: "transform 0.2s, box-shadow 0.2s",
    marginTop: 4,
  },
  spinner: { display: "inline-block", animation: "spin 1s linear infinite" },
  footer: { marginTop: 28, textAlign: "center" },
  footerText: { color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 },
  link: { color: "#818cf8", textDecoration: "none", fontWeight: 600 },
};
