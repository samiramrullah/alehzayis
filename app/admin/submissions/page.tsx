"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Download, Trash2, Eye, Check, X, Copy, FileDown } from "lucide-react";
import api from "@/components/lib/api";
import Topbar from "@/components/lib/admin/Topbar";
import Modal from "@/components/lib/admin/Model";
import * as XLSX from "xlsx";

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
  { key: "all", label: "All" },
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

const isServiceIncluded = (submission: Submission, key: string) =>
  !submission.editingServices || submission.editingServices.includes(key);

const toFilename = (value: string) =>
  value.replace(/[^a-z0-9-_]+/gi, "_").replace(/^_+|_+$/g, "").slice(0, 60) || "submission";

const costLabel = (submission: Submission) =>
  submission.requiresManualQuote
    ? "Manual quote"
    : submission.estimatedCost
    ? `$${submission.estimatedCost.toFixed(2)}`
    : "—";

const downloadWorkbook = (
  sheetName: string,
  rows: (string | number)[][],
  columnWidths: number[],
  filename: string
) => {
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet["!cols"] = columnWidths.map((wch) => ({ wch }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  XLSX.writeFile(workbook, filename);
};

const exportEntireSubmission = (submission: Submission) => {
  const rows: (string | number)[][] = [
    ["Field", "Value"],
    ["File", submission.originalName],
    ["Project #", submission.projectNumber || "—"],
    ["Status", submission.status],
    ["Email", submission.email],
    ["Phone", submission.phone || "—"],
    ["Language", submission.language],
    ["Service", serviceLabels[submission.service]],
    ["Words", submission.wordCount ? submission.wordCount.toLocaleString() : "—"],
    ["Cost", costLabel(submission)],
    ["Submitted", formatDate(submission.createdAt)],
    [],
    ["Editing Service", "Included"],
    ...editingServices.map((item) => [item.label, isServiceIncluded(submission, item.key) ? "Yes" : "No"]),
  ];
  downloadWorkbook("Submission", rows, [45, 22], `${toFilename(submission.projectNumber || submission.originalName)}.xlsx`);
};

const exportEditingServices = (submission: Submission, onlySelected: boolean) => {
  const rows = editingServices
    .map((item) => ({ label: item.label, included: isServiceIncluded(submission, item.key) }))
    .filter((item) => (onlySelected ? item.included : true));
  downloadWorkbook(
    "Editing Services",
    [["Editing Service", "Included"], ...rows.map((row) => [row.label, row.included ? "Yes" : "No"])],
    [45, 12],
    `${toFilename(submission.projectNumber || submission.originalName)}-${onlySelected ? "selected-services" : "all-services"}.xlsx`
  );
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("new");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [copied, setCopied] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .get("/api/submissions")
      .then((res) => setSubmissions(res.data.data))
      .catch(() => toast.error("Unable to load submissions"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCopied(false);
    setExportOpen(false);
  }, [selected]);

  useEffect(() => {
    if (!exportOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [exportOpen]);

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

  const copyEditingServices = async (submission: Submission) => {
    const text = editingServices
      .map((item) => `${isServiceIncluded(submission, item.key) ? "✓" : "✗"} ${item.label}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Unable to copy to clipboard");
    }
  };

  const countFor = (key: (typeof tabs)[number]["key"]) =>
    key === "all" ? submissions.length : submissions.filter((s) => s.status === key).length;

  const visible = activeTab === "all" ? submissions : submissions.filter((s) => s.status === activeTab);

  return (
    <>
      <Topbar title="Submissions" />

      <div className="space-y-6 p-8">
        <div className="flex items-center gap-2 border-b border-black/5">
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
          <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-[#1B2430]/45">
                <tr>
                  <th className="px-4 py-3">File</th>
                  <th className="px-4 py-3">Project #</th>
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
            <div className="flex items-center justify-end gap-2">
              <div ref={exportRef} className="relative">
                <button
                  type="button"
                  onClick={() => setExportOpen((open) => !open)}
                  className="flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 text-sm text-[#1B2430] hover:bg-black/[0.03]"
                >
                  <FileDown size={14} strokeWidth={1.8} />
                  Export
                </button>
                {exportOpen && (
                  <div className="absolute right-0 z-10 mt-1.5 w-64 overflow-hidden rounded-lg border border-black/10 bg-white shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        exportEntireSubmission(selected);
                        setExportOpen(false);
                      }}
                      className="block w-full px-3.5 py-2.5 text-left text-sm text-[#1B2430] hover:bg-black/[0.03]"
                    >
                      Export Entire Submission
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        exportEditingServices(selected, false);
                        setExportOpen(false);
                      }}
                      className="block w-full border-t border-black/5 px-3.5 py-2.5 text-left text-sm text-[#1B2430] hover:bg-black/[0.03]"
                    >
                      Export All Editing Services
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        exportEditingServices(selected, true);
                        setExportOpen(false);
                      }}
                      className="block w-full border-t border-black/5 px-3.5 py-2.5 text-left text-sm text-[#1B2430] hover:bg-black/[0.03]"
                    >
                      Export Selected Editing Services
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <div className="text-[#1B2430]/50">Project #</div>
                <div>{selected.projectNumber || "—"}</div>
              </div>
              <div>
                <div className="text-[#1B2430]/50">Status</div>
                <div className="capitalize">{selected.status}</div>
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

            <div>
              <div className="mb-2 flex items-center justify-between text-[#1B2430]/50">
                <span>Editing Services</span>
                <button
                  type="button"
                  onClick={() => copyEditingServices(selected)}
                  className="flex items-center gap-1 text-xs font-medium text-[#C77D3D] hover:text-[#1B2430]"
                >
                  <Copy size={13} strokeWidth={1.8} />
                  {copied ? "Copied" : "Copy services"}
                </button>
              </div>
              <ul className="space-y-1.5">
                {editingServices.map((item) => {
                  const included = isServiceIncluded(selected, item.key);
                  return (
                    <li key={item.key} className="flex items-center gap-2">
                      {included ? (
                        <Check size={14} strokeWidth={2} className="shrink-0 text-green-600" />
                      ) : (
                        <X size={14} strokeWidth={2} className="shrink-0 text-red-500" />
                      )}
                      <span className={included ? "" : "text-[#1B2430]/40 line-through"}>{item.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}