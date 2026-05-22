"use client";

import * as React from "react";
import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-[3rem] p-8 border-2 border-slate-100 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-slate-600 bg-slate-50 border border-slate-100 rounded-xl transition-all"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}