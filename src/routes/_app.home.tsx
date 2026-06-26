import { createFileRoute } from "@tanstack/react-router";
import { Check, Info, ExternalLink, Play, Zap, QrCode, Link2 } from "lucide-react";
import { TENANT } from "@/lib/chatpilot-data";

export const Route = createFileRoute("/_app/home")({ component: HomePage });

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const TIERS = ["1k/24hrs", "2k", "10k", "100k", "Unlimited"];
const CHECKLIST = [
  { done: false, title: "Setup your WABA profile", desc: "Help customers recognise and trust your business with a complete profile.", expand: true },
  { done: true, title: "Invite your team members" },
  { done: true, title: "Import your contacts and create customer lists" },
  { done: true, title: "Create a message template" },
  { done: true, title: "Send a broadcast message" },
];

function HomePage() {
  return (
    <div className="h-screen overflow-y-auto p-8">
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
        {greeting()}, Akshit Giri 🤙
      </h1>

      {/* WhatsApp account overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">WhatsApp account overview</h2>
          <button className="text-sm px-3 h-9 rounded-md border border-gray-300 hover:bg-gray-50 flex items-center gap-1.5">
            Go To FBM Account <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
        <button className="text-sm text-gray-600 mb-4">{TENANT.name} ▾</button>

        <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white text-xl">✓</div>
            <div>
              <div className="font-semibold">{TENANT.name}</div>
              <div className="text-xs text-gray-500">{TENANT.phone}</div>
            </div>
            <span className="ml-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
            </span>
            <span className="text-xs text-gray-500 ml-2">Last synced 8 months ago</span>
          </div>
          <button className="text-sm px-3 h-9 rounded-md border border-gray-300 hover:bg-gray-50">Sync channel info</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-1.5 text-sm font-medium">Account quality <Info className="h-3.5 w-3.5 text-gray-400" /></div>
            <div className="text-xs text-gray-500 mt-1">Determined by how messages have been received by recipients over the past 7 days</div>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-end gap-0.5 h-8">
                <div className="w-1.5 bg-emerald-300 h-3 rounded-sm" />
                <div className="w-1.5 bg-emerald-400 h-5 rounded-sm" />
                <div className="w-1.5 bg-emerald-600 h-8 rounded-sm" />
              </div>
              <span className="text-2xl font-bold text-emerald-700">High</span>
            </div>
            <a className="text-xs text-emerald-700 font-medium mt-3 inline-block">Learn how to improve quality →</a>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-1.5 text-sm font-medium">Messaging limit <Info className="h-3.5 w-3.5 text-gray-400" /></div>
            <div className="text-xs text-gray-500 mt-1">Number of chats you can send to new customers in 24 hours</div>
            <div className="flex flex-wrap gap-2 mt-4">
              {TIERS.map(t => (
                <button key={t} className={`px-3 h-7 rounded-full text-xs font-medium border ${t === TENANT.tier ? "bg-[#0B6E4F] text-white border-[#0B6E4F]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
                  {t === TENANT.tier ? `${t} ✓` : t}
                </button>
              ))}
            </div>
            <a className="text-xs text-emerald-700 font-medium mt-3 inline-block">Learn how to increase your limit →</a>
          </div>
        </div>
      </div>

      {/* Setup guide + Quick links */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-lg font-semibold">Setup guide</h3>
              <p className="text-xs text-gray-500 mt-0.5">Use this guide to setup your ChatPilot account</p>
            </div>
            <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">4 of 5 completed</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full mt-4 mb-6 overflow-hidden">
            <div className="h-full bg-[#0B6E4F] rounded-full" style={{ width: "80%" }} />
          </div>

          <ul className="space-y-3">
            {CHECKLIST.map((c, i) => (
              <li key={i} className={`border rounded-lg p-4 ${c.expand ? "border-emerald-200 bg-emerald-50/30" : "border-gray-100"}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${c.done ? "bg-[#0B6E4F] text-white" : "border-2 border-gray-300"}`}>
                    {c.done && <Check className="h-3 w-3" />}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${c.done ? "line-through text-gray-400" : "text-gray-900"}`}>{c.title}</div>
                    {c.expand && (
                      <>
                        <p className="text-xs text-gray-600 mt-1">{c.desc}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <button className="h-8 px-3 rounded-md bg-[#0B6E4F] text-white text-xs font-medium">Edit Profile</button>
                          <a className="text-xs text-emerald-700 font-medium inline-flex items-center gap-1"><Play className="h-3 w-3" /> Watch Video</a>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Quick links</h3>
          <div className="space-y-2">
            <a className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
              <span className="flex items-center gap-2 text-sm"><Link2 className="h-4 w-4 text-emerald-700" /> WhatsApp Chat Link Generator</span>
              <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
            </a>
            <a className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
              <span className="flex items-center gap-2 text-sm"><QrCode className="h-4 w-4 text-emerald-700" /> WhatsApp QR Code Generator</span>
              <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
            </a>
            <div className="mt-4 p-3 rounded-lg bg-emerald-50 text-xs text-emerald-800 flex items-start gap-2">
              <Zap className="h-4 w-4 mt-0.5" />
              <div><strong>Pro tip:</strong> Connect Bot Studio to auto-reply to new leads instantly.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
