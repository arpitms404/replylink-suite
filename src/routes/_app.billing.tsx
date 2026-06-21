import { createFileRoute, Link } from "@tanstack/react-router";
import { useAppStore } from "@/lib/mock/store";
import { canUserDo } from "@/lib/permissions";
import { Check, CreditCard, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/billing")({ component: BillingPage });

const plans = [
  { name: "Starter", price: 49, contacts: "5,000", messages: "10K", features: ["Basic templates","1 team member","Email support"] },
  { name: "Business", price: 199, contacts: "25,000", messages: "100K", features: ["Unlimited templates","10 team members","Priority support","Advanced analytics"], recommended: true },
  { name: "Enterprise", price: 499, contacts: "Unlimited", messages: "1M+", features: ["Custom integrations","Unlimited members","Dedicated CSM","SLA & SSO"] },
];

function BillingPage() {
  const { workspace, currentRole } = useAppStore();
  if (!canUserDo(currentRole, "manage_billing")) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-xl shadow-card p-10 text-center">
          <Lock className="w-10 h-10 text-gray-300 mx-auto mb-3"/>
          <h2 className="text-lg font-semibold text-ink">Billing access restricted</h2>
          <p className="text-sm text-gray-500 mt-1">Only Super Admins can view and manage billing.</p>
        </div>
      </div>
    );
  }

  const usagePct = Math.max(0, Math.min(100, (workspace.credits_remaining / 100000) * 100));
  const tone = usagePct > 50 ? "bg-success" : usagePct > 15 ? "bg-warning" : "bg-error";

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <h1 className="text-2xl font-bold text-ink">Billing & Plans</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">Manage your subscription and message credits</p>

      {workspace.credits_remaining <= 5000 && (
        <div className="bg-warning/5 border border-warning/30 rounded-xl p-5 mb-6 flex items-center gap-4">
          <CreditCard className="w-8 h-8 text-warning"/>
          <div className="flex-1">
            <div className="font-semibold text-ink">Low message credits</div>
            <div className="text-sm text-gray-600">You have {workspace.credits_remaining.toLocaleString()} credits remaining. Top up to keep campaigns running.</div>
          </div>
          <button className="h-10 px-5 rounded-lg bg-brand text-white text-sm font-semibold">Buy More Credits</button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card label="Current Plan" value="Business" sub="Renews Aug 21"/>
        <Card label="Message Credits" value={workspace.credits_remaining.toLocaleString()} sub={`of 100,000`}>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden"><div className={cn("h-full transition-all", tone)} style={{ width: `${usagePct}%` }}/></div>
        </Card>
        <Card label="Used This Month" value="51,770" sub="74% of allotment"/>
        <Card label="Upcoming Invoice" value="$199.00" sub="Due Aug 21"/>
      </div>

      <h2 className="text-base font-semibold text-ink mb-4">Compare Plans</h2>
      <div className="grid grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.name} className={cn("bg-card border rounded-xl p-6 relative",
            p.recommended ? "border-brand shadow-md ring-2 ring-brand/20" : "border-border shadow-card")}>
            {p.recommended && <div className="absolute -top-3 left-6 bg-brand text-white text-[10px] font-bold uppercase px-2 py-1 rounded">Recommended</div>}
            <h3 className="font-bold text-ink text-lg">{p.name}</h3>
            <div className="mt-2 flex items-baseline gap-1"><span className="text-3xl font-bold tabular-nums text-ink">${p.price}</span><span className="text-sm text-gray-500">/mo</span></div>
            <div className="text-xs text-gray-500 mt-1">{p.contacts} contacts · {p.messages} msgs/mo</div>
            <ul className="mt-5 space-y-2.5">
              {p.features.map(f => <li key={f} className="text-sm text-gray-700 flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5"/>{f}</li>)}
            </ul>
            <button className={cn("w-full h-10 rounded-lg mt-6 text-sm font-semibold", p.recommended ? "bg-brand text-white" : "border border-border text-ink")}>
              {p.name === "Business" ? "Current Plan" : `Upgrade to ${p.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ label, value, sub, children }: { label: string; value: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-card p-5">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="text-2xl font-bold tabular-nums text-ink mt-1.5">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
      {children}
    </div>
  );
}
