"use client";

import { useState } from "react";
import { FolderPlus, Layers } from "lucide-react";
import toast from "react-hot-toast";

import Spinner from "@/shared/components/Spinner";
import EmptyState from "@/shared/components/EmptyState";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

import { useSections } from "../hooks/useSections";
import { createSectionAction } from "../actions/createSection";
import { Section } from "../types/section.types";
import SectionItem from "./SectionItem";

interface SectionListProps {
  courseId: string;
  isInstructor?: boolean;
  sections?: Section[];
  onSectionsRefresh?: () => void;
}

export default function SectionList({ courseId, isInstructor = true, sections: externalSections, onSectionsRefresh }: SectionListProps) {
  const { sections: fetchedSections, loading, error, refresh } = useSections(courseId, !externalSections);
  const sections = externalSections ?? fetchedSections;
  const sectionRefresh = onSectionsRefresh ?? refresh;
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    setCreating(true);

    try {
      const result = await createSectionAction({
        course_id: courseId,
        title: newSectionTitle,
      });

      if (!result.success) throw new Error(result.error);

      toast.success("New chapter block published!");
      setNewSectionTitle("");
      sectionRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to create section mapping.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner />
        <p className="text-xs font-bold text-slate-400 mt-2">Loading curriculum mapping framework...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-sm font-bold text-red-500 p-4">{error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Structural Addition form wrapper field exclusively for course authors */}
      {isInstructor && (
        <form onSubmit={handleCreateSection} className="bg-white border-2 border-dashed border-slate-200 p-6 rounded-[2.5rem] flex items-center gap-4 transition-all focus-within:border-violet-400 focus-within:bg-violet-50/5">
          <div className="flex-1">
            <Input
              required
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="e.g. Chapter 1: Foundations of JavaScript"
              disabled={creating}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            isLoading={creating}
            className="px-6 py-4 text-sm rounded-2xl shadow-lg shadow-violet-100 flex items-center gap-2"
          >
            {!creating && <FolderPlus size={16} />}
            <span>Add Chapter</span>
          </Button>
        </form>
      )}

      {/* Chapters Output stack */}
      {sections.length === 0 ? (
        <div className="py-16 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
          <EmptyState
            title="Curriculum is empty"
            description="Create your first chapter block mapping module up above."
            icon={Layers}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <SectionItem 
              key={section.id} 
              section={section} 
              onRefresh={sectionRefresh} 
              isInstructor={isInstructor} 
            />
          ))}
        </div>
      )}
    </div>
  );
}