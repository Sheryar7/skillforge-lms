import { z } from "zod";

// Course validation schema
export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").max(100),
  description: z.string().min(10, "Description must be at least 10 characters long").optional().or(z.literal("")),
});

// Section/Chapter validation schema
export const sectionSchema = z.object({
  course_id: z.string().uuid("Invalid course mapping reference"),
  title: z.string().min(2, "Chapter title must be at least 2 characters long").max(80),
});

// Lesson validation schema
export const lessonSchema = z.object({
  title: z.string().min(2, "Lesson title must be at least 2 characters long").max(100),
  is_preview: z.boolean().default(false),
  video_url: z.string().url("Please provide a valid asset URL").nullable().optional(),
});

// TypeScript type inference representations
export type CourseInput = z.infer<typeof courseSchema>;
export type SectionInput = z.infer<typeof sectionSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;