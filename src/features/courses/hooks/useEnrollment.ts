"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import toast from "react-hot-toast";

export function useEnrollment() {
  const [loading, setLoading] = useState(false);

  // 1. Submit a brand new enrollment request (Student action)
  const requestToJoin = async (courseId: string, instructorId: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to request access.");

      const { error } = await supabase
        .from("enrollment_requests")
        .insert({
          student_id: user.id,
          course_id: courseId,
          instructor_id: instructorId,
          status: "pending"
        });

      if (error) throw error;
      toast.success("Enrollment request submitted for review!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 2. Accept or Reject a request (Instructor action)
  const updateRequestStatus = async (requestId: string, newStatus: "accepted" | "rejected") => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("enrollment_requests")
        .update({ status: newStatus })
        .eq("id", requestId);

      if (error) throw error;
      toast.success(`Request successfully ${newStatus}!`);
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to update request status.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    requestToJoin,
    updateRequestStatus,
    loading
  };
}