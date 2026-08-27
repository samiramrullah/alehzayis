// "use client";

// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { Download } from "lucide-react";
// import api from "./lib/api";

// type Submission = {
//   _id: string;
//   originalName: string;
//   user: { name: string; email: string };
//   language: "english" | "hebrew";
//   service: "heavyEditing" | "midLevel" | "proofreading";
//   wordCount: number;
//   estimatedCost: number;
//   status: "new" | "reviewed" | "sent";
// };

// const tabs = [
//   { key: "new", label: "New" },
//   { key: "reviewed", label: "Reviewed" },
//   { key: "sent", label: "Sent" },
//   { key: "all", label: "Show All" },
// ] as const;

// const serviceLabels: Record<string, string> = {
//   heavyEditing: "Heavy Editing",
//   midLevel: "Mid-Level",
//   proofreading: "Proofreading",
// };

// export default function SubmissionsPage() {
//   const [submissions, setSubmissions] = useState<Submission[]>([]);
//   const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("new");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api
//       .get("/api/submissions")
//       .then((res) => setSubmissions(res.data.data))
//       .catch(() => toast.error("Unable to load submissions"))
//       .finally(() => setLoading(false));
//   }, []);

//   const changeStatus = async (id: string, status: string) => {
//     const prev = submissions;
//     setSubmissions((current) => current.map((s) => (s._id === id ? { ...s, status: status as Submission["status"] } : s)));

//     try {
//       await api.patch(`/api/submissions/${id}/status`, { status });
//       toast.success("Status updated");
//     } catch {
//       setSubmissions(prev);
//       toast.error("Unable to update status");
//     }
//   };

//   const downloadFile = async (id: string, name: string) => {
//     try {
//       const response = await api.get(`/api/submissions/${id}/file`, { responseType: "blob" });
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = name;
//       link.click();
//       window.URL.revokeObjectURL(url);
//     } catch {
//       toast.error("Unable to download file");
//     }
//   };

//   const countFor = (key: (typeof tabs)[number]["key"]) =>
//     key === "all" ? submissions.length : submissions.filter((s) => s.status === key).length;

//   const visible = activeTab === "all" ? submissions : submissions.filter((s) => s.status === activeTab);

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="font-display text-3xl text-[#3A101A]">Submissions</h1>
//         <p className="mt-1 font-body text-sm text-[#66575A]">Review and manage uploaded manuscripts.</p>
//       </div>

//       <div className="flex items-center gap-2 border-b border-[#4A1521]/10">
//         {tabs.map((tab) => {
//           const active = activeTab === tab.key;
//           const isAll = tab.key === "all";
//           return (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               className={`px-4 py-2.5 font-body text-sm ${
//                 isAll
//                   ? `ml-2 rounded-sm border ${active ? "border-[#4A1521] text-[#4A1521]" : "border-[#4A1521]/20 text-[#4A1521]/70 hover:border-[#4A1521]/50"}`
//                   : active
//                     ? "border-b-2 border-[#4A1521] font-semibold text-[#4A1521]"
//                     : "text-[#8B7B7E] hover:text-[#4A1521]"
//               }`}
//             >
//               {tab.label} ({countFor(tab.key)})
//             </button>
//           );
//         })}
//       </div>

//       {loading ? (
//         <p className="font-body text-sm text-[#66575A]">Loading...</p>
//       ) : visible.length === 0 ? (
//         <p className="font-body text-sm text-[#66575A]">No submissions here.</p>
//       ) : (
//         <div className="overflow-x-auto rounded-sm border border-[#4A1521]/10 bg-white">
//           <table className="w-full text-left font-body text-sm">
//             <thead className="border-b border-[#4A1521]/10 text-xs uppercase tracking-wide text-[#8B6816]">
//               <tr>
//                 <th className="px-4 py-3">File</th>
//                 <th className="px-4 py-3">User</th>
//                 <th className="px-4 py-3">Language</th>
//                 <th className="px-4 py-3">Service</th>
//                 <th className="px-4 py-3">Words</th>
//                 <th className="px-4 py-3">Cost</th>
//                 <th className="px-4 py-3">Status</th>
//                 <th className="px-4 py-3"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {visible.map((s) => (
//                 <tr key={s._id} className="border-b border-[#4A1521]/5 last:border-0">
//                   <td className="px-4 py-3 text-[#3A101A]">{s.originalName}</td>
//                   <td className="px-4 py-3 text-[#66575A]">{s.user?.name}</td>
//                   <td className="px-4 py-3 capitalize text-[#66575A]">{s.language}</td>
//                   <td className="px-4 py-3 text-[#66575A]">{serviceLabels[s.service]}</td>
//                   <td className="px-4 py-3 text-[#66575A]">{s.wordCount.toLocaleString()}</td>
//                   <td className="px-4 py-3 text-[#66575A]">${s.estimatedCost.toFixed(2)}</td>
//                   <td className="px-4 py-3">
//                     <select
//                       value={s.status}
//                       onChange={(e) => changeStatus(s._id, e.target.value)}
//                       className="rounded-sm border border-[#4A1521]/20 bg-transparent px-2 py-1 text-sm"
//                     >
//                       <option value="new">New</option>
//                       <option value="reviewed">Reviewed</option>
//                       <option value="sent">Sent</option>
//                     </select>
//                   </td>
//                   <td className="px-4 py-3">
//                     <button onClick={() => downloadFile(s._id, s.originalName)} className="text-[#8B6816] hover:text-[#4A1521]">
//                       <Download size={16} strokeWidth={1.6} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

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