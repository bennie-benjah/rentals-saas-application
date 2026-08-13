import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type PlanId = "starter" | "operator" | "portfolio";

export type PlanLimits = {
  id: PlanId;
  name: string;
  price: string;
  units: number; // Infinity for unlimited
  tenants: number;
  teamSeats: number;
  features: { mpesa: boolean; messaging: boolean; sso: boolean; customReports: boolean };
};

export const PLANS: Record<PlanId, PlanLimits> = {
  starter: {
    id: "starter",
    name: "Starter",
    price: "$2/unit/mo",
    units: 25,
    tenants: 25,
    teamSeats: 2,
    features: { mpesa: false, messaging: false, sso: false, customReports: false },
  },
  operator: {
    id: "operator",
    name: "Operator",
    price: "$4/unit/mo",
    units: Infinity,
    tenants: Infinity,
    teamSeats: 10,
    features: { mpesa: true, messaging: true, sso: false, customReports: false },
  },
  portfolio: {
    id: "portfolio",
    name: "Portfolio",
    price: "Custom",
    units: Infinity,
    tenants: Infinity,
    teamSeats: Infinity,
    features: { mpesa: true, messaging: true, sso: true, customReports: true },
  },
};

// Current portfolio state (would normally come from DB)
export type Usage = { units: number; tenants: number; teamSeats: number };
const DEFAULT_USAGE: Usage = { units: 24, tenants: 22, teamSeats: 2 };

type UpgradeReason = { resource: keyof Usage; current: number; limit: number; requiredPlan: PlanId } | null;

type PlanCtx = {
  plan: PlanLimits;
  planId: PlanId;
  setPlan: (id: PlanId) => void;
  usage: Usage;
  setUsage: (u: Partial<Usage>) => void;
  check: (resource: keyof Usage, delta?: number) => boolean;
  attempt: (resource: keyof Usage, delta?: number) => boolean; // returns true if allowed; otherwise opens upgrade
  upgradeOpen: boolean;
  upgradeReason: UpgradeReason;
  openUpgrade: (reason?: UpgradeReason) => void;
  closeUpgrade: () => void;
};

const Ctx = createContext<PlanCtx | null>(null);

const STORAGE_KEY = "estateos.plan";

function recommendPlan(resource: keyof Usage, current: number): PlanId {
  // Starter caps at 25; Operator is unlimited; Portfolio for enterprise needs
  if (resource === "teamSeats" && current >= 10) return "portfolio";
  return "operator";
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [planId, setPlanId] = useState<PlanId>(() => {
    if (typeof window === "undefined") return "starter";
    return (localStorage.getItem(STORAGE_KEY) as PlanId) || "starter";
  });
  const [usage, setUsageState] = useState<Usage>(DEFAULT_USAGE);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<UpgradeReason>(null);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, planId);
  }, [planId]);

  const plan = PLANS[planId];

  const setUsage = useCallback((u: Partial<Usage>) => {
    setUsageState((prev) => ({ ...prev, ...u }));
  }, []);

  const check = useCallback(
    (resource: keyof Usage, delta = 0) => {
      const limit = plan[resource as "units" | "tenants" | "teamSeats"];
      return usage[resource] + delta <= limit;
    },
    [plan, usage],
  );

  const openUpgrade = useCallback((reason?: UpgradeReason) => {
    setUpgradeReason(reason ?? null);
    setUpgradeOpen(true);
  }, []);

  const closeUpgrade = useCallback(() => setUpgradeOpen(false), []);

  const attempt = useCallback(
    (resource: keyof Usage, delta = 1) => {
      if (check(resource, delta)) return true;
      const limit = plan[resource as "units" | "tenants" | "teamSeats"];
      openUpgrade({
        resource,
        current: usage[resource],
        limit: limit === Infinity ? Number.MAX_SAFE_INTEGER : limit,
        requiredPlan: recommendPlan(resource, usage[resource]),
      });
      return false;
    },
    [check, openUpgrade, plan, usage],
  );

  const value = useMemo<PlanCtx>(
    () => ({
      plan,
      planId,
      setPlan: setPlanId,
      usage,
      setUsage,
      check,
      attempt,
      upgradeOpen,
      upgradeReason,
      openUpgrade,
      closeUpgrade,
    }),
    [plan, planId, usage, setUsage, check, attempt, upgradeOpen, upgradeReason, openUpgrade, closeUpgrade],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlan() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlan must be used within PlanProvider");
  return ctx;
}

export function fmt(n: number) {
  return n === Infinity ? "∞" : n.toLocaleString();
}
