"use client";

import { useEffect, useState } from "react";
import { Edit3, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import { createSectionAction } from "../actions/createSection";
import { updateSectionAction } from "../actions/updateSection";
import { Section } from "../types/section.types";

interface SectionEditorModalProps {
  courseId: string;
  section?: Section;
  onSaved?: () => void;
  triggerLabel?: string;
}

export default function SectionEditorModal({
  courseId,
  section,
  onSaved,
  triggerLabel,
}: SectionEditorModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(section?.title || "");

  useEffect(() => {
    if (section) {
      setTitle(section.title);
    }
  }, [section]);

  const isEditMode = Boolean(section?.id);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please add a chapter title.");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        const result = await updateSectionAction(section!.id, { title: title.trim() });
        if (!result.success) throw new Error(result.error);
        toast.success("Chapter title updated.");
      } else {
        const result = await createSectionAction({
          course_id: courseId,
          title: title.trim(),
        });
        if (!result.success) throw new Error(result.error);
        toast.success("New chapter block created.");
      }

      setIsOpen(false);
      if (onSaved) onSaved();
    } catch (err: any) {
      toast.error(err.message || "Unable to save chapter details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant={isEditMode ? "secondary" : "primary"}
        onClick={() => setIsOpen(true)}
        className="p-2 min-w-[108px] rounded-xl"
      >
        {isEditMode ? <Edit3 size={14} /> : <Plus size={14} />}
        <span className="ml-2 text-xs font-black uppercase tracking-[0.28em]">
          {triggerLabel ?? (isEditMode ? "Rename" : "New chapter")}
        </span>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={isEditMode ? "Rename chapter" : "Add section"}
      >
        <form onSubmit={handleSave} className="space-y-6">
          <Input
            label="Chapter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Module 1: Core curriculum"
            disabled={loading}
            required
          />

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)} disabled={loading}>
              <X size={14} /> Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              {isEditMode ? "Save chapter" : "Create chapter"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
