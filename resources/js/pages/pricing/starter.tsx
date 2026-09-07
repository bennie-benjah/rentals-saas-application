import { PlanPage } from "@/components/pricing/PlanPage";
import AppLayout from "@/layouts/app-layout";

interface PlanData {
  id?: string;
  name?: string;
  tagline?: string;
  price?: string;
  unit?: string;
  cta?: string;
  features?: string[];
  includes?: { t: string; d: string }[];
  not_included?: string[];
}

interface StarterProps {
  plan?: PlanData;
  currentPlan?: string | null;
}

export default function Starter({ plan, currentPlan }: StarterProps) {
  return (
    <PlanPage
      name={plan?.name ?? "Starter"}
      tagline={plan?.tagline ?? "For independent landlords just getting organized."}
      price={plan?.price ?? "$2"}
      unit={plan?.unit ?? "/unit/mo"}
      cta={plan?.cta ?? "Start with Starter"}
      features={
        plan?.features ?? [
          "Up to 25 units",
          "Maintenance kanban board",
          "Tenant portal access",
          "Card & ACH rent collection",
          "Email support",
        ]
      }
      includes={
        plan?.includes ?? [
          { t: "Live dashboard", d: "Occupancy, revenue and ticket volume at a glance." },
          { t: "Tenant onboarding", d: "Multi-step forms to invite and verify tenants." },
          { t: "Document storage", d: "Centralized lease and document repository." },
        ]
      }
      notIncluded={
        plan?.not_included ?? [
          "M-Pesa payments",
          "Real-time messaging",
          "SSO & SCIM",
          "Custom reporting",
        ]
      }
      currentPlan={currentPlan}
    />
  );
}

// Wrap with AppLayout using isGuest=true to bypass DashboardLayout
Starter.layout = (page: React.ReactNode) => <AppLayout isGuest>{page}</AppLayout>;
