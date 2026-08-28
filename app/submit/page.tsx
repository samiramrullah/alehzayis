"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UploadCloud, X, FileText, Check } from "lucide-react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "@/components/lib/api";
import { getStripe } from "@/components/lib/stripe";
import ContactSection from "@/components/submit/ContactSection";

type ServiceKey = "proofreading" | "midLevel" | "heavyEditing";
type LanguageKey = "hebrew" | "english" | "yiddish";

const levels: { key: ServiceKey; title: string; bestFor: string }[] = [
  { key: "proofreading", title: "Copyediting", bestFor: "A careful, final pass on polished writing." },
  { key: "midLevel", title: "Language Editing", bestFor: "Sharpens writing that already reads well." },
  { key: "heavyEditing", title: "Substantive Editing", bestFor: "A full editorial partner for manuscripts still taking shape." },
];

const languages: { key: LanguageKey; label: string }[] = [
  { key: "hebrew", label: "Hebrew" },
  { key: "english", label: "English" },
  { key: "yiddish", label: "Yiddish" },
];

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function PaymentForm({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setPaying(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/submit`,
      },
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setPaying(false);
      return;
    }

    onSuccess();
  };

  return (
    <div>
      <PaymentElement />
      <button
        type="button"
        onClick={handlePay}
        disabled={!stripe || paying}
        className="mt-[16px] inline-flex h-[48px] w-full items-center justify-center rounded-[2px] border border-[#4A1521] bg-[#4A1521] px-[24px] font-body text-[0.76rem] font-semibold uppercase tracking-[0.17em] text-[#FFF9EF] shadow-[0_8px_20px_rgba(74,21,33,0.14)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#310B13] disabled:pointer-events-none disabled:opacity-50"
      >
        {paying ? "Processing..." : `Confirm & Pay $${amount.toFixed(2)}`}
      </button>
    </div>
  );
}

export default function SubmitPage() {
  const [level, setLevel] = useState<ServiceKey | null>(null);
  const [language, setLanguage] = useState<LanguageKey | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [quote, setQuote] = useState<{ wordCount: number; ratePerWord: number; estimatedCost: number } | null>(null);
  const [calculating, setCalculating] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [clientSecret, setClientSecret] = useState("");
  const [creatingIntent, setCreatingIntent] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const intentRequestedFor = useRef<number | null>(null);

  useEffect(() => {
    if (!level || !language || files.length === 0) {
      setQuote(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setCalculating(true);
        let totalWords = 0;
        let totalCost = 0;

        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("language", language === "yiddish" ? "english" : language);
          formData.append("service", level);

          const response = await api.post("/api/submissions/estimate", formData);
          totalWords += response.data.data.wordCount;
          totalCost += response.data.data.estimatedCost;
        }

        setQuote({
          wordCount: totalWords,
          ratePerWord: totalWords > 0 ? totalCost / totalWords : 0,
          estimatedCost: totalCost,
        });
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Unable to calculate a price");
        setQuote(null);
      } finally {
        setCalculating(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [files, level, language]);

  useEffect(() => {
    if (!quote || !isValidEmail(email)) return;
    if (intentRequestedFor.current === quote.estimatedCost) return;

    intentRequestedFor.current = quote.estimatedCost;

    (async () => {
      try {
        setCreatingIntent(true);
        const response = await api.post("/api/payments/create-intent", { amount: quote.estimatedCost });
        setClientSecret(response.data.clientSecret);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Unable to start payment");
      } finally {
        setCreatingIntent(false);
      }
    })();
  }, [quote, email]);

  const onFiles = (incoming: FileList) => {
    const accepted: File[] = [];
    const rejected: string[] = [];

    Array.from(incoming).forEach((file) => {
      if (file.name.toLowerCase().endsWith(".docx")) {
        accepted.push(file);
      } else {
        rejected.push(file.name);
      }
    });

    if (rejected.length > 0) {
      toast.error(
        rejected.length === 1
          ? `"${rejected[0]}" isn't allowed — only .docx files are accepted right now.`
          : `${rejected.length} files weren't added — only .docx files are accepted right now.`
      );
    }

    if (accepted.length === 0) return;

    setFiles((prev) => [...prev, ...accepted]);
    setClientSecret("");
    intentRequestedFor.current = null;
  };

  const onRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setClientSecret("");
    intentRequestedFor.current = null;
  };

  const finalizeSubmission = async () => {
    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("file", files[0]);
      formData.append("language", language === "yiddish" ? "english" : language ?? "english");
      formData.append("service", level ?? "proofreading");

      await api.post("/api/submissions", formData);
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Payment succeeded, but the submission failed to save");
    }
  };

  const selectedLevel = levels.find((l) => l.key === level);
  const selectedLanguage = languages.find((l) => l.key === language);

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FBF7EF] px-6">
        <div className="mx-auto max-w-[480px] text-center">
          <div className="relative mx-auto mb-[24px] flex h-[68px] w-[68px] items-center justify-center rounded-full border border-[#C59B27]">
            <Check size={26} strokeWidth={1.8} className="text-[#C59B27]" />
          </div>
          <div className="mb-[12px] flex items-center justify-center gap-[10px]">
            <span className="h-px w-[22px] bg-[#C59B27]" />
            <span className="font-body text-[0.74rem] font-semibold uppercase tracking-[0.25em] text-[#8B6816]">Complete</span>
            <span className="h-px w-[22px] bg-[#C59B27]" />
          </div>
          <h2 className="font-display text-[2.2rem] font-normal text-[#3A101A]">Success</h2>
          <p className="mx-auto mt-[16px] font-body text-[0.98rem] leading-[1.65] text-[#66575A]">
            Thank you — your manuscript has been submitted and your payment received. Our editors will be in touch shortly to begin work.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBF7EF]">
      <nav className="flex items-center justify-between border-b border-[#4A1521]/10 px-6 py-[16px] sm:px-10">
        <span className="font-display text-[1.05rem] tracking-[0.04em] text-[#4A1521]">Machon Aleh Zayis</span>
        <div className="flex items-center gap-[9px] font-body text-[0.72rem] italic text-[#8B6816]">
          <span className="text-[#C59B27]">◆</span>
          Instant Editor
        </div>
      </nav>

      <div className="mx-auto max-w-[1180px] px-6 py-[36px] sm:px-8 lg:px-10">
        <div className="relative border border-[#C59B27]/55 bg-[#F8F3EA] p-[3px] shadow-[0_22px_45px_rgba(50,12,20,0.1)]">
          <span aria-hidden="true" className="pointer-events-none absolute left-[5px] top-[5px] z-30 h-[13px] w-[13px] border-l border-t border-[#C59B27]" />
          <span aria-hidden="true" className="pointer-events-none absolute right-[5px] top-[5px] z-30 h-[13px] w-[13px] border-r border-t border-[#C59B27]" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-[5px] left-[5px] z-30 h-[13px] w-[13px] border-b border-l border-[#C59B27]" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-[5px] right-[5px] z-30 h-[13px] w-[13px] border-b border-r border-[#C59B27]" />

          <div className="grid grid-cols-1 border border-[#C59B27]/25 bg-white lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-[26px] border-b border-[#4A1521]/10 px-[24px] py-[28px] sm:px-[32px] lg:border-b-0 lg:border-r">
              <div>
                <div className="mb-[10px] font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#8B6816]">
                  Editing Level
                </div>
                <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-3">
                  {levels.map((item) => {
                    const isSelected = level === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setLevel(item.key)}
                        className={`flex min-h-[52px] items-center justify-center rounded-[2px] border px-[10px] py-[10px] text-center font-body text-[0.82rem] font-medium leading-tight transition-all duration-200 ${
                          isSelected
                            ? "border-[#4A1521] bg-[#4A1521] text-[#FFF9EF]"
                            : "border-[#4A1521]/20 bg-[#FBF7EF] text-[#4A1521] hover:border-[#4A1521]/50"
                        }`}
                      >
                        {item.title}
                      </button>
                    );
                  })}
                </div>
                {selectedLevel && (
                  <p className="mt-[10px] font-body text-[0.78rem] italic leading-[1.5] text-[#8B7B7E]">
                    {selectedLevel.bestFor}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-[10px] font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#8B6816]">
                  Language
                </div>
                <div className="grid grid-cols-3 gap-[8px]">
                  {languages.map((lang) => {
                    const isSelected = language === lang.key;
                    return (
                      <button
                        key={lang.key}
                        type="button"
                        onClick={() => setLanguage(lang.key)}
                        className={`flex h-[44px] items-center justify-center rounded-[2px] border font-body text-[0.85rem] font-medium transition-all duration-200 ${
                          isSelected
                            ? "border-[#4A1521] bg-[#4A1521] text-[#FFF9EF]"
                            : "border-[#4A1521]/20 bg-[#FBF7EF] text-[#4A1521] hover:border-[#4A1521]/50"
                        }`}
                      >
                        {lang.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-[10px] font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#8B6816]">
                  Upload Document(s)
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-[84px] w-full flex-col items-center justify-center gap-[6px] rounded-[2px] border border-dashed border-[#4A1521]/25 bg-[#FBF7EF] text-[#8B7B7E] transition-colors duration-200 hover:border-[#C59B27] hover:text-[#4A1521]"
                >
                  <UploadCloud size={20} strokeWidth={1.5} />
                  <span className="font-body text-[0.8rem]">Click to choose a file — .docx only</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".docx"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) onFiles(e.target.files);
                    e.target.value = "";
                  }}
                />

                {files.length > 0 && (
                  <div className="mt-[10px] flex flex-wrap gap-[8px]">
                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center gap-[7px] rounded-[2px] border border-[#4A1521]/15 bg-[#FBF7EF] py-[6px] pl-[10px] pr-[7px]"
                      >
                        <FileText size={13} strokeWidth={1.6} className="shrink-0 text-[#C59B27]" />
                        <span className="max-w-[140px] truncate font-body text-[0.78rem] text-[#3A101A]">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => onRemoveFile(index)}
                          aria-label="Remove file"
                          className="shrink-0 text-[#8B7B7E] hover:text-[#4A1521]"
                        >
                          <X size={13} strokeWidth={1.8} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-[20px] bg-[#FBF7EF] px-[24px] py-[28px] sm:px-[32px] lg:sticky lg:top-[20px] lg:self-start">
              <div>
                <div className="mb-[12px] font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#8B6816]">
                  Your Quote
                </div>

                <div className="space-y-[6px] font-body text-[0.85rem] text-[#55474A]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8B7B7E]">Level</span>
                    <span className="font-medium text-[#3A101A]">{selectedLevel ? selectedLevel.title : "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8B7B7E]">Language</span>
                    <span className="font-medium text-[#3A101A]">{selectedLanguage ? selectedLanguage.label : "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8B7B7E]">Files</span>
                    <span className="font-medium text-[#3A101A]">{files.length || "—"}</span>
                  </div>
                </div>

                <div className="my-[16px] h-px bg-[#4A1521]/10" />

                {calculating && <p className="font-body text-[0.82rem] text-[#8B7B7E]">Calculating your price...</p>}

                {!calculating && !quote && (
                  <p className="font-body text-[0.82rem] text-[#8B7B7E]">
                    Fill in the details on the left to see your price here.
                  </p>
                )}

                {!calculating && quote && (
                  <div>
                    <div className="mb-[8px] font-body text-[0.8rem] text-[#66575A]">
                      ${quote.ratePerWord.toFixed(3)}/word · {quote.wordCount.toLocaleString()} words
                    </div>
                    <div className="font-display text-[2.3rem] font-normal text-[#4A1521]">
                      ${quote.estimatedCost.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-[#4A1521]/10 pt-[20px]">
                <div className="mb-[10px] font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#8B6816]">
                  Contact Details
                </div>

                <div className="space-y-[10px]">
                  <input
                    type="email"
                    placeholder="Email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-[42px] w-full rounded-[2px] border border-[#4A1521]/20 bg-white px-[14px] font-body text-[0.88rem] text-[#3A101A] outline-none transition-colors duration-200 focus:border-[#C59B27]"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-[42px] w-full rounded-[2px] border border-[#4A1521]/20 bg-white px-[14px] font-body text-[0.88rem] text-[#3A101A] outline-none transition-colors duration-200 focus:border-[#C59B27]"
                  />
                </div>
              </div>

              <div className="border-t border-[#4A1521]/10 pt-[20px]">
                <div className="mb-[10px] font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#8B6816]">
                  Payment
                </div>

                {!quote && <p className="font-body text-[0.82rem] text-[#8B7B7E]">Complete the details above first.</p>}

                {quote && !isValidEmail(email) && (
                  <p className="font-body text-[0.82rem] text-[#8B7B7E]">Enter your email to continue.</p>
                )}

                {quote && isValidEmail(email) && (creatingIntent || !clientSecret) && (
                  <p className="font-body text-[0.82rem] text-[#8B7B7E]">Preparing payment...</p>
                )}

                {quote && isValidEmail(email) && clientSecret && (
                  <Elements stripe={getStripe()} options={{ clientSecret }}>
                    <PaymentForm amount={quote.estimatedCost} onSuccess={finalizeSubmission} />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactSection />
    </main>
  );
}