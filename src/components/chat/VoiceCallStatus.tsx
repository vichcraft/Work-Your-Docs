// Voice call status indicator component

import { Loader2 } from "lucide-react";
import type { VoiceCallState } from "../../hooks/useVapiVoiceCall";

interface VoiceCallStatusProps {
  voiceState: VoiceCallState;
}

export function VoiceCallStatus({ voiceState }: VoiceCallStatusProps) {
  const { isCallActive, isConnecting, callStatus } = voiceState;
  
  if (!isCallActive && !isConnecting && !callStatus) {
    return null;
  }

  return (
    <div className="mb-3 sm:mb-4">
      <div className={[
        "inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium",
        isCallActive 
          ? "bg-green-500/20 text-green-300 border border-green-400/30" 
          : isConnecting 
            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
            : "bg-red-500/20 text-red-300 border border-red-400/30"
      ].join(" ")}>
        {isConnecting && <Loader2 className="size-4 animate-spin" />}
        <span>{callStatus}</span>
      </div>
    </div>
  );
}
