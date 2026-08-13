
import { Link } from "@inertiajs/react";

import { ArrowUpRight, Wrench, MessageSquare } from "lucide-react";
import type { ReactNode } from "react";
import TenantLayout from "@/layouts/tenant-layout";

// Define TypeScript interfaces matching what TenantController returns
interface TenantInfo {
  name: string;
  email: string;
  phone?: string;
}

interface LeaseInfo {
  id: number;
  propertyName: string;
  unitName: string;
  rent: string;
  tenure: string;
  startDate?: string;
  endDate?: string;
}

interface PaymentInfo {
  id: number;
  amount: string;
  dueDate: string;
  daysRemaining: string;
}

interface MaintenanceItem {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

interface TenantDashboardProps {
  tenant: TenantInfo;
  lease?: LeaseInfo | null;
  nextPayment?: PaymentInfo | null;
  maintenanceRequests?: MaintenanceItem[];
  openMaintenanceCount?: number;
}

function TenantHome({
  tenant,
  lease,
  nextPayment,
  maintenanceRequests = [],
  openMaintenanceCount = 0,
}: TenantDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Header with Dynamic Name and Lease */}
      <header>
        <p className="text-sm text-muted-foreground">Good evening,</p>
        <h1 className="font-display text-3xl font-medium tracking-tight mt-1">
          {tenant?.name || "Tenant"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {lease
            ? `${lease.propertyName} · ${lease.unitName} · ${lease.tenure}`
            : "No active lease attached"}
        </p>
      </header>

      {/* Rent due card */}
      <section className="p-6 bg-primary text-primary-foreground rounded-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest opacity-60">
              Next payment
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-4xl font-medium tracking-tight">
                {nextPayment ? nextPayment.amount : "$0.00"}
              </span>
              <span className="text-xs opacity-70">
                {nextPayment ? nextPayment.dueDate : "No upcoming payments"}
              </span>
            </div>
          </div>
          {nextPayment && (
            <span className="text-[10px] font-mono uppercase opacity-60 bg-white/10 px-2 py-1 rounded-full">
              {nextPayment.daysRemaining}
            </span>
          )}
        </div>
        <Link
          href="/tenant/pay"
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary-foreground text-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Pay rent now <ArrowUpRight className="size-4" />
        </Link>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-2 gap-4">
        {[
          {
            to: "/tenant/maintenance",
            icon: Wrench,
            label: "Report issue",
            sub: `${openMaintenanceCount} open`,
          },
          {
            to: "/tenant/messages",
            icon: MessageSquare,
            label: "Messages",
            sub: "Direct line",
          },
        ].map((q) => (
          <Link
            key={q.to}
            href={q.to}
            className="p-4 bg-surface rounded-2xl ring-1 ring-border hover:-translate-y-0.5 hover:ring-foreground/15 transition-all duration-200"
          >
            <q.icon className="size-5 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">{q.label}</p>
            <p className="text-xs text-muted-foreground">{q.sub}</p>
          </Link>
        ))}
      </section>

      {/* Dynamic Maintenance Activity List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-medium">Recent maintenance</h2>
          <span className="text-xs text-muted-foreground">Latest requests</span>
        </div>
        <div className="bg-surface rounded-2xl ring-1 ring-border divide-y divide-border">
          {maintenanceRequests.length > 0 ? (
            maintenanceRequests.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4">
                <div className="size-9 rounded-full flex items-center justify-center shrink-0 bg-warning/10 text-warning">
                  <Wrench className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.status} · {item.created_at}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-xs text-muted-foreground">No recent requests.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default TenantHome;

TenantHome.layout = (page: ReactNode) => <TenantLayout>{page}</TenantLayout>;