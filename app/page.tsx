"use client";

import Link from "next/link";
import { UploadCloud, Calculator, PenLine, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/submit/SectionHeading";
import Corners from "@/components/submit/Corners";
import HelpContactSection from "@/components/ContactSection";
import Navbar from "@/components/Navbar";

const steps = [
  { icon: UploadCloud, title: "Upload Document", text: "Submit a typed manuscript and select your preferences." },
  { icon: Calculator, title: "Instant Quote", text: "Receive your price based on selections and word count." },
  { icon: PenLine, title: "Expert Editing", text: "Our coordinator will contact you to begin the editing process." },
];

export default function HomePage() {
  return (
    <main className="bg-[#FBF7EF]">
     <Navbar/>
      <section className="relative overflow-hidden bg-[#F8F3EA] px-6 pb-[90px] pt-[50px] sm:px-8 lg:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full bg-[#4A1521]/[0.035]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-220px] left-[-180px] h-[500px] w-[500px] rounded-full bg-[#C59B27]/[0.025]"
        />

        <div className="relative mx-auto max-w-[720px] text-center">
          <div className="mb-[18px] flex items-center justify-center gap-[11px]">
            <span className="h-px w-[25px] bg-[#C59B27]" />
            <span className="font-body text-[0.76rem] font-semibold uppercase tracking-[0.27em] text-[#8B6816]">
              Instant Editor
            </span>
            <span className="h-px w-[25px] bg-[#C59B27]" />
          </div>

          <h1 className="font-display text-[3rem] font-normal leading-[1.05] tracking-[-0.02em] text-[#3A101A] sm:text-[3.7rem]">
            Your manuscript,
            <br />
            <em className="font-medium italic text-[#A77B18]">edited with precision.</em>
          </h1>

          <div className="mx-auto my-[24px] h-[2px] w-[58px] bg-[#C59B27]" />

          <p className="mx-auto mb-[36px] max-w-[540px] font-body text-[1.04rem] leading-[1.72] text-[#55474A]">
            Upload your document, choose your editing level, get an instant price, and let our editors take it from there.
          </p>

          <Link
            href="/submit"
            className="inline-flex h-[52px] items-center justify-center gap-[8px] rounded-[2px] border border-[#4A1521] bg-[#4A1521] px-[36px] font-body text-[0.8rem] font-semibold uppercase tracking-[0.17em] text-[#FFF9EF] shadow-[0_8px_20px_rgba(74,21,33,0.14)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#310B13] hover:shadow-[0_10px_25px_rgba(74,21,33,0.2)]"
          >
            Start Now
            <ArrowRight size={15} strokeWidth={1.6} />
          </Link>
        </div>
      </section>

      <section className="px-6 py-[80px] sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1000px]">
          <SectionHeading
            eyebrow="How It Works"
            title="Three Simple Steps"
            description="Expert editing, a few clicks away."
          />

          <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative border border-[#C59B27]/55 bg-[#F8F3EA] p-[3px]">
                  <Corners />
                  <div className="flex flex-col items-center border border-[#C59B27]/25 bg-white px-[24px] py-[36px] text-center">
                    <Icon size={26} strokeWidth={1.3} className="mb-[16px] text-[#C59B27]" />
                    <h3 className="mb-[8px] font-display text-[1.2rem] text-[#3A101A]">{step.title}</h3>
                    <p className="font-body text-[0.85rem] leading-[1.6] text-[#66575A]">{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <HelpContactSection />
    </main>
  );
}