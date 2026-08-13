import { Link, usePage, router } from "@inertiajs/react";
import { Home, Wrench, MessageSquare, FileText, CreditCard, LogOut, Moon, Sun, ShieldCheck } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

type NavItem = { to: string; icon: typeof Home; label: string; exact?: boolean };
const nav: NavItem[] = [
  { to: "/tenant", icon: Home, label: "Home", exact: true },
  { to: "/tenant/pay", icon: CreditCard, label: "Pay Rent" },
  { to: "/tenant/maintenance", icon: Wrench, label: "Maintenance" },
  { to: "/tenant/messages", icon: MessageSquare, label: "Messages" },
  { to: "/tenant/lease", icon: FileText, label: "Lease" },
];

interface UserProps {
  name: string;
  email: string;
  unit_label?: string;
  roles?: string[];
}

export function TenantShell({ children }: { children: React.ReactNode }) {
  // Get pathname and global auth user from Inertia
  const { url: pathname, props } = usePage();
  const { dark, toggle } = useTheme();

  // Extract shared user data from Inertia middleware (HandleInertiaRequests)
  const auth = props.auth as { user?: UserProps };
  const user = auth?.user;

  // Check if current user has reviewer permissions
  const isReviewer = user?.roles?.includes("reviewer");

  const handleLogout = () => {
    router.post("/logout");
  };

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-0 md:pl-64">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 glass-panel z-50 flex-col">
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <Home className="size-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-semibold tracking-tight text-base">EstateOS</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Tenant</span>
            </div>
          </Link>
        </div>

        {/* Desktop Reviewer Link -> /dashboard */}
        {isReviewer && (
          <div className="px-4 mb-2">
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-between py-2 px-3 rounded-md text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4" />
                <span>View as Reviewer</span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Dashboard</span>
            </Link>
          </div>
        )}

        <nav className="flex-1 px-4 space-y-1">
          {nav.map(({ to, icon: Icon, label, exact }) => {
            const active = isActive(to, exact);

            return (
              <Link
                key={to}
                href={to}
                className={`flex items-center gap-3 py-2 pr-3 pl-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-foreground/5 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/3"
                }`}
              >
                <Icon className="size-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-sidebar-border space-y-1">
          <button
            onClick={toggle}
            className="w-full flex items-center gap-3 py-2 pr-3 pl-2 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03] transition-all"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            <span>{dark ? "Light mode" : "Dark mode"}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-2 pr-3 pl-2 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03] transition-all"
          >
            <LogOut className="size-4" />
            <span>Sign out</span>
          </button>
          <div className="flex items-center gap-3 py-2 pr-3 pl-2 pt-3 mt-1 border-t border-sidebar-border">
            <div className="size-8 rounded-full bg-linear-to-br from-foreground/20 to-foreground/5 flex items-center justify-center text-xs font-semibold uppercase">
              {user?.name ? user.name.charAt(0) : "T"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-tight">{user?.name || "Tenant"}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {user?.unit_label || "Active Tenant"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-40 h-14 px-4 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-primary flex items-center justify-center">
            <Home className="size-3.5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-sm">EstateOS</span>
        </Link>
        <div className="flex items-center gap-1.5">
          {/* Mobile Reviewer Badge Link -> /dashboard */}
          {isReviewer && (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
            >
              <ShieldCheck className="size-3.5" />
              <span>Review Documents</span>
            </Link>
          )}

          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="size-9 flex items-center justify-center rounded-lg hover:bg-foreground/5"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="size-9 flex items-center justify-center rounded-lg hover:bg-foreground/5"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 md:px-8 py-6 md:py-12 animate-reveal">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 glass-panel border-t border-sidebar-border">
        <div className="flex items-center justify-around px-2 py-2">
          {nav.map(({ to, icon: Icon, label, exact }) => {
            const active = isActive(to, exact);

            return (
              <Link
                key={to}
                href={to}
                className={`flex flex-col items-center gap-1 py-1.5 px-2 rounded-md transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="size-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}