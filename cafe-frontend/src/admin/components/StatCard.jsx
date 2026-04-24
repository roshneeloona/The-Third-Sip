export default function StatCard({ icon, label, value, sub }) {
  return (
    <div className="admin-card admin-stat-card">
      <div className="admin-stat-card__icon">{icon}</div>
      <div className="admin-stat-card__label">{label}</div>
      <div className="admin-stat-card__value">{value}</div>
      {sub && <div className="admin-stat-card__sub">{sub}</div>}
    </div>
  );
}
