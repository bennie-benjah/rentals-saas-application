import { useRef, useState } from "react";
import { Camera, CheckCircle2, FileText, ShieldCheck, Upload, X, Lock, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Link, usePage } from "@inertiajs/react";
import { uploadIdDocument } from "@/lib/id-documents";
import type { IdSlot } from "@/components/register/IdUpload";

export type StoredDoc = {
  id: string;
  fileName: string;
  size: number;
  mimeType: string;
  sha256: string;
  previewUrl?: string;
};

const MAX_MB = 8;
const DEFAULT_ACCEPT = "image/png,image/jpeg,image/webp,application/pdf";

function IconFor({ kind }: { kind?: IdSlot["icon"] }) {
  if (kind === "selfie") return <Camera className="size-5" />;
  if (kind === "doc") return <FileText className="size-5" />;
  return <ShieldCheck className="size-5" />;
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const s = String(r.result || "");
      const idx = s.indexOf(",");
      resolve(idx >= 0 ? s.slice(idx + 1) : s);
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function SecureIdUpload({
  slots,
  kind,
  value,
  onChange,
  title = "Identity verification",
  description = "Files are AES-256 encrypted at rest in a private bucket. Every upload, view, and review is recorded to an audit log.",
}: {
  slots: IdSlot[];
  kind: "tenant_id" | "tenant_proof_of_income" | "landlord_id" | "landlord_ownership_proof";
  value: Record<string, StoredDoc | undefined>;
  onChange: (v: Record<string, StoredDoc | undefined>) => void;
  title?: string;
  description?: string;
}) {
  const { auth } = usePage<{ auth: { user: { id: number; name: string } | null } }>().props;
  const user = auth.user;
  const upload = uploadIdDocument;
  const completed = slots.filter((s) => value[s.key]).length;

  if (!user) {
    return (
      <div className="rounded-xl ring-1 ring-amber-500/40 bg-amber-500/5 p-5">
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
            <Lock className="size-4 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Sign in required for ID uploads</h3>
            <p className="text-xs text-muted-foreground mt-1">
              We only accept identity documents from authenticated accounts. This ties every upload
              to a real user in the audit log.
            </p>
            <Link
              href="/login"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              Sign in or create an account →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl ring-1 ring-border bg-background/50 p-4 md:p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <h3 className="text-sm font-semibold">{title}</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1 max-w-md">{description}</p>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground shrink-0">
          {completed}/{slots.length} uploaded
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {slots.map((slot) => (
          <SlotCard
            key={slot.key}
            slot={slot}
            doc={value[slot.key]}
            onUpload={async (file) => {
              const previewUrl = URL.createObjectURL(file);
              try {
                const dataBase64 = await toBase64(file);
                const res = await upload({
                  data: {
                    kind,
                    slot: slot.key,
                    fileName: file.name,
                    mimeType: file.type,
                    dataBase64,
                  },
                });
                onChange({
                  ...value,
                  [slot.key]: {
                    id: res.id,
                    fileName: res.fileName,
                    size: res.size,
                    mimeType: res.mimeType,
                    sha256: res.sha256,
                    previewUrl,
                  },
                });
                toast.success(`${slot.label} uploaded securely`);
              } catch (err) {
                URL.revokeObjectURL(previewUrl);
                toast.error(err instanceof Error ? err.message : "Upload failed");
              }
            }}
            onRemove={() => {
              const cur = value[slot.key];
              if (cur?.previewUrl) URL.revokeObjectURL(cur.previewUrl);
              const { [slot.key]: _, ...rest } = value;
              onChange(rest);
            }}
          />
        ))}
      </div>

      <ul className="mt-4 text-[11px] text-muted-foreground space-y-1">
        <li className="flex items-center gap-1.5"><Lock className="size-3" /> Encrypted at rest · signed URLs expire in 60 seconds</li>
        <li className="flex items-center gap-1.5"><ShieldCheck className="size-3" /> SHA-256 checksums prevent tampering after upload</li>
        <li className="flex items-center gap-1.5"><AlertCircle className="size-3" /> Every reviewer view is recorded with timestamp and IP</li>
      </ul>
    </div>
  );
}

function SlotCard({
  slot,
  doc,
  onUpload,
  onRemove,
}: {
  slot: IdSlot;
  doc?: StoredDoc;
  onUpload: (f: File) => Promise<void>;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const isImage = doc?.mimeType.startsWith("image/");
  const useCamera = slot.icon === "selfie";

  const handleFile = async (file: File | null) => {
    if (!file) return;
    const accept = (slot.accept ?? DEFAULT_ACCEPT).split(",");
    if (!accept.some((a) => file.type === a.trim())) {
      toast.error("Unsupported file type. Use JPG, PNG, WEBP or PDF.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`File too large. Max ${MAX_MB}MB.`);
      return;
    }
    setBusy(true);
    try {
      await onUpload(file);
    } finally {
      setBusy(false);
    }
  };

  if (doc) {
    return (
      <div className="relative rounded-lg ring-1 ring-primary/40 bg-primary/5 overflow-hidden">
        <div className="aspect-[4/3] bg-surface flex items-center justify-center">
          {isImage && doc.previewUrl ? (
            <img src={doc.previewUrl} alt={slot.label} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <FileText className="size-8" />
              <span className="text-xs truncate max-w-[80%]">{doc.fileName}</span>
            </div>
          )}
        </div>
        <div className="p-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-primary min-w-0">
            <CheckCircle2 className="size-3.5 shrink-0" />
            <span className="truncate">{slot.label}</span>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive shrink-0"
            aria-label={`Remove ${slot.label}`}
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="px-2.5 pb-2 text-[10px] text-muted-foreground font-mono truncate">
          sha256: {doc.sha256.slice(0, 24)}…
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        void handleFile(e.dataTransfer.files?.[0] ?? null);
      }}
      className={`group text-left rounded-lg ring-1 border border-dashed transition-all p-4 aspect-[4/3] flex flex-col items-center justify-center gap-2 disabled:opacity-60 ${
        drag ? "ring-primary border-primary bg-primary/5"
             : "ring-border border-border bg-background hover:ring-foreground/30 hover:border-foreground/30"
      }`}
    >
      <div className="size-9 rounded-full bg-surface flex items-center justify-center text-muted-foreground group-hover:text-foreground">
        {busy ? <Loader2 className="size-5 animate-spin" /> : <IconFor kind={slot.icon} />}
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold">{slot.label}</p>
        {slot.hint && <p className="text-[10px] text-muted-foreground mt-0.5">{slot.hint}</p>}
      </div>
      <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
        {busy ? "Encrypting & uploading…" : <><Upload className="size-3" /> Drop or click</>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={slot.accept ?? DEFAULT_ACCEPT}
        {...(useCamera ? { capture: "user" as const } : {})}
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
      />
    </button>
  );
}
