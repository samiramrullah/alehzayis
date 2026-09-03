"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UploadCloud, X, FileText, Check } from "lucide-react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "@/components/lib/api";
import { getStripe } from "@/components/lib/stripe";
import HelpContactSection from "@/components/ContactSection";
import Navbar from "@/components/Navbar";
import SuccessSection from "@/components/submit/SuccessSection";

type ServiceKey = "proofreading" | "midLevel" | "heavyEditing";
type LanguageKey = "hebrew" | "english" | "yiddish";

const ALL_SERVICES = [
  { key: "grammar", label: "Grammar, spelling, and punctuation" },
  { key: "formatting", label: "Consistent headings, spacing, and formatting" },
  { key: "hebrewTerms", label: "Consistent spelling of Hebrew terms" },
  { key: "namesTerminology", label: "Consistent use of names and terminology" },
  { key: "naturalEnglish", label: "Make translated text sound natural in English" },
  { key: "clarity", label: "Improve unclear, awkward, or difficult-to-read writing" },
  { key: "organizeIdeas", label: "Organize ideas in a clearer, more logical order" },
  { key: "reorganizeSections", label: "Reorganize sections and paragraphs" },
  { key: "removeRepetition", label: "Remove repetition across the document" },
  { key: "flagGaps", label: "Flag missing explanations and areas that may confuse readers" },
];

const levels: {
  key: ServiceKey;
  title: string;
  subTitle: string;
  eyebrow: string;
  bestFor: string;
  chooseWhen: string;
  services: string[];
}[] = [
    {
      key: "proofreading",
      title: "Copy Editing",
      subTitle: "Correct and Polish",
      eyebrow: "Level 1",
      bestFor: "Manuscripts that are well written and need a final review before publication.",
      chooseWhen:
        "Your manuscript is complete and has already been through developmental or language editing — you just need a final, careful check before it goes to print.",
      services: ["grammar", "formatting", "hebrewTerms", "namesTerminology"],
    },
    {
      key: "midLevel",
      title: "Language Editing",
      subTitle: "Refine the Language",
      eyebrow: "Level 2",
      bestFor: "Manuscripts with strong content that need clearer, more natural language.",
      chooseWhen:
        "Your manuscript is well-organized and the ideas are in place, but the prose itself — especially translated or bilingual text — needs to read more naturally and clearly.",
      services: ["grammar", "formatting", "hebrewTerms", "namesTerminology", "naturalEnglish", "clarity"],
    },
    {
      key: "heavyEditing",
      title: "Substantive Editing",
      subTitle: "Restructure and Clarify",
      eyebrow: "Level 3",
      bestFor: "Manuscripts that need improvement in structure, organization, and clarity.",
      chooseWhen:
        "Your manuscript still needs structural work — reordering sections, tightening arguments, and closing gaps — in addition to line-level polish.",
      services: [
        "grammar",
        "formatting",
        "hebrewTerms",
        "namesTerminology",
        "naturalEnglish",
        "clarity",
        "organizeIdeas",
        "reorganizeSections",
        "removeRepetition",
        "flagGaps",
      ],
    },
  ];

const languages: { key: LanguageKey; label: string }[] = [
  { key: "hebrew", label: "Hebrew" },
  { key: "english", label: "English" },
  { key: "yiddish", label: "Yiddish" },
];

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidPhone = (value: string) => value.replace(/\D/g, "").length >= 7;

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
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [clientSecret, setClientSecret] = useState("");
  const [creatingIntent, setCreatingIntent] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const intentRequestedFor = useRef<number | null>(null);

  useEffect(() => {
    if (!level) {
      setSelectedServices([]);
      return;
    }
    const included = levels.find((l) => l.key === level)?.services ?? [];
    setSelectedServices(included);
  }, [level]);

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
    if (!quote || !isValidEmail(email) || !isValidPhone(phone)) return;
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
  }, [quote, email, phone]);

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

  const toggleService = (key: string) => {
    setSelectedServices((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const finalizeSubmission = async () => {
    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("file", files[0]);
      formData.append("language", language === "yiddish" ? "english" : language ?? "english");
      formData.append("service", level ?? "proofreading");
      formData.append("editingServices", JSON.stringify(selectedServices));

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
      <SuccessSection />
    );
  }

  return (
    <main className="min-h-screen bg-[#FBF7EF]">
      <Navbar />

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
                <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-3">
                  {levels.map((item) => {
                    const isSelected = level === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setLevel(item.key)}
                        className={`relative flex flex-col items-start gap-[6px] rounded-[3px] border px-[14px] py-[14px] text-left transition-all duration-200 ${isSelected
                            ? "border-[#4A1521] bg-[#4A1521] shadow-[0_10px_24px_rgba(74,21,33,0.18)]"
                            : "border-[#4A1521]/20 bg-[#FBF7EF] hover:border-[#C59B27] hover:bg-white"
                          }`}
                      >
                        {isSelected && (
                          <span className="absolute right-[10px] top-[10px] flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#C59B27]">
                            <Check size={10} strokeWidth={3} className="text-[#4A1521]" />
                          </span>
                        )}
                        <span
                          className={`font-body text-[0.64rem] font-semibold uppercase tracking-[0.18em] ${isSelected ? "text-[#C59B27]" : "text-[#8B6816]"
                            }`}
                        >
                          {item.eyebrow}
                        </span>
                        <span
                          className={`font-display text-[1.05rem] font-normal leading-tight ${isSelected ? "text-[#FFF9EF]" : "text-[#3A101A]"
                            }`}
                        >
                          {item.title}
                        </span>
                        <span
                          className={`font-body text-[0.76rem] leading-[1.45] ${isSelected ? "text-[#FFF9EF]/75" : "text-[#8B7B7E]"
                            }`}
                        >
                          {item.subTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selectedLevel && (
                  <div className="mt-[12px] space-y-[8px] rounded-[2px] border border-[#C59B27]/30 bg-[#FBF7EF] px-[14px] py-[12px]">
                    <div className="flex items-start gap-[8px]">
                      <span className="shrink-0 pt-0.5 font-body text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#8B6816]">
                        Best for
                      </span>
                      <span className="font-body text-[0.8rem] leading-[1.5] text-[#3A101A]">{selectedLevel.bestFor}</span>
                    </div>
                    
                  </div>
                )}
              </div>

              <div>
                <div className="mb-[6px] font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#8B6816]">
                  Editing Services
                </div>

                {!selectedLevel && (
                  <p className="rounded-[2px] border border-dashed border-[#4A1521]/20 bg-[#FBF7EF] px-[12px] py-[14px] font-body text-[0.8rem] text-[#8B7B7E]">
                    Choose an editing level above to see what's included.
                  </p>
                )}

                {selectedLevel && (
                  <>
                    <p className="mb-[10px] font-body text-[0.76rem] text-[#8B7B7E]">
                      Included with {selectedLevel.title}. Deselect anything you don't want applied.
                    </p>
                    <div className="space-y-[6px]">
                      {ALL_SERVICES.filter((s) => selectedLevel.services.includes(s.key)).map((item) => {
                        const checked = selectedServices.includes(item.key);
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => toggleService(item.key)}
                            className="flex w-full items-center gap-[10px] rounded-[2px] border border-[#4A1521]/12 bg-white px-[12px] py-[9px] text-left transition-colors duration-200 hover:border-[#C59B27]/60"
                          >
                            <span
                              className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${checked ? "border-[#4A1521] bg-[#4A1521]" : "border-[#4A1521]/25 bg-white"
                                }`}
                            >
                              {checked && <Check size={11} strokeWidth={2.5} className="text-[#FFF9EF]" />}
                            </span>
                            <span
                              className={`font-body text-[0.82rem] ${checked ? "text-[#3A101A]" : "text-[#8B7B7E] line-through"
                                }`}
                            >
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
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
                        className={`flex h-[44px] items-center justify-center rounded-[2px] border font-body text-[0.85rem] font-medium transition-all duration-200 ${isSelected
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
                      ${quote.ratePerWord.toFixed(2)}/word · {quote.wordCount.toLocaleString()} words
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
                    placeholder="Phone *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-[42px] w-full rounded-[2px] border border-[#4A1521]/20 bg-white px-[14px] font-body text-[0.88rem] text-[#3A101A] outline-none transition-colors duration-200 focus:border-[#C59B27]"
                  />
                </div>
              </div>

              <div className="border-t border-[#4A1521]/10 pt-[20px]">
                <div className="mb-[10px] font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#8B6816]">
                  Payment
                </div>

                {!quote && <p className="font-body text-[0.82rem] text-[#8B7B7E]">Complete the details above first.</p>}

                {quote && (!isValidEmail(email) || !isValidPhone(phone)) && (
                  <p className="font-body text-[0.82rem] text-[#8B7B7E]">Enter your email and phone number to continue.</p>
                )}

                {quote && isValidEmail(email) && isValidPhone(phone) && (creatingIntent || !clientSecret) && (
                  <p className="font-body text-[0.82rem] text-[#8B7B7E]">Preparing payment...</p>
                )}

                {quote && isValidEmail(email) && isValidPhone(phone) && clientSecret && (
                  <Elements stripe={getStripe()} options={{ clientSecret }}>
                    <PaymentForm amount={quote.estimatedCost} onSuccess={finalizeSubmission} />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <HelpContactSection />
    </main>
  );
}