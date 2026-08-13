import { usePlan, fmt, type Usage } from "@/hooks/use-plan";
import { AlertTriangle } from "lucide-react";

export function UsageMeter({ resource, label }: { resource: keyof Usage; label: string }) {
  const { plan, usage, openUpgrade } = usePlan();
  const limit = plan[resource as "units" | "tenants" | "teamSeats"];
  const current = usage[resource];
  const pct = limit === Infinity ? 0 : Math.min(100, Math.round((current / limit) * 100));
  const isFull = limit !== Infinity && current >= limit;
  const isNear = pct >= 80 && !isFull;

  return (
    <div className="bg-surface ring-1 ring-border rounded-2xl p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {label} usage · {plan.name}
          </p>
          <p className="font-mono text-sm mt-1">
            <span className="text-base font-medium">{current}</span>
            <span className="text-muted-foreground"> / {fmt(limit)}</span>
          </p>
        </div>
        {(isFull || isNear) && (
          <button
            onClick={() =>
              openUpgrade({
                resource,
                current,
                limit: limit === Infinity ? Number.MAX_SAFE_INTEGER : limit,
                requiredPlan: "operator",
              })
            }
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg ${
              isFull ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
            }`}
          >
            <AlertTriangle className="size-3.5" />
            {isFull ? "Limit reached" : "Near limit"}
          </button>
        )}
      </div>
      {limit !== Infinity && (
        <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${isFull ? "bg-destructive" : isNear ? "bg-warning" : "bg-foreground"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
