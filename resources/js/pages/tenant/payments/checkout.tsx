import { useState, type ReactNode } from "react";
import { useForm, router } from "@inertiajs/react";
import { CreditCard, Smartphone, ShieldCheck, ArrowLeft } from "lucide-react";
import TenantLayout from "@/layouts/tenant-layout";

interface Invoice {
  id: number;
  reference: string;
  amount_due: string;
  amount_paid: string;
  due_date: string;
  lease?: {
    unit?: {
      name: string;
      property?: { name: string };
    };
  };
}

export default function Checkout({ invoice }: { invoice: Invoice }) {
  const [method, setMethod] = useState<"mpesa" | "card">("mpesa");
  const remaining = parseFloat(invoice.amount_due) - parseFloat(invoice.amount_paid);

  const { data, setData, post, processing, errors } = useForm({
    invoice_id: invoice.id,
    phone_number: "",
  });

  const handleMpesaPay = (e: React.FormEvent) => {
    e.preventDefault();
    post("/tenant/payments/mpesa-stk");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to Payments
      </button>

      <header>
        <h1 className="font-display text-2xl font-medium">Select Payment Method</h1>
        <p className="text-sm text-muted-foreground">Invoice #{invoice.reference}</p>
      </header>

      {/* Invoice Summary */}
      <div className="p-4 bg-surface rounded-2xl ring-1 ring-border flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">
            {invoice.lease?.unit?.property?.name} · {invoice.lease?.unit?.name}
          </p>
          <p className="text-sm font-medium">Rent Payment</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total Due</p>
          <p className="font-display text-2xl font-semibold">${remaining.toFixed(2)}</p>
        </div>
      </div>

      {/* Payment Options */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setMethod("mpesa")}
          className={`p-4 rounded-2xl ring-1 text-left flex flex-col justify-between h-24 transition-all ${
            method === "mpesa"
              ? "ring-2 ring-primary bg-primary/5"
              : "ring-border bg-surface hover:ring-foreground/20"
          }`}
        >
          <Smartphone className="size-5 text-primary" />
          <span className="font-medium text-sm">M-Pesa STK Push</span>
        </button>

        <button
          type="button"
          onClick={() => setMethod("card")}
          className={`p-4 rounded-2xl ring-1 text-left flex flex-col justify-between h-24 transition-all ${
            method === "card"
              ? "ring-2 ring-primary bg-primary/5"
              : "ring-border bg-surface hover:ring-foreground/20"
          }`}
        >
          <CreditCard className="size-5 text-primary" />
          <span className="font-medium text-sm">Credit / Debit Card</span>
        </button>
      </div>

      {/* Form Details */}
      <div className="p-6 bg-surface rounded-2xl ring-1 ring-border">
        {method === "mpesa" ? (
          <form onSubmit={handleMpesaPay} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                M-Pesa Phone Number
              </label>
              <input
                type="text"
                placeholder="254712345678"
                value={data.phone_number}
                onChange={(e) => setData("phone_number", e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background rounded-xl ring-1 ring-border focus:ring-2 focus:ring-primary outline-none"
                required
              />
              {errors.phone_number && (
                <p className="text-xs text-destructive mt-1">{errors.phone_number}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-2.5 bg-success text-white font-medium text-sm rounded-xl hover:bg-success/90 transition-colors disabled:opacity-50"
            >
              {processing ? "Sending Prompt..." : `Pay $${remaining.toFixed(2)} via M-Pesa`}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center py-4">
            <p className="text-sm text-muted-foreground">
              Card payments are processed securely via PayPal checkout.
            </p>
            <button
              onClick={() => router.post("/tenant/payments/paypal-checkout", { invoice_id: invoice.id })}
              className="w-full py-2.5 bg-primary text-primary-foreground font-medium text-sm rounded-xl hover:bg-primary/90 transition-colors"
            >
              Proceed to Card Checkout
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 text-success" /> Encrypted 256-bit secure transaction
      </div>
    </div>
  );
}

Checkout.layout = (page: ReactNode) => <TenantLayout>{page}</TenantLayout>;