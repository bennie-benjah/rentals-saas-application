import { Link } from "@inertiajs/react";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { PLANS, usePlan, fmt } from "@/hooks/use-plan";

const RESOURCE_LABELS: Record<string, string> = {
  units: "rental units",
  tenants: "tenants",
  teamSeats: "team seats",
};

export function UpgradeDialog() {
  const { upgradeOpen, upgradeReason, closeUpgrade, plan, setPlan } = usePlan();

  if (!upgradeOpen) return null;

  const targetPlan = upgradeReason ? PLANS[upgradeReason.requiredPlan] : PLANS.operator;
  const resourceLabel = upgradeReason ? RESOURCE_LABELS[upgradeReason.resource] ?? "this feature" : "this feature";
  const checkoutUrl = targetPlan.id === "portfolio" ? "/pricing/portfolio" : "/pricing/operator";

  const handleQuickUpgrade = () => {
    setPlan(targetPlan.id);
    closeUpgrade();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm animate-reveal"
      onClick={closeUpgrade}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-dialog-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg bg-background ring-1 ring-border rounded-t-3xl sm:rounded-3xl p-6 md:p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Plan limit reached
              </p>
              <h2 id="upgrade-dialog-title" className="font-display text-xl font-medium tracking-tight mt-0.5">
                Upgrade to {targetPlan.name}
              </h2>
            </div>
          </div>
          <button
            onClick={closeUpgrade}
            className="size-8 rounded-lg hover:bg-foreground/5 flex items-center justify-center transition-colors"
            aria-label="Close upgrade dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Reason Banner */}
        {upgradeReason && (
          <p className="text-sm text-muted-foreground mt-5">
            Your <span className="font-medium text-foreground">{plan.name}</span> plan allows up to{" "}
            <span className="font-medium text-foreground">{fmt(upgradeReason.limit)}</span> {resourceLabel}.
            You're currently at <span className="font-medium text-foreground">{upgradeReason.current}</span>.
          </p>
        )}

        {/* Target Plan Summary */}
        <div className="mt-6 p-5 bg-surface ring-1 ring-border rounded-2xl">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="font-display text-lg font-medium">{targetPlan.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {targetPlan.units === Infinity ? "Unlimited" : targetPlan.units} units ·{" "}
                {targetPlan.teamSeats === Infinity ? "Unlimited" : targetPlan.teamSeats} seats
              </p>
            </div>
            <span className="font-mono text-sm font-semibold">{targetPlan.price}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <button
            onClick={closeUpgrade}
            className="px-4 py-2.5 text-sm font-medium rounded-xl hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
          >
            Not now
          </button>
          <Link
            href={checkoutUrl}
            onClick={closeUpgrade}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-surface ring-1 ring-border rounded-xl text-sm font-medium hover:bg-foreground/5 transition-colors"
          >
            View plan details
          </Link>
          <button
            onClick={handleQuickUpgrade}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Upgrade now <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}