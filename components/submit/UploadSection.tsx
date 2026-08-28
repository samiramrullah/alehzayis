"use client";

import { forwardRef, useRef } from "react";
import { UploadCloud, X, FileText } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Corners from "./Corners";

type UploadSectionProps = {
  files: File[];
  onFiles: (files: FileList) => void;
  onRemove: (index: number) => void;
  onContinue: () => void;
  loading: boolean;
};

const UploadSection = forwardRef<HTMLDivElement, UploadSectionProps>(
  ({ files, onFiles, onRemove, onContinue, loading }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <section ref={ref} className="bg-[#FBF7EF] px-6 py-[70px] sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-[640px]">
          <SectionHeading
            eyebrow="Step Three"
            title="Upload Your Document"
            description="Add one or more files. We accept PDF, Word documents, and images."
          />

          <div className="relative border border-[#C59B27]/55 bg-[#F8F3EA] p-[3px]">
            <Corners />
            <div className="border border-[#C59B27]/25 bg-white px-[24px] py-[32px] sm:px-[36px]">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex h-[120px] w-full flex-col items-center justify-center gap-[10px] rounded-[2px] border border-dashed border-[#4A1521]/25 text-[#8B7B7E] transition-colors duration-200 hover:border-[#C59B27] hover:text-[#4A1521]"
              >
                <UploadCloud size={26} strokeWidth={1.4} />
                <span className="font-body text-[0.85rem]">Click to choose files, or drag them here</span>
              </button>

              <input
                ref={inputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) onFiles(e.target.files);
                  e.target.value = "";
                }}
              />

              {files.length > 0 && (
                <ul className="mt-[20px] space-y-[8px]">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between gap-[12px] border border-[#4A1521]/10 bg-[#FBF7EF] px-[14px] py-[10px]"
                    >
                      <span className="flex min-w-0 items-center gap-[9px] font-body text-[0.85rem] text-[#3A101A]">
                        <FileText size={15} strokeWidth={1.5} className="shrink-0 text-[#C59B27]" />
                        <span className="truncate">{file.name}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemove(index)}
                        aria-label="Remove file"
                        className="shrink-0 text-[#8B7B7E] transition-colors duration-200 hover:text-[#4A1521]"
                      >
                        <X size={16} strokeWidth={1.6} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                onClick={onContinue}
                disabled={files.length === 0 || loading}
                className="mt-[26px] inline-flex h-[52px] w-full items-center justify-center rounded-[2px] border border-[#4A1521] bg-[#4A1521] px-[28px] font-body text-[0.8rem] font-semibold uppercase tracking-[0.17em] text-[#FFF9EF] shadow-[0_8px_20px_rgba(74,21,33,0.14)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#310B13] disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? "Calculating..." : "Calculate Price"}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

UploadSection.displayName = "UploadSection";

export default UploadSection;