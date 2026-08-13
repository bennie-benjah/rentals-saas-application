import { useRef, useState } from "react";
import { Camera, CheckCircle2, FileText, ShieldCheck, Upload, X } from "lucide-react";
import { toast } from "sonner";

export type IdSlot = {
  key: string;
  label: string;
  hint?: string;
  icon?: "front" | "back" | "selfie" | "doc";
  accept?: string;
};

export type IdFile = { name: string; size: number; type: string; url: string };

const MAX_MB = 8;
const DEFAULT_ACCEPT = "image/png,image/jpeg,image/webp,application/pdf";

function IconFor({ kind }: { kind?: IdSlot["icon"] }) {
  if (kind === "selfie") return <Camera className="size-5" />;
  if (kind === "doc") return <FileText className="size-5" />;
  return <ShieldCheck className="size-5" />;
}

export function IdUpload({
  slots,
  value,
  onChange,
  title = "Identity verification",
  description = "Upload a clear, unedited photo or scan. Files are encrypted in transit and used only to verify your identity.",
}: {
  slots: IdSlot[];
  value: Record<string, IdFile | undefined>;
  onChange: (v: Record<string, IdFile | undefined>) => void;
  title?: string;
  description?: string;
}) {
  const completed = slots.filter((s) => value[s.key]).length;

  const handleFile = (slot: IdSlot, file: File | null) => {
    if (!file) return;
    const accept = (slot.accept ?? DEFAULT_ACCEPT).split(",");
    if (!accept.some((a) => file.type === a.trim() || (a.trim() === "image/*" && file.type.startsWith("image/")))) {
      toast.error("Unsupported file type. Use JPG, PNG, WEBP or PDF.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`File too large. Max ${MAX_MB}MB.`);
      return;
    }
    const url = URL.createObjectURL(file);
    onChange({
      ...value,
      [slot.key]: { name: file.name, size: file.size, type: file.type, url },
    });
    toast.success(`${slot.label} uploaded`);
  };

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
            file={value[slot.key]}
            onFile={(f) => handleFile(slot, f)}
            onRemove={() => {
              const cur = value[slot.key];
              if (cur) URL.revokeObjectURL(cur.url);
              const { [slot.key]: _, ...rest } = value;
              onChange(rest);
            }}
          />
        ))}
      </div>

      <ul className="mt-4 text-[11px] text-muted-foreground space-y-1">
        <li>• Accepted formats: JPG, PNG, WEBP, PDF · max {MAX_MB}MB per file</li>
        <li>• Make sure all four corners and text are readable — no glare or crops</li>
        <li>• Documents are stored securely and never shared without your consent</li>
      </ul>
    </div>
  );
}

function SlotCard({
  slot,
  file,
  onFile,
  onRemove,
}: {
  slot: IdSlot;
  file?: IdFile;
  onFile: (f: File | null) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const isImage = file?.type.startsWith("image/");
  const useCamera = slot.icon === "selfie";

  if (file) {
    return (
      <div className="relative rounded-lg ring-1 ring-primary/40 bg-primary/5 overflow-hidden">
        <div className="aspect-[4/3] bg-surface flex items-center justify-center">
          {isImage ? (
            <img src={file.url} alt={slot.label} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <FileText className="size-8" />
              <span className="text-xs truncate max-w-[80%]">{file.name}</span>
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
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        onFile(e.dataTransfer.files?.[0] ?? null);
      }}
      className={`group text-left rounded-lg ring-1 border border-dashed transition-all p-4 aspect-[4/3] flex flex-col items-center justify-center gap-2 ${
        drag
          ? "ring-primary border-primary bg-primary/5"
          : "ring-border border-border bg-background hover:ring-foreground/30 hover:border-foreground/30"
      }`}
    >
      <div className="size-9 rounded-full bg-surface flex items-center justify-center text-muted-foreground group-hover:text-foreground">
        <IconFor kind={slot.icon} />
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold">{slot.label}</p>
        {slot.hint && <p className="text-[10px] text-muted-foreground mt-0.5">{slot.hint}</p>}
      </div>
      <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
        <Upload className="size-3" /> Drop or click
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={slot.accept ?? DEFAULT_ACCEPT}
        {...(useCamera ? { capture: "user" as const } : {})}
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
    </button>
  );
}
