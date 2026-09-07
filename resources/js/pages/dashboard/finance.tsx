import type { ReactNode } from "react";
import { useState, FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import { RevenueChart, RevenueChartItem } from "@/components/dashboard/RevenueChart";
import { ArrowDownRight, ArrowUpRight, Plus, Send, X } from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";

interface StatsProps {
  collectedMtd: string;
  outstanding: string;
  operatingExp: string;
  netIncome: string;
}

interface LedgerItem {
  id: number;
  date: string;
  desc: string;
  amount: string;
  paid: string;
  status: string;
  tone: "in" | "out";
}

interface LeaseOption {
  id: number;
  tenantName: string;
  unitName: string;
}

interface FinanceProps {
  stats?: StatsProps;
  revenueChart?: RevenueChartItem[];
  ledger?: LedgerItem[];
  leases?: LeaseOption[];
}

function Finance({ stats, revenueChart = [], ledger = [], leases = [] }: FinanceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    lease_id: "",
    amount: "",
    due_date: "",
    details: "",
  });

  const handleSendInvoice = (e: FormEvent) => {
    e.preventDefault();
    post("/dashboard/invoices", {
      onSuccess: () => {
        reset();
        setIsModalOpen(false);
      },
    });
  };

  const statItems = [
    { label: "Collected (MTD)", value: stats?.collectedMtd ?? "$0.00", delta: "+0.0%", up: true },
    { label: "Outstanding", value: stats?.outstanding ?? "$0.00", delta: "0%", up: false },
    { label: "Operating exp.", value: stats?.operatingExp ?? "$0.00", delta: "0%", up: false },
    { label: "Net income", value: stats?.netIncome ?? "$0.00", delta: "+0.0%", up: true },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-medium tracking-tight">Finance</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time revenue and expense tracking</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="size-4" /> Send Invoice
        </button>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statItems.map((s) => (
          <div key={s.label} className="p-5 bg-surface rounded-2xl ring-1 ring-border">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
            <p className="font-display text-2xl md:text-3xl font-medium mt-2">{s.value}</p>
            <p className={`text-xs mt-2 flex items-center gap-1 ${s.up ? "text-success" : "text-warning"}`}>
              {s.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />} {s.delta}
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart chartData={revenueChart} />
        <div className="p-6 bg-surface rounded-2xl ring-1 ring-border">
          <h2 className="font-display font-medium text-lg">Distribution</h2>
          <ul className="mt-5 space-y-4">
            {[
              { l: "Residential", v: 100, c: "bg-foreground" },
              { l: "Commercial", v: 0, c: "bg-warning" },
              { l: "Short-term", v: 0, c: "bg-success" },
            ].map((d) => (
              <li key={d.l}>
                <div className="flex items-baseline justify-between text-sm">
                  <span>{d.l}</span>
                  <span className="font-mono text-xs">{d.v}%</span>
                </div>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${d.c}`} style={{ width: `${d.v}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-surface ring-1 ring-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex justify-between items-center">
          <h2 className="font-display font-medium text-lg">Recent ledger</h2>
          <span className="text-xs text-muted-foreground">Database Invoices</span>
        </div>
        <ul className="divide-y divide-border">
          {ledger.length === 0 ? (
            <li className="px-5 py-6 text-center text-xs text-muted-foreground">
              No ledger records found in the database.
            </li>
          ) : (
            ledger.map((l) => (
              <li key={l.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{l.desc}</p>
                  <p className="text-[11px] text-muted-foreground">{l.date}</p>
                </div>
                <div className="text-right">
                  <span className={`font-mono text-sm block ${l.status === "paid" ? "text-success" : "text-foreground"}`}>
                    {l.amount}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{l.status}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Full-Viewport Modal Viewport */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md p-6 sm:p-10 md:p-12 overflow-hidden animate-in fade-in duration-200">
          <div className="w-full max-w-5xl mx-auto h-100px flex flex-col justify-between bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-5">
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-medium">Create & Send Invoice</h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Issue a new digital payment request to an active lease.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Form Body - 2 Column Layout for Desktop Spacing */}
            <form onSubmit={handleSendInvoice} className="flex-1 my-6 flex flex-col justify-between space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Select Tenant / Lease
                  </label>
                  <select
                    value={data.lease_id}
                    onChange={(e) => setData("lease_id", e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  >
                    <option value="">Select active lease...</option>
                    {leases.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.tenantName} ({l.unitName})
                      </option>
                    ))}
                  </select>
                  {errors.lease_id && <p className="text-xs text-destructive mt-1.5">{errors.lease_id}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={data.amount}
                      onChange={(e) => setData("amount", e.target.value)}
                      className="w-full rounded-2xl border border-border bg-background p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                    {errors.amount && <p className="text-xs text-destructive mt-1.5">{errors.amount}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={data.due_date}
                      onChange={(e) => setData("due_date", e.target.value)}
                      className="w-full rounded-2xl border border-border bg-background p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                    {errors.due_date && <p className="text-xs text-destructive mt-1.5">{errors.due_date}</p>}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Details / Line Item Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide additional details (e.g. Monthly Rent, Water Bill, Maintenance Charges)..."
                    value={data.details}
                    onChange={(e) => setData("details", e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-sm font-medium border border-border rounded-xl hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Send className="size-4" />
                  {processing ? "Sending..." : "Send Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Finance;

Finance.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
