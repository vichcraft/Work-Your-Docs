// Hook for managing chat messages and sending functionality

import { useState, useCallback } from "react";
import type { Message } from "../types";
import { API_ROUTES } from "../lib/constants";

const INITIAL_MESSAGE: Message = {
  id: crypto.randomUUID(),
  role: "assistant",
  content: "Hi! I'm your assistant powered by Vapi. You can type to me or click the microphone to start a voice conversation!",
  createdAt: Date.now(),
};

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [sending, setSending] = useState(false);
  const [assistantTyping, setAssistantTyping] = useState(false);

  const addMessage = useCallback((role: "user" | "assistant", content: string): Message => {
    const message: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      createdAt: Date.now(),
    };
    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const updateAssistantMessage = useCallback((id: string, content: string) => {
    setMessages(prev => {
      const without = prev.filter(m => m.id !== id);
      return [
        ...without,
        {
          id,
          role: "assistant" as const,
          content,
          createdAt: Date.now(),
        },
      ];
    });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMsg = addMessage("user", content);
    setAssistantTyping(true);
    setSending(true);

    try {
      // Call the Vapi API
      const res = await fetch(API_ROUTES.VAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      // Stream the response
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      const assistantId = crypto.randomUUID();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        acc += decoder.decode(value, { stream: true });
        updateAssistantMessage(assistantId, acc);
      }

      setAssistantTyping(false);
      
    } catch (error) {
      console.error("Error sending message:", error);
      setAssistantTyping(false);
      
      addMessage(
        "assistant",
        "I'm sorry, I couldn't process your message right now. Please check your connection and try again."
      );
    } finally {
      setSending(false);
    }
  }, [messages, addMessage, updateAssistantMessage]);

  const addReceivedMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  return {
    messages,
    sending,
    assistantTyping,
    sendMessage,
    addReceivedMessage,
  };
}
