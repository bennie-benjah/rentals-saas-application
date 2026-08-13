import { Link } from "@inertiajs/react";
import { ArrowRight, Check, Building2 } from "lucide-react";

export function PlanPage({
  name,
  tagline,
  price,
  unit,
  cta,
  features,
  includes,
  notIncluded,
  featured,
}: {
  name: string;
  tagline: string;
  price: string;
  unit: string;
  cta: string;
  features: string[];
  includes: { t: string; d: string }[];
  notIncluded?: string[];
  featured?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 glass-panel border-b border-sidebar-border">
        <div className="max-w-6xl mx-auto h-16 px-5 md:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="size-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold tracking-tight">EstateOS</span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← All plans
          </Link>
        </div>
      </header>

      <section className="px-5 md:px-8 pt-16 md:pt-24 pb-12 max-w-6xl mx-auto animate-reveal">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          EstateOS · {name}
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-medium tracking-tight mt-3">{name}</h1>
        <p className="text-base md:text-lg text-muted-foreground mt-4 max-w-2xl">{tagline}</p>

        <div
          className={`mt-10 p-8 rounded-3xl ring-1 ${
            featured ? "bg-primary text-primary-foreground ring-primary" : "bg-surface ring-border"
          }`}
        >
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-6xl font-medium">{price}</span>
            <span className="text-sm opacity-70">{unit}</span>
          </div>
          <p className="text-sm opacity-80 mt-2">Billed monthly · No setup fees · Cancel anytime</p>
          <Link
            href="/dashboard"
            className={`mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-opacity ${
              featured
                ? "bg-primary-foreground text-primary hover:opacity-90"
                : "bg-foreground text-background hover:opacity-90"
            }`}
          >
            {cta} <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="px-5 md:px-8 py-12 max-w-6xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight">What's included</h2>
        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-3 p-4 bg-surface rounded-xl ring-1 ring-border"
            >
              <Check className="size-4 mt-0.5 text-success" />
              <span className="text-sm">{f}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 md:px-8 py-12 max-w-6xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight">
          Built around three pillars
        </h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {includes.map((i) => (
            <div key={i.t} className="p-6 bg-surface rounded-2xl ring-1 ring-border">
              <h3 className="font-display text-lg font-medium">{i.t}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{i.d}</p>
            </div>
          ))}
        </div>
      </section>

      {notIncluded && notIncluded.length > 0 && (
        <section className="px-5 md:px-8 py-12 max-w-6xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight">
            Not included on this plan
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Need any of these? Compare against the higher tiers.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {notIncluded.map((n) => (
              <li
                key={n}
                className="text-xs px-3 py-1.5 bg-muted rounded-full text-muted-foreground"
              >
                {n}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/pricing/starter"
              className="px-4 py-2 bg-surface ring-1 ring-border rounded-lg text-sm hover:ring-foreground/20"
            >
              Starter
            </Link>
            <Link
              href="/pricing/operator"
              className="px-4 py-2 bg-surface ring-1 ring-border rounded-lg text-sm hover:ring-foreground/20"
            >
              Operator
            </Link>
            <Link
              href="/pricing/portfolio"
              className="px-4 py-2 bg-surface ring-1 ring-border rounded-lg text-sm hover:ring-foreground/20"
            >
              Portfolio
            </Link>
          </div>
        </section>
      )}

      <footer className="border-t border-border px-5 md:px-8 py-10 max-w-6xl mx-auto text-sm text-muted-foreground">
        © 2026 EstateOS
      </footer>
    </div>
  );
}
