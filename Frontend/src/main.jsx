import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// ── Global Styles ─────────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Georgia', serif;
    background: #0f0c29;
    color: #ffffff;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.03);
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(99,102,241,0.4);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(99,102,241,0.7);
  }

  /* Links */
  a {
    color: #818cf8;
    text-decoration: none;
    transition: color 0.2s;
  }
  a:hover {
    color: #a5b4fc;
  }

  /* Inputs and selects global reset */
  input, textarea, select, button {
    font-family: 'Georgia', serif;
  }

  /* Input placeholder */
  ::placeholder {
    color: rgba(255,255,255,0.25);
  }

  /* Selection */
  ::selection {
    background: rgba(99,102,241,0.4);
    color: #fff;
  }

  /* ── Animations ─────────────────────────────────── */

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33%       { transform: translateY(-20px) rotate(1deg); }
    66%       { transform: translateY(10px) rotate(-1deg); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }

  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  /* ── Utility Animation Classes ──────────────────── */

  .fade-in {
    animation: fadeIn 0.5s ease forwards;
  }

  .slide-in {
    animation: slideIn 0.4s ease forwards;
  }

  /* ── Option dark styles for selects ─────────────── */
  option {
    background: #1a1a2e;
    color: #fff;
  }

  /* ── Focus visible for accessibility ────────────── */
  :focus-visible {
    outline: 2px solid rgba(99,102,241,0.6);
    outline-offset: 2px;
  }
`;

const styleTag = document.createElement("style");
styleTag.innerHTML = globalStyles;
document.head.appendChild(styleTag);

// ── Mount App ─────────────────────────────────────────────────────────────────
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
