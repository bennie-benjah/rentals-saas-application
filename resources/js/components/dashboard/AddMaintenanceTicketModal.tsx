import { useForm } from "@inertiajs/react";
import { X, Loader2 } from "lucide-react";
import { FormEvent } from "react";

interface Unit {
  id: number;
  name: string;
}

interface AddMaintenanceTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  units?: Unit[];
}

export function AddMaintenanceTicketModal({
  isOpen,
  onClose,
  units = [],
}: AddMaintenanceTicketModalProps) {
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    unit_id: "",
    title: "",
    description: "",
    priority: "medium",
  });

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    clearErrors();
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post("/dashboard/maintenance", {
      preserveScroll: true,
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-background border border-border p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h3 className="font-display text-lg font-medium">New Maintenance Ticket</h3>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
              placeholder="e.g. Leaking Sink in Kitchen"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Unit Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Unit
            </label>
            <select
              required
              value={data.unit_id}
              onChange={(e) => setData("unit_id", e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="" disabled>
                Select a unit...
              </option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  Unit {u.name}
                </option>
              ))}
            </select>
            {errors.unit_id && <p className="mt-1 text-xs text-red-500">{errors.unit_id}</p>}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Priority
            </label>
            <select
              value={data.priority}
              onChange={(e) => setData("priority", e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            {errors.priority && <p className="mt-1 text-xs text-red-500">{errors.priority}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              placeholder="Provide details about the maintenance issue..."
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {processing && <Loader2 className="size-4 animate-spin" />}
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
