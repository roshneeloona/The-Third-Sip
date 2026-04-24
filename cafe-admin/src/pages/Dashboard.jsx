import { useEffect } from "react";
import StatCard from "../components/StatCard";
import SalesChart from "../components/SalesChart";
import { fmt } from "../utils/helpers";
import { useAdminSummary } from "../hooks/useAdminSummary";
import { createAdminSocket } from "../utils/socket";

export default function Dashboard() {
  const { summary, loading, error, setSummary } = useAdminSummary();

  useEffect(() => {
    const socket = createAdminSocket();
    const handleSummary = (payload) => setSummary(payload);

    socket.on("summary:updated", handleSummary);
    return () => {
      socket.off("summary:updated", handleSummary);
      socket.disconnect();
    };
  }, [setSummary]);

  if (loading) {
    return <div className="card">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="card">{error}</div>;
  }

  const stats = summary?.stats || {};
  const topSellers = summary?.topSellers || [];
  const expiryAlerts = summary?.expiryAlerts || [];

  return (
    <div className="section-gap">

      <div className="stat-grid">
        <StatCard icon="ðŸ’°" label="Weekly Revenue" value={fmt(stats.weeklyRevenue || 0)} sub="Live backend total" />
        <StatCard icon="ðŸ›’" label="Today's Orders" value={stats.todayOrders || 0} sub={`${stats.pendingOrders || 0} pending`} />
        <StatCard icon="âš ï¸" label="Expiry Alerts" value={stats.expiryAlerts || 0} sub="Need attention" />
        <StatCard icon="ðŸ“¦" label="Low Stock" value={stats.lowStock || 0} sub="Below reorder level" />
      </div>

      <div className="two-col">
        <SalesChart data={summary?.salesByDay || []} />

        <div className="card top-sellers">
          <p className="card__eyebrow">This Week</p>
          <h3 className="card__title" style={{ marginBottom: 20 }}>Top Sellers</h3>
          {topSellers.map((item, index) => (
            <div key={item.id} className="top-sellers__row">
              <span className="top-sellers__rank">#{index + 1}</span>
              <span className="top-sellers__name">{item.name}</span>
              <div className="top-sellers__bar-bg">
                <div className="top-sellers__bar-fill" style={{ width: `${Math.min(100, (item.sold / 130) * 100)}%` }} />
              </div>
              <span className="top-sellers__count">{item.sold}</span>
            </div>
          ))}
        </div>
      </div>

      {expiryAlerts.length > 0 && (
        <div className="card card--alert expiry-section">
          <p className="card__eyebrow" style={{ color: "#8a3a2a" }}>Urgent</p>
          <h3 className="card__title">Expiry Alerts</h3>
          <div className="expiry-pills">
            {expiryAlerts.map((item) => (
              <div key={item.id} className="expiry-pill">
                <div className="expiry-pill__name">{item.name}</div>
                <div className="expiry-pill__days">
                  {item.daysLeft < 0 ? "Expired!" : `Expires in ${item.daysLeft} day${item.daysLeft !== 1 ? "s" : ""}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
