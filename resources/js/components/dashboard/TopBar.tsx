import { useEffect, useState, useRef } from 'react';
import {
    Search,
    Bell,
    Moon,
    Sun,
    Menu,
    Sparkles,
    CheckCircle2,
    AlertTriangle,
    Info,
    Check,
    Shield,
    CreditCard,
    X,
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { usePlan } from '@/hooks/use-plan';
import { usePage, router } from '@inertiajs/react';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type?: 'info' | 'warning' | 'success';
    roles?: string[];
}

interface DatabasePlan {
    id: string;
    name: string;
    price: string;
    unit: string;
    cta: string;
    featured: boolean;
    features: string[];
    includes: { t: string; d: string }[];
    not_included: string[];
}

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
    const { dark, toggle } = useTheme();
    const { plan, setPlan } = usePlan();

    const { props } = usePage<{
        auth?: {
            user?: {
                roles?: string[];
                permissions?: string[];
            } | null;
        };
        notifications?: Notification[];
        plans?: DatabasePlan[];
    }>();

    const plans = props.plans || [];
    const userRoles = props.auth?.user?.roles || [];

    const dropdownRef = useRef<HTMLDivElement>(null);

    const [mounted, setMounted] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<DatabasePlan | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const [notifications, setNotifications] = useState<Notification[]>(
        props.notifications || [
            {
                id: '1',
                title: 'New ID Document Verification',
                message: 'A new ID document is pending review in the queue.',
                time: '5m ago',
                read: false,
                type: 'warning',
                roles: ['admin', 'reviewer', 'landlord'],
            },
        ]
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (plans.length > 0 && !selectedPlan) {
            const defaultPlan = plans.find((p) => p.featured) || plans[0];
            setSelectedPlan(defaultPlan);
        }
    }, [plans]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenNotifications(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredNotifications = notifications.filter((item) => {
        if (!item.roles || item.roles.length === 0) return true;
        return item.roles.some((role) => userRoles.includes(role));
    });

    const unreadCount = filteredNotifications.filter((n) => !n.read).length;

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((n) =>
                filteredNotifications.some((fn) => fn.id === n.id)
                    ? { ...n, read: true }
                    : n
            )
        );
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlan) return;
        setIsProcessing(true);

        router.post(
            '/subscription/checkout',
            {
                plan: selectedPlan.id,
                payment_method: paymentMethod,
                phone_number: paymentMethod === 'mpesa' ? phoneNumber : undefined,
            },
            {
                onSuccess: () => {
                    setIsProcessing(false);
                    setShowUpgradeModal(false);
                    if (setPlan) setPlan(selectedPlan.name);
                },
                onError: () => {
                    setIsProcessing(false);
                },
                onFinish: () => {
                    setIsProcessing(false);
                },
            }
        );
    };

    const isFreePlan = selectedPlan?.price === '$0' || selectedPlan?.price?.toLowerCase() === 'free';

    return (
        <>
            <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/60 backdrop-blur-md">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 md:px-8">
                    <button
                        onClick={onMenuClick}
                        aria-label="Open menu"
                        className="flex size-9 items-center justify-center rounded-lg hover:bg-foreground/5 md:hidden"
                    >
                        <Menu className="size-5" />
                    </button>

                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <Search className="size-4 shrink-0 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search…"
                            className="w-full max-w-md border-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />
                        <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline-flex">
                            ⌘K
                        </kbd>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setShowUpgradeModal(true)}
                            className="hidden items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-[11px] font-medium tracking-widest text-primary uppercase transition-colors hover:bg-primary/20 sm:inline-flex"
                            title="Upgrade Plan"
                        >
                            <Sparkles className="size-3" />
                            {mounted ? (plan?.name ?? 'Starter') : 'Starter'} — Upgrade
                        </button>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setOpenNotifications(!openNotifications)}
                                className="relative flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-foreground/5"
                                aria-label="Notifications"
                            >
                                <Bell className="size-4" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 size-2 rounded-full bg-amber-500 ring-2 ring-background" />
                                )}
                            </button>

                            {openNotifications && (
                                <div className="absolute right-0 z-50 mt-2 w-80 animate-in overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg fade-in-50 zoom-in-95 sm:w-96">
                                    <div className="flex items-center justify-between border-b border-border bg-muted/30 p-3.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold">Notifications</span>
                                            {unreadCount > 0 && (
                                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                                    {unreadCount} new
                                                </span>
                                            )}
                                        </div>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>

                                    <div className="max-h-80 divide-y divide-border/50 overflow-y-auto">
                                        {filteredNotifications.length > 0 ? (
                                            filteredNotifications.map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => markAsRead(item.id)}
                                                    className={`flex cursor-pointer gap-3 p-3.5 text-left transition-colors hover:bg-muted/40 ${
                                                        !item.read ? 'bg-primary/[0.03]' : ''
                                                    }`}
                                                >
                                                    <div className="mt-0.5 shrink-0">
                                                        {item.type === 'warning' ? (
                                                            <AlertTriangle className="size-4 text-amber-500" />
                                                        ) : item.type === 'success' ? (
                                                            <CheckCircle2 className="size-4 text-emerald-500" />
                                                        ) : (
                                                            <Info className="size-4 text-sky-500" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="mb-0.5 flex items-center justify-between gap-2">
                                                            <span className="truncate text-xs font-semibold text-foreground">
                                                                {item.title}
                                                            </span>
                                                            <span className="shrink-0 text-[10px] text-muted-foreground">
                                                                {item.time}
                                                            </span>
                                                        </div>
                                                        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                                            {item.message}
                                                        </p>
                                                    </div>
                                                    {!item.read && (
                                                        <div className="size-1.5 shrink-0 self-center rounded-full bg-primary" />
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="space-y-1 p-8 text-center text-xs text-muted-foreground">
                                                <p className="font-medium text-foreground">No notifications</p>
                                                <p>You're all caught up for your role!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={toggle}
                            aria-label="Toggle theme"
                            className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-foreground/5"
                        >
                            {mounted && dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                        </button>
                    </div>
                </div>
            </header>

            {showUpgradeModal && (
                <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-xs fade-in-50">
                    <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl">
                        <button
                            onClick={() => setShowUpgradeModal(false)}
                            className="absolute top-4 right-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                            <X className="size-5" />
                        </button>

                        <div className="mb-6 text-center">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold tracking-wider text-primary uppercase">
                                <Sparkles className="size-3.5" /> Plan Tier Upgrade
                            </span>
                            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                                Upgrade Your Account
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Select a plan tier and complete payment to unlock features immediately.
                            </p>
                        </div>

                        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                            {plans.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedPlan(p)}
                                    className={`relative cursor-pointer rounded-xl border p-4 transition-all ${
                                        selectedPlan?.id === p.id
                                            ? 'border-primary bg-primary/[0.04] ring-1 ring-primary'
                                            : 'border-border hover:border-foreground/20'
                                    }`}
                                >
                                    {p.featured && (
                                        <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground uppercase">
                                            Featured
                                        </span>
                                    )}
                                    <h3 className="text-sm font-semibold">{p.name}</h3>
                                    <div className="my-2">
                                        <span className="text-2xl font-bold">{p.price}</span>
                                        <span className="text-xs text-muted-foreground">{p.unit}</span>
                                    </div>
                                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                                        {p.features.map((f, idx) => (
                                            <li key={idx} className="flex items-center gap-1.5">
                                                <Check className="size-3 shrink-0 text-emerald-500" />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {selectedPlan && !isFreePlan ? (
                            <form
                                onSubmit={handlePaymentSubmit}
                                className="space-y-4 rounded-xl border border-border bg-muted/30 p-4"
                            >
                                <div className="flex items-center justify-between border-b border-border pb-3">
                                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Checkout Summary
                                    </span>
                                    <span className="text-sm font-bold text-foreground">
                                        Selected: {selectedPlan.name} ({selectedPlan.price}
                                        {selectedPlan.unit})
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-foreground">
                                        Select Payment Method
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('mpesa')}
                                            className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                                                paymentMethod === 'mpesa'
                                                    ? 'border-emerald-500 bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400'
                                                    : 'border-border bg-background hover:bg-muted'
                                            }`}
                                        >
                                            <Shield className="size-4" /> M-Pesa STK Push
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('card')}
                                            className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                                                paymentMethod === 'card'
                                                    ? 'border-primary bg-primary/10 font-semibold text-primary'
                                                    : 'border-border bg-background hover:bg-muted'
                                            }`}
                                        >
                                            <CreditCard className="size-4" /> Card / PayPal
                                        </button>
                                    </div>
                                </div>

                                {paymentMethod === 'mpesa' && (
                                    <div className="space-y-1.5">
                                        <label htmlFor="phone" className="text-xs font-medium text-foreground">
                                            M-Pesa Phone Number
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            required
                                            placeholder="e.g. 0712345678"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                                        />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                                >
                                    {isProcessing
                                        ? 'Processing Payment...'
                                        : `Pay ${selectedPlan.price} & Upgrade Now`}
                                </button>
                            </form>
                        ) : (
                            <div className="rounded-xl border border-border bg-muted/20 p-4 text-center">
                                <p className="mb-3 text-xs text-muted-foreground">
                                    This plan does not require immediate payment.
                                </p>
                                <button
                                    onClick={() => setShowUpgradeModal(false)}
                                    className="rounded-lg bg-muted px-4 py-2 text-xs font-medium hover:bg-foreground/10"
                                >
                                    Continue
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}