// Hook for managing Vapi voice call functionality

import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import type { Message, VapiMessage } from "../types";
import { VAPI_EVENTS } from "../lib/constants";

export interface VoiceCallState {
  isCallActive: boolean;
  isConnecting: boolean;
  callStatus: string;
}

export function useVapiVoiceCall(onMessageReceived: (message: Message) => void) {
  const [voiceState, setVoiceState] = useState<VoiceCallState>({
    isCallActive: false,
    isConnecting: false,
    callStatus: "",
  });
  
  const vapiRef = useRef<Vapi | null>(null);

  // Initialize Vapi
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey || publicKey.includes('placeholder')) {
      console.warn('NEXT_PUBLIC_VAPI_PUBLIC_KEY not configured - voice features disabled');
      return;
    }

    try {
      vapiRef.current = new Vapi(publicKey);
      
      // Set up event listeners
      vapiRef.current.on(VAPI_EVENTS.CALL_START, () => {
        setVoiceState({
          isCallActive: true,
          isConnecting: false,
          callStatus: "Connected",
        });
      });

      vapiRef.current.on(VAPI_EVENTS.CALL_END, () => {
        setVoiceState({
          isCallActive: false,
          isConnecting: false,
          callStatus: "",
        });
      });

      vapiRef.current.on(VAPI_EVENTS.VOLUME_LEVEL, () => {
        // Future: Could use this for visual feedback
      });

      vapiRef.current.on(VAPI_EVENTS.MESSAGE, (message: VapiMessage) => {
        if (message.type === "transcript" && message.transcript) {
          const newMessage: Message = {
            id: crypto.randomUUID(),
            role: message.role as "user" | "assistant",
            content: message.transcript,
            createdAt: Date.now(),
          };
          onMessageReceived(newMessage);
        }
      });

      vapiRef.current.on(VAPI_EVENTS.ERROR, (error: Error) => {
        console.error("Vapi error:", error);
        setVoiceState({
          isCallActive: false,
          isConnecting: false,
          callStatus: "Error occurred",
        });
      });
    } catch (error) {
      console.error("Failed to initialize Vapi:", error);
    }

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, [onMessageReceived]);

  const startCall = async () => {
    if (!vapiRef.current) {
      alert("Vapi is not configured. Please add your NEXT_PUBLIC_VAPI_PUBLIC_KEY to your environment variables.");
      return;
    }

    if (voiceState.isCallActive) {
      // End the call
      vapiRef.current.stop();
      setVoiceState(prev => ({ ...prev, callStatus: "Ending call..." }));
    } else {
      // Start a call
      setVoiceState(prev => ({
        ...prev,
        isConnecting: true,
        callStatus: "Connecting...",
      }));
      
      try {
        const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
        
        if (assistantId && !assistantId.includes('placeholder')) {
          await vapiRef.current.start(assistantId);
        } else {
          // Use a default assistant or configuration
          await vapiRef.current.start({
            model: {
              provider: "openai",
              model: "gpt-3.5-turbo",
            },
            voice: {
              provider: "11labs",
              voiceId: "sarah",
            },
          });
        }
      } catch (error) {
        console.error("Failed to start voice call:", error);
        setVoiceState({
          isCallActive: false,
          isConnecting: false,
          callStatus: "Failed to connect",
        });
      }
    }
  };

  return {
    voiceState,
    startCall,
  };
}
