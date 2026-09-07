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

interface PortfolioProps {
  plan?: PlanData;
  currentPlan?: string | null;
}

export default function Portfolio({ plan, currentPlan }: PortfolioProps) {
  return (
    <PlanPage
      name={plan?.name ?? "Portfolio"}
      tagline={
        plan?.tagline ??
        "For institutional operators running thousands of units across regions."
      }
      price={plan?.price ?? "Custom"}
      unit={plan?.unit ?? ""}
      cta={plan?.cta ?? "Talk to sales"}
      features={
        plan?.features ?? [
          "Everything in Operator",
          "SSO (SAML, OIDC) & SCIM provisioning",
          "Custom reporting & data warehouse sync",
          "Dedicated Customer Success Manager",
          "99.95% SLA & private support channel",
          "Onboarding & migration assistance",
        ]
      }
      includes={
        plan?.includes ?? [
          {
            t: "Enterprise identity",
            d: "SAML, OIDC and SCIM — provision teams in seconds.",
          },
          {
            t: "Data you own",
            d: "Warehouse sync to BigQuery, Snowflake or Redshift.",
          },
          {
            t: "White-glove onboarding",
            d: "A dedicated CSM migrates your data and trains your team.",
          },
        ]
      }
      notIncluded={plan?.not_included ?? []}
      currentPlan={currentPlan}
    />
  );
}

// Explicitly wrap using AppLayout with isGuest=true to bypass DashboardLayout
Portfolio.layout = (page: React.ReactNode) => (
  <AppLayout isGuest>{page}</AppLayout>
);
