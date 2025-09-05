"use client";

import { ArrowRight, MessageCircle, Mic, FileText, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-dvh bg-[radial-gradient(40rem_30rem_at_80%_-10%,rgba(59,130,246,0.25),transparent),radial-gradient(35rem_20rem_at_-10%_10%,rgba(16,185,129,0.25),transparent)]">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Hero Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white/80 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Powered by Vapi Voice AI</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white/95 mb-6">
            Work Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Docs
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            Transform how you interact with documents using AI-powered voice conversations. 
            Ask questions, get insights, and work smarter.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => router.push("/chat")}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Start Conversation</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white/90 mb-2">Voice Conversations</h3>
            <p className="text-white/60">
              Speak naturally to your AI assistant. Get instant responses through voice or see transcripts in real-time.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white/90 mb-2">Text Chat</h3>
            <p className="text-white/60">
              Type your questions and get streaming AI responses. Perfect for detailed discussions and complex queries.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white/90 mb-2">Document Analysis</h3>
            <p className="text-white/60">
              Upload and analyze documents with AI assistance. Extract insights, summaries, and answers from your files.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-white/90 mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white/90 mb-2">Click to Start</h3>
              <p className="text-white/60">
                Launch your personal assistant and choose between voice or text interaction.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white/90 mb-2">Ask Questions</h3>
              <p className="text-white/60">
                Speak or type your questions naturally. The AI understands context and nuance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white/90 mb-2">Get Results</h3>
              <p className="text-white/60">
                Receive intelligent responses, insights, and assistance tailored to your needs.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center">
          <p className="text-white/40 text-sm">
            Ready to transform how you work with documents?
          </p>
          <button
            onClick={() => router.push("/chat")}
            className="mt-4 text-blue-400 hover:text-blue-300 font-medium transition-colors inline-flex items-center gap-1"
          >
            Get Started Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
