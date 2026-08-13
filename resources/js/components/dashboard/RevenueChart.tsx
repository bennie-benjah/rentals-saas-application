import { useState } from "react";

export interface RevenueChartItem {
  m: string;
  v: number;
  amount: string;
  peak?: boolean;
}

interface RevenueChartProps {
  chartData?: RevenueChartItem[];
}

export function RevenueChart({ chartData = [] }: RevenueChartProps) {
  const [range, setRange] = useState<"12M" | "30D">("12M");

  const peakItem = chartData.find((d) => d.peak);

  return (
    <div className="lg:col-span-2 p-6 bg-surface rounded-2xl ring-1 ring-border space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-medium text-lg">Revenue Performance</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {peakItem ? `Peak: ${peakItem.amount} (${peakItem.m})` : "Monthly Revenue"}
          </p>
        </div>
        <div className="flex gap-1 bg-muted rounded-full p-1">
          {(["12M", "30D"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                range === r
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {r === "12M" ? "12 Months" : "30 Days"}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 flex items-end gap-2 pt-4">
        {chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
            No revenue data available
          </div>
        ) : (
          chartData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] py-1 px-2 rounded font-mono pointer-events-none whitespace-nowrap z-10">
                {d.amount}
              </div>
              <div
                className={`w-full rounded-t-sm transition-all duration-300 ${
                  d.peak ? "bg-foreground" : "bg-muted group-hover:bg-foreground/30"
                }`}
                style={{ height: `${Math.max(d.v, 4)}%` }}
              />
              <span className="text-[10px] font-mono text-muted-foreground">{d.m}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}