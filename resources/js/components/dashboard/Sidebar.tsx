import { router, Link, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Building2,
  Users,
  Wrench,
  MessageSquare,
  Wallet,
  Settings,
  ShieldCheck,
  UserCircle2,
  LogOut,
  X,
  Lock,
} from "lucide-react";

type NavItem = {
  to: string;
  icon: typeof Building2;
  label: string;
  exact?: boolean;
  permission?: string; // Optional Spatie permission requirement
  roles?: string[];     // Optional Spatie role restriction
};

const nav: NavItem[] = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/dashboard/properties", icon: Building2, label: "Properties" },
  { to: "/dashboard/tenants", icon: Users, label: "Tenants" },
  { to: "/dashboard/maintenance", icon: Wrench, label: "Maintenance" },
  { to: "/dashboard/messages", icon: MessageSquare, label: "Messages" },
  { to: "/dashboard/finance", icon: Wallet, label: "Finance" },
  { to: "/dashboard/verification", icon: ShieldCheck, label: "Verification" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
  {
    to: "/dashboard/roles-permissions",
    icon: Lock,
    label: "Roles & Permissions",
    // Only allow admin and landlord roles
    roles: ["admin", "landlord"],
  },
];

interface UserAuth {
  id: number;
  name: string;
  email: string;
  account_type: string;
  roles: string[];
  permissions: string[];
}

export function Sidebar({
  mobileOpen = false,
  onClose,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const { url: pathname, props } = usePage<{
    auth?: { user?: UserAuth | null };
  }>();

  const user = props.auth?.user ?? null;

  if (!user) {
    return null;
  }

  const userRoles = user.roles || [];
  const userPermissions = user.permissions || [];

  // Filter navigation items based on roles and permissions
  const visibleNav = nav.filter((item) => {
    // 1. Check role restriction
    if (item.roles && !item.roles.some((r) => userRoles.includes(r))) {
      return false;
    }
    // 2. Check permission restriction

    if (item.permission && !userPermissions.includes(item.permission)) {
      return false;
    }

    return true;
  });

  const accountType = user.account_type;

  const roleLabel =
    accountType === "landlord"
      ? "Landlord"
      : accountType === "tenant"
      ? "Tenant"
      : "Member";

  const initials =
    (user.name ?? "U")
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const handleSignOut = () => {
    router.post("/logout");
  };

  const content = (
    <>
      <div className="p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="size-4 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold tracking-tight text-lg">EstateOS</span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden size-8 flex items-center justify-center rounded-lg hover:bg-foreground/5"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {visibleNav.map(({ to, icon: Icon, label, exact }) => {
          const active = isActive(to, exact);
          
          return (
            <Link
              key={to}
              href={to}
              onClick={onClose}
              className={`w-full flex items-center gap-3 py-2 pr-3 pl-2 rounded-md text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-foreground/5 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
              }`}
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-sidebar-border space-y-1">
        <Link
          href="/tenant"
          onClick={onClose}
          className="w-full flex items-center gap-3 py-2 pr-3 pl-2 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03] transition-all"
        >
          <UserCircle2 className="size-4" />
          <span>View as tenant →</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 py-2 pr-3 pl-2 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03] transition-all"
        >
          <LogOut className="size-4" />
          <span>Sign out</span>
        </button>
        <div className="flex items-center gap-3 py-2 pr-3 pl-2 pt-3 mt-1 border-t border-sidebar-border">
          <div className="size-8 rounded-full bg-gradient-to-br from-foreground/20 to-foreground/5 flex items-center justify-center text-[11px] font-medium">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium leading-tight truncate">
              {user.name ?? "User"}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {roleLabel}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 glass-panel z-50 flex-col">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <aside
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-background border-r border-sidebar-border flex flex-col animate-reveal"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </aside>
        </div>
      )}
    </>
  );
}