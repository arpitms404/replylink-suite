import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { API_CONFIGURED } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const [email, setEmail] = useState("Arpit@skilllogic.in");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) navigate({ to: "/" });
  }, [loading, isAuthenticated, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!API_CONFIGURED) {
      toast.error("API not configured. Set VITE_API_URL to your deployed server.");
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      router.navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="w-full max-w-md bg-white shadow-lg p-8" style={{ borderRadius: 12, boxShadow: "0 8px 32px rgba(15,23,42,0.08)" }}>
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold mb-3" style={{ backgroundColor: "#25D366" }}>S</div>
          <h1 className="text-xl font-semibold text-ink">SkillLogic WhatsApp CRM</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your workspace</p>
        </div>

        {!API_CONFIGURED && (
          <div className="mb-4 text-xs rounded-md border border-amber-200 bg-amber-50 text-amber-800 p-3">
            <strong>API not configured.</strong> Deploy the <code>server/</code> Express API, then set <code>VITE_API_URL</code> in this project's environment variables and republish.
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
              className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 focus:border-[#25D366]"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-gray-700">Password</label>
              <button type="button" className="text-xs text-gray-500 hover:text-gray-700" onClick={() => toast.info("Password reset coming soon")}>Forgot password?</button>
            </div>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
              className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 focus:border-[#25D366]"
            />
          </div>
          <button
            type="submit" disabled={submitting}
            className="w-full h-10 rounded-md text-white text-sm font-semibold disabled:opacity-60"
            style={{ backgroundColor: "#25D366" }}
          >
            {submitting ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="text-[11px] text-gray-400 text-center mt-6">
          Protected by JWT auth • Sessions expire after 7 days
        </p>
      </div>
    </div>
  );
}
