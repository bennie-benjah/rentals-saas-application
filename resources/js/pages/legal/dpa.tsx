import type { ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";
import LegalLayout from "@/layouts/legal-layout";


function Section({ h, children }: { h: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg font-medium mb-2">{h}</h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}

export default function Dpa() {
  return (
    <LegalLayout title="Data Processing" updated="July 29, 2026">
      <Section h="1. Roles">
        <p>
          For data landlords submit about their tenants and properties, the landlord acts as data
          controller and EstateOS acts as data processor, processing personal data only on the
          landlord's instructions to operate the Platform.
        </p>
      </Section>
      <Section h="2. Subject matter and duration">
        <p>
          Processing covers tenant contact details, lease and payment records, and identity
          verification documents, for the duration of the landlord's active subscription plus any
          legally required retention period.
        </p>
      </Section>
      <Section h="3. Sub-processors">
        <p>
          We use sub-processors for infrastructure hosting, payment processing (M-Pesa, card,
          PayPal), and email/SMS notification delivery. A current list of sub-processors is
          available on request.
        </p>
      </Section>
      <Section h="4. Security measures">
        <p>
          Personal data is encrypted in transit via HTTPS. Identity documents are stored in
          access-controlled storage with full audit logging of every access event. Passwords are
          hashed and never stored in plain text.
        </p>
      </Section>
      <Section h="5. Data subject requests">
        <p>
          Where a tenant or landlord exercises a data subject right directly with EstateOS, we
          will notify the relevant landlord (as controller) and assist in fulfilling the request
          as required by applicable law.
        </p>
      </Section>
    </LegalLayout>
  );
}
// Bypasses Inertia's default global layout (DashboardLayout)
Dpa.layout = (page: React.ReactNode) => <AppLayout isGuest>{page}</AppLayout>;