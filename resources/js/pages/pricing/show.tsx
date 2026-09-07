import { PlanPage } from "@/components/pricing/PlanPage";
import AppLayout from "@/layouts/app-layout";

interface PlanProps {
  plan: {
    name: string;
    tagline: string;
    price: string;
    unit: string;
    cta: string;
    featured: boolean;
    features: string[];
    includes: { t: string; d: string }[];
    not_included?: string[];
  };
}

export default function Show({ plan }: PlanProps) {
  return (
    <PlanPage
      featured={plan.featured}
      name={plan.name}
      tagline={plan.tagline}
      price={plan.price}
      unit={plan.unit}
      cta={plan.cta}
      features={plan.features}
      includes={plan.includes}
      notIncluded={plan.not_included}
    />
  );
}

Show.layout = (page: React.ReactNode) => <AppLayout isGuest>{page}</AppLayout>;