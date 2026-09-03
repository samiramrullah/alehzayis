"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import Navbar from "../Navbar";

const SuccessSection = forwardRef<HTMLDivElement, {}>((_, ref) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F3EA]">
      <Navbar />
      <section
        ref={ref}
        className="flex flex-1 flex-col items-center justify-center px-6 py-[60px] text-center sm:px-8 lg:px-10"
      >
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
            Thank you - your manuscript has been submitted and your payment received. Our editors will be in touch shortly to begin work.
          </p>

          <div className="mx-auto mt-[36px] flex flex-col items-center justify-center gap-[14px] sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-[48px] w-full items-center justify-center rounded-[2px] border border-[#4A1521] bg-[#4A1521] px-[30px] font-body text-[0.78rem] font-semibold uppercase tracking-[0.17em] text-[#FFF9EF] transition-colors duration-200 hover:bg-[#310B13] sm:w-auto"
            >
              Back to Home
            </Link>
            <a
              target="alehzayis"
              href="https://alehzayis.com/"
              className="inline-flex h-[48px] w-full items-center justify-center rounded-[2px] border border-[#4A1521]/30 px-[30px] font-body text-[0.78rem] font-semibold uppercase tracking-[0.17em] text-[#4A1521] transition-colors duration-200 hover:border-[#4A1521] hover:bg-[#4A1521]/5 sm:w-auto"
            >
              Main Website
            </a>
          </div>
        </div>
      </section>
    </div>
  );
});

SuccessSection.displayName = "SuccessSection";

export default SuccessSection;