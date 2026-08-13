import { useEffect, useState, useRef } from "react";
import { Search, Bell, Moon, Sun, Menu, Sparkles, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { usePlan } from "@/hooks/use-plan";
import { usePage, Link } from "@inertiajs/react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: "info" | "warning" | "success";
  roles?: string[]; // Specific roles that should see this notification
}

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { dark, toggle } = useTheme();
  const { plan, openUpgrade } = usePlan();
  
  // Guard client-side hydration values
  const [mounted, setMounted] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract shared user auth from Inertia
  const { props } = usePage<{
    auth?: { 
      user?: { 
        roles?: string[]; 
        permissions?: string[]; 
      } | null 
    };
    notifications?: Notification[]; // Optional backend shared notifications
  }>();

  const userRoles = props.auth?.user?.roles || [];

  // Example notifications (or fallback to shared backend props)
  const [notifications, setNotifications] = useState<Notification[]>(
    props.notifications || [
      {
        id: "1",
        title: "New ID Document Verification",
        message: "A new ID document is pending review in the queue.",
        time: "5m ago",
        read: false,
        type: "warning",
        roles: ["admin", "reviewer", "landlord"],
      },
      {
        id: "2",
        title: "Maintenance Ticket Created",
        message: "Unit 4B submitted a request for plumbing repairs.",
        time: "1h ago",
        read: false,
        type: "info",
        roles: ["landlord", "admin"],
      },
      {
        id: "3",
        title: "Rent Payment Received",
        message: "Rent for Unit 2A has been successfully processed.",
        time: "3h ago",
        read: true,
        type: "success",
        roles: ["landlord", "admin"],
      },
      {
        id: "4",
        title: "Lease Renewal Reminder",
        message: "Your current lease agreement expires in 30 days.",
        time: "1d ago",
        read: false,
        type: "info",
        roles: ["tenant"],
      },
    ]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter notifications relevant to current user's roles
  const filteredNotifications = notifications.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.some((role) => userRoles.includes(role));
  });

  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        filteredNotifications.some((fn) => fn.id === n.id) ? { ...n, read: true } : n
      )
    );
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <header className="h-16 border-b border-border bg-background/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center justify-between gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="md:hidden size-9 flex items-center justify-center rounded-lg hover:bg-foreground/5"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search…"
            className="bg-transparent border-none text-sm w-full max-w-md outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden md:inline-flex text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
            ⌘K
          </kbd>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openUpgrade()}
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest px-2.5 py-1.5 rounded-lg bg-muted hover:bg-foreground/10 transition-colors"
            title="Current plan"
          >
            <Sparkles className="size-3" />
            {mounted ? plan?.name ?? "Starter" : "Starter"}
          </button>

          {/* Notification Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenNotifications(!openNotifications)}
              className="size-9 flex items-center justify-center rounded-lg hover:bg-foreground/5 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 size-2 rounded-full bg-amber-500 ring-2 ring-background" />
              )}
            </button>

            {/* Dropdown Menu */}
            {openNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg z-50 overflow-hidden animate-in fade-in-50 zoom-in-95">
                <div className="p-3.5 border-b border-border flex items-center justify-between bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => markAsRead(item.id)}
                        className={`p-3.5 flex gap-3 text-left transition-colors cursor-pointer hover:bg-muted/40 ${
                          !item.read ? "bg-primary/[0.03]" : ""
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {item.type === "warning" ? (
                            <AlertTriangle className="size-4 text-amber-500" />
                          ) : item.type === "success" ? (
                            <CheckCircle2 className="size-4 text-emerald-500" />
                          ) : (
                            <Info className="size-4 text-sky-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="text-xs font-semibold text-foreground truncate">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {item.time}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {item.message}
                          </p>
                        </div>
                        {!item.read && (
                          <div className="self-center size-1.5 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
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
            className="size-9 flex items-center justify-center rounded-lg hover:bg-foreground/5 transition-colors"
          >
            {mounted && dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}