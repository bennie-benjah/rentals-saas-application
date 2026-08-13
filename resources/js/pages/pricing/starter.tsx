import { PlanPage } from "@/components/pricing/PlanPage";
import AppLayout from "@/layouts/app-layout";

export default function Starter() {
  return (
    <PlanPage
      name="Starter"
      tagline="For independent landlords just getting organized."
      price="$2"
      unit="/unit/mo"
      cta="Start with Starter"
      features={[
        "Up to 25 units",
        "Maintenance kanban board",
        "Tenant portal access",
        "Card & ACH rent collection",
        "Email support",
      ]}
      includes={[
        { t: "Live dashboard", d: "Occupancy, revenue and ticket volume at a glance." },
        { t: "Tenant onboarding", d: "Multi-step forms to invite and verify tenants." },
        { t: "Document storage", d: "Centralized lease and document repository." },
      ]}
      notIncluded={["M-Pesa payments", "Real-time messaging", "SSO & SCIM", "Custom reporting"]}
    />
  );
}
// Explicitly wrap using AppLayout with isGuest=true to bypass DashboardLayout
Starter.layout = (page: React.ReactNode) => <AppLayout isGuest>{page}</AppLayout>;