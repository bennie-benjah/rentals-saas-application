import { Link } from "@inertiajs/react";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { PLANS, usePlan, fmt } from "@/hooks/use-plan";

const labels: Record<string, string> = {
  units: "rental units",
  tenants: "tenants",
  teamSeats: "team seats",
};

export function UpgradeDialog() {
  const { upgradeOpen, upgradeReason, closeUpgrade, plan, setPlan } = usePlan();
  if (!upgradeOpen) return null;
  const target = upgradeReason ? PLANS[upgradeReason.requiredPlan] : PLANS.operator;
  const resourceLabel = upgradeReason ? labels[upgradeReason.resource] : "this feature";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm animate-reveal"
      onClick={closeUpgrade}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg bg-background ring-1 ring-border rounded-t-3xl sm:rounded-3xl p-6 md:p-8 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Plan limit reached
              </p>
              <h2 className="font-display text-xl font-medium tracking-tight mt-0.5">
                Upgrade to {target.name}
              </h2>
            </div>
          </div>
          <button onClick={closeUpgrade} className="size-8 rounded-lg hover:bg-foreground/5 flex items-center justify-center" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>

        {upgradeReason && (
          <p className="text-sm text-muted-foreground mt-5">
            Your <span className="font-medium text-foreground">{plan.name}</span> plan allows up to{" "}
            <span className="font-medium text-foreground">{fmt(upgradeReason.limit)}</span> {resourceLabel}.
            You're currently at <span className="font-medium text-foreground">{upgradeReason.current}</span>.
          </p>
        )}

        <div className="mt-6 p-5 bg-surface ring-1 ring-border rounded-2xl">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="font-display text-lg font-medium">{target.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {target.units === Infinity ? "Unlimited" : target.units} units · {target.teamSeats === Infinity ? "Unlimited" : target.teamSeats} seats
              </p>
            </div>
            <span className="font-mono text-sm">{target.price}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <button
            onClick={closeUpgrade}
            className="px-4 py-2.5 text-sm rounded-xl hover:bg-foreground/5"
          >
            Not now
          </button>
          <Link
            href={target.id === "portfolio" ? "/pricing/portfolio" : "/pricing/operator"}
            onClick={closeUpgrade}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-xl text-sm font-semibold hover:opacity-90"
          >
            View {target.name} plan <ArrowRight className="size-4" />
          </Link>
          <button
            onClick={() => {
              setPlan(target.id);
              closeUpgrade();
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90"
          >
            Upgrade now
          </button>
        </div>
      </div>
    </div>
  );
}
