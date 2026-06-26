import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/ai-agent")({
  component: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
        <Sparkles className="h-10 w-10 text-emerald-700 mx-auto mb-3" />
        <h2 className="text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>AI Agent — Coming Soon</h2>
        <p className="text-sm text-gray-500 mt-2">AI-powered conversation handler arriving next release.</p>
      </div>
    </div>
  ),
});
