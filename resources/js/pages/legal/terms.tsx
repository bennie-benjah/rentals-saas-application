import type { ReactNode } from "react";
import AppLayout from "@/layouts/app-layout"; // adjust import path if needed
import LegalLayout from "@/layouts/legal-layout";

function Section({ h, children }: { h: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg font-medium mb-2">{h}</h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}

export default function Terms() {
  return (
    <LegalLayout title="Terms & Conditions" updated="July 29, 2026">
      <Section h="1. Acceptance of terms">
        <p>
          By creating an account or using EstateOS ("the Platform"), you agree to be bound by
          these Terms & Conditions. If you are using the Platform on behalf of a landlord,
          property management company, or other organization, you represent that you have
          authority to bind that organization to these terms.
        </p>
      </Section>
      <Section h="2. Accounts">
        <p>
          Landlords and tenants must provide accurate registration information. You are
          responsible for maintaining the confidentiality of your login credentials and for all
          activity under your account.
        </p>
      </Section>
      <Section h="3. Landlord responsibilities">
        <p>
          Landlords are solely responsible for the accuracy of property listings, lease terms,
          and rent amounts entered into the Platform, and for complying with applicable landlord–
          tenant law in their jurisdiction.
        </p>
      </Section>
      <Section h="4. Tenant responsibilities">
        <p>
          Tenants are responsible for the accuracy of information submitted during registration
          and for timely rent payment through the Platform's supported payment methods.
        </p>
      </Section>
      <Section h="5. Payments">
        <p>
          Rent and fee payments processed through the Platform are subject to the terms of our
          third-party payment processors. EstateOS is not a bank and does not hold tenant funds
          outside of processing transactions.
        </p>
      </Section>
      <Section h="6. Termination">
        <p>
          We may suspend or terminate accounts that violate these terms, engage in fraudulent
          activity, or misuse the Platform. Landlords and tenants may close their accounts at any
          time, subject to any outstanding lease or payment obligations.
        </p>
      </Section>
      <Section h="7. Limitation of liability">
        <p>
          EstateOS provides software tools to facilitate rental management and is not a party to
          any lease agreement between landlords and tenants. We are not liable for disputes
          arising from lease terms, property condition, or payment disputes between landlords and
          tenants.
        </p>
      </Section>
      <Section h="8. Changes to these terms">
        <p>
          We may update these terms from time to time. Continued use of the Platform after
          changes take effect constitutes acceptance of the revised terms.
        </p>
      </Section>
    </LegalLayout>
  );
}

// Bypasses the default DashboardLayout and renders as a full-width guest page
Terms.layout = (page: React.ReactNode) => <AppLayout isGuest>{page}</AppLayout>;