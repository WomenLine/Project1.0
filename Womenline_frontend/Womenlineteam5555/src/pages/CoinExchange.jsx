import React, { useMemo, useState } from "react";
import { useEmotion } from "../contexts/EmotionContext";
import { useAuth } from "../contexts/AuthContext";

const EXCHANGE_TYPES = ["Voucher", "Donate", "Transfer"];

const CoinExchange = () => {
    const { currentTheme } = useEmotion();
    const { credits, updateCredits } = useAuth();
    const [activeTab, setActiveTab] = useState("Voucher");
    const [amount, setAmount] = useState("");
    const [recipient, setRecipient] = useState("");
    const [provider, setProvider] = useState("Amazon");
    const [note, setNote] = useState("");
    const [message, setMessage] = useState(null);

    const providers = useMemo(() => ["Amazon", "Flipkart", "Myntra", "Swiggy"], []);
    const canConfirm = useMemo(() => {
        const value = Number(amount);
        return Number.isFinite(value) && value > 0 && value <= credits && (activeTab !== "Transfer" || recipient.trim().length >= 3);
    }, [amount, credits, activeTab, recipient]);

    const handleConfirm = () => {
        const value = Number(amount);
        if (!canConfirm) return;
        updateCredits(Math.max(0, credits - value));
        const details =
            activeTab === "Voucher"
                ? `Voucher: ${provider}`
                : activeTab === "Donate"
                    ? `Donation${note ? ` - ${note}` : ""}`
                    : `Transfer to ${recipient}`;
        setMessage({ type: "success", text: `${value} MaCoins processed • ${details}` });
        setAmount("");
        setRecipient("");
        setNote("");
    };

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem" }}>
            {/* Header */}
            <div
                style={{
                    background: currentTheme.colors.gradient,
                    borderRadius: 20,
                    padding: "1.2rem",
                    marginBottom: "1rem",
                    color: "#fff",
                    boxShadow: currentTheme.colors.shadow,
                }}
            >
                <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 700 }}>Coin Exchange</h1>
                <p style={{ margin: 0, opacity: 0.9 }}>Safely convert your MaCoins • Balance: {credits}</p>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                {EXCHANGE_TYPES.map((t) => (
                    <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        style={{
                            background: activeTab === t ? currentTheme.colors.primary : "#fff",
                            color: activeTab === t ? "#fff" : currentTheme.colors.primary,
                            border: `2px solid ${currentTheme.colors.border}`,
                            padding: ".55rem .9rem",
                            borderRadius: 10,
                            cursor: "pointer",
                            fontWeight: 600,
                        }}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Card */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: `2px solid ${currentTheme.colors.border}`,
                    boxShadow: currentTheme.colors.shadow,
                    padding: "1rem",
                }}
            >
                <div style={{ display: "grid", gap: 12 }}>
                    <div>
                        <label style={{ display: "block", marginBottom: 6, color: currentTheme.colors.primary, fontWeight: 600 }}>Amount</label>
                        <input
                            type="number"
                            min={1}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter MaCoins"
                            style={{ width: "100%", padding: ".7rem 1rem", borderRadius: 10, border: `2px solid ${currentTheme.colors.border}` }}
                        />
                        <small style={{ color: amount && Number(amount) > credits ? "#b71c1c" : currentTheme.colors.text, opacity: 0.8 }}>
                            {amount ? `${credits - Number(amount)} coins after exchange` : `Available: ${credits}`}
                        </small>
                    </div>

                    {activeTab === "Voucher" && (
                        <div>
                            <label style={{ display: "block", marginBottom: 6, color: currentTheme.colors.primary, fontWeight: 600 }}>Provider</label>
                            <select value={provider} onChange={(e) => setProvider(e.target.value)} style={{ width: "100%", padding: ".7rem 1rem", borderRadius: 10, border: `2px solid ${currentTheme.colors.border}` }}>
                                {providers.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                            <small style={{ opacity: 0.8 }}>A voucher code will be generated (demo).</small>
                        </div>
                    )}

                    {activeTab === "Donate" && (
                        <div>
                            <label style={{ display: "block", marginBottom: 6, color: currentTheme.colors.primary, fontWeight: 600 }}>Note (optional)</label>
                            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Cause or message" style={{ width: "100%", padding: ".7rem 1rem", borderRadius: 10, border: `2px solid ${currentTheme.colors.border}` }} />
                            <small style={{ opacity: 0.8 }}>Donations are simulated locally in this demo.</small>
                        </div>
                    )}

                    {activeTab === "Transfer" && (
                        <div>
                            <label style={{ display: "block", marginBottom: 6, color: currentTheme.colors.primary, fontWeight: 600 }}>Recipient</label>
                            <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Enter username or email" style={{ width: "100%", padding: ".7rem 1rem", borderRadius: 10, border: `2px solid ${currentTheme.colors.border}` }} />
                            <small style={{ opacity: 0.8 }}>Transfers are simulated locally in this demo.</small>
                        </div>
                    )}

                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
                        <button
                            onClick={handleConfirm}
                            disabled={!canConfirm}
                            style={{
                                background: canConfirm ? currentTheme.colors.primary : "#ccc",
                                color: "#fff",
                                border: "none",
                                padding: ".75rem 1.2rem",
                                borderRadius: 10,
                                cursor: canConfirm ? "pointer" : "not-allowed",
                                fontWeight: 700,
                            }}
                        >
                            Confirm
                        </button>
                        {message && <span style={{ color: message.type === "success" ? "#2e7d32" : "#b71c1c", fontWeight: 600 }}>{message.text}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoinExchange;
