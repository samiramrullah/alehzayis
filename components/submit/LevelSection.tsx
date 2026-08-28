"use client";

import { forwardRef } from "react";
import { Check } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Corners from "./Corners";

export type ServiceKey = "proofreading" | "midLevel" | "heavyEditing";

const levels: {
  key: ServiceKey;
  title: string;
  subtitle: string;
  items: string[];
  bestFor: string;
  chooseWhen: string;
}[] = [
  {
    key: "proofreading",
    title: "Copyediting",
    subtitle: "A careful, final pass",
    items: [
      "Grammar, punctuation & spelling corrections",
      "Consistency in style and terminology",
      "Basic formatting cleanup",
      "Light readability pass",
    ],
    bestFor: "Manuscripts that are polished and ready for a final pass.",
    chooseWhen: "Your writing is strong and you just need a clean, careful proofread.",
  },
  {
    key: "midLevel",
    title: "Language Editing",
    subtitle: "Sharper, clearer writing",
    items: [
      "Everything in Copyediting",
      "Sentence-level rewriting for clarity",
      "Improved flow and transitions",
      "Word choice and tone refinement",
      "Elimination of repetition",
      "Structural paragraph adjustments",
    ],
    bestFor: "Manuscripts that read well but need sharpening.",
    chooseWhen: "You want the writing to flow better without changing your voice.",
  },
  {
    key: "heavyEditing",
    title: "Substantive Editing",
    subtitle: "A full editorial partner",
    items: [
      "Everything in Language Editing",
      "Deep structural reorganization",
      "Content development and gap-filling",
      "Chapter and section restructuring",
      "Voice and tone consistency throughout",
      "Argument and logic strengthening",
      "Detailed line-by-line rewriting",
      "Full manuscript consultation",
      "Print-ready formatting preparation",
      "Direct author collaboration",
    ],
    bestFor: "Manuscripts still taking shape.",
    chooseWhen: "You want a partner in shaping the structure, content, and delivery.",
  },
];

type LevelSectionProps = {
  selected: ServiceKey | null;
  onSelect: (key: ServiceKey) => void;
};

const LevelSection = forwardRef<HTMLDivElement, LevelSectionProps>(({ selected, onSelect }, ref) => {
  return (
    <section ref={ref} className="bg-[#FBF7EF] px-6 py-[70px] sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <SectionHeading
          eyebrow="Step One"
          title="Choose Your Editing Level"
          description="Every manuscript is different. Pick the level of care that matches yours."
        />

        <div className="grid grid-cols-1 gap-[24px] md:grid-cols-3">
          {levels.map((level) => {
            const isSelected = selected === level.key;
            return (
              <div key={level.key} className="relative border border-[#C59B27]/55 bg-[#F8F3EA] p-[3px]">
                <Corners />
                <div className="flex h-full flex-col border border-[#C59B27]/25 bg-white px-[24px] py-[30px]">
                  <h3 className="font-display text-[1.4rem] font-normal text-[#3A101A]">{level.title}</h3>
                  <p className="mb-[18px] font-body text-[0.85rem] italic text-[#8B7B7E]">{level.subtitle}</p>

                  <ul className="mb-[22px] flex-1 space-y-[9px]">
                    {level.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-[8px] font-body text-[0.85rem] leading-[1.5] text-[#55474A]"
                      >
                        <Check size={14} strokeWidth={2} className="mt-[3px] shrink-0 text-[#C59B27]" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mb-[22px] space-y-[10px] border-t border-[#4A1521]/10 pt-[16px]">
                    <p className="font-body text-[0.78rem] leading-[1.5] text-[#66575A]">
                      <span className="font-semibold uppercase tracking-[0.1em] text-[#4A1521]">Best For — </span>
                      {level.bestFor}
                    </p>
                    <p className="font-body text-[0.78rem] leading-[1.5] text-[#66575A]">
                      <span className="font-semibold uppercase tracking-[0.1em] text-[#4A1521]">Choose When — </span>
                      {level.chooseWhen}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelect(level.key)}
                    className={`inline-flex h-[46px] w-full items-center justify-center rounded-[2px] border font-body text-[0.76rem] font-semibold uppercase tracking-[0.17em] transition-all duration-200 ${
                      isSelected
                        ? "border-[#4A1521] bg-[#4A1521] text-[#FFF9EF]"
                        : "border-[#4A1521]/25 bg-[#FFF9EF] text-[#4A1521] hover:border-[#4A1521] hover:bg-white"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

LevelSection.displayName = "LevelSection";

export default LevelSection;