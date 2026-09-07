import { PlanPage } from "@/components/pricing/PlanPage";
import AppLayout from "@/layouts/app-layout";

interface PlanData {
  id?: string;
  name?: string;
  tagline?: string;
  price?: string;
  unit?: string;
  cta?: string;
  featured?: boolean;
  features?: string[];
  includes?: { t: string; d: string }[];
  not_included?: string[];
}

interface OperatorProps {
  plan?: PlanData;
  currentPlan?: string | null;
}

export default function Operator({ plan, currentPlan }: OperatorProps) {
  return (
    <PlanPage
      featured={plan?.featured ?? true}
      name={plan?.name ?? "Operator"}
      tagline={
        plan?.tagline ??
        "The plan most portfolio leads pick. Unlimited units, every payment rail, and a calm inbox."
      }
      price={plan?.price ?? "$4"}
      unit={plan?.unit ?? "/unit/mo"}
      cta={plan?.cta ?? "Choose Operator"}
      features={
        plan?.features ?? [
          "Unlimited units",
          "M-Pesa & ACH payouts",
          "Real-time landlord–tenant messaging",
          "Maintenance kanban with photo uploads",
          "Financial reporting & exports",
          "Priority email & chat support",
        ]
      }
      includes={
        plan?.includes ?? [
          {
            t: "Every payment rail",
            d: "Card, ACH and M-Pesa — auto-reconciled to units.",
          },
          {
            t: "Unified inbox",
            d: "One real-time stream for every tenant conversation.",
          },
          {
            t: "Operator analytics",
            d: "Yield, vacancy and arrears in interactive charts.",
          },
        ]
      }
      notIncluded={
        plan?.not_included ?? ["SSO & SCIM", "Custom reporting", "Dedicated CSM"]
      }
      currentPlan={currentPlan}
    />
  );
}

// Explicitly wrap using AppLayout with isGuest=true to bypass DashboardLayout
Operator.layout = (page: React.ReactNode) => (
  <AppLayout isGuest>{page}</AppLayout>
);
