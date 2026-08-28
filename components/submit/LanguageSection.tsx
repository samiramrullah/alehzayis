"use client";

import { forwardRef } from "react";
import SectionHeading from "./SectionHeading";
import Corners from "./Corners";

export type LanguageKey = "hebrew" | "english" | "yiddish";

const languages: { key: LanguageKey; label: string }[] = [
  { key: "hebrew", label: "Hebrew" },
  { key: "english", label: "English" },
  { key: "yiddish", label: "Yiddish" },
];

type LanguageSectionProps = {
  selected: LanguageKey | null;
  onSelect: (key: LanguageKey) => void;
};

const LanguageSection = forwardRef<HTMLDivElement, LanguageSectionProps>(({ selected, onSelect }, ref) => {
  return (
    <section ref={ref} className="bg-[#F8F3EA] px-6 py-[70px] sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[640px]">
        <SectionHeading
          eyebrow="Step Two"
          title="Choose Your Language"
          description="Which language is your manuscript written in?"
        />

        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-3">
          {languages.map((lang) => {
            const isSelected = selected === lang.key;
            return (
              <button
                key={lang.key}
                type="button"
                onClick={() => onSelect(lang.key)}
                className={`relative border p-[3px] transition-all duration-200 ${
                  isSelected ? "border-[#C59B27]" : "border-[#C59B27]/30 hover:border-[#C59B27]/55"
                }`}
              >
                {isSelected && <Corners />}
                <div
                  className={`flex h-[80px] items-center justify-center border font-display text-[1.15rem] transition-colors duration-200 ${
                    isSelected
                      ? "border-[#4A1521] bg-[#4A1521] text-[#FFF9EF]"
                      : "border-[#C59B27]/25 bg-white text-[#3A101A]"
                  }`}
                >
                  {lang.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
});

LanguageSection.displayName = "LanguageSection";

export default LanguageSection;