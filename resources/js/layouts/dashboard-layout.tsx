import type { ReactNode } from "react";
/**
 * Converted from TanStack Router route: dashboard.tsx
 *
 * TODO before this is production-ready:
 * - Original TanStack route path: "/dashboard"
 * - Converted <Outlet /> to {children} — add `children: ReactNode` to the component's props
 * - Layout: wire this up as an Inertia persistent layout, e.g. `Page.layout = (page) => <DashboardLayout>{page}</DashboardLayout>`
 */
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { PlanProvider } from "@/hooks/use-plan";
import { UpgradeDialog } from "@/components/dashboard/UpgradeDialog";
import { Toaster } from "@/components/ui/sonner";


function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <PlanProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Sidebar mobileOpen={open} onClose={() => setOpen(false)} />
        <main className="md:pl-64">
          <TopBar onMenuClick={() => setOpen(true)} />
          <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-10 animate-reveal">
            {children}
          </div>
        </main>
        <UpgradeDialog />
        <Toaster />
      </div>
    </PlanProvider>
  );
}

export default DashboardLayout;
