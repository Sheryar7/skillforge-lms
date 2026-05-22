import { supabase } from "@/lib/supabase-client";
import { Section, CreateSectionInput, UpdateSectionInput } from "../types/section.types";

export const sectionService = {
  /**
   * Fetches all structural section modules belonging to a specific course ID ordered by position
   */
  async getSectionsByCourse(courseId: string): Promise<Section[]> {
    const { data, error } = await supabase
      .from("sections")
      .select("*")
      .eq("course_id", courseId)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []).map((section, index) => ({
      ...section,
      position: section.position ?? index + 1,
    }));
  },

  /**
   * Generates a fresh parent chapter block layout row inside a course track
   */
  async createSection(input: CreateSectionInput): Promise<Section> {
    let finalPosition = input.position;
    
    if (finalPosition === undefined) {
      const existing = await this.getSectionsByCourse(input.course_id);
      finalPosition = existing.length + 1;
    }

    const { data, error } = await supabase
      .from("sections")
      .insert({
        course_id: input.course_id,
        title: input.title,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      ...data,
      position: finalPosition,
    };
  },

  /**
   * Modifies tracking label definitions or positioning indexes
   */
  async updateSection(sectionId: string, updates: UpdateSectionInput): Promise<Section> {
    const safeUpdates = { ...updates };
    delete safeUpdates.position;

    const { data, error } = await supabase
      .from("sections")
      .update(safeUpdates)
      .eq("id", sectionId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Reorders sections inside a course by swapping the current section with its neighbor.
   */
  async reorderSection(courseId: string, sectionId: string, direction: "up" | "down"): Promise<Section[]> {
    const sections = await this.getSectionsByCourse(courseId);
    const index = sections.findIndex((section) => section.id === sectionId);
    if (index === -1) return sections;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return sections;

    const updated = [...sections];
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    return updated.map((section, position) => ({ ...section, position: position + 1 }));
  },

  /**
   * Deletes a section entry cleanly from the core layout tree
   */
  async deleteSection(sectionId: string): Promise<void> {
    const { error } = await supabase
      .from("sections")
      .delete()
      .eq("id", sectionId);

    if (error) throw new Error(error.message);
  }
};
