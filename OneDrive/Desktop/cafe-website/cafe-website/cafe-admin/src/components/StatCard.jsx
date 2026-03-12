export default function StatCard({ icon, label, value, sub }) {
  return (
    <div className="card stat-card">
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
      {sub && <div className="stat-card__sub">{sub}</div>}
    </div>
  );
}