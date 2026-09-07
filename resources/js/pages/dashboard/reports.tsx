import { useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";

const REPORTS = [
  { id: "pnl", title: "Profit & Loss", desc: "Detailed breakdown of income vs operational expenses." },
  { id: "rent_roll", title: "Rent Roll Report", desc: "Current lease status, unit occupancy, and monthly rent." },
  { id: "delinquency", title: "Delinquency & Receivables", desc: "Track overdue balances and unpaid tenant invoices." },
  { id: "maintenance", title: "Maintenance Expenses", desc: "Repair costs log and unit upkeep history." },
];

export default function ReportsIndex() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleExport = (reportType: string, format: "xlsx" | "csv" | "pdf") => {
    const params = new URLSearchParams({
      report_type: reportType,
      format,
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
    });

    window.location.href = `/dashboard/reports/export?${params.toString()}`;
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Export financial and operational reports.</p>
      </div>

      {/* Date Filter */}
      <div className="p-4 bg-surface ring-1 ring-border rounded-2xl flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-sm">
          <label className="text-muted-foreground font-medium">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg ring-1 ring-border bg-background text-sm"
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <label className="text-muted-foreground font-medium">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg ring-1 ring-border bg-background text-sm"
          />
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORTS.map((r) => (
          <div key={r.id} className="p-5 bg-surface ring-1 ring-border rounded-2xl flex flex-col justify-between gap-4">
            <div>
              <h3 className="font-medium text-base">{r.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <button
                onClick={() => handleExport(r.id, "xlsx")}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-muted hover:bg-foreground/10 transition-colors"
              >
                <FileSpreadsheet className="size-3.5" /> Excel
              </button>
              <button
                onClick={() => handleExport(r.id, "csv")}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-muted hover:bg-foreground/10 transition-colors"
              >
                <Download className="size-3.5" /> CSV
              </button>
              <button
                onClick={() => handleExport(r.id, "pdf")}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-muted hover:bg-foreground/10 transition-colors"
              >
                <FileText className="size-3.5" /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
