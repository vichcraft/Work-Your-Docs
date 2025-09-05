// Chat input component with text and voice input capabilities

import { useState, KeyboardEvent } from "react";
import { Paperclip, Mic, Send, PhoneOff, Loader2 } from "lucide-react";
import type { VoiceCallState } from "../../hooks/useVapiVoiceCall";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStartCall: () => void;
  sending: boolean;
  voiceState: VoiceCallState;
}

export function ChatInput({ onSendMessage, onStartCall, sending, voiceState }: ChatInputProps) {
  const [input, setInput] = useState("");
  
  const canSend = input.trim().length > 0 && !sending;
  const { isCallActive, isConnecting } = voiceState;

  const handleSend = () => {
    if (!canSend) return;
    
    const message = input.trim();
    setInput("");
    onSendMessage(message);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mt-4 flex items-end gap-3">
      {/* Attachment button */}
      <button
        type="button"
        className="shrink-0 grid place-items-center rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition"
        title="Attach file (coming soon)"
      >
        <Paperclip className="size-5 text-white/70" />
      </button>

      {/* Text input */}
      <div className="flex-1 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your documentation..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/20 focus:bg-white/10 focus:outline-none resize-none"
          rows={1}
          style={{
            minHeight: "44px",
            maxHeight: "120px",
            height: Math.min(44 + (input.split('\n').length - 1) * 20, 120),
          }}
        />
      </div>

      {/* Voice call button */}
      <button
        type="button"
        onClick={onStartCall}
        disabled={isConnecting}
        className={[
          "shrink-0 grid place-items-center rounded-xl border p-2 transition-all",
          isCallActive 
            ? "bg-red-500/20 border-red-400/30 hover:bg-red-500/30 text-red-300"
            : isConnecting
              ? "bg-yellow-500/20 border-yellow-400/30 text-yellow-300 cursor-not-allowed"
              : "border-white/10 bg-white/5 hover:bg-white/10 text-white/70"
        ].join(" ")}
        title={isCallActive ? "End call" : isConnecting ? "Connecting..." : "Start voice call"}
      >
        {isConnecting ? (
          <Loader2 className="size-5 animate-spin" />
        ) : isCallActive ? (
          <PhoneOff className="size-5" />
        ) : (
          <Mic className="size-5" />
        )}
      </button>

      {/* Send button */}
      <button
        type="button"
        onClick={handleSend}
        disabled={!canSend}
        className={[
          "shrink-0 grid place-items-center rounded-xl border p-2 transition-all",
          canSend
            ? "border-emerald-400/30 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
            : "border-white/10 bg-white/5 text-white/40 cursor-not-allowed"
        ].join(" ")}
        title="Send message"
      >
        {sending ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
      </button>
    </div>
  );
}
