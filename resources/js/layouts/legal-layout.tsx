
import { Link } from "@inertiajs/react";
import { Building2 } from "lucide-react";
import type { ReactNode } from "react";

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Terms & Conditions" },
  { href: "/legal/privacy", label: "Privacy Notice" },
  { href: "/legal/cookies", label: "Cookie Notice" },
  { href: "/legal/dpa", label: "Data Processing" },
  { href: "/legal/security", label: "Security" },
];

export default function LegalLayout({
  children,
  title,
  updated,
}: {
  children: ReactNode;
  title: string;
  updated: string;
}) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-sidebar-border w-full">
        <div className="max-w-6xl mx-auto h-16 px-5 md:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="size-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold tracking-tight">EstateOS</span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back home
          </Link>
        </div>
      </header>

      {/* Main Content Grid - Matches Landing Page Container */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-20 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10">
        <nav className="flex md:flex-col gap-2 flex-wrap md:sticky md:top-24 self-start">
          {LEGAL_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                l.label === title
                  ? "bg-surface ring-1 ring-border text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <article className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Legal
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight mt-2">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Last updated {updated}</p>

          <div className="prose-legal mt-10 space-y-8 text-sm leading-relaxed text-foreground/90">
            {children}
          </div>
        </article>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-5 md:px-8 py-10 max-w-6xl mx-auto text-xs text-muted-foreground">
        © 2026 EstateOS. This is placeholder legal content — replace with copy reviewed by counsel before launch.
      </footer>
    </div>
  );
}