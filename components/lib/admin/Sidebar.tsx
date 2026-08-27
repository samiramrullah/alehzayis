"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";
import { navItems } from "./nav-items";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col bg-[#1B2430] text-[#FAF7F1]">
      <div className="flex items-center gap-2 px-6 py-6">
        <FileText size={18} className="text-[#C77D3D]" />
        <span className="text-sm font-semibold tracking-[0.15em] uppercase">Quoteline</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-[#C77D3D] text-[#1B2430]" : "text-[#FAF7F1]/60 hover:bg-white/5 hover:text-[#FAF7F1]"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}