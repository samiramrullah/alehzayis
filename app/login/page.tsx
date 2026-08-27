"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import api from "@/components/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/auth/login", { email: email.trim(), password });

      if (response.data.data.mustChangePassword) {
        router.push("/change-password");
        return;
      }

      router.push("/admin/submissions");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EEF0F3] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <FileText size={20} className="text-[#C77D3D]" />
          <span className="text-sm font-semibold tracking-[0.15em] uppercase text-[#1B2430]">Quoteline</span>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)] sm:p-7">
          <h1 className="mb-1 text-xl font-semibold text-[#1B2430]">Admin Login</h1>
          <p className="mb-6 text-sm text-[#1B2430]/55">Sign in to manage submissions and pricing.</p>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#1B2430]/60">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                placeholder="you@example.com"
                className="h-11 w-full rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-[#C77D3D]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#1B2430]/60">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-[#C77D3D]"
              />
            </div>

            <button
              onClick={onSubmit}
              disabled={loading}
              className="flex h-11 w-full items-center justify-center rounded-full bg-[#1B2430] text-sm font-semibold text-[#FAF7F1] transition-colors hover:bg-[#2A374B] disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#1B2430]/45">
          <Link href="/" className="hover:text-[#1B2430]">
            Back to homepage
          </Link>
        </p>
      </div>
    </main>
  );
}