import { useEffect, useState } from "react";

const PAST_TICKETS = [
  { initials: "SA", name: "Sauti Sol Live",   seat: "Standard · Floor · 3 Sep 2026" },
  { initials: "KP", name: "KPL Finals 2026",  seat: "East Stand · 20 Aug 2026"      },
];

export default function Wallet() {
  const [pulse, setPulse] = useState(true);
  const [qrKey, setQrKey] = useState(0);

  /* Rotate QR every 30 seconds */
  useEffect(() => {
    const t = setInterval(() => {
      setPulse(false);
      setTimeout(() => { setQrKey(k => k + 1); setPulse(true); }, 300);
    }, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={styles.wrap}>
      {/* ── Topbar ── */}
      <div className="topbar">
        <div className="topbar-row">
          <div className="logo">Keti<span>.</span></div>
          <div className="badge">My Tickets</div>
        </div>
      </div>

      <div className="screen-wrap" style={{ padding: "12px 16px 80px" }}>

        {/* ── Active ticket card ── */}
        <div style={styles.ticketCard}>
          {/* Points badge */}
          <div style={styles.pointsBadge}>⭐ 340 pts</div>

          {/* Decorative circle */}
          <div style={styles.decorCircle} />

          <div style={styles.eventName}>Kenya vs Egypt</div>
          <div style={styles.eventSub}>AFCON 2027 · Group Stage A</div>

          {/* Ticket details grid */}
          <div style={styles.detailsGrid}>
            {[
              { label: "Date",  value: "15 Jun 2027" },
              { label: "Time",  value: "18:00 EAT"   },
              { label: "Seat",  value: "C-14"         },
              { label: "Zone",  value: "VIP Gold"     },
            ].map(d => (
              <div key={d.label} style={styles.detailItem}>
                <span style={styles.detailLabel}>{d.label}</span>
                <span style={styles.detailValue}>{d.value}</span>
              </div>
            ))}
          </div>

          {/* Dashed separator */}
          <div style={styles.dashDivider} />

          {/* QR Code */}
          <div style={styles.qrWrap}>
            <div style={{ ...styles.qrBox, opacity: pulse ? 1 : 0, transition: "opacity 0.3s" }}>
              <QRPattern key={qrKey} />
            </div>
          </div>
          <div style={styles.qrNote}>QR rotates every 30s · Valid at gate only</div>

          {/* Transfer button */}
          <button className="btn-outline" style={{ marginTop: 10 }}>
            🔁 Transfer Ticket · Re-verification required
          </button>
        </div>

        {/* ── Past tickets ── */}
        <div style={styles.sectionTitle}>Past Tickets</div>
        <div className="card" style={{ padding: "8px 14px" }}>
          {PAST_TICKETS.map((t, i) => (
            <div key={i} style={{ ...styles.pastRow, borderBottom: i < PAST_TICKETS.length - 1 ? "0.5px solid #f1f5f9" : "none" }}>
              <div style={styles.avatar}>{t.initials}</div>
              <div style={styles.pastInfo}>
                <div style={styles.pastName}>{t.name}</div>
                <div style={styles.pastSeat}>{t.seat}</div>
              </div>
              <div style={styles.usedBadge}>Used</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Deterministic QR-like SVG pattern */
function QRPattern() {
  const cells = [];
  const seed = Date.now();
  const pseudo = (i) => ((seed * (i + 7) * 2654435761) >>> 0) % 2 === 0;

  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      /* Corner squares — always filled */
      const corner =
        (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2);
      if (corner || pseudo(r * 7 + c)) {
        cells.push(<rect key={`${r}-${c}`} x={c * 10} y={r * 10} width={9} height={9} rx={1} fill="#1A56DB" />);
      }
    }
  }
  return (
    <svg viewBox="0 0 70 70" style={{ width: 70, height: 70 }}>
      {cells}
    </svg>
  );
}

const styles = {
  wrap: { background: "#f8fafc", minHeight: "100vh" },

  ticketCard: {
    background: "#0F172A", borderRadius: 16, padding: 20,
    color: "#fff", marginBottom: 14, position: "relative", overflow: "hidden",
  },
  pointsBadge: {
    position: "absolute", top: 14, right: 14,
    background: "#FFD700", color: "#92400E",
    fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
  },
  decorCircle: {
    position: "absolute", top: -30, right: -30,
    width: 100, height: 100, background: "rgba(26,86,219,0.25)", borderRadius: "50%",
  },

  eventName: { fontSize: 20, fontWeight: 700, marginBottom: 2 },
  eventSub:  { fontSize: 12, color: "#94a3b8", marginBottom: 16 },

  detailsGrid: { display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" },
  detailItem:  { display: "flex", flexDirection: "column", gap: 2 },
  detailLabel: { fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" },
  detailValue: { fontSize: 13, fontWeight: 600, color: "#fff" },

  dashDivider: {
    borderTop: "1.5px dashed #1e3a5f",
    margin: "12px -20px",
  },

  qrWrap: { display: "flex", justifyContent: "center", marginBottom: 8 },
  qrBox: {
    background: "#fff", borderRadius: 10, padding: 10,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
  },
  qrNote: { fontSize: 10, color: "#64748b", textAlign: "center" },

  sectionTitle: { fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 8 },

  pastRow:  { display: "flex", alignItems: "center", padding: "10px 0" },
  avatar:   { width: 32, height: 32, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#1A56DB", flexShrink: 0 },
  pastInfo: { flex: 1, marginLeft: 10 },
  pastName: { fontSize: 13, fontWeight: 500, color: "#1e293b" },
  pastSeat: { fontSize: 10, color: "#64748b", marginTop: 1 },
  usedBadge: { background: "#DCFCE7", color: "#166534", fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 10 },
};
