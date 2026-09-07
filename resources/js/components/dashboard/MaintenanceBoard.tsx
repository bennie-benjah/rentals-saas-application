import { router } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { AddMaintenanceTicketModal } from "./AddMaintenanceTicketModal";

export type Status = "todo" | "progress" | "done";

export type Ticket = {
  id: number;
  title: string;
  tag: string;
  status: Status;
};

export type Unit = {
  id: number;
  name: string;
  property_id?: number;
};

const columns: { key: Status; label: string; dot: string }[] = [
  { key: "todo", label: "To Do", dot: "bg-muted-foreground/40" },
  { key: "progress", label: "In Progress", dot: "bg-warning" },
  { key: "done", label: "Done", dot: "bg-success" },
];

export function MaintenanceBoard({
  tickets: initialTickets = [],
  units = [],
}: {
  tickets: Ticket[];
  units?: Unit[];
}) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  const onDrop = (status: Status) => {
    if (draggedId === null) return;

    // Optimistically update frontend state
    setTickets((prev) =>
      prev.map((t) => (t.id === draggedId ? { ...t, status } : t))
    );

    // Persist status change to backend
    router.patch(
      `/dashboard/maintenance/${draggedId}/status`,
      { status },
      {
        preserveScroll: true,
        onError: () => setTickets(initialTickets),
      }
    );

    setDraggedId(null);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-medium text-lg">Maintenance Requests</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2 px-3 flex items-center gap-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="size-4" />
          New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {columns.map((col) => {
          const items = tickets.filter((t) => t.status === col.key);

          return (
            <div
              key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(col.key)}
              className="flex flex-col gap-3 min-h-[20rem] bg-muted/30 p-3 rounded-xl ring-1 ring-border/50"
            >
              <div className="flex items-center gap-2 px-1 py-1">
                <div className={`size-2 rounded-full ${col.dot}`} />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {col.label} <span className="text-muted-foreground/60">· {items.length}</span>
                </span>
              </div>

              {items.map((t) => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={() => setDraggedId(t.id)}
                  className={`p-4 bg-surface border border-border rounded-lg shadow-sm hover:shadow transition-all cursor-grab active:cursor-grabbing ${
                    col.key === "done" ? "opacity-60" : ""
                  }`}
                >
                  <p className={`text-sm font-medium mb-2 ${col.key === "done" ? "line-through text-muted-foreground" : ""}`}>
                    {t.title}
                  </p>
                  <span className="text-[11px] bg-muted px-2.5 py-1 rounded-md text-muted-foreground font-mono">
                    {t.tag}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Ticket Creation Modal */}
      <AddMaintenanceTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        units={units}
      />
    </div>
  );
}