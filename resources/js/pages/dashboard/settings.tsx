import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useForm, page } from "@inertiajs/react";
import { LogOut, Moon, Sun, Check, ArrowRight, Loader2 } from "lucide-react";

import { useTheme } from "@/hooks/use-theme";
import { PLANS, usePlan, fmt, type PlanId } from "@/hooks/use-plan";
import { UsageMeter } from "@/components/dashboard/UsageMeter";
import DashboardLayout from "@/layouts/dashboard-layout";

interface UserProps {
  id: number;
  name: string;
  email: string;
}

interface SettingsProps {
  auth?: {
    user: UserProps;
  };
}

function Settings({ auth }: SettingsProps) {
  const { dark, toggle } = useTheme();
  const [notif, setNotif] = useState(true);
  const { plan, planId, setPlan } = usePlan();

  // Handle Profile updating using Inertia Form
  const { data, setData, patch, processing, recentlySuccessful } = useForm({
    name: auth?.user?.name ?? "Alex Chen",
    email: auth?.user?.email ?? "alex@estateos.app",
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch("/settings/profile"); // Ensure route exists or adjust path to match your profile endpoint
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-medium tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Preferences, plan and account</p>
      </div>

      {/* Plan & Limits */}
      <section className="bg-surface ring-1 ring-border rounded-2xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display font-medium">Plan & limits</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Currently on <span className="font-medium text-foreground">{plan.name}</span> · {plan.price}
            </p>
          </div>
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Compare plans <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <UsageMeter resource="units" label="Units" />
          <UsageMeter resource="tenants" label="Tenants" />
          <UsageMeter resource="teamSeats" label="Seats" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {(Object.keys(PLANS) as PlanId[]).map((id) => {
            const p = PLANS[id];
            const active = id === planId;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setPlan(id)}
                className={`text-left p-4 rounded-xl ring-1 transition-all ${
                  active ? "ring-foreground bg-foreground/[0.04]" : "ring-border hover:ring-foreground/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-display font-medium">{p.name}</p>
                  {active && <Check className="size-4 text-success" />}
                </div>
                <p className="text-xs font-mono mt-1">{p.price}</p>
                <p className="text-[11px] text-muted-foreground mt-2">
                  {fmt(p.units)} units · {fmt(p.teamSeats)} seats
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Profile Form */}
      <section className="bg-surface ring-1 ring-border rounded-2xl p-6 space-y-5">
        <h2 className="font-display font-medium">Profile</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Name</label>
            <input
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              className="w-full px-3 py-2 bg-muted rounded-lg outline-none text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              className="w-full px-3 py-2 bg-muted rounded-lg outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg disabled:opacity-50"
            >
              {processing ? "Saving..." : "Save Profile"}
            </button>
            {recentlySuccessful && (
              <span className="text-xs text-success">Saved successfully.</span>
            )}
          </div>
        </form>
      </section>

      {/* Appearance */}
      <section className="bg-surface ring-1 ring-border rounded-2xl p-6 space-y-5">
        <h2 className="font-display font-medium">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-xs text-muted-foreground">Currently using {dark ? "dark" : "light"} mode</p>
          </div>
          <button
            type="button"
            onClick={toggle}
            className="inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm hover:bg-foreground/10 transition-colors cursor-pointer"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            Switch to {dark ? "light" : "dark"}
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-surface ring-1 ring-border rounded-2xl p-6 space-y-5">
        <h2 className="font-display font-medium">Notifications</h2>
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-medium">Email alerts</p>
            <p className="text-xs text-muted-foreground">New tickets, payments and messages</p>
          </div>
          <button
            type="button"
            onClick={() => setNotif(!notif)}
            className={`relative w-11 h-6 rounded-full transition-colors ${notif ? "bg-foreground" : "bg-muted"}`}
          >
            <span
              className={`absolute top-0.5 size-5 rounded-full bg-background transition-transform ${
                notif ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </label>
      </section>

      {/* Sign Out Link Component */}
      <div>
        <Link
          href="/logout"
          method="post"
          as="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-xl text-sm font-semibold hover:opacity-90 cursor-pointer"
        >
          <LogOut className="size-4" /> Sign out
        </Link>
      </div>
    </div>
  );
}

export default Settings;

Settings.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;