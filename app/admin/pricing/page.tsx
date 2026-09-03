// "use client";

// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import api from "@/components/lib/api";
// import Topbar from "@/components/lib/admin/Topbar";

// type Rates = { heavyEditing: number; midLevel: number; proofreading: number };
// type Pricing = { english: Rates; hebrew: Rates; yiddish: Rates };

// const LANGUAGES: { key: keyof Pricing; label: string }[] = [
//   { key: "english", label: "English" },
//   { key: "hebrew", label: "Hebrew" },
//   { key: "yiddish", label: "Yiddish" },
// ];

// const TIERS: { key: keyof Rates; title: string; subtitle: string }[] = [
//   { key: "heavyEditing", title: "Level 1", subtitle: "Substantive Editing" },
//   { key: "midLevel", title: "Level 2", subtitle: "Language Editing" },
//   { key: "proofreading", title: "Level 3", subtitle: "Copy Editing " },
// ];

// const MIN_RATE = 0;

// export default function PricingPage() {
//   const [pricing, setPricing] = useState<Pricing | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [displayVersion, setDisplayVersion] = useState(0);

//   useEffect(() => {
//     api
//       .get("/api/pricing")
//       .then((res) => {
//         setPricing(res.data.data);
//         setDisplayVersion((v) => v + 1);
//       })
//       .catch(() => toast.error("Unable to load pricing"));
//   }, []);

//   const updateRate = (lang: keyof Pricing, tier: keyof Rates, value: string) => {
//     if (!pricing) return;
//     setPricing({ ...pricing, [lang]: { ...pricing[lang], [tier]: Number(value) } });
//   };

//   const clampRate = (lang: keyof Pricing, tier: keyof Rates, input: HTMLInputElement) => {
//     const parsed = Number(input.value);
//     const clamped = Number.isFinite(parsed) && parsed >= MIN_RATE ? parsed : MIN_RATE;
//     input.value = clamped.toFixed(2);
//     setPricing((prev) => (prev ? { ...prev, [lang]: { ...prev[lang], [tier]: clamped } } : prev));
//   };

//   const save = async () => {
//     if (!pricing) return;
//     setSaving(true);
//     try {
//       const response = await api.patch("/api/pricing", pricing);
//       setPricing(response.data.data);
//       setDisplayVersion((v) => v + 1);
//       toast.success("Pricing updated");
//     } catch {
//       toast.error("Unable to update pricing");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!pricing) return null;

//   return (
//     <>
//       <Topbar title="Pricing" />

//       <div className="max-w-2xl space-y-6 p-8">
//         {LANGUAGES.map((language) => (
//           <div key={language.key} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
//             <h2 className="mb-5 text-lg font-semibold tracking-tight text-[#1B2430]">{language.label}</h2>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//               {TIERS.map((tier) => (
//                 <div key={tier.key}>
//                   <label className="mb-1.5 block">
//                     <span className="block text-[13px] font-semibold uppercase tracking-wide text-[#1B2430]">
//                       {tier.title}
//                     </span>
//                     <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-wide text-[#1B2430]/45">
//                       {tier.subtitle}
//                     </span>
//                   </label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B2430]/40">$</span>
//                     <input
//                       key={`${language.key}-${tier.key}-${displayVersion}`}
//                       type="number"
//                       step="0.01"
//                       min={MIN_RATE}
//                       defaultValue={pricing[language.key][tier.key].toFixed(2)}
//                       onChange={(e) => updateRate(language.key, tier.key, e.target.value)}
//                       onBlur={(e) => clampRate(language.key, tier.key, e.target)}
//                       className="h-11 w-full rounded-xl border border-black/10 bg-white pl-7 pr-3 text-sm outline-none transition-shadow focus:border-[#C77D3D] focus:ring-2 focus:ring-[#C77D3D]/15"
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}

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

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ChevronUp, ChevronDown } from "lucide-react";
import api from "@/components/lib/api";
import Topbar from "@/components/lib/admin/Topbar";

type Rates = { heavyEditing: number; midLevel: number; proofreading: number };
type Pricing = { english: Rates; hebrew: Rates; yiddish: Rates };

const LANGUAGES: { key: keyof Pricing; label: string }[] = [
  { key: "english", label: "English" },
  { key: "hebrew", label: "Hebrew" },
  { key: "yiddish", label: "Yiddish" },
];

const TIERS: { key: keyof Rates; title: string; subtitle: string }[] = [
  { key: "heavyEditing", title: "Level 1", subtitle: "Substantive Editing" },
  { key: "midLevel", title: "Level 2", subtitle: "Language Editing" },
  { key: "proofreading", title: "Level 3", subtitle: "Copy Editing " },
];

const MIN_RATE = 0;
const STEP = 0.01;

export default function PricingPage() {
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [saving, setSaving] = useState(false);
  const [displayVersion, setDisplayVersion] = useState(0);
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  useEffect(() => {
    api
      .get("/api/pricing")
      .then((res) => {
        setPricing(res.data.data);
        setDisplayVersion((v) => v + 1);
      })
      .catch(() => toast.error("Unable to load pricing"));
  }, []);

  const fieldKey = (lang: keyof Pricing, tier: keyof Rates) => `${lang}-${tier}`;

  const commit = (lang: keyof Pricing, tier: keyof Rates, value: number, input: HTMLInputElement) => {
    input.value = value.toFixed(2);
    setPricing((prev) => (prev ? { ...prev, [lang]: { ...prev[lang], [tier]: value } } : prev));
  };

  const updateRate = (lang: keyof Pricing, tier: keyof Rates, value: string) => {
    if (!pricing) return;
    setPricing({ ...pricing, [lang]: { ...pricing[lang], [tier]: Number(value) } });
  };

  const clampRate = (lang: keyof Pricing, tier: keyof Rates, input: HTMLInputElement) => {
    const parsed = Number(input.value);
    const clamped = Number.isFinite(parsed) && parsed >= MIN_RATE ? parsed : MIN_RATE;
    commit(lang, tier, clamped, input);
  };

  const nudge = (lang: keyof Pricing, tier: keyof Rates, delta: number) => {
    const input = inputRefs.current.get(fieldKey(lang, tier));
    if (!input) return;
    const current = Number(input.value);
    const base = Number.isFinite(current) ? current : MIN_RATE;
    const next = Math.max(MIN_RATE, Math.round((base + delta) * 100) / 100);
    commit(lang, tier, next, input);
  };

  const onArrowKey = (lang: keyof Pricing, tier: keyof Rates, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      nudge(lang, tier, STEP);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      nudge(lang, tier, -STEP);
    }
  };

  const save = async () => {
    if (!pricing) return;
    setSaving(true);
    try {
      const response = await api.patch("/api/pricing", pricing);
      setPricing(response.data.data);
      setDisplayVersion((v) => v + 1);
      toast.success("Pricing updated");
    } catch {
      toast.error("Unable to update pricing");
    } finally {
      setSaving(false);
    }
  };

  if (!pricing) return null;

  return (
    <>
      <Topbar title="Pricing" />

      <div className="max-w-2xl space-y-6 p-8">
        {LANGUAGES.map((language) => (
          <div key={language.key} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold tracking-tight text-[#1B2430]">{language.label}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {TIERS.map((tier) => (
                <div key={tier.key}>
                  <label className="mb-1.5 block">
                    <span className="block text-[13px] font-semibold uppercase tracking-wide text-[#1B2430]">
                      {tier.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-wide text-[#1B2430]/45">
                      {tier.subtitle}
                    </span>
                  </label>
                  <div className="group relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B2430]/40">$</span>
                    <input
                      key={`${language.key}-${tier.key}-${displayVersion}`}
                      ref={(el) => {
                        if (el) inputRefs.current.set(fieldKey(language.key, tier.key), el);
                      }}
                      type="text"
                      inputMode="decimal"
                      defaultValue={pricing[language.key][tier.key].toFixed(2)}
                      onChange={(e) => updateRate(language.key, tier.key, e.target.value)}
                      onBlur={(e) => clampRate(language.key, tier.key, e.target)}
                      onKeyDown={(e) => onArrowKey(language.key, tier.key, e)}
                      className="h-11 w-full rounded-xl border border-black/10 bg-white pl-7 pr-6 text-sm outline-none transition-shadow focus:border-[#C77D3D] focus:ring-2 focus:ring-[#C77D3D]/15"
                    />
                    <div className="absolute right-1 top-1/2 flex -translate-y-1/2 flex-col opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => nudge(language.key, tier.key, STEP)}
                        className="flex h-[15px] w-[19px] items-center justify-center text-[#1B2430]/50 hover:text-[#1B2430]"
                      >
                        <ChevronUp size={12} strokeWidth={2.2} />
                      </button>
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => nudge(language.key, tier.key, -STEP)}
                        className="flex h-[15px] w-[19px] items-center justify-center text-[#1B2430]/50 hover:text-[#1B2430]"
                      >
                        <ChevronDown size={12} strokeWidth={2.2} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

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