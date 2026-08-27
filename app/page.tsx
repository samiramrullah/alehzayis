"use client";

import Link from "next/link";
import { FileText, Clock, Calculator, ArrowRight, UploadCloud } from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "Upload your file",
    text: "Drop in a PDF, DOCX, or a scanned image of your manuscript.",
  },
  {
    icon: Calculator,
    title: "We count the words",
    text: "Your document is scanned automatically and priced by the word.",
  },
  {
    icon: Clock,
    title: "Get an instant quote",
    text: "See your estimated cost right away, no waiting on a reply.",
  },
];

export default function LandingPage() {
  return (
    <main className="bg-[#FAF7F1] text-[#1B2430]">
      <nav className="flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-[#C77D3D]" />
          <span className="text-sm font-semibold tracking-[0.15em] uppercase">Quoteline</span>
        </div>
        <Link
          href="/submit"
          className="rounded-full border border-[#1B2430]/15 px-5 py-2 text-sm font-medium hover:border-[#1B2430]/40"
        >
          Get a Quote
        </Link>
      </nav>

      <section className="relative overflow-hidden bg-[#1B2430] text-[#FAF7F1]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #FAF7F1 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#C77D3D]/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
          <span className="mb-6 inline-block rounded-full border border-[#C77D3D]/40 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#E1A959]">
            Instant Document Pricing
          </span>

          <h1 className="mb-6 text-4xl font-semibold leading-[1.1] sm:text-6xl">
            Know your cost
            <br />
            before you commit.
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-[#FAF7F1]/70 sm:text-lg">
            Upload your manuscript and get an automatic, word-count-based quote in seconds. No back-and-forth, no guesswork.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 rounded-full bg-[#C77D3D] px-7 py-3.5 text-sm font-semibold text-[#1B2430] transition-colors hover:bg-[#E1A959]"
            >
              Upload Your Manuscript
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-[#FAF7F1]/20 px-7 py-3.5 text-sm font-semibold text-[#FAF7F1] transition-colors hover:border-[#FAF7F1]/50"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-2xl font-semibold sm:text-3xl">Three steps, one quote</h2>
          <p className="mx-auto max-w-md text-sm text-[#1B2430]/60">
            No account needed to see your price.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative rounded-2xl border border-[#1B2430]/10 bg-white p-7">
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1B2430] text-[#E1A959]">
                  <Icon size={18} />
                </span>
                <span className="absolute right-6 top-6 text-xs font-semibold text-[#1B2430]/25">
                  0{i + 1}
                </span>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-[#1B2430]/60">{step.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-[#1B2430]">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center sm:py-24">
          <h2 className="text-2xl font-semibold text-[#FAF7F1] sm:text-3xl">
            Ready to see your quote?
          </h2>
          <p className="max-w-md text-sm text-[#FAF7F1]/60">
            Takes less than a minute. No sign-up required.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 rounded-full bg-[#C77D3D] px-7 py-3.5 text-sm font-semibold text-[#1B2430] transition-colors hover:bg-[#E1A959]"
          >
            Upload Your Manuscript
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-xs text-[#1B2430]/40">
        © {new Date().getFullYear()} Quoteline. All rights reserved.
      </footer>
    </main>
  );
}