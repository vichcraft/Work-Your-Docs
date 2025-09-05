// Main chat container component

import { useEffect, useRef } from "react";
import { useMessages } from "../../hooks/useMessages";
import { useVapiVoiceCall } from "../../hooks/useVapiVoiceCall";
import { VoiceCallStatus } from "./VoiceCallStatus";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

export default function ChatContainer() {
  const listRef = useRef<HTMLDivElement>(null);
  
  // Custom hooks for state management
  const { messages, sending, assistantTyping, sendMessage, addReceivedMessage } = useMessages();
  const { voiceState, startCall } = useVapiVoiceCall(addReceivedMessage);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    listRef.current?.scrollTo({ 
      top: listRef.current.scrollHeight, 
      behavior: "smooth" 
    });
  }, [messages, assistantTyping]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-3 sm:p-4 shadow-xl">
      {/* Voice call status */}
      <VoiceCallStatus voiceState={voiceState} />
      
      {/* Messages area */}
      <MessageList 
        ref={listRef}
        messages={messages}
        assistantTyping={assistantTyping}
      />

      {/* Input area */}
      <ChatInput
        onSendMessage={sendMessage}
        onStartCall={startCall}
        sending={sending}
        voiceState={voiceState}
      />

      {/* Footer */}
      <p className="mt-2 text-center text-[11px] text-white/40">
        Powered by <span className="text-white/70">Vapi</span>. 
        {voiceState.isCallActive ? " Voice call active - speak naturally!" : " Click mic for voice or type below."}
      </p>
    </div>
  );
}
