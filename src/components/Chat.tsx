"use client";

import { useEffect, useRef, useState } from "react";
import { Paperclip, Mic, Send, Loader2, Bot, User, Phone, PhoneOff } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { v4 as uuidv4 } from "uuid";

type Role = "user" | "assistant" | "system";
type Message = { id: string; role: Role; content: string; createdAt: number };

const AssistantAvatar = () => (
  <div className="size-9 rounded-xl bg-blue-600/90 grid place-items-center shadow">
    <Bot className="size-5 text-white" />
  </div>
);

const UserAvatar = () => (
  <div className="size-9 rounded-xl bg-emerald-600/90 grid place-items-center shadow">
    <User className="size-5 text-white" />
  </div>
);

function ts(id?: number) {
  return new Date(id ?? Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content:
        "Hi! I'm your assistant powered by Vapi. You can type to me or click the microphone to start a voice conversation!",
      createdAt: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callStatus, setCallStatus] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const vapiRef = useRef<Vapi | null>(null);

  // Initialize Vapi
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (publicKey && !publicKey.includes('placeholder')) {
      vapiRef.current = new Vapi(publicKey);
      
      // Set up event listeners
      vapiRef.current.on("call-start", () => {
        setIsCallActive(true);
        setIsConnecting(false);
        setCallStatus("Connected");
      });

      vapiRef.current.on("call-end", () => {
        setIsCallActive(false);
        setIsConnecting(false);
        setCallStatus("");
      });

      vapiRef.current.on("volume-level", (_volume) => {
        // You can use this to show visual feedback for voice activity
      });

      vapiRef.current.on("message", (message) => {
        if (message.type === "transcript" && message.role === "user") {
          // Add user's spoken message to chat
          const userMsg: Message = {
            id: uuidv4(),
            role: "user",
            content: message.transcript,
            createdAt: Date.now(),
          };
          setMessages(prev => [...prev, userMsg]);
        } else if (message.type === "transcript" && message.role === "assistant") {
          // Add assistant's response to chat
          const assistantMsg: Message = {
            id: uuidv4(),
            role: "assistant",
            content: message.transcript,
            createdAt: Date.now(),
          };
          setMessages(prev => [...prev, assistantMsg]);
        }
      });

      vapiRef.current.on("error", (error) => {
        console.error("Vapi error:", error);
        setCallStatus("Error occurred");
        setIsCallActive(false);
        setIsConnecting(false);
      });
    }

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, assistantTyping]);

  const canSend = input.trim().length > 0 && !sending;
  const isVapiConfigured = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY && !process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY.includes('placeholder');

  async function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content) return;

    const userMsg: Message = {
      id: uuidv4(),
      role: "user",
      content,
      createdAt: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setAssistantTyping(true);
    setSending(true);

    try {
      // 🧩 Call your server-side Vapi proxy
      const res = await fetch("/api/vapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // You can pass any session/user metadata you want here
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("Network error");

      // Stream back assistant tokens for a snappy UX
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      const assistantId = uuidv4();
      const pushPartial = (partial: string) => {
        setMessages((prev) => {
          const without = prev.filter((m) => m.id !== assistantId);
          return [
            ...without,
            { id: assistantId, role: "assistant", content: partial, createdAt: Date.now() },
          ];
        });
      };

      // Read SSE-ish/plain chunks
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        pushPartial(acc);
      }

      setAssistantTyping(false);
    } catch (err) {
      console.error(err);
      setAssistantTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: uuidv4(),
          role: "assistant",
          content:
            "Hmm, I couldn’t reach the assistant. Check the `/api/vapi` route and your Vapi configuration.",
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  // Handle voice calls with Vapi
  async function handleMic() {
    if (!vapiRef.current) {
      const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
      if (!publicKey) {
        alert("Vapi is not configured. Please add your NEXT_PUBLIC_VAPI_PUBLIC_KEY to your environment variables.");
      } else if (publicKey.includes('placeholder')) {
        alert("Vapi is configured with placeholder values. Please replace the placeholder values in .env.local with your actual VAPI public key.");
      } else {
        alert("Vapi failed to initialize. Please check your configuration.");
      }
      return;
    }

    if (isCallActive) {
      // End the call
      vapiRef.current.stop();
      setCallStatus("Ending call...");
    } else {
      // Start a call
      setIsConnecting(true);
      setCallStatus("Connecting...");
      
      try {
        const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
        
        if (assistantId) {
          // Use configured assistant
          await vapiRef.current.start(assistantId);
        } else {
          // Use inline assistant configuration
          await vapiRef.current.start({
            name: "Voice Assistant",
            model: {
              provider: "openai",
              model: "gpt-4",
              messages: [
                {
                  role: "system",
                  content: "You are a helpful voice assistant. Keep responses concise and conversational.",
                },
              ],
            },
            voice: {
              provider: "playht",
              voiceId: "jennifer",
            },
          });
        }
      } catch (error) {
        console.error("Failed to start call:", error);
        setCallStatus("Failed to connect");
        setIsConnecting(false);
      }
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-3 sm:p-4 shadow-xl">
      {/* Call Status */}
      {(isCallActive || isConnecting || callStatus) && (
        <div className="mb-3 sm:mb-4">
          <div className={[
            "inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium",
            isCallActive 
              ? "bg-green-500/20 text-green-300 border border-green-400/30" 
              : isConnecting 
                ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
                : "bg-red-500/20 text-red-300 border border-red-400/30"
          ].join(" ")}>
            {isCallActive && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
            {isConnecting && <Loader2 className="w-4 h-4 animate-spin" />}
            <Phone className="w-4 h-4" />
            <span>{callStatus || (isCallActive ? "Voice call active" : "Connecting...")}</span>
          </div>
        </div>
      )}
      
      {/* Chat area */}
      <div
        ref={listRef}
        className="h-[60dvh] sm:h-[65dvh] overflow-y-auto rounded-2xl bg-black/20 p-3 sm:p-4 space-y-4"
      >
        {messages.map((m) => (
          <div key={m.id} className="flex gap-3 items-start">
            {m.role === "assistant" ? <AssistantAvatar /> : <UserAvatar />}
            <div className="max-w-[80%] sm:max-w-[75%]">
              <div
                className={[
                  "rounded-2xl px-4 py-3 text-sm sm:text-[0.95rem] leading-relaxed shadow",
                  m.role === "assistant"
                    ? "bg-white/95 text-black"
                    : "bg-emerald-600/90 text-white",
                ].join(" ")}
              >
                {m.content}
              </div>
              <div className="mt-1 text-[10px] text-white/40">{ts(m.createdAt)}</div>
            </div>
          </div>
        ))}

        {assistantTyping && (
          <div className="flex gap-3 items-start">
            <AssistantAvatar />
            <div className="rounded-2xl px-4 py-3 bg-white/90 text-black shadow">
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> thinking…
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="mt-3 sm:mt-4">
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <button
            type="button"
            title="Attach (not wired yet)"
            className="shrink-0 grid place-items-center rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition"
          >
            <Paperclip className="size-5 text-white/70" />
          </button>

          <div className="flex-1">
            <textarea
              className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none ring-0 focus:border-white/20 min-h-[46px] max-h-[180px]"
              placeholder="Type a message…"
              value={input}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (canSend) handleSend();
                }
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleMic}
            disabled={isConnecting || !isVapiConfigured}
            className={[
              "shrink-0 grid place-items-center rounded-xl border p-2 transition-all",
              !isVapiConfigured
                ? "bg-gray-500/20 border-gray-400/30 text-gray-400 cursor-not-allowed"
                : isCallActive 
                  ? "bg-red-500/20 border-red-400/30 hover:bg-red-500/30 text-red-300"
                  : isConnecting
                    ? "bg-yellow-500/20 border-yellow-400/30 text-yellow-300 cursor-not-allowed"
                    : "border-white/10 bg-white/5 hover:bg-white/10 text-white/70"
            ].join(" ")}
            title={
              !isVapiConfigured 
                ? "Voice agent not configured - check .env.local" 
                : isCallActive 
                  ? "End call" 
                  : isConnecting 
                    ? "Connecting..." 
                    : "Start voice call"
            }
          >
            {isConnecting ? (
              <Loader2 className="size-5 animate-spin" />
            ) : isCallActive ? (
              <PhoneOff className="size-5" />
            ) : (
              <Mic className="size-5" />
            )}
          </button>

          <button
            type="submit"
            disabled={!canSend}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-white shadow hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
            title="Send"
          >
            <Send className="size-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

        <p className="mt-2 text-center text-[11px] text-white/40">
          Powered by <span className="text-white/70">Vapi</span>. 
          {!isVapiConfigured 
            ? " Voice agent not configured - text chat only." 
            : isCallActive 
              ? " Voice call active - speak naturally!" 
              : " Click mic for voice or type below."
          }
        </p>
      </div>
    </div>
  );
}
