import { WEEKLY_SALES } from "../data/adminData";
import { fmt } from "../utils/helpers";

export default function SalesChart() {
  const max   = Math.max(...WEEKLY_SALES.map(d => d.revenue));
  const total = WEEKLY_SALES.reduce((a, b) => a + b.revenue, 0);

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
        {WEEKLY_SALES.map((d, i) => {
          const h      = Math.round((d.revenue / max) * 110);
          const active = i === WEEKLY_SALES.length - 1;
          return (
            <div key={d.day} className="chart__bar-wrap">
              <div
                title={fmt(d.revenue)}
                className={`chart__bar ${active ? "chart__bar--active" : "chart__bar--default"}`}
                style={{ height: h }}
              />
              <span className={`chart__bar-label ${active ? "chart__bar-label--active" : ""}`}>
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}