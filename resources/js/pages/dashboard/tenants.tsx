import { ReactNode, useState } from "react";
import { Plus, Search } from "lucide-react";
import { UsageMeter } from "@/components/dashboard/UsageMeter";
import DashboardLayout from "@/layouts/dashboard-layout";
import { InviteTenantModal } from "@/components/dashboard/InviteTenantModal";

interface LeaseItem {
  id: number;
  rent_amount: number;
  start_date: string;
  end_date: string;
  status: "active" | "pending" | "ended" | "terminated" | string;
  tenant?: {
    id: number;
    name: string;
    email: string;
  };
  unit?: {
    id: number;
    name?: string;
    unit_number?: string;
    property?: {
      id: number;
      name: string;
    };
  };
}

interface TenantsPageProps {
  leases: LeaseItem[];
}

const toneCls: Record<string, string> = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  ended: "bg-muted text-muted-foreground",
  terminated: "bg-destructive/10 text-destructive",
};

function Tenants({ leases = [] }: TenantsPageProps) {
  const [search, setSearch] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Compute stats dynamically from the leases array
  const activeCount = leases.filter((l) => l.status === "active").length;
  const pendingCount = leases.filter((l) => l.status === "pending").length;

  // Filter leases by tenant name, email, or property name
  const filteredLeases = leases.filter((l) => {
    const tenantName = l.tenant?.name?.toLowerCase() || "";
    const tenantEmail = l.tenant?.email?.toLowerCase() || "";
    const propName = l.unit?.property?.name?.toLowerCase() || "";
    const searchLower = search.toLowerCase();

    return (
      tenantName.includes(searchLower) ||
      tenantEmail.includes(searchLower) ||
      propName.includes(searchLower)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-medium tracking-tight">
            Tenants
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {activeCount} active · {pendingCount} pending move-in
          </p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="size-4" /> Add Lease / Tenant
        </button>
      </div>

      <UsageMeter resource="tenants" label="Tenants" />

      {/* Search Input */}
      <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg ring-1 ring-border">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tenants or properties…"
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      {/* Tenants/Leases Table */}
      <div className="bg-surface ring-1 ring-border rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-12 px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border">
          <div className="col-span-4">Tenant</div>
          <div className="col-span-4">Property / Unit</div>
          <div className="col-span-2">Rent</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {filteredLeases.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No active tenant leases found.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filteredLeases.map((l) => {
              const tenantName = l.tenant?.name || "Unassigned Tenant";
              const propName = l.unit?.property?.name || "Unknown Property";
              const unitLabel = l.unit?.unit_number || l.unit?.name || "";
              const formattedRent = l.rent_amount
                ? `$${Number(l.rent_amount).toLocaleString()}`
                : "N/A";

              return (
                <li
                  key={l.id}
                  className="px-5 py-4 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-0 items-center hover:bg-foreground/[0.02] transition-colors"
                >
                  {/* Tenant Column */}
                  <div className="md:col-span-4 flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gradient-to-br from-foreground/20 to-foreground/5 flex items-center justify-center font-medium text-xs">
                      {tenantName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tenantName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {l.tenant?.email || "No email"}
                      </p>
                    </div>
                  </div>

                  {/* Property / Unit Column */}
                  <div className="md:col-span-4 text-sm text-muted-foreground">
                    {propName} {unitLabel ? `· ${unitLabel}` : ""}
                  </div>

                  {/* Rent Amount */}
                  <div className="md:col-span-2 font-mono text-sm">
                    {formattedRent}
                  </div>

                  {/* Status Badge */}
                  <div className="md:col-span-2 md:text-right">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        toneCls[l.status] ?? "bg-muted text-muted-foreground"
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Modal */}
      <InviteTenantModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
}

export default Tenants;

Tenants.layout = (page: ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);