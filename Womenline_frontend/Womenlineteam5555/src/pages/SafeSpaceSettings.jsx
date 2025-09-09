import React, { useEffect, useMemo, useState } from "react";
import { useEmotion } from "../contexts/EmotionContext";

const defaultSettings = {
  comfortMode: false,
  safetyFilters: true,
  anonymousMode: false,
  privateMode: false,
  restrictedChat: false,
  hideOnlineStatus: false,
  darkMode: false,
  reducedMotion: false,
  panicMode: false
};

const STORAGE_KEY = "safeSpaceSettings";
const BLOCKED_KEY = "blockedUsers";

const SafeSpaceSettings = () => {
  const { currentTheme } = useEmotion();
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });
  const [blockedUsers, setBlockedUsers] = useState(() => {
    const saved = localStorage.getItem(BLOCKED_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [blockInput, setBlockInput] = useState("");
  const status = useMemo(() => ({ msg: "", type: "info" }), []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    localStorage.setItem(BLOCKED_KEY, JSON.stringify(blockedUsers));
  }, [settings, blockedUsers]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", settings.darkMode);
    document.body.classList.toggle("reduced-motion", settings.reducedMotion);
    document.body.classList.toggle("comfort-mode", settings.comfortMode);
    document.body.classList.toggle("private-mode", settings.privateMode);
  }, [settings.darkMode, settings.reducedMotion, settings.comfortMode, settings.privateMode]);

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const handleBlock = () => {
    const username = blockInput.trim();
    if (!username) return;
    if (blockedUsers.includes(username.toLowerCase())) return;
    setBlockedUsers(prev => [...prev, username.toLowerCase()]);
    setBlockInput("");
  };

  const handleUnblock = (username) => {
    setBlockedUsers(prev => prev.filter(u => u !== username.toLowerCase()));
  };

  const activatePanicMode = () => {
    setSettings(prev => ({
      ...prev,
      panicMode: true,
      privateMode: true,
      restrictedChat: true,
      hideOnlineStatus: true,
      anonymousMode: true
    }));
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem" }}>
      <div style={{
        background: currentTheme.colors.gradient,
        borderRadius: 14,
        padding: "1rem",
        color: "#fff",
        textAlign: "center",
        boxShadow: currentTheme.colors.shadow
      }}>
        <h1 style={{ margin: 0, fontSize: "1.6rem" }}>🛡️ Safe Space Settings</h1>
        <p style={{ margin: 6, opacity: 0.9 }}>Customize your safety and comfort preferences</p>
      </div>

      <div style={{
        background: "#fff",
        border: `2px solid ${currentTheme.colors.border}`,
        borderRadius: 16,
        padding: "1rem",
        boxShadow: currentTheme.colors.shadow,
        marginTop: 14
      }}>
        <Section title="Personal Comfort & Safety" color={currentTheme.colors.primary}>
          <Toggle label="Personal Comfort Mode" checked={settings.comfortMode} onChange={() => toggle("comfortMode")} />
          <Toggle label="Enhanced Safety Filters" checked={settings.safetyFilters} onChange={() => toggle("safetyFilters")} />
          <Toggle label="Anonymous Mode" checked={settings.anonymousMode} onChange={() => toggle("anonymousMode")} />
        </Section>

        <Section title="Privacy Settings" color={currentTheme.colors.primary}>
          <Toggle label="Private Mode" checked={settings.privateMode} onChange={() => toggle("privateMode")} />
          <Toggle label="Restricted Chat Access" checked={settings.restrictedChat} onChange={() => toggle("restrictedChat")} />
          <Toggle label="Hide Online Status" checked={settings.hideOnlineStatus} onChange={() => toggle("hideOnlineStatus")} />
        </Section>

        <Section title="Appearance" color={currentTheme.colors.primary}>
          <Toggle label="Dark Mode" checked={settings.darkMode} onChange={() => toggle("darkMode")} />
          <Toggle label="Reduced Motion" checked={settings.reducedMotion} onChange={() => toggle("reducedMotion")} />
        </Section>

        <Section title="Block Users" color={currentTheme.colors.primary}>
          <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 12, border: `1px solid ${currentTheme.colors.border}` }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <input value={blockInput} onChange={e => setBlockInput(e.target.value)} placeholder="Enter username to block" style={{ flex: 1, padding: "0.7rem 1rem", border: `2px solid ${currentTheme.colors.border}`, borderRadius: 10 }} />
              <button onClick={handleBlock} style={{ background: "#e74c3c", color: "#fff", border: "none", borderRadius: 8, padding: "0.6rem 1rem", fontWeight: 600, cursor: "pointer" }}>Block</button>
            </div>
            <div>
              <h4 style={{ margin: 0, marginBottom: 8, color: currentTheme.colors.primary }}>Blocked Users</h4>
              {blockedUsers.length === 0 ? (
                <div style={{ textAlign: "center", color: "#7f8c8d", fontStyle: "italic", padding: 10 }}>No blocked users</div>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {blockedUsers.map(u => (
                    <div key={u} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", borderRadius: 8, padding: "0.5rem .75rem", border: `1px solid ${currentTheme.colors.border}` }}>
                      <span style={{ fontWeight: 600 }}>{u}</span>
                      <button onClick={() => handleUnblock(u)} style={{ background: "#27ae60", color: "#fff", border: "none", borderRadius: 6, padding: ".35rem .7rem", cursor: "pointer", fontSize: ".9rem" }}>Unblock</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>

        <Section title="Emergency Settings" color={currentTheme.colors.primary}>
          <Toggle label="Panic Mode" checked={settings.panicMode} onChange={() => toggle("panicMode")} danger />
          <button onClick={activatePanicMode} style={{ background: currentTheme.colors.primary, color: "#fff", border: "2px solid #fff", padding: "0.6rem 1rem", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>Activate Panic Mode</button>
          <button onClick={() => {
            const contact = prompt("Enter emergency contact (email or phone):");
            if (contact) localStorage.setItem("emergencyContact", contact);
          }} style={{ marginLeft: 10, background: "#fff", color: currentTheme.colors.primary, border: `2px solid ${currentTheme.colors.border}`, padding: "0.6rem 1rem", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>Set Emergency Contact</button>
        </Section>

        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button onClick={() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); localStorage.setItem(BLOCKED_KEY, JSON.stringify(blockedUsers)); }} className="emotion-button" style={{ borderRadius: 10, padding: "0.8rem 1.4rem" }}>Save All Settings</button>
          <button onClick={() => { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(BLOCKED_KEY); setSettings(defaultSettings); setBlockedUsers([]); }} style={{ marginLeft: 10, background: "#6c757d", color: "#fff", border: "none", borderRadius: 10, padding: "0.8rem 1.4rem", cursor: "pointer", fontWeight: 600 }}>Reset to Default</button>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, color, children }) => (
  <div style={{ marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #f0f0f0" }}>
    <h3 style={{ margin: 0, marginBottom: 10, color }}>{title}</h3>
    <div style={{ display: "grid", gap: 10 }}>{children}</div>
  </div>
);

const Toggle = ({ label, checked, onChange, danger }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <label style={{ position: "relative", display: "inline-block", width: 52, height: 30, cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0 }} />
      <span style={{ position: "absolute", inset: 0, background: danger ? "#e74c3c" : "#e9d1d1", borderRadius: 30, transition: ".2s" }} />
      <span style={{ position: "absolute", left: 4, top: 4, width: 22, height: 22, background: "#fff", borderRadius: 999, transition: ".2s", transform: checked ? "translateX(22px)" : "translateX(0)" }} />
    </label>
    <div>
      <strong>{label}</strong>
    </div>
  </div>
);

export default SafeSpaceSettings;
