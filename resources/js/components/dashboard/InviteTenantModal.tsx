import { useState, FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import { X, Loader2 } from "lucide-react";

interface UnitOption {
  id: number;
  unit_number: string;
  rent_amount: number;
  status: string;
  property?: { id: number; name: string };
}

interface TenantOption {
  id: number;
  name: string;
  email: string;
}

interface InviteTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  units?: UnitOption[];
  tenants?: TenantOption[];
}

export function InviteTenantModal({
  isOpen,
  onClose,
  units = [],
  tenants = [],
}: InviteTenantModalProps) {
  if (!isOpen) return null;

  const { data, setData, post, processing, errors, reset } = useForm({
  unit_id: "",
  tenant_id: "",
  rent_amount: "",
  start_date: "",
  end_date: "",
  billing_cycle: "monthly",
});

  const handleUnitChange = (unitId: string) => {
    const selectedUnit = units.find((u) => String(u.id) === unitId);
    setData((prev) => ({
      ...prev,
      unit_id: unitId,
      rent_amount: selectedUnit ? String(selectedUnit.rent_amount) : prev.rent_amount,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
  e.preventDefault();

  post("/dashboard/leases", {
    onSuccess: () => {
      reset();
      onClose();
    },
    onError: (errs) => {
      console.log("Validation errors:", errs);
    },
  });
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface ring-1 ring-border rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-medium font-display">Create New Lease</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Select Property / Unit */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Select Unit *
            </label>
            <select
              value={data.unit_id}
              onChange={(e) => handleUnitChange(e.target.value)}
              className="w-full bg-muted rounded-xl px-3 py-2 text-sm outline-none border border-transparent focus:border-primary"
              required
            >
              <option value="">-- Choose a Unit --</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.property?.name ?? "Property"} — Unit {u.unit_number} ({u.status})
                </option>
              ))}
            </select>
            {errors.unit_id && <p className="text-xs text-destructive mt-1">{errors.unit_id}</p>}
          </div>

          {/* Select Tenant */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Select Tenant *
            </label>
            <select
              value={data.tenant_id}
              onChange={(e) => setData("tenant_id", e.target.value)}
              className="w-full bg-muted rounded-xl px-3 py-2 text-sm outline-none border border-transparent focus:border-primary"
              required
            >
              <option value="">-- Choose a Tenant --</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.email})
                </option>
              ))}
            </select>
            {errors.tenant_id && <p className="text-xs text-destructive mt-1">{errors.tenant_id}</p>}
          </div>

          {/* Rent Amount */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Monthly Rent ($) *
            </label>
            <input
              type="number"
              step="0.01"
              value={data.rent_amount}
              onChange={(e) => setData("rent_amount", e.target.value)}
              placeholder="2500"
              className="w-full bg-muted rounded-xl px-3 py-2 text-sm outline-none border border-transparent focus:border-primary"
              required
            />
            {errors.rent_amount && <p className="text-xs text-destructive mt-1">{errors.rent_amount}</p>}
          </div>

          {/* Start and End Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={data.start_date}
                onChange={(e) => setData("start_date", e.target.value)}
                className="w-full bg-muted rounded-xl px-3 py-2 text-sm outline-none border border-transparent focus:border-primary"
                required
              />
              {errors.start_date && <p className="text-xs text-destructive mt-1">{errors.start_date}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                End Date
              </label>
              <input
                type="date"
                value={data.end_date}
                onChange={(e) => setData("end_date", e.target.value)}
                className="w-full bg-muted rounded-xl px-3 py-2 text-sm outline-none border border-transparent focus:border-primary"
              />
              {errors.end_date && <p className="text-xs text-destructive mt-1">{errors.end_date}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
            >
              {processing && <Loader2 className="size-4 animate-spin" />}
              Create Lease
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
