"use client";

import { forwardRef } from "react";

type HeroSectionProps = {
  onStart: () => void;
};

const HeroSection = forwardRef<HTMLDivElement, HeroSectionProps>(({ onStart }, ref) => {
  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#F8F3EA] px-6 pb-[90px] pt-[80px] text-center sm:px-8 lg:px-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full bg-[#4A1521]/[0.035]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-220px] left-[-180px] h-[500px] w-[500px] rounded-full bg-[#C59B27]/[0.025]"
      />

      <div className="relative mx-auto max-w-[680px]">
        <div className="mb-[18px] flex items-center justify-center gap-[11px]">
          <span className="h-px w-[25px] bg-[#C59B27]" />
          <span className="font-body text-[0.76rem] font-semibold uppercase tracking-[0.27em] text-[#8B6816]">
            Aleh Zayis Instant Editor
          </span>
          <span className="h-px w-[25px] bg-[#C59B27]" />
        </div>

        <h1 className="font-display text-[2.7rem] font-normal leading-[1.05] tracking-[-0.02em] text-[#3A101A] sm:text-[3.4rem]">
          Expert editing,
          <br />
          <em className="font-medium italic text-[#A77B18]">just a few clicks away.</em>
        </h1>

        <div className="mx-auto my-[24px] h-[2px] w-[58px] bg-[#C59B27]" />

        <p className="mx-auto mb-[36px] max-w-[520px] font-body text-[1.04rem] leading-[1.72] text-[#55474A]">
          Upload your manuscript, choose the level of editing you need, and see your price instantly — no waiting for a callback, no back and forth.
        </p>

        <button
          type="button"
          onClick={onStart}
          className="inline-flex h-[52px] items-center justify-center rounded-[2px] border border-[#4A1521] bg-[#4A1521] px-[36px] font-body text-[0.8rem] font-semibold uppercase tracking-[0.17em] text-[#FFF9EF] shadow-[0_8px_20px_rgba(74,21,33,0.14)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#310B13] hover:shadow-[0_10px_25px_rgba(74,21,33,0.2)]"
        >
          Start Now
        </button>

        <div className="mt-[28px] flex items-center justify-center gap-[9px] font-body text-[0.79rem] italic text-[#65575A]">
          <span className="font-normal text-[#C59B27]">◆</span>
          <span>Editing seforim, manuscripts &amp; documents in Hebrew, English &amp; Yiddish.</span>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;