import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEmotion } from "../contexts/EmotionContext";

const Navbar = () => {
  const { token, logout } = useAuth();
  const { currentTheme } = useEmotion();
  const navigate = useNavigate();
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#fff",
    padding: "0.5rem 0.9rem",
    borderRadius: "6px",
    transition: "background 0.2s",
    fontWeight: 500
  };

  const hoverHandlers = {
    onMouseOver: (e) => (e.target.style.background = "rgba(255,255,255,0.2)"),
    onMouseOut: (e) => (e.target.style.background = "transparent"),
  };

  return (
    <nav
      className="emotion-navbar"
      style={{
        background: currentTheme.colors.gradient,
        padding: "0.8rem 1rem",
        boxShadow: currentTheme.colors.shadow,
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          gap: "0.75rem",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#fff",
            fontSize: "1.3rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            whiteSpace: "nowrap",
          }}
        >
          {currentTheme.emoji} WOMENLINE
        </Link>

        <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
          {token ? (
            <>
              <Link to="/dashboard" style={linkStyle} {...hoverHandlers}>
                Dashboard
              </Link>

              {/* Explore dropdown groups the rest */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setIsExploreOpen((v) => !v)}
                  style={{
                    ...linkStyle,
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: ".35rem",
                    cursor: "pointer",
                  }}
                  onMouseLeave={(e) => (e.target.style.background = "rgba(255,255,255,0.15)")}
                >
                  Explore
                  <span style={{ fontSize: "0.9rem" }}>▾</span>
                </button>

                {isExploreOpen && (
                  <div
                    onMouseLeave={() => setIsExploreOpen(false)}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      background: "#fff",
                      color: currentTheme.colors.text,
                      borderRadius: 10,
                      minWidth: 220,
                      border: `2px solid ${currentTheme.colors.border}`,
                      boxShadow: currentTheme.colors.shadow,
                      overflow: "hidden",
                    }}
                  >
                    <DropdownLink to="/coin-exchange" label="Coin Exchange" />
                    <DropdownLink to="/health" label="Health Data" />
                    <DropdownLink to="/period-tracker" label="Period Tracker" />
                    <DropdownLink to="/mental-wellness" label="Mental Wellness" />
                    <DropdownLink to="/health-summary" label="Health Summary" />
                    <DropdownLink to="/appointments" label="Appointments" />
                    <DropdownLink to="/leaderboard" label="Leaderboard" />
                    <DropdownLink to="/safety-tutorials" label="Safety Tutorials" />
                    <DropdownLink to="/forum" label="Forum" />
                    <DropdownLink to="/safe-space-settings" label="Safe Space" />
                    <DropdownLink to="/macoin-center" label="MaCoin Center" />
                    <DropdownLink to="/coin-history" label="Coin History" />
                    <DropdownLink to="/enhanced-coins" label="Enhanced Coins" />
                    <DropdownLink to="/pdf-generator" label="PDF Generator" />
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "0.5rem 0.9rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "all 0.2s",
                  marginLeft: ".25rem",
                }}
                onMouseOver={(e) => (e.target.style.background = "rgba(255,255,255,0.3)")}
                onMouseOut={(e) => (e.target.style.background = "rgba(255,255,255,0.2)")}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* For guests, place Coin Exchange inside Explore as well */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setIsExploreOpen((v) => !v)}
                  style={{
                    ...linkStyle,
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: ".35rem",
                    cursor: "pointer",
                  }}
                  onMouseLeave={(e) => (e.target.style.background = "rgba(255,255,255,0.15)")}
                >
                  Explore
                  <span style={{ fontSize: "0.9rem" }}>▾</span>
                </button>
                {isExploreOpen && (
                  <div
                    onMouseLeave={() => setIsExploreOpen(false)}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      background: "#fff",
                      color: "#333",
                      borderRadius: 10,
                      minWidth: 220,
                      border: "2px solid #ecdede",
                      boxShadow: currentTheme.colors.shadow,
                      overflow: "hidden",
                    }}
                  >
                    <DropdownLink to="/coin-exchange" label="Coin Exchange" />
                  </div>
                )}
              </div>
              <Link to="/login" style={linkStyle} {...hoverHandlers}>
                Login
              </Link>
              <Link to="/signup" style={linkStyle} {...hoverHandlers}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const DropdownLink = ({ to, label }) => (
  <Link
    to={to}
    style={{
      display: "block",
      padding: "0.6rem 0.9rem",
      textDecoration: "none",
      color: "#333",
      fontSize: ".95rem",
      borderBottom: "1px solid #f0f0f0",
      whiteSpace: "nowrap",
    }}
    onMouseOver={(e) => (e.target.style.background = "#f9f2f2")}
    onMouseOut={(e) => (e.target.style.background = "transparent")}
  >
    {label}
  </Link>
);

export default Navbar; 