import { Link } from "@inertiajs/react";
import { Building2, Home, ArrowRight } from "lucide-react";

export default function ChooseRegisterType() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-5">
      <div className="max-w-2xl w-full py-16">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="size-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold tracking-tight">EstateOS</span>
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
            How will you use EstateOS?
          </h1>
          <p className="text-muted-foreground mt-3">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/register/landlord"
            className="group p-6 bg-surface rounded-2xl ring-1 ring-border hover:ring-foreground/20 hover:-translate-y-0.5 transition-all"
          >
            <div className="size-10 rounded-xl bg-muted flex items-center justify-center mb-4">
              <Building2 className="size-5" />
            </div>
            <h2 className="font-display text-lg font-medium">I'm a landlord</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              List properties, manage tenants, and collect rent.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary mt-4">
              Get started <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          <Link
            href="/register/tenant"
            className="group p-6 bg-surface rounded-2xl ring-1 ring-border hover:ring-foreground/20 hover:-translate-y-0.5 transition-all"
          >
            <div className="size-10 rounded-xl bg-muted flex items-center justify-center mb-4">
              <Home className="size-5" />
            </div>
            <h2 className="font-display text-lg font-medium">I'm renting</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Register to your unit, pay rent, and message your landlord.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary mt-4">
              Get started <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
