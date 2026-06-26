import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "lucide-react";

export const Route = createFileRoute("/_app/calls")({ component: () => <Stub icon={<Phone className="h-10 w-10 text-emerald-700" />} title="Calls" /> });

function Stub({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
        <div className="flex justify-center mb-3">{icon}</div>
        <h2 className="text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>{title} — Coming Soon</h2>
        <p className="text-sm text-gray-500 mt-2">This module will be available shortly.</p>
      </div>
    </div>
  );
}
