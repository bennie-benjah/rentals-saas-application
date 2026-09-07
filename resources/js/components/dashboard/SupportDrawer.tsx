import { useState, useRef, useEffect, type FormEvent } from "react";
import { usePage } from "@inertiajs/react";
import {
  Bot,
  Send,
  X,
  Sparkles,
  Building2,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  CreditCard,
  Wrench,
  FileText
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "agent";
  text: string;
  timestamp: string;
}

interface UserProps {
  id: number;
  name: string;
  email: string;
  account_type?: string;
  role?: string;
}

// Presets tailored specifically for Landlords
const LANDLORD_PRESETS = [
  {
    id: "pnl_analysis",
    icon: TrendingUp,
    label: "Analyze Profit & Loss",
    prompt: "Can you analyze my revenue vs expenses for this month and highlight any anomalies?",
  },
  {
    id: "occupancy_help",
    icon: Building2,
    label: "Occupancy & Leases",
    prompt: "What is my current lease expiration timeline for the next 90 days?",
  },
  {
    id: "maintenance_insights",
    icon: AlertTriangle,
    label: "Maintenance Cost Summary",
    prompt: "Which properties have the highest maintenance expenses right now?",
  },
  {
    id: "human_support",
    icon: HelpCircle,
    label: "Talk to Human Support",
    prompt: "I need assistance with platform setup or billing.",
  },
];

// Presets tailored specifically for Tenants
const TENANT_PRESETS = [
  {
    id: "pay_rent",
    icon: CreditCard,
    label: "Rent & Payments",
    prompt: "How can I view my recent rent invoices or set up automated payments?",
  },
  {
    id: "maintenance_request",
    icon: Wrench,
    label: "Report Maintenance Issue",
    prompt: "How do I submit a new maintenance request or track open issues?",
  },
  {
    id: "lease_details",
    icon: FileText,
    label: "Lease & Documents",
    prompt: "Where can I view my active lease terms and download property documents?",
  },
  {
    id: "support",
    icon: HelpCircle,
    label: "Contact Property Manager",
    prompt: "I have a general question regarding my tenancy.",
  },
];

export function SupportDrawer() {
  const { auth } = usePage<{ auth: { user: UserProps } }>().props;
  const user = auth?.user;

  // Determine user details and role status
  const userName = user?.name ? user.name.split(" ")[0] : "User";
  const userAccountType = (user?.account_type || user?.role || "user").toLowerCase();
  const isTenant = userAccountType === "tenant";

  const userRoleTitle = isTenant ? "TENANT" : "LANDLORD";
  const presetOptions = isTenant ? TENANT_PRESETS : LANDLORD_PRESETS;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `I've received your request regarding: "${textToSend}". Fetching your account details...`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 z-40 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl transition-all hover:bg-slate-800 hover:scale-105 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white md:bottom-6"
        aria-label="Open AI Assistant & Support"
      >
        <Sparkles className="h-4 w-4 text-amber-400" />
        <span>Ask AI / Support</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-md border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      EstateOS AI & Support
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isTenant ? "Tenant Assistant & Support" : "Portfolio Analysis & Live Help"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="space-y-4 py-2">
                    {/* Dynamic Welcome Card */}
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                        Welcome, {userRoleTitle} {userName}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {isTenant
                          ? "How can we assist you with your rental, lease, or maintenance today?"
                          : "Select an option below to analyze your metrics or describe what you need assistance with."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-500 px-1">How can I help today?</p>
                      {presetOptions.map((option) => {
                        const Icon = option.icon;
                        
                        return (
                          <button
                            key={option.id}
                            onClick={() => handleSendMessage(option.prompt)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white text-left hover:border-slate-400 hover:bg-slate-50 transition-all dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-800/60"
                          >
                            <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-900 dark:text-slate-200">
                                {option.label}
                              </p>
                              <p className="text-[11px] text-slate-500 line-clamp-1">
                                {option.prompt}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.sender !== "user" && (
                        <div className="h-7 w-7 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center text-xs font-medium shrink-0">
                          AI
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                            : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="block mt-1 text-[10px] opacity-60 text-right">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                )}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Bot className="h-4 w-4 animate-bounce" />
                    <span>Processing request...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Footer */}
              <form onSubmit={handleSubmit} className="border-t border-slate-200 p-3 dark:border-slate-800">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask AI or write a message..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-10 text-xs text-slate-900 focus:border-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="absolute right-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 disabled:opacity-40 dark:hover:text-white"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
