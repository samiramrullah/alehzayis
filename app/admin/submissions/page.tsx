"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Download, Trash2, Eye, Check, X, Copy } from "lucide-react";
import api from "@/components/lib/api";
import Topbar from "@/components/lib/admin/Topbar";
import Modal from "@/components/lib/admin/Model";

type Submission = {
  _id: string;
  originalName: string;
  email: string;
  phone?: string;
  language: "english" | "hebrew";
  service: "heavyEditing" | "midLevel" | "proofreading";
  wordCount: number | null;
  estimatedCost: number | null;
  requiresManualQuote: boolean;
  status: "new" | "reviewed" | "sent";
  createdAt: string;
  projectNumber?: string;
  editingServices?: string[];
};

const tabs = [
  { key: "new", label: "New" },
  { key: "reviewed", label: "Reviewed" },
  { key: "sent", label: "Sent" },
  { key: "all", label: "Show All" },
] as const;

const serviceLabels: Record<string, string> = {
  heavyEditing: "Heavy Editing",
  midLevel: "Mid-Level",
  proofreading: "Proofreading",
};

const editingServices = [
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

const formatDate = (value: string) => {
  const d = new Date(value);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}/${d.getFullYear()}`;
};

const statusStyles: Record<Submission["status"], string> = {
  new: "bg-blue-50 text-blue-700",
  reviewed: "bg-amber-50 text-amber-700",
  sent: "bg-green-50 text-green-700",
};

const copyToClipboard = async (text: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for non-secure contexts / older browsers without the Clipboard API.
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("new");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Reset the "Copied" state whenever a different submission is opened (or the modal closes).
    setCopied(false);
  }, [selected]);

  useEffect(() => {
    api
      .get("/api/submissions")
      .then((res) => setSubmissions(res.data.data))
      .catch(() => toast.error("Unable to load submissions"))
      .finally(() => setLoading(false));
  }, []);

  const changeStatus = async (id: string, status: string) => {
    const prev = submissions;
    setSubmissions((current) => current.map((s) => (s._id === id ? { ...s, status: status as Submission["status"] } : s)));

    try {
      await api.patch(`/api/submissions/${id}/status`, { status });
      toast.success("Status updated");
    } catch {
      setSubmissions(prev);
      toast.error("Unable to update status");
    }
  };

  const downloadFile = async (id: string, name: string) => {
    try {
      const response = await api.get(`/api/submissions/${id}/file`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Unable to download file");
    }
  };

  const saveProjectNumber = async (id: string, value: string) => {
    const current = submissions.find((s) => s._id === id);
    if (!current || (current.projectNumber || "") === value) return;

    const prev = submissions;
    setSubmissions((curr) => curr.map((s) => (s._id === id ? { ...s, projectNumber: value } : s)));

    try {
      await api.patch(`/api/submissions/${id}/project-number`, { projectNumber: value });
      toast.success("Project number saved");
    } catch {
      setSubmissions(prev);
      toast.error("Unable to save project number");
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!window.confirm("Delete this submission? This cannot be undone.")) return;

    const prev = submissions;
    setSubmissions((current) => current.filter((s) => s._id !== id));

    try {
      await api.delete(`/api/submissions/${id}`);
      toast.success("Submission deleted");
    } catch {
      setSubmissions(prev);
      toast.error("Unable to delete submission");
    }
  };

  const copyIncludedServices = async (submission: Submission) => {
    const included = editingServices.filter(
      (item) => !submission.editingServices || submission.editingServices.includes(item.key)
    );
    if (included.length === 0) return;

    const text = included.map((item) => `• ${item.label}`).join("\n");
    try {
      await copyToClipboard(text);
      setCopied(true);
      toast.success("Included services copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Unable to copy to clipboard");
    }
  };

  const countFor = (key: (typeof tabs)[number]["key"]) =>
    key === "all" ? submissions.length : submissions.filter((s) => s.status === key).length;

  const visible = activeTab === "all" ? submissions : submissions.filter((s) => s.status === activeTab);

  return (
    // h-full (not h-screen) because AdminLayout already pins the shell to
    // the viewport; overflow-hidden + the flex-col below means only the
    // table body scrolls, while the topbar and tabs stay put.
    <div className="flex h-full flex-col overflow-hidden">
      <Topbar title="Submissions" />

      <div className="flex min-h-0 flex-1 flex-col gap-6 p-8">
        <div className="flex shrink-0 items-center gap-2 border-b border-black/5">
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm ${
                  active ? "border-b-2 border-[#1B2430] font-semibold text-[#1B2430]" : "text-[#1B2430]/50 hover:text-[#1B2430]"
                }`}
              >
                {tab.label} ({countFor(tab.key)})
              </button>
            );
          })}
        </div>

        {loading ? (
          <p className="text-sm text-[#1B2430]/55">Loading...</p>
        ) : visible.length === 0 ? (
          <p className="text-sm text-[#1B2430]/55">No submissions here.</p>
        ) : (
          // min-h-0 lets this shrink inside the flex parent instead of
          // forcing the page to grow; overflow-auto scrolls both axes
          // (vertical for extra rows, horizontal for extra columns) inside
          // this box only.
          <div className="min-h-0 flex-1 overflow-auto rounded-2xl border border-black/5 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 border-b border-black/5 bg-white text-xs uppercase tracking-wide text-[#1B2430]/45">
                <tr>
                  <th className="px-4 py-3">File</th>
                  <th className="px-4 py-3">Project #</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Words</th>
                  <th className="px-4 py-3">Cost</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((s) => (
                  <tr key={s._id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3 text-[#1B2430]">{s.originalName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center rounded-lg border border-black/10 px-2 focus-within:border-[#C77D3D]">
                        <span className="text-sm text-[#1B2430]/50">AZ-</span>
                        <input
                          defaultValue={(s.projectNumber || "").replace(/^AZ-/, "")}
                          onBlur={(e) => saveProjectNumber(s._id, `AZ-${e.target.value}`)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.currentTarget.blur();
                          }}
                          className="w-20 bg-transparent py-1 pl-0.5 text-sm text-[#1B2430] outline-none"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#1B2430]/60">{s.email}</td>
                    <td className="px-4 py-3 text-[#1B2430]/60">{s.phone || "—"}</td>
                    <td className="px-4 py-3 capitalize text-[#1B2430]/60">{s.language}</td>
                    <td className="px-4 py-3 text-[#1B2430]/60">{serviceLabels[s.service]}</td>
                    <td className="px-4 py-3 text-[#1B2430]/60">{s.wordCount ? s.wordCount.toLocaleString() : "—"}</td>
                    <td className="px-4 py-3 text-[#1B2430]/60">
                      {s.requiresManualQuote ? (
                        <span className="text-[#C77D3D]">Manual quote</span>
                      ) : s.estimatedCost ? (
                        `$${s.estimatedCost.toFixed(2)}`
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#1B2430]/60">{formatDate(s.createdAt)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={s.status}
                        onChange={(e) => changeStatus(s._id, e.target.value)}
                        className="rounded-lg border border-black/10 bg-transparent px-2 py-1 text-sm"
                      >
                        <option value="new">New</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="sent">Sent</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setSelected(s)} className="text-[#1B2430]/40 hover:text-[#1B2430]">
                          <Eye size={16} strokeWidth={1.6} />
                        </button>
                        <button onClick={() => downloadFile(s._id, s.originalName)} className="text-[#C77D3D] hover:text-[#1B2430]">
                          <Download size={16} strokeWidth={1.6} />
                        </button>
                        <button onClick={() => deleteSubmission(s._id)} className="text-[#1B2430]/40 hover:text-red-600">
                          <Trash2 size={16} strokeWidth={1.6} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.originalName || "Submission"}>
        {selected && (
          <div className="space-y-5 text-sm text-[#1B2430]">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <div className="text-[#1B2430]/50">Project #</div>
                <div>{selected.projectNumber || "—"}</div>
              </div>
              <div>
                <div className="text-[#1B2430]/50">Status</div>
                <span
                  className={`mt-0.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[selected.status]}`}
                >
                  {selected.status}
                </span>
              </div>
              <div>
                <div className="text-[#1B2430]/50">Email</div>
                <div>{selected.email}</div>
              </div>
              <div>
                <div className="text-[#1B2430]/50">Phone</div>
                <div>{selected.phone || "—"}</div>
              </div>
              <div>
                <div className="text-[#1B2430]/50">Language</div>
                <div className="capitalize">{selected.language}</div>
              </div>
              <div>
                <div className="text-[#1B2430]/50">Service</div>
                <div>{serviceLabels[selected.service]}</div>
              </div>
              <div>
                <div className="text-[#1B2430]/50">Words</div>
                <div>{selected.wordCount ? selected.wordCount.toLocaleString() : "—"}</div>
              </div>
              <div>
                <div className="text-[#1B2430]/50">Cost</div>
                <div>
                  {selected.requiresManualQuote
                    ? "Manual quote"
                    : selected.estimatedCost
                    ? `$${selected.estimatedCost.toFixed(2)}`
                    : "—"}
                </div>
              </div>
              <div>
                <div className="text-[#1B2430]/50">Submitted</div>
                <div>{formatDate(selected.createdAt)}</div>
              </div>
            </div>

            {(() => {
              const included = editingServices.filter(
                (item) => !selected.editingServices || selected.editingServices.includes(item.key)
              );
              return (
                <div className="rounded-2xl border border-black/5 bg-[#FAFAF8] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[#1B2430]">Editing Services</div>
                      <div className="text-xs text-[#1B2430]/45">
                        {included.length} of {editingServices.length} included
                      </div>
                    </div>
                    <button
                      onClick={() => copyIncludedServices(selected)}
                      disabled={included.length === 0}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${
                        copied
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-black/10 bg-white text-[#1B2430] shadow-sm hover:border-[#C77D3D] hover:text-[#C77D3D] active:scale-95"
                      }`}
                    >
                      {copied ? <Check size={13} strokeWidth={2.6} /> : <Copy size={13} strokeWidth={2} />}
                      {copied ? "Copied" : "Copy included"}
                    </button>
                  </div>

                  <ul className="space-y-1">
                    {editingServices.map((item) => {
                      const isIncluded = !selected.editingServices || selected.editingServices.includes(item.key);
                      return (
                        <li
                          key={item.key}
                          className={`flex items-start gap-2.5 rounded-lg px-2.5 py-1.5 ${
                            isIncluded ? "bg-white shadow-sm shadow-black/[0.02]" : ""
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                              isIncluded ? "bg-green-100 text-green-600" : "bg-black/5 text-[#1B2430]/30"
                            }`}
                          >
                            {isIncluded ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
                          </span>
                          <span
                            className={`text-sm leading-snug ${
                              isIncluded ? "text-[#1B2430]" : "text-[#1B2430]/35 line-through"
                            }`}
                          >
                            {item.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })()}
          </div>
        )}
      </Modal>
    </div>
  );
}