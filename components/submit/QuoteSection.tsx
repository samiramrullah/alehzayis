"use client";

import { forwardRef } from "react";
import SectionHeading from "./SectionHeading";
import Corners from "./Corners";

type QuoteSectionProps = {
  wordCount: number;
  ratePerWord: number;
  estimatedCost: number;
  onAccept: () => void;
};

const QuoteSection = forwardRef<HTMLDivElement, QuoteSectionProps>(
  ({ wordCount, ratePerWord, estimatedCost, onAccept }, ref) => {
    return (
      <section ref={ref} className="bg-[#FBF7EF] px-6 py-[70px] sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-[640px]">
          <SectionHeading
            eyebrow="Step Four"
            title="Your Price Quote"
            description="Based on the document you uploaded, here is your estimated cost."
          />

          <div className="relative border border-[#C59B27]/55 bg-[#F8F3EA] p-[3px] shadow-[0_22px_45px_rgba(50,12,20,0.1)]">
            <Corners />
            <div className="border border-[#C59B27]/25 bg-white px-[32px] py-[40px] text-center sm:px-[48px]">
              <div className="mb-[24px] font-body text-[0.85rem] text-[#66575A]">
                Rate: ${ratePerWord.toFixed(3)} per word · Words: {wordCount.toLocaleString()}
              </div>

              <div className="font-display text-[3.4rem] font-normal text-[#4A1521] sm:text-[4rem]">
                ${estimatedCost.toFixed(2)}
              </div>

              <button
                type="button"
                onClick={onAccept}
                className="mt-[32px] inline-flex h-[52px] w-full items-center justify-center rounded-[2px] border border-[#4A1521] bg-[#4A1521] px-[28px] font-body text-[0.8rem] font-semibold uppercase tracking-[0.17em] text-[#FFF9EF] shadow-[0_8px_20px_rgba(74,21,33,0.14)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#310B13] sm:w-auto"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

QuoteSection.displayName = "QuoteSection";

export default QuoteSection;