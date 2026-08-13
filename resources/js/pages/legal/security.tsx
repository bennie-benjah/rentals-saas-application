import { ShieldCheck, Lock, FileCheck, Eye } from "lucide-react";
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

export default function Security() {
  return (
    <LegalLayout title="Security" updated="July 29, 2026">
      <div className="grid grid-cols-2 gap-3 mb-8">
        {[
          { icon: Lock, t: "Encrypted in transit", d: "HTTPS enforced platform-wide." },
          { icon: FileCheck, t: "Access-controlled documents", d: "ID uploads are private by default." },
          { icon: Eye, t: "Full audit logging", d: "Every document view is recorded." },
          { icon: ShieldCheck, t: "Role-based access", d: "Tenants only see their own unit." },
        ].map((f) => (
          <div key={f.t} className="p-4 bg-surface rounded-xl ring-1 ring-border">
            <f.icon className="size-4 mb-2 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">{f.t}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{f.d}</p>
          </div>
        ))}
      </div>

      <Section h="1. Authentication">
        <p>
          Accounts are protected by hashed passwords and support two-factor authentication and
          passkeys for landlord and admin accounts.
        </p>
      </Section>
      <Section h="2. Data isolation">
        <p>
          Each landlord's properties, tenants, and financial data are scoped so they are never
          visible to another landlord's account. Tenants can only ever see their own unit, lease,
          and payment history.
        </p>
      </Section>
      <Section h="3. Identity document security">
        <p>
          ID and proof-of-income uploads are stored outside the public web root. Every view,
          download, and review decision on a document is written to an immutable access log
          capturing the acting user, role, timestamp, and IP address.
        </p>
      </Section>
      <Section h="4. Reporting a vulnerability">
        <p>
          If you believe you've found a security vulnerability, please report it to
          security@estateos.example rather than disclosing it publicly. We aim to acknowledge
          reports within 2 business days.
        </p>
      </Section>
    </LegalLayout>
  );
}
Security.layout = (page: React.ReactNode) => <AppLayout isGuest>{page}</AppLayout>;