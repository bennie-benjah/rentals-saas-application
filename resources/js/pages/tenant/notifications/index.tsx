import React from 'react';
import { TenantShell } from '@/components/tenant/TenantShell';
import { Bell, CheckCircle2 } from 'lucide-react';
import { router } from '@inertiajs/react';

interface NotificationItem {
  id: string;
  data: {
    title?: string;
    message?: string;
  };
  read_at: string | null;
  created_at: string;
}

export default function NotificationsIndex({ notifications }: { notifications: { data: NotificationItem[] } }) {
  const markAsRead = (id: string) => {
    router.post(`/tenant/notifications/${id}/read`);
  };

  return (
   
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">Stay updated on lease updates, rent payments, and maintenance.</p>
        </div>

        {notifications.data.length === 0 ? (
          <div className="p-8 text-center border rounded-lg bg-card text-muted-foreground">
            <Bell className="size-8 mx-auto mb-2 opacity-50" />
            <p>No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.data.map((item) => (
              <div
                key={item.id}
                className={`p-4 border rounded-lg flex items-start justify-between gap-4 transition-colors ${
                  item.read_at ? 'bg-background opacity-75' : 'bg-accent/10 border-accent/20'
                }`}
              >
                <div className="space-y-1">
                  <p className="font-medium text-sm">{item.data.title || 'System Notification'}</p>
                  <p className="text-xs text-muted-foreground">{item.data.message}</p>
                  <span className="text-[10px] text-muted-foreground block pt-1">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                {!item.read_at && (
                  <button
                    onClick={() => markAsRead(item.id)}
                    className="text-xs flex items-center gap-1 text-primary hover:underline"
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>Mark Read</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
   
  );
}
