import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const TICKET_ID = 'TKT-AFCON-2027-C14';
const WINDOW_MS = 30000;

// Stable per-window token: same value for any time within the same 30s window
function tokenForWindow(windowStart) {
  // Deterministic-ish per window so it's stable within the window without storing state.
  // Seeded from the window value; regenerated only when the window changes.
  let seed = windowStart;
  let hex = '';
  for (let i = 0; i < 6; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    hex += Math.floor((seed / 233280) * 16).toString(16);
  }
  return hex;
}

function buildQrValue() {
  const windowStart = Math.floor(Date.now() / WINDOW_MS) * WINDOW_MS;
  const token = tokenForWindow(windowStart);
  return `KETI-${TICKET_ID}-${windowStart}-${token}`;
}

function secondsRemaining() {
  const now = Date.now();
  const windowStart = Math.floor(now / WINDOW_MS) * WINDOW_MS;
  return Math.ceil((windowStart + WINDOW_MS - now) / 1000);
}

const pastTickets = [
  { id: 1, name: 'CHAN 2024 — Group Stage', date: '12 Aug 2024', seat: 'B22' },
  { id: 2, name: 'Harambee Stars Friendly', date: '03 Jun 2024', seat: 'A09' },
  { id: 3, name: 'Tusker FC vs Gor Mahia', date: '21 Apr 2024', seat: 'D44' },
];

export default function Wallet() {
  const navigate = useNavigate();
  const [qrValue, setQrValue] = useState(() => buildQrValue());
  const [countdown, setCountdown] = useState(() => secondsRemaining());
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const tick = setInterval(() => {
      const remaining = secondsRemaining();
      setCountdown(remaining);

      // Fade out just before rotation, then swap value and fade back in.
      if (remaining <= 1) {
        setVisible(false);
        setTimeout(() => {
          setQrValue(buildQrValue());
          setVisible(true);
        }, 300);
      }
    }, 1000);

    return () => clearInterval(tick);
  }, []);

  const countdownColor = countdown <= 5 ? '#EF4444' : '#94A3B8';

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>My Wallet</h1>

      {/* Active ticket card */}
      <div style={styles.card}>
        {/* Top row: event name + points badge */}
        <div style={styles.cardTop}>
          <div>
            <div style={styles.eventName}>AFCON 2027</div>
            <div style={styles.eventSub}>Kenya vs Morocco</div>
          </div>
          <div style={styles.pointsBadge}>⭐ 340 pts</div>
        </div>

        {/* Event details grid */}
        <div style={styles.detailsGrid}>
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>Date</div>
            <div style={styles.detailValue}>18 Jan 2027</div>
          </div>
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>Time</div>
            <div style={styles.detailValue}>20:00 EAT</div>
          </div>
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>Seat</div>
            <div style={styles.detailValue}>C14</div>
          </div>
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>Zone</div>
            <div style={styles.detailValue}>West Stand</div>
          </div>
        </div>

        {/* Dashed divider */}
        <div style={styles.divider} />

        {/* QR section */}
        <div style={styles.qrSection}>
          <div
            style={{
              ...styles.qrBox,
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <QRCodeSVG value={qrValue} size={180} level="M" />
          </div>
          <div style={{ ...styles.countdown, color: countdownColor }}>
            Refreshes in {countdown}s
          </div>
        </div>

        {/* Transfer button */}
        <button
          style={styles.transferBtn}
          onClick={() => navigate('/dashboard')}
        >
          Transfer Ticket
        </button>
      </div>

      {/* Past tickets */}
      <div style={styles.pastSection}>
        <h2 style={styles.pastHeading}>Past Tickets</h2>
        {pastTickets.map((t) => (
          <div key={t.id} style={styles.pastItem}>
            <div>
              <div style={styles.pastName}>{t.name}</div>
              <div style={styles.pastDate}>{t.date}</div>
            </div>
            <div style={styles.pastSeat}>Seat {t.seat}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '20px',
    paddingBottom: '90px',
    maxWidth: '480px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '20px',
    color: '#0F172A',
  },
  card: {
    background: '#0F172A',
    borderRadius: '20px',
    padding: '24px',
    color: '#fff',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.3)',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  eventName: {
    fontSize: '20px',
    fontWeight: 700,
  },
  eventSub: {
    fontSize: '14px',
    color: '#94A3B8',
    marginTop: '4px',
  },
  pointsBadge: {
    background: 'rgba(14, 165, 233, 0.15)',
    color: '#0EA5E9',
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '20px',
  },
  detailItem: {},
  detailLabel: {
    fontSize: '12px',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  detailValue: {
    fontSize: '15px',
    fontWeight: 600,
    marginTop: '4px',
  },
  divider: {
    borderTop: '2px dashed #334155',
    margin: '20px 0',
  },
  qrSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  qrBox: {
    background: '#fff',
    borderRadius: '12px',
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdown: {
    marginTop: '12px',
    fontSize: '13px',
    fontWeight: 600,
  },
  transferBtn: {
    width: '100%',
    marginTop: '24px',
    padding: '14px',
    background: '#1A56DB',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  pastSection: {
    marginTop: '28px',
  },
  pastHeading: {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '16px',
    color: '#0F172A',
  },
  pastItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    background: '#F1F5F9',
    borderRadius: '12px',
    marginBottom: '10px',
  },
  pastName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0F172A',
  },
  pastDate: {
    fontSize: '12px',
    color: '#64748B',
    marginTop: '2px',
  },
  pastSeat: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#1A56DB',
  },
};