"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddCourse from "./AddCourse";
import { Modal } from "@/shared/ui/modal";

interface CreateCourseModalProps {
  onCourseCreated?: () => void;
}

export default function CreateCourseModal({ onCourseCreated }: CreateCourseModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Dashed Button Blueprint Shell is isolated uniquely directly here */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-12 border-4 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-violet-600 hover:border-violet-400 hover:bg-violet-50/30 transition-all group"
      >
        <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:shadow-md border border-slate-100 transition-all">
          <Plus size={32} />
        </div>
        <div className="text-center">
          <span className="font-black text-xl tracking-tight text-slate-800 block">Open Course Builder Matrix</span>
          <span className="text-xs text-slate-400 font-medium tracking-wide mt-0.5 block">Configure new curriculum channels for student modules</span>
        </div>
      </button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="Create New Course Blueprint" 
      >
        <div className="w-full max-w-5xl mx-auto p-2">
          <AddCourse 
            onSuccess={() => {
              setIsOpen(false);
              if (onCourseCreated) onCourseCreated();
            }} 
          />
        </div>
      </Modal>
    </div>
  );
}