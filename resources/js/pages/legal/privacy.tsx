
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

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Notice" updated="July 29, 2026">
      <Section h="1. What we collect">
        <p>
          We collect information you provide directly — name, email, phone number, property and
          unit details, and identity/verification documents uploaded during registration — as
          well as information generated through your use of the Platform, such as payment history
          and maintenance requests.
        </p>
      </Section>
      <Section h="2. Identity documents">
        <p>
          ID and proof-of-income documents uploaded for verification are stored in a private,
          access-controlled location. Access is limited to the document owner and platform
          reviewers with an admin or reviewer role, and every view, download, or review action is
          logged with the acting user, timestamp, and IP address.
        </p>
      </Section>
      <Section h="3. How we use your information">
        <p>
          We use collected information to operate the Platform: matching tenants to units,
          processing rent payments, routing maintenance requests, verifying identity, and
          communicating service-related notices.
        </p>
      </Section>
      <Section h="4. Sharing">
        <p>
          Landlords can see information about tenants registered to their own units. Tenants
          cannot see other tenants' information. We do not sell personal data to third parties.
          Payment processors (M-Pesa, card, PayPal) receive only the information necessary to
          process a transaction.
        </p>
      </Section>
      <Section h="5. Data retention">
        <p>
          We retain account and lease records for as long as an account is active and for a
          reasonable period afterward to meet legal, accounting, and dispute-resolution
          obligations.
        </p>
      </Section>
      <Section h="6. Your rights">
        <p>
          Depending on your jurisdiction, you may have the right to access, correct, or request
          deletion of your personal data. Contact support to exercise these rights.
        </p>
      </Section>
      <Section h="7. Kenya Data Protection Act, 2019">
        <p>
          For users in Kenya, personal data is processed in a manner consistent with the Data
          Protection Act, 2019, including principles of lawfulness, purpose limitation, and data
          minimization.
        </p>
      </Section>
    </LegalLayout>
  );
}

// Bypasses Inertia's default global layout (DashboardLayout)
Privacy.layout = (page: React.ReactNode) => <AppLayout isGuest>{page}</AppLayout>;