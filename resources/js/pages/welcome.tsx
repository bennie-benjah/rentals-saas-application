/**
 * Converted from TanStack Router route: index.tsx (was "/")
 */
import { Link, usePage } from "@inertiajs/react";
import {
  ArrowRight,
  Building2,
  LayoutDashboard,
  MessageSquare,
  Shield,
  Sparkles,
  Wrench,
  Wallet,
  Check,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
interface PlanProp {
  id: string;
  href: string;
  name: string;
  price: string;
  unit: string;
  cta?: string;
  featured?: boolean;
  features: string[];
}
export default function Welcome({ plans }: { plans: PlanProp[] }) {
  const { dark, toggle } = useTheme();
  const { auth } = usePage<{ auth: { user: any | null } }>().props;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 glass-panel border-b border-sidebar-border">
        <div className="max-w-6xl mx-auto h-16 px-5 md:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="size-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold tracking-tight">EstateOS</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <Link href="/tenant" className="hover:text-foreground transition-colors">Tenant portal</Link>
          </nav>
          <div className="flex items-center gap-2">
      {/* Theme Toggle */}
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="size-8 flex items-center justify-center rounded-lg hover:bg-foreground/5 transition-colors"
      >
        {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </button>

      {/* Conditional Auth Links */}
      {auth.user ? (
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <LayoutDashboard className="size-3.5" /> Dashboard
        </Link>
      ) : (
        <>
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get started <ArrowRight className="size-3.5" />
          </Link>
        </>
      )}
    </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 md:px-8 pt-16 md:pt-28 pb-20 max-w-6xl mx-auto animate-reveal">
        <div className="flex flex-col items-start md:items-center md:text-center gap-7 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground bg-surface ring-1 ring-border px-3 py-1.5 rounded-full">
            <Sparkles className="size-3" /> New · Maintenance kanban 2.0
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.05]">
            The calm operating system <br className="hidden md:block" />
            for modern rentals.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl">
            Run hundreds of units with clarity. Real-time occupancy, financials, maintenance and tenant
            communication — designed for operators who care about the details.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/register/landlord"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              List your property <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register/tenant"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface ring-1 ring-border rounded-xl text-sm font-semibold hover:ring-foreground/20 transition-all"
            >
              I'm renting an apartment
            </Link>
          </div>
        </div>

        {/* Visual */}
        <div className="mt-16 md:mt-24 relative">
          <div className="rounded-3xl ring-1 ring-border bg-surface p-3 shadow-2xl shadow-foreground/5">
            <div className="rounded-2xl bg-gradient-to-br from-surface-muted to-background p-6 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {[
                { label: "Occupancy", value: "94.2%" },
                { label: "Revenue", value: "$124.8k" },
                { label: "Tenants", value: "312" },
                { label: "Open tickets", value: "18" },
              ].map((k) => (
                <div key={k.label} className="bg-surface rounded-xl ring-1 ring-border p-4">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k.label}</p>
                  <p className="font-display text-xl md:text-3xl font-medium mt-1.5">{k.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-5 md:px-8 py-20 max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Built for operators</p>
          <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight mt-3">
            Everything to run a portfolio — nothing you don't need.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: LayoutDashboard, t: "Live dashboard", d: "Occupancy, revenue and ticket volume in one calm overview." },
            { icon: Building2, t: "Property graph", d: "From unit-level yield to portfolio rollups, instantly." },
            { icon: Wrench, t: "Maintenance kanban", d: "Drag tickets across states with photos and assignments." },
            { icon: MessageSquare, t: "Unified inbox", d: "One stream for landlord–tenant messages, with read state." },
            { icon: Wallet, t: "Rent & M-Pesa", d: "Tenants pay by card, ACH or M-Pesa — reconciled automatically." },
            { icon: Shield, t: "Role-aware", d: "Operator and tenant surfaces, both responsive and themable." },
          ].map((f) => (
            <div
              key={f.t}
              className="p-6 bg-surface rounded-2xl ring-1 ring-border hover:-translate-y-0.5 hover:ring-foreground/15 transition-all"
            >
              <div className="size-9 rounded-lg bg-muted flex items-center justify-center mb-4">
                <f.icon className="size-4" />
              </div>
              <h3 className="font-display text-lg font-medium">{f.t}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-5 md:px-8 py-20 max-w-6xl mx-auto">
      <div className="max-w-2xl mb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Pricing
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight mt-3">
          Simple, per-unit pricing.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((p) => (
          <div
            key={p.id || p.name}
            className={`p-6 rounded-2xl ring-1 transition-all ${
              p.featured
                ? "bg-primary text-primary-foreground ring-primary"
                : "bg-surface ring-border"
            }`}
          >
            <h3 className="font-display text-xl font-medium">{p.name}</h3>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-4xl font-medium">{p.price}</span>
              <span className="text-sm opacity-70">{p.unit}</span>
            </div>

            <ul className="mt-6 space-y-2.5">
              {p.features.map((f, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 opacity-70 shrink-0" /> {f}
                </li>
              ))}
            </ul>

            <Link
              href={p.href}
              className={`mt-7 inline-flex w-full items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity ${
                p.featured
                  ? "bg-primary-foreground text-primary hover:opacity-90"
                  : "bg-foreground text-background hover:opacity-90"
              }`}
            >
              {p.cta || "View plan"}
            </Link>
          </div>
        ))}
      </div>
    </section>
      {/* Footer */}
      <footer className="border-t border-border px-5 md:px-8 py-10 max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <div className="size-6 rounded-md bg-primary flex items-center justify-center">
            <Building2 className="size-3 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-foreground">EstateOS</span>
          <span>· © 2026</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <Link href="/tenant" className="hover:text-foreground">Tenant</Link>
          <a href="#features" className="hover:text-foreground">Features</a>
        </div>
      </footer>
      <div className="max-w-6xl mx-auto px-5 md:px-8 pb-10 -mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <Link href="/legal/terms" className="hover:text-foreground">Terms & Conditions</Link>
        <Link href="/legal/privacy" className="hover:text-foreground">Privacy Notice</Link>
        <Link href="/legal/cookies" className="hover:text-foreground">Cookie Notice</Link>
        <Link href="/legal/dpa" className="hover:text-foreground">Data Processing</Link>
        <Link href="/legal/security" className="hover:text-foreground">Security</Link>
      </div>
    </div>
  );
}

