import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { courseService } from "../services/course.service";
import { CreateCourseInput, UpdateCourseInput } from "../types/course.types";

export function useCourse() {
  const [loading, setLoading] = useState(false);

  const createCourse = async (input: CreateCourseInput, thumbnailFile: File | null) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication error: No user active.");

      let thumbnailUrl = input.thumbnail;
      if (thumbnailFile) {
        thumbnailUrl = await courseService.uploadThumbnail(thumbnailFile);
      }

      const newCourse = await courseService.createCourse(
        { ...input, thumbnail: thumbnailUrl },
        user.id
      );
      return newCourse;
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (courseId: string, updates: UpdateCourseInput, newFile: File | null) => {
    setLoading(true);
    try {
      let thumbnailUrl = updates.thumbnail;
      if (newFile) {
        thumbnailUrl = await courseService.uploadThumbnail(newFile);
      }

      const updated = await courseService.updateCourse(courseId, {
        ...updates,
        ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
      });
      return updated;
    } finally {
      setLoading(false);
    }
  };

  return { createCourse, updateCourse, loading };
}