import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BottomNav  from "./components/BottomNav";
import Home       from "./pages/Home";
import SeatMap    from "./pages/SeatMap";
import Checkout   from "./pages/Checkout";
import Wallet     from "./pages/Wallet";
import Dashboard  from "./pages/Dashboard";
import "./styles/global.css";

export default function App() {
  return (
    <Router>
      <div style={styles.shell}>
        <Routes>
          <Route path="/"          element={<Navigate to="/home" replace />} />
          <Route path="/home"      element={<Home />}      />
          <Route path="/seatmap"   element={<SeatMap />}   />
          <Route path="/checkout"  element={<Checkout />}  />
          <Route path="/wallet"    element={<Wallet />}    />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

const styles = {
  shell: {
    maxWidth:  375,
    margin:    "0 auto",
    minHeight: "100vh",
    background: "#f8fafc",
    position:  "relative",
    boxShadow: "0 0 40px rgba(0,0,0,0.12)",
  },
};
