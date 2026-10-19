/**
 * Simple SVG bar chart — no chart library dependency.
 * Values are demo/sample only when sourced from adminDashboardMockData.
 */

export default function PlacementOverviewChart({
  months = [],
  label = "Demo placement overview",
  loading = false,
}) {
  if (loading) {
    return (
      <div className="space-y-3 p-5" aria-hidden="true">
        <div className="h-4 w-48 animate-pulse rounded bg-border/60" />
        <div className="h-48 animate-pulse rounded-[10px] bg-border/60" />
      </div>
    );
  }

  if (!months.length) {
    return (
      <div className="px-5 py-10 text-center">
        <p className="text-sm text-secondary-text">
          No placement overview data available.
        </p>
      </div>
    );
  }

  const maxValue = Math.max(...months.map((item) => item.placed), 1);
  const chartWidth = 420;
  const chartHeight = 180;
  const paddingX = 28;
  const paddingTop = 16;
  const paddingBottom = 36;
  const plotWidth = chartWidth - paddingX * 2;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const barGap = 12;
  const barWidth = (plotWidth - barGap * (months.length - 1)) / months.length;

  return (
    <div className="p-5">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-secondary-text">
        {label}
      </p>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-48 w-full min-w-[320px]"
          role="img"
          aria-label={label}
        >
          {[0.25, 0.5, 0.75, 1].map((fraction) => {
            const y = paddingTop + plotHeight * (1 - fraction);
            return (
              <line
                key={fraction}
                x1={paddingX}
                x2={chartWidth - paddingX}
                y1={y}
                y2={y}
                stroke="currentColor"
                className="text-border"
                strokeWidth="1"
              />
            );
          })}
          {months.map((item, index) => {
            const barHeight = (item.placed / maxValue) * plotHeight;
            const x = paddingX + index * (barWidth + barGap);
            const y = paddingTop + plotHeight - barHeight;

            return (
              <g key={item.month}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 2)}
                  rx="6"
                  className="fill-primary"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className="fill-foreground text-[10px] font-medium"
                >
                  {item.placed}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  className="fill-secondary-text text-[11px]"
                >
                  {item.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
