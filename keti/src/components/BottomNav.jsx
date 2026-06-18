import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { label: "Home",      icon: "🏠", path: "/home" },
  { label: "Seats",     icon: "🗺️", path: "/seatmap" },
  { label: "Checkout",  icon: "🛒", path: "/checkout" },
  { label: "Wallet",    icon: "🎟️", path: "/wallet" },
  { label: "Dashboard", icon: "📊", path: "/dashboard" },
];

export default function BottomNav() {
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <nav style={styles.nav}>
      {tabs.map(({ label, icon, path }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{ ...styles.item, color: active ? "#1A56DB" : "#94a3b8" }}
            aria-label={label}
            aria-current={active ? "page" : undefined}
          >
            <span style={styles.icon}>{icon}</span>
            <span style={styles.label}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

const styles = {
  nav: {
    position:       "fixed",
    bottom:         0,
    left:           "50%",
    transform:      "translateX(-50%)",
    width:          375,
    background:     "#fff",
    borderTop:      "0.5px solid #e2e8f0",
    display:        "flex",
    justifyContent: "space-around",
    padding:        "8px 0 10px",
    zIndex:         100,
  },
  item: {
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    gap:            2,
    background:     "none",
    border:         "none",
    cursor:         "pointer",
    padding:        "2px 0",
    minWidth:       44,
  },
  icon:  { fontSize: 20 },
  label: { fontSize: 9, fontWeight: 500 },
};
