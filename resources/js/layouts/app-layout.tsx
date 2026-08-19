import type { ReactNode } from "react";
import { Link, usePage } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";
import TenantLayout from "@/layouts/tenant-layout";
import type { BreadcrumbItem } from "@/types";

export default function AppLayout({
  breadcrumbs = [],
  children,
  isGuest = false,
}: {
  breadcrumbs?: BreadcrumbItem[];
  children: ReactNode;
  isGuest?: boolean;
}) {
  const { props } = usePage<{
    auth?: { user?: { account_type?: string; roles?: (string | { name: string })[] } };
  }>();

  // If page is flagged as guest/public, bypass dashboard shells
  if (isGuest) {
    return (
      <main className="min-h-screen w-full bg-background text-foreground">
        {children}
      </main>
    );
  }

  const user = props.auth?.user;
  const roleNames = (user?.roles ?? []).map((r) => (typeof r === "string" ? r : r.name));
  const isTenant = roleNames.includes("tenant") || user?.account_type === "tenant";

  const Shell = isTenant ? TenantLayout : DashboardLayout;

  return (
    <Shell>
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
    </Shell>
  );
}