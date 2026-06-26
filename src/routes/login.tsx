import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("ceo@qualibytes.com");
  const [password, setPassword] = useState("demo");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try { localStorage.setItem("chatpilot.session", "1"); } catch {}
    navigate({ to: "/home" });
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl" style={{ boxShadow: "0 12px 48px rgba(15,23,42,0.10)" }}>
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-3 bg-[#0B6E4F]">C</div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>ChatPilot</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your workspace</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6E4F]/30 focus:border-[#0B6E4F]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6E4F]/30 focus:border-[#0B6E4F]" />
          </div>
          <button type="submit" className="w-full h-11 rounded-lg text-white text-sm font-semibold bg-[#0B6E4F] hover:bg-[#095a40]">
            Sign in
          </button>
        </form>
        <p className="text-[11px] text-gray-400 text-center mt-6">Demo mode — any credentials work</p>
      </div>
    </div>
  );
}
