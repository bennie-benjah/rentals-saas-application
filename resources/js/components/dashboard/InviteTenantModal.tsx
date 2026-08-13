import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import { X } from "lucide-react";

interface InviteTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteTenantModal({ isOpen, onClose }: InviteTenantModalProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    unit_id: "",
    tenant_id: "",
    rent_amount: "",
    start_date: "",
    end_date: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post("/dashboard/leases", {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-background rounded-2xl p-6 ring-1 ring-border shadow-2xl my-auto max-h-[90vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="text-lg font-semibold font-display">Create New Lease</h2>
          <button
            onClick={onClose}
            type="button"
            className="p-1 hover:bg-muted rounded-md text-muted-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Unit ID *
            </label>
            <input
              type="text"
              value={data.unit_id}
              onChange={(e) => setData("unit_id", e.target.value)}
              className="w-full px-3 py-2 bg-surface ring-1 ring-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. 1"
              required
            />
            {errors.unit_id && (
              <p className="text-xs text-red-500 mt-1">{errors.unit_id}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Tenant ID *
            </label>
            <input
              type="text"
              value={data.tenant_id}
              onChange={(e) => setData("tenant_id", e.target.value)}
              className="w-full px-3 py-2 bg-surface ring-1 ring-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. 2"
              required
            />
            {errors.tenant_id && (
              <p className="text-xs text-red-500 mt-1">{errors.tenant_id}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Rent Amount ($) *
            </label>
            <input
              type="number"
              value={data.rent_amount}
              onChange={(e) => setData("rent_amount", e.target.value)}
              className="w-full px-3 py-2 bg-surface ring-1 ring-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="2500"
              required
            />
            {errors.rent_amount && (
              <p className="text-xs text-red-500 mt-1">{errors.rent_amount}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={data.start_date}
                onChange={(e) => setData("start_date", e.target.value)}
                className="w-full px-3 py-2 bg-surface ring-1 ring-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                End Date
              </label>
              <input
                type="date"
                value={data.end_date}
                onChange={(e) => setData("end_date", e.target.value)}
                className="w-full px-3 py-2 bg-surface ring-1 ring-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {processing ? "Saving..." : "Create Lease"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}