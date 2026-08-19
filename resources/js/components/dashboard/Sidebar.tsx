import { router, Link, usePage } from '@inertiajs/react';
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
} from 'lucide-react';

type NavItem = {
    to: string;
    icon: typeof Building2;
    label: string;
    exact?: boolean;
    permission?: string; // Optional Spatie permission requirement
    roles?: string[]; // Optional Spatie role restriction
};

const nav: NavItem[] = [
    {
        to: '/dashboard',
        icon: LayoutDashboard,
        label: 'Dashboard',
        exact: true,
    },
    { to: '/dashboard/properties', icon: Building2, label: 'Properties' },
    { to: '/dashboard/tenants', icon: Users, label: 'Tenants' },
    { to: '/dashboard/maintenance', icon: Wrench, label: 'Maintenance' },
    { to: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/dashboard/finance', icon: Wallet, label: 'Finance' },
    { to: '/dashboard/verification', icon: ShieldCheck, label: 'Verification' },
    {
        to: '/dashboard/users',
        icon: Users,
        label: 'Users',
        roles: ['admin'], // Restricted to admin users
    },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
    {
        to: '/dashboard/roles-permissions',
        icon: Lock,
        label: 'Roles & Permissions',
        roles: ['admin', 'landlord'],
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
        accountType === 'landlord'
            ? 'Landlord'
            : accountType === 'tenant'
              ? 'Tenant'
              : 'Member';

    const initials =
        (user.name ?? 'U')
            .split(' ')
            .filter(Boolean)
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'U';

    const isActive = (to: string, exact?: boolean) =>
        exact
            ? pathname === to
            : pathname === to || pathname.startsWith(to + '/');

    const handleSignOut = () => {
        router.post('/logout');
    };

    const content = (
        <>
            <div className="flex items-center justify-between p-6">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                        <Building2 className="size-4 text-primary-foreground" />
                    </div>
                    <span className="font-display text-lg font-semibold tracking-tight">
                        EstateOS
                    </span>
                </Link>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex size-8 items-center justify-center rounded-lg hover:bg-foreground/5 md:hidden"
                        aria-label="Close menu"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-4">
                {visibleNav.map(({ to, icon: Icon, label, exact }) => {
                    const active = isActive(to, exact);

                    return (
                        <Link
                            key={to}
                            href={to}
                            onClick={onClose}
                            className={`flex w-full items-center gap-3 rounded-md py-2 pr-3 pl-2 text-sm font-medium transition-all duration-200 ${
                                active
                                    ? 'bg-foreground/5 text-foreground'
                                    : 'text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground'
                            }`}
                        >
                            <Icon className="size-4" />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-1 border-t border-sidebar-border p-4">
                <Link
                    href="/tenant"
                    onClick={onClose}
                    className="flex w-full items-center gap-3 rounded-md py-2 pr-3 pl-2 text-xs font-medium text-muted-foreground transition-all hover:bg-foreground/[0.03] hover:text-foreground"
                >
                    <UserCircle2 className="size-4" />
                    <span>View as tenant →</span>
                </Link>
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-md py-2 pr-3 pl-2 text-xs font-medium text-muted-foreground transition-all hover:bg-foreground/[0.03] hover:text-foreground"
                >
                    <LogOut className="size-4" />
                    <span>Sign out</span>
                </button>

                <Link
    href={`/settings/profile/${user.id}`}
    onClick={onClose}
    className="group mt-1 flex cursor-pointer items-center gap-3 rounded-lg border-t border-sidebar-border py-2 pt-3 pr-3 pl-2 transition-all hover:bg-foreground/[0.03]"
>
    <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-foreground/20 to-foreground/5 text-[11px] font-medium transition-transform group-hover:scale-105">
        {initials}
    </div>
    <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium leading-tight transition-colors group-hover:text-primary">
            {user.name ?? 'User'}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {roleLabel}
        </span>
    </div>
</Link>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop */}
            <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col glass-panel md:flex">
                {content}
            </aside>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                >
                    <aside
                        className="animate-reveal absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-sidebar-border bg-background"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {content}
                    </aside>
                </div>
            )}
        </>
    );
}
