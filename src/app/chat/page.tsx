// src/app/chat/page.tsx
"use client";

import Chat from "../../components/Chat";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();

  return (
    <main className="min-h-dvh bg-[radial-gradient(40rem_30rem_at_80%_-10%,rgba(59,130,246,0.25),transparent),radial-gradient(35rem_20rem_at_-10%_10%,rgba(16,185,129,0.25),transparent)]">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Back Navigation */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white/90 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white/90 text-center">
          Your Personal Assistant
        </h1>
        <p className="mt-2 text-center text-white/60">
          Ask anything. I&apos;ll think out loud and help you get things done.
        </p>
        <div className="mt-6">
          <Chat />
        </div>
      </div>
    </main>
  );
}
