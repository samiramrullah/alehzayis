"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl shadow-black/10 ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1B2430]">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#1B2430]/50 transition-colors hover:bg-black/5 hover:text-[#1B2430]"
          >
            <X size={18} strokeWidth={1.6} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}