import type { ReactNode } from "react";

import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { RevenueChart, type RevenueChartItem } from "@/components/dashboard/RevenueChart";
import { MessagesPanel, type MessageItem } from "@/components/dashboard/MessagesPanel";
import { PropertiesGrid, type PropertyItem } from "@/components/dashboard/PropertiesGrid";
import { MaintenanceBoard, type Ticket, type Unit } from "@/components/dashboard/MaintenanceBoard";
import DashboardLayout from "@/layouts/dashboard-layout";

export interface KpiStats {
  occupancyRate: string;
  monthlyRevenue: string;
  activeTenants: string;
  openTickets: string;
}

interface DashboardProps {
  propertiesCount: number;
  activeTenantsCount: number;
  stats?: KpiStats;
  chartData: RevenueChartItem[];
  recentMessages: MessageItem[];
  properties: PropertyItem[];
  tickets: Ticket[];
  units: Unit[];
}

function Dashboard({
  propertiesCount = 0,
  activeTenantsCount = 0,
  stats,
  chartData = [],
  recentMessages = [],
  properties = [],
  tickets = [],
  units = [],
}: DashboardProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 md:space-y-10">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-medium tracking-tight">
          Portfolio Overview
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {currentDate} · {propertiesCount} properties · {activeTenantsCount} active tenants
        </p>
      </div>

      <KpiGrid stats={stats} />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <RevenueChart chartData={chartData} />
        <MessagesPanel recentMessages={recentMessages} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        <PropertiesGrid properties={properties} />
        <MaintenanceBoard tickets={tickets} units={units} />
      </section>
    </div>
  );
}

export default Dashboard;

Dashboard.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;