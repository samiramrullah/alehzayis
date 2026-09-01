"use client";

import SectionHeading from "./SectionHeading";

export default function ContactSection() {
  return (
    <section className="bg-[#FBF7EF] px-6 py-[80px] text-center sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[520px]">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Contact"
          description="Questions before you submit? We're happy to help."
        />

        <a
          target="alehzayis_contactus"
          href="https://alehzayis.com/contact/"
          className="inline-flex h-[49px] items-center justify-center rounded-[2px] border border-[#4A1521] bg-[#4A1521] px-[28px] font-body text-[0.76rem] font-semibold uppercase tracking-[0.17em] text-[#FFF9EF] shadow-[0_8px_20px_rgba(74,21,33,0.14)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#310B13]"
        >
          Contact Us
        </a>

        <div className="mt-[34px]">
          <a
            target="alehzayis"
            href="https://alehzayis.com/"
            className="inline-flex flex-col items-center gap-3 opacity-90 transition-opacity duration-200 hover:opacity-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/mainwebsitelogo.png"
              alt="Machon Aleh Zayis"
              className="h-16 w-auto sm:h-20"
            />
            <span className="font-body text-[0.85rem] italic text-[#8B6816] underline decoration-[#C59B27]/50 underline-offset-4">
              Back to the Main Website
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}