import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["All", "Sports", "Music", "Corporate"];

const UPCOMING = [
  { id: 1, emoji: "🏆", name: "KPL Finals",      date: "Aug 12 · Nyayo Stadium",  price: "KES 800",   rising: true,  category: "Sports"    },
  { id: 2, emoji: "🎵", name: "Sauti Sol Live",   date: "Sep 3 · KICC",            price: "KES 1,200", rising: true,  category: "Music"     },
  { id: 3, emoji: "🏃", name: "Nairobi Marathon", date: "Oct 19 · City Centre",    price: "KES 500",   rising: false, category: "Sports"    },
];

const AFCON_MATCHES = [
  { id: 4, emoji: "⚽", name: "Kenya vs Egypt",   date: "Jun 15 · Kasarani", price: "KES 2,500", rising: true, hot: true,  category: "Sports" },
  { id: 5, emoji: "⚽", name: "Morocco vs Ghana", date: "Jun 16 · Kasarani", price: "KES 2,000", rising: true, hot: false, category: "Sports" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("All");
  const navigate = useNavigate();

  const matches = (ev) => activeTab === "All" || ev.category === activeTab;
  const upcoming = UPCOMING.filter(matches);
  const afcon = AFCON_MATCHES.filter(matches);

  const goToEvent = (ev) =>
    navigate("/seatmap", { state: { eventId: ev.id, eventName: ev.name } });

  return (
    <div style={styles.wrap}>
      {/* ── Topbar ── */}
      <div className="topbar">
        <div className="topbar-row">
          <div className="logo">Keti<span>.</span></div>
          <div className="badge">AFCON 2027 🇰🇪</div>
        </div>
        <div style={styles.searchBar}>
          <span style={styles.searchIcon}>🔍</span>
          <input style={styles.searchInput} placeholder="Search events, venues..." />
        </div>
      </div>

      <div className="screen-wrap">
        {/* ── Category tabs ── */}
        <div style={styles.tabs}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{ ...styles.tab, ...(activeTab === cat ? styles.tabOn : styles.tabOff) }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Hero banner ── */}
        <div style={styles.hero}>
          <div style={styles.heroPrice}>
            <div style={styles.heroPriceVal}>KES 2,500</div>
            <div style={styles.heroPriceLbl}>from</div>
          </div>
          <div style={styles.heroSub}>🔥 Featured Event</div>
          <div style={styles.heroTitle}>AFCON 2027</div>
          <div style={styles.heroMeta}>📍 Kasarani Stadium, Nairobi · Jun 2027</div>
          <button
            style={styles.heroBtn}
            onClick={() => goToEvent({ id: 4, name: "Kenya vs Egypt" })}
          >
            Get Tickets →
          </button>
        </div>

        {/* ── Upcoming events ── */}
        <div style={styles.sectionTitle}>Upcoming in Nairobi</div>
        {upcoming.length === 0 ? (
          <div style={styles.empty}>No upcoming events in {activeTab}.</div>
        ) : (
          <div style={styles.cardRow}>
            {upcoming.map(ev => (
              <EventCard key={ev.id} event={ev} onClick={() => goToEvent(ev)} />
            ))}
          </div>
        )}

        {/* ── AFCON matches ── */}
        <div style={styles.sectionTitle}>AFCON Group Stages</div>
        {afcon.length === 0 ? (
          <div style={styles.empty}>No matches in {activeTab}.</div>
        ) : (
          <div style={styles.cardRow}>
            {afcon.map(ev => (
              <EventCard key={ev.id} event={ev} onClick={() => goToEvent(ev)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, onClick }) {
  const bgMap = { "🏆": "#FEF3C7", "🎵": "#EDE9FE", "🏃": "#DCFCE7", "⚽": "#EFF6FF" };
  return (
    <div style={styles.eventCard} onClick={onClick}>
      <div style={{ ...styles.eventCardImg, background: bgMap[event.emoji] || "#f1f5f9" }}>
        {event.emoji}
      </div>
      <div style={styles.eventCardBody}>
        <div style={styles.eventCardName}>{event.name}</div>
        <div style={styles.eventCardDate}>{event.date}</div>
        <div style={styles.priceRow}>
          <div style={styles.price}>{event.price}</div>
          {event.rising && (
            <div className="rising">{event.hot ? "🔥 Hot" : "↑ Rising"}</div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { background: "#f8fafc", minHeight: "100vh" },

  searchBar: {
    marginTop: 10, background: "#f1f5f9", borderRadius: 10,
    padding: "8px 12px", display: "flex", alignItems: "center", gap: 8,
  },
  searchIcon: { fontSize: 14, opacity: 0.5 },
  searchInput: {
    border: "none", background: "none", outline: "none",
    fontSize: 13, color: "#1e293b", flex: 1,
  },

  tabs: { display: "flex", gap: 8, padding: "12px 16px 0", overflowX: "auto" },
  tab: { padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", border: "none" },
  tabOn:  { background: "#1A56DB", color: "#fff" },
  tabOff: { background: "#f1f5f9", color: "#64748b" },

  hero: {
    margin: "12px 16px", background: "linear-gradient(135deg,#1A56DB 0%,#0EA5E9 100%)",
    borderRadius: 16, padding: 20, color: "#fff", position: "relative", overflow: "hidden",
  },
  heroPrice: { position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.2)", padding: "6px 10px", borderRadius: 8, textAlign: "right" },
  heroPriceVal: { fontSize: 16, fontWeight: 700 },
  heroPriceLbl: { fontSize: 9, opacity: 0.8 },
  heroSub:   { fontSize: 10, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1 },
  heroTitle: { fontSize: 22, fontWeight: 700, margin: "4px 0 2px" },
  heroMeta:  { fontSize: 12, opacity: 0.85, marginBottom: 14 },
  heroBtn:   { background: "#fff", color: "#1A56DB", fontSize: 12, fontWeight: 700, padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer" },

  sectionTitle: { fontSize: 13, fontWeight: 600, color: "#1e293b", padding: "14px 16px 8px" },
  cardRow: { display: "flex", gap: 10, padding: "0 16px 4px", overflowX: "auto" },
  empty: { fontSize: 12, color: "#94a3b8", padding: "0 16px 4px" },

  eventCard: { minWidth: 150, background: "#fff", borderRadius: 12, border: "0.5px solid #e2e8f0", overflow: "hidden", flexShrink: 0, cursor: "pointer" },
  eventCardImg: { height: 72, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 },
  eventCardBody: { padding: "8px 10px 10px" },
  eventCardName: { fontSize: 12, fontWeight: 600, color: "#1e293b" },
  eventCardDate: { fontSize: 10, color: "#64748b", margin: "2px 0 6px" },
  priceRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  price: { fontSize: 12, fontWeight: 700, color: "#1A56DB" },
};