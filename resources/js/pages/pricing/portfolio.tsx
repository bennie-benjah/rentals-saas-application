import { PlanPage } from "@/components/pricing/PlanPage";
import AppLayout from "@/layouts/app-layout";

export default function Portfolio() {
  return (
    <PlanPage
      name="Portfolio"
      tagline="For institutional operators running thousands of units across regions."
      price="Custom"
      unit=""
      cta="Talk to sales"
      features={[
        "Everything in Operator",
        "SSO (SAML, OIDC) & SCIM provisioning",
        "Custom reporting & data warehouse sync",
        "Dedicated Customer Success Manager",
        "99.95% SLA & private support channel",
        "Onboarding & migration assistance",
      ]}
      includes={[
        { t: "Enterprise identity", d: "SAML, OIDC and SCIM — provision teams in seconds." },
        { t: "Data you own", d: "Warehouse sync to BigQuery, Snowflake or Redshift." },
        { t: "White-glove onboarding", d: "A dedicated CSM migrates your data and trains your team." },
      ]}
    />
  );
}
// Explicitly wrap using AppLayout with isGuest=true to bypass DashboardLayout
Portfolio.layout = (page: React.ReactNode) => <AppLayout isGuest>{page}</AppLayout>;