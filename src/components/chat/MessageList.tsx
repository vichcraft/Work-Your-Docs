// Message list component for displaying chat messages

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import type { Message } from "../../types";
import { formatTime } from "../../lib/utils";
import { AssistantAvatar, UserAvatar } from "./ChatAvatars";

interface MessageListProps {
  messages: Message[];
  assistantTyping: boolean;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, assistantTyping }, ref) => {
    return (
      <div
        ref={ref}
        className="h-[60dvh] sm:h-[65dvh] overflow-y-auto rounded-2xl bg-black/20 p-3 sm:p-4 space-y-4"
      >
        {messages.map((m) => (
          <div key={m.id} className="flex items-start gap-3">
            {m.role === "assistant" ? <AssistantAvatar /> : <UserAvatar />}
            <div className="flex-1 min-w-0">
              <div
                className={[
                  "rounded-xl px-3 py-2 text-sm leading-relaxed shadow-sm",
                  m.role === "assistant"
                    ? "bg-white/10 text-white/90 border border-white/10"
                    : "bg-emerald-600/90 text-white",
                ].join(" ")}
              >
                {m.content}
              </div>
              <div className="mt-1 text-[10px] text-white/40">{formatTime(m.createdAt)}</div>
            </div>
          </div>
        ))}

        {assistantTyping && (
          <div className="flex items-start gap-3">
            <AssistantAvatar />
            <div className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm text-white/90 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-white/60">Assistant is typing...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

MessageList.displayName = "MessageList";
