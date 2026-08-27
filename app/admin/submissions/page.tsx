"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import api from "@/components/lib/api";
import Topbar from "@/components/lib/admin/Topbar";

type Submission = {
  _id: string;
  originalName: string;
  email: string;
  language: "english" | "hebrew";
  service: "heavyEditing" | "midLevel" | "proofreading";
  wordCount: number | null;
  estimatedCost: number | null;
  requiresManualQuote: boolean;
  status: "new" | "reviewed" | "sent";
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

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("new");
  const [loading, setLoading] = useState(true);

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
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Words</th>
                  <th className="px-4 py-3">Cost</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((s) => (
                  <tr key={s._id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3 text-[#1B2430]">{s.originalName}</td>
                    <td className="px-4 py-3 text-[#1B2430]/60">{s.email}</td>
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
                      <button onClick={() => downloadFile(s._id, s.originalName)} className="text-[#C77D3D] hover:text-[#1B2430]">
                        <Download size={16} strokeWidth={1.6} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}