import type { ReactNode } from "react";
/**
 * Converted from TanStack Router route: dashboard.index.tsx
 *
 * TODO before this is production-ready:
 * - Original TanStack route path: "/dashboard/"
 */
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { MessagesPanel } from "@/components/dashboard/MessagesPanel";
import { PropertiesGrid } from "@/components/dashboard/PropertiesGrid";
import { MaintenanceBoard } from "@/components/dashboard/MaintenanceBoard";
import DashboardLayout from "@/layouts/dashboard-layout";


function Dashboard() {
  return (
    <div className="space-y-8 md:space-y-10">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-medium tracking-tight">
          Portfolio Overview
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tuesday, June 2 · 24 properties · 312 active tenants
        </p>
      </div>
      <KpiGrid />
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <RevenueChart />
        <MessagesPanel />
      </section>
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        <PropertiesGrid />
        <MaintenanceBoard />
      </section>
    </div>
  );
}

export default Dashboard;

Dashboard.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
