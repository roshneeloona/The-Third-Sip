import { INVENTORY, ORDERS, MENU_ITEMS } from "../data/adminData";
import { expiryStatus, daysUntil, fmt } from "../utils/helpers";
import StatCard   from "../components/StatCard";
import SalesChart from "../components/SalesChart";

export default function Dashboard() {
  const expiryAlerts = INVENTORY.filter(i => ["critical", "expired"].includes(expiryStatus(i.expiry)));
  const lowStock     = INVENTORY.filter(i => i.stock <= i.reorder);
  const todayOrders  = ORDERS.filter(o => o.time !== "Yesterday");
  const pending      = todayOrders.filter(o => o.status === "Pending");

  return (
    <div className="section-gap">

      <div className="stat-grid">
        <StatCard icon="💰" label="Weekly Revenue" value={fmt(35350)}          sub="↑ 12% vs last week" />
        <StatCard icon="🛒" label="Today's Orders" value={todayOrders.length}  sub={`${pending.length} pending`} />
        <StatCard icon="⚠️" label="Expiry Alerts"  value={expiryAlerts.length} sub="Need attention" />
        <StatCard icon="📦" label="Low Stock"       value={lowStock.length}     sub="Below reorder level" />
      </div>

      <div className="two-col">
        <SalesChart />

        <div className="card top-sellers">
          <p className="card__eyebrow">This Week</p>
          <h3 className="card__title" style={{ marginBottom: 20 }}>Top Sellers</h3>
          {[...MENU_ITEMS].sort((a, b) => b.sold - a.sold).slice(0, 5).map((item, i) => (
            <div key={item.id} className="top-sellers__row">
              <span className="top-sellers__rank">#{i + 1}</span>
              <span className="top-sellers__name">{item.name}</span>
              <div className="top-sellers__bar-bg">
                <div className="top-sellers__bar-fill" style={{ width: `${(item.sold / 130) * 100}%` }} />
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
            {expiryAlerts.map(item => {
              const d = daysUntil(item.expiry);
              return (
                <div key={item.id} className="expiry-pill">
                  <div className="expiry-pill__name">{item.name}</div>
                  <div className="expiry-pill__days">
                    {d < 0 ? "Expired!" : `Expires in ${d} day${d !== 1 ? "s" : ""}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}