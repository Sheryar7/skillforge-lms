import { supabase } from "@/lib/supabase-client";
import { Course, CreateCourseInput, UpdateCourseInput } from "../types/course.types";

export const courseService = {
  /**
   * Fetches all courses from the database
   */
  async getAllCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Fetches courses belonging to a specific instructor
   */
  async getInstructorCourses(instructorId: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("instructor_id", instructorId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Creates a brand new course record
   */
  async getCourseById(courseId: string): Promise<Course> {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async createCourse(input: CreateCourseInput, instructorId: string): Promise<Course> {
    const payload: Record<string, unknown> = {
      title: input.title,
      description: input.description ?? null,
      price: input.price ?? 0,
      instructor_id: instructorId,
      thumbnail: input.thumbnail ?? null,
    };

    if (input.category) payload.category = input.category;
    if (input.level) payload.level = input.level;
    if (input.status) payload.status = input.status;
    if (input.published !== undefined) payload.published = input.published;

    const { data, error } = await supabase
      .from("courses")
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Updates an existing course entry by its ID
   */
  async updateCourse(courseId: string, updates: UpdateCourseInput): Promise<Course> {
    const payload: Record<string, unknown> = {
      ...updates,
      description: updates.description ?? null,
      thumbnail: updates.thumbnail ?? null,
    };

    const { data, error } = await supabase
      .from("courses")
      .update(payload)
      .eq("id", courseId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Handles uploading a file thumbnail to the course-images storage bucket
   */
  async uploadThumbnail(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("course-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("course-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};