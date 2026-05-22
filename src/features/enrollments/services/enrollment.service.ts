import { supabase } from "@/lib/supabase-client";
import { EnrollmentRequest, EnrollmentStatus } from "../types/enrollment.types";

export const enrollmentService = {
  /**
   * Fetches pending or processed enrollment entries belonging specifically to an instructor's courses
   */
  async getInstructorEnrollmentRequests(instructorId: string): Promise<EnrollmentRequest[]> {
    const { data, error } = await supabase
      .from("enrollment_requests")
      .select(`
        id,
        created_at,
        status,
        student_id,
        course_id,
        profiles:student_id (full_name, email),
        courses!inner (title, instructor_id)
      `)
      .eq("courses.instructor_id", instructorId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data as any) || [];
  },

  /**
   * Modifies the pending status flag of an enrollment request record
   */
  async updateRequestStatus(id: string, status: EnrollmentStatus): Promise<void> {
    const { error } = await supabase
      .from("enrollment_requests")
      .update({ status })
      .eq("id", id);

    if (error) throw new Error(error.message);
  },

  /**
   * Submits a fresh baseline registration enrollment application request row for a student
   */
  async submitEnrollmentRequest(studentId: string, courseId: string): Promise<void> {
    const { error } = await supabase
      .from("enrollment_requests")
      .insert({
        student_id: studentId,
        course_id: courseId,
        status: "pending"
      });

    if (error) throw new Error(error.message);
  }
};