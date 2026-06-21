import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/conversations")({ component: ConversationsPage });

function ConversationsPage() {
  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <h1 className="text-2xl font-bold text-ink">Conversations</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">Full conversation archive across all agents</p>
      <div className="bg-card border border-border rounded-xl shadow-card p-10 text-center">
        <p className="text-sm text-gray-500 mb-4">For an active conversation experience, open the Inbox.</p>
        <Link to="/inbox" className="inline-flex h-10 px-5 rounded-lg bg-brand text-white text-sm font-semibold items-center">Open Inbox</Link>
      </div>
    </div>
  );
}
