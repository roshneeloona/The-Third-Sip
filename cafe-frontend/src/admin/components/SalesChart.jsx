import { fmt } from "../utils/helpers";

export default function SalesChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [{ day: "Mon", revenue: 0 }];
  const max = Math.max(...chartData.map((entry) => entry.revenue), 1);
  const total = chartData.reduce((sum, entry) => sum + entry.revenue, 0);

  return (
    <div className="admin-card admin-chart">
      <div className="admin-chart__header">
        <div>
          <p className="admin-card__eyebrow">Weekly Overview</p>
          <h3 className="admin-card__title">Revenue</h3>
        </div>
        <span className="admin-chart__total">{fmt(total)}</span>
      </div>

      <div className="admin-chart__bars">
        {chartData.map((entry, index) => {
          const height = Math.round((entry.revenue / max) * 110);
          const active = index === chartData.length - 1;

          return (
            <div key={`${entry.day}-${index}`} className="admin-chart__bar-wrap">
              <div
                title={fmt(entry.revenue)}
                className={`admin-chart__bar ${active ? "admin-chart__bar--active" : "admin-chart__bar--default"}`}
                style={{ height }}
              />
              <span className={`admin-chart__bar-label ${active ? "admin-chart__bar-label--active" : ""}`}>
                {entry.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
