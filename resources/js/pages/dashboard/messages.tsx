import type { ReactNode } from "react";
import { useState, useEffect, FormEvent } from "react";
import { Send, Search, Loader2 } from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";

interface ConversationItem {
  id: number;
  name: string;
  unit: string;
  last: string;
  time: string;
  unread?: boolean;
}

interface MessageItem {
  id: number;
  sender_id: number;
  body: string;
  time: string;
}

interface MessagesPageProps {
  conversations?: ConversationItem[];
  currentUserId: number;
}

function MessagesPage({ conversations = [], currentUserId }: MessagesPageProps) {
  const [threads, setThreads] = useState<ConversationItem[]>(conversations);
  const [activeId, setActiveId] = useState<number | null>(conversations[0]?.id ?? null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setThreads(conversations);
    if (conversations.length > 0 && activeId === null) {
      setActiveId(conversations[0].id);
    }
  }, [conversations]);

  // Fetch conversation messages using route matching web.php: /conversations/{id}
  useEffect(() => {
    if (!activeId) return;

    setLoading(true);
    fetch(`/conversations/${activeId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load messages", err);
        setLoading(false);
      });
  }, [activeId]);

  const activeThread = threads.find((t) => t.id === activeId);

  const filteredThreads = threads.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.unit.toLowerCase().includes(search.toLowerCase())
  );

  // Send message using route matching web.php: /conversations/{id}/messages
  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeId || sending) return;

    const payload = text;
    setText("");
    setSending(true);

    try {
      const response = await fetch(`/conversations/${activeId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN":
            (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify({ body: payload }),
      });

      if (response.ok) {
        const newMessage: MessageItem = await response.json();
        setMessages((prev) => [...prev, newMessage]);

        // Update local list preview text
        setThreads((prev) =>
          prev.map((t) =>
            t.id === activeId ? { ...t, last: payload, time: "Just now", unread: false } : t
          )
        );
      }
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-medium tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">Unified landlord–tenant stream</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:h-[calc(100vh-14rem)]">
        {/* Threads Sidebar */}
        <aside className="lg:col-span-4 bg-surface ring-1 ring-border rounded-2xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border flex items-center gap-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          <ul className="overflow-y-auto divide-y divide-border flex-1">
            {filteredThreads.length === 0 ? (
              <li className="p-4 text-center text-xs text-muted-foreground">
                No conversations found.
              </li>
            ) : (
              filteredThreads.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setActiveId(t.id)}
                    className={`w-full text-left p-4 flex gap-3 transition-colors ${
                      activeId === t.id ? "bg-foreground/[0.04]" : "hover:bg-foreground/[0.02]"
                    }`}
                  >
                    <div className="size-9 rounded-full bg-gradient-to-br from-foreground/20 to-foreground/5 shrink-0 relative flex items-center justify-center font-medium text-xs">
                      {t.name.charAt(0)}
                      {t.unread && (
                        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-warning ring-2 ring-surface" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-medium truncate">{t.name}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{t.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{t.unit}</p>
                      <p className="text-xs text-muted-foreground truncate mt-1">{t.last}</p>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </aside>

        {/* Message Details */}
        <section className="lg:col-span-8 bg-surface ring-1 ring-border rounded-2xl flex flex-col min-h-[60vh]">
          {activeThread ? (
            <>
              <header className="p-4 border-b border-border flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-to-br from-foreground/20 to-foreground/5 flex items-center justify-center font-medium">
                  {activeThread.name.charAt(0)}
                </div>
                <div>
                  <p className="font-display font-medium">{activeThread.name}</p>
                  <p className="text-[11px] text-muted-foreground">{activeThread.unit}</p>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {loading ? (
                  <div className="flex justify-center items-center h-full text-muted-foreground">
                    <Loader2 className="size-5 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-xs text-muted-foreground">
                    No messages in this conversation yet.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.sender_id === currentUserId;
                    return (
                      <div
                        key={m.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                            isMe
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-muted rounded-bl-sm"
                          }`}
                        >
                          <p>{m.body}</p>
                          <span
                            className={`block text-[9px] mt-1 text-right opacity-70 ${
                              isMe ? "text-primary-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {m.time}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 bg-muted rounded-xl px-4 py-2.5 outline-none text-sm"
                />
                <button
                  type="submit"
                  disabled={!text.trim() || sending}
                  className="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40"
                >
                  {sending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default MessagesPage;

MessagesPage.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;