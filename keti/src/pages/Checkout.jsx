import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_PRICE   = 17000;
const SURCHARGE    =  1000;
const BOOKING_FEE  =   200;
const TOTAL        = BASE_PRICE + SURCHARGE + BOOKING_FEE;
const LOCK_SECONDS = 299;

export default function Checkout() {
  const [phone,   setPhone]   = useState("+254 712 345 678");
  const [seconds, setSeconds] = useState(LOCK_SECONDS);
  const [paid,    setPaid]    = useState(false);
  const navigate = useNavigate();

  /* countdown */
  useEffect(() => {
    if (seconds <= 0 || paid) return;
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, paid]);

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const expired = seconds <= 0;

  const handlePay = () => {
    setPaid(true);
    setTimeout(() => navigate("/wallet"), 1500);
  };

  return (
    <div style={styles.wrap}>
      {/* ── Topbar ── */}
      <div className="topbar">
        <div className="topbar-row">
          <div className="logo">Keti<span>.</span></div>
          <div className="badge">Checkout</div>
        </div>
      </div>

      <div className="screen-wrap" style={{ padding: "12px 16px 80px" }}>

        {/* ── Seat summary ── */}
        <div className="card">
          <div className="card-label">Your Selection</div>
          <div style={styles.seatSummary}>
            <div style={styles.seatIcon}>🏟️</div>
            <div>
              <div style={styles.seatName}>Kenya vs Egypt · AFCON</div>
              <div style={styles.seatSub}>VIP · Gold Stand · Row C, Seats 14–15</div>
              <div style={styles.seatPrice}>2 × KES 8,500</div>
            </div>
          </div>
        </div>

        {/* ── Identity verification ── */}
        <div className="card">
          <div className="card-label">Identity Verification</div>
          <div style={styles.fieldLabel}>M-Pesa registered phone number</div>
          <input
            style={styles.fieldInput}
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+254 7XX XXX XXX"
          />
          <div style={styles.verified}>
            <div style={styles.verifiedDot}>✓</div>
            <span style={styles.verifiedText}>KYC verified via Safaricom · John M.</span>
          </div>
        </div>

        {/* ── Price breakdown ── */}
        <div className="card">
          <div className="card-label">Price Breakdown</div>
          <PriceRow label="Base price (2 tickets)" value="KES 16,000" />
          <PriceRow label="Demand surcharge"       value="+ KES 1,000" highlight />
          <PriceRow label="Booking fee"            value="KES 200" />
          <div style={styles.divider} />
          <div style={styles.totalRow}>
            <span>Total</span>
            <span style={{ color: "#1A56DB" }}>KES {TOTAL.toLocaleString()}</span>
          </div>
        </div>

        {/* ── Timer ── */}
        <div style={{ ...styles.timer, background: expired ? "#FEE2E2" : "#FFF7ED", borderColor: expired ? "#FECACA" : "#FED7AA" }}>
          <div>
            <div style={styles.timerLabel}>⏱ Price locked for</div>
            <div style={{ ...styles.timerVal, color: expired ? "#DC2626" : "#C2410C" }}>
              {expired ? "Expired" : fmt(seconds)}
            </div>
          </div>
          <span style={{ fontSize: 10, color: "#92400E", textAlign: "right" }}>
            {expired ? "Price may have\nchanged" : "Price may rise\nafter timeout"}
          </span>
        </div>

        {/* ── Pay button ── */}
        {paid ? (
          <div style={styles.successBanner}>
            ✅ Payment sent! Redirecting to your wallet...
          </div>
        ) : (
          <>
            <button className="btn-mpesa" onClick={handlePay} disabled={expired}>
              <span style={{ fontSize: 20 }}>📲</span>
              Pay KES {TOTAL.toLocaleString()} via M-Pesa
            </button>
            <div style={styles.secureNote}>
              Secured by Safaricom M-Pesa · Identity verified
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PriceRow({ label, value, highlight }) {
  return (
    <div style={styles.priceRow}>
      <span style={{ fontSize: 12, color: "#64748b" }}>{label}</span>
      <span style={{ fontSize: 12, color: highlight ? "#C2410C" : "#1e293b", fontWeight: highlight ? 600 : 400 }}>
        {value}
      </span>
    </div>
  );
}

const styles = {
  wrap: { background: "#f8fafc", minHeight: "100vh" },

  seatSummary: { display: "flex", alignItems: "center", gap: 12 },
  seatIcon:    { width: 44, height: 44, background: "#EFF6FF", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 },
  seatName:    { fontSize: 14, fontWeight: 600, color: "#1e293b" },
  seatSub:     { fontSize: 11, color: "#64748b", marginTop: 2 },
  seatPrice:   { fontSize: 12, fontWeight: 600, color: "#1A56DB", marginTop: 4 },

  fieldLabel:  { fontSize: 11, color: "#64748b", marginBottom: 4 },
  fieldInput:  { width: "100%", background: "#f8fafc", border: "0.5px solid #e2e8f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#1e293b", outline: "none" },
  verified:    { display: "flex", alignItems: "center", gap: 6, marginTop: 8 },
  verifiedDot: { width: 18, height: 18, background: "#4CAF50", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 },
  verifiedText: { fontSize: 11, color: "#166534", fontWeight: 500 },

  priceRow:  { display: "flex", justifyContent: "space-between", marginBottom: 8 },
  divider:   { borderTop: "0.5px solid #e2e8f0", margin: "8px 0" },
  totalRow:  { display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: "#1e293b" },

  timer:       { border: "0.5px solid", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  timerLabel:  { fontSize: 11, color: "#92400E" },
  timerVal:    { fontSize: 20, fontWeight: 700 },

  successBanner: { background: "#DCFCE7", color: "#166534", borderRadius: 10, padding: 14, fontSize: 14, fontWeight: 600, textAlign: "center" },
  secureNote:    { fontSize: 10, color: "#94a3b8", textAlign: "center", marginTop: 8 },
};
