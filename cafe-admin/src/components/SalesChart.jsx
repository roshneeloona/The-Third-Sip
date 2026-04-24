import { fmt } from "../utils/helpers";

export default function SalesChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [{ day: "Mon", revenue: 0 }];
  const max = Math.max(...chartData.map((entry) => entry.revenue), 1);
  const total = chartData.reduce((sum, entry) => sum + entry.revenue, 0);

  return (
    <div className="card chart">
      <div className="chart__header">
        <div>
          <p className="card__eyebrow">Weekly Overview</p>
          <h3 className="card__title">Revenue</h3>
        </div>
        <span className="chart__total">{fmt(total)}</span>
      </div>
      <div className="chart__bars">
        {chartData.map((entry, index) => {
          const height = Math.round((entry.revenue / max) * 110);
          const active = index === chartData.length - 1;
          return (
            <div key={`${entry.day}-${index}`} className="chart__bar-wrap">
              <div
                title={fmt(entry.revenue)}
                className={`chart__bar ${active ? "chart__bar--active" : "chart__bar--default"}`}
                style={{ height }}
              />
              <span className={`chart__bar-label ${active ? "chart__bar-label--active" : ""}`}>
                {entry.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
