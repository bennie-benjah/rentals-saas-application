import type { ReactNode } from "react";
import { Download, FileText, AlertCircle } from "lucide-react";
import TenantLayout from "@/layouts/tenant-layout";

interface DocumentItem {
  id: number;
  name: string;
  size: string;
  downloadUrl: string;
}

interface LeaseDetails {
  id: number;
  status: string;
  propertyName: string;
  unitName: string;
  startDate: string;
  endDate: string;
  monthlyRent: string;
  securityDeposit: string;
  documents: DocumentItem[];
}

interface LeaseProps {
  lease: LeaseDetails | null;
}

function Lease({ lease }: LeaseProps) {
  if (!lease) {
    return (
      <div className="p-8 text-center bg-surface rounded-2xl ring-1 ring-border space-y-3">
        <AlertCircle className="size-8 text-muted-foreground mx-auto" />
        <h2 className="font-display text-lg font-medium">No Active Lease Found</h2>
        <p className="text-sm text-muted-foreground">
          You currently do not have an active lease attached to your profile. Please contact your property manager.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-medium tracking-tight">Lease & documents</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {lease.propertyName} · {lease.unitName}
        </p>
      </header>

      <section className="p-6 bg-surface rounded-2xl ring-1 ring-border space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Current term
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-success/10 text-success">
            {lease.status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Start</p>
            <p className="font-display text-lg mt-1">{lease.startDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">End</p>
            <p className="font-display text-lg mt-1">{lease.endDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Monthly rent</p>
            <p className="font-display text-lg mt-1">{lease.monthlyRent}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Security deposit</p>
            <p className="font-display text-lg mt-1">{lease.securityDeposit}</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Documents
        </h2>
        {lease.documents && lease.documents.length > 0 ? (
          lease.documents.map((d) => (
            <a
              key={d.id}
              href={d.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-surface rounded-2xl ring-1 ring-border hover:ring-foreground/15 transition-all"
            >
              <div className="size-10 rounded-xl bg-muted flex items-center justify-center">
                <FileText className="size-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.size}</p>
              </div>
              <Download className="size-4 text-muted-foreground" />
            </a>
          ))
        ) : (
          <p className="p-4 text-xs text-muted-foreground bg-surface rounded-2xl ring-1 ring-border">
            No lease documents available for download.
          </p>
        )}
      </section>
    </div>
  );
}

export default Lease;

Lease.layout = (page: ReactNode) => <TenantLayout>{page}</TenantLayout>;