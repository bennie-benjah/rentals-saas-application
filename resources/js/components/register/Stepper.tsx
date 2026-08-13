import { Check } from "lucide-react";

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="w-full">
      {/* Mobile: compact */}
      <div className="flex sm:hidden items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground">
          Step {current + 1} of {steps.length}
        </span>
        <span>{steps[current]}</span>
      </div>
      <div className="sm:hidden mt-2 h-1.5 bg-surface rounded-full overflow-hidden ring-1 ring-border">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${((current + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Desktop: dots */}
      <ol className="hidden sm:flex items-center gap-3">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className="flex items-center gap-3 flex-1 last:flex-none">
              <div
                className={`flex items-center gap-2.5 ${
                  active ? "text-foreground" : done ? "text-foreground/80" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`size-7 rounded-full flex items-center justify-center text-[11px] font-semibold ring-1 transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground ring-primary"
                      : done
                      ? "bg-foreground text-background ring-foreground"
                      : "bg-surface ring-border"
                  }`}
                >
                  {done ? <Check className="size-3.5" /> : i + 1}
                </div>
                <span className="text-xs font-medium tracking-tight">{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-border" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function Field({
  label,
  hint,
  required,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs font-medium text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </span>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground/60";

export const selectCls = inputCls + " appearance-none pr-8";
