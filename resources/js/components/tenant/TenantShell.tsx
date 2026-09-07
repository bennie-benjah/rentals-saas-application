import type { ReactNode } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    Home,
    Wrench,
    MessageSquare,
    FileText,
    CreditCard,
    LogOut,
    Moon,
    Sun,
    ShieldCheck,
    Settings,
    Bell,
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { CompleteProfileBanner } from '@/components/CompleteProfileBanner';
import { SupportDrawer } from '../dashboard/SupportDrawer';

type NavItem = {
    to: string;
    icon: typeof Home;
    label: string;
    exact?: boolean;
};

// Menu items remain fixed across all domains
const mainNav: NavItem[] = [
    { to: '/tenant', icon: Home, label: 'Home', exact: true },
    { to: '/tenant/pay', icon: CreditCard, label: 'Pay Rent' },
    { to: '/tenant/maintenance', icon: Wrench, label: 'Maintenance' },
    { to: '/tenant/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/tenant/lease', icon: FileText, label: 'Lease' },
];

interface DomainProps {
    name?: string;
    logo?: string;
}

interface UserProps {
    name: string;
    email: string;
    unit_label?: string;
    roles?: string[];
    unread_notifications_count?: number;
}

export function TenantShell({ children }: { children: React.ReactNode }) {
    const { url: pathname, props } = usePage();
    const { dark, toggle } = useTheme();

    const auth = props.auth as { user?: UserProps };
    const domain = (props.domain as DomainProps) || {};
    const user = auth?.user;

    const isReviewer = user?.roles?.includes('reviewer');
    const unreadCount = user?.unread_notifications_count || 0;

    const siteName = domain.name || 'EstateOS';
    const siteLogo = domain.logo;

    const handleLogout = () => {
        router.post('/logout');
    };

    const isActive = (to: string, exact?: boolean) =>
        exact
            ? pathname === to
            : pathname === to || pathname.startsWith(to + '/');

    return (
        <div className="min-h-screen bg-background pb-24 text-foreground md:pb-0 md:pl-64">
            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-sidebar-border glass-panel md:flex">
                {/* Header Branding (Domain Specific) */}
                <div className="flex items-center justify-between p-6">
                    <Link href="/" className="flex items-center gap-3">
                        {siteLogo ? (
                            <img
                                src={siteLogo}
                                alt={siteName}
                                className="size-8 rounded-lg object-contain"
                            />
                        ) : (
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                                <Home className="size-4 text-primary-foreground" />
                            </div>
                        )}
                        <div className="flex flex-col leading-tight">
                            <span className="font-display truncate max-w-[120px] text-base font-semibold tracking-tight">
                                {siteName}
                            </span>
                            <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
                                Tenant
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Notifications Button */}
                    <Link
                        href="/tenant/notifications"
                        aria-label="Notifications"
                        className="relative flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                    >
                        <Bell className="size-4" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 size-2 animate-pulse rounded-full bg-destructive" />
                        )}
                    </Link>
                </div>

                {isReviewer && (
                    <div className="mb-2 px-4">
                        <Link
                            href="/dashboard"
                            className="flex w-full items-center justify-between rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-600 transition-all hover:bg-amber-500/20 dark:text-amber-400"
                        >
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="size-4" />
                                <span>View as Reviewer</span>
                            </div>
                            <span className="text-[10px] font-semibold tracking-wider uppercase">
                                Dashboard
                            </span>
                        </Link>
                    </div>
                )}

                {/* Main Navigation (Identical for all domains) */}
                <nav className="flex-1 space-y-1 px-4">
                    {mainNav.map(({ to, icon: Icon, label, exact }) => {
                        const active = isActive(to, exact);

                        return (
                            <Link
                                key={to}
                                href={to}
                                className={`flex items-center gap-3 rounded-md py-2 pr-3 pl-2 text-sm font-medium transition-all duration-200 ${
                                    active
                                        ? 'bg-foreground/5 text-foreground'
                                        : 'text-muted-foreground hover:bg-foreground/3 hover:text-foreground'
                                }`}
                            >
                                <Icon className="size-4" />
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Navigation & User Profile */}
                <div className="mt-auto space-y-1 border-t border-sidebar-border p-4">
                    <Link
                        href="/settings/profile"
                        className={`flex w-full items-center gap-3 rounded-md py-2 pr-3 pl-2 text-xs font-medium transition-all ${
                            isActive('/settings/profile')
                                ? 'bg-foreground/5 text-foreground'
                                : 'text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground'
                        }`}
                    >
                        <Settings className="size-4" />
                        <span>Settings</span>
                    </Link>

                    <button
                        onClick={toggle}
                        className="flex w-full items-center gap-3 rounded-md py-2 pr-3 pl-2 text-xs font-medium text-muted-foreground transition-all hover:bg-foreground/[0.03] hover:text-foreground"
                    >
                        {dark ? (
                            <Sun className="size-4" />
                        ) : (
                            <Moon className="size-4" />
                        )}
                        <span>{dark ? 'Light mode' : 'Dark mode'}</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-md py-2 pr-3 pl-2 text-xs font-medium text-muted-foreground transition-all hover:bg-foreground/[0.03] hover:text-foreground"
                    >
                        <LogOut className="size-4" />
                        <span>Sign out</span>
                    </button>

                    <Link
                        href="/settings/profile"
                        className="group mt-1 flex items-center gap-3 rounded-md border-t border-sidebar-border py-2 pt-3 pr-3 pl-2 transition-colors hover:bg-foreground/[0.02]"
                    >
                        <div className="flex size-8 items-center justify-center rounded-full bg-linear-to-br from-foreground/20 to-foreground/5 text-xs font-semibold uppercase">
                            {user?.name ? user.name.charAt(0) : 'T'}
                        </div>
                        <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm leading-tight font-medium transition-colors group-hover:text-primary">
                                {user?.name || 'Tenant'}
                            </span>
                            <span className="truncate text-[10px] tracking-wider text-muted-foreground uppercase">
                                {user?.unit_label || 'Active Tenant'}
                            </span>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header Branding */}
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:hidden">
                <Link href="/" className="flex items-center gap-2">
                    {siteLogo ? (
                        <img
                            src={siteLogo}
                            alt={siteName}
                            className="size-7 rounded-md object-contain"
                        />
                    ) : (
                        <div className="flex size-7 items-center justify-center rounded-md bg-primary">
                            <Home className="size-3.5 text-primary-foreground" />
                        </div>
                    )}
                    <span className="font-display truncate max-w-[140px] text-sm font-semibold">
                        {siteName}
                    </span>
                </Link>

                <div className="flex items-center gap-1">
                    {isReviewer && (
                        <Link
                            href="/dashboard"
                            className="mr-1 inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 transition-all hover:bg-amber-500/20 dark:text-amber-400"
                        >
                            <ShieldCheck className="size-3.5" />
                            <span>Review</span>
                        </Link>
                    )}

                    <Link
                        href="/tenant/notifications"
                        aria-label="Notifications"
                        className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                    >
                        <Bell className="size-4" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 size-2 animate-pulse rounded-full bg-destructive" />
                        )}
                    </Link>

                    <Link
                        href="/settings/profile"
                        aria-label="Settings"
                        className={`flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-foreground/5 ${
                            isActive('/settings/profile')
                                ? 'bg-foreground/5 text-foreground'
                                : 'text-muted-foreground'
                        }`}
                    >
                        <Settings className="size-4" />
                    </Link>

                    <button
                        onClick={toggle}
                        aria-label="Toggle theme"
                        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                    >
                        {dark ? (
                            <Sun className="size-4" />
                        ) : (
                            <Moon className="size-4" />
                        )}
                    </button>
                    <button
                        onClick={handleLogout}
                        aria-label="Sign out"
                        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                    >
                        <LogOut className="size-4" />
                    </button>
                </div>
            </header>

            <CompleteProfileBanner />

            <main className="animate-reveal mx-auto max-w-3xl ~768px px-5 py-6 md:px-10 md:py-12">
                {children}
            </main>

            {/* Mobile Bottom Navigation (Identical for all domains) */}
            <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-sidebar-border glass-panel md:hidden">
                <div className="flex items-center justify-around px-1 py-1.5">
                    {mainNav.map(({ to, icon: Icon, label, exact }) => {
                        const active = isActive(to, exact);

                        return (
                            <Link
                                key={to}
                                href={to}
                                className={`flex flex-col items-center gap-0.5 rounded-md px-2 py-1 transition-colors ${
                                    active
                                        ? 'font-medium text-foreground'
                                        : 'text-muted-foreground'
                                }`}
                            >
                                <Icon className="size-5" />
                                <span className="text-[10px]">{label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Floating Support & AI Drawer */}
            <SupportDrawer />
        </div>
    );
}
