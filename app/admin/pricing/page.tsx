// "use client";

// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import api from "@/components/lib/api";
// import Topbar from "@/components/lib/admin/Topbar";

// type Rates = { heavyEditing: number; midLevel: number; proofreading: number };
// type Pricing = { english: Rates; hebrew: Rates };

// export default function PricingPage() {
//   const [pricing, setPricing] = useState<Pricing | null>(null);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     api
//       .get("/api/pricing")
//       .then((res) => setPricing(res.data.data))
//       .catch(() => toast.error("Unable to load pricing"));
//   }, []);

//   const updateRate = (lang: "english" | "hebrew", tier: keyof Rates, value: string) => {
//     if (!pricing) return;
//     setPricing({ ...pricing, [lang]: { ...pricing[lang], [tier]: Number(value) } });
//   };

//   const save = async () => {
//     if (!pricing) return;
//     setSaving(true);
//     try {
//       const response = await api.patch("/api/pricing", pricing);
//       setPricing(response.data.data);
//       toast.success("Pricing updated");
//     } catch {
//       toast.error("Unable to update pricing");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!pricing) return null;

//   const renderField = (lang: "english" | "hebrew", tier: keyof Rates, label: string) => (
//     <div>
//       <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#1B2430]/60">{label}</label>
//       <div className="relative">
//         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B2430]/40">$</span>
//         <input
//           type="number"
//           step="0.01"
//           min="0"
//           value={pricing[lang][tier]}
//           onChange={(e) => updateRate(lang, tier, e.target.value)}
//           className="h-11 w-full rounded-xl border border-black/10 bg-white pl-7 pr-3 text-sm outline-none focus:border-[#C77D3D]"
//         />
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <Topbar title="Pricing" />

//       <div className="max-w-2xl space-y-6 p-8">
//         <div className="rounded-2xl border border-black/5 bg-white p-6">
//           <h2 className="mb-4 text-lg font-semibold text-[#1B2430]">English</h2>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//             {renderField("english", "heavyEditing", "Heavy Editing")}
//             {renderField("english", "midLevel", "Mid-Level")}
//             {renderField("english", "proofreading", "Proofreading")}
//           </div>
//         </div>

//         <div className="rounded-2xl border border-black/5 bg-white p-6">
//           <h2 className="mb-4 text-lg font-semibold text-[#1B2430]">Hebrew</h2>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//             {renderField("hebrew", "heavyEditing", "Heavy Editing")}
//             {renderField("hebrew", "midLevel", "Mid-Level")}
//             {renderField("hebrew", "proofreading", "Proofreading")}
//           </div>
//         </div>

//         <button
//           onClick={save}
//           disabled={saving}
//           className="h-11 rounded-full bg-[#1B2430] px-8 text-sm font-semibold text-[#FAF7F1] hover:bg-[#2A374B] disabled:opacity-60"
//         >
//           {saving ? "Saving..." : "Save Changes"}
//         </button>
//       </div>
//     </>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/components/lib/api";
import Topbar from "@/components/lib/admin/Topbar";

type Rates = { heavyEditing: number; midLevel: number; proofreading: number };
type Pricing = { english: Rates; hebrew: Rates; yiddish: Rates };

export default function PricingPage() {
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/api/pricing")
      .then((res) => setPricing(res.data.data))
      .catch(() => toast.error("Unable to load pricing"));
  }, []);

  const updateRate = (lang: "english" | "hebrew" | "yiddish", tier: keyof Rates, value: string) => {
    if (!pricing) return;
    setPricing({ ...pricing, [lang]: { ...pricing[lang], [tier]: Number(value) } });
  };

  const save = async () => {
    if (!pricing) return;
    setSaving(true);
    try {
      const response = await api.patch("/api/pricing", pricing);
      setPricing(response.data.data);
      toast.success("Pricing updated");
    } catch {
      toast.error("Unable to update pricing");
    } finally {
      setSaving(false);
    }
  };

  if (!pricing) return null;

  const renderField = (lang: "english" | "hebrew" | "yiddish", tier: keyof Rates, label: string) => (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#1B2430]/60">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B2430]/40">$</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={pricing[lang][tier]}
          onChange={(e) => updateRate(lang, tier, e.target.value)}
          className="h-11 w-full rounded-xl border border-black/10 bg-white pl-7 pr-3 text-sm outline-none focus:border-[#C77D3D]"
        />
      </div>
    </div>
  );

  return (
    <>
      <Topbar title="Pricing" />

      <div className="max-w-2xl space-y-6 p-8">
        <div className="rounded-2xl border border-black/5 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#1B2430]">English</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {renderField("english", "heavyEditing", "Heavy Editing")}
            {renderField("english", "midLevel", "Mid-Level")}
            {renderField("english", "proofreading", "Proofreading")}
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#1B2430]">Hebrew</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {renderField("hebrew", "heavyEditing", "Heavy Editing")}
            {renderField("hebrew", "midLevel", "Mid-Level")}
            {renderField("hebrew", "proofreading", "Proofreading")}
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#1B2430]">Yiddish</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {renderField("yiddish", "heavyEditing", "Heavy Editing")}
            {renderField("yiddish", "midLevel", "Mid-Level")}
            {renderField("yiddish", "proofreading", "Proofreading")}
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="h-11 rounded-full bg-[#1B2430] px-8 text-sm font-semibold text-[#FAF7F1] hover:bg-[#2A374B] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </>
  );
}