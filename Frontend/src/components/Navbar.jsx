import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  if (!user) return null;

  const navLinks = user.role === "student"
    ? [
        { path: "/student", label: "Dashboard", icon: "📊" },
        { path: "/submit",  label: "New Complaint", icon: "✍️" },
      ]
    : [
        { path: "/admin", label: "All Complaints", icon: "📋" },
      ];

  return (
    <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
      {/* Logo */}
      <div style={styles.logo} onClick={() => navigate(user.role === "admin" ? "/admin" : "/student")}>
        <div style={styles.logoIcon}>🏛️</div>
        <div>
          <div style={styles.logoTitle}>HostelDesk</div>
          <div style={styles.logoSub}>Complaint Management</div>
        </div>
      </div>

      {/* Nav Links */}
      <div style={styles.links}>
        {navLinks.map(link => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            onMouseEnter={() => setHover(link.path)}
            onMouseLeave={() => setHover("")}
            style={{
              ...styles.navBtn,
              background: location.pathname === link.path
                ? "rgba(99,102,241,0.2)"
                : hover === link.path ? "rgba(255,255,255,0.05)" : "transparent",
              borderColor: location.pathname === link.path ? "rgba(99,102,241,0.5)" : "transparent",
              color: location.pathname === link.path ? "#818cf8" : "rgba(255,255,255,0.7)",
            }}
          >
            <span>{link.icon}</span> {link.label}
          </button>
        ))}
      </div>

      {/* User info + logout */}
      <div style={styles.userArea}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div style={styles.userText}>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userRole}>
              {user.role === "admin" ? "⚙️ Admin" : "🎓 Student"}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
          onMouseEnter={e => e.target.style.background = "rgba(239,68,68,0.2)"}
          onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.05)"}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky", top: 0, zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 32px",
    background: "rgba(15,12,41,0.8)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    fontFamily: "'Georgia', serif",
    transition: "all 0.3s",
    gap: 20,
  },
  navScrolled: {
    padding: "12px 32px",
    boxShadow: "0 4px 30px rgba(0,0,0,0.4)",
  },
  logo: {
    display: "flex", alignItems: "center", gap: 12,
    cursor: "pointer", flexShrink: 0,
  },
  logoIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
  },
  logoTitle: { color: "#fff", fontWeight: 700, fontSize: 16, lineHeight: 1.2 },
  logoSub: { color: "rgba(255,255,255,0.4)", fontSize: 11 },
  links: { display: "flex", gap: 4, flex: 1, justifyContent: "center" },
  navBtn: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 16px", borderRadius: 10,
    border: "1px solid transparent",
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    transition: "all 0.2s", fontFamily: "inherit",
  },
  userArea: { display: "flex", alignItems: "center", gap: 16, flexShrink: 0 },
  userInfo: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 36, height: 36, borderRadius: 10,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 700, fontSize: 15,
    boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
  },
  userName: { color: "#fff", fontSize: 14, fontWeight: 600 },
  userRole: { color: "rgba(255,255,255,0.4)", fontSize: 12 },
  userText: {},
  logoutBtn: {
    padding: "8px 14px", borderRadius: 10,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.6)", fontSize: 13,
    cursor: "pointer", fontFamily: "inherit",
    transition: "all 0.2s",
  },
};
