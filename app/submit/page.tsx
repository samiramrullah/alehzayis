"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FileText, UploadCloud, Calculator, Send, ArrowLeft } from "lucide-react";
import api from "@/components/lib/api";

const services = [
  { key: "heavyEditing", label: "Heavy Editing" },
  { key: "midLevel", label: "Mid-Level" },
  { key: "proofreading", label: "Proofreading" },
] as const;

type ServiceKey = (typeof services)[number]["key"];

export default function SubmitPage() {
  const [tab, setTab] = useState<"calculate" | "submit">("calculate");

  return (
    <main className="min-h-screen bg-[#EEF0F3] text-[#1B2430]">
      <nav className="flex items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="flex items-center gap-2">
          <FileText size={20} className="text-[#C77D3D]" />
          <span className="text-sm font-semibold tracking-[0.15em] uppercase">Quoteline</span>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-[#1B2430]/60 hover:text-[#1B2430]">
          <ArrowLeft size={15} />
          Back home
        </Link>
      </nav>

      <div className="mx-auto max-w-lg px-6 pb-16 pt-4 sm:pt-8">
        <h1 className="mb-1 text-2xl font-semibold sm:text-3xl">Price Your Manuscript</h1>
        <p className="mb-6 text-sm text-[#1B2430]/55">
          Get an instant estimate, or submit for a formal review.
        </p>

        <div className="mb-6 inline-flex rounded-full border border-black/5 bg-white p-1 shadow-sm">
          <button
            onClick={() => setTab("calculate")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === "calculate" ? "bg-[#1B2430] text-[#FAF7F1]" : "text-[#1B2430]/55 hover:text-[#1B2430]"
            }`}
          >
            <Calculator size={14} />
            Calculate Price
          </button>
          <button
            onClick={() => setTab("submit")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === "submit" ? "bg-[#1B2430] text-[#FAF7F1]" : "text-[#1B2430]/55 hover:text-[#1B2430]"
            }`}
          >
            <Send size={14} />
            Submit for Review
          </button>
        </div>

        {tab === "calculate" ? <CalculateSection /> : <SubmitSection />}
      </div>
    </main>
  );
}

function CalculateSection() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<"english" | "hebrew">("english");
  const [service, setService] = useState<ServiceKey>("proofreading");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ wordCount: number; estimatedCost: number } | null>(null);

  const onCalculate = async () => {
    if (!file) {
      toast.error("Please choose a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);
    formData.append("service", service);

    try {
      setLoading(true);
      const response = await api.post("/api/submissions/estimate", formData);
      const data = response.data.data;
      setResult(data);
      toast.success(`Estimated cost: $${data.estimatedCost.toFixed(2)}`, {
        description: `${data.wordCount.toLocaleString()} words`,
        duration: 5000,
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to calculate a price");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)] sm:p-6">
      <LanguageAndService language={language} setLanguage={setLanguage} service={service} setService={setService} />
      <FileDropzone file={file} setFile={setFile} />

      <button
        onClick={onCalculate}
        disabled={loading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#C77D3D] text-sm font-semibold text-[#1B2430] transition-colors hover:bg-[#E1A959] disabled:opacity-60"
      >
        {loading ? "Calculating..." : "Calculate Price"}
      </button>

      {result && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-[#1B2430] px-4 py-3 text-sm text-[#FAF7F1]">
          <span className="text-[#FAF7F1]/60">{result.wordCount.toLocaleString()} words</span>
          <span className="text-[#FAF7F1]/30">•</span>
          <span className="font-semibold text-[#E1A959]">${result.estimatedCost.toFixed(2)} estimated</span>
        </div>
      )}
    </div>
  );
}

function SubmitSection() {
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<"english" | "hebrew">("english");
  const [service, setService] = useState<ServiceKey>("proofreading");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ wordCount: number; estimatedCost: number } | null>(null);

  const onSubmit = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!file) {
      toast.error("Please choose a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("file", file);
    formData.append("language", language);
    formData.append("service", service);

    try {
      setLoading(true);
      const response = await api.post("/api/submissions", formData);
      const { wordCount, estimatedCost } = response.data.data;

      setResult({ wordCount, estimatedCost });
      toast.success("Manuscript submitted for review", {
        description: `${wordCount.toLocaleString()} words  •  $${estimatedCost.toFixed(2)} estimated`,
        duration: 6000,
      });
      setFile(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to submit your file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)] sm:p-6">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#1B2430]/60">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-11 w-full rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-[#C77D3D]"
        />
      </div>

      <LanguageAndService language={language} setLanguage={setLanguage} service={service} setService={setService} />
      <FileDropzone file={file} setFile={setFile} />

      <button
        onClick={onSubmit}
        disabled={loading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#1B2430] text-sm font-semibold text-[#FAF7F1] transition-colors hover:bg-[#2A374B] disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit for Review"}
      </button>

      {result && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-[#EEF0F3] px-4 py-3 text-sm">
          <span className="text-[#1B2430]/55">{result.wordCount.toLocaleString()} words</span>
          <span className="text-[#1B2430]/25">•</span>
          <span className="font-semibold text-[#C77D3D]">${result.estimatedCost.toFixed(2)} estimated</span>
        </div>
      )}
    </div>
  );
}

function LanguageAndService({
  language,
  setLanguage,
  service,
  setService,
}: {
  language: "english" | "hebrew";
  setLanguage: (v: "english" | "hebrew") => void;
  service: ServiceKey;
  setService: (v: ServiceKey) => void;
}) {
  return (
    <>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#1B2430]/60">Language</label>
        <div className="flex gap-2">
          {(["english", "hebrew"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm capitalize transition-colors ${
                language === lang ? "border-[#1B2430] bg-[#1B2430] text-[#FAF7F1]" : "border-black/10 text-[#1B2430]/55"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#1B2430]/60">Service</label>
        <div className="grid grid-cols-3 gap-2">
          {services.map((s) => (
            <button
              key={s.key}
              onClick={() => setService(s.key)}
              className={`rounded-xl border px-2 py-2 text-center text-xs font-medium leading-tight transition-colors sm:text-sm ${
                service === s.key ? "border-[#1B2430] bg-[#1B2430] text-[#FAF7F1]" : "border-black/10 text-[#1B2430]/55"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function FileDropzone({ file, setFile }: { file: File | null; setFile: (f: File | null) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#1B2430]/60">File</label>
      <label className="flex h-20 cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-dashed border-black/15 px-4 text-[#1B2430]/50 hover:border-[#C77D3D]">
        <UploadCloud size={18} strokeWidth={1.5} />
        <span className="truncate text-sm">{file ? file.name : "Click to choose a PDF, DOCX, or image"}</span>
        <input
          type="file"
          accept=".pdf,.docx,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}