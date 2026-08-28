"use client";

import { forwardRef, useState, FormEvent } from "react";
import SectionHeading from "./SectionHeading";
import Corners from "./Corners";

export type ClientInfo = {
  email: string;
  phone: string;
};

type ClientInfoSectionProps = {
  onSubmit: (info: ClientInfo) => void;
};

const ClientInfoSection = forwardRef<HTMLDivElement, ClientInfoSectionProps>(
  ({ onSubmit }, ref) => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (!email) return;
      onSubmit({ email, phone });
    };

    return (
      <section ref={ref} className="bg-[#F8F3EA] px-6 py-[70px] sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-[560px]">
          <SectionHeading
            eyebrow="Step Five"
            title="Your Information"
            description="Let us know how to reach you about your submission."
          />

          <div className="relative border border-[#C59B27]/55 bg-[#FBF7EF] p-[3px] shadow-[0_22px_45px_rgba(50,12,20,0.1)]">
            <Corners />
            <form
              onSubmit={handleSubmit}
              className="border border-[#C59B27]/25 bg-white px-[32px] py-[40px] sm:px-[48px]"
            >
              <div className="mb-[22px]">
                <label className="mb-[8px] block font-body text-[0.76rem] font-semibold uppercase tracking-[0.17em] text-[#4A1521]">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[48px] w-full rounded-[2px] border border-[#4A1521]/20 bg-[#FBF7EF] px-[16px] font-body text-[0.95rem] text-[#3A101A] outline-none transition-colors duration-200 focus:border-[#C59B27]"
                />
              </div>

              <div className="mb-[28px]">
                <label className="mb-[8px] block font-body text-[0.76rem] font-semibold uppercase tracking-[0.17em] text-[#4A1521]">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-[48px] w-full rounded-[2px] border border-[#4A1521]/20 bg-[#FBF7EF] px-[16px] font-body text-[0.95rem] text-[#3A101A] outline-none transition-colors duration-200 focus:border-[#C59B27]"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-[52px] w-full items-center justify-center rounded-[2px] border border-[#4A1521] bg-[#4A1521] px-[28px] font-body text-[0.8rem] font-semibold uppercase tracking-[0.17em] text-[#FFF9EF] shadow-[0_8px_20px_rgba(74,21,33,0.14)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#310B13] sm:w-auto"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }
);

ClientInfoSection.displayName = "ClientInfoSection";

export default ClientInfoSection;