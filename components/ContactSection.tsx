"use client";

import { ArrowRight, Headphones } from "lucide-react";

type HelpContactSectionProps = {
  eyebrow?: string;
  headingLine?: string;
  headingAccent?: string;
  description?: string;
  contactHref?: string;
  contactLabel?: string;
  talkTitle?: string;
  talkSubtitle?: string;
  websiteHref?: string;
  websiteDescription?: string;
  logoSrc?: string;
  email?: string;
  phone?: string;
  fax?: string;
  phone2?: string;
};

function DiamondDivider() {
  return (
    <div className="relative left-1/2 flex w-screen -translate-x-1/2 items-center gap-[14px] px-6 sm:px-8 lg:px-10">
      <div className="h-px flex-1 bg-[#C59B27]/45" />
      <svg width="16" height="8" viewBox="0 0 16 8" aria-hidden="true" className="shrink-0">
        <path d="M0 4 L6 0 L6 8 Z" fill="#C59B27" />
        <path d="M16 4 L10 0 L10 8 Z" fill="#C59B27" />
      </svg>
      <div className="h-px flex-1 bg-[#C59B27]/45" />
    </div>
  );
}

export default function HelpContactSection({
  eyebrow = "Questions?",
  headingLine = "We're Here to",
  headingAccent = "Help",
  description = "Not sure which editing level is right for your manuscript? Reach out - our team is happy to guide you.",
  contactHref = "https://alehzayis.com/contact/",
  contactLabel = "Contact Us",
  talkTitle = "Let's Talk",
  talkSubtitle = "Our team is ready to assist you.",
  websiteHref = "https://alehzayis.com/",
  websiteDescription = "Visit our main website",
  logoSrc = "/assets/mainwebsitelogo.png",

}: HelpContactSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#F8F3EA] px-6 pb-[20px] pt-[96px] sm:px-8 lg:px-10">
      <svg
        aria-hidden="true"
        viewBox="0 0 220 320"
        className="pointer-events-none absolute bottom-[-30px] left-[-40px] h-[300px] w-[220px] text-[#4A1521]/[0.05] sm:left-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M20 300 C 20 220, 40 160, 15 90 C 5 60, 15 30, 35 10" />
        <path d="M20 260 C 45 250, 60 230, 55 205" />
        <path d="M20 220 C -5 210, -20 190, -15 165" />
        <path d="M20 180 C 45 170, 60 150, 55 125" />
        <path d="M20 140 C -5 130, -20 110, -15 85" />
        <path d="M22 95 C 45 85, 58 65, 50 42" />
      </svg>

      <div className="relative mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-[56px] lg:grid-cols-2 lg:gap-[80px]">
        <div className="text-center lg:text-left">
          <div className="mb-[18px] flex items-center justify-center gap-[11px] lg:justify-start">
            <span className="font-body text-[0.76rem] font-semibold uppercase tracking-[0.27em] text-[#8B6816]">
              {eyebrow}
            </span>
            <span className="h-px w-[28px] bg-[#C59B27]" />
          </div>

          <h2 className="font-display text-[2.6rem] font-normal leading-[1.1] text-[#3A101A] sm:text-[3.2rem]">
            {headingLine}
            <br />
            <em className="font-medium italic text-[#C59B27]">{headingAccent}</em>
          </h2>

          <div className="mx-auto mt-[22px] h-[2px] w-[44px] bg-[#C59B27] lg:mx-0" />

          <p className="mx-auto mt-[22px] max-w-[400px] font-body text-[1rem] leading-[1.75] text-[#66575A] lg:mx-0">
            {description}
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] rounded-[16px] border border-[#4A1521]/[0.06] bg-[#FFFEFB] px-[36px] py-[44px] text-center shadow-[0_30px_60px_rgba(58,16,26,0.1)]">
          <div className="mx-auto mb-[18px] flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#F8F3EA]">
            <Headphones size={26} strokeWidth={1.5} className="text-[#C59B27]" />
          </div>

          <h3 className="font-display text-[1.5rem] font-normal text-[#3A101A]">{talkTitle}</h3>
          <p className="mt-[6px] font-body text-[0.88rem] text-[#8B7B7E]">{talkSubtitle}</p>

          <a
            href={contactHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-[22px] inline-flex h-[52px] w-full items-center justify-center gap-[10px] rounded-[6px] border border-[#C59B27]/70 bg-[#4A1521] font-body text-[0.8rem] font-semibold uppercase tracking-[0.17em] text-[#FFF9EF] shadow-[0_10px_22px_rgba(74,21,33,0.2)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#310B13]"
          >
            {contactLabel}
            <ArrowRight
              size={15}
              strokeWidth={1.8}
              className="transition-transform duration-200 group-hover:translate-x-[3px]"
            />
          </a>

          <div className="mx-auto my-[26px] flex max-w-[220px] items-center gap-[12px]">
            <div className="h-px flex-1 bg-[#4A1521]/10" />
            <span className="shrink-0 font-body text-[0.66rem] uppercase tracking-[0.22em] text-[#8B7B7E]">Or</span>
            <div className="h-px flex-1 bg-[#4A1521]/10" />
          </div>

          <a
            target="alehzayis"
            href={websiteHref}
            className="group mx-auto flex flex-col items-center gap-[12px] opacity-90 transition-opacity duration-200 hover:opacity-100"
          >
            <img
              src={logoSrc}
              alt="Machon Aleh Zayis"
              className="h-[58px] w-auto object-contain sm:h-[68px]"
            />
            <p className="font-body text-[0.88rem] font-medium text-[#3A101A] underline decoration-[#C59B27]/50 underline-offset-4">
              {websiteDescription}
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}