import { supabase } from "@/lib/supabase-client";

export interface EnrollmentRequest {
  id: string;
  student_id: string;
  course_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  instructor_id: string;
  profiles?: {
    id: string;
    email: string;
    full_name?: string;
  };
  student?: {
    id: string;
    email: string;
    full_name?: string;
  };
  courses?: {
    id: string;
    title: string;
  };
}

export const enrollmentService = {
  /**
   * Fetch pending requests for the instructor using clean, native joins
   */
  getPendingRequests: async (instructorId: string): Promise<EnrollmentRequest[]> => {
    const { data, error } = await supabase
      .from("enrollment_requests")
      .select("id, student_id, course_id, status, created_at, instructor_id")
      .eq("instructor_id", instructorId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching pending requests:", error);
      throw error;
    }

    const requests = (data as any[]) || [];
    const studentIds = Array.from(new Set(requests.map((req) => req.student_id).filter(Boolean)));
    const courseIds = Array.from(new Set(requests.map((req) => req.course_id).filter(Boolean)));

    const emptyResult = { data: [] as any[], error: null };

    const [profilesResult, coursesResult] = await Promise.all([
      studentIds.length
        ? supabase.from("profiles").select("id, email, full_name").in("id", studentIds)
        : Promise.resolve(emptyResult),
      courseIds.length
        ? supabase.from("courses").select("id, title").in("id", courseIds)
        : Promise.resolve(emptyResult),
    ]);

    if (profilesResult.error) {
      console.error("Error fetching students for pending requests:", profilesResult.error);
      throw profilesResult.error;
    }

    if (coursesResult.error) {
      console.error("Error fetching courses for pending requests:", coursesResult.error);
      throw coursesResult.error;
    }

    const profileMap = Object.fromEntries(
      (profilesResult.data || []).map((profile: any) => [profile.id, profile])
    );
    const courseMap = Object.fromEntries(
      (coursesResult.data || []).map((course: any) => [course.id, course])
    );

    return requests.map((request) => ({
      ...request,
      profiles: profileMap[request.student_id],
      courses: courseMap[request.course_id],
    }));
  },

  /**
   * Evaluates admission paths, toggles status, and bridges records upon approval
   */
  handleRequestDecision: async (
    request: EnrollmentRequest,
    decision: "approved" | "rejected"
  ) => {
    const { error: updateError } = await supabase
      .from("enrollment_requests")
      .update({ status: decision })
      .eq("id", request.id);

    if (updateError) throw updateError;

    if (decision === "approved") {
      const { error: enrollError } = await supabase
        .from("enrollments")
        .insert([
          {
            user_id: request.student_id,
            course_id: request.course_id,
          },
        ]);

      if (enrollError) throw enrollError;
    }

    return true;
  },

  /**
   * Fetch active students who are officially enrolled using explicit queries instead of relationship metadata
   */
  getActiveStudents: async (instructorId: string) => {
    const { data: instructorCourses, error: coursesError } = await supabase
      .from("courses")
      .select("id, title, instructor_id")
      .eq("instructor_id", instructorId);

    if (coursesError) {
      console.error("Error fetching instructor courses:", coursesError);
      throw coursesError;
    }

    const courseIds = Array.from(new Set((instructorCourses as any[] || []).map((course) => course.id)));

    if (courseIds.length === 0) {
      return [];
    }

    const { data: enrollments, error: enrollmentsError } = await supabase
      .from("enrollments")
      .select("id, user_id, course_id, created_at")
      .in("course_id", courseIds);

    if (enrollmentsError) {
      console.error("Error fetching enrollments:", enrollmentsError);
      throw enrollmentsError;
    }

    const userIds = Array.from(new Set((enrollments as any[] || []).map((enrollment) => enrollment.user_id).filter(Boolean)));

    let profilesResult: any[] = [];
    let profilesError: any = null;

    if (userIds.length) {
      const profilesQuery = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", userIds);

      profilesResult = profilesQuery.data || [];
      profilesError = profilesQuery.error;
    }

    if (profilesError) {
      console.error("Error fetching student profiles for active enrollments:", profilesError);
      throw profilesError;
    }

    const profileMap = Object.fromEntries(
      profilesResult.map((profile: any) => [profile.id, profile])
    );
    const courseMap = Object.fromEntries(
      (instructorCourses as any[] || []).map((course) => [course.id, course])
    );

    return (enrollments as any[] || []).map((enrollment) => ({
      ...enrollment,
      profiles: profileMap[enrollment.user_id],
      courses: courseMap[enrollment.course_id],
    }));
  },
};