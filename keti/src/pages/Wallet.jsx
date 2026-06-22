import { useState, useEffect, useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";

// Supports BOTH Vite and CRA. DELETE the branch you don't use.
const FUNCTIONS_URL = process.env.REACT_APP_SUPABASE_FUNCTIONS_URL;
console.log("FUNCTIONS_URL:", FUNCTIONS_URL);
const TICKET_REF = "TKT-AFCON-2027-C14";
const PHONE = "+254712345678";

export default function Wallet() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [countdown, setCountdown] = useState(30);
  const [visible, setVisible] = useState(true);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const timerRef = useRef(null);

  const fetchToken = useCallback(async () => {
    try {
      const res = await fetch(`${FUNCTIONS_URL}/generate-qr-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_ref: TICKET_REF, phone: PHONE }),
      });
      if (!res.ok) throw new Error("request_failed");
      const data = await res.json();
      if (!data.token) throw new Error("no_token");

      setToken(data.token);
      setVisible(true);
      setStatus("ready");

      const secs = Math.max(1, Math.ceil(data.expires_in_ms / 1000));
      setCountdown(secs);

      // Schedule the fade + refetch exactly when the server window ends.
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setVisible(false); // fade out
        setTimeout(fetchToken, 300); // swap after fade
      }, data.expires_in_ms);
    } catch {
      setStatus("error");
      clearTimeout(timerRef.current);
    }
  }, []);

  useEffect(() => {
    fetchToken();
    console.log("URL:", process.env.REACT_APP_SUPABASE_FUNCTIONS_URL);
    return () => clearTimeout(timerRef.current);
  }, [fetchToken]);

  // 1s countdown tick (display only; the refetch is driven by the timeout above)
  useEffect(() => {
    if (status !== "ready") return;
    const id = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [status, token]);

  const countdownColor = countdown <= 5 ? "#EF4444" : "#94A3B8";

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>My Wallet</h1>

      <div style={styles.card}>
        <div style={styles.cardTop}>
          <div>
            <div style={styles.eventName}>Kenya vs Egypt</div>
            <div style={styles.eventSub}>AFCON 2027</div>
          </div>
          <div style={styles.pointsBadge}>⭐ 340 pts</div>
        </div>

        <div style={styles.detailsGrid}>
          <Detail label="Date" value="15 Jun 2027" />
          <Detail label="Time" value="20:00 EAT" />
          <Detail label="Seat" value="C-14" />
          <Detail label="Zone" value="VIP Gold" />
        </div>

        <div style={styles.divider} />

        {/* QR section */}
        <div style={styles.qrSection}>
          {status === "loading" && <div style={styles.spinner} aria-label="Loading" />}

          {status === "error" && (
            <div style={styles.errorBox}>
              <div style={styles.errorText}>Couldn't load your ticket QR.</div>
              <button
                style={styles.retryBtn}
                onClick={() => {
                  setStatus("loading");
                  fetchToken();
                }}
              >
                Retry
              </button>
            </div>
          )}

          {status === "ready" && token && (
            <>
              <div
                style={{
                  ...styles.qrBox,
                  opacity: visible ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                <QRCodeSVG value={token} size={180} level="M" />
              </div>
              <div style={{ ...styles.countdown, color: countdownColor }}>
                Refreshes in {countdown}s
              </div>
            </>
          )}
        </div>

        <button style={styles.transferBtn} onClick={() => navigate("/dashboard")}>
          Transfer Ticket
        </button>
      </div>

      <div style={styles.pastSection}>
        <h2 style={styles.pastHeading}>Past Tickets</h2>
        {PAST.map((t) => (
          <div key={t.id} style={styles.pastItem}>
            <div>
              <div style={styles.pastName}>{t.name}</div>
              <div style={styles.pastDate}>{t.date}</div>
            </div>
            <div style={styles.pastSeat}>Seat {t.seat}</div>
          </div>
        ))}
      </div>

      <style>{`@keyframes ketispin {to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <div style={styles.detailLabel}>{label}</div>
      <div style={styles.detailValue}>{value}</div>
    </div>
  );
}

const PAST = [
  { id: 1, name: "CHAN 2024 — Group Stage", date: "12 Aug 2024", seat: "B22" },
  { id: 2, name: "Harambee Stars Friendly", date: "03 Jun 2024", seat: "A09" },
];

const styles = {
  page: { padding: 20, paddingBottom: 90, maxWidth: 480, margin: "0 auto" },
  heading: { fontSize: 24, fontWeight: 700, marginBottom: 20, color: "#0F172A" },
  card: { background: "#0F172A", borderRadius: 20, padding: 24, color: "#fff", boxShadow: "0 10px 30px rgba(15,23,42,0.3)" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  eventName: { fontSize: 20, fontWeight: 700 },
  eventSub: { fontSize: 14, color: "#94A3B8", marginTop: 4 },
  pointsBadge: { background: "rgba(14,165,233,0.15)", color: "#0EA5E9", padding: "6px 12px", borderRadius: 999, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" },
  detailsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 },
  detailLabel: { fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 },
  detailValue: { fontSize: 15, fontWeight: 600, marginTop: 4 },
  divider: { borderTop: "2px dashed #334155", margin: "20px 0" },
  qrSection: { display: "flex", flexDirection: "column", alignItems: "center", minHeight: 220, justifyContent: "center" },
  qrBox: { background: "#fff", borderRadius: 12, padding: 12, display: "flex" },
  countdown: { marginTop: 12, fontSize: 13, fontWeight: 600 },
  spinner: { width: 40, height: 40, border: "4px solid #334155", borderTopColor: "#0EA5E9", borderRadius: "50%", animation: "ketispin 0.8s linear infinite" },
  errorBox: { textAlign: "center" },
  errorText: { fontSize: 13, color: "#94A3B8", marginBottom: 12 },
  retryBtn: { background: "#1A56DB", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  transferBtn: { width: "100%", marginTop: 24, padding: 14, background: "#1A56DB", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer" },
  pastSection: { marginTop: 28 },
  pastHeading: { fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#0F172A" },
  pastItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "#F1F5F9", borderRadius: 12, marginBottom: 10 },
  pastName: { fontSize: 14, fontWeight: 600, color: "#0F172A" },
  pastDate: { fontSize: 12, color: "#64748B", marginTop: 2 },
  pastSeat: { fontSize: 13, fontWeight: 600, color: "#1A56DB" },
};