"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import api from "../api";

export default function Topbar({ title }: { title: string }) {
  const router = useRouter();

  const logout = async () => {
    await api.post("/api/auth/logout");
    router.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-black/5 bg-white px-8">
      <h1 className="text-lg font-semibold text-[#1B2430]">{title}</h1>
      <button
        onClick={logout}
        className="flex items-center gap-2 text-sm font-medium text-[#1B2430]/55 hover:text-[#1B2430]"
      >
        <LogOut size={15} />
        Log out
      </button>
    </header>
  );
}