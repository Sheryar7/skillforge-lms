import { supabase } from "@/lib/supabase-client";
import { Lesson, CreateLessonInput, UpdateLessonInput } from "../types/lesson.types";

export const lessonService = {
  /**
   * Fetches all lessons belonging to a specific section, ordered by position
   */
  async getLessonsBySection(sectionId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("section_id", sectionId)
      .order("position", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    const { data: sections, error: sectionsError } = await supabase
      .from("sections")
      .select("id")
      .eq("course_id", courseId)
      .order("created_at", { ascending: true });

    if (sectionsError) throw new Error(sectionsError.message);

    const sectionIds = (sections || []).map((section) => section.id).filter(Boolean);

    if (sectionIds.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .in("section_id", sectionIds)
      .order("position", { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []).map((lesson) => ({ ...lesson, course_id: courseId }));
  },

  /**
   * Adds a brand new lesson entry into a section channel
   */
  async createLesson(input: CreateLessonInput): Promise<Lesson> {
    // If no explicit position is assigned, evaluate the auto-increment placement
    let finalPosition = input.position;
    if (finalPosition === undefined) {
      const existing = await this.getLessonsBySection(input.section_id);
      finalPosition = existing.length + 1;
    }

    const { data, error } = await supabase
      .from("lessons")
      .insert({
        section_id: input.section_id,
        title: input.title,
        description: input.description || null,
        video_url: input.video_url || null,
        duration: input.duration || null,
        position: finalPosition,
        is_preview: input.is_preview || false,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Modifies configuration fields inside a lesson entry
   */
  async updateLesson(lessonId: string, updates: UpdateLessonInput): Promise<Lesson> {
    const payload = {
      ...updates,
      description: updates.description ?? null,
      video_url: updates.video_url ?? null,
      duration: updates.duration ?? null,
    };

    const { data, error } = await supabase
      .from("lessons")
      .update(payload)
      .eq("id", lessonId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Reorders lessons inside a section by swapping the current lesson with a neighbor
   */
  async reorderLesson(sectionId: string, lessonId: string, direction: "up" | "down"): Promise<Lesson[]> {
    const lessons = await this.getLessonsBySection(sectionId);
    const index = lessons.findIndex((lesson) => lesson.id === lessonId);
    if (index === -1) return lessons;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= lessons.length) return lessons;

    const updated = [...lessons];
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    const normalized = updated.map((lesson, idx) => ({ id: lesson.id, position: idx + 1 }));

    const { error } = await supabase.from("lessons").upsert(normalized);
    if (error) throw new Error(error.message);

    return updated.map((lesson, index) => ({ ...lesson, position: index + 1 }));
  },

  /**
   * Deletes a lesson completely from the row logs
   */
  async deleteLesson(lessonId: string): Promise<void> {
    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", lessonId);

    if (error) throw new Error(error.message);
  }
};
