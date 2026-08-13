import type { ReactNode } from "react";
import { Link } from "@inertiajs/react";
import { Building2, Wallet, MessageSquare, Wrench } from "lucide-react";

/**
 * Replaces the starter kit's default auth-layout.tsx.
 * Split layout: branding/feature panel on the left, form on the right,
 * with a slim header and footer so auth pages match the rest of the site
 * instead of floating alone with no chrome.
 * Keeps the same title/description/children props your login, register,
 * forgot-password, etc. pages already call this with.
 */
export default function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-sidebar-border">
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

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
        {/* Left: branding panel */}
        <div className="hidden md:flex flex-col justify-between bg-surface-muted p-10 lg:p-14 border-r border-sidebar-border">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              EstateOS
            </p>
            <h2 className="font-display text-3xl font-medium tracking-tight mt-3 max-w-sm">
              The calm operating system for modern rentals.
            </h2>
          </div>

          <div className="space-y-5">
            {[
              { icon: Wallet, t: "Rent & M-Pesa", d: "Card, ACH and M-Pesa, reconciled automatically." },
              { icon: Wrench, t: "Maintenance kanban", d: "Track every request from submission to resolved." },
              { icon: MessageSquare, t: "Unified inbox", d: "One real-time stream for every tenant conversation." },
            ].map((f) => (
              <div key={f.t} className="flex items-start gap-3">
                <div className="size-9 rounded-lg bg-surface ring-1 ring-border flex items-center justify-center shrink-0">
                  <f.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{f.t}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.d}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">© 2026 EstateOS</p>
        </div>

        {/* Right: form panel */}
        <div className="flex items-center justify-center px-5 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-6">
              <h1 className="font-display text-xl font-medium tracking-tight">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground mt-1.5">{description}</p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>

      <footer className="border-t border-sidebar-border px-5 md:px-8 py-6 text-xs text-muted-foreground flex flex-wrap gap-x-5 gap-y-2 justify-center md:justify-start max-w-6xl mx-auto w-full">
        <Link href="/legal/terms" className="hover:text-foreground">Terms & Conditions</Link>
        <Link href="/legal/privacy" className="hover:text-foreground">Privacy Notice</Link>
        <Link href="/legal/security" className="hover:text-foreground">Security</Link>
      </footer>
    </div>
  );
}
