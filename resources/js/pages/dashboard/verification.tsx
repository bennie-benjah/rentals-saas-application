import type { ReactNode } from "react";
/**
 * Converted from TanStack Router route: dashboard.verification.tsx
 *
 * TODO before this is production-ready:
 * - Original TanStack route path: "/dashboard/verification"
 */
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  listAllIdDocuments,
  reviewIdDocument,
  getIdDocumentSignedUrl,
  getDocumentAccessLog,
  getMyAccessRole,
} from "@/lib/id-documents";
import { CheckCircle2, XCircle, Eye, Download, ShieldAlert, FileText, Loader2, Clock, User, ShieldCheck, Upload } from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";


type Doc = Awaited<ReturnType<typeof listAllIdDocuments>>[number];
type LogEntry = Awaited<ReturnType<typeof getDocumentAccessLog>>[number];

function VerificationPage() {
  const listAll = listAllIdDocuments;
  const review = reviewIdDocument;
  const sign = getIdDocumentSignedUrl;
  const getLog = getDocumentAccessLog;
  const getRole = getMyAccessRole;

  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Doc | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    getRole().then((r) => setRole(r.role)).catch(() => setRole("user"));
  }, [getRole]);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await listAll({ data: status === "all" ? {} : { status } });
      setDocs(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin" || role === "reviewer") void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, status]);

  useEffect(() => {
    if (!selected) { setLog([]); return; }
    getLog({ data: { documentId: selected.id } }).then(setLog).catch(() => setLog([]));
  }, [selected, getLog]);

  const openSigned = async (id: string, download = false) => {
    try {
      const { url } = await sign({ data: { id, asDownload: download } });
      window.open(url, "_blank", "noopener,noreferrer");
      if (selected?.id === id) {
        const fresh = await getLog({ data: { documentId: id } });
        setLog(fresh);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to open document");
    }
  };

  const decide = async (decision: "approved" | "rejected") => {
    if (!selected) return;
    try {
      await review({ data: { id: selected.id, decision, notes: notes.trim() || undefined } });
      toast.success(`Document ${decision}`);
      setNotes("");
      const fresh = await getLog({ data: { documentId: selected.id } });
      setLog(fresh);
      await refresh();
      setSelected((s) => s ? { ...s, status: decision, review_notes: notes.trim() || null } as Doc : s);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Review failed");
    }
  };

  if (role === null) {
    return <div className="p-8 text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="size-4 animate-spin" /> Loading…</div>;
  }

  if (role !== "admin" && role !== "reviewer") {
    return (
      <div className="p-8 max-w-lg">
        <div className="rounded-xl ring-1 ring-amber-500/40 bg-amber-500/5 p-6">
          <div className="flex items-start gap-3">
            <ShieldAlert className="size-5 text-amber-600 mt-0.5" />
            <div>
              <h1 className="text-base font-semibold">Reviewer access required</h1>
              <p className="text-sm text-muted-foreground mt-1">
                This area is restricted to accounts with the <code className="px-1 rounded bg-foreground/5">admin</code> or{" "}
                <code className="px-1 rounded bg-foreground/5">reviewer</code> role. Ask an admin to grant you access
                in the <code className="px-1 rounded bg-foreground/5">user_roles</code> table.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">ID verification</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review encrypted identity documents. Every action here is written to an immutable audit log.
          </p>
        </div>
        <div className="inline-flex rounded-lg ring-1 ring-border overflow-hidden text-xs">
          {(["pending", "approved", "rejected", "all"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 capitalize ${status === s ? "bg-foreground text-background" : "hover:bg-foreground/5"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-4">
        {/* List */}
        <div className="rounded-xl ring-1 ring-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground bg-foreground/[0.02]">
            Documents ({docs.length})
          </div>
          {loading ? (
            <div className="p-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading…
            </div>
          ) : docs.length === 0 ? (
            <div className="p-8 text-sm text-muted-foreground text-center">No documents in this state.</div>
          ) : (
            <ul className="divide-y divide-border max-h-[70vh] overflow-y-auto">
              {docs.map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => setSelected(d)}
                    className={`w-full text-left p-3 hover:bg-foreground/[0.03] transition ${selected?.id === d.id ? "bg-foreground/[0.04]" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{d.owner?.full_name || d.owner?.email || d.owner_id.slice(0, 8)}</div>
                        <div className="text-xs text-muted-foreground truncate">{d.kind.replace(/_/g, " ")} · {d.slot}</div>
                        <div className="text-[10px] text-muted-foreground/70 mt-1 font-mono truncate">{d.file_name}</div>
                      </div>
                      <StatusBadge s={d.status} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detail */}
        <div className="rounded-xl ring-1 ring-border">
          {!selected ? (
            <div className="p-8 text-sm text-muted-foreground flex flex-col items-center gap-2 min-h-[400px] justify-center">
              <FileText className="size-8 opacity-40" />
              Select a document to review
            </div>
          ) : (
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold truncate">{selected.owner?.full_name || "Unnamed"}</h2>
                  <p className="text-xs text-muted-foreground">{selected.owner?.email}</p>
                </div>
                <StatusBadge s={selected.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <Info label="Kind" value={selected.kind.replace(/_/g, " ")} />
                <Info label="Slot" value={selected.slot} />
                <Info label="Size" value={`${(selected.size_bytes / 1024).toFixed(1)} KB`} />
                <Info label="MIME" value={selected.mime_type} />
                <Info label="Uploaded" value={new Date(selected.created_at).toLocaleString()} />
                <Info label="Doc ID" value={selected.id.slice(0, 8) + "…"} mono />
              </div>

              <div className="rounded-lg ring-1 ring-border bg-foreground/[0.02] p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">SHA-256 integrity hash</div>
                <div className="text-[11px] font-mono break-all">{selected.sha256}</div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => openSigned(selected.id, false)}
                  className="inline-flex items-center gap-1.5 rounded-lg ring-1 ring-border px-3 py-1.5 text-xs font-medium hover:bg-foreground/5"
                >
                  <Eye className="size-3.5" /> View (60s signed URL)
                </button>
                <button
                  onClick={() => openSigned(selected.id, true)}
                  className="inline-flex items-center gap-1.5 rounded-lg ring-1 ring-border px-3 py-1.5 text-xs font-medium hover:bg-foreground/5"
                >
                  <Download className="size-3.5" /> Download
                </button>
              </div>

              {selected.status === "pending" && (
                <div className="space-y-2 pt-2 border-t border-border">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Reviewer notes (optional, stored with the decision)"
                    className="w-full rounded-lg ring-1 ring-border bg-background px-3 py-2 text-xs outline-none focus:ring-primary min-h-[70px]"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => decide("approved")}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 text-white px-3 py-2 text-xs font-medium hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="size-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => decide("rejected")}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 text-white px-3 py-2 text-xs font-medium hover:bg-red-700"
                    >
                      <XCircle className="size-3.5" /> Reject
                    </button>
                  </div>
                </div>
              )}

              {selected.review_notes && (
                <div className="rounded-lg ring-1 ring-border p-3 text-xs">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Reviewer notes</div>
                  {selected.review_notes}
                </div>
              )}

              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="size-3.5 text-muted-foreground" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Access & review log ({log.length})
                  </h3>
                </div>
                <ul className="space-y-1.5 max-h-64 overflow-y-auto">
                  {log.length === 0 && <li className="text-xs text-muted-foreground italic">No entries yet.</li>}
                  {log.map((e) => (
                    <li key={e.id} className="rounded ring-1 ring-border px-3 py-2 text-[11px] flex items-start gap-2">
                      <ActionIcon action={e.action} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{labelFor(e.action)}</span>
                          <span className="text-muted-foreground truncate">
                            <User className="size-3 inline mr-1" />
                            {e.actor?.full_name || e.actor?.email || e.actor_id?.slice(0, 8) || "system"}
                            {e.actor_role && <span className="ml-1 px-1 rounded bg-foreground/5">{e.actor_role}</span>}
                          </span>
                        </div>
                        <div className="text-muted-foreground/80 flex items-center gap-2 flex-wrap mt-0.5">
                          <Clock className="size-3" />
                          {new Date(e.created_at).toLocaleString()}
                          {e.ip_address && <span className="font-mono">· {e.ip_address}</span>}
                        </div>
                        {e.notes && <div className="mt-1 text-muted-foreground italic">"{e.notes}"</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-700 ring-amber-500/30",
    approved: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30",
    rejected: "bg-red-500/15 text-red-700 ring-red-500/30",
  };
  return (
    <span className={`shrink-0 text-[10px] font-medium uppercase tracking-wider ring-1 rounded px-1.5 py-0.5 ${map[s] ?? "bg-foreground/5 text-muted-foreground ring-border"}`}>
      {s}
    </span>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-xs ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function ActionIcon({ action }: { action: string }) {
  if (action === "upload") return <Upload className="size-3.5 text-blue-600 mt-0.5" />;
  if (action === "view") return <Eye className="size-3.5 text-muted-foreground mt-0.5" />;
  if (action === "download") return <Download className="size-3.5 text-muted-foreground mt-0.5" />;
  if (action === "review_approve") return <CheckCircle2 className="size-3.5 text-emerald-600 mt-0.5" />;
  if (action === "review_reject") return <XCircle className="size-3.5 text-red-600 mt-0.5" />;
  return <FileText className="size-3.5 text-muted-foreground mt-0.5" />;
}

function labelFor(a: string) {
  return {
    upload: "Uploaded",
    view: "Viewed",
    download: "Downloaded",
    review_approve: "Approved",
    review_reject: "Rejected",
    delete: "Deleted",
  }[a] ?? a;
}

export default VerificationPage;

VerificationPage.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
