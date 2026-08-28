"use client";

import { forwardRef } from "react";
import { Check } from "lucide-react";

const SuccessSection = forwardRef<HTMLDivElement, {}>((_, ref) => {
  return (
    <section ref={ref} className="bg-[#F8F3EA] px-6 py-[90px] text-center sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[520px]">
        <div className="relative mx-auto mb-[28px] flex h-[76px] w-[76px] items-center justify-center rounded-full border border-[#C59B27]">
          <Check size={30} strokeWidth={1.8} className="text-[#C59B27]" />
        </div>

        <div className="mb-[14px] flex items-center justify-center gap-[11px]">
          <span className="h-px w-[25px] bg-[#C59B27]" />
          <span className="font-body text-[0.76rem] font-semibold uppercase tracking-[0.27em] text-[#8B6816]">
            Complete
          </span>
          <span className="h-px w-[25px] bg-[#C59B27]" />
        </div>

        <h2 className="font-display text-[2.4rem] font-normal text-[#3A101A]">Success</h2>

        <p className="mx-auto mt-[18px] font-body text-[1.02rem] leading-[1.7] text-[#66575A]">
          Thank you — your manuscript has been submitted and your payment received. Our editors will be in touch shortly to begin work.
        </p>
      </div>
    </section>
  );
});

SuccessSection.displayName = "SuccessSection";

export default SuccessSection;