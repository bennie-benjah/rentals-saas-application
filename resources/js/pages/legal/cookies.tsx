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

export default function Cookies() {
  return (
    <LegalLayout title="Cookie Notice" updated="July 29, 2026">
      <Section h="1. What cookies we use">
        <p>
          EstateOS uses a session cookie to keep you signed in and a CSRF token cookie to protect
          your account from cross-site request forgery. Both are required for the Platform to
          function and cannot be disabled while remaining logged in.
        </p>
      </Section>
      <Section h="2. No third-party advertising cookies">
        <p>
          We do not use advertising or cross-site tracking cookies. Any analytics we use are
          limited to understanding aggregate Platform usage and do not identify individual
          tenants or landlords to third parties.
        </p>
      </Section>
      <Section h="3. Managing cookies">
        <p>
          Most browsers let you block or delete cookies through their settings. Blocking
          essential session cookies will prevent you from staying logged in to the Platform.
        </p>
      </Section>
    </LegalLayout>
  );
}
// Bypasses Inertia's default global layout (DashboardLayout)
Cookies.layout = (page: React.ReactNode) => <AppLayout isGuest>{page}</AppLayout>;