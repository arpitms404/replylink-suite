import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description, cta, onCta }: {
  icon: LucideIcon; title: string; description: string; cta: string; onCta?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-success" strokeWidth={1.5}/>
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">{description}</p>
      <button onClick={onCta} className="mt-5 h-10 px-5 rounded-lg bg-brand text-white text-sm font-semibold hover:opacity-90">{cta}</button>
    </div>
  );
}
