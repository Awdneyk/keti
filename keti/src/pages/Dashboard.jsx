const STATS = [
  { label: "Tickets Sold",    value: "34,820",  sub: "↑ +1,240 today",    subColor: "#4CAF50" },
  { label: "Revenue",         value: "KES 142M", sub: "↑ +12% uplift",    subColor: "#4CAF50" },
  { label: "Fraud Blocked",   value: "0",        sub: "Identity verified", subColor: "#1A56DB" },
  { label: "Capacity",        value: "68%",      sub: "↑ Rising fast",    subColor: "#4CAF50" },
];

const ZONES_CHART = [
  { label: "VIP",     pct: 95, color: "#FFD700" },
  { label: "E.Stand", pct: 72, color: "#1A56DB" },
  { label: "W.Stand", pct: 68, color: "#1A56DB" },
  { label: "Budget",  pct: 44, color: "#94a3b8" },
];

const TRANSACTIONS = [
  { initials: "JM", name: "John Mwangi",      seat: "VIP C-14 · 2 tickets",       amt: "KES 17,200" },
  { initials: "AO", name: "Amina Odhiambo",   seat: "Standard E-22 · 1 ticket",   amt: "KES 4,700"  },
  { initials: "DK", name: "David Kamau",       seat: "Budget S-08 · 4 tickets",    amt: "KES 10,800" },
  { initials: "FN", name: "Fatuma Njeri",      seat: "Standard W-31 · 2 tickets",  amt: "KES 9,400"  },
];

const FILL_PCT = 68;
const SOLD     = 34820;
const CAPACITY = 51000;

export default function Dashboard() {
  return (
    <div style={styles.wrap}>
      {/* ── Topbar ── */}
      <div className="topbar">
        <div className="topbar-row">
          <div className="logo">Keti<span>.</span></div>
          <div className="badge">Organiser View</div>
        </div>
      </div>

      <div className="screen-wrap" style={{ padding: "12px 16px 80px" }}>
        <div style={styles.subheading}>Kenya vs Egypt · AFCON 2027 — Live Dashboard</div>

        {/* ── Stats grid ── */}
        <div style={styles.statGrid}>
          {STATS.map(s => (
            <div key={s.label} className="card" style={{ marginBottom: 0 }}>
              <div style={styles.statLabel}>{s.label}</div>
              <div style={styles.statValue}>{s.value}</div>
              <div style={{ ...styles.statSub, color: s.subColor }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Fill rate ── */}
        <div className="card" style={{ marginTop: 10 }}>
          <div style={styles.progressHeader}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#1e293b" }}>Stadium fill rate</span>
            <span style={{ fontSize: 11, color: "#64748b" }}>{SOLD.toLocaleString()} / {CAPACITY.toLocaleString()} seats</span>
          </div>
          <div style={styles.progressBg}>
            <div style={{ ...styles.progressFill, width: `${FILL_PCT}%` }} />
          </div>
          <div style={styles.progressLabels}>
            <span style={{ fontSize: 9, color: "#64748b" }}>0%</span>
            <span style={{ fontSize: 9, color: "#1A56DB", fontWeight: 600 }}>{FILL_PCT}% sold</span>
            <span style={{ fontSize: 9, color: "#64748b" }}>100%</span>
          </div>
        </div>

        {/* ── Zone bar chart ── */}
        <div className="card">
          <div className="card-label">Sales by Zone</div>
          <div style={styles.barChart}>
            {ZONES_CHART.map(z => (
              <div key={z.label} style={styles.barCol}>
                <div style={styles.barPctLabel}>{z.pct}%</div>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, height: `${z.pct}%`, background: z.color }} />
                </div>
                <div style={styles.barLabel}>{z.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Revenue breakdown ── */}
        <div className="card">
          <div className="card-label">Revenue Breakdown</div>
          <div style={styles.revRow}>
            <span style={styles.revLabel}>Base revenue</span>
            <span style={styles.revVal}>KES 127M</span>
          </div>
          <div style={styles.revRow}>
            <span style={styles.revLabel}>Dynamic pricing uplift</span>
            <span style={{ ...styles.revVal, color: "#4CAF50" }}>+ KES 15M</span>
          </div>
          <div style={styles.revDivider} />
          <div style={{ ...styles.revRow, marginBottom: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Total Revenue</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1A56DB" }}>KES 142M</span>
          </div>
        </div>

        {/* ── Recent transactions ── */}
        <div className="card">
          <div className="card-label">Recent Transactions</div>
          {TRANSACTIONS.map((t, i) => (
            <div key={i} style={{ ...styles.txnRow, borderBottom: i < TRANSACTIONS.length - 1 ? "0.5px solid #f1f5f9" : "none" }}>
              <div style={styles.txnAvatar}>{t.initials}</div>
              <div style={styles.txnInfo}>
                <div style={styles.txnName}>{t.name}</div>
                <div style={styles.txnSeat}>{t.seat}</div>
              </div>
              <div style={styles.txnAmt}>{t.amt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { background: "#f8fafc", minHeight: "100vh" },

  subheading: { fontSize: 11, color: "#64748b", marginBottom: 10 },

  statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  statLabel: { fontSize: 10, color: "#64748b", marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: 700, color: "#1e293b" },
  statSub:   { fontSize: 10, fontWeight: 500, marginTop: 2 },

  progressHeader: { display: "flex", justifyContent: "space-between", marginBottom: 8 },
  progressBg:     { background: "#f1f5f9", borderRadius: 6, height: 10, overflow: "hidden" },
  progressFill:   { height: "100%", borderRadius: 6, background: "#1A56DB", transition: "width 0.6s ease" },
  progressLabels: { display: "flex", justifyContent: "space-between", marginTop: 4 },

  barChart: { display: "flex", alignItems: "flex-end", gap: 8, height: 110, marginTop: 8 },
  barCol:   { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" },
  barPctLabel: { fontSize: 9, color: "#64748b", marginBottom: 2 },
  barTrack: { flex: 1, width: "100%", background: "#f1f5f9", borderRadius: 4, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" },
  barFill:  { width: "100%", borderRadius: "4px 4px 0 0", transition: "height 0.6s ease" },
  barLabel: { fontSize: 9, color: "#64748b", marginTop: 4, textAlign: "center" },

  revRow:    { display: "flex", justifyContent: "space-between", marginBottom: 8 },
  revLabel:  { fontSize: 12, color: "#64748b" },
  revVal:    { fontSize: 12, fontWeight: 600, color: "#1e293b" },
  revDivider: { borderTop: "0.5px solid #e2e8f0", margin: "8px 0" },

  txnRow:    { display: "flex", alignItems: "center", padding: "10px 0" },
  txnAvatar: { width: 32, height: 32, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#1A56DB", flexShrink: 0 },
  txnInfo:   { flex: 1, marginLeft: 10 },
  txnName:   { fontSize: 13, fontWeight: 500, color: "#1e293b" },
  txnSeat:   { fontSize: 10, color: "#64748b", marginTop: 1 },
  txnAmt:    { fontSize: 12, fontWeight: 600, color: "#1A56DB" },
};
