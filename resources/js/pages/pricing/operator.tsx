// resources/js/Pages/pricing/Operator.tsx (or resources/js/Pages/Pricing/Operator.tsx)
import { PlanPage } from "@/components/pricing/PlanPage";
import AppLayout from "@/layouts/app-layout";


export default function Operator() {
  return (
    <PlanPage
      featured
      name="Operator"
      tagline="The plan most portfolio leads pick. Unlimited units, every payment rail, and a calm inbox."
      price="$4"
      unit="/unit/mo"
      cta="Choose Operator"
      features={[
        "Unlimited units",
        "M-Pesa & ACH payouts",
        "Real-time landlord–tenant messaging",
        "Maintenance kanban with photo uploads",
        "Financial reporting & exports",
        "Priority email & chat support",
      ]}
      includes={[
        { t: "Every payment rail", d: "Card, ACH and M-Pesa — auto-reconciled to units." },
        { t: "Unified inbox", d: "One real-time stream for every tenant conversation." },
        { t: "Operator analytics", d: "Yield, vacancy and arrears in interactive charts." },
      ]}
      notIncluded={["SSO & SCIM", "Custom reporting", "Dedicated CSM"]}
    />
  );
}

// Explicitly wrap using AppLayout with isGuest=true to bypass DashboardLayout
Operator.layout = (page: React.ReactNode) => <AppLayout isGuest>{page}</AppLayout>;