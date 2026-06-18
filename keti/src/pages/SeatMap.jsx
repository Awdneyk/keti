import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ZONES = [
  { id: "vip",      label: "VIP · Gold Stand",      type: "VIP",      color: "#FFD700", textColor: "#78350F", price: "KES 8,500",  avail: "340 left"   },
  { id: "std-east", label: "Standard · East Stand",  type: "Standard", color: "#1A56DB", textColor: "#fff",    price: "KES 4,500",  avail: "680 left"   },
  { id: "std-west", label: "Standard · West Stand",  type: "Standard", color: "#1A56DB", textColor: "#fff",    price: "KES 4,500",  avail: "520 left"   },
  { id: "budget",   label: "Budget · South Stand",   type: "Budget",   color: "#94a3b8", textColor: "#1e293b", price: "KES 2,500",  avail: "1,200 left" },
];

export default function SeatMap() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const zone = ZONES.find(z => z.id === selected);

  return (
    <div style={styles.wrap}>
      {/* ── Topbar ── */}
      <div className="topbar">
        <div className="topbar-row">
          <div className="logo">Keti<span>.</span></div>
          <div className="badge">AFCON 2027</div>
        </div>
      </div>

      <div className="screen-wrap" style={{ padding: "12px 16px 80px" }}>
        {/* ── Event info ── */}
        <div style={styles.eventInfo}>
          <div style={styles.eventTitle}>⚽ Kenya vs Egypt — Group Stage</div>
          <div style={styles.eventMeta}>Kasarani Stadium, Nairobi · 15 Jun 2027, 18:00</div>
        </div>

        {/* ── Map container ── */}
        <div style={styles.mapContainer}>

          {/* Legend */}
          <div style={styles.legend}>
            {[
              { color: "#FFD700", label: "VIP" },
              { color: "#1A56DB", label: "Standard" },
              { color: "#94a3b8", label: "Budget" },
              { color: "#e2e8f0", label: "Sold Out" },
            ].map(l => (
              <div key={l.label} style={styles.legItem}>
                <div style={{ ...styles.legDot, background: l.color }} />
                <span>{l.label}</span>
              </div>
            ))}
          </div>

          {/* SVG Stadium */}
          <svg viewBox="0 0 320 200" style={styles.svg}>
            <rect width="320" height="200" fill="#f8fafc" rx="8" />

            {/* Pitch */}
            <rect x="90" y="60" width="140" height="90" rx="4" fill="#4CAF50" opacity="0.25" stroke="#4CAF50" strokeWidth="1.5" />
            <text x="160" y="108" fontSize="10" fill="#166534" textAnchor="middle" fontWeight="500">Pitch</text>

            {/* VIP — North */}
            <rect x="90" y="30" width="140" height="24" rx="4"
              fill={selected === "vip" ? "#FBBF24" : "#FFD700"}
              stroke={selected === "vip" ? "#D97706" : "none"} strokeWidth="2"
              style={{ cursor: "pointer" }}
              onClick={() => setSelected("vip")}
            />
            <text x="160" y="46" fontSize="9" fill="#78350F" textAnchor="middle" fontWeight="600" style={{ pointerEvents: "none" }}>
              VIP · Gold Stand
            </text>

            {/* Budget — South */}
            <rect x="90" y="156" width="140" height="24" rx="4"
              fill={selected === "budget" ? "#64748b" : "#94a3b8"}
              stroke={selected === "budget" ? "#475569" : "none"} strokeWidth="2"
              style={{ cursor: "pointer" }}
              onClick={() => setSelected("budget")}
            />
            <text x="160" y="172" fontSize="9" fill="#1e293b" textAnchor="middle" fontWeight="600" style={{ pointerEvents: "none" }}>
              Budget · South Stand
            </text>

            {/* Standard — East */}
            <rect x="240" y="60" width="36" height="90" rx="4"
              fill={selected === "std-east" ? "#1D4ED8" : "#1A56DB"}
              stroke={selected === "std-east" ? "#1E40AF" : "none"} strokeWidth="2"
              style={{ cursor: "pointer" }}
              onClick={() => setSelected("std-east")}
            />
            <text x="258" y="107" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="600"
              style={{ pointerEvents: "none" }} transform="rotate(-90,258,107)">
              Standard · East
            </text>

            {/* Standard — West */}
            <rect x="44" y="60" width="36" height="90" rx="4"
              fill={selected === "std-west" ? "#1D4ED8" : "#1A56DB"}
              stroke={selected === "std-west" ? "#1E40AF" : "none"} strokeWidth="2"
              style={{ cursor: "pointer" }}
              onClick={() => setSelected("std-west")}
            />
            <text x="62" y="107" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="600"
              style={{ pointerEvents: "none" }} transform="rotate(-90,62,107)">
              Standard · West
            </text>

            {/* Sold out corners */}
            {[[44,30],[240,30],[44,156],[240,156]].map(([x,y],i) => (
              <g key={i}>
                <rect x={x} y={y} width="36" height="24" rx="4" fill="#e2e8f0" />
                <text x={x+18} y={y+14} fontSize="7" fill="#94a3b8" textAnchor="middle">Sold</text>
              </g>
            ))}
          </svg>

          {/* Zone detail drawer */}
          <div style={styles.drawer}>
            {!zone ? (
              <div style={styles.drawerHint}>👆 Tap a zone to see price & availability</div>
            ) : (
              <>
                <div style={styles.drawerHeader}>
                  <div>
                    <div style={styles.drawerTitle}>{zone.label}</div>
                    <div style={styles.drawerMeta}>
                      <span style={styles.drawerChip}>{zone.type}</span>
                      <span style={styles.drawerAvail}>🪑 {zone.avail}</span>
                    </div>
                  </div>
                  <div style={styles.drawerPrice}>{zone.price}</div>
                </div>
                <button className="btn-primary" onClick={() => navigate("/checkout")}>
                  Select Seats →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { background: "#f8fafc", minHeight: "100vh" },

  eventInfo: {
    background: "#1A56DB", color: "#fff", borderRadius: 12,
    padding: "12px 14px", marginBottom: 12,
  },
  eventTitle: { fontSize: 14, fontWeight: 600 },
  eventMeta:  { fontSize: 11, opacity: 0.8, marginTop: 2 },

  mapContainer: {
    background: "#fff", borderRadius: 12,
    border: "0.5px solid #e2e8f0", padding: 12,
  },

  legend: { display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" },
  legItem: { display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#64748b" },
  legDot:  { width: 10, height: 10, borderRadius: 3 },

  svg: { width: "100%", borderRadius: 8 },

  drawer: {
    marginTop: 12, background: "#f8fafc", borderRadius: 10,
    padding: 12, border: "0.5px solid #e2e8f0",
  },
  drawerHint:  { fontSize: 13, color: "#94a3b8", textAlign: "center", padding: "4px 0" },
  drawerHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  drawerTitle:  { fontSize: 14, fontWeight: 600, color: "#1e293b" },
  drawerMeta:   { display: "flex", alignItems: "center", gap: 8, marginTop: 4 },
  drawerChip:   { background: "#EFF6FF", color: "#1A56DB", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 10 },
  drawerAvail:  { fontSize: 11, color: "#64748b" },
  drawerPrice:  { fontSize: 20, fontWeight: 700, color: "#1A56DB" },
};
