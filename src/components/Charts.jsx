export function DonutChart({ items }) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  let offset = 0;

  return (
    <div className="chart-card__visual donut-chart">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="chart-track" cx="60" cy="60" r="42" />
        {items.map((item) => {
          const dash = (item.value / total) * 264;
          const segment = (
            <circle
              className="chart-segment"
              cx="60"
              cy="60"
              key={item.label}
              r="42"
              stroke={item.color}
              strokeDasharray={`${dash} ${264 - dash}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return segment;
        })}
      </svg>
      <strong>{total}</strong>
    </div>
  );
}

export function BarChart({ items }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="bar-chart">
      {items.map((item) => (
        <div className="bar-row" key={item.label}>
          <span>{item.label}</span>
          <div><i style={{ width: `${(item.value / max) * 100}%` }} /></div>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

export function LineChart({ items, filled = false }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  const points = items.map((item, index) => {
    const x = (index / Math.max(items.length - 1, 1)) * 100;
    const y = 100 - (item.value / max) * 82 - 8;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg className="line-chart" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {filled ? <polygon points={`0,100 ${points} 100,100`} /> : null}
      <polyline points={points} />
    </svg>
  );
}
