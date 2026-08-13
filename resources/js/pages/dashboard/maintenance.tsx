// dashboard/maintenance.tsx
import type { ReactNode } from "react";
import { MaintenanceBoard, type Ticket } from "@/components/dashboard/MaintenanceBoard";
import DashboardLayout from "@/layouts/dashboard-layout";

interface MaintenancePageProps {
  requests?: Ticket[];
}

function MaintenancePage({ requests = [] }: MaintenancePageProps) {
  // Ensure array check so .filter never runs on undefined
  const safeRequests = Array.isArray(requests) ? requests : [];
  const openCount = safeRequests.filter((r) => r.status !== "done").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-medium tracking-tight">
          Maintenance
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Drag tickets across stages · {openCount} open
        </p>
      </div>
      <MaintenanceBoard tickets={safeRequests} />
    </div>
  );
}

export default MaintenancePage;

MaintenancePage.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;