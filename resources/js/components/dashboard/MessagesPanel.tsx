import { Link } from "@inertiajs/react";

export type MessageItem = {
  id: number;
  name: string;
  tag: string;
  body: string;
  unread?: boolean;
};

interface MessagesPanelProps {
  recentMessages?: MessageItem[];
}

export function MessagesPanel({ recentMessages = [] }: MessagesPanelProps) {
  const safeMessages = Array.isArray(recentMessages) ? recentMessages : [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6 bg-surface rounded-2xl ring-1 ring-border flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-medium text-lg">Recent Messages</h2>
        <span className="size-2 rounded-full bg-success animate-pulse" />
      </div>

      <div className="space-y-5 flex-1">
        {safeMessages.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">No recent messages</p>
        ) : (
          safeMessages.map((m) => (
            <Link
              key={m.id}
              href={`/dashboard/messages?active=${m.id}`}
              className="flex gap-3 group cursor-pointer"
            >
              <div className="size-8 rounded-full bg-muted shrink-0 relative flex items-center justify-center font-medium text-xs text-foreground">
                {getInitials(m.name)}
                {m.unread && (
                  <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-warning ring-2 ring-surface" />
                )}
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-sm font-medium leading-none flex items-center justify-between">
                  <span>{m.name}</span>
                  <span className="text-[10px] text-muted-foreground font-normal ml-2">{m.tag}</span>
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors">
                  {m.body}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      <Link
        href="/dashboard/messages"
        className="w-full mt-6 py-2 text-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        View all activity →
      </Link>
    </div>
  );
}