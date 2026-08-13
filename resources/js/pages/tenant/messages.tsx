import type { ReactNode } from "react";
import { useState } from "react";
import { Send } from "lucide-react";
import TenantLayout from "@/layouts/tenant-layout";

interface MessageItem {
  id: number;
  sender_id: number;
  from: "me" | "them";
  body: string;
  time: string;
}

interface ActiveConversation {
  id: number;
  name: string;
}

interface MessagesProps {
  currentUserId: number;
  activeConversation: ActiveConversation | null;
  initialMessages: MessageItem[];
}

function Messages({ currentUserId, activeConversation, initialMessages = [] }: MessagesProps) {
  const [msgs, setMsgs] = useState<MessageItem[]>(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeConversation || sending) return;

    const messageBody = text;
    setText("");
    setSending(true);

    try {
      const response = await fetch(`/conversations/${activeConversation.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN":
            (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
          Accept: "application/json",
        },
        body: JSON.stringify({ body: messageBody }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMsgs((prev) => [...prev, newMessage]);
      }
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4 pb-4 border-b border-border">
        <div className="size-12 rounded-full bg-gradient-to-br from-foreground/20 to-foreground/5 flex items-center justify-center font-bold text-sm">
          {activeConversation?.name?.charAt(0) || "M"}
        </div>
        <div>
          <h1 className="font-display text-xl font-medium">
            {activeConversation?.name || "Property Manager"}
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-success" /> Property Manager · Online
          </p>
        </div>
      </header>

      <section className="space-y-4 min-h-[40vh]">
        {msgs.length > 0 ? (
          msgs.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[80%] space-y-1">
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm ${
                    m.sender_id === currentUserId
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-surface ring-1 ring-border rounded-bl-sm"
                  }`}
                >
                  {m.body}
                </div>
                <p
                  className={`text-[10px] text-muted-foreground px-1 ${
                    m.sender_id === currentUserId ? "text-right" : ""
                  }`}
                >
                  {m.time}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground text-center py-12">
            No messages yet. Send a message to get in touch.
          </p>
        )}
      </section>

      <form
        onSubmit={send}
        className="sticky bottom-20 md:bottom-4 flex gap-2 p-2 bg-surface rounded-2xl ring-1 ring-border"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message…"
          className="flex-1 bg-transparent px-3 py-2 outline-none text-sm"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending || !activeConversation}
          className="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}

export default Messages;

Messages.layout = (page: ReactNode) => <TenantLayout>{page}</TenantLayout>;