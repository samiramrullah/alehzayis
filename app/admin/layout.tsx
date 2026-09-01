"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/lib/admin/Sidebar";
import api from "@/components/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => {
        if (res.data.data.role !== "admin") {
          router.push("/login");
          return;
        }
        setChecked(true);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (!checked) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#EEF0F3]">
      <Sidebar />
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}