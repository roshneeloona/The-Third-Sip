import StatCard from "../components/StatCard";
import SalesChart from "../components/SalesChart";
import { fmt } from "../utils/helpers";
import { useAdminSummary } from "../hooks/useAdminSummary";

export default function Dashboard() {
  const { summary, loading, error } = useAdminSummary();

  if (loading) {
    return <div className="admin-card admin-card--padded">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="admin-card admin-card--padded">{error}</div>;
  }

  const stats = summary?.stats || {};
  const topSellers = summary?.topSellers || [];
  const expiryAlerts = summary?.expiryAlerts || [];

  return (
    <div className="admin-section-stack">
      <div className="admin-stat-grid">
        <StatCard icon="$" label="Weekly Revenue" value={fmt(stats.weeklyRevenue || 0)} sub="Live backend total" />
        <StatCard icon="O" label="Today's Orders" value={stats.todayOrders || 0} sub={`${stats.pendingOrders || 0} pending`} />
        <StatCard icon="!" label="Expiry Alerts" value={stats.expiryAlerts || 0} sub="Need attention" />
        <StatCard icon="#" label="Low Stock" value={stats.lowStock || 0} sub="Below reorder level" />
      </div>

      <div className="admin-two-col">
        <SalesChart data={summary?.salesByDay || []} />

        <div className="admin-card admin-top-sellers">
          <p className="admin-card__eyebrow">This Week</p>
          <h3 className="admin-card__title" style={{ marginBottom: 20 }}>Top Sellers</h3>
          {topSellers.map((item, index) => (
            <div key={item.id} className="admin-top-sellers__row">
              <span className="admin-top-sellers__rank">#{index + 1}</span>
              <span className="admin-top-sellers__name">{item.name}</span>
              <div className="admin-top-sellers__bar-bg">
                <div className="admin-top-sellers__bar-fill" style={{ width: `${Math.min(100, (item.sold / 130) * 100)}%` }} />
              </div>
              <span className="admin-top-sellers__count">{item.sold}</span>
            </div>
          ))}
        </div>
      </div>

      {expiryAlerts.length > 0 && (
        <div className="admin-card admin-card--alert admin-expiry-section">
          <p className="admin-card__eyebrow" style={{ color: "#8a3a2a" }}>Urgent</p>
          <h3 className="admin-card__title">Expiry Alerts</h3>
          <div className="admin-expiry-pills">
            {expiryAlerts.map((item) => (
              <div key={item.id} className="admin-expiry-pill">
                <div className="admin-expiry-pill__name">{item.name}</div>
                <div className="admin-expiry-pill__days">
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
