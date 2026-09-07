import { usePlan, fmt, type Usage } from "@/hooks/use-plan";
import { AlertTriangle } from "lucide-react";

type TrackedResource = keyof Usage;

interface UsageMeterProps {
  resource: TrackedResource;
  label: string;
}

export function UsageMeter({ resource, label }: UsageMeterProps) {
  const { plan, usage, openUpgrade } = usePlan();

  const limit = plan[resource];
  const current = usage[resource] ?? 0;
  const isUnlimited = limit === Infinity;

  const pct = isUnlimited ? 0 : Math.min(100, Math.round((current / limit) * 100));
  const isFull = !isUnlimited && current >= limit;
  const isNear = pct >= 80 && !isFull;

  const handleUpgradeClick = () => {
    openUpgrade({
      resource,
      current,
      limit: isUnlimited ? Number.MAX_SAFE_INTEGER : limit,
      requiredPlan: "operator",
    });
  };

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
            onClick={handleUpgradeClick}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
              isFull
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                : "bg-warning/10 text-warning hover:bg-warning/20"
            }`}
          >
            <AlertTriangle className="size-3.5" />
            {isFull ? "Limit reached" : "Near limit"}
          </button>
        )}
      </div>

      {!isUnlimited && (
        <div
          className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label} usage`}
        >
          <div
            className={`h-full transition-all duration-300 ${
              isFull ? "bg-destructive" : isNear ? "bg-warning" : "bg-foreground"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}