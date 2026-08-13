import type { ReactNode } from "react";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Check, CreditCard, Building2, Smartphone, Wallet, AlertCircle } from "lucide-react";
import TenantLayout from "@/layouts/tenant-layout";

type Method = "card" | "ach" | "mpesa" | "paypal";

interface InvoiceData {
  id: number;
  period: string;
  dueDateText: string;
  daysRemaining: number;
  baseRent: number;
  utilities: number;
  totalDue: number;
  formattedTotal: string;
}

interface PayRentProps {
  invoice: InvoiceData | null;
  userPhone?: string;
}

function PayRent({ invoice, userPhone }: PayRentProps) {
  const [method, setMethod] = useState<Method>("card");

  const { data, setData, post, processing, setData: setFormData } = useForm({
    invoice_id: invoice?.id ?? 0,
    method: "card" as Method,
    phone: userPhone || "+254 ",
  });

  if (!invoice) {
    return (
      <div className="p-8 text-center bg-surface rounded-2xl ring-1 ring-border space-y-3">
        <Check className="size-8 text-success mx-auto" />
        <h2 className="font-display text-lg font-medium">All caught up!</h2>
        <p className="text-sm text-muted-foreground">
          You have no outstanding invoices or pending payments.
        </p>
      </div>
    );
  }

  const handleMethodSelect = (selectedMethod: Method) => {
    setMethod(selectedMethod);
    setFormData("method", selectedMethod);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    post("/tenant/pay");
  };

  // Estimate M-Pesa conversion (e.g. 1 USD = 129 KES)
  const mpesaAmount = Math.round(invoice.totalDue * 129).toLocaleString();

  return (
    <form onSubmit={handlePayment} className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-medium tracking-tight">Pay rent</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {invoice.period} · {invoice.dueDateText} ({invoice.daysRemaining} days left)
        </p>
      </header>

      {/* Breakdown */}
      <section className="p-6 bg-surface rounded-2xl ring-1 ring-border space-y-4">
        <div className="flex items-baseline justify-between pb-4 border-b border-border">
          <span className="text-sm text-muted-foreground">Base rent</span>
          <span className="font-mono text-sm">${invoice.baseRent.toFixed(2)}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Utilities</span>
          <span className="font-mono text-sm">${invoice.utilities.toFixed(2)}</span>
        </div>
        <div className="flex items-baseline justify-between pt-4 border-t border-border">
          <span className="font-medium">Total due</span>
          <span className="font-display text-2xl font-medium">{invoice.formattedTotal}</span>
        </div>
      </section>

      {/* Payment Options */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Payment method
        </h2>
        {[
          { id: "card" as const, icon: CreditCard, label: "Visa •••• 4242", sub: "Instant · 2.9% fee" },
          { id: "ach" as const, icon: Building2, label: "Bank Checking (ACH)", sub: "1–2 days · no fee" },
          { id: "mpesa" as const, icon: Smartphone, label: "M-Pesa", sub: "Instant · 1.5% fee · KES" },
          { id: "paypal" as const, icon: Wallet, label: "PayPal", sub: "Instant · 3.49% + fixed fee" },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => handleMethodSelect(m.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl ring-1 transition-all ${
              method === m.id ? "bg-surface ring-foreground/30" : "bg-surface ring-border hover:ring-foreground/15"
            }`}
          >
            <div
              className={`size-10 rounded-xl flex items-center justify-center ${
                m.id === "mpesa"
                  ? "bg-success/10 text-success"
                  : m.id === "paypal"
                  ? "bg-[#003087]/10 text-[#003087]"
                  : "bg-muted"
              }`}
            >
              <m.icon className="size-4" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.sub}</p>
            </div>
            <div
              className={`size-5 rounded-full ring-1 flex items-center justify-center transition-all ${
                method === m.id ? "bg-foreground ring-foreground" : "ring-border"
              }`}
            >
              {method === m.id && <Check className="size-3 text-background" />}
            </div>
          </button>
        ))}
      </section>

      {/* Method specific fields */}
      {method === "mpesa" && (
        <section className="p-5 bg-success/5 ring-1 ring-success/20 rounded-2xl space-y-3 animate-reveal">
          <label className="text-xs font-semibold uppercase tracking-widest text-success">
            M-Pesa number
          </label>
          <input
            value={data.phone}
            onChange={(e) => setData("phone", e.target.value)}
            inputMode="tel"
            required
            className="w-full px-4 py-3 bg-background rounded-xl ring-1 ring-border outline-none text-sm font-mono"
          />
          <p className="text-xs text-muted-foreground">
            You'll receive an STK push prompt on this number for KES {mpesaAmount}.
          </p>
        </section>
      )}

      {method === "paypal" && (
        <section className="p-5 bg-primary/5 ring-1 ring-primary/20 rounded-2xl space-y-3 animate-reveal">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 min-w-[4px] h-4 rounded-full bg-primary" />
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                PayPal charges a transaction fee of <strong className="text-foreground">3.49% + fixed fee</strong>.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Submit Button */}
      {method === "mpesa" ? (
        <button
          type="submit"
          disabled={processing}
          className="w-full py-3.5 bg-success text-background rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <Smartphone className="size-4" />
          {processing ? "Sending STK push..." : `Pay with M-Pesa · ${invoice.formattedTotal}`}
        </button>
      ) : method === "paypal" ? (
        <button
          type="submit"
          disabled={processing}
          className="w-full py-3.5 bg-[#003087] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <Wallet className="size-4" />
          {processing ? "Redirecting..." : `Pay with PayPal · ${invoice.formattedTotal}`}
        </button>
      ) : (
        <button
          type="submit"
          disabled={processing}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {processing ? "Processing..." : `Confirm payment of ${invoice.formattedTotal}`}
        </button>
      )}
    </form>
  );
}

export default PayRent;

PayRent.layout = (page: ReactNode) => <TenantLayout>{page}</TenantLayout>;