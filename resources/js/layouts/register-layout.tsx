import type { ReactNode } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Building2, ArrowLeft } from "lucide-react";

function RegisterLayout({ children }: { children?: ReactNode }) {
  const { url } = usePage();
  const isHub = url === "/register" || url === "/register/";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="glass-panel border-b border-sidebar-border">
        <div className="max-w-6xl mx-auto h-16 px-5 md:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="size-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold tracking-tight">EstateOS</span>
          </Link>
          {!isHub && (
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" /> Change role
            </Link>
          )}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-16">
        {isHub ? <Hub /> : children}
      </main>
    </div>
  );
}

function Hub() {
  return (
    <div className="animate-reveal">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Create account
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight mt-3">
          How will you use EstateOS?
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-3">
          Pick the role that fits — we'll tailor the questions to what your account actually needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        <RoleCard
          to="/register/tenant"
          eyebrow="Renter"
          title="I'm a tenant"
          desc="Apply for an apartment, upload your ID, income and references, and sign your lease online."
          bullets={["Verify identity & income", "Apartment & lease selection", "Digital lease signing"]}
        />
        <RoleCard
          to="/register/landlord"
          eyebrow="Owner / Operator"
          title="I'm a landlord"
          desc="Onboard your properties, connect payouts (bank, M-Pesa, PayPal), and start collecting rent."
          bullets={["Owner & business profile", "Property & unit intake", "Payouts & verification"]}
          featured
        />
      </div>

      <p className="text-xs text-muted-foreground mt-8">
        Already have an account?{" "}
        <Link href="/dashboard" className="text-foreground font-medium hover:underline">
          Open the app
        </Link>
      </p>
    </div>
  );
}

function RoleCard({
  to,
  eyebrow,
  title,
  desc,
  bullets,
  featured,
}: {
  to: "/register/tenant" | "/register/landlord";
  eyebrow: string;
  title: string;
  desc: string;
  bullets: string[];
  featured?: boolean;
}) {
  return (
    <Link
      href={to}
      className={`group p-6 md:p-7 rounded-2xl ring-1 transition-all hover:-translate-y-0.5 ${
        featured
          ? "bg-primary text-primary-foreground ring-primary shadow-xl shadow-primary/10"
          : "bg-surface ring-border hover:ring-foreground/20"
      }`}
    >
      <p
        className={`text-[10px] font-semibold uppercase tracking-widest ${
          featured ? "opacity-80" : "text-muted-foreground"
        }`}
      >
        {eyebrow}
      </p>
      <h2 className="font-display text-2xl font-medium tracking-tight mt-2">{title}</h2>
      <p className={`text-sm mt-2 ${featured ? "opacity-90" : "text-muted-foreground"}`}>{desc}</p>
      <ul className="mt-5 space-y-1.5">
        {bullets.map((b) => (
          <li key={b} className={`text-xs flex items-center gap-2 ${featured ? "opacity-90" : ""}`}>
            <span className="size-1 rounded-full bg-current" /> {b}
          </li>
        ))}
      </ul>
      <span
        className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${
          featured ? "" : "text-foreground"
        }`}
      >
        Continue →
      </span>
    </Link>
  );
}

export default RegisterLayout;