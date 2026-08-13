import type { ReactNode } from "react";
import { useState, useRef } from "react";
import { useForm } from "@inertiajs/react";
import { Check, ChevronRight, Camera, Droplet, Zap, Wrench, Thermometer, Upload } from "lucide-react";
import TenantLayout from "@/layouts/tenant-layout";

const categories = [
  { id: "plumbing", icon: Droplet, label: "Plumbing" },
  { id: "electric", icon: Zap, label: "Electrical" },
  { id: "hvac", icon: Thermometer, label: "Heating / AC" },
  { id: "other", icon: Wrench, label: "Other" },
];

interface Ticket {
  id: number;
  title: string;
  description: string;
  tag: string;
  status: string;
  raw_status: string;
  created_at: string;
}

interface MaintenanceProps {
  requests?: Ticket[];
}

function Maintenance({ requests = [] }: MaintenanceProps) {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    title: "",
    category: "",
    description: "",
    priority: "medium",
    photos: [] as File[],
  });

  const handleCategorySelect = (categoryId: string, label: string) => {
    setData((prev) => ({
      ...prev,
      category: categoryId,
      title: `${label} Issue`,
    }));
    setStep(2);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setData("photos", filesArray);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  post("/tenant/maintenance", {
    onError: (errors) => {
      console.log("Validation errors:", errors);
    },
    onSuccess: () => {
      setStep(3);
    },
  });
};

  const handleReset = () => {
    reset();
    setStep(1);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-medium tracking-tight">New request</h1>
        <p className="text-sm text-muted-foreground mt-1">Step {step} of 3</p>
        <div className="mt-4 flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all ${
                s <= step ? "bg-foreground" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </header>

      {/* Step 1: Select Category */}
      {step === 1 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            What's the issue?
          </h2>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCategorySelect(c.id, c.label)}
              className="w-full flex items-center gap-4 p-4 bg-surface rounded-2xl ring-1 ring-border hover:ring-foreground/20 transition-all hover:-translate-y-0.5"
            >
              <div className="size-10 rounded-xl bg-muted flex items-center justify-center">
                <c.icon className="size-4" />
              </div>
              <span className="text-sm font-medium flex-1 text-left">{c.label}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          ))}
        </section>
      )}

      {/* Step 2: Description & Photo Upload */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Describe the issue
            </label>
            <textarea
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              rows={5}
              required
              placeholder="e.g. Bathroom faucet drips constantly, especially at night."
              className="mt-3 w-full p-4 bg-surface rounded-2xl ring-1 ring-border focus:ring-foreground/30 outline-none text-sm resize-none"
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-4 bg-surface rounded-2xl ring-1 ring-dashed ring-border hover:ring-foreground/20 text-sm font-medium text-muted-foreground transition-all"
            >
              {data.photos.length > 0 ? (
                <>
                  <Upload className="size-4 text-success" /> {data.photos.length} photo(s) selected
                </>
              ) : (
                <>
                  <Camera className="size-4" /> Add photo(s) (optional)
                </>
              )}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 ring-1 ring-border rounded-xl text-sm font-medium hover:bg-muted transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!data.description.trim() || processing}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {processing ? "Submitting..." : "Submit request"}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Success View */}
      {step === 3 && (
        <section className="space-y-6 text-center py-10">
          <div className="mx-auto size-16 rounded-full bg-success/10 text-success flex items-center justify-center">
            <Check className="size-7" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-medium">Request submitted</h2>
            <p className="text-sm text-muted-foreground">
              We'll review your issue and get in touch within 24h.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Submit another request
          </button>
        </section>
      )}

      {/* Active Requests List */}
      {requests.length > 0 && (
        <section className="space-y-3 pt-6 border-t border-border">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Previous requests
          </h2>
          <div className="divide-y divide-border bg-surface rounded-2xl ring-1 ring-border">
            {requests.map((req) => (
              <div key={req.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {req.title} · <span className="text-muted-foreground">{req.tag}</span>
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{req.description}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-warning/10 text-warning uppercase">
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Maintenance;

Maintenance.layout = (page: ReactNode) => <TenantLayout>{page}</TenantLayout>;