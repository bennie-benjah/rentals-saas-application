import type { ReactNode } from "react";
import { RevenueChart, RevenueChartItem } from "@/components/dashboard/RevenueChart";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
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

interface FinanceProps {
  stats?: StatsProps;
  revenueChart?: RevenueChartItem[];
  ledger?: LedgerItem[];
}

function Finance({ stats, revenueChart = [], ledger = [] }: FinanceProps) {
  const statItems = [
    { label: "Collected (MTD)", value: stats?.collectedMtd ?? "$0.00", delta: "+0.0%", up: true },
    { label: "Outstanding", value: stats?.outstanding ?? "$0.00", delta: "0%", up: false },
    { label: "Operating exp.", value: stats?.operatingExp ?? "$0.00", delta: "0%", up: false },
    { label: "Net income", value: stats?.netIncome ?? "$0.00", delta: "+0.0%", up: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-medium tracking-tight">Finance</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time revenue and expense tracking</p>
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
    </div>
  );
}

export default Finance;

Finance.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;