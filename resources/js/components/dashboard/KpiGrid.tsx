const kpis = [
  { label: "Occupancy Rate", value: "94.2%", delta: "+1.2%", tone: "success" as const },
  { label: "Monthly Revenue", value: "$124.8k", delta: "+4.3%", tone: "success" as const },
  { label: "Active Tenants", value: "312", delta: "Stable", tone: "muted" as const },
  { label: "Open Tickets", value: "18", delta: "-2 today", tone: "warning" as const },
];

const toneClass = {
  success: "text-success",
  warning: "text-warning",
  muted: "text-muted-foreground",
};

export function KpiGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((k) => (
        <div
          key={k.label}
          className="p-5 bg-surface rounded-2xl ring-1 ring-border hover:ring-foreground/15 transition-all duration-200 hover:-translate-y-0.5"
        >
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            {k.label}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-display font-medium tracking-tight">{k.value}</span>
            <span className={`text-xs ${toneClass[k.tone]}`}>{k.delta}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
