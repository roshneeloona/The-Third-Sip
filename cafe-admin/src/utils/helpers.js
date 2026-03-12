// ── Date / expiry helpers ─────────────────────────────────────────────────────
const today = new Date();

export const daysUntil = (d) => Math.ceil((new Date(d) - today) / 86400000);

export const expiryStatus = (d) => {
  const days = daysUntil(d);
  if (days < 0)   return "expired";
  if (days <= 7)  return "critical";
  if (days <= 30) return "warning";
  return "good";
};

// ── Number formatter ──────────────────────────────────────────────────────────
export const fmt = (n) => "₹" + n.toLocaleString("en-IN");

// ── Status badge styles ───────────────────────────────────────────────────────
export const STATUS_STYLES = {
  Delivered: { color: "#3a7d55", bg: "#eaf5ee", border: "#b2dcc4" },
  Preparing: { color: "#8a6200", bg: "#fdf6e3", border: "#f0d88a" },
  Pending:   { color: "#2a5a8a", bg: "#eaf2fb", border: "#aacfee" },
  Cancelled: { color: "#8a3a3a", bg: "#fdf0f0", border: "#e8b4b4" },
};

export const EXPIRY_STYLES = {
  good:     { color: "#3a7d55", bg: "#eaf5ee", border: "#b2dcc4" },
  warning:  { color: "#8a6200", bg: "#fdf6e3", border: "#f0d88a" },
  critical: { color: "#8a3a2a", bg: "#fdf0f0", border: "#e8b4b4" },
  expired:  { color: "#5a1a1a", bg: "#f5e8e8", border: "#cc9999" },
};

// ── Shared inline style tokens ────────────────────────────────────────────────
export const S = {
  card: {
    background: "#ffffff",
    borderRadius: 14,
    boxShadow: "0 4px 22px rgba(62,32,3,0.09)",
    border: "1px solid rgba(62,32,3,0.08)",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#c69c6d",
    marginBottom: 4,
  },
  pageTitle: {
    fontFamily: '"Playfair Display", serif',
    fontSize: 20,
    fontWeight: 700,
    color: "#1c0f0a",
    margin: 0,
  },
  filterBtn: (active) => ({
    padding: "7px 18px",
    borderRadius: 50,
    background: active ? "#1c0f0a" : "#faf6f0",
    color: active ? "#c69c6d" : "#7a5c4a",
    border: active ? "1.5px solid #1c0f0a" : "1.5px solid rgba(62,32,3,0.12)",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: '"DM Sans", sans-serif',
    transition: "all .22s ease",
  }),
};