import type { ReactNode } from "react";
import { useState } from "react";
import { CompleteProfileBanner } from "@/components/CompleteProfileBanner";
import { SupportDrawer } from "@/components/dashboard/SupportDrawer";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { UpgradeDialog } from "@/components/dashboard/UpgradeDialog";
import { Toaster } from "@/components/ui/sonner";
import { PlanProvider } from "@/hooks/use-plan";

function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <PlanProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Sidebar mobileOpen={open} onClose={() => setOpen(false)} />
        <main className="md:pl-64">
          <CompleteProfileBanner />
          <TopBar onMenuClick={() => setOpen(true)} />
          <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-10 animate-reveal">
            {children}
          </div>
        </main>
        <UpgradeDialog />
        <Toaster />
        {/* Floating Support & AI Button */}
      <SupportDrawer />
      </div>
    </PlanProvider>
  );
}

export default DashboardLayout;
