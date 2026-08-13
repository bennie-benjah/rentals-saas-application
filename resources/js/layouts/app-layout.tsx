
import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import type { BreadcrumbItem } from "@/types";

interface AppLayoutProps {
  breadcrumbs?: BreadcrumbItem[];
  children: ReactNode;
  /**
   * Set `isGuest` to true for public pricing, landing, login, and registration pages
   * so they render full-width without the Dashboard sidebar or `md:pl-64` offset.
   */
  isGuest?: boolean;
}

export default function AppLayout({
  breadcrumbs = [],
  children,
  isGuest = false,
}: AppLayoutProps) {
  // Guest / Public Layout (Pricing, Auth, Landlord Onboarding)
  if (isGuest) {
    return (
      <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
        {children}
      </div>
    );
  }

  // Dashboard / Authenticated Layout
  return (
    <DashboardLayout>
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          {breadcrumbs.map((item, i) => (
            <span key={item.href ?? item.title} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3.5" />}
              {item.href && i < breadcrumbs.length - 1 ? (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.title}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.title}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      {children}
    </DashboardLayout>
  );
}
